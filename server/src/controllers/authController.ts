import { Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword, validatePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, ErrorMessages, HttpStatus } from '../utils/errors.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MISSING_REQUIRED_FIELD);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, passwordValidation.error!);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(HttpStatus.CONFLICT, ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    res.status(HttpStatus.CREATED).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Register error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MISSING_REQUIRED_FIELD);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Store refresh token in session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    res.status(HttpStatus.OK).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Login error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const refreshTokens = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MISSING_REQUIRED_FIELD);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.INVALID_TOKEN);
    }

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { token: refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.TOKEN_EXPIRED);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email });
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email });

    // Update session
    await prisma.session.delete({
      where: { id: session.id },
    });

    await prisma.session.create({
      data: {
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(HttpStatus.OK).json({
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Refresh token error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        subscriptionTier: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
    }

    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get current user error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
};
