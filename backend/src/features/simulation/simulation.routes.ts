import { Router } from 'express';
import { simulationController } from './simulation.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);
router.post('/run', simulationController.runSimulation.bind(simulationController));

export { router as simulationRouter };
