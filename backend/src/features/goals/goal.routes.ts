
import { Router } from 'express';
import { goalController } from './goal.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', goalController.getSummary.bind(goalController));
router.post('/', goalController.createGoal.bind(goalController));
router.patch('/:id', goalController.updateGoal.bind(goalController));
router.delete('/:id', goalController.deleteGoal.bind(goalController));

export { router as goalRouter };
