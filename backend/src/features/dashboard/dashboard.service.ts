import { dashboardRepository } from './dashboard.repository.js';
import { DashboardSummaryResponse, MonthlyTrend, CategoryBreakdown } from '@finsight/shared';

export class DashboardService {
  async getSummary(userId: string): Promise<DashboardSummaryResponse> {
    const today = new Date();
    // Start of month 5 months ago (for 6 months total trend)
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [transactions, recentRaw] = await Promise.all([
      dashboardRepository.getTransactionsSince(userId, sixMonthsAgo),
      dashboardRepository.getRecentTransactions(userId, 5)
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    
    // Group trends
    const trendMap = new Map<string, { income: number; expense: number }>();
    // Pre-fill 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      trendMap.set(key, { income: 0, expense: 0 });
    }

    const currentMonthCategories = new Map<string, { name: string; icon: string; color: string; amount: number }>();
    let currentMonthExpenseTotal = 0;

    for (const tx of transactions) {
      const txDate = new Date(tx.date);
      const isCurrentMonth = txDate >= startOfCurrentMonth;
      const monthKey = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}`;
      const trend = trendMap.get(monthKey);
      
      const isIncome = tx.category.type === 'INCOME';
      const isExpense = tx.category.type === 'EXPENSE';

      if (trend) {
        if (isIncome) trend.income += tx.amount;
        if (isExpense) trend.expense += tx.amount;
      }

      if (isCurrentMonth) {
        if (isIncome) totalIncome += tx.amount;
        if (isExpense) {
          totalExpenses += tx.amount;
          currentMonthExpenseTotal += tx.amount;
          
          const cat = currentMonthCategories.get(tx.categoryId) || {
            name: tx.category.name,
            icon: tx.category.icon,
            color: tx.category.color,
            amount: 0
          };
          cat.amount += tx.amount;
          currentMonthCategories.set(tx.categoryId, cat);
        }
      }
    }

    const monthlyTrend: MonthlyTrend[] = Array.from(trendMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense
    })).sort((a, b) => a.month.localeCompare(b.month));

    const topCategories: CategoryBreakdown[] = Array.from(currentMonthCategories.entries())
      .map(([id, data]) => ({
        categoryId: id,
        categoryName: data.name,
        categoryIcon: data.icon,
        categoryColor: data.color,
        amount: data.amount,
        percentage: currentMonthExpenseTotal > 0 ? (data.amount / currentMonthExpenseTotal) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5

    const recentTransactions = recentRaw.map(tx => ({
      id: tx.id,
      amount: tx.amount,
      currency: tx.currency,
      categoryId: tx.categoryId,
      date: tx.date.toISOString(),
      merchant: tx.merchant || undefined,
      description: tx.description || undefined,
      createdAt: tx.createdAt.toISOString()
    }));

    return {
      netCashFlow: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      monthlyTrend,
      topCategories,
      recentTransactions
    };
  }
}

export const dashboardService = new DashboardService();
