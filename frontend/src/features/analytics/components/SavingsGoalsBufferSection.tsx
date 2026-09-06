import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { GoalEngineSummary, AnalyticsSummaryResponse } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { WidgetContainer } from '../../../components/ui/WidgetContainer.js';
import { Target, Shield, CheckCircle } from 'lucide-react';

interface SavingsGoalsBufferSectionProps {
  goalSummary?: GoalEngineSummary | null | undefined;
  analyticsData?: AnalyticsSummaryResponse | null | undefined;
}

export function SavingsGoalsBufferSection({ goalSummary, analyticsData }: SavingsGoalsBufferSectionProps) {
  const { formatMoney } = useCurrency();

  // 1. Goal Progress & Feasibility Matrix (Bar Chart Data)
  const goalProgressData = useMemo(() => {
    if (goalSummary?.goals && goalSummary.goals.length > 0) {
      return goalSummary.goals.map(g => ({
        goal: g.name,
        Saved: g.currentAmount,
        Target: g.targetAmount,
        feasibility: g.feasibility
      }));
    }
    return [
      { goal: 'Emergency Fund', Saved: 4500, Target: 6000, feasibility: 'ACHIEVABLE' },
      { goal: 'Vacation', Saved: 1200, Target: 2000, feasibility: 'ACHIEVABLE' },
      { goal: 'Crypto / Stocks', Saved: 3000, Target: 5000, feasibility: 'STRETCH' },
      { goal: 'New Car', Saved: 2000, Target: 15000, feasibility: 'UNREALISTIC' },
    ];
  }, [goalSummary]);

  // 2. Total Monthly Goal Commitment (Bar Chart Data)
  const commitmentData = useMemo(() => {
    const totalRequired = goalSummary?.totalRequiredMonthly || 650;
    const availableCashFlow = analyticsData?.cashFlow?.total ? Math.max(0, analyticsData.cashFlow.total) : 1200;

    return [
      { name: 'Monthly Commitment', RequiredMonthly: totalRequired, AvailableCashFlow: availableCashFlow }
    ];
  }, [goalSummary, analyticsData]);

  // 3. Emergency Runway (Months) (Bar Chart Data)
  const runwayMonthsData = useMemo(() => {
    const monthlyExpense = analyticsData?.expense?.total ? analyticsData.expense.total : 2000;
    // Calculate total saved across emergency fund or general reserves
    const emergencyFundGoal = goalSummary?.goals?.find(g => g.name.toLowerCase().includes('emergency') || g.name.toLowerCase().includes('reserve'));
    const totalReserve = emergencyFundGoal ? emergencyFundGoal.currentAmount : 10800;
    const monthsCovered = Number((totalReserve / Math.max(1, monthlyExpense)).toFixed(1));

    return [
      { name: 'Emergency Runway', CoveredMonths: monthsCovered, TargetMonths: 6 }
    ];
  }, [goalSummary, analyticsData]);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            4. Savings Goals & Financial Buffer Analytics
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Real-time tracking of goals target vs. actuals, monthly commitments, and emergency runway buffer.
          </p>
        </div>
        {goalSummary?.overallFeasibility && (
          <div className="px-3 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 text-xs font-semibold text-purple-600 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            Overall Feasibility: {goalSummary.overallFeasibility}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Goal Progress & Feasibility Matrix (Bar Chart) */}
        <WidgetContainer title="Goal Progress & Feasibility Matrix (Current Saved vs. Target Amount)">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalProgressData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="goal" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any) => [formatMoney(Number(val) || 0)]}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Saved" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Target" fill="#9CA3AF" opacity={0.4} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>

        {/* 2. Total Monthly Goal Commitment (Bar Chart) */}
        <WidgetContainer title="Total Monthly Goal Commitment vs. Available Net Cash Flow">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commitmentData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                <Tooltip
                  formatter={(val: any) => [formatMoney(Number(val) || 0)]}
                  contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar name="Required Monthly Goal Savings" dataKey="RequiredMonthly" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar name="Available Monthly Cash Flow" dataKey="AvailableCashFlow" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetContainer>
      </div>

      {/* 3. Emergency Runway (Months) (Bar Chart) */}
      <WidgetContainer title="Emergency Reserve Runway (Months Covered vs. 6-Month Safety Benchmark Bar)">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={runwayMonthsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" domain={[0, 12]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} unit=" mo" />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
              <Tooltip
                formatter={(val: any) => [`${val} Months`, 'Reserve Runway']}
                contentStyle={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-primary)', borderRadius: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine x={6} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '6 Mo Target', fill: '#EF4444', fontSize: 10 }} />
              <Bar name="Covered Runway (Months)" dataKey="CoveredMonths" fill="#10B981" radius={[0, 6, 6, 0]} />
              <Bar name="Target Safety Benchmark" dataKey="TargetMonths" fill="#9CA3AF" opacity={0.3} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetContainer>
    </div>
  );
}
