import { z } from 'zod';

export const CreateGoalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  targetAmount: z.number().int().positive("Target amount must be positive").max(2147483647, "Target amount exceeds maximum supported limit"),
  currentAmount: z.number().int().min(0).max(2147483647, "Current amount exceeds maximum supported limit").default(0),
  targetDate: z.string().datetime(),
  color: z.string().max(20).optional()
});

export const UpdateGoalSchema = CreateGoalSchema.partial();

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalInput = z.infer<typeof UpdateGoalSchema>;

export interface GoalResponse {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  
  // Engine computed fields
  progress: number;
  requiredMonthlySavings: number;
  monthsRemaining: number;
  feasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC';
  status: 'ON_TRACK' | 'BEHIND' | 'AHEAD' | 'COMPLETED';
}

export interface GoalEngineSummary {
  goals: GoalResponse[];
  totalTarget: number;
  totalCurrent: number;
  totalRequiredMonthly: number;
  overallFeasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC';
  recommendations: { id: string; text: string }[];
}
