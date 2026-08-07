import { Router } from 'express';
import { transactionController } from './transaction.controller.js';
import { requireAuth } from '../../core/middleware/auth.middleware.js';

const router = Router();

// All transaction routes are heavily protected and scoped to the authenticated user
router.use(requireAuth);

router.get('/', transactionController.getTransactions.bind(transactionController));
router.get('/:id', transactionController.getTransactionById.bind(transactionController));
router.post('/', transactionController.createTransaction.bind(transactionController));
router.patch('/:id', transactionController.updateTransaction.bind(transactionController));
router.delete('/:id', transactionController.deleteTransaction.bind(transactionController));

export { router as transactionRouter };
