import { prisma } from '../../lib/prisma.js';
import config from '../../config.js';
import generateScenesWithOpenAI from './openai.js';
import generateScenesWithGemini from './gemini.js';
import generateScenesWithAnthropic from './anthropic.js';

export type GeneratedScene = {
  title: string;
  script: string;
  durationSeconds: number;
  mediaHints?: Record<string, any>;
};

export async function generateScenes(provider: string | undefined, topic: string, options: any = {}, userId?: string) {
  const chosen = provider || config.aiDefaultProvider || 'openai';

  // Persist AiRequest record when possible (non-blocking)
  let requestRecord: any = null;
  try {
    requestRecord = await prisma.aiRequest.create({
      data: {
        userId: userId || null,
        provider: chosen,
        prompt: topic,
        options: options || {},
        status: 'started',
      },
    });
  } catch (e) {
    // If DB isn't ready, continue without persistence
    console.warn('AiRequest persistence failed:', e);
  }

  let scenes: GeneratedScene[];
  try {
    switch (chosen) {
      case 'openai':
        scenes = await generateScenesWithOpenAI(topic, options);
        break;
      case 'gemini':
        scenes = await generateScenesWithGemini(topic, options);
        break;
      case 'anthropic':
        scenes = await generateScenesWithAnthropic(topic, options);
        break;
      case 'auto':
      default:
        // Try a primary provider then fallbacks
        try {
          scenes = await generateScenesWithOpenAI(topic, options);
        } catch (e) {
          try {
            scenes = await generateScenesWithGemini(topic, options);
          } catch (e2) {
            scenes = await generateScenesWithAnthropic(topic, options);
          }
        }
    }

    // Update persistence
    if (requestRecord) {
      try {
        await prisma.aiRequest.update({ where: { id: requestRecord.id }, data: { status: 'completed', result: scenes as any } });
      } catch (e) {
        console.warn('Failed to update AiRequest:', e);
      }
    }

    return scenes;
  } catch (err) {
    if (requestRecord) {
      try {
        await prisma.aiRequest.update({ where: { id: requestRecord.id }, data: { status: 'failed' } });
      } catch (e) {
        console.warn('Failed to update AiRequest status:', e);
      }
    }
    throw err;
  }
}

export default generateScenes;
