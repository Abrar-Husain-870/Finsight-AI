import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  AreaChart as VisxAreaChart,
  Grid,
  Area as VisxArea,
  LineChart as VisxLineChart,
  Line as VisxLine,
  XAxis as CustomXAxis,
  YAxis as CustomYAxis,
  ChartTooltip,
  BarChart as VisxBarChart,
  Bar as VisxBar,
  BarXAxis,
  useLineChart
} from '../../../components/ui/charts/index.js';
import { HealthScoreResponse, AnalyticsSummaryResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../../../components/ui/WidgetContainer.js';
import { Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialHealthVelocitySectionProps {
  healthData?: HealthScoreResponse | null | undefined;
  analyticsData?: AnalyticsSummaryResponse | null | undefined;
}

function BenchmarkLine({ value = 20, label = '20% Target' }: { value?: number; label?: string }) {
  const { yScale, innerWidth } = useLineChart();
  const y = yScale(value) ?? 0;

  return (
    <g className="pointer-events-none">
      <line
        x1={0}
        y1={y}
        x2={innerWidth}
        y2={y}
        stroke="var(--muted-foreground)"
        strokeWidth={2}
        strokeDasharray="6 6"
        opacity={0.85}
      />
      <text
        x={innerWidth}
        y={y - 6}
        fill="var(--muted-foreground)"
        fontSize={10}
        fontWeight={700}
        textAnchor="end"
      >
        {label}
      </text>
    </g>
  );
}

export function FinancialHealthVelocitySection({ healthData, analyticsData }: FinancialHealthVelocitySectionProps) {
  const { formatMoney } = useCurrency();

  // 1. Health Score Trajectory (Line Chart Data)
  const healthHistoryChartData = React.useMemo(() => {
    if (healthData?.history && healthData.history.length > 0) {
      return healthData.history.map(h => ({
        date: new Date(h.date),
        desktop: h.score,
        score: h.score,
      }));
    }
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (4 - i), 1);
      return {
        date: d,
        desktop: Math.floor(70 + Math.sin(i) * 10 + i * 3),
        score: Math.floor(70 + Math.sin(i) * 10 + i * 3),
      };
    });
  }, [healthData]);

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
    { month: 'Your Savings Rate', desktop: actualSavingsRate, fill: 'var(--primary)' },
    { month: '20% Benchmark Target', desktop: 20, fill: 'var(--chart-3)' },
  ];

  // 4. Income vs. Expense Velocity (Dual Area Chart Data)
  const incomeVsExpenseData = React.useMemo(() => {
    const today = new Date();
    if (analyticsData?.monthlyTrends && analyticsData.monthlyTrends.length > 0) {
      return analyticsData.monthlyTrends.map((t, idx) => {
        let d = t.month ? new Date(t.month) : null;
        if (!d || isNaN(d.getTime())) {
          d = new Date(today.getFullYear(), today.getMonth() - (analyticsData.monthlyTrends.length - 1 - idx), 1);
        }
        return {
          date: d,
          desktop: t.income,
          mobile: t.expense
        };
      });
    }

    const monthsAgo = (m: number) => new Date(today.getFullYear(), today.getMonth() - m, 1);
    return [
      { date: monthsAgo(4), desktop: 5500, mobile: 4200 },
      { date: monthsAgo(3), desktop: 6000, mobile: 4100 },
      { date: monthsAgo(2), desktop: 5800, mobile: 4600 },
      { date: monthsAgo(1), desktop: 6200, mobile: 4300 },
      { date: monthsAgo(0), desktop: 6800, mobile: 4500 },
    ];
  }, [analyticsData]);

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--foreground)]" />
          2. Core Financial Health & Velocity Cards & Graphs
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Macro health trajectory, daily burn velocity pace, savings benchmarks, and cash flow dual area trends.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Financial Health Score Card (Line Chart) */}
        <WidgetContainer title="Financial Health Score">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[var(--foreground)] tabular-nums">
                {healthData?.overallScore || 84}
              </span>
              <span className="text-sm font-semibold text-[var(--muted-foreground)]">/ 100 Health Score</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-[var(--chart-2)]/10 border border-[var(--chart-2)]/20 text-xs font-bold text-[var(--chart-2)] flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Excellent
            </div>
          </div>
          <div className="h-[220px] w-full pt-1">
            <VisxLineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={healthHistoryChartData}>
              <Grid horizontal />
              <VisxLine dataKey="desktop" strokeWidth={2} />
              <CustomXAxis />
              <ChartTooltip />
            </VisxLineChart>
          </div>
        </WidgetContainer>

        {/* 2. Daily Burn Rate (Velocity) (Line Chart) */}
        <WidgetContainer title="Daily Burn Velocity">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyBurnData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <Tooltip
                  formatter={(val: any) => [formatMoney(Number(val) || 0), 'Cumulative Spend']}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--card-foreground)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }} />
                <Line type="monotone" name="Actual Spend Pace" dataKey="cumulativeSpend" stroke="var(--primary)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" name="Target Budget Pace" dataKey="targetLimit" stroke="var(--muted-foreground)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 3. Savings Rate vs 20% Benchmark (Bar Chart) */}
        <WidgetContainer title="Savings Rate vs. 20% Target">
          <div className="h-[240px] w-full pt-1">
            <VisxBarChart margin={{ top: 8, right: 8, bottom: 40, left: 45 }} data={savingsBenchmarkData} xDataKey="month">
              <Grid horizontal />
              <VisxBar dataKey="desktop" lineCap="round" />
              <BenchmarkLine value={20} label="20% Benchmark Target" />
              <CustomYAxis tickFormat={(v) => `${v}%`} />
              <BarXAxis />
              <ChartTooltip
                content={({ activeData }) => (
                  <div className="flex flex-col gap-1 p-1 text-xs">
                    <div className="font-bold text-[var(--foreground)]">
                      {activeData.month}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeData.fill }} />
                        Savings Rate:
                      </span>
                      <span className="font-bold text-[var(--foreground)]">{activeData.desktop}%</span>
                    </div>
                  </div>
                )}
              />
            </VisxBarChart>
          </div>
        </WidgetContainer>

        {/* 4. Income vs Expense Velocity (Area Chart) */}
        <WidgetContainer title="Income vs. Expense Velocity">
          <div className="flex items-center justify-end gap-4 mb-1 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-[var(--chart-2)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-2)]" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--muted-foreground)]" />
              <span>Expense</span>
            </div>
          </div>
          <div className="h-[240px] w-full pt-1">
            <VisxAreaChart data={incomeVsExpenseData} margin={{ top: 8, right: 8, bottom: 40, left: 56 }}>
              <Grid horizontal />
              <VisxArea dataKey="desktop" fill="var(--chart-2)" fillOpacity={0.3} strokeWidth={2} />
              <VisxArea dataKey="mobile" fill="var(--muted-foreground)" fillOpacity={0.3} strokeWidth={2} />
              <CustomYAxis yAxisId="left" />
              <CustomXAxis />
              <ChartTooltip />
            </VisxAreaChart>
          </div>
        </WidgetContainer>
      </div>
    </div>
  );
}
