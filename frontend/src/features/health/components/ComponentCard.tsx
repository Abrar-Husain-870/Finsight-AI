
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
          {isExcellent && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          {isGood && <Activity className="h-5 w-5 text-blue-500" />}
          {isNeedsWork && <AlertCircle className="h-5 w-5 text-yellow-500" />}
          {isCritical && <XCircle className="h-5 w-5 text-red-500" />}
          <span className="font-semibold text-[var(--color-text-primary)]">{component.name}</span>
        </div>
        <span className={cn("font-bold", 
          isExcellent ? "text-green-500" :
          isGood ? "text-blue-500" :
          isNeedsWork ? "text-yellow-500" :
          "text-red-500"
        )}>{component.score}/100</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">{component.explanation}</p>
      <div className="mt-2 w-full bg-[var(--color-bg-secondary)] rounded-full h-1.5">
        <div 
          className={cn("h-1.5 rounded-full transition-all duration-500", 
            isExcellent ? "bg-green-500" :
            isGood ? "bg-blue-500" :
            isNeedsWork ? "bg-yellow-500" :
            "bg-red-500"
          )} 
          style={{ width: `${component.score}%` }}
        ></div>
      </div>
    </div>
  );
}
