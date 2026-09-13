import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalytics.js';
import { useTransactions } from '../features/transactions/hooks/useTransactions.js';
import { healthApi } from '../features/health/api/health.api.js';
import { goalApi } from '../features/goals/api/goal.api.js';
import { InsightCardWidget } from '../features/analytics/components/InsightCardWidget.js';
import { StatsBento } from '../components/ui/stats-bento.js';
import { ExpenseDisciplineSection } from '../features/analytics/components/ExpenseDisciplineSection.js';
import { FinancialHealthVelocitySection } from '../features/analytics/components/FinancialHealthVelocitySection.js';
import { CategoryMerchantDeepDiveSection } from '../features/analytics/components/CategoryMerchantDeepDiveSection.js';
import { SavingsGoalsBufferSection } from '../features/analytics/components/SavingsGoalsBufferSection.js';
import { AiInsightsProjectionsSection } from '../features/analytics/components/AiInsightsProjectionsSection.js';
import { DotPattern } from '../components/ui/dot-pattern.js';
import { cn } from '../lib/utils.js';

export default function AnalyticsPage() {
  const location = useLocation();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useAnalyticsSummary();
  const { data: transactionsData } = useTransactions({ page: 1, limit: 100, sortBy: 'date', sortOrder: 'desc' });
  
  const { data: healthData } = useQuery({
    queryKey: ['health', 'score'],
    queryFn: healthApi.getScore
  });

  const { data: goalSummary } = useQuery({
    queryKey: ['goals', 'summary'],
    queryFn: goalApi.getSummary
  });

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1);
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  if (isAnalyticsLoading || !analyticsData) {
    return (
      <div className="relative flex h-full min-h-screen flex-col p-6 max-w-[1400px] mx-auto w-full gap-8">
        <DotPattern
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1.2}
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
          }}
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-slate-400/45 dark:fill-slate-500/40"
        />
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-[280px] bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
          <div className="h-[280px] bg-[var(--color-bg-secondary)] animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const transactionsList = transactionsData?.data || analyticsData.largestTransactions || [];
  const filteredInsights = analyticsData.insights.filter(insight => insight.title !== 'Strong Savings Rate');

  return (
    <div className="relative flex h-full min-h-screen flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-12 pb-16">
      {/* Background Dot Pattern spanning whole page length with graceful edge fade */}
      <DotPattern
        width={24}
        height={24}
        cx={1}
        cy={1}
        cr={1.2}
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
        }}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-slate-400/45 dark:fill-slate-500/40"
      />

      {/* Page Content elevated above background pattern */}
      <div className="relative z-10 flex flex-col gap-12">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Financial Intelligence & Analytics
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Deep behavioral insights, health trajectories, category deep-dives, goals buffer, and scenario projections.
          </p>
        </div>

        {/* AI Insight Alert Badges */}
        {filteredInsights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInsights.map(insight => (
              <InsightCardWidget key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {/* FinSight Bento Performance Showcase Grid (Health Score, Net Cash Flow, Streak & 4 Radial Metrics) */}
        <StatsBento
          isLoading={isAnalyticsLoading}
          netCashFlow={analyticsData.cashFlow.total}
          monthlyTrend={analyticsData.monthlyTrends}
        />

        {/* 📊 Section 1: Expense Necessity & Discipline Analytics (Rating-Based KPIs) */}
        <div id="expense-discipline" className="scroll-mt-6">
          <ExpenseDisciplineSection transactions={transactionsList} />
        </div>

        {/* 📈 Section 2: Core Financial Health & Velocity Cards & Graphs */}
        <div id="financial-health-velocity" className="scroll-mt-6">
          <FinancialHealthVelocitySection
            healthData={healthData}
            analyticsData={analyticsData}
          />
        </div>

        {/* 🏷️ Section 3: Category & Merchant Deep-Dive Visualizations */}
        <div id="category-merchant-deepdive" className="scroll-mt-6">
          <CategoryMerchantDeepDiveSection
            analyticsData={analyticsData}
            transactions={transactionsList}
          />
        </div>

        {/* 🎯 Section 4: Savings Goals & Financial Buffer Analytics */}
        <div id="savings-goals-buffer" className="scroll-mt-6">
          <SavingsGoalsBufferSection
            goalSummary={goalSummary}
            analyticsData={analyticsData}
          />
        </div>

        {/* 🔮 Section 5: AI Insights & Financial Projections */}
        <div id="ai-insights-projections" className="scroll-mt-6">
          <AiInsightsProjectionsSection
            analyticsData={analyticsData}
          />
        </div>
      </div>
    </div>
  );
}
