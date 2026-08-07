
import React, { useState } from 'react';
import { useGoalSummary } from '../features/goals/hooks/useGoals.js';
import { GoalResponse, formatMoney } from '@finsight/shared';
import { GoalCard } from '../features/goals/components/GoalCard.js';
import { GoalPlanner } from '../features/goals/components/GoalPlanner.js';
import { MetricCard } from '../components/ui/MetricCard.js';
import { Target, Flag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { EmptyState } from '../components/ui/EmptyState.js';

export default function GoalsPage() {
  const { data, isLoading, isError, error, refetch } = useGoalSummary();
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalResponse | undefined>(undefined);

  if (isLoading || (!data && !isError)) {
    return (
      <div className="flex h-full flex-col p-6 max-w-6xl mx-auto w-full gap-6">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="h-32 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
      </div>
    );
  }

  const openPlanner = (goal?: GoalResponse) => {
    setEditingGoal(goal);
    setPlannerOpen(true);
  };

  const isStretch = data?.overallFeasibility === 'STRETCH';
  const isUnrealistic = data?.overallFeasibility === 'UNREALISTIC';

  return (
    <div className="flex h-full flex-col p-6 max-w-6xl mx-auto w-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Planning</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Track and optimize your path towards your financial goals.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={() => openPlanner()}>+ New Goal</button>
      </div>

      {isError ? (
        <ErrorState 
          title="Failed to load goals"
          description={error instanceof Error ? error.message : "An unexpected error occurred"}
          onRetry={refetch}
        />
      ) : data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Total Target" value={formatMoney(data.totalTarget)} icon={Flag} />
            <MetricCard title="Total Saved" value={formatMoney(data.totalCurrent)} icon={Target} />
            <div className={cn("p-6 rounded-xl border shadow-sm md:col-span-2 flex flex-col justify-center", 
              isUnrealistic ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50" :
              isStretch ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/50" :
              "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50"
            )}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">Feasibility Indicator</div>
                  <div className={cn("mt-1 text-2xl font-bold", 
                    isUnrealistic ? "text-red-700 dark:text-red-400" :
                    isStretch ? "text-yellow-700 dark:text-yellow-400" :
                    "text-green-700 dark:text-green-400"
                  )}>
                    {data.overallFeasibility}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[var(--color-text-secondary)]">Required Monthly</div>
                  <div className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{formatMoney(data.totalRequiredMonthly)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.goals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} onClick={() => openPlanner(goal)} />
                ))}
                {data.goals.length === 0 && (
                  <div className="md:col-span-2">
                    <EmptyState
                      icon={Target}
                      title="No active goals"
                      description="Start planning your financial future by setting realistic targets for emergency funds, vacations, or new purchases."
                      action={<button onClick={() => openPlanner()} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">Create Your First Goal</button>}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Planning Recommendations</h3>
              <div className="flex flex-col gap-3">
                {data.recommendations.map(r => (
                  <div key={r.id} className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm flex gap-3 items-start">
                    {r.text.includes('exceed') || r.text.includes('unrealistic') ? (
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    ) : r.text.includes('aggressive') ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-[var(--color-text-primary)]">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {plannerOpen && (
        <GoalPlanner goal={editingGoal} onClose={() => { setPlannerOpen(false); setEditingGoal(undefined); }} />
      )}
    </div>
  );
}
