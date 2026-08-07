import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthenticationError } from '../errors/app-error.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    refreshToken?: string;
    accessToken?: string;
  };
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid authorization header'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AuthenticationError('Missing token'));
  }
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as string) as unknown as { userId: string };
    (req as AuthenticatedRequest).user = { id: decoded.userId };
    next();
  } catch {
    next(new AuthenticationError('Invalid or expired token'));
  }
};
