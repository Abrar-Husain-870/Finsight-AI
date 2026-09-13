import { analyticsRepository } from './analytics.repository.js';
import { AnalyticsSummaryResponse, InsightCard, calculateGrowth, calculateAverage, CategoryBreakdown, MonthlyTrend } from '@finsight/shared';
import crypto from 'crypto';
import { prisma } from '../../../prisma/index.js';

export class AnalyticsService {
  async getSummary(userId: string): Promise<AnalyticsSummaryResponse> {
    const now = new Date();
    
    // Current period (Last 30 days)
    const currentEnd = new Date(now);
    const currentStart = new Date(now);
    currentStart.setDate(currentStart.getDate() - 30);
    
    // Previous period (30 days before that)
    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - 30);

    const [currentTx, previousTx] = await Promise.all([
      analyticsRepository.getTransactionsInRange(userId, currentStart, currentEnd),
      analyticsRepository.getTransactionsInRange(userId, previousStart, previousEnd)
    ]);

    // Current Aggregations
    let currentIncome = 0;
    let currentExpense = 0;
    const categoryMap = new Map<string, { amount: number, categoryId: string, categoryName: string, categoryIcon: string, categoryColor: string }>();
    const merchantMap = new Map<string, { amount: number, count: number }>();
    let largestTx: typeof currentTx = [];

    currentTx.forEach(tx => {
      if (tx.amount > 0) currentIncome += tx.amount;
      else {
        const absAmount = Math.abs(tx.amount);
        currentExpense += absAmount;

        // Category Grouping
        const catId = tx.categoryId || 'uncategorized';
        const categoryName = tx.category?.name || 'Uncategorized';
        const categoryIcon = tx.category?.icon || 'help-circle';
        const categoryColor = tx.category?.color || 'var(--color-text-secondary)';
        const catData = categoryMap.get(catId) || { amount: 0, categoryId: catId, categoryName, categoryIcon, categoryColor };
        catData.amount += absAmount;
        categoryMap.set(catId, catData);

        // Merchant Grouping
        if (tx.merchant) {
          const m = tx.merchant.toLowerCase();
          const mData = merchantMap.get(m) || { amount: 0, count: 0 };
          mData.amount += absAmount;
          mData.count += 1;
          merchantMap.set(m, mData);
        }
      }
    });

    largestTx = [...currentTx].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 5);

    // Previous Aggregations
    let previousIncome = 0;
    let previousExpense = 0;
    previousTx.forEach(tx => {
      if (tx.amount > 0) previousIncome += tx.amount;
      else previousExpense += Math.abs(tx.amount);
    });

    const incomeTrend = calculateGrowth(currentIncome, previousIncome);
    const expenseTrend = calculateGrowth(currentExpense, previousExpense);
    const currentCashFlow = currentIncome - currentExpense;
    const previousCashFlow = previousIncome - previousExpense;
    const cashFlowTrend = calculateGrowth(currentCashFlow, previousCashFlow);

    // Insights Generation
    const insights: InsightCard[] = [];
    if (currentExpense > currentIncome) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'WARNING',
        title: 'Negative Cash Flow',
        description: 'Your expenses exceeded your income in the last 30 days.',
        actionable: 'Review your largest transactions to identify cutbacks.'
      });
    }

    if (expenseTrend > 20) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'NEGATIVE',
        title: 'Spending Spike',
        description: `Your spending increased by ${Math.round(expenseTrend)}% compared to the previous period.`,
      });
    }

    const categoriesList = Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .map(cat => ({ ...cat, percentage: currentExpense > 0 ? (cat.amount / currentExpense) * 100 : 0 }));
    const merchantList = Array.from(merchantMap.entries())
      .map(([merchant, data]) => ({ merchant, amount: data.amount, count: data.count }))
      .sort((a, b) => b.amount - a.amount).slice(0, 5);

    // Spending Velocity
    const daysPassed = 30;
    const dailyAverage = currentExpense / daysPassed;
    const projectedMonthly = dailyAverage * 30;

    // Monthly Trends (Mock logic similar to dashboard but using DB)
    
    // Note: rawAggs from groupBy is just returning grouped by date. We actually need to fetch real full transactions for accuracy in SQLite.
    // To be perfectly safe across SQL dialects, we just query the last 6 months transactions and do it in memory.
    // For M5A strict spec, we'll override rawAggs by just querying standard transactions to guarantee it works.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const allTx = await prisma.transaction.findMany({
      where: { userId, date: { gte: sixMonthsAgo }, deletedAt: null },
      select: { amount: true, date: true }
    });

    const realTrendMap = new Map<string, MonthlyTrend>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      realTrendMap.set(mKey, { month: mKey, income: 0, expense: 0 });
    }

    allTx.forEach(tx => {
      const mKey = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`;
      const trend = realTrendMap.get(mKey);
      if (trend) {
        if (tx.amount > 0) trend.income += tx.amount;
        else trend.expense += Math.abs(tx.amount);
      }
    });

    return {
      period: { start: currentStart.toISOString(), end: currentEnd.toISOString() },
      income: { total: currentIncome, average: calculateAverage(currentIncome, 1), trend: incomeTrend },
      expense: { total: currentExpense, average: calculateAverage(currentExpense, 1), trend: expenseTrend },
      cashFlow: { total: currentCashFlow, trend: cashFlowTrend },
      monthlyTrends: Array.from(realTrendMap.values()),
      categoryAnalysis: categoriesList as CategoryBreakdown[],
      merchantAnalysis: merchantList,
      largestTransactions: largestTx.map(tx => ({
        id: tx.id,
        userId: tx.userId,
        categoryId: tx.categoryId,
        amount: tx.amount,
        currency: tx.currency,
        date: tx.date.toISOString(),
        merchant: tx.merchant || undefined,
        description: tx.description || undefined,
        createdAt: tx.createdAt.toISOString(),
        updatedAt: tx.updatedAt.toISOString(),
        category: tx.category ? { id: tx.category.id, name: tx.category.name, color: tx.category.color, icon: tx.category.icon } : undefined
      })),
      insights,
      spendingVelocity: {
        dailyAverage,
        projectedMonthly
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
