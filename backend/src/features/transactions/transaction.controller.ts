import { Request, Response, NextFunction } from 'express';
import { transactionService } from './transaction.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AuthenticatedRequest } from '../../core/middleware/auth.middleware.js';
import { createTransactionSchema, updateTransactionSchema, filterTransactionSchema } from '@finsight/shared';
import { ValidationError } from '../../core/errors/app-error.js';

export class TransactionController {
  async getTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const filters = filterTransactionSchema.parse(req.query);
      const result = await transactionService.getTransactions(authReq.user!.id, filters);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const transaction = await transactionService.getTransactionById((req.params.id as string), authReq.user!.id);
      sendSuccess(res, transaction);
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = createTransactionSchema.parse(req.body);
      const transaction = await transactionService.createTransaction(authReq.user!.id, data);
      sendSuccess(res, transaction, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const data = updateTransactionSchema.parse(req.body);
      if (Object.keys(data).length === 0) {
         next(new ValidationError('No data provided to update'));
         return;
      }
      const transaction = await transactionService.updateTransaction((req.params.id as string), authReq.user!.id, data);
      sendSuccess(res, transaction);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      await transactionService.deleteTransaction((req.params.id as string), authReq.user!.id);
      sendSuccess(res, null);
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
