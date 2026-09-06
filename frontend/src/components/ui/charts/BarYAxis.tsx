/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AxisLeft } from '@visx/axis';
import { useLineChart } from './LineChartContext.js';

export interface BarYAxisProps {
  tickFormat?: (value: any, index: number) => string;
}

export function BarYAxis({ tickFormat }: BarYAxisProps) {
  const { yScale, activePointIndex, data, xDataKey } = useLineChart();

  return (
    <AxisLeft
      scale={yScale}
      stroke="transparent"
      tickStroke="transparent"
      tickFormat={tickFormat as any}
      tickComponent={(props: any) => {
        const { x, y, formattedValue } = props;
        const text = String(formattedValue ?? props.tick ?? '');
        const activeItem = activePointIndex !== null && data ? data[activePointIndex] : null;
        const activeXVal = activeItem ? String(activeItem[xDataKey] ?? '') : null;
        const isHovered = activeXVal !== null && text === activeXVal;

        if (isHovered) {
          const approxWidth = Math.max(60, text.length * 6 + 16);
          return (
            <g transform={`translate(${x - 6}, ${y})`}>
              <rect
                x={-approxWidth}
                y={-11}
                width={approxWidth}
                height={22}
                rx={11}
                ry={11}
                fill="#FFFFFF"
              />
              <text
                x={-approxWidth / 2}
                y={4}
                textAnchor="middle"
                fill="#111827"
                fontSize={11}
                fontWeight={700}
                fontFamily="var(--font-sans)"
              >
                {text}
              </text>
            </g>
          );
        }

        return (
          <g transform={`translate(${x - 6}, ${y})`}>
            <text
              x={0}
              y={4}
              textAnchor="end"
              fill="var(--color-text-secondary)"
              fontSize={11}
              fontWeight={500}
              fontFamily="var(--font-sans)"
            >
              {text}
            </text>
          </g>
        );
      }}
    />
  );
}
