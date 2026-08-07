import { Router } from 'express';
import { importController } from './import.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
const router = Router();

router.use(requireAuth);
router.post('/preview', upload.single('file'), importController.preview.bind(importController));
router.post('/commit', importController.commit.bind(importController));

export { router as importRouter };
