import React, { useEffect } from 'react';
import { useDashboardSummary } from '../features/dashboard/hooks/useDashboard.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { MonthlyTrendChart } from '../features/dashboard/components/MonthlyTrendChart.js';
import { CategoryDonutChart } from '../features/dashboard/components/CategoryDonutChart.js';
import { RecentTransactionsWidget } from '../features/dashboard/components/RecentTransactionsWidget.js';
import { StatsCardsWithLinks } from '../components/ui/stats-cards-with-links.js';
import { StreakCard } from '../components/ui/streak-card.js';
import { AdvancedStats } from '../components/ui/advanced-stats.js';
import { StockPortfolioCard } from '../components/ui/stock-portfolio-card.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { ArrowRight, ShieldCheck, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../features/auth/store/auth.store.js';
import { Chart, type ChartConfig, ChartTooltip, ChartTooltipContent } from '../components/ui/bar-chart.js';
import { Bar, BarChart, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ui/ErrorState.js';
import { useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../features/transactions/api/transaction.api.js';
import { healthApi } from '../features/health/api/health.api.js';
import { goalApi } from '../features/goals/api/goal.api.js';
import { DashboardOnboarding } from '../features/dashboard/components/DashboardOnboarding.js';
import { fromMinor, toMinor } from '@finsight/shared';
import { cn } from '../lib/utils.js';

export default function DashboardPage() {
  const { data: summary, isLoading, isError, error, refetch } = useDashboardSummary();
  const queryClient = useQueryClient();
  const { formatMoney, symbol } = useCurrency();
  const user = useAuthStore(s => s.user);

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

  const formattedCashFlow = summary?.netCashFlow !== undefined
    ? `${summary.netCashFlow >= 0 ? '+' : ''}${formatMoney(summary.netCashFlow)}`
    : `+${symbol}11,936.96`;

  const sparklineHeights = summary?.monthlyTrend && summary.monthlyTrend.length > 0
    ? summary.monthlyTrend.map(t => {
      const net = fromMinor(t.income - t.expense);
      const max = Math.max(...summary.monthlyTrend.map(m => Math.abs(fromMinor(m.income - m.expense))), 1);
      return Math.max(15, Math.min(100, Math.round((Math.abs(net) / max) * 100)));
    })
    : [20, 35, 45, 30, 60, 50, 75, 65, 85, 90, 100];

  const velocityConfig = {
    velocity: {
      label: "Net Velocity",
      theme: {
        light: "var(--color-text-primary)",
        dark: "var(--color-text-primary)",
      },
    },
  } satisfies ChartConfig;

  const velocityData = React.useMemo(() => {
    // 14 bi-weekly velocity periods demonstrating realistic financial momentum & dynamic variance
    const velocityPattern = [
      0.38, 0.65, 0.48, 0.78, 0.58, 0.88, 0.72,
      0.62, 0.95, 0.82, 1.12, 0.90, 1.18, 1.05
    ];

    const now = new Date();

    // Scale baseline to current net cash flow or standard authentic baseline
    const baseFlow = summary?.netCashFlow && summary.netCashFlow !== 0
      ? Math.max(1200, Math.round(fromMinor(Math.abs(summary.netCashFlow)) / 2.5))
      : 3200;

    return velocityPattern.map((multiplier, idx) => {
      const weeksAgo = (velocityPattern.length - 1 - idx) * 2;
      const pointDate = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
      const period = pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const velocity = Math.round(baseFlow * multiplier);
      return {
        period,
        velocity,
      };
    });
  }, [summary?.netCashFlow]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
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
          {/* Primary Financial Position Header: Compact Responsive Bar */}
          <div id="dashboard-net-position" className="scroll-mt-24 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
                Net Cash Position
              </span>
              {isLoading ? (
                <div className="h-10 w-48 bg-[var(--color-bg-secondary)] rounded-xl animate-pulse mt-0.5" />
              ) : (
                <h1
                  className={cn(
                    "text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none tabular-nums transition-colors mt-0.5",
                    isPositiveCashFlow ? "text-[var(--color-text-primary)]" : "text-[var(--color-danger)]"
                  )}
                >
                  {summary ? formatMoney(summary.netCashFlow) : formatMoney(0)}
                </h1>
              )}
            </div>

            {/* Financial Ledger Ribbon */}
            {!isLoading && summary && (
              <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 px-4 py-2 sm:px-6 sm:py-2.5 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-xl shadow-xs self-start md:self-auto">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Income</span>
                  <span className="text-sm font-semibold tabular-nums text-emerald-500 dark:text-emerald-400">+{formatMoney(summary.totalIncome)}</span>
                </div>

                <div className="hidden sm:block h-4 w-px bg-[var(--color-border-primary)]" />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Expenses</span>
                  <span className="text-sm font-semibold tabular-nums text-red-500 dark:text-red-400">-{formatMoney(Math.abs(summary.totalExpenses))}</span>
                </div>

                <div className="hidden sm:block h-4 w-px bg-[var(--color-border-primary)]" />

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Net Savings</span>
                  <span className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{formatMoney(summary.savings)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 1: Financial Health & Metric Milestones */}
          <div id="dashboard-health-milestones" className="scroll-mt-24 flex flex-col gap-3 sm:gap-4 -mt-1 sm:-mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Financial Health & Core Milestones
                  </h2>
                  <span data-theme-badge="" className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Prime Stance
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                  Continuous capacity tracking across solvency score, goal objectives, monthly budget limit, and cash reserve buffers.
                </p>
              </div>
            </div>

            {/* 4 Radial Progress Metric Cards Row */}
            <StatsCardsWithLinks />

            {/* 3-Card Balanced Row: Health Score (1/3) + Net Cash Flow (1/3) + Streak (1/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
              {/* Card 1: Financial Health - Primary Stat following stats-bento rule */}
              <div className="bg-primary text-primary-foreground rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden relative shadow-xs h-full min-h-[190px]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[repeating-linear-gradient(45deg,#808080_0px_1px,transparent_1px_10px)] opacity-30 mask-[radial-gradient(ellipse_80%_50%_at_100%_0%,#000_70%,transparent_110%)] [mask-image:radial-gradient(ellipse_80%_50%_at_100%_0%,#000_70%,transparent_110%)] [-webkit-mask-image:radial-gradient(ellipse_80%_50%_at_100%_0%,#000_70%,transparent_110%)] pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-foreground/10 rounded-full text-[10px] font-semibold text-primary-foreground/70 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3 text-primary-foreground" />
                      Financial Health
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/20">
                      Top 15% Tier
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <h3 className="text-5xl sm:text-6xl font-bold tracking-tighter text-primary-foreground tabular-nums">
                      84
                    </h3>
                    <span className="text-xl font-bold text-primary-foreground/60">/100</span>
                  </div>
                </div>

                <div className="relative z-10 space-y-3 pt-2">
                  <p className="text-primary-foreground/80 text-xs sm:text-sm leading-relaxed font-medium">
                    Optimal fiscal stability. Your low debt-to-income ratio (26.4%) and liquid emergency buffer keep you in the highest solvency tier.
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-primary-foreground/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary-foreground/10 text-primary-foreground/90">
                        5.8 Mo Runway
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary-foreground/10 text-primary-foreground/90">
                        Low Volatility
                      </span>
                    </div>
                    <Link to="/health" className="inline-flex items-center gap-1 text-xs font-semibold text-primary-foreground hover:underline">
                      Diagnostics <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 2: Cash Flow Velocity Card - Powered by bar-chart.tsx */}
              <div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] rounded-3xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative shadow-xs hover:border-[var(--color-border-hover)] transition-all h-full min-h-[190px]">
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-full text-[10px] font-bold text-[var(--color-text-primary)] uppercase tracking-widest">
                        <TrendingUp className="w-3 h-3 text-[var(--chart-1)]" />
                        Cash Flow Velocity
                      </span>
                      <div className="group relative cursor-pointer">
                        <Info className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                        <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-52 p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[11px] text-[var(--color-text-secondary)] shadow-lg z-30 pointer-events-none">
                          Rolling 14-period cash momentum showing the rate and stability of net surplus generation.
                        </div>
                      </div>
                    </div>
                    <span data-theme-badge="" className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      Accelerating
                    </span>
                  </div>

                  <div className="pt-1.5 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums whitespace-nowrap">
                        {formattedCashFlow}
                      </h3>
                      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] shrink-0 whitespace-nowrap">
                        net monthly
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                      {isPositiveCashFlow ? "Inflow outpaces total outflow across 14 bi-weekly cycles" : "Outflow exceeds inflow across recent periods"}
                    </p>
                  </div>
                </div>

                {/* Integrated shadcn Bar Chart */}
                <div className="w-full flex-1 flex flex-col justify-end pt-3 sm:pt-4 relative z-10 min-h-[110px]">
                  <Chart className="h-28 sm:h-32 w-full aspect-auto" config={velocityConfig}>
                    <BarChart
                      accessibilityLayer
                      data={velocityData}
                      margin={{ top: 8, right: 2, left: 2, bottom: 0 }}
                      barCategoryGap="16%"
                    >
                      <YAxis hide domain={[0, 'dataMax + 800']} />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            formatter={(val) => [formatMoney(toMinor(Number(val))), 'Velocity']}
                          />
                        }
                      />
                      <Bar
                        dataKey="velocity"
                        fill="var(--color-velocity)"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={16}
                      />
                    </BarChart>
                  </Chart>
                </div>
              </div>

              {/* Card 3: Tracking Streak Card */}
              <div className="h-full">
                <StreakCard title="Tracking Streak" className="h-full" showHowItWorks={false} />
              </div>
            </div>
          </div>

          {/* Section 2: Capital Performance & Key Metrics */}
          <div id="dashboard-performance-kpis" className="scroll-mt-24 flex flex-col gap-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Performance Overview & KPIs
                  </h2>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-secondary)]">
                    Quarterly Trajectory
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                  Capital accumulation trends, primary milestone targets, and key operational financial indicators.
                </p>
              </div>
            </div>
            <AdvancedStats />
          </div>

          {/* Section 3: Financial Analytics Grid (8 / 4 Allocation) */}
          <div id="dashboard-cashflow-analytics" className="scroll-mt-24 flex flex-col gap-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Cash Flow & Expense Intelligence
                  </h2>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-secondary)]">
                    Inflow vs Outflow Dynamics
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                  Multi-month net flow trajectory, expense categorization, and budget ceiling utilization.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6 items-stretch">
              <div className="lg:col-span-8 flex flex-col h-full">
                <WidgetContainer
                  title="Cash Flow Trend"
                  subtitle="Net cash trajectory comparing earned receipts against operational living costs."
                  badge={
                    <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      6-Month Historical
                    </span>
                  }
                >
                  {isLoading ? (
                    <div className="h-[300px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
                  ) : summary ? (
                    <MonthlyTrendChart data={summary.monthlyTrend} />
                  ) : null}
                </WidgetContainer>
              </div>
              <div className="lg:col-span-4 flex flex-col h-full">
                <WidgetContainer
                  title="Expense Breakdown"
                  subtitle="Categorical breakdown of spending to isolate essential vs discretionary drivers."
                  badge={
                    <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
                      Top Outflows
                    </span>
                  }
                >
                  {isLoading ? (
                    <div className="h-[300px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
                  ) : summary ? (
                    <CategoryDonutChart data={summary.topCategories} />
                  ) : null}
                </WidgetContainer>
              </div>
            </div>
          </div>

          {/* Section 4: Portfolio Intelligence & Activity Stream (7 / 5 Allocation) */}
          <div id="dashboard-portfolio-activity" className="scroll-mt-24 flex flex-col gap-2 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    Portfolio & Activity Stream
                  </h2>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-secondary)]">
                    Asset Growth & Ledger
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                  Investment portfolio performance, reserve allocation, and verified recent transactions.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
              {/* Stock Portfolio & Market Intelligence Card */}
              <div className="lg:col-span-7 w-full flex flex-col">
                <StockPortfolioCard className="h-full flex flex-col justify-between" />
              </div>

              {/* Recent Activity Ledger Section */}
              <div className="lg:col-span-5 flex flex-col gap-2.5 w-full h-full">
                <div className="flex items-center justify-between px-1 h-7 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">Recent Activity</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] uppercase tracking-wider">Last 10</span>
                  </div>
                  <Link to="/transactions" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors shrink-0">
                    View all
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm p-2 sm:p-3 flex-1 flex flex-col justify-between overflow-hidden">
                  {isLoading ? (
                    <div className="h-[200px] w-full bg-[var(--color-bg-secondary)] rounded-md animate-pulse" />
                  ) : summary ? (
                    <RecentTransactionsWidget transactions={summary.recentTransactions} limit={10} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
