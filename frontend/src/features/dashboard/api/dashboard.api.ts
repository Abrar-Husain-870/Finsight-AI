import { apiClient } from '../../../lib/axios.js';
import { DashboardSummaryResponse } from '@finsight/shared';

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummaryResponse> => {
    const response = await apiClient.get<{ data: DashboardSummaryResponse }>('/dashboard/summary');
    return response.data.data;
  }
};
