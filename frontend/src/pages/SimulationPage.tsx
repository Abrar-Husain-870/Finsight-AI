"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRunSimulation } from '../features/simulation/hooks/useSimulation.js';
import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalytics.js';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { fromMinor } from '@finsight/shared';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  DollarSign,
  RefreshCw,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Briefcase,
  Car,
  Scissors,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { cn } from '../lib/utils.js';

interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  getShifts: (baselineIncome: number, baselineExpense: number) => { inc: number; exp: number };
}

export default function SimulationPage() {
  const simulation = useRunSimulation();
  const { data: analytics, isLoading: isAnalyticsLoading } = useAnalyticsSummary();
  const { formatMoney, symbol, currency } = useCurrency();

  const isINR = currency === 'INR';
  const defaultStep = isINR ? 1000 : 50;
  const defaultMaxRange = isINR ? 100000 : 5000;

  // Raw user inputs in major currency units (e.g. ₹20,000 or $500)
  const [incomeShiftMajor, setIncomeShiftMajor] = useState<number>(0);
  const [expenseShiftMajor, setExpenseShiftMajor] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string>('custom');

  // Baseline values from authentic ledger analytics (in major units)
  const baselineIncome = useMemo(() => {
    return analytics?.income?.total ? fromMinor(analytics.income.total) : 5000;
  }, [analytics]);

  const baselineExpense = useMemo(() => {
    return analytics?.expense?.total ? fromMinor(analytics.expense.total) : 3500;
  }, [analytics]);

  // Dynamic slider upper limits based on baseline or currency default
  const maxRange = useMemo(() => {
    const baselineMax = Math.max(baselineIncome, baselineExpense);
    return Math.max(defaultMaxRange, Math.round(baselineMax * 1.5 / defaultStep) * defaultStep);
  }, [baselineIncome, baselineExpense, defaultMaxRange, defaultStep]);

  // Quick Preset Scenarios
  const presets: ScenarioPreset[] = useMemo(() => [
    {
      id: 'promotion',
      name: 'Career Raise (+20%)',
      description: 'Simulate a 20% salary hike or senior promotion',
      icon: Briefcase,
      getShifts: (inc) => ({ inc: Math.round((inc * 0.20) / defaultStep) * defaultStep, exp: 0 }),
    },
    {
      id: 'lean',
      name: 'Lean Living (-15%)',
      description: 'Trim discretionary dining and recurring subscriptions',
      icon: Scissors,
      getShifts: (_, exp) => ({ inc: 0, exp: -Math.round((exp * 0.15) / defaultStep) * defaultStep }),
    },
    {
      id: 'side_hustle',
      name: 'Side Hustle (+Boost)',
      description: 'Freelance consulting or digital product revenue',
      icon: Zap,
      getShifts: () => ({ inc: isINR ? 25000 : 1000, exp: 0 }),
    },
    {
      id: 'emi_loan',
      name: 'New Car / Loan EMI',
      description: 'Stress-test adding a major new monthly loan payment',
      icon: Car,
      getShifts: () => ({ inc: 0, exp: isINR ? 18000 : 600 }),
    },
    {
      id: 'dual_boost',
      name: 'Aggressive Wealth Engine',
      description: '+15% income raise combined with -10% tighter expenses',
      icon: TrendingUp,
      getShifts: (inc, exp) => ({
        inc: Math.round((inc * 0.15) / defaultStep) * defaultStep,
        exp: -Math.round((exp * 0.10) / defaultStep) * defaultStep,
      }),
    },
  ], [defaultStep, isINR]);

  const applyPreset = (preset: ScenarioPreset) => {
    const shifts = preset.getShifts(baselineIncome, baselineExpense);
    setIncomeShiftMajor(shifts.inc);
    setExpenseShiftMajor(shifts.exp);
    setActivePreset(preset.id);
  };

  const handleReset = () => {
    setIncomeShiftMajor(0);
    setExpenseShiftMajor(0);
    setActivePreset('custom');
  };

  // Debounced execution to backend simulation endpoint (converts major units to minor units)
  useEffect(() => {
    const timer = setTimeout(() => {
      const incMinor = Math.round(incomeShiftMajor * 100);
      const expMinor = Math.round(expenseShiftMajor * 100);
      simulation.mutate({ incomeAdjustment: incMinor, expenseAdjustment: expMinor });
    }, 350);
    return () => clearTimeout(timer);
  }, [incomeShiftMajor, expenseShiftMajor]);

  const data = simulation.data;

  // 6-Month Cumulative Projection Trajectory Data
  const trajectoryData = useMemo(() => {
    const baselineMonthlySurplus = data ? fromMinor(data.baseline.cashFlow) : (baselineIncome - baselineExpense);
    const projectedMonthlySurplus = data ? fromMinor(data.projected.cashFlow) : (baselineIncome + incomeShiftMajor - (baselineExpense + expenseShiftMajor));

    return [
      { month: 'Start', baseline: 0, projected: 0, delta: 0 },
      { month: 'Month 1', baseline: Math.round(baselineMonthlySurplus * 1), projected: Math.round(projectedMonthlySurplus * 1), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 1) },
      { month: 'Month 2', baseline: Math.round(baselineMonthlySurplus * 2), projected: Math.round(projectedMonthlySurplus * 2), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 2) },
      { month: 'Month 3', baseline: Math.round(baselineMonthlySurplus * 3), projected: Math.round(projectedMonthlySurplus * 3), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 3) },
      { month: 'Month 4', baseline: Math.round(baselineMonthlySurplus * 4), projected: Math.round(projectedMonthlySurplus * 4), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 4) },
      { month: 'Month 5', baseline: Math.round(baselineMonthlySurplus * 5), projected: Math.round(projectedMonthlySurplus * 5), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 5) },
      { month: 'Month 6', baseline: Math.round(baselineMonthlySurplus * 6), projected: Math.round(projectedMonthlySurplus * 6), delta: Math.round((projectedMonthlySurplus - baselineMonthlySurplus) * 6) },
    ];
  }, [data, baselineIncome, baselineExpense, incomeShiftMajor, expenseShiftMajor]);

  const sixMonthExtraSurplus = trajectoryData[trajectoryData.length - 1]?.delta ?? 0;

  // Diagnostic takeaways based on simulation diff
  const diagnosticFeedback = useMemo(() => {
    if (!data) return null;
    const cashDiff = fromMinor(data.diff.cashFlow);
    const healthDiff = data.diff.healthScore;
    const isImproved = cashDiff > 0 || healthDiff > 0;
    const isCritical = cashDiff < 0 && data.projected.cashFlow < 0;

    let headline = "Balanced Scenario";
    let detail = "Your financial metrics remain at current baseline levels.";

    if (isCritical) {
      headline = "Deficit Spending Risk Detected";
      detail = `Adding ${symbol}${Math.abs(cashDiff).toLocaleString()} in net monthly pressure pushes cash flow into negative territory, accelerating liquid reserve depletion.`;
    } else if (cashDiff > 0 && healthDiff >= 5) {
      headline = "Significant Solvency Acceleration";
      detail = `Expanding monthly cash surplus by +${symbol}${cashDiff.toLocaleString()} adds +${healthDiff} points to your solvency index, creating an extra ${symbol}${Math.abs(sixMonthExtraSurplus).toLocaleString()} in liquid reserves over 6 months.`;
    } else if (cashDiff > 0) {
      headline = "Positive Cash Flow Expansion";
      detail = `This shift generates +${symbol}${cashDiff.toLocaleString()} in incremental monthly savings, strengthening your emergency buffer and goal pacing.`;
    } else if (cashDiff < 0) {
      headline = "Moderate Burn Contraction";
      detail = `Monthly savings surplus decreases by -${symbol}${Math.abs(cashDiff).toLocaleString()}. Active savings goals may require timeline extensions.`;
    }

    return { headline, detail, isImproved, isCritical };
  }, [data, symbol, sixMonthExtraSurplus]);

  return (
    <div className="flex h-full flex-col p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full gap-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border-primary)] pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)]">
              <Calculator className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Financial Scenario Simulation
            </h1>
            <span className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)] border border-[var(--theme-badge-border)]">
              Deterministic Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Stress-test what-if income adjustments, lifestyle changes, and new loans against your authentic ledger data.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)] shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", simulation.isPending && "animate-spin")} />
          <span>Reset Scenario</span>
        </button>
      </div>

      {/* Quick Scenario Preset Pills */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Quick Scenario Templates
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presets.map((p) => {
            const Icon = p.icon;
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                type="button"
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer group shadow-2xs",
                  isSelected
                    ? "bg-[var(--color-bg-primary)] border-[var(--theme-accent-highlight,var(--chart-2))] shadow-xs"
                    : "bg-[var(--color-bg-primary)] border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)]"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg shrink-0 transition-colors",
                  isSelected
                    ? "bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] line-clamp-1 mt-0.5">
                    {p.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Interactive Sliders & Inputs (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-[var(--color-border-primary)] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Scenario Parameters
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Adjust expected monthly shifts in income and expenses
                </p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)]">
                {currency}
              </span>
            </div>

            {/* Income Shift Controller */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                    Monthly Earned Income Shift
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    Baseline: {formatMoney(baselineIncome * 100)} / mo
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-sm font-bold font-mono px-2.5 py-1 rounded-lg border",
                    incomeShiftMajor > 0
                      ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                      : incomeShiftMajor < 0
                      ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20"
                      : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)]"
                  )}>
                    {incomeShiftMajor >= 0 ? '+' : ''}{symbol}{incomeShiftMajor.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Slider Control */}
              <input
                type="range"
                min={-maxRange}
                max={maxRange}
                step={defaultStep}
                value={incomeShiftMajor}
                onChange={(e) => {
                  setIncomeShiftMajor(parseFloat(e.target.value) || 0);
                  setActivePreset('custom');
                }}
                className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 border border-[var(--color-border-primary)] rounded-full appearance-none cursor-pointer accent-[var(--theme-accent-highlight)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--theme-accent-highlight)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--theme-accent-highlight)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-zinc-900 transition-all"
              />

              <div className="flex items-center justify-between text-[10px] font-medium text-[var(--color-text-secondary)]">
                <span>-{symbol}{maxRange.toLocaleString()}</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Projected: {symbol}{(baselineIncome + incomeShiftMajor).toLocaleString()} / mo
                </span>
                <span>+{symbol}{maxRange.toLocaleString()}</span>
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                {[-defaultStep * 10, -defaultStep * 5, 0, defaultStep * 5, defaultStep * 10].map((stepVal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (stepVal === 0) setIncomeShiftMajor(0);
                      else setIncomeShiftMajor(prev => prev + stepVal);
                      setActivePreset('custom');
                    }}
                    className="flex-1 py-1 rounded-md text-[10px] font-semibold bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-primary)] transition-all cursor-pointer"
                  >
                    {stepVal === 0 ? '0' : `${stepVal > 0 ? '+' : ''}${stepVal >= 1000 || stepVal <= -1000 ? `${stepVal / 1000}k` : stepVal}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--color-border-primary)]/50 pt-2" />

            {/* Expense Shift Controller */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                    Monthly Operating Expense Shift
                  </span>
                  <span className="text-[10px] text-[var(--color-text-secondary)]">
                    Baseline: {formatMoney(baselineExpense * 100)} / mo
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-sm font-bold font-mono px-2.5 py-1 rounded-lg border",
                    expenseShiftMajor > 0
                      ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20"
                      : expenseShiftMajor < 0
                      ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                      : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)]"
                  )}>
                    {expenseShiftMajor > 0 ? '+' : ''}{symbol}{expenseShiftMajor.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Slider Control */}
              <input
                type="range"
                min={-maxRange}
                max={maxRange}
                step={defaultStep}
                value={expenseShiftMajor}
                onChange={(e) => {
                  setExpenseShiftMajor(parseFloat(e.target.value) || 0);
                  setActivePreset('custom');
                }}
                className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 border border-[var(--color-border-primary)] rounded-full appearance-none cursor-pointer accent-[var(--theme-accent-highlight)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--theme-accent-highlight)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--theme-accent-highlight)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-zinc-900 transition-all"
              />

              <div className="flex items-center justify-between text-[10px] font-medium text-[var(--color-text-secondary)]">
                <span>-{symbol}{maxRange.toLocaleString()} (Trim)</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  Projected: {symbol}{(baselineExpense + expenseShiftMajor).toLocaleString()} / mo
                </span>
                <span>+{symbol}{maxRange.toLocaleString()} (Inflate)</span>
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                {[-defaultStep * 10, -defaultStep * 5, 0, defaultStep * 5, defaultStep * 10].map((stepVal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (stepVal === 0) setExpenseShiftMajor(0);
                      else setExpenseShiftMajor(prev => prev + stepVal);
                      setActivePreset('custom');
                    }}
                    className="flex-1 py-1 rounded-md text-[10px] font-semibold bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-primary)] transition-all cursor-pointer"
                  >
                    {stepVal === 0 ? '0' : `${stepVal > 0 ? '+' : ''}${stepVal >= 1000 || stepVal <= -1000 ? `${stepVal / 1000}k` : stepVal}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Scenario Synthesis Diagnostic Card */}
          {diagnosticFeedback && (
            <div className={cn(
              "rounded-2xl border p-5 shadow-xs flex flex-col gap-3",
              diagnosticFeedback.isCritical
                ? "bg-[var(--color-danger)]/5 border-[var(--color-danger)]/30"
                : diagnosticFeedback.isImproved
                ? "bg-[var(--theme-badge-bg)] border-[var(--theme-badge-border)]"
                : "bg-[var(--color-bg-primary)] border-[var(--color-border-primary)]"
            )}>
              <div className="flex items-center gap-2">
                {diagnosticFeedback.isCritical ? (
                  <AlertTriangle className="h-4 w-4 text-[var(--color-danger)] shrink-0" />
                ) : diagnosticFeedback.isImproved ? (
                  <Sparkles className="h-4 w-4 text-[var(--theme-badge-text)] shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-text-secondary)] shrink-0" />
                )}
                <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                  {diagnosticFeedback.headline}
                </h4>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {diagnosticFeedback.detail}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Projection Bento & Trajectory Chart (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Top 3 Impact Metric Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: Monthly Cash Flow */}
            <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Net Cash Flow
                </span>
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)]">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">
                  Baseline: {data ? formatMoney(data.baseline.cashFlow) : '—'}
                </div>
                <div className={cn(
                  "text-xl sm:text-2xl font-bold font-mono tracking-tight",
                  data && data.projected.cashFlow >= 0 ? "text-[var(--color-text-primary)]" : "text-[var(--color-danger)]"
                )}>
                  {data ? formatMoney(data.projected.cashFlow) : '—'}
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] ml-1">/mo</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-primary)] text-[10px]">
                <span className="text-[var(--color-text-secondary)]">Scenario Delta</span>
                <span className={cn(
                  "font-bold font-mono px-2 py-0.5 rounded-md",
                  data && data.diff.cashFlow > 0 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" :
                  data && data.diff.cashFlow < 0 ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]" :
                  "text-[var(--color-text-secondary)]"
                )}>
                  {data && data.diff.cashFlow > 0 ? '+' : ''}{data ? formatMoney(data.diff.cashFlow) : '0'}
                </span>
              </div>
            </div>

            {/* Metric 2: Financial Health Score */}
            <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Health Index
                </span>
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)]">
                  <Activity className="h-3.5 w-3.5" />
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">
                  Baseline: {data ? `${data.baseline.healthScore} / 100` : '—'}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[var(--color-text-primary)]">
                  {data ? data.projected.healthScore : '—'}
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] ml-1">/ 100</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-primary)] text-[10px]">
                <span className="text-[var(--color-text-secondary)]">Score Shift</span>
                <span className={cn(
                  "font-bold font-mono px-2 py-0.5 rounded-md",
                  data && data.diff.healthScore > 0 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" :
                  data && data.diff.healthScore < 0 ? "bg-[var(--color-danger)]/10 text-[var(--color-danger)]" :
                  "text-[var(--color-text-secondary)]"
                )}>
                  {data && data.diff.healthScore > 0 ? `+${data.diff.healthScore} pts` :
                   data && data.diff.healthScore < 0 ? `${data.diff.healthScore} pts` :
                   'Unchanged'}
                </span>
              </div>
            </div>

            {/* Metric 3: Goals Feasibility */}
            <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 shadow-xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Goal Feasibility
                </span>
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border-primary)]">
                  <Target className="h-3.5 w-3.5" />
                </div>
              </div>

              <div>
                <div className="text-[10px] text-[var(--color-text-secondary)] mb-0.5">
                  Baseline: {data ? data.baseline.overallFeasibility : '—'}
                </div>
                <div className={cn(
                  "text-lg sm:text-xl font-bold tracking-tight uppercase",
                  data?.projected.overallFeasibility === 'ACHIEVABLE' ? "text-[var(--color-success)]" :
                  data?.projected.overallFeasibility === 'STRETCH' ? "text-[var(--color-warning)]" :
                  "text-[var(--color-danger)]"
                )}>
                  {data ? data.projected.overallFeasibility : 'Calculating...'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-primary)] text-[10px]">
                <span className="text-[var(--color-text-secondary)]">Feasibility Status</span>
                <span className={cn(
                  "font-bold uppercase px-2 py-0.5 rounded-md",
                  data?.projected.overallFeasibility === 'ACHIEVABLE' ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" :
                  data?.projected.overallFeasibility === 'STRETCH' ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" :
                  "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                )}>
                  {data?.projected.overallFeasibility === 'ACHIEVABLE' ? 'On Track' :
                   data?.projected.overallFeasibility === 'STRETCH' ? 'Stress Band' : 'Deficit'}
                </span>
              </div>
            </div>

          </div>

          {/* Interactive 6-Month Cumulative Wealth Trajectory Chart */}
          <div className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-6 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-primary)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[var(--theme-accent-highlight,var(--chart-2))]" />
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    6-Month Cumulative Cash Reserve Divergence
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  Comparison between baseline savings accumulation versus simulated trajectory
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-700" />
                  <span className="text-[var(--color-text-secondary)] font-medium">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-accent-highlight)]" />
                  <span className="text-[var(--color-text-primary)] font-bold">Simulated</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Divergence Visualizer */}
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="simulatedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--theme-accent-highlight)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--theme-accent-highlight)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-border-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-border-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-primary)" opacity={0.4} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
                    tickFormatter={(val) => `${symbol}${val >= 1000 || val <= -1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0]?.payload;
                      if (!p) return null;
                      return (
                        <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-3 shadow-lg flex flex-col gap-1.5 text-xs">
                          <span className="font-bold text-[var(--color-text-primary)] border-b border-[var(--color-border-primary)] pb-1">
                            {p.month}
                          </span>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[var(--color-text-secondary)]">Baseline Savings:</span>
                            <span className="font-mono font-semibold text-[var(--color-text-secondary)]">
                              {symbol}{p.baseline.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[var(--theme-accent-highlight,var(--chart-2))] font-bold">Simulated Scenario:</span>
                            <span className="font-mono font-bold text-[var(--color-text-primary)]">
                              {symbol}{p.projected.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-[var(--color-border-primary)]">
                            <span className="text-[var(--color-text-secondary)]">Surplus Gap:</span>
                            <span className={cn(
                              "font-mono font-bold",
                              p.delta >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                            )}>
                              {p.delta >= 0 ? '+' : ''}{symbol}{p.delta.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="var(--color-border-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#baselineGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="projected"
                    stroke="var(--theme-accent-highlight)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#simulatedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-primary)] text-xs">
              <span className="text-[var(--color-text-secondary)]">
                Estimated 6-Month Liquid Divergence:
              </span>
              <span className={cn(
                "font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg",
                sixMonthExtraSurplus >= 0
                  ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
              )}>
                {sixMonthExtraSurplus >= 0 ? '+' : ''}{symbol}{sixMonthExtraSurplus.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
