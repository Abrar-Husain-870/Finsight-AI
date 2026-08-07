import React, { useId } from 'react';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { motion } from 'framer-motion';
import { useLineChart } from './LineChartContext.js';
import { LinearGradient } from '@visx/gradient';

export interface LineProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  curve?: any;
  animate?: boolean;
  fadeEdges?: boolean;
}

export function Line({
  dataKey,
  stroke = 'var(--chart-line-primary)',
  strokeWidth = 2,
  curve = curveMonotoneX,
  animate = true,
  fadeEdges = true,
}: LineProps) {
  const { data, xScale, yScale, xDataKey, innerHeight, innerWidth } = useLineChart();
  const id = useId();
  const maskId = fadeEdges ? `line-mask-${id}` : undefined;

  return (
    <g>
      {fadeEdges && (
        <mask id={maskId}>
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="url(#fade-mask-gradient-line)"
          />
        </mask>
      )}

      {/* Define the mask gradient globally if fadeEdges is used */}
      {fadeEdges && (
        <LinearGradient
          id="fade-mask-gradient-line"
          from="#000000"
          to="#ffffff"
          fromOffset="0%"
          toOffset="10%"
        >
          <stop offset="90%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#000000" />
        </LinearGradient>
      )}

      <motion.g
        initial={animate ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth ease out
      >
        <LinePath
          data={data}
          x={(d) => xScale(new Date(d[xDataKey])) ?? 0}
          y={(d) => yScale(d[dataKey]) ?? 0}
          stroke={stroke}
          strokeWidth={strokeWidth}
          curve={curve}
          mask={maskId ? `url(#${maskId})` : undefined}
        />
      </motion.g>
    </g>
  );
}
