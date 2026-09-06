/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AxisBottom } from '@visx/axis';
import { useLineChart } from './LineChartContext.js';

export interface BarXAxisProps {
  tickFormat?: (value: any, index: number) => string;
}

export function BarXAxis({ tickFormat }: BarXAxisProps) {
  const { xScale, innerHeight, activePointIndex, data, xDataKey } = useLineChart();

  return (
    <AxisBottom
      top={innerHeight}
      scale={xScale}
      stroke="transparent"
      tickStroke="transparent"
      tickFormat={tickFormat as any}
      tickComponent={(props: any) => {
        const { x, y, formattedValue } = props;
        const text = String(formattedValue ?? props.tick ?? '');
        const activeItem = activePointIndex !== null && data ? data[activePointIndex] : null;
        const activeXVal = activeItem ? String(activeItem[xDataKey] ?? '') : null;
        const isHovered = activeXVal !== null && text === activeXVal;
        const approxWidth = Math.max(70, text.length * 7 + 24);

        if (isHovered) {
          return (
            <g transform={`translate(${x}, ${y + 6})`}>
              <rect
                x={-approxWidth / 2}
                y={0}
                width={approxWidth}
                height={26}
                rx={13}
                ry={13}
                fill="#FFFFFF"
              />
              <text
                x={0}
                y={17}
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
          <g transform={`translate(${x}, ${y + 6})`}>
            <text
              x={0}
              y={16}
              textAnchor="middle"
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
