import { Router } from 'express';
import {
  listScenes,
  addScene,
  updateScene,
  deleteScene,
  reorderScenes,
} from '../controllers/sceneController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/:projectId/scenes', listScenes);
router.post('/:projectId/scenes', addScene);
router.put('/:sceneId', updateScene);
router.delete('/:sceneId', deleteScene);
router.put('/:projectId/scenes/reorder', reorderScenes);

export default router;
