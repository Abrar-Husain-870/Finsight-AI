/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { motion } from 'framer-motion';
import { useLineChart } from './LineChartContext.js';

export interface AreaProps {
  dataKey: string;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  curve?: any;
  animate?: boolean;
  showMarkers?: boolean;
  markers?: { radius?: number; ringGap?: number; strokeWidth?: number };
}

const parseDate = (val: any) => {
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  return new Date(val);
};

export function Area({
  dataKey,
  fill = 'var(--chart-line-primary)',
  fillOpacity = 0.3,
  stroke,
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
  showMarkers = false,
  markers = { radius: 5, ringGap: 2, strokeWidth: 2 },
}: AreaProps) {
  const { data, xScale, yScale, xDataKey } = useLineChart();

  return (
    <g>
      <motion.g
        initial={animate ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <AreaClosed
          data={data}
          x={(d) => xScale(parseDate(d[xDataKey])) ?? 0}
          y={(d) => yScale(d[dataKey]) ?? 0}
          yScale={yScale}
          fill={fill}
          fillOpacity={fillOpacity}
          curve={curve}
        />
        <LinePath
          data={data}
          x={(d) => xScale(parseDate(d[xDataKey])) ?? 0}
          y={(d) => yScale(d[dataKey]) ?? 0}
          stroke={stroke || fill}
          strokeWidth={strokeWidth}
          curve={curve}
        />
        {showMarkers && data.map((d, i) => {
          const cx = xScale(parseDate(d[xDataKey])) ?? 0;
          const cy = yScale(d[dataKey]) ?? 0;
          const r = markers?.radius || 5;
          const sw = markers?.strokeWidth || 2;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="var(--color-bg-primary)"
              stroke={fill}
              strokeWidth={sw}
            />
          );
        })}
      </motion.g>
    </g>
  );
}
