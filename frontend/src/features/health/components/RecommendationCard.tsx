
import React from 'react';
import { HealthRecommendation } from '@finsight/shared';
import { Target } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export function RecommendationCard({ recommendation }: { recommendation: HealthRecommendation }) {
  const isHigh = recommendation.impact === 'HIGH';
  const isMedium = recommendation.impact === 'MEDIUM';

  return (
    <div className="flex gap-4 p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-sm items-start">
      <div className={cn("p-2 rounded-lg", 
        isHigh ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
        isMedium ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      )}>
        <Target className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[var(--color-text-primary)]">{recommendation.title}</h4>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", 
            isHigh ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" :
            isMedium ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" :
            "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
          )}>
            {recommendation.impact} IMPACT
          </span>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{recommendation.description}</p>
      </div>
    </div>
  );
}
