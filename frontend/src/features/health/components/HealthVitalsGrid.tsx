import React from 'react';
import { ShieldCheck, CreditCard, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';

interface HealthVitalsGridProps {
  score?: number;
}

export function HealthVitalsGrid({ score = 88 }: HealthVitalsGridProps) {
  const { symbol, currency } = useCurrency();
  const isINR = currency === 'INR';

  const vitals = [
    {
      id: 'emergency-runway',
      title: 'Emergency Runway',
      value: '5.8 Months',
      target: '6.0 Months Target',
      percentage: 96,
      status: 'Optimal Buffer',
      statusColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      description: `Liquid cash reserves cover ${isINR ? '₹3.02L' : `${symbol}30.2k`} in essential living costs without selling investments.`,
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
      description: `Fixed recurring subscriptions, rent, and bills take ${symbol}39.1k of monthly inflow.`,
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
      description: `${symbol}56.5k monthly net surplus successfully captured into wealth vaults.`,
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
      description: 'Monthly spend variance remains securely within the 15% predictability target band.',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          Core Solvency & Velocity Vitals
        </h3>
        <span className="text-xs text-[var(--color-text-secondary)]">
          Target Compliance: <span className="font-semibold text-emerald-500">4 / 4 Passed</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-4.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all hover:border-slate-300 dark:hover:border-white/[0.14]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                      {item.title}
                    </span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                </div>

                {/* Score + Target */}
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
                    {item.value}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                    {item.target}
                  </span>
                </div>

                {/* Mini progress bar */}
                <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>

                {/* Description */}
                <p className="mt-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Status footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-text-secondary)]">Target Status</span>
                <span className={cn('px-2 py-0.5 rounded-full font-semibold border text-[10px]', item.statusColor)}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HealthVitalsGrid;
