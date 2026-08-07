import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().int("Amount must be in minor units"),
  currency: z.string().length(3).default('USD'),
  categoryId: z.string().uuid(),
  date: z.string().datetime(),
  merchant: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const filterTransactionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().uuid().optional(),
  merchant: z.string().optional(),
  minAmount: z.coerce.number().int().optional(),
  maxAmount: z.coerce.number().int().optional(),
  sortBy: z.enum(['date', 'amount', 'merchant', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
