import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse } from '@finsight/shared';
import { getRequestId } from '../middleware/request-id.js';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, meta?: Record<string, unknown>) => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, code: string, message: string, details?: unknown) => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    }
  };
  
  if (details) {
    response.error.details = details;
  }
  
  const reqId = getRequestId();
  if (reqId) {
    response.error.requestId = reqId;
  }
  
  return res.status(statusCode).json(response);
};
