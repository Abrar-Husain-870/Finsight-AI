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
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          date: new Date(d.getFullYear(), d.getMonth(), 1),
          revenue: Math.floor(8000 + Math.sin(i / 2) * 3000),
          costs: Math.floor(4000 + Math.cos(i / 2) * 1500),
        };
      });
    }

    return data.map(d => {
      let date: Date;
      if (!d.month) {
        date = new Date();
      } else {
        const parts = String(d.month).split('-');
        if (parts.length >= 2) {
          const yearStr = parts[0] || '';
          const monthStr = parts[1] || '';
          const year = parseInt(yearStr, 10) || new Date().getFullYear();
          const monthNum = parseInt(monthStr, 10) || 1;
          date = new Date(year, monthNum - 1, 1);
        } else {
          const parsed = new Date(d.month);
          date = !isNaN(parsed.getTime()) ? parsed : new Date();
        }
      }

      const revenue = typeof d.income === 'number' ? fromMinor(d.income) : 0;
      const costs = typeof d.expense === 'number' ? Math.abs(fromMinor(d.expense)) : 0;

      return {
        date: isNaN(date.getTime()) ? new Date() : date,
        revenue: isNaN(revenue) ? 0 : revenue,
        costs: isNaN(costs) ? 0 : costs,
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
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--chart-2)]" />
            <span className="text-[var(--chart-2)] font-semibold">Income (+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text-secondary)] font-semibold">Expenses (-)</span>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-center min-h-[280px]">
        <AreaChart aspectRatio="2.1 / 1" data={chartData}>
          <Grid horizontal />
          <Area curve={curveMonotoneX} dataKey="revenue" fill="var(--chart-2)" fillOpacity={0.2} stroke="var(--chart-2)" strokeWidth={2} />
          <Area curve={curveMonotoneX} dataKey="costs" fill="oklch(0.55 0 0)" fillOpacity={0.12} stroke="oklch(0.65 0 0)" strokeWidth={1.5} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <XAxis />
          <ChartTooltip
            content={({ activeData }) => (
              <div className="flex flex-col gap-1.5 p-1 text-xs">
                <div className="font-bold text-[var(--color-text-primary)]">
                  {new Date(activeData.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center justify-between gap-4 text-emerald-500 dark:text-emerald-400 font-semibold">
                  <span>Income:</span>
                  <span className="tabular-nums">+{formatMoney(activeData.revenue)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-rose-500 dark:text-rose-400 font-semibold">
                  <span>Expenses:</span>
                  <span className="tabular-nums">-{formatMoney(activeData.costs)}</span>
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
