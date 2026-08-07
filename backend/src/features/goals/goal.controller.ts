
import { Request, Response, NextFunction } from 'express';
import { goalService } from './goal.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';
import { CreateGoalSchema, UpdateGoalSchema } from '@finsight/shared';

export class GoalController {
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const summary = await goalService.getEngineSummary(authReq.user!.id);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }

  async createGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = CreateGoalSchema.parse(req.body);
      const goal = await goalService.createGoal(authReq.user!.id, data);
      sendSuccess(res, goal, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = UpdateGoalSchema.parse(req.body);
      const goal = await goalService.updateGoal(req.params.id as string, authReq.user!.id, data);
      sendSuccess(res, goal);
    } catch (error) {
      next(error);
    }
  }

  async deleteGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      await goalService.deleteGoal(req.params.id as string, authReq.user!.id);
      sendSuccess(res, null, 204);
    } catch (error) {
      next(error);
    }
  }
}

export const goalController = new GoalController();
