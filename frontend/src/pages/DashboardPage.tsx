import React, { useEffect } from 'react';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboard.js';
import { MetricCard } from '../components/ui/MetricCard.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { RecentTransactionsWidget } from '../features/dashboard/components/RecentTransactionsWidget.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { Wallet, TrendingUp, TrendingDown, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ui/ErrorState.js';
import { useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../features/transactions/api/transaction.api.js';
import { healthApi } from '../features/health/api/health.api.js';
import { goalApi } from '../features/goals/api/goal.api.js';
import { DashboardOnboarding } from '../features/dashboard/components/DashboardOnboarding.js';

export default function DashboardPage() {
  const { data: summary, isLoading, isError, error, refetch } = useDashboardSummary();
  const queryClient = useQueryClient();
  const { formatMoney } = useCurrency();

  useEffect(() => {
    if (summary) {
      const prefetch = () => {
        queryClient.prefetchQuery({ 
          queryKey: ['transactions', { page: 1, limit: 15, sortBy: 'date', sortOrder: 'desc' }], 
          queryFn: () => transactionApi.getAll({ page: 1, limit: 15, sortBy: 'date', sortOrder: 'desc' }) 
        });
        queryClient.prefetchQuery({ queryKey: ['health', 'score'], queryFn: healthApi.getScore });
        queryClient.prefetchQuery({ queryKey: ['goals', 'summary'], queryFn: goalApi.getSummary });
      };

      if (window.requestIdleCallback) {
        window.requestIdleCallback(prefetch);
      } else {
        setTimeout(prefetch, 2000);
      }
    }
  }, [summary, queryClient]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Overview</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Here's your financial summary for this month.</p>
      </div>

      {isError ? (
        <ErrorState 
          title="Failed to load dashboard"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while loading your summary.'}
          onRetry={refetch}
        />
      ) : summary && summary.totalIncome === 0 && summary.totalExpenses === 0 && summary.recentTransactions.length === 0 ? (
        <DashboardOnboarding />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Net Cash Flow"
          value={summary ? formatMoney(summary.netCashFlow) : '$0.00'}
          icon={Wallet}
          iconColorClass="text-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Income"
          value={summary ? formatMoney(summary.totalIncome) : '$0.00'}
          icon={TrendingUp}
          iconColorClass="text-[var(--color-success)] bg-[var(--color-success)]/10"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total Expenses"
          value={summary ? formatMoney(summary.totalExpenses) : '$0.00'}
          icon={TrendingDown}
          iconColorClass="text-[var(--color-danger)] bg-[var(--color-danger)]/10"
          isLoading={isLoading}
        />
        <MetricCard
          title="Savings"
          value={summary ? formatMoney(summary.savings) : '$0.00'}
          icon={Target}
          iconColorClass="text-purple-500 bg-purple-500/10"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetContainer title="Cash Flow Trend">
            {isLoading ? (
              <div className="h-[300px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
            ) : summary ? (
              <MonthlyTrendChart data={summary.monthlyTrend} />
            ) : null}
          </WidgetContainer>
        </div>
        <div>
          <WidgetContainer title="Expense Breakdown">
            {isLoading ? (
              <div className="h-[300px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
            ) : summary ? (
              <CategoryDonutChart data={summary.topCategories} />
            ) : null}
          </WidgetContainer>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <WidgetContainer 
          title="Recent Transactions" 
          action={
            <Link to="/transactions" className="flex items-center text-sm font-medium text-[var(--color-accent-primary)] hover:text-[var(--color-accent-hover)] transition-colors">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          }
        >
          {isLoading ? (
             <div className="h-[200px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
          ) : summary ? (
             <RecentTransactionsWidget transactions={summary.recentTransactions} />
          ) : null}
        </WidgetContainer>
      </div>
        </>
      )}
    </div>
  );
}
