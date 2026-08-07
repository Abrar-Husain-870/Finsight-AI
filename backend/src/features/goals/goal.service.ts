
import { goalRepository } from './goal.repository.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { CreateGoalInput, UpdateGoalInput, GoalEngineSummary, GoalResponse } from '@finsight/shared';
import { NotFoundError } from '../../core/errors/app-error.js';
import { Goal } from '@prisma/client';
import crypto from 'crypto';

export class GoalService {
  
  public calculateGoalEngine(goal: Goal, averageMonthlyCashFlow: number): GoalResponse {
    const now = new Date();
    const target = new Date(goal.targetDate);
    
    let monthsRemaining = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    if (monthsRemaining <= 0) monthsRemaining = 1; // Prevent division by zero, treat as current month

    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
    const requiredMonthlySavings = remainingAmount / monthsRemaining;
    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

    let status: 'ON_TRACK' | 'BEHIND' | 'AHEAD' | 'COMPLETED' = 'ON_TRACK';
    if (progress >= 100) status = 'COMPLETED';
    else {
      // Mock determination based on required vs average
      if (requiredMonthlySavings > averageMonthlyCashFlow * 1.5) status = 'BEHIND';
      else if (requiredMonthlySavings < averageMonthlyCashFlow * 0.5) status = 'AHEAD';
    }

    let feasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC' = 'ACHIEVABLE';
    if (requiredMonthlySavings > averageMonthlyCashFlow) feasibility = 'UNREALISTIC';
    else if (requiredMonthlySavings > averageMonthlyCashFlow * 0.7) feasibility = 'STRETCH';

    return {
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate.toISOString(),
      color: goal.color,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
      progress,
      requiredMonthlySavings: Math.round(requiredMonthlySavings),
      monthsRemaining,
      feasibility,
      status
    };
  }

  async getEngineSummary(userId: string): Promise<GoalEngineSummary> {
    const rawGoals = await goalRepository.findAll(userId);
    const analytics = await analyticsService.getSummary(userId);
    
    const averageMonthlyCashFlow = Math.max(0, analytics.cashFlow.total); // Only count positive cashflow capacity

    const goals = rawGoals.map(g => this.calculateGoalEngine(g, averageMonthlyCashFlow));
    
    let totalTarget = 0;
    let totalCurrent = 0;
    let totalRequiredMonthly = 0;

    goals.forEach(g => {
      totalTarget += g.targetAmount;
      totalCurrent += g.currentAmount;
      if (g.status !== 'COMPLETED') {
        totalRequiredMonthly += g.requiredMonthlySavings;
      }
    });

    let overallFeasibility: 'ACHIEVABLE' | 'STRETCH' | 'UNREALISTIC' = 'ACHIEVABLE';
    if (totalRequiredMonthly > averageMonthlyCashFlow) overallFeasibility = 'UNREALISTIC';
    else if (totalRequiredMonthly > averageMonthlyCashFlow * 0.7) overallFeasibility = 'STRETCH';

    const recommendations: { id: string, text: string }[] = [];
    if (overallFeasibility === 'UNREALISTIC') {
      recommendations.push({ id: crypto.randomUUID(), text: 'Your total required monthly savings exceed your current average cash flow. Consider extending the target dates on some goals.' });
    } else if (overallFeasibility === 'STRETCH') {
      recommendations.push({ id: crypto.randomUUID(), text: 'Your goals are aggressive. You will need strict discipline to hit your targets.' });
    } else if (goals.length > 0) {
      recommendations.push({ id: crypto.randomUUID(), text: 'You are on track. Keep maintaining your positive cash flow.' });
    } else {
      recommendations.push({ id: crypto.randomUUID(), text: 'You have no active goals. Setting financial goals increases saving discipline.' });
    }

    const unachievableGoals = goals.filter(g => g.feasibility === 'UNREALISTIC');
    if (unachievableGoals.length > 0) {
      recommendations.push({ id: crypto.randomUUID(), text: `${unachievableGoals.map(g => g.name).join(', ')} require more monthly savings than you typically generate.` });
    }

    return {
      goals,
      totalTarget,
      totalCurrent,
      totalRequiredMonthly,
      overallFeasibility,
      recommendations
    };
  }

  async createGoal(userId: string, data: CreateGoalInput): Promise<GoalResponse> {
    const goal = await goalRepository.create(userId, data);
    const analytics = await analyticsService.getSummary(userId);
    return this.calculateGoalEngine(goal, Math.max(0, analytics.cashFlow.total));
  }

  async updateGoal(id: string, userId: string, data: UpdateGoalInput): Promise<GoalResponse> {
    const existing = await goalRepository.findById(id, userId);
    if (!existing) throw new NotFoundError('Goal not found');
    const goal = await goalRepository.update(id, userId, data);
    const analytics = await analyticsService.getSummary(userId);
    return this.calculateGoalEngine(goal, Math.max(0, analytics.cashFlow.total));
  }

  async deleteGoal(id: string, userId: string): Promise<void> {
    await goalRepository.delete(id, userId);
  }
}

export const goalService = new GoalService();
