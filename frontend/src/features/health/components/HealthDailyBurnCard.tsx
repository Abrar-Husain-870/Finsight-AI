import React, { useState } from 'react';
import { cn } from '../../../lib/utils.js';
import { Flame, ArrowDownRight, TrendingDown } from 'lucide-react';

interface DayBar {
  day: string;
  amount: number;
  isPeak?: boolean;
}

export function HealthDailyBurnCard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 14 days outflow velocity
  const days: DayBar[] = [
    { day: 'Sep 1', amount: 850 },
    { day: 'Sep 2', amount: 1200 },
    { day: 'Sep 3', amount: 650 },
    { day: 'Sep 4', amount: 2100 },
    { day: 'Sep 5', amount: 950 },
    { day: 'Sep 6', amount: 1400 },
    { day: 'Sep 7', amount: 750 },
    { day: 'Sep 8', amount: 1800 },
    { day: 'Sep 9', amount: 500 },
    { day: 'Sep 10', amount: 2450, isPeak: true },
    { day: 'Sep 11', amount: 1100 },
    { day: 'Sep 12', amount: 1300 },
    { day: 'Sep 13', amount: 900 },
    { day: 'Sep 14', amount: 1650 },
  ];

  const maxAmount = 2500;

  return (
    <div className="h-full flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Daily Spending Trend
          </h3>
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
            Last 14 Days
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
          Daily cash outflow velocity vs budget limit
        </p>

        {/* Bar Chart Area */}
        <div className="mt-3.5 relative">
          <div className="flex justify-between items-center text-[10px] text-[var(--color-text-secondary)]/70 pb-1">
            <span>₹2.5k (Cap)</span>
            <span>₹1.2k (Target)</span>
            <span>₹0</span>
          </div>

          <div className="relative h-36 flex items-end justify-between gap-1.5 pt-2 pb-1 border-b border-[var(--color-border-primary)]/50">
            {/* Grid line indicator */}
            <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-[var(--color-border-primary)]/60 pointer-events-none" />

            {days.map((item, idx) => {
              const heightPct = Math.min(100, Math.max(10, (item.amount / maxAmount) * 100));
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating tooltip */}
                  {isHovered && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[10px] font-semibold text-[var(--color-text-primary)] whitespace-nowrap shadow-md z-20 pointer-events-none">
                      {item.day}: ₹{item.amount}
                    </div>
                  )}

                  {/* The bar */}
                  <div
                    className={cn(
                      "w-full max-w-[15px] rounded-t transition-all duration-200",
                      item.isPeak
                        ? "bg-emerald-400 dark:bg-emerald-400"
                        : isHovered
                        ? "bg-emerald-500/80 dark:bg-emerald-500/80"
                        : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                    )}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Velocity summary stats */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/60">
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium block">7-Day Run Pace</span>
            <span className="text-xs font-bold text-[var(--color-text-primary)] tabular-nums">₹1,180 / day</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]/60">
            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium block">Burn Velocity</span>
            <span className="text-xs font-bold text-emerald-500">Normal (62% cap)</span>
          </div>
        </div>
      </div>

      {/* Footer metric */}
      <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)]/60 flex items-center justify-between text-xs">
        <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
          <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
          Average Outflow
        </span>
        <span className="font-semibold text-emerald-500 tabular-nums">
          ₹1,260 / day <span className="text-[var(--color-text-secondary)] font-normal">(Within Limit)</span>
        </span>
      </div>
    </div>
  );
}

export default HealthDailyBurnCard;
