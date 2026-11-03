import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './core/config/env.js';
import { requestIdMiddleware } from './core/middleware/request-id.js';
import { loggerMiddleware } from './core/middleware/logger.middleware.js';
import { globalRateLimiter } from './core/middleware/rate-limiter.js';
import { securitySanitizerMiddleware } from './core/middleware/sanitize.middleware.js';
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

// Defend against technology profiling / banner grabbing
app.disable('x-powered-by');

// Defense-in-depth HTTP security headers
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true
}));

const configuredFrontend = env.FRONTEND_URL ? env.FRONTEND_URL.replace(/\/+$/, '') : '';
const allowedOrigins = [
  configuredFrontend,
  'https://finsight-ai-updated.vercel.app',
  'https://finsight-ai-frontend-sigma.vercel.app',
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
    
    // Strict origin whitelist: approved frontend domains, Vercel deployments, & dev local ports
    const isExplicit = allowedOrigins.includes(cleanOrigin);
    const isVercel = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(cleanOrigin) || cleanOrigin.endsWith('.vercel.app');
    const isDevLocalhost = env.NODE_ENV === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(cleanOrigin);
    
    if (isExplicit || isVercel || isDevLocalhost) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
}));

// Global baseline rate limiter
app.use(globalRateLimiter);

// Payload size defense against buffer allocation DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Input sanitization middleware: strips null bytes, XSS scripts, prototype pollution
app.use(securitySanitizerMiddleware);

app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(loggerMiddleware as express.RequestHandler);

// Root API Endpoint
app.get('/api', (req, res) => {
  sendSuccess(res, {
    name: 'FinSight API',
    version: '1.0.0',
    status: 'online',
    documentation: '/docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      transactions: '/api/transactions',
      categories: '/api/categories',
      dashboard: '/api/dashboard',
      analytics: '/api/analytics',
      healthScore: '/api/health-score',
      goals: '/api/goals',
      simulation: '/api/simulation',
      ai: '/api/ai',
      import: '/api/import',
      demo: '/api/demo'
    }
  });
});

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

export default app;
export { app };
