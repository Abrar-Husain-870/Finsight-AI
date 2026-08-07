import React from 'react';
import { Grid as VisxGrid } from '@visx/grid';
import { useLineChart } from './LineChartContext.js';

export interface GridProps {
  horizontal?: boolean;
  vertical?: boolean;
  numTicksRows?: number;
  numTicksColumns?: number;
  stroke?: string;
  strokeDasharray?: string;
}

export function Grid({
  horizontal = true,
  vertical = false,
  numTicksRows = 5,
  numTicksColumns = 10,
  stroke = 'var(--color-border-primary)',
  strokeDasharray = '4,4'
}: GridProps) {
  const { xScale, yScale, innerWidth, innerHeight } = useLineChart();

  return (
    <VisxGrid
      xScale={xScale}
      yScale={yScale}
      width={innerWidth}
      height={innerHeight}
      numTicksRows={numTicksRows}
      numTicksColumns={numTicksColumns}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      rowLineStyle={horizontal ? undefined : { display: 'none' }}
      columnLineStyle={vertical ? undefined : { display: 'none' }}
    />
  );
}
