import React from 'react';
import { LineChart, Line, Grid, XAxis, ChartTooltip } from '../../../components/ui/charts/index.js';

interface Props {
  data: { date: string; score: number }[];
}

export function HealthTrendChart({ data }: Props) {
  // Add a small offset to the data to prevent exact 100/0 cropping on Y axis if needed,
  // but LineChart auto calculates domain with 10% padding anyway.
  
  // Format the date properly for parsing
  const chartData = React.useMemo(() => {
    return data.map(d => ({
      date: new Date(d.date).toISOString(),
      score: d.score
    }));
  }, [data]);

  return (
    <div 
      className="h-64 w-full relative" 
      role="figure" 
      aria-label="Health Score Trend Chart"
    >
      <div className="sr-only">
        Line chart displaying health score over time. The most recent score is {data[data.length - 1]?.score || 0}.
      </div>
      <LineChart data={chartData} xDataKey="date" margin={{ top: 20, right: 10, bottom: 30, left: 10 }}>
        <Grid horizontal numTicksRows={5} vertical={false} />
        <XAxis 
          numTicks={5} 
          tickFormat={(v) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(v))} 
        />
        <Line 
          dataKey="score" 
          stroke="var(--chart-1)" 
          strokeWidth={3} 
        />
        <ChartTooltip 
          content={({ activeData }) => (
            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(activeData.date))}
              </div>
              <div className="flex justify-between items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--chart-1)]" />
                  <span className="text-[var(--color-text-primary)]">Score</span>
                </div>
                <span className="tabular-nums text-[var(--color-text-primary)]">{activeData.score}</span>
              </div>
            </div>
          )}
        />
      </LineChart>
    </div>
  );
}
