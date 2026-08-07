import { apiClient } from '../../../lib/axios.js';
import { AnalyticsSummaryResponse } from '@finsight/shared';

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummaryResponse> => {
    const response = await apiClient.get<{ data: AnalyticsSummaryResponse }>('/analytics/summary');
    return response.data.data;
  }
};
