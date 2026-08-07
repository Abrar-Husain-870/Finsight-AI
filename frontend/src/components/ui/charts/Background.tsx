import React, { useId } from 'react';
import { PatternCircles, PatternLines } from '@visx/pattern';
import { useLineChart } from './LineChartContext.js';

export interface BackgroundProps {
  pattern?: 'dots' | 'lines' | 'solid';
  opacity?: number;
  color?: string;
}

export function Background({ 
  pattern = 'dots', 
  opacity = 0.5, 
  color = 'var(--color-border-primary)' 
}: BackgroundProps) {
  const { innerWidth, innerHeight } = useLineChart();
  const id = useId();
  const patternId = `bg-pattern-${id}`;

  return (
    <g>
      {pattern === 'dots' && (
        <PatternCircles
          id={patternId}
          width={16}
          height={16}
          radius={1.5}
          fill={color}
        />
      )}
      {pattern === 'lines' && (
        <PatternLines
          id={patternId}
          width={16}
          height={16}
          orientation={['diagonal']}
          stroke={color}
          strokeWidth={1}
        />
      )}
      <rect
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill={pattern === 'solid' ? color : `url(#${patternId})`}
        opacity={opacity}
        pointerEvents="none"
      />
    </g>
  );
}
