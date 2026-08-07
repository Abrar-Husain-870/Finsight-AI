import { CategoryBreakdown, MonthlyTrend } from './dashboard.js';
import { TransactionResponse } from './transaction.js';

export interface InsightCard {
  id: string;
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'WARNING';
  title: string;
  description: string;
  actionable?: string;
}

export interface AnalyticsSummaryResponse {
  period: { start: string; end: string; };
  income: { total: number; average: number; trend: number; }; // trend is percentage
  expense: { total: number; average: number; trend: number; };
  cashFlow: { total: number; trend: number; };
  monthlyTrends: MonthlyTrend[];
  categoryAnalysis: CategoryBreakdown[];
  merchantAnalysis: { merchant: string; amount: number; count: number; }[];
  largestTransactions: TransactionResponse[];
  insights: InsightCard[];
  spendingVelocity: {
    dailyAverage: number;
    projectedMonthly: number;
  };
}
