import React, { useId } from 'react';
import { AreaClosed, LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { motion } from 'framer-motion';
import { useLineChart } from './LineChartContext.js';

export interface AreaProps {
  dataKey: string;
  fill?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  curve?: any;
  animate?: boolean;
}

export function Area({
  dataKey,
  fill = 'var(--chart-line-primary)',
  fillOpacity = 0.3,
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
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
          x={(d) => xScale(new Date(d[xDataKey])) ?? 0}
          y={(d) => yScale(d[dataKey]) ?? 0}
          yScale={yScale}
          fill={fill}
          fillOpacity={fillOpacity}
          curve={curve}
        />
        <LinePath
          data={data}
          x={(d) => xScale(new Date(d[xDataKey])) ?? 0}
          y={(d) => yScale(d[dataKey]) ?? 0}
          stroke={fill}
          strokeWidth={strokeWidth}
          curve={curve}
        />
      </motion.g>
    </g>
  );
}
