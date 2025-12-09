import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError, ErrorMessages, HttpStatus } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const listScenes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    const scenes = await prisma.scene.findMany({
      where: { projectId },
      orderBy: { sceneOrder: 'asc' },
    });

    res.status(HttpStatus.OK).json(scenes);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('List scenes error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const addScene = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { text, imageUrl, videoUrl, duration, voiceoverUrl, voiceoverText, aiGenerated } = req.body;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    // Get max scene order
    const maxScene = await prisma.scene.findFirst({
      where: { projectId },
      orderBy: { sceneOrder: 'desc' },
      select: { sceneOrder: true },
    });

    const sceneOrder = (maxScene?.sceneOrder || 0) + 1;

    const scene = await prisma.scene.create({
      data: {
        projectId,
        sceneOrder,
        text,
        imageUrl,
        videoUrl,
        duration: duration || 3,
        voiceoverUrl,
        voiceoverText,
        aiGenerated: aiGenerated || false,
      },
    });

    res.status(HttpStatus.CREATED).json(scene);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Add scene error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const updateScene = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { sceneId } = req.params;
    const { text, imageUrl, videoUrl, duration, voiceoverUrl, voiceoverText } = req.body;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Get scene and verify ownership through project
    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: { project: true },
    });

    if (!scene) {
      throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SCENE_NOT_FOUND);
    }

    if (scene.project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    const updatedScene = await prisma.scene.update({
      where: { id: sceneId },
      data: {
        ...(text !== undefined && { text }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(voiceoverUrl !== undefined && { voiceoverUrl }),
        ...(voiceoverText !== undefined && { voiceoverText }),
        updatedAt: new Date(),
      },
    });

    res.status(HttpStatus.OK).json(updatedScene);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Update scene error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const deleteScene = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { sceneId } = req.params;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Get scene and verify ownership through project
    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
      include: { project: true },
    });

    if (!scene) {
      throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SCENE_NOT_FOUND);
    }

    if (scene.project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    // Delete and reorder remaining scenes
    await prisma.scene.delete({
      where: { id: sceneId },
    });

    const remainingScenes = await prisma.scene.findMany({
      where: { projectId: scene.projectId },
      orderBy: { sceneOrder: 'asc' },
    });

    // Reorder scenes
    for (let i = 0; i < remainingScenes.length; i++) {
      await prisma.scene.update({
        where: { id: remainingScenes[i].id },
        data: { sceneOrder: i + 1 },
      });
    }

    res.status(HttpStatus.OK).json({ message: 'Scene deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Delete scene error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const reorderScenes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { sceneIds } = req.body;

    if (!userId || !Array.isArray(sceneIds)) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.INVALID_INPUT);
    }

    // Verify user owns the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    // Update scene orders
    for (let i = 0; i < sceneIds.length; i++) {
      await prisma.scene.update({
        where: { id: sceneIds[i] },
        data: { sceneOrder: i + 1 },
      });
    }

    const reorderedScenes = await prisma.scene.findMany({
      where: { projectId },
      orderBy: { sceneOrder: 'asc' },
    });

    res.status(HttpStatus.OK).json(reorderedScenes);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Reorder scenes error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};
