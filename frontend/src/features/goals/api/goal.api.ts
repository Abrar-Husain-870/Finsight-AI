
import { apiClient } from '../../../lib/axios.js';
import { GoalEngineSummary, CreateGoalInput, UpdateGoalInput, GoalResponse } from '@finsight/shared';

export const goalApi = {
  getSummary: async (): Promise<GoalEngineSummary> => {
    const response = await apiClient.get<{ data: GoalEngineSummary }>('/goals/summary');
    return response.data.data;
  },
  createGoal: async (data: CreateGoalInput): Promise<GoalResponse> => {
    const response = await apiClient.post<{ data: GoalResponse }>('/goals', data);
    return response.data.data;
  },
  updateGoal: async ({ id, data }: { id: string; data: UpdateGoalInput }): Promise<GoalResponse> => {
    const response = await apiClient.patch<{ data: GoalResponse }>(`/goals/${id}`, data);
    return response.data.data;
  },
  deleteGoal: async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`);
  }
};
