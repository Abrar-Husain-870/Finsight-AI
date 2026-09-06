/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { scaleBand, scaleLinear } from '@visx/scale';
import { LineChartProvider } from './LineChartContext.js';
import { cn } from '../../../lib/utils.js';

export interface BarChartProps {
  data: any[];
  xDataKey?: string;
  orientation?: 'vertical' | 'horizontal';
  margin?: { top: number; right: number; bottom: number; left: number };
  children: React.ReactNode;
  className?: string;
  aspectRatio?: string;
}

const defaultMargin = { top: 8, right: 8, bottom: 40, left: 8 };

export function BarChart({
  data,
  xDataKey = 'month',
  orientation = 'vertical',
  margin = defaultMargin,
  children,
  className,
  aspectRatio,
}: BarChartProps) {
  const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [ref, bounds] = useMeasure();

  const width = bounds.width || 0;
  const height = bounds.height || 0;

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const isHorizontal = orientation === 'horizontal';

  const xScale = useMemo(() => {
    if (isHorizontal) {
      let maxVal = 0;
      data.forEach((d) => {
        Object.keys(d).forEach((k) => {
          if (k !== xDataKey && typeof d[k] === 'number') {
            if (d[k] > maxVal) maxVal = d[k];
          }
        });
      });
      return scaleLinear({
        range: [0, innerWidth],
        domain: [0, maxVal * 1.15 || 5],
        nice: true,
      });
    }
    const pad = data.length <= 2 ? 0.65 : 0.55;
    return scaleBand({
      range: [0, innerWidth],
      domain: data.map((d) => String(d[xDataKey] ?? '')),
      paddingInner: pad,
      paddingOuter: pad,
    });
  }, [data, innerWidth, xDataKey, isHorizontal]);

  const yScale = useMemo(() => {
    if (isHorizontal) {
      return scaleBand({
        range: [0, innerHeight],
        domain: data.map((d) => String(d[xDataKey] ?? '')),
        paddingInner: 0.35,
        paddingOuter: 0.2,
      });
    }
    let maxVal = 0;
    data.forEach((d) => {
      Object.keys(d).forEach((k) => {
        if (k !== xDataKey && typeof d[k] === 'number') {
          if (d[k] > maxVal) maxVal = d[k];
        }
      });
    });

    return scaleLinear({
      range: [innerHeight, 0],
      domain: [0, maxVal * 1.15 || 10],
      nice: true,
    });
  }, [data, innerHeight, xDataKey, isHorizontal]);

  return (
    <div
      ref={(node) => {
        ref(node);
        setContainerRef(node);
      }}
      className={cn('w-full h-full min-h-[220px] relative select-none', className)}
      style={{ aspectRatio: aspectRatio || 'auto' }}
    >
      {width > 0 && height > 0 && (
        <LineChartProvider
          data={data}
          width={width}
          height={height}
          margin={margin}
          xDataKey={xDataKey}
          xScale={xScale}
          yScale={yScale}
          orientation={orientation}
          containerRef={containerRef}
        >
          <svg width={width} height={height} className="overflow-visible">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {children}
            </g>
          </svg>
        </LineChartProvider>
      )}
    </div>
  );
}
