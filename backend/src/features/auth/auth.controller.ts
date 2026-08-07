import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticationError } from '../../core/errors/app-error.js';
import { env } from '../../core/config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body);
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { user, accessToken }, 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body);
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  }

  async demoLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.demoLogin();
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { user, accessToken });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new AuthenticationError('Refresh token missing');
      }

      const { accessToken, refreshToken } = await authService.refresh(token);
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      return sendSuccess(res, { accessToken });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as import("../../core/middleware/auth.middleware.js").AuthenticatedRequest).user?.id;
      if (userId) {
        await authService.logout(userId);
      }
      res.clearCookie('refreshToken');
      return sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as import("../../core/middleware/auth.middleware.js").AuthenticatedRequest).user?.id;
      if (!userId) throw new AuthenticationError();
      const user = await authService.getUserById(userId);
      return sendSuccess(res, user);
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as import("../../core/middleware/auth.middleware.js").AuthenticatedRequest).user?.id;
      if (!userId) throw new AuthenticationError();
      const user = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, user);
    } catch (error) {
      return next(error);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      // Passport attaches the result to req.user in our custom strategy handling
      const authData = (req as import("../../core/middleware/auth.middleware.js").AuthenticatedRequest).user;
      if (!authData) throw new AuthenticationError('Google auth failed');

      res.cookie('refreshToken', authData.refreshToken, COOKIE_OPTIONS);
      // In a real app, redirect to frontend with access token or use a postMessage approach
      res.redirect(`${env.FRONTEND_URL}/auth/success?token=${authData.accessToken}`);
    } catch (error) {
      return next(error);
    }
  }
}

export const authController = new AuthController();
