import React from 'react';
import { InsightCard } from '@finsight/shared';
import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export function InsightCardWidget({ insight }: { insight: InsightCard }) {
  const isPositive = insight.type === 'POSITIVE';
  const isWarning = insight.type === 'WARNING';
  const isNegative = insight.type === 'NEGATIVE';
  
  return (
    <div className={cn("p-4 rounded-xl border shadow-sm flex flex-col gap-2", 
      isPositive ? "bg-[var(--color-success-muted)] border-[var(--color-success)]/30" : 
      isWarning ? "bg-[var(--color-warning-muted)] border-[var(--color-warning)]/30" :
      isNegative ? "bg-[var(--color-danger-muted)] border-[var(--color-danger)]/30" :
      "bg-[var(--color-bg-primary)] border-[var(--color-border-primary)]"
    )}>
      <div className="flex items-center gap-2">
        {isPositive && <TrendingUp className="h-5 w-5 text-[var(--color-success)]" />}
        {isNegative && <TrendingDown className="h-5 w-5 text-[var(--color-danger)]" />}
        {isWarning && <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />}
        {!isPositive && !isNegative && !isWarning && <Lightbulb className="h-5 w-5 text-[var(--color-ai-accent)]" />}
        <h4 className={cn("font-semibold", 
          isPositive ? "text-[var(--color-success)]" :
          isWarning ? "text-[var(--color-warning)]" :
          isNegative ? "text-[var(--color-danger)]" :
          "text-[var(--color-text-primary)]"
        )}>{insight.title}</h4>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)]">{insight.description}</p>
      {insight.actionable && (
        <p className="text-xs font-medium mt-1 text-[var(--color-text-primary)] opacity-80">{insight.actionable}</p>
      )}
    </div>
  );
}
