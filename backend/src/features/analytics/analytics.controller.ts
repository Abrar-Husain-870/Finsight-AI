import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';

export class AnalyticsController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const summary = await analyticsService.getSummary(authReq.user!.id);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
