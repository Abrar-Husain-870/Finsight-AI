import React, { useMemo } from 'react';
import { GoalEngineSummary, AnalyticsSummaryResponse } from '@finsight/shared';
import {
  BarChart,
  Bar,
  BarXAxis,
  BarYAxis,
  YAxis as CustomYAxis,
  Grid,
  ChartTooltip,
  Gauge
} from '../../../components/ui/charts/index.js';
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
        month: g.name,
        desktop: g.currentAmount,
        mobile: g.targetAmount,
        feasibility: g.feasibility
      }));
    }
    return [
      { month: 'Emergency Fund', desktop: 4500, mobile: 6000, feasibility: 'ACHIEVABLE' },
      { month: 'Vacation', desktop: 1200, mobile: 2000, feasibility: 'ACHIEVABLE' },
      { month: 'Crypto / Stocks', desktop: 3000, mobile: 5000, feasibility: 'STRETCH' },
      { month: 'New Car', desktop: 2000, mobile: 15000, feasibility: 'UNREALISTIC' },
    ];
  }, [goalSummary]);

  // 2. Total Monthly Goal Commitment (Bar Chart Data)
  const commitmentData = useMemo(() => {
    const totalRequired = goalSummary?.totalRequiredMonthly || 650;
    const availableCashFlow = analyticsData?.cashFlow?.total ? Math.max(0, analyticsData.cashFlow.total) : 1200;

    return [
      { month: 'Monthly Commitment', desktop: totalRequired, mobile: availableCashFlow }
    ];
  }, [goalSummary, analyticsData]);

  // 3. Emergency Runway (Months) (Gauge Data)
  const runwayData = useMemo(() => {
    const monthlyExpense = analyticsData?.expense?.total ? analyticsData.expense.total : 2000;
    const emergencyFundGoal = goalSummary?.goals?.find(g => g.name.toLowerCase().includes('emergency') || g.name.toLowerCase().includes('reserve'));
    const totalReserve = emergencyFundGoal ? emergencyFundGoal.currentAmount : 10800;
    const monthsCovered = Number((totalReserve / Math.max(1, monthlyExpense)).toFixed(1));
    const targetMonths = 6;
    const pct = Math.min(100, Math.round((monthsCovered / targetMonths) * 100));

    return {
      monthsCovered,
      pct,
      totalReserve
    };
  }, [goalSummary, analyticsData]);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Target className="h-5 w-5 text-[var(--chart-2)]" />
            4. Savings Goals & Financial Buffer Analytics
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Real-time tracking of goals target vs. actuals, monthly commitments, and emergency runway buffer.
          </p>
        </div>
        {goalSummary?.overallFeasibility && (
          <div className="px-3 py-1.5 rounded-xl border border-[var(--chart-2)]/20 bg-[var(--chart-2)]/10 text-xs font-semibold text-[var(--chart-2)] flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            Overall Feasibility: {goalSummary.overallFeasibility}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Goal Progress & Feasibility Matrix (Bar Chart) */}
        <WidgetContainer title="Goal Progress & Feasibility Matrix">
          <div className="flex items-center justify-end gap-4 mb-1 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
              <span>Current Saved</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-3)]" />
              <span>Target Amount</span>
            </div>
          </div>
          <div className="h-[260px] w-full pt-1">
            <BarChart margin={{ top: 8, right: 8, bottom: 40, left: 45 }} data={goalProgressData} xDataKey="month">
              <Grid horizontal vertical fadeVertical />
              <Bar dataKey="desktop" fill="var(--primary)" lineCap="round" />
              <Bar dataKey="mobile" fill="var(--chart-3)" lineCap="round" />
              <BarXAxis />
              <CustomYAxis />
              <ChartTooltip
                content={({ activeData }) => (
                  <div className="flex flex-col gap-1 p-1 text-xs">
                    <div className="font-bold text-[var(--color-text-primary)]">
                      {activeData.month}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                        Current Saved:
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)]">{formatMoney(activeData.desktop)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
                        Target Amount:
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)]">{formatMoney(activeData.mobile)}</span>
                    </div>
                  </div>
                )}
              />
            </BarChart>
          </div>
        </WidgetContainer>

        {/* 2. Total Monthly Goal Commitment (Bar Chart) */}
        <WidgetContainer title="Total Monthly Goal Commitment">
          <div className="flex items-center justify-end gap-4 mb-1 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-[var(--chart-2)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-2)]" />
              <span>Required Goal Savings</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-text-primary)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
              <span>Available Cash Flow</span>
            </div>
          </div>
          <div className="h-[260px] w-full pt-1">
            <BarChart margin={{ top: 8, right: 8, bottom: 40, left: 45 }} data={commitmentData} xDataKey="month">
              <Grid horizontal vertical fadeVertical />
              <Bar dataKey="desktop" fill="var(--chart-2)" lineCap="round" />
              <Bar dataKey="mobile" fill="var(--primary)" lineCap="round" />
              <BarXAxis />
              <CustomYAxis />
              <ChartTooltip
                content={({ activeData }) => (
                  <div className="flex flex-col gap-1 p-1 text-xs">
                    <div className="font-bold text-[var(--color-text-primary)]">
                      {activeData.month}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" />
                        Required Savings:
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)]">{formatMoney(activeData.desktop)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                        Available Cash Flow:
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)]">{formatMoney(activeData.mobile)}</span>
                    </div>
                  </div>
                )}
              />
            </BarChart>
          </div>
        </WidgetContainer>
      </div>

      {/* 3. Emergency Reserve Runway (Linear Gauge Chart) */}
      <WidgetContainer title="Emergency Reserve Runway">
        <div className="w-full flex items-center justify-center pt-0 pb-1">
          <Gauge
            orientation="linear"
            value={runwayData.pct}
            centerValue={runwayData.totalReserve}
            defaultLabel="Emergency Reserve Runway"
            labelPlacement="bottom"
            labelAlign="center"
            totalNotches={72}
            spacing={0}
            notchCornerRadius={3}
            inactiveFillOpacity={0.4}
            useGradient
            height={110}
          />
        </div>
      </WidgetContainer>
    </div>
  );
}
