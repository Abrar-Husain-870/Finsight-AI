
import { apiClient } from '../../../lib/axios.js';
import { HealthScoreResponse } from '@finsight/shared';

export const healthApi = {
  getScore: async (): Promise<HealthScoreResponse> => {
    const response = await apiClient.get<{ data: HealthScoreResponse }>('/health-score');
    return response.data.data;
  }
};
