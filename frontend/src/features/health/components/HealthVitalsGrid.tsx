import React from 'react';
import { ShieldCheck, CreditCard, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface HealthVitalsGridProps {
  score?: number;
}

export function HealthVitalsGrid({ score = 88 }: HealthVitalsGridProps) {
  const vitals = [
    {
      id: 'emergency-runway',
      title: 'Emergency Runway',
      value: '5.8 Months',
      target: '6.0 Months Target',
      percentage: 96,
      status: 'Optimal Buffer',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Liquid cash reserves cover ₹3.02L in essential living costs without selling investments.',
      icon: ShieldCheck,
    },
    {
      id: 'fixed-burden',
      title: 'Fixed Commitments',
      value: '26.4%',
      target: '< 35% Safe Zone',
      percentage: 26,
      status: 'Low Burden',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Fixed recurring subscriptions, rent, and bills take ₹39.1K of monthly inflow.',
      icon: CreditCard,
    },
    {
      id: 'retention-velocity',
      title: 'Capital Retention',
      value: '38.2%',
      target: '> 20% Benchmark',
      percentage: 76,
      status: 'High Velocity',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: '₹56.5K monthly net surplus successfully captured into wealth vaults.',
      icon: TrendingUp,
    },
    {
      id: 'spend-volatility',
      title: 'Spending Volatility',
      value: '12.4%',
      target: '< 20% Variance',
      percentage: 38,
      status: 'Disciplined',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: 'Day-to-day discretionary expenditure remains bounded within safe 1σ baseline.',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
          Core Health Vitals & Ratios
        </h3>
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">
          4 Determinstic Pillars
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] shadow-xs transition-all hover:border-[var(--color-border-primary)]/80"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                    {item.title}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)]">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
                    {item.value}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-semibold border',
                      item.statusColor
                    )}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-2.5 w-full bg-[var(--color-bg-primary)] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)]/60">
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HealthVitalsGrid;
