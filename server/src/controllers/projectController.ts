import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError, ErrorMessages, HttpStatus } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const listProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const projects = await prisma.project.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        scenes: {
          orderBy: { sceneOrder: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(HttpStatus.OK).json(projects);
  } catch (error) {
    console.error('List projects error:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const getProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        scenes: {
          orderBy: { sceneOrder: 'asc' },
        },
        template: true,
      },
    });

    if (!project) {
      throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.PROJECT_NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    res.status(HttpStatus.OK).json(project);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get project error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const { name, description, templateId } = req.body;

    if (!name) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MISSING_REQUIRED_FIELD);
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description,
        templateId,
        status: 'draft',
      },
      include: {
        scenes: true,
      },
    });

    res.status(HttpStatus.CREATED).json(project);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Create project error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, description, status, thumbnailUrl } = req.body;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Check authorization
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(thumbnailUrl && { thumbnailUrl }),
        updatedAt: new Date(),
      },
      include: {
        scenes: {
          orderBy: { sceneOrder: 'asc' },
        },
      },
    });

    res.status(HttpStatus.OK).json(updatedProject);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Update project error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Check authorization
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(HttpStatus.OK).json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Delete project error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const duplicateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    // Get original project
    const original = await prisma.project.findUnique({
      where: { id },
      include: { scenes: true },
    });

    if (!original || original.userId !== userId) {
      throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.UNAUTHORIZED_PROJECT_ACCESS);
    }

    // Create duplicate
    const duplicate = await prisma.project.create({
      data: {
        userId,
        name: `${original.name} (Copy)`,
        description: original.description,
        templateId: original.templateId,
        status: 'draft',
        scenes: {
          create: original.scenes.map((scene) => ({
            sceneOrder: scene.sceneOrder,
            text: scene.text,
            imageUrl: scene.imageUrl,
            videoUrl: scene.videoUrl,
            duration: scene.duration,
            voiceoverUrl: scene.voiceoverUrl,
            voiceoverText: scene.voiceoverText,
          })),
        },
      },
      include: {
        scenes: {
          orderBy: { sceneOrder: 'asc' },
        },
      },
    });

    res.status(HttpStatus.CREATED).json(duplicate);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Duplicate project error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};
