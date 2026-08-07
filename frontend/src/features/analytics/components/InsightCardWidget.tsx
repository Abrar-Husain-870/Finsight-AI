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
      isPositive ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50" : 
      isWarning ? "bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/50" :
      isNegative ? "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50" :
      "bg-[var(--color-bg-primary)] border-[var(--color-border-primary)]"
    )}>
      <div className="flex items-center gap-2">
        {isPositive && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />}
        {isNegative && <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-500" />}
        {isWarning && <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />}
        {!isPositive && !isNegative && !isWarning && <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
        <h4 className={cn("font-semibold", 
          isPositive ? "text-green-900 dark:text-green-400" :
          isWarning ? "text-yellow-900 dark:text-yellow-400" :
          isNegative ? "text-red-900 dark:text-red-400" :
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
