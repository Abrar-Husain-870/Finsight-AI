import { Router } from 'express';
import { demoController } from './demo.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import { demoSeedLimiter } from '../../core/middleware/rate-limiter.js';

const router = Router();
router.use(requireAuth);

router.post('/seed', demoSeedLimiter, demoController.seedWorkspace.bind(demoController));

export { router as demoRouter };
