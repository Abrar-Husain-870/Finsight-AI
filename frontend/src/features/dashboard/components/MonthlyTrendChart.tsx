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
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 p-2">
         <span className="text-sm font-medium text-[var(--color-text-secondary)]">Revenue vs Costs</span>
      </div>

      <div className="pt-12 w-full">
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
