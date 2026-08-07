import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/summary', dashboardController.getSummary.bind(dashboardController));

export { router as dashboardRouter };
