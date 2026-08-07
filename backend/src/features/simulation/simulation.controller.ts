import { Request, Response, NextFunction } from 'express';
import { simulationService } from './simulation.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';
import { SimulationInputSchema } from '@finsight/shared';

export class SimulationController {
  async runSimulation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = SimulationInputSchema.parse(req.body);
      const result = await simulationService.runSimulation(authReq.user!.id, data);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const simulationController = new SimulationController();
