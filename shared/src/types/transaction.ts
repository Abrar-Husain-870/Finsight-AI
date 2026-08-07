import { z } from 'zod';
import { createTransactionSchema, updateTransactionSchema, filterTransactionSchema } from '../schemas/transaction.schema.js';

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilterInput = z.infer<typeof filterTransactionSchema>;

export interface TransactionResponse {
  id: string;
  amount: number;
  currency: string;
  categoryId: string;
  date: string;
  merchant?: string | undefined;
  description?: string | undefined;
  notes?: string | undefined;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
