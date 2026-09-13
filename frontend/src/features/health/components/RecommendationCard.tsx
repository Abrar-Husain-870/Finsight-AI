
import React from 'react';
import { HealthRecommendation } from '@finsight/shared';
import { Target, ArrowUpRight, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils.js';

export function RecommendationCard({ recommendation }: { recommendation: HealthRecommendation }) {
  const navigate = useNavigate();
  const isHigh = recommendation.impact === 'HIGH';
  const isMedium = recommendation.impact === 'MEDIUM';

  const upsidePts = isHigh ? '+6 pts' : isMedium ? '+4 pts' : '+2 pts';

  const handleAction = () => {
    if (recommendation.title.toLowerCase().includes('spend') || recommendation.title.toLowerCase().includes('expense')) {
      navigate('/analytics');
    } else if (recommendation.title.toLowerCase().includes('goal') || recommendation.title.toLowerCase().includes('save')) {
      navigate('/goals');
    } else {
      navigate('/ai-coach');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3.5 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] shadow-2xs transition-all hover:border-slate-300 dark:hover:border-white/[0.14] sm:items-center justify-between">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={cn(
            'p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0',
            isHigh
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              : isMedium
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          )}
        >
          <Target className="h-4 w-4" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
              {recommendation.title}
            </h4>
            <span
              className={cn(
                'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase border',
                isHigh
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : isMedium
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              )}
            >
              {recommendation.impact} Impact
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
              {upsidePts} Upside
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
            {recommendation.description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAction}
        className="inline-flex items-center justify-center gap-1 shrink-0 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-white/[0.06] text-xs font-semibold text-[var(--color-text-primary)] hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 transition-all cursor-pointer shadow-2xs self-end sm:self-center"
      >
        <span>Action</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default RecommendationCard;

