import React, { useEffect } from 'react';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboard.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { RecentTransactionsWidget } from '../features/dashboard/components/RecentTransactionsWidget.js';
import { StatsBento } from '../components/ui/stats-bento.js';
import { AdvancedStats } from '../components/ui/advanced-stats.js';
import { StockPortfolioCard } from '../components/ui/stock-portfolio-card.js';
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
          {/* Primary Financial Position Header */}
          <div className="flex flex-col items-center justify-center pt-4 pb-2 text-center">
            <span className="text-xs font-semibold tracking-wider text-[var(--color-text-secondary)] uppercase mb-3">
              Net Cash Position
            </span>
            {isLoading ? (
              <div className="h-[80px] w-[300px] bg-[var(--color-bg-secondary)] rounded-2xl animate-pulse" />
            ) : (
              <h1 
                className={cn(
                  "text-[52px] sm:text-[76px] md:text-[88px] font-bold tracking-tighter leading-none tabular-nums mb-6 transition-colors",
                  isPositiveCashFlow ? "text-[var(--color-text-primary)]" : "text-[var(--color-danger)]"
                )}
              >
                {summary ? formatMoney(summary.netCashFlow) : formatMoney(0)}
              </h1>
            )}

            {/* Financial Ledger Ribbon */}
            {!isLoading && summary && (
              <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-6 sm:px-10 py-3 sm:py-3.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Income</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums text-[var(--color-success)]">+{formatMoney(summary.totalIncome)}</span>
                </div>
                
                <div className="hidden sm:block h-6 w-px bg-[var(--color-border-primary)]" />
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Expenses</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums text-[var(--color-danger)]">{formatMoney(Math.abs(summary.totalExpenses))}</span>
                </div>
                
                <div className="hidden sm:block h-6 w-px bg-[var(--color-border-primary)]" />
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Net Savings</span>
                  <span className="text-sm sm:text-base font-semibold tabular-nums text-[var(--color-text-primary)]">{formatMoney(summary.savings)}</span>
                </div>
              </div>
            )}
          </div>

          {/* FinSight Premium Stats Bento Grid */}
          <StatsBento
            isLoading={isLoading}
            {...(summary?.netCashFlow !== undefined ? { netCashFlow: summary.netCashFlow } : {})}
            {...(summary?.monthlyTrend !== undefined ? { monthlyTrend: summary.monthlyTrend } : {})}
          />

          {/* FinSight Advanced Performance & Goal Analytics */}
          <AdvancedStats />

          {/* Financial Analytics Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
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

          {/* Bottom Grid: Portfolio Intelligence & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Stock Portfolio & Market Intelligence Card */}
            <StockPortfolioCard />

            {/* Recent Activity Ledger Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">Recent Activity</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] uppercase tracking-wider">Last 5</span>
                </div>
                <Link to="/transactions" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  View all transactions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              
              <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm p-2 sm:p-4">
                {isLoading ? (
                   <div className="h-[200px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
                ) : summary ? (
                   <RecentTransactionsWidget transactions={summary.recentTransactions} />
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
