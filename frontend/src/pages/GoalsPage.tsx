
import React, { useState } from 'react';
import { useGoalSummary } from '../features/goals/hooks/useGoals.js';
import { GoalResponse } from '@finsight/shared';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { GoalCard } from '../features/goals/components/GoalCard.js';
import { GoalPlanner } from '../features/goals/components/GoalPlanner.js';
import { Target, Flag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { ErrorState } from '../components/ui/ErrorState.js';
import { EmptyState } from '../components/ui/EmptyState.js';
import { Button } from '../components/ui/Button.js';

export default function GoalsPage() {
  const { data, isLoading, isError, error, refetch } = useGoalSummary();
  const [plannerOpen, setPlannerOpen] = useState(false);
  const { formatMoney } = useCurrency();
  const [editingGoal, setEditingGoal] = useState<GoalResponse | undefined>(undefined);

  if (isLoading || (!data && !isError)) {
    return (
      <div className="flex h-full flex-col p-6 max-w-6xl mx-auto w-full gap-8">
        <div className="h-8 w-48 bg-[var(--color-bg-secondary)] animate-pulse rounded"></div>
        <div className="h-40 bg-[var(--color-bg-secondary)] animate-pulse rounded-xl"></div>
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
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-6xl mx-auto w-full gap-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Planning</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Track and optimize your path towards your financial goals.</p>
        </div>
        <Button onClick={() => openPlanner()}>
          + New Goal
        </Button>
      </div>

      {isError ? (
        <ErrorState 
          title="Failed to load goals"
          description={error instanceof Error ? error.message : "An unexpected error occurred"}
          onRetry={refetch}
        />
      ) : data && (
        <>
          <div className="flex flex-col md:flex-row gap-6 p-8 rounded-2xl bg-[var(--color-bg-secondary)]/30 backdrop-blur-sm border border-[var(--color-border-primary)]/30">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                <Flag className="h-4 w-4" /> Total Target
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
                {formatMoney(data.totalTarget)}
              </div>
            </div>
            
            <div className="hidden md:block w-px bg-[var(--color-border-primary)]/50"></div>
            
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                <Target className="h-4 w-4" /> Total Saved
              </div>
              <div className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">
                {formatMoney(data.totalCurrent)}
              </div>
            </div>
            
            <div className="hidden md:block w-px bg-[var(--color-border-primary)]/50"></div>

            <div className="flex flex-col gap-2 flex-[1.5]">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-[var(--color-text-secondary)]">Feasibility Indicator</div>
                <div className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", 
                  isUnrealistic ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]" :
                  isStretch ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                  "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                )}>
                  {data.overallFeasibility}
                </div>
              </div>
              <div className="flex justify-between items-end mt-1">
                <div className="text-sm font-medium text-[var(--color-text-secondary)]">Required Monthly</div>
                <div className="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">{formatMoney(data.totalRequiredMonthly)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Your Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.goals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} onClick={() => openPlanner(goal)} />
                ))}
                {data.goals.length === 0 && (
                  <div className="md:col-span-2 py-4">
                    <EmptyState
                      icon={Target}
                      title="No active goals"
                      description="Start planning your financial future by setting realistic targets for emergency funds, vacations, or new purchases."
                      action={<Button onClick={() => openPlanner()}>Create Your First Goal</Button>}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Planning Recommendations</h3>
              <div className="flex flex-col gap-4">
                {data.recommendations.map(r => (
                  <div key={r.id} className="p-5 rounded-[var(--radius-lg)] border border-[var(--color-border-primary)]/50 bg-[var(--color-bg-primary)] shadow-sm hover:shadow-md transition-shadow flex gap-3 items-start group">
                    {r.text.includes('exceed') || r.text.includes('unrealistic') ? (
                      <AlertCircle className="h-5 w-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
                    ) : r.text.includes('aggressive') ? (
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{r.text}</p>
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
