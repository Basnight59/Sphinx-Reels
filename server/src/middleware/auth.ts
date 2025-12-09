import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError, ErrorMessages, HttpStatus } from '../utils/errors.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  body?: any;
  params?: any;
  query?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.INVALID_TOKEN);
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: ErrorMessages.UNAUTHORIZED });
    }
  }
};
