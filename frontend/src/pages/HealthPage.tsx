import React, { useState } from 'react';
import { useHealthScore } from '../features/health/hooks/useHealth.js';
import { ScoreCircle } from '../features/health/components/ScoreCircle.js';
import { ComponentCard } from '../features/health/components/ComponentCard.js';
import { RecommendationCard } from '../features/health/components/RecommendationCard.js';
import { HealthSummaryCards } from '../features/health/components/HealthSummaryCards.js';
import { HealthCashFlowCard } from '../features/health/components/HealthCashFlowCard.js';
import { HealthNetWorthCard } from '../features/health/components/HealthNetWorthCard.js';
import { HealthSmartInsightsCard } from '../features/health/components/HealthSmartInsightsCard.js';
import { HealthStressTestMatrix } from '../features/health/components/HealthStressTestMatrix.js';
import { HealthAssetBufferCard } from '../features/health/components/HealthAssetBufferCard.js';
import { HealthDailyBurnCard } from '../features/health/components/HealthDailyBurnCard.js';
import { GridBackground } from '../components/ui/grid-background.js';
import { FeatureCard } from '../components/ui/feature-card.js';
import {
  HeartPulse,
  Calendar,
  Plus,
  Sparkles,
  Activity,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  Check,
} from 'lucide-react';
import { ErrorState } from '../components/ui/ErrorState.js';

export default function HealthPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHealthScore();
  const [selectedPeriod, setSelectedPeriod] = useState('Sep 1 – Sep 30, 2026');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const handleRunDiagnostic = () => {
    setIsRefreshing(true);
    refetch().finally(() => {
      setTimeout(() => setIsRefreshing(false), 600);
    });
  };

  const periodOptions = [
    'Sep 1 – Sep 30, 2026',
    'Aug 1 – Aug 31, 2026',
    'Jul 1 – Jul 31, 2026',
    'Last 90 Days',
    'Year to Date (2026)',
  ];

  if (isLoading || (!data && !isError)) {
    return (
      <GridBackground variant="default" className="min-h-screen">
        <div className="relative flex h-full flex-col p-6 sm:p-8 max-w-[1340px] mx-auto w-full gap-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 w-36 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
              <div className="h-8 w-64 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
            </div>
            <div className="h-10 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-72 bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
            <div className="h-72 bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
            <div className="h-72 bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
          </div>
        </div>
      </GridBackground>
    );
  }

  return (
    <GridBackground variant="default" className="min-h-screen">
      <div className="relative flex h-full flex-col p-6 sm:p-8 max-w-[1340px] mx-auto w-full gap-7 pb-16">
        {/* 1. Header Row (Greeting, Date Range Selector, Action CTA) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500 mb-2 shadow-2xs">
              <HeartPulse className="h-3.5 w-3.5" />
              Financial Diagnostics & Stability
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-sans">
              Good morning, Demo
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-normal leading-relaxed">
              Here's your financial overview and diagnostic stability index for September 2026.
            </p>
          </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {/* Period Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-all cursor-pointer shadow-2xs"
            >
              <Calendar className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="h-3 w-3 text-[var(--color-text-secondary)]" />
            </button>

            {showPeriodMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowPeriodMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] shadow-lg py-1.5 z-40">
                  {periodOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(opt);
                        setShowPeriodMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] transition-colors cursor-pointer"
                    >
                      <span>{opt}</span>
                      {selectedPeriod === opt && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleRunDiagnostic}
            disabled={isRefreshing || isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isRefreshing || isFetching ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            <span>Run Diagnostic</span>
          </button>
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Failed to load health diagnostics"
          description={
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while calculating your financial stability index.'
          }
          onRetry={refetch}
        />
      ) : (
        data && (
          <>
            {/* 2. Top Diagnostic Spotlight & Actionable Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {/* Radial Vo2Max Progress Ring Card */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center">
                <ScoreCircle score={data.overallScore} trend={data.trend} />
              </div>

              {/* Actionable Prescriptions List */}
              <div className="lg:col-span-2 flex flex-col justify-between p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                        <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
                        Actionable Prescriptions & Optimizations
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                        High-leverage actions to boost your score to 95+ and expand runway.
                      </p>
                    </div>
                    <span className="text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {data.recommendations.length} Steps
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {data.recommendations.length > 0 ? (
                      data.recommendations.map((r) => (
                        <RecommendationCard key={r.id} recommendation={r} />
                      ))
                    ) : (
                      <div className="p-8 flex flex-col items-center text-center rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.08] shadow-xs">
                        <span className="text-3xl mb-2">🎉</span>
                        <h4 className="font-bold text-base text-[var(--color-text-primary)]">
                          Optimal Stability Achieved
                        </h4>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm">
                          Your portfolio satisfies all stability criteria with zero warning indicators.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Summary Metric Cards Row (4 Equal-Width Cards with Sparklines & Mini Gauge) */}
            <HealthSummaryCards score={data.overallScore} trend={data.trend} />

            {/* 4. Middle Section: 3-Column Layout (Cash Flow + Net Worth Trend + Smart Insights) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              <HealthCashFlowCard />
              <HealthNetWorthCard />
              <HealthSmartInsightsCard />
            </div>

            {/* 5. Financial Shock Resilience & Stress Tests Matrix */}
            <HealthStressTestMatrix />

            {/* 6. Bottom 3-Column Grid (Score Component Factors + Buffer Donut + Daily Spending Outflow) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Column 1: Diagnostic Score Factors */}
              <FeatureCard
                title="Score Components"
                description="Weighted factor stability breakdown across cash flow, runway, and commitments."
                badge={
                  <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2 py-0.5 rounded-full">
                    {data.components.length} Factors
                  </span>
                }
                className="h-full"
              >
                <div className="flex flex-col gap-2.5">
                  {data.components.map((c) => (
                    <ComponentCard key={c.name} component={c} />
                  ))}
                </div>
              </FeatureCard>

              {/* Column 2: Segmented Donut Asset & Buffer Distribution */}
              <HealthAssetBufferCard />

              {/* Column 3: Daily Spending Outflow Velocity */}
              <HealthDailyBurnCard />
            </div>
          </>
        )
      )}
      </div>
    </GridBackground>
  );
}
