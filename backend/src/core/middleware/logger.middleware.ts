import type { IncomingMessage } from 'node:http';
import { pinoHttp } from 'pino-http';
import { logger } from '../logger/logger.js';
import { getRequestId } from './request-id.js';

export const loggerMiddleware = pinoHttp({
  logger,
  genReqId: (req: IncomingMessage) => {
    const reqId = req.headers['x-request-id'];
    const reqIdStr = Array.isArray(reqId) ? reqId[0] : reqId;
    return reqIdStr || getRequestId() || 'unknown';
  },
  customProps: () => {
    const requestId = getRequestId();
    return requestId ? { requestId } : {};
  },
});
