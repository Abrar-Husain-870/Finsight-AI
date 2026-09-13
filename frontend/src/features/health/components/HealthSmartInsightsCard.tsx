import React from 'react';
import { TrendingUp, ShieldCheck, CreditCard, ChevronRight, Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils.js';

interface InsightItem {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  route: string;
}

export function HealthSmartInsightsCard() {
  const navigate = useNavigate();

  const insights: InsightItem[] = [
    {
      id: 'savings-rate',
      icon: TrendingUp,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500',
      title: 'Savings rate is in top 15%',
      subtitle: "You're in the top 15% of peer savers this month.",
      route: '/goals',
    },
    {
      id: 'commitments-safe',
      icon: ShieldCheck,
      iconBg: 'bg-slate-500/10 border-slate-500/20',
      iconColor: 'text-slate-400',
      title: 'Fixed commitments at 26.4%',
      subtitle: 'Well under the 35% maximum stress threshold.',
      route: '/analytics',
    },
    {
      id: 'discretionary-spike',
      icon: CreditCard,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      title: 'Discretionary spending is +6%',
      subtitle: 'Review dining & entertainment to stay on track.',
      route: '/analytics',
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-emerald-500" />
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            Smart Insights
          </h3>
        </div>

        {/* Insight Rows */}
        <div className="flex flex-col gap-2.5">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.route)}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] hover:bg-slate-100/90 dark:hover:bg-white/[0.07] hover:border-slate-300 dark:hover:border-white/[0.15] transition-all cursor-pointer text-left w-full shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={cn('p-2 rounded-lg border shrink-0', item.iconBg, item.iconColor)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate group-hover:text-emerald-500 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[var(--color-text-secondary)] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/[0.08] text-center">
        <button
          type="button"
          onClick={() => navigate('/ai-coach')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-emerald-500 transition-colors cursor-pointer"
        >
          <span>View all AI diagnostics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default HealthSmartInsightsCard;
