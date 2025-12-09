import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import config from '../config.js';
import { prisma } from '../lib/prisma.js';

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export const aiQueue = new Queue('ai-generation', { connection });

// Simple worker to process AI jobs (generate scenes) and persist results
export const aiWorker = new Worker('ai-generation', async (job: Job) => {
  const { provider, topic, options, userId } = job.data;
  // For now, delegate to orchestrator dynamically to avoid circular import in top-level
  const { generateScenes } = await import('./ai/index.js');
  try {
    const scenes = await generateScenes(provider, topic, options, userId);
    // Update request record in DB if job has requestId
    if (job.data.requestId) {
      await prisma.aiRequest.update({ where: { id: job.data.requestId }, data: { status: 'completed', result: scenes } });
    }
    return scenes;
  } catch (e) {
    if (job.data.requestId) {
      await prisma.aiRequest.update({ where: { id: job.data.requestId }, data: { status: 'failed' } });
    }
    throw e;
  }
}, { connection });

export default aiQueue;
