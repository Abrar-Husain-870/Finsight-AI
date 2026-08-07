import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();

// Categories are read-only and globally shared across the system
// but they are protected so only authenticated users can view the taxonomy
router.use(requireAuth);

router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/tree', categoryController.getCategoryTree.bind(categoryController));

export { router as categoryRouter };
