
import React from 'react';
import { ScoreComponent } from '@finsight/shared';
import { cn } from '../../../lib/utils.js';
import { CheckCircle2, AlertCircle, XCircle, Activity, Sparkles } from 'lucide-react';

export function ComponentCard({ component }: { component: ScoreComponent }) {
  const isExcellent = component.status === 'EXCELLENT';
  const isGood = component.status === 'GOOD';
  const isNeedsWork = component.status === 'NEEDS_WORK';
  const isCritical = component.status === 'CRITICAL';

  const statusLabel = isExcellent ? 'Optimal' : isGood ? 'Stable' : isNeedsWork ? 'Needs Work' : 'Critical';
  const statusColor = isExcellent
    ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    : isGood
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : isNeedsWork
    ? 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    : 'text-slate-500 bg-slate-500/10 border-slate-500/20';

  const barColor = isExcellent
    ? 'bg-emerald-500'
    : isGood
    ? 'bg-emerald-400'
    : isNeedsWork
    ? 'bg-slate-400'
    : 'bg-slate-600';

  return (
    <div className="flex items-center gap-3.5 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] shadow-2xs transition-all hover:border-slate-300 dark:hover:border-white/[0.14] group">
      {/* Icon Badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.08]">
        {isExcellent && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        {isGood && <Activity className="h-4 w-4 text-emerald-400" />}
        {isNeedsWork && <AlertCircle className="h-4 w-4 text-slate-400" />}
        {isCritical && <XCircle className="h-4 w-4 text-slate-500" />}
      </div>

      {/* Progress & Factor Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-xs text-[var(--color-text-primary)] truncate">
            {component.name}
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn('text-[9px] px-1.5 py-0.2 rounded-full font-semibold border', statusColor)}>
              {statusLabel}
            </span>
            <span className="font-bold text-xs text-[var(--color-text-primary)] tabular-nums">
              {component.score}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/[0.08]">
          <div
            className={cn('h-full rounded-full transition-all duration-700 ease-out', barColor)}
            style={{ width: `${Math.min(100, Math.max(0, component.score))}%` }}
          />
        </div>

        {/* Subtitle / Explanation */}
        <p className="mt-1 text-[10.5px] text-[var(--color-text-secondary)] truncate leading-tight">
          {component.explanation}
        </p>
      </div>
    </div>
  );
}

export default ComponentCard;

