import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';

export class DashboardController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const summary = await dashboardService.getSummary(authReq.user!.id);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
