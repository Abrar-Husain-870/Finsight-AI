import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { HealthScoreResponse, AnalyticsSummaryResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../../../components/ui/WidgetContainer.js';
import { Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialHealthVelocitySectionProps {
  healthData?: HealthScoreResponse | null | undefined;
  analyticsData?: AnalyticsSummaryResponse | null | undefined;
}

export function FinancialHealthVelocitySection({ healthData, analyticsData }: FinancialHealthVelocitySectionProps) {
  const { formatMoney } = useCurrency();

  // 1. Health Score Trajectory (Line Chart Data)
  const healthHistoryData = healthData?.history?.map(h => ({
    month: h.date,
    score: h.score
  })) || [
    { month: 'May', score: 72 },
    { month: 'Jun', score: 78 },
    { month: 'Jul', score: 75 },
    { month: 'Aug', score: 81 },
    { month: 'Sep', score: 84 },
  ];

  // 2. Daily Burn Rate / Velocity (Line Chart Data)
  const dailyBurnData = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dailyAvg = analyticsData?.spendingVelocity?.dailyAverage || 180;
    return {
      day: `Day ${day}`,
      cumulativeSpend: Math.round(dailyAvg * day),
      targetLimit: Math.round(200 * day)
    };
  });

  // 3. Savings Rate vs 20% Benchmark (Bar Chart Data)
  const actualSavingsRate = analyticsData?.income?.total && analyticsData.income.total > 0
    ? Math.max(0, Math.round((analyticsData.cashFlow.total / analyticsData.income.total) * 100))
    : 24;

  const savingsBenchmarkData = [
    { name: 'Your Savings Rate', rate: actualSavingsRate, fill: '#10B981' },
    { name: '20% Benchmark Target', rate: 20, fill: '#3B82F6' },
  ];

  // 4. Income vs. Expense Velocity (Dual Area Chart Data)
  const incomeVsExpenseData = analyticsData?.monthlyTrends?.map(t => ({
    month: t.month,
    Income: t.income,
    Expense: t.expense
  })) || [
    { month: 'May', Income: 5500, Expense: 4200 },
    { month: 'Jun', Income: 6000, Expense: 4100 },
    { month: 'Jul', Income: 5800, Expense: 4600 },
    { month: 'Aug', Income: 6200, Expense: 4300 },
    { month: 'Sep', Income: 6800, Expense: 4500 },
  ];

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          2. Core Financial Health & Velocity Cards & Graphs
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
          Macro health trajectory, daily burn velocity pace, savings benchmarks, and cash flow dual area trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Financial Health Score Card (Line Chart) */}
        <WidgetContainer title="Financial Health Score Card (6-Month Trajectory)">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[var(--color-text-primary)] tabular-nums">
                {healthData?.overallScore || 84}
              </span>
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">/ 100 Health Score</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Excellent
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthHistoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} / 100`, 'Health Score']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 2. Daily Burn Rate (Velocity) (Line Chart) */}
        <WidgetContainer title="Daily Burn Rate (Cumulative Daily Spend vs. Ceiling Limit)">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyBurnData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any) => [formatMoney(Number(val) || 0), 'Cumulative Spend']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" name="Actual Spend Pace" dataKey="cumulativeSpend" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
                <Line type="monotone" name="Target Budget Pace" dataKey="targetLimit" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 3. Savings Rate vs 20% Benchmark (Bar Chart) */}
        <WidgetContainer title="Savings Rate vs. 20% Recommended Benchmark Bar">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsBenchmarkData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Savings Rate']}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <ReferenceLine y={20} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '20% Target', fill: '#EF4444', fontSize: 10 }} />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                  {savingsBenchmarkData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 4. Income vs Expense Velocity (Area Chart) */}
        <WidgetContainer title="Income vs. Expense Velocity Comparison (Dual Area Chart)">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeVsExpenseData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="Income" stroke="#10B981" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="Expense" stroke="#EF4444" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
