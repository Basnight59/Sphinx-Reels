import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Simple validation - you can use Zod or Joi for more complex validation
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid request' });
    }
  };
};
