import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: () => (process.env.NODE_ENV === 'test' ? 5000 : 1000),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: () => (process.env.NODE_ENV === 'test' ? 100 : 20),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again in 15 minutes.'
    }
  }
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'Too many AI requests. Please slow down.'
    }
  }
});

export const demoSeedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: () => (process.env.NODE_ENV === 'test' ? 50 : 10),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'DEMO_RATE_LIMIT_EXCEEDED',
      message: 'Too many workspace seed operations requested.'
    }
  }
});

export const importRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: () => (process.env.NODE_ENV === 'test' ? 100 : 25),
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'IMPORT_RATE_LIMIT_EXCEEDED',
      message: 'Too many file import attempts. Please try again later.'
    }
  }
});
