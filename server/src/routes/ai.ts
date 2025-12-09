import { Router } from 'express';
import { generateScenes } from '../services/ai/index.js';
import { aiQueue } from '../services/queue.js';
import { prisma } from '../lib/prisma.js';
import config from '../config.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { Response } from 'express';
import { HttpStatus } from '../utils/errors.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate-scenes', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, provider, options } = req.body;

    if (!topic) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Topic is required',
      });
    }

    const userId = req.userId;
    // If caller requested async processing, enqueue job
    if (options?.async) {
      // Create aiRequest record via orchestrator (generateScenes will create a record if possible)
      const record = await prisma.aiRequest.create({ data: { userId: userId || null, provider: provider || undefined || config.aiDefaultProvider, prompt: topic, options: options || {}, status: 'queued' } });
      await aiQueue.add('generate', { provider, topic, options, userId, requestId: record.id });
      return res.status(HttpStatus.ACCEPTED).json({ requestId: record.id, status: 'queued' });
    }

    const scenes = await generateScenes(provider, topic, options || {}, userId);

    res.status(HttpStatus.OK).json({
      provider: provider || undefined,
      scenes,
      count: Array.isArray(scenes) ? scenes.length : 0,
    });
  } catch (error: any) {
    console.error('AI generation error:', error?.message || error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to generate scenes',
      details: error?.message || undefined,
    });
  }
});

export default router;
