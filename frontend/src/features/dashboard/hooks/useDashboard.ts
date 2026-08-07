import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api.js';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
  });
}
