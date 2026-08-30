import React, { useMemo } from 'react';
import { MonthlyTrend, fromMinor } from '@finsight/shared';
import { motion } from 'framer-motion';
import { curveMonotoneX } from '@visx/curve';
import { 
  AreaChart, 
  Area, 
  Grid,
  XAxis, 
  ChartTooltip,
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo
} from '../../../components/ui/charts/index.js';

export function MonthlyTrendChart({ data = [] }: { data?: MonthlyTrend[] }) {
  const chartData = useMemo(() => {
    return data.map(d => {
      const parts = d.month.split('-');
      const year = parts[0] || '2000';
      const month = parts[1] || '1';
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      const income = fromMinor(d.income);
      // Expenses are stored as negative transaction amounts, so we use Math.abs to plot them positively
      const expense = Math.abs(fromMinor(d.expense));
      
      return {
        date: date.toISOString(),
        revenue: income,
        costs: expense
      };
    });
  }, [data]);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full relative flex flex-col"
      role="figure"
      aria-label="Revenue vs Costs Trend"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Revenue vs Costs</span>
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: 'var(--chart-1)' }} />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: 'var(--color-danger)' }} />
            <span>Costs</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <AreaChart aspectRatio="4 / 1" data={chartData}>
          <Grid horizontal />
          <Area curve={curveMonotoneX} dataKey="revenue" fill="var(--chart-1)" fillOpacity={0.3} strokeWidth={2} />
          <Area curve={curveMonotoneX} dataKey="costs" fill="var(--color-danger)" fillOpacity={0.2} strokeWidth={1.5} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <XAxis />
          <ChartTooltip />
        </AreaChart>
      </div>
    </motion.div>
  );
}
