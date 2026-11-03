/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AxisLeft } from '@visx/axis';
import { useLineChart } from './LineChartContext.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';

export interface YAxisProps {
  numTicks?: number;
  tickFormat?: (value: any, index: number) => string;
  hideAxisLine?: boolean;
  yAxisId?: string;
}

export function YAxis({
  numTicks = 4,
  tickFormat,
  hideAxisLine = true,
}: YAxisProps) {
  const { yScale } = useLineChart();
  const { formatCompact } = useCurrency();

  const defaultFormat = (val: any) => {
    if (typeof val === 'number') {
      return formatCompact(val, false);
    }
    return String(val);
  };

  return (
    <AxisLeft
      scale={yScale}
      numTicks={numTicks}
      stroke={hideAxisLine ? "transparent" : "var(--color-border-primary)"}
      tickStroke="transparent"
      tickFormat={(tickFormat || defaultFormat) as any}
      tickLabelProps={() => ({
        fill: 'var(--color-text-secondary)',
        fontSize: 10,
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        textAnchor: 'end',
        dx: -6,
        dy: 3,
      })}
    />
  );
}
