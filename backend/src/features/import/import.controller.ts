import { Request, Response, NextFunction } from 'express';
import { importService } from './import.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';
import { ValidationError } from '../../core/errors/app-error.js';

export class ImportController {
  async preview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const file = req.file;
      if (!file) throw new ValidationError('No file uploaded');

      const mappingStr = req.body.mapping;
      if (!mappingStr) throw new ValidationError('No column mapping provided');
      
      const mapping = JSON.parse(mappingStr);

      const result = await importService.processPreview(authReq.user!.id, file.buffer, mapping);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async commit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { sessionId, categoryMapping } = req.body;
      
      if (!sessionId || !categoryMapping) throw new ValidationError('Invalid payload');

      const result = await importService.commitSession(authReq.user!.id, sessionId, categoryMapping);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const importController = new ImportController();
