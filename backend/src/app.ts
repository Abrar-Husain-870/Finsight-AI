import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './core/config/env.js';
import { requestIdMiddleware } from './core/middleware/request-id.js';
import { loggerMiddleware } from './core/middleware/logger.middleware.js';
import { globalRateLimiter } from './core/middleware/rate-limiter.js';
import { errorHandler } from './core/middleware/error.middleware.js';
import { NotFoundError } from './core/errors/app-error.js';
import { prisma } from '../prisma/index.js';
import { sendSuccess } from './core/utils/response.js';
import { authRouter } from './features/auth/auth.routes.js';
import { categoryRouter } from './features/categories/category.routes.js';
import { transactionRouter } from './features/transactions/transaction.routes.js';
import { dashboardRouter } from './features/dashboard/dashboard.routes.js';
import { importRouter } from './features/import/import.routes.js';
import { analyticsRouter } from './features/analytics/analytics.routes.js';
import { healthRouter } from './features/health/health.routes.js';
import { goalRouter } from './features/goals/goal.routes.js';
import { simulationRouter } from './features/simulation/simulation.routes.js';
import { aiRouter } from './features/ai/ai.routes.js';
import { demoRouter } from './features/demo/demo.routes.js';

const app = express();

app.use(helmet());

const configuredFrontend = env.FRONTEND_URL ? env.FRONTEND_URL.replace(/\/+$/, '') : '';
const allowedOrigins = [
  configuredFrontend,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      (env.NODE_ENV === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(cleanOrigin))
    ) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));

app.use(globalRateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(loggerMiddleware as express.RequestHandler);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/import', importRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/health-score', healthRouter);
app.use('/api/goals', goalRouter);
app.use('/api/simulation', simulationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/demo', demoRouter);

app.get('/api/health', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    sendSuccess(res, {
      status: 'ok',
      version: process.env.npm_package_version || '1.0.0',
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export { app };
