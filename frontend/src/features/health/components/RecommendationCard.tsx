
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
        isHigh ? "bg-[var(--color-danger-muted)] text-[var(--color-danger)]" :
        isMedium ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)]" :
        "bg-[var(--color-ai-bg)] text-[var(--color-ai-accent)]"
      )}>
        <Target className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[var(--color-text-primary)]">{recommendation.title}</h4>
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", 
            isHigh ? "bg-[var(--color-danger-muted)] text-[var(--color-danger)] border border-[var(--color-danger)]/20" :
            isMedium ? "bg-[var(--color-warning-muted)] text-[var(--color-warning)] border border-[var(--color-warning)]/20" :
            "bg-[var(--color-ai-bg)] text-[var(--color-ai-accent)] border border-[var(--color-ai-muted)]"
          )}>
            {recommendation.impact} IMPACT
          </span>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">{recommendation.description}</p>
      </div>
    </div>
  );
}
