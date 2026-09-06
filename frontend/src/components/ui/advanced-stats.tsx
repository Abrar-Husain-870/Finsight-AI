'use client';

import React, { useRef } from 'react';
import { cn } from '../../lib/utils.js';
import { ClippedAreaChart } from './advanced-stats-utils/charts.js';
import { TimelineAnimation } from './advanced-stats-utils/timeline-animation.js';
import { Wallet, TrendingUp, TrendingDown, Target, ShieldCheck } from 'lucide-react';

export interface KPIItem {
  label: string;
  value: string;
  change: string;
  status: 'up' | 'down';
}

export interface AdvancedStatsProps {
  kpis?: KPIItem[];
  primaryGoalName?: string;
  primaryGoalProgress?: number;
  primaryGoalTarget?: string;
  className?: string;
}

const defaultKpis: KPIItem[] = [
  { label: 'Total Net Position', value: '₹12,47,208', change: '+12.5%', status: 'up' },
  { label: 'Monthly Income', value: '₹68,328', change: '+4.2%', status: 'up' },
  { label: 'Monthly Expenses', value: '₹56,391', change: '-8.1%', status: 'down' },
  { label: 'Savings Rate', value: '17.5%', change: '+2.4%', status: 'up' },
];

export function AdvancedStats({
  kpis = defaultKpis,
  primaryGoalName = 'Emergency Reserve Fund',
  primaryGoalProgress = 82,
  primaryGoalTarget = '₹1,00,000',
  className,
}: AdvancedStatsProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={timelineRef}
      className={cn("flex flex-col gap-6 py-4 bg-transparent w-full text-[var(--color-text-primary)]", className)}
    >
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Chart Section */}
          <TimelineAnimation
            animationNum={1}
            timelineRef={timelineRef}
            className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] shadow-xs"
          >
            <ClippedAreaChart />
          </TimelineAnimation>

          {/* Breakdown Section */}
          <div className="flex flex-col gap-6 h-full justify-between">
            {/* Primary Goal Card (Contrast Dark Block) */}
            <TimelineAnimation
              animationNum={2}
              timelineRef={timelineRef}
              className="p-6 rounded-3xl h-full bg-zinc-900 dark:bg-zinc-800 text-white flex flex-col justify-between shadow-md border border-zinc-700/50 min-h-[160px]"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-amber-400" />
                  Primary Savings Goal
                </p>
                <h4 className="text-xl font-bold tracking-tight text-white mt-1">
                  {primaryGoalName}
                </h4>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-extrabold tracking-tight tabular-nums text-white">
                    {primaryGoalProgress}%
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 mb-1">
                    Target: {primaryGoalTarget}
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500" 
                    style={{ width: `${primaryGoalProgress}%` }}
                  />
                </div>
              </div>
            </TimelineAnimation>

            {/* Financial Growth Card */}
            <TimelineAnimation
              animationNum={3}
              timelineRef={timelineRef}
              className="p-6 rounded-3xl h-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] shadow-xs flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] flex items-center justify-center text-[var(--color-text-primary)]">
                  <ShieldCheck className="w-5 h-5 text-[var(--color-text-primary)]" />
                </div>
                <h4 className="font-bold text-base text-[var(--color-text-primary)]">Financial Growth</h4>
              </div>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Organic net savings are up{' '}
                <span className="text-[var(--color-text-primary)] font-bold">24%</span>{' '}
                compared to previous quarter.
              </p>
            </TimelineAnimation>
          </div>
        </div>

        {/* 4 KPI Row Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {kpis.map((kpi, index) => (
            <TimelineAnimation
              animationNum={4 + index}
              timelineRef={timelineRef}
              key={kpi.label}
              className={cn(
                'p-4 sm:p-5 rounded-2xl border bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] shadow-2xs transition-all hover:border-[var(--color-border-hover)] overflow-hidden flex flex-col justify-between',
              )}
            >
              <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 truncate">
                {kpi.label}
              </p>
              <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                <p className="text-base sm:text-lg md:text-xl font-extrabold text-[var(--color-text-primary)] tracking-tight tabular-nums truncate min-w-0 flex-1">
                  {kpi.value}
                </p>
                <span
                  className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 whitespace-nowrap',
                    kpi.status === 'up'
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  )}
                >
                  {kpi.status === 'up' ? <TrendingUp className="w-3 h-3 shrink-0" /> : <TrendingDown className="w-3 h-3 shrink-0" />}
                  {kpi.change}
                </span>
              </div>
            </TimelineAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdvancedStats;
