import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().int("Amount must be in minor units").min(-2147483647, "Amount must not exceed 32-bit limit").max(2147483647, "Amount must not exceed 32-bit limit"),
  currency: z.string().length(3).default('USD'),
  categoryId: z.string().uuid(),
  date: z.string().datetime(),
  merchant: z.string().max(255, 'Merchant cannot exceed 255 characters').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const filterTransactionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().uuid().optional(),
  merchant: z.string().max(255).optional(),
  minAmount: z.coerce.number().int().min(-2147483647).max(2147483647).optional(),
  maxAmount: z.coerce.number().int().min(-2147483647).max(2147483647).optional(),
  sortBy: z.enum(['date', 'amount', 'merchant', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
