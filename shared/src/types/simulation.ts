import { z } from 'zod';

export const SimulationInputSchema = z.object({
  incomeAdjustment: z.number().int(),
  expenseAdjustment: z.number().int()
});

export type SimulationInput = z.infer<typeof SimulationInputSchema>;

export interface SimulationResponse {
  baseline: {
    cashFlow: number;
    healthScore: number;
    overallFeasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC';
  };
  projected: {
    cashFlow: number;
    healthScore: number;
    overallFeasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC';
  };
  diff: {
    cashFlow: number;
    healthScore: number;
  };
}
