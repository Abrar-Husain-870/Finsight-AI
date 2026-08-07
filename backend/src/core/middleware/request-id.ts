import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

export const requestContext = new AsyncLocalStorage<string>();

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);
  
  requestContext.run(reqId, () => {
    next();
  });
};

export const getRequestId = (): string | undefined => {
  return requestContext.getStore();
};
