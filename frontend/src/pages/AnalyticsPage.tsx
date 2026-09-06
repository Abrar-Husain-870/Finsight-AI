import React from 'react';
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

export default function AnalyticsPage() {
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

  if (isAnalyticsLoading || !analyticsData) {
    return (
      <div className="flex h-full flex-col p-6 max-w-[1400px] mx-auto w-full gap-8">
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

  return (
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-12 pb-16">
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
      {analyticsData.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsData.insights.map(insight => (
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
      <ExpenseDisciplineSection transactions={transactionsList} />

      {/* 📈 Section 2: Core Financial Health & Velocity Cards & Graphs */}
      <FinancialHealthVelocitySection
        healthData={healthData}
        analyticsData={analyticsData}
      />

      {/* 🏷️ Section 3: Category & Merchant Deep-Dive Visualizations */}
      <CategoryMerchantDeepDiveSection
        analyticsData={analyticsData}
        transactions={transactionsList}
      />

      {/* 🎯 Section 4: Savings Goals & Financial Buffer Analytics */}
      <SavingsGoalsBufferSection
        goalSummary={goalSummary}
        analyticsData={analyticsData}
      />

      {/* 🔮 Section 5: AI Insights & Financial Projections */}
      <AiInsightsProjectionsSection
        analyticsData={analyticsData}
      />
    </div>
  );
}
