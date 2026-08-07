import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { logger } from '../logger/logger.js';
import { sendError } from '../utils/response.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, 'Internal server error');
    } else {
      logger.warn({ err }, err.message);
    }
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn({ err }, 'Invalid JSON payload');
    return sendError(res, 400, 'BAD_REQUEST', 'Invalid JSON payload');
  }

  logger.error({ err }, 'Unhandled error');
  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
};
