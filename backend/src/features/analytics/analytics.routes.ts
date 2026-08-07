import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);
router.get('/summary', analyticsController.getSummary.bind(analyticsController));

export { router as analyticsRouter };
