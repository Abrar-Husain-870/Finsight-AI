import React from 'react';
import { Zap, AlertTriangle, ArrowUpRight, ShieldCheck, Flame, TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export function HealthStressTestMatrix() {
  const scenarios = [
    {
      id: 'income-shock',
      icon: ShieldCheck,
      title: '3-Month Income Loss',
      subtitle: 'Complete revenue stoppage',
      badge: '100% Protected',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      runway: '5.8 Months Buffer',
      impactMetric: '₹0 Liquidation Required',
      description: 'Liquid cash reserves sustain all baseline fixed costs, utilities, and debt payments for 174 days without touching long-term investments.',
    },
    {
      id: 'emergency-expense',
      icon: Flame,
      title: '₹1,00,000 Major Expense',
      subtitle: 'Unplanned medical/repair shock',
      badge: 'Instant Absorption',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      runway: '₹2.02L Buffer Left',
      impactMetric: '18-Day Goal Shift',
      description: 'Emergency reserve absorbs the full ₹1.0L expense instantly. Core wealth and monthly surplus recover the buffer within 3 pay cycles.',
    },
    {
      id: 'inflation-surge',
      icon: TrendingUp,
      title: '15% Cost-of-Living Spike',
      subtitle: 'Macro food & energy inflation',
      badge: 'Surplus Intact',
      badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      runway: '+₹44.2k/mo Surplus',
      impactMetric: '+₹7.8k Monthly Shift',
      description: 'High capital retention rate comfortably absorbs the higher expense load while maintaining positive monthly wealth accumulation.',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-emerald-500" />
            Financial Shock Resilience & Stress Tests
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Deterministic simulation of portfolio survivability against unforeseen life disruptions.
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Resilience Grade: A+
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="flex flex-col justify-between p-4.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all hover:border-slate-300 dark:hover:border-white/[0.14]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-primary)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">
                        {s.title}
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/[0.08]">
                  <span className={cn('text-[10.5px] px-2 py-0.5 rounded-full font-semibold border', s.badgeColor)}>
                    {s.badge}
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] tabular-nums">
                    {s.runway}
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-[11px]">
                <span className="text-[var(--color-text-secondary)]">Portfolio Impact</span>
                <span className="font-semibold text-emerald-500">{s.impactMetric}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HealthStressTestMatrix;
