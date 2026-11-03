import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import { aiRateLimiter } from '../../core/middleware/rate-limiter.js';

const router = Router();
router.use(requireAuth);

router.get('/config', aiController.getConfig.bind(aiController));
router.post('/config', aiController.saveConfig.bind(aiController));
router.get('/sessions', aiController.getSessions.bind(aiController));
router.get('/sessions/:id', aiController.getSession.bind(aiController));
router.post('/chat', aiRateLimiter, aiController.chat.bind(aiController));

export { router as aiRouter };
