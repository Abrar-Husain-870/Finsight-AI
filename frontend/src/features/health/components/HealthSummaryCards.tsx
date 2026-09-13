import React from 'react';
import { ShieldCheck, CreditCard, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface HealthSummaryCardsProps {
  score?: number;
  trend?: number;
}

export function HealthSummaryCards({ score = 88, trend = 4 }: HealthSummaryCardsProps) {
  const cardStyle = "flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-all hover:border-slate-300 dark:hover:border-white/[0.14]";
  const iconContainerStyle = "p-1.5 rounded-lg bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* 1. Health Score Card */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Health Score
          </span>
          <div className={cn(iconContainerStyle, "text-emerald-500")}>
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
            {score} <span className="text-sm font-semibold text-[var(--color-text-secondary)]">/ 100</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +{trend} pts vs last month
          </span>
          {/* Micro Sparkline Curve */}
          <svg width="60" height="20" className="overflow-visible stroke-emerald-500 fill-none stroke-2">
            <path d="M 0 16 Q 15 14, 30 8 T 60 4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 2. Emergency Runway Buffer */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Emergency Runway
          </span>
          <div className={cn(iconContainerStyle, "text-emerald-500")}>
            <Wallet className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
            5.8 <span className="text-base font-semibold text-[var(--color-text-secondary)]">Months</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +0.6 mo vs last month
          </span>
          {/* Micro Sparkline Curve */}
          <svg width="60" height="20" className="overflow-visible stroke-emerald-500 fill-none stroke-2">
            <path d="M 0 14 Q 20 12, 40 6 T 60 3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 3. Fixed Commitments Load */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Fixed Commitments
          </span>
          <div className={cn(iconContainerStyle, "text-slate-400")}>
            <CreditCard className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
            26.4%
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
            <ArrowDownRight className="h-3.5 w-3.5" />
            -2.1% (Safe &lt; 35%)
          </span>
          {/* Micro Sparkline Curve */}
          <svg width="60" height="20" className="overflow-visible stroke-emerald-500/70 fill-none stroke-2">
            <path d="M 0 6 Q 20 10, 40 14 T 60 16" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 4. Savings Velocity / Retention */}
      <div className={cn(cardStyle, "flex-row items-center")}>
        {/* Left: Circular mini progress ring matching reference image */}
        <div className="relative flex items-center justify-center h-14 w-14 shrink-0">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              strokeWidth="5"
              fill="transparent"
              className="stroke-neutral-200 dark:stroke-neutral-800"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              strokeWidth="5"
              fill="transparent"
              className="stroke-emerald-500"
              strokeDasharray={2 * Math.PI * 22}
              strokeDashoffset={2 * Math.PI * 22 * (1 - 0.382)}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-[var(--color-text-primary)]">
            38%
          </span>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col text-right">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Savings Rate
          </span>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums mt-0.5">
            38.2%
          </span>
          <span className="text-xs font-semibold text-emerald-500 mt-1">
            ↑ +5.4% <span className="text-[var(--color-text-secondary)] font-normal">(Goal: 20%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default HealthSummaryCards;
