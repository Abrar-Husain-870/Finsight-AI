import { transactionRepository } from './transaction.repository.js';
import { CreateTransactionInput, UpdateTransactionInput, TransactionFilterInput, PaginatedResponse, TransactionResponse } from '@finsight/shared';
import { mapTransactionToResponse } from './transaction.mapper.js';
import { NotFoundError, ValidationError } from '../../core/errors/app-error.js';

export class TransactionService {
  async getTransactions(userId: string, filters: TransactionFilterInput): Promise<PaginatedResponse<TransactionResponse>> {
    const { transactions, total } = await transactionRepository.findMany(userId, filters);
    
    return {
      data: transactions.map(mapTransactionToResponse),
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  }

  async getTransactionById(id: string, userId: string): Promise<TransactionResponse> {
    const transaction = await transactionRepository.findById(id, userId);
    if (!transaction) throw new NotFoundError('Transaction not found');
    return mapTransactionToResponse(transaction);
  }

  async createTransaction(userId: string, data: CreateTransactionInput): Promise<TransactionResponse> {
    const validCategory = await transactionRepository.categoryExists(data.categoryId);
    if (!validCategory) throw new ValidationError('Invalid category ID');

    const transaction = await transactionRepository.create(userId, {
      ...data,
      date: new Date(data.date),
      merchant: data.merchant || null,
      description: data.description || null,
      notes: data.notes || null,
    });
    
    return mapTransactionToResponse(transaction);
  }

  async updateTransaction(id: string, userId: string, data: UpdateTransactionInput): Promise<TransactionResponse> {
    const existing = await transactionRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Transaction not found');

    if (data.categoryId) {
      const validCategory = await transactionRepository.categoryExists(data.categoryId);
      if (!validCategory) throw new ValidationError('Invalid category ID');
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.date !== undefined) updatePayload.date = new Date(data.date);
    if (data.merchant !== undefined) updatePayload.merchant = data.merchant;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.notes !== undefined) updatePayload.notes = data.notes;
    if (data.amount !== undefined) updatePayload.amount = data.amount;
    if (data.currency !== undefined) updatePayload.currency = data.currency;
    if (data.categoryId !== undefined) updatePayload.categoryId = data.categoryId;

    const transaction = await transactionRepository.update(id, updatePayload);

    return mapTransactionToResponse(transaction);
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    const existing = await transactionRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Transaction not found');

    await transactionRepository.softDelete(id);
  }
}

export const transactionService = new TransactionService();
