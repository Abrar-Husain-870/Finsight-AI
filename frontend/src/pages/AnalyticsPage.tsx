import React from 'react';
import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalytics.js';
import { MetricCard } from '../components/ui/MetricCard.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { InsightCardWidget } from '../features/analytics/components/InsightCardWidget.js';
import { MerchantAnalysisWidget } from '../features/analytics/components/MerchantAnalysisWidget.js';
import { TransactionRow } from '../features/transactions/components/TransactionRow.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalyticsSummary();
  const { formatMoney } = useCurrency();

  if (isLoading || !data) {
    return (
      <div className="flex h-full flex-col p-6 max-w-7xl mx-auto w-full gap-6">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
          <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
          <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
          <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 max-w-7xl mx-auto w-full gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Intelligence</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Deep dive into your financial patterns and velocity.</p>
      </div>

      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.insights.map(insight => (
            <InsightCardWidget key={insight.id} insight={insight} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Cash Flow (30d)" value={formatMoney(data.cashFlow.total)} trend={{ value: Math.abs(data.cashFlow.trend), label: 'vs last 30d', isPositive: data.cashFlow.trend >= 0 }} icon={DollarSign} />
        <MetricCard title="Income" value={formatMoney(data.income.total)} trend={{ value: Math.abs(data.income.trend), label: 'vs last 30d', isPositive: data.income.trend >= 0 }} icon={TrendingUp} />
        <MetricCard title="Expenses" value={formatMoney(data.expense.total)} trend={{ value: Math.abs(data.expense.trend), label: 'vs last 30d', isPositive: data.expense.trend <= 0 }} icon={TrendingDown} />
        <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 shadow-sm">
          <div className="text-sm font-medium text-[var(--color-text-secondary)]">Spending Velocity</div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">{formatMoney(data.spendingVelocity.dailyAverage)} <span className="text-sm font-normal text-[var(--color-text-secondary)]">/ day</span></div>
          <div className="mt-1 text-xs text-[var(--color-text-secondary)]">Projected: {formatMoney(data.spendingVelocity.projectedMonthly)} / month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetContainer title="Top Merchants (30d)">
          <MerchantAnalysisWidget data={data.merchantAnalysis} />
        </WidgetContainer>

        <WidgetContainer title="Largest Transactions (30d)">
          <div className="flex flex-col">
            {data.largestTransactions.length > 0 ? data.largestTransactions.map(tx => (
              <TransactionRow key={tx.id} transaction={tx} onEdit={() => {}} onDelete={() => {}} />
            )) : (
              <div className="text-sm text-[var(--color-text-secondary)] p-4 text-center">No transactions available.</div>
            )}
          </div>
        </WidgetContainer>
      </div>

    </div>
  );
}
