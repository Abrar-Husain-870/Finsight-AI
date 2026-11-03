import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { AnalyticsSummaryResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../../../components/ui/WidgetContainer.js';
import { Sparkles, Sliders, AlertTriangle } from 'lucide-react';

interface AiInsightsProjectionsSectionProps {
  analyticsData?: AnalyticsSummaryResponse | null | undefined;
}

export function AiInsightsProjectionsSection({ analyticsData }: AiInsightsProjectionsSectionProps) {
  const { formatMoney, formatMajor, symbol, formatCompact } = useCurrency();
  const [incomeAdj, setIncomeAdj] = useState(10); // +10%
  const [expenseAdj, setExpenseAdj] = useState(-15); // -15%

  // 1. AI Smart Insights Anomaly Tracking (Line Chart Data)
  const anomalyTrackingData = [
    { day: 'Day 1-5', anomalyScore: 12, spendVariance: 150 },
    { day: 'Day 6-10', anomalyScore: 18, spendVariance: 220 },
    { day: 'Day 11-15', anomalyScore: 85, spendVariance: 850 }, // Spike!
    { day: 'Day 16-20', anomalyScore: 25, spendVariance: 310 },
    { day: 'Day 21-25', anomalyScore: 15, spendVariance: 190 },
    { day: 'Day 26-30', anomalyScore: 30, spendVariance: 340 },
  ];

  // 2. What-If Scenario Simulator Preview (Dual Area Chart Data)
  const baselineCashFlow = analyticsData?.cashFlow?.total ? analyticsData.cashFlow.total : 1500;
  const currentIncome = analyticsData?.income?.total ? analyticsData.income.total : 5000;
  const currentExpense = analyticsData?.expense?.total ? analyticsData.expense.total : 3500;

  const simIncome = currentIncome * (1 + incomeAdj / 100);
  const simExpense = currentExpense * (1 + expenseAdj / 100);
  const simCashFlow = simIncome - simExpense;

  const simulationChartData = [
    { month: 'Month 1', BaselineCashFlow: Math.round(baselineCashFlow * 1), ProjectedScenario: Math.round(simCashFlow * 1) },
    { month: 'Month 2', BaselineCashFlow: Math.round(baselineCashFlow * 2), ProjectedScenario: Math.round(simCashFlow * 2) },
    { month: 'Month 3', BaselineCashFlow: Math.round(baselineCashFlow * 3), ProjectedScenario: Math.round(simCashFlow * 3) },
    { month: 'Month 4', BaselineCashFlow: Math.round(baselineCashFlow * 4), ProjectedScenario: Math.round(simCashFlow * 4) },
    { month: 'Month 5', BaselineCashFlow: Math.round(baselineCashFlow * 5), ProjectedScenario: Math.round(simCashFlow * 5) },
    { month: 'Month 6', BaselineCashFlow: Math.round(baselineCashFlow * 6), ProjectedScenario: Math.round(simCashFlow * 6) },
  ];

  return (
    <div className="space-y-6 pt-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--chart-2)]" />
            5. AI Insights & Financial Projections
          </h2>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] text-[var(--color-text-secondary)]">
            Predictive Modeling
          </span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Anomaly detection spikes line chart and interactive scenario what-if wealth projection area chart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Smart Insights Anomaly Tracking (Line Chart) */}
        <WidgetContainer 
          title="Smart Anomaly & Spike Tracking"
          subtitle="Spending spikes, volatility detection, and variance alerts exceeding threshold."
          badge={
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
              Anomaly Risk
            </span>
          }
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyTrackingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} unit="%" />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'spendVariance' ? formatMajor(Number(val) || 0) : `${val}%`, name === 'spendVariance' ? 'Spend Variance' : 'Anomaly Risk']}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }} />
                <ReferenceLine yAxisId="right" y={60} stroke="var(--muted-foreground)" strokeDasharray="3 3" label={{ value: 'Anomaly Risk Alert Threshold', fill: 'var(--muted-foreground)', fontSize: 10 }} />
                <Line yAxisId="right" type="monotone" name="Anomaly Risk Index (%)" dataKey="anomalyScore" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--chart-2)' }} />
                <Line yAxisId="left" type="monotone" name={`Spend Variance (${symbol})`} dataKey="spendVariance" stroke="var(--primary)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 2. What-If Scenario Simulator Preview (Area Chart) */}
        <WidgetContainer 
          title="What-If Scenario Simulator"
          subtitle="Interactive stress-testing of income and expense adjustments on multi-month wealth accumulation."
          badge={
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
              Dynamic Projections
            </span>
          }
        >
          <div className="space-y-3">
            {/* Interactive Sliders */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--muted)]/50 rounded-xl border border-[var(--border)] text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[var(--muted-foreground)]">Income Adjustment:</span>
                  <span className="font-bold text-[var(--primary)]">+{incomeAdj}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={incomeAdj}
                  onChange={(e) => setIncomeAdj(Number(e.target.value))}
                  className="w-full h-1.5 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[var(--muted-foreground)]">Expense Adjustment:</span>
                  <span className="font-bold text-[var(--primary)]">{expenseAdj}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="30"
                  value={expenseAdj}
                  onChange={(e) => setExpenseAdj(Number(e.target.value))}
                  className="w-full h-1.5 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                />
              </div>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationChartData}>
                  <defs>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip
                    formatter={(val: any) => [formatMoney(Number(val) || 0)]}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }} />
                  <Area type="monotone" name="Baseline Wealth Path" dataKey="BaselineCashFlow" stroke="var(--muted-foreground)" fillOpacity={1} fill="url(#baseGrad)" strokeWidth={2} />
                  <Area type="monotone" name="Projected Wealth Path" dataKey="ProjectedScenario" stroke="var(--chart-2)" fillOpacity={1} fill="url(#projGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
