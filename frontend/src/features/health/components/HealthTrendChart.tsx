import React from 'react';
import { LineChart, Line, Grid, XAxis, ChartTooltip } from '../../../components/ui/charts/index.js';

interface Props {
  data?: { date: string; score: number }[];
}

export function HealthTrendChart({ data = [] }: Props) {
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          date: d,
          desktop: Math.floor(65 + Math.sin(i) * 15 + i * 3),
          score: Math.floor(65 + Math.sin(i) * 15 + i * 3),
        };
      });
    }

    return data.map(d => ({
      date: new Date(d.date),
      desktop: d.score,
      score: d.score,
    }));
  }, [data]);

  return (
    <div 
      className="h-64 w-full relative" 
      role="figure" 
      aria-label="Health Score Trend Chart"
    >
      <div className="sr-only">
        Line chart displaying health score over time.
      </div>
      <LineChart margin={{ top: 8, right: 8, bottom: 40, left: 8 }} data={chartData}>
        <Grid horizontal />
        <Line dataKey="desktop" strokeWidth={2} />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </div>
  );
}
export default HealthTrendChart;
