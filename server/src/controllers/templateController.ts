import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AppError, ErrorMessages, HttpStatus } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const listTemplates = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, search } = req.query;

    const templates = await prisma.template.findMany({
      where: {
        isPublished: true,
        ...(category && { category: category as string }),
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        thumbnailUrl: true,
        defaultDuration: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(HttpStatus.OK).json(templates);
  } catch (error) {
    console.error('List templates error:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const getTemplate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template || !template.isPublished) {
      throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.TEMPLATE_NOT_FOUND);
    }

    res.status(HttpStatus.OK).json(template);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get template error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const createTemplate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const { name, category, description, thumbnailUrl, layoutConfig, defaultDuration } = req.body;

    if (!name || !category) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MISSING_REQUIRED_FIELD);
    }

    const template = await prisma.template.create({
      data: {
        name,
        category,
        description,
        thumbnailUrl,
        layoutConfig: layoutConfig || {},
        defaultDuration: defaultDuration || 3,
        createdBy: userId,
      },
    });

    res.status(HttpStatus.CREATED).json(template);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Create template error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};
