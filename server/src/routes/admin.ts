import { Router } from 'express';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';
import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { HttpStatus } from '../utils/errors.js';

const router = Router();

router.use(authMiddleware);

router.get('/ai-requests', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await prisma.aiRequest.findMany({ orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, email: true } } } });
    res.status(HttpStatus.OK).json(items);
  } catch (e) {
    console.error('Failed to fetch ai requests', e);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch ai requests' });
  }
});

export default router;
