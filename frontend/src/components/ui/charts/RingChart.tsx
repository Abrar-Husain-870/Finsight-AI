import React from 'react';
import { RingChartProvider, RingDataItem } from './RingChartContext.js';
import { cn } from '../../../lib/utils.js';

export interface RingChartProps {
  data: RingDataItem[];
  ringGap?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children: React.ReactNode;
}

export function RingChart({
  data,
  ringGap = 8,
  size = 250,
  strokeWidth = 18,
  className,
  children,
}: RingChartProps) {
  return (
    <RingChartProvider data={data} size={size} ringGap={ringGap} strokeWidth={strokeWidth}>
      <div
        className={cn("relative flex items-center justify-center select-none", className)}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="overflow-visible transform -rotate-90">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && (child.type as any)?.name === 'Ring') {
              return child;
            }
            return null;
          })}
        </svg>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && (child.type as any)?.name !== 'Ring') {
            return child;
          }
          return null;
        })}
      </div>
    </RingChartProvider>
  );
}
