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
  const { formatMoney } = useCurrency();
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
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          5. AI Insights & Financial Projections
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Anomaly detection spikes line chart and interactive scenario what-if wealth projection area chart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Smart Insights Anomaly Tracking (Line Chart) */}
        <WidgetContainer title="AI Smart Insights Anomaly Tracking (Spending Spikes & Variance Over Time)">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyTrackingData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} unit="%" />
                <Tooltip
                  formatter={(val: any, name: any) => [name === 'spendVariance' ? formatMoney(Number(val) || 0) : `${val}%`, name === 'spendVariance' ? 'Spend Variance' : 'Anomaly Risk']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine yAxisId="right" y={60} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Anomaly Risk Alert Threshold', fill: '#EF4444', fontSize: 10 }} />
                <Line yAxisId="right" type="monotone" name="Anomaly Risk Index (%)" dataKey="anomalyScore" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 5, fill: '#EF4444' }} />
                <Line yAxisId="left" type="monotone" name="Spend Variance ($)" dataKey="spendVariance" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 2. What-If Scenario Simulator Preview (Area Chart) */}
        <WidgetContainer title="What-If Scenario Simulator Preview (Baseline vs. Projected Cash Flow Trajectory)">
          <div className="space-y-3">
            {/* Interactive Sliders */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--color-bg-secondary)]/50 rounded-xl border border-[var(--color-border-primary)] text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[var(--color-text-secondary)]">Income Adjustment:</span>
                  <span className="font-bold text-emerald-600">+{incomeAdj}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={incomeAdj}
                  onChange={(e) => setIncomeAdj(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[var(--color-text-secondary)]">Expense Adjustment:</span>
                  <span className="font-bold text-amber-600">{expenseAdj}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="30"
                  value={expenseAdj}
                  onChange={(e) => setExpenseAdj(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationChartData}>
                  <defs>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <Tooltip
                    formatter={(val: any) => [formatMoney(Number(val) || 0)]}
                    contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" name="Baseline Wealth Path" dataKey="BaselineCashFlow" stroke="#9CA3AF" fillOpacity={1} fill="url(#baseGrad)" strokeWidth={2} />
                  <Area type="monotone" name="Projected Wealth Path" dataKey="ProjectedScenario" stroke="#10B981" fillOpacity={1} fill="url(#projGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
