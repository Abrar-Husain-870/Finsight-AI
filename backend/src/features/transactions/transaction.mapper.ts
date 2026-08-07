import { Transaction } from '@prisma/client';
import { TransactionResponse } from '@finsight/shared';

export const mapTransactionToResponse = (transaction: Transaction): TransactionResponse => ({
  id: transaction.id,
  amount: transaction.amount,
  currency: transaction.currency,
  categoryId: transaction.categoryId,
  date: transaction.date.toISOString(),
  merchant: transaction.merchant ?? undefined,
  description: transaction.description ?? undefined,
  notes: transaction.notes ?? undefined,
  createdAt: transaction.createdAt.toISOString(),
});
