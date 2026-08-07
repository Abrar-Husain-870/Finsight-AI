import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';
import { SaveAiConfigSchema, SendMessageSchema } from '@finsight/shared';

export class AiController {
  async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const config = await aiService.getConfig(authReq.user!.id);
      sendSuccess(res, config);
    } catch (error) {
      next(error);
    }
  }

  async saveConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = SaveAiConfigSchema.parse(req.body);
      const config = await aiService.saveConfig(authReq.user!.id, data);
      sendSuccess(res, config);
    } catch (error) {
      next(error);
    }
  }

  async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const sessions = await aiService.getSessions(authReq.user!.id);
      sendSuccess(res, sessions);
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const session = await aiService.getSession(authReq.user!.id, req.params.id as string);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }

  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = SendMessageSchema.parse(req.body);
      await aiService.handleChatStream(authReq.user!.id, data.content, res, data.sessionId);
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AiController();
