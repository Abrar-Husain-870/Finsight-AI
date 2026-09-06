"use client";

import React, { useMemo } from 'react';
import { MonthlyTrend, fromMinor } from '@finsight/shared';
import { motion } from 'framer-motion';
import { curveMonotoneX } from '@visx/curve';
import {
  AreaChart,
  Area,
  Grid,
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo,
  XAxis,
  ChartTooltip,
} from '../../../components/ui/charts/index.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';

export function MonthlyTrendChart({ data = [] }: { data?: MonthlyTrend[] }) {
  const { formatMoney } = useCurrency();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return Array.from({ length: 30 }, (_, i) => ({
        date: new Date(2024, 0, i + 1),
        revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
        costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
      }));
    }

    return data.map(d => {
      const parts = d.month.split('-');
      const year = parts[0] || '2024';
      const monthNum = parts[1] || '1';
      return {
        date: new Date(parseInt(year), parseInt(monthNum) - 1, 1),
        revenue: fromMinor(d.income),
        costs: Math.abs(fromMinor(d.expense)),
      };
    });
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col justify-between h-full space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Monthly Income vs Expenses
        </span>
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
            <span>Costs</span>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center min-h-[280px]">
        <AreaChart aspectRatio="2.1 / 1" data={chartData}>
          <Grid horizontal />
          <Area curve={curveMonotoneX} dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
          <Area curve={curveMonotoneX} dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.2} strokeWidth={1.5} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <XAxis />
          <ChartTooltip
            content={({ activeData }) => (
              <div className="flex flex-col gap-1.5 p-1 text-xs">
                <div className="font-bold text-[var(--color-text-primary)]">
                  {new Date(activeData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center justify-between gap-4 text-[var(--color-success)] font-medium">
                  <span>Revenue:</span>
                  <span className="font-semibold tabular-nums">+{formatMoney(activeData.revenue)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[var(--color-danger)] font-medium">
                  <span>Costs:</span>
                  <span className="font-semibold tabular-nums">-{formatMoney(activeData.costs)}</span>
                </div>
              </div>
            )}
          />
        </AreaChart>
      </div>
    </motion.div>
  );
}

export default MonthlyTrendChart;
