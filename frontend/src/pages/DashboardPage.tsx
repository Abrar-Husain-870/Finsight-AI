import React, { useEffect } from 'react';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboard.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { RecentTransactionsWidget } from '../features/dashboard/components/RecentTransactionsWidget.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ui/ErrorState.js';
import { useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../features/transactions/api/transaction.api.js';
import { healthApi } from '../features/health/api/health.api.js';
import { goalApi } from '../features/goals/api/goal.api.js';
import { DashboardOnboarding } from '../features/dashboard/components/DashboardOnboarding.js';
import { cn } from '../lib/utils.js';

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

  const isPositiveCashFlow = summary ? summary.netCashFlow >= 0 : true;

  return (
    <div className="flex flex-col gap-12 p-6 sm:p-10 max-w-[1400px] mx-auto w-full">
      
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
          {/* Hero Metric Section */}
          <div className="flex flex-col items-center justify-center pt-8 pb-4">
            <span className="text-sm font-medium tracking-wide text-[var(--color-text-secondary)] uppercase mb-4">
              Net Cash Flow
            </span>
            {isLoading ? (
              <div className="h-[80px] w-[300px] bg-[var(--color-bg-secondary)] rounded-lg animate-pulse" />
            ) : (
              <h1 
                className={cn(
                  "text-[64px] sm:text-[88px] font-bold tracking-tighter leading-none mb-8 transition-colors",
                  isPositiveCashFlow ? "text-[var(--color-text-primary)]" : "text-[var(--color-danger)]"
                )}
              >
                {summary ? formatMoney(summary.netCashFlow) : formatMoney(0)}
              </h1>
            )}

            {/* Micro Stats Row */}
            {!isLoading && summary && (
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-sm">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[var(--color-text-secondary)]">Income</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(summary.totalIncome)}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[var(--color-text-secondary)]">Expenses</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(summary.totalExpenses)}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[var(--color-text-secondary)]">Savings</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(summary.savings)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12 mt-4">
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

          <div className="grid grid-cols-1 mt-4">
            <WidgetContainer 
              title="Recent Transactions" 
              action={
                <Link to="/transactions" className="flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
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
