import { apiClient } from '../../../lib/axios.js';
import { SimulationInput, SimulationResponse } from '@finsight/shared';

export const simulationApi = {
  run: async (data: SimulationInput): Promise<SimulationResponse> => {
    const response = await apiClient.post<{ data: SimulationResponse }>('/simulation/run', data);
    return response.data.data;
  }
};
