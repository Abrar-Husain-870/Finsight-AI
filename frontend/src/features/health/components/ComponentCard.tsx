
import React from 'react';
import { ScoreComponent } from '@finsight/shared';
import { cn } from '../../../lib/utils.js';
import { CheckCircle2, AlertCircle, XCircle, Activity } from 'lucide-react';

export function ComponentCard({ component }: { component: ScoreComponent }) {
  const isExcellent = component.status === 'EXCELLENT';
  const isGood = component.status === 'GOOD';
  const isNeedsWork = component.status === 'NEEDS_WORK';
  const isCritical = component.status === 'CRITICAL';

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isExcellent && <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />}
          {isGood && <Activity className="h-5 w-5 text-[var(--color-ai-accent)]" />}
          {isNeedsWork && <AlertCircle className="h-5 w-5 text-[var(--color-warning)]" />}
          {isCritical && <XCircle className="h-5 w-5 text-[var(--color-danger)]" />}
          <span className="font-semibold text-[var(--color-text-primary)]">{component.name}</span>
        </div>
        <span className={cn("font-bold", 
          isExcellent ? "text-[var(--color-success)]" :
          isGood ? "text-[var(--color-ai-accent)]" :
          isNeedsWork ? "text-[var(--color-warning)]" :
          "text-[var(--color-danger)]"
        )}>{component.score}/100</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">{component.explanation}</p>
      <div className="mt-2 w-full bg-[var(--color-bg-secondary)] rounded-full h-1.5">
        <div 
          className={cn("h-1.5 rounded-full transition-all duration-500", 
            isExcellent ? "bg-[var(--color-success)]" :
            isGood ? "bg-[var(--color-ai-accent)]" :
            isNeedsWork ? "bg-[var(--color-warning)]" :
            "bg-[var(--color-danger)]"
          )} 
          style={{ width: `${component.score}%` }}
        ></div>
      </div>
    </div>
  );
}
