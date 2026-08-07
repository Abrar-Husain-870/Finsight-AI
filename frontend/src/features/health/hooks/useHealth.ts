
import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../api/health.api.js';

export function useHealthScore() {
  return useQuery({
    queryKey: ['health', 'score'],
    queryFn: () => healthApi.getScore()
  });
}
