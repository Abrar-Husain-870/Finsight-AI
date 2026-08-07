
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalApi } from '../api/goal.api.js';

export function useGoalSummary() {
  return useQuery({
    queryKey: ['goals', 'summary'],
    queryFn: () => goalApi.getSummary()
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalApi.createGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalApi.updateGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: goalApi.deleteGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  });
}
