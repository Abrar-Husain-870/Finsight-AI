import { Request, Response, NextFunction } from 'express';
import { demoService } from './demo.service.js';

export class DemoController {
  async seedWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req.user as any).id || (req as any).userId;
      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
        return;
      }
      await demoService.seedDemoWorkspace(userId);
      res.status(200).json({ success: true, message: 'Demo workspace seeded successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const demoController = new DemoController();
