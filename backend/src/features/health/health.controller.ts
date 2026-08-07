
import { Request, Response, NextFunction } from 'express';
import { healthService } from './health.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';

export class HealthController {
  async getScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const result = await healthService.getScore(authReq.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const healthController = new HealthController();
