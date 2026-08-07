
import { Router } from 'express';
import { healthController } from './health.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);
router.get('/', healthController.getScore.bind(healthController));

export { router as healthRouter };
