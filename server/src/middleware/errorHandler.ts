import { Request, Response, NextFunction } from 'express';
import { AppError, HttpStatus, ErrorMessages } from '../utils/errors.js';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      status: err.statusCode,
    });
  } else if (err instanceof Error) {
    console.error('Unhandled error:', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: ErrorMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  } else {
    console.error('Unknown error:', err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: ErrorMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};
