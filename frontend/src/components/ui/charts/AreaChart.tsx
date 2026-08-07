import React from 'react';
import { LineChart, LineChartProps } from './LineChart.js';
import { cn } from '../../../lib/utils.js';

export interface AreaChartProps extends Omit<LineChartProps, 'className'> {
  aspectRatio?: string;
  className?: string;
}

export function AreaChart({
  aspectRatio,
  className,
  ...props
}: AreaChartProps) {
  return (
    <div 
      className={cn("w-full relative", className)}
      style={{ 
        aspectRatio: aspectRatio || 'auto', 
        minHeight: aspectRatio ? undefined : '250px' 
      }}
    >
      <LineChart className="!min-h-0" {...props} />
    </div>
  );
}
