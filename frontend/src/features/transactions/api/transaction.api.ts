import { apiClient } from '../../../lib/axios.js';
import { TransactionResponse, PaginatedResponse, TransactionFilterInput, CreateTransactionInput, UpdateTransactionInput } from '@finsight/shared';

export const transactionApi = {
  getAll: async (params: TransactionFilterInput): Promise<PaginatedResponse<TransactionResponse>> => {
    const response = await apiClient.get<{ data: PaginatedResponse<TransactionResponse> }>('/transactions', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<TransactionResponse> => {
    const response = await apiClient.get<{ data: TransactionResponse }>(`/transactions/${id}`);
    return response.data.data;
  },

  create: async (data: CreateTransactionInput): Promise<TransactionResponse> => {
    const response = await apiClient.post<{ data: TransactionResponse }>('/transactions', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateTransactionInput): Promise<TransactionResponse> => {
    const response = await apiClient.patch<{ data: TransactionResponse }>(`/transactions/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  }
};
