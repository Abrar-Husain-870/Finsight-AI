
import { TransactionResponse } from './transaction.js';

export interface MonthlyTrend {
  month: string; // e.g. '2023-10'
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

export interface DashboardSummaryResponse {
  netCashFlow: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  monthlyTrend: MonthlyTrend[];
  topCategories: CategoryBreakdown[];
  recentTransactions: TransactionResponse[];
}
