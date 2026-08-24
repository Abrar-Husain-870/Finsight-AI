import React from 'react';
import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalytics.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { InsightCardWidget } from '../features/analytics/components/InsightCardWidget.js';
import { MerchantAnalysisWidget } from '../features/analytics/components/MerchantAnalysisWidget.js';
import { TransactionRow } from '../features/transactions/components/TransactionRow.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { cn } from '../lib/utils.js';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsSummary();
  const { formatMoney } = useCurrency();

  if (isLoading || !data) {
    return (
      <div className="flex h-full flex-col p-6 max-w-[1400px] mx-auto w-full gap-8">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="h-24 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-[300px] bg-[var(--color-bg-secondary)] animate-pulse rounded-xl lg:col-span-2"></div>
          <div className="h-[300px] bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  const formatPercent = (val: number) => {
    if (val === undefined || val === null || isNaN(val) || !isFinite(val)) return '0.0';
    return Math.abs(val).toFixed(1);
  };

  return (
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Intelligence</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Deep dive into your financial patterns and velocity.</p>
      </div>

      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.insights.map(insight => (
            <InsightCardWidget key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      {/* Borderless Data Ribbon */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-16 py-6 border-y border-[var(--color-border-primary)]/50">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <DollarSign className="h-4 w-4" /> Cash Flow (30d)
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {formatMoney(data.cashFlow.total)}
          </div>
          <div className={cn("text-xs font-medium mt-1", data.cashFlow.trend >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
            {data.cashFlow.trend >= 0 ? '+' : '-'}{formatPercent(data.cashFlow.trend)}% <span className="text-[var(--color-text-secondary)] font-normal">vs last 30d</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <TrendingUp className="h-4 w-4" /> Income
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {formatMoney(data.income.total)}
          </div>
          <div className={cn("text-xs font-medium mt-1", data.income.trend >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
            {data.income.trend >= 0 ? '+' : '-'}{formatPercent(data.income.trend)}% <span className="text-[var(--color-text-secondary)] font-normal">vs last 30d</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <TrendingDown className="h-4 w-4" /> Expenses
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {formatMoney(data.expense.total)}
          </div>
          <div className={cn("text-xs font-medium mt-1", data.expense.trend <= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]")}>
            {data.expense.trend >= 0 ? '+' : '-'}{formatPercent(data.expense.trend)}% <span className="text-[var(--color-text-secondary)] font-normal">vs last 30d</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <Activity className="h-4 w-4" /> Spending Velocity
          </div>
          <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {formatMoney(data.spendingVelocity.dailyAverage)} <span className="text-base font-normal text-[var(--color-text-secondary)]">/ day</span>
          </div>
          <div className="text-xs text-[var(--color-text-secondary)] mt-1">
            Projected: <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(data.spendingVelocity.projectedMonthly)}</span> / month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WidgetContainer title="Monthly Cash Flow Trends">
            <MonthlyTrendChart data={data.monthlyTrends} />
          </WidgetContainer>
        </div>
        <div className="lg:col-span-1">
          <WidgetContainer title="Category Breakdown (30d)">
            <CategoryDonutChart data={data.categoryAnalysis} />
          </WidgetContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WidgetContainer title="Top Merchants (30d)">
          <MerchantAnalysisWidget data={data.merchantAnalysis} />
        </WidgetContainer>

        <WidgetContainer title="Largest Transactions (30d)">
          <div className="flex flex-col gap-1">
            {data.largestTransactions.length > 0 ? data.largestTransactions.map(tx => (
              <TransactionRow key={tx.id} transaction={tx} onEdit={() => {}} onDelete={() => {}} />
            )) : (
              <div className="flex py-6 items-center justify-center text-sm text-[var(--color-text-secondary)]">No transactions available.</div>
            )}
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
