
import React from 'react';
import { useHealthScore } from '../features/health/hooks/useHealth.js';
import { ScoreCircle } from '../features/health/components/ScoreCircle.js';
import { ComponentCard } from '../features/health/components/ComponentCard.js';
import { RecommendationCard } from '../features/health/components/RecommendationCard.js';
import { HealthTrendChart } from '../features/health/components/HealthTrendChart.js';
import { WidgetContainer } from '../components/ui/WidgetContainer.js';
import { Activity } from 'lucide-react';
import { ErrorState } from '../components/ui/ErrorState.js';

export default function HealthPage() {
  const { data, isLoading, isError, error, refetch } = useHealthScore();

  if (isLoading || (!data && !isError)) {
    return (
      <div className="flex h-full flex-col p-6 max-w-5xl mx-auto w-full gap-6">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="h-64 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6 max-w-5xl mx-auto w-full gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Health</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Your deterministic financial stability score and actionable recommendations.</p>
      </div>

      {isError ? (
        <ErrorState 
          title="Failed to load health score"
          description={error instanceof Error ? error.message : 'An unexpected error occurred while calculating your score.'}
          onRetry={refetch}
        />
      ) : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm">
          <ScoreCircle score={data.overallScore} trend={data.trend} />
          <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
            Based on {data.components.length} core metrics across your latest 30-day activity.
          </p>
        </div>
        <div className="md:col-span-2">
          <WidgetContainer title="Health Trend (Last 6 Months)">
            <HealthTrendChart data={data.history} />
          </WidgetContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Activity className="h-5 w-5" /> Score Breakdown
          </h3>
          {data.components.map(c => (
            <ComponentCard key={c.name} component={c} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            Recommendations
          </h3>
          {data.recommendations.length > 0 ? data.recommendations.map(r => (
            <RecommendationCard key={r.id} recommendation={r} />
          )) : (
            <div className="p-8 text-center rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm">
              <span className="text-4xl">🎉</span>
              <h4 className="mt-4 font-semibold text-[var(--color-text-primary)]">Perfect Health</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">You have no critical recommendations at this time. Keep up the great work!</p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
