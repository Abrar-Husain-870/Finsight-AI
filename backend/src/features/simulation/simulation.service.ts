import { SimulationInput, SimulationResponse } from '@finsight/shared';
import { analyticsService } from '../analytics/analytics.service.js';
import { healthService } from '../health/health.service.js';
import { goalService } from '../goals/goal.service.js';
import { goalRepository } from '../goals/goal.repository.js';

export class SimulationService {
  async runSimulation(userId: string, input: SimulationInput): Promise<SimulationResponse> {
    // 1. Get Baselines
    const baselineAnalytics = await analyticsService.getSummary(userId);
    const baselineHealth = healthService.calculateScoreFromAnalytics(baselineAnalytics);
    const baselineGoals = await goalService.getEngineSummary(userId);

    // 2. Clone and Adjust Analytics for Projection
    const projectedAnalytics = JSON.parse(JSON.stringify(baselineAnalytics)) as typeof baselineAnalytics;
    
    projectedAnalytics.income.total += input.incomeAdjustment;
    projectedAnalytics.expense.total += input.expenseAdjustment;
    projectedAnalytics.cashFlow.total = projectedAnalytics.income.total - projectedAnalytics.expense.total;
    
    // Adjust velocity so health score reflects new expense reality
    const daysPassed = 30;
    projectedAnalytics.spendingVelocity.dailyAverage = projectedAnalytics.expense.total / daysPassed;
    projectedAnalytics.spendingVelocity.projectedMonthly = projectedAnalytics.spendingVelocity.dailyAverage * 30;

    // 3. Compute Projected Health
    const projectedHealth = healthService.calculateScoreFromAnalytics(projectedAnalytics);

    // 4. Compute Projected Goals
    const rawGoals = await goalRepository.findAll(userId);
    const projectedAvgCashFlow = Math.max(0, projectedAnalytics.cashFlow.total);
    const projectedGoalCalculations = rawGoals.map(g => goalService.calculateGoalEngine(g, projectedAvgCashFlow));
    
    let totalRequiredMonthly = 0;
    projectedGoalCalculations.forEach(g => {
      if (g.status !== 'COMPLETED') totalRequiredMonthly += g.requiredMonthlySavings;
    });

    let projectedFeasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC' = 'ACHIEVABLE';
    if (totalRequiredMonthly > projectedAvgCashFlow) projectedFeasibility = 'UNREALISTIC';
    else if (totalRequiredMonthly > projectedAvgCashFlow * 0.7) projectedFeasibility = 'STRETCH';

    return {
      baseline: {
        cashFlow: baselineAnalytics.cashFlow.total,
        healthScore: baselineHealth.overallScore,
        overallFeasibility: baselineGoals.overallFeasibility
      },
      projected: {
        cashFlow: projectedAnalytics.cashFlow.total,
        healthScore: projectedHealth.overallScore,
        overallFeasibility: projectedFeasibility
      },
      diff: {
        cashFlow: projectedAnalytics.cashFlow.total - baselineAnalytics.cashFlow.total,
        healthScore: projectedHealth.overallScore - baselineHealth.overallScore
      }
    };
  }
}

export const simulationService = new SimulationService();
