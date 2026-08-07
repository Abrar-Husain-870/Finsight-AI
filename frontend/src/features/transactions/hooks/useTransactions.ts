import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transaction.api.js';
import { TransactionFilterInput, CreateTransactionInput, UpdateTransactionInput } from '@finsight/shared';

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: string) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

export function useTransactions(filters: TransactionFilterInput) {
  return useQuery({
    queryKey: transactionKeys.list(JSON.stringify(filters)),
    queryFn: () => transactionApi.getAll(filters),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransactionInput) => transactionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    }
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) => transactionApi.update(id, data),
    onSuccess: (updatedTx) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.setQueryData(transactionKeys.detail(updatedTx.id), updatedTx);
    }
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => transactionApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.removeQueries({ queryKey: transactionKeys.detail(deletedId) });
    }
  });
}
