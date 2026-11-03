import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error.js';
import { logger } from '../logger/logger.js';
import { sendError } from '../utils/response.js';
import { ZodError } from 'zod';
import multer from 'multer';

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

  if (err instanceof ZodError) {
    logger.warn({ err: err.errors }, 'Validation error');
    return sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request data', err.errors);
  }

  // Intercept body-parser and Multer payload size violations (DoS prevention)
  const anyErr = err as unknown as Record<string, unknown>;
  if (anyErr.status === 413 || anyErr.statusCode === 413 || anyErr.type === 'entity.too.large') {
    logger.warn({ err }, 'Payload too large');
    return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Request payload exceeds the maximum allowed limit of 1MB');
  }

  // Intercept all JSON syntax errors (e.g. malformed JSON payloads or body parser errors)
  if (err instanceof SyntaxError) {
    logger.warn({ err }, 'Invalid JSON payload syntax');
    return sendError(res, 400, 'BAD_REQUEST', 'Invalid JSON payload syntax');
  }

  // Intercept Multer file upload errors
  if (err instanceof multer.MulterError) {
    logger.warn({ err }, `Upload error: ${err.message}`);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 413, 'PAYLOAD_TOO_LARGE', 'Uploaded file exceeds the maximum allowed size (5MB)');
    }
    return sendError(res, 400, 'FILE_UPLOAD_ERROR', err.message);
  }

  logger.error({ err }, 'Unhandled error');
  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred');
};
