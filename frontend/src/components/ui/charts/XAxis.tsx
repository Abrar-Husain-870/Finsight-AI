import React from 'react';
import { AxisBottom } from '@visx/axis';
import { useLineChart } from './LineChartContext.js';

export interface XAxisProps {
  numTicks?: number;
  tickFormat?: (value: any, index: number) => string;
}

export function XAxis({
  numTicks = 5,
  tickFormat,
}: XAxisProps) {
  const { xScale, innerHeight } = useLineChart();

  return (
    <AxisBottom
      top={innerHeight}
      scale={xScale}
      numTicks={numTicks}
      stroke="transparent"
      tickStroke="transparent"
      tickFormat={tickFormat as any}
      tickLabelProps={() => ({
        fill: 'var(--color-text-secondary)',
        fontSize: 12,
        fontFamily: 'var(--font-sans)',
        textAnchor: 'middle',
        dy: 10,
      })}
    />
  );
}
