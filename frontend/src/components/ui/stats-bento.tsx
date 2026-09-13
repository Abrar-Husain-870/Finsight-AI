import React from "react";
import { Star, TrendingUp, ShieldCheck, Target } from "lucide-react";
import { MonthlyTrend, fromMinor } from "@finsight/shared";
import { cn } from "../../lib/utils.js";
import { useCurrency } from "../../lib/hooks/useCurrency.js";
import { StatsCardsWithLinks } from "./stats-cards-with-links.js";
import { StreakCard } from "./streak-card.js";

export interface StatsBentoProps {
  healthScore?: number;
  netCashFlow?: number;
  savingsRate?: number;
  goalsCount?: number;
  ratingScore?: number;
  monthlyTrend?: MonthlyTrend[];
  className?: string;
  isLoading?: boolean;
}

export function StatsBento({
  healthScore = 84,
  netCashFlow,
  savingsRate = 18.4,
  goalsCount = 12,
  ratingScore = 4.9,
  monthlyTrend,
  className,
  isLoading = false,
}: StatsBentoProps) {
  const { formatMoney } = useCurrency();

  const formattedCashFlow = netCashFlow !== undefined
    ? `${netCashFlow >= 0 ? '+' : ''}${formatMoney(netCashFlow)}`
    : "+₹11,936.96";

  const isPositive = netCashFlow !== undefined ? netCashFlow >= 0 : true;

  // Generate sparkline heights based on trend data or fallback default pattern
  const sparklineHeights = monthlyTrend && monthlyTrend.length > 0
    ? monthlyTrend.map(t => {
        const net = fromMinor(t.income - t.expense);
        const max = Math.max(...monthlyTrend.map(m => Math.abs(fromMinor(m.income - m.expense))), 1);
        return Math.max(15, Math.min(100, Math.round((Math.abs(net) / max) * 100)));
      })
    : [20, 35, 45, 30, 60, 50, 75, 65, 85, 90, 100];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-4 w-full max-w-7xl mx-auto">
        <div className="md:col-span-3 md:row-span-2 bg-[var(--color-bg-secondary)] rounded-3xl p-8 h-[320px] animate-pulse" />
        <div className="md:col-span-3 bg-[var(--color-bg-secondary)] rounded-3xl p-8 h-[150px] animate-pulse" />
        <div className="md:col-span-1 bg-[var(--color-bg-secondary)] rounded-3xl p-6 h-[150px] animate-pulse" />
        <div className="md:col-span-2 bg-[var(--color-bg-secondary)] rounded-3xl p-6 h-[150px] animate-pulse" />
      </div>
    );
  }

  return (
    <section className={cn("w-full py-4 bg-transparent text-[var(--color-text-primary)]", className)}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-7xl mx-auto">
        
        {/* Left Column: Financial Health - FORCED WHITE THEME */}
        <div className="md:col-span-3 !bg-white !text-slate-900 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative shadow-sm group hover:shadow-md transition-all">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[repeating-linear-gradient(45deg,#000000_0px_1px,transparent_1px_10px)] opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 text-[var(--chart-2)]" />
                Financial Health
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 pt-1">
              <h3 className="text-6xl sm:text-7xl font-bold tracking-tighter text-slate-900 tabular-nums">
                {healthScore}
              </h3>
              <span className="text-2xl font-bold text-slate-500">/100</span>
            </div>
          </div>

          <p className="relative z-10 text-slate-600 text-sm max-w-sm leading-relaxed pt-2 font-medium">
            A clear snapshot of your overall financial position.
          </p>
        </div>

        {/* Right Column: Net Cash Flow (Compact Natural Height) + StreakCard */}
        <div className="md:col-span-3 flex flex-col gap-4">
          {/* Net Cash Flow Card */}
          <div className="bg-[var(--card)] rounded-3xl px-6 sm:px-8 py-3.5 sm:py-4 border border-[var(--border)] flex items-center justify-between shadow-sm hover:border-[var(--border)] transition-all shrink-0">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-[var(--foreground)]" />
                Net Cash Flow
              </p>
              <p className={cn(
                "text-2xl sm:text-3xl font-bold tracking-tight tabular-nums",
                isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              )}>
                {formattedCashFlow}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] font-medium">
                {isPositive ? "Positive cash flow this period" : "Negative cash flow this period"}
              </p>
            </div>

            {/* Micro Sparkline Heights */}
            <div className="flex gap-1.5 items-end h-10 shrink-0 pl-4">
              {sparklineHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[var(--color-text-primary)] rounded-full transition-all duration-300 group-hover:bg-[var(--color-accent)]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Financial Streak Card */}
          <StreakCard className="flex-1" showHowItWorks={false} />
        </div>

      </div>

      {/* 4 Radial Progress Metric Cards Row */}
      <div className="max-w-7xl mx-auto mt-4">
        <StatsCardsWithLinks />
      </div>
    </section>
  );
}

export default StatsBento;
