import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import { rateLimit } from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 requests per windowMs
  message: { error: { message: 'Too many chat requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
router.use(requireAuth);

router.get('/config', aiController.getConfig.bind(aiController));
router.post('/config', aiController.saveConfig.bind(aiController));
router.get('/sessions', aiController.getSessions.bind(aiController));
router.get('/sessions/:id', aiController.getSession.bind(aiController));
router.post('/chat', chatLimiter, aiController.chat.bind(aiController));

export { router as aiRouter };
