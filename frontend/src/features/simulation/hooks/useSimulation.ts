import { useMutation } from '@tanstack/react-query';
import { simulationApi } from '../api/simulation.api.js';

export function useRunSimulation() {
  return useMutation({
    mutationFn: simulationApi.run
  });
}
