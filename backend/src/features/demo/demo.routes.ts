import { Router } from 'express';
import { demoController } from './demo.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.post('/seed', demoController.seedWorkspace.bind(demoController));

export { router as demoRouter };
