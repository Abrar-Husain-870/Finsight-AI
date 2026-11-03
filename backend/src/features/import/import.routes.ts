import { Router } from 'express';
import { importController } from './import.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';
import { importRateLimiter } from '../../core/middleware/rate-limiter.js';
import { ValidationError } from '../../core/errors/app-error.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB strict limit
  fileFilter: (req, file, cb) => {
    const isCsvMime = file.mimetype === 'text/csv' ||
      file.mimetype === 'text/plain' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/csv';
    const isCsvExt = file.originalname.toLowerCase().endsWith('.csv');

    if (isCsvMime || isCsvExt) {
      cb(null, true);
    } else {
      cb(new ValidationError('Only valid CSV files (.csv) are permitted'));
    }
  }
});

const router = Router();

router.use(requireAuth);
router.post('/preview', importRateLimiter, upload.single('file'), importController.preview.bind(importController));
router.post('/commit', importRateLimiter, importController.commit.bind(importController));

export { router as importRouter };
