import React, { useMemo } from 'react';
import { Brush } from '@visx/brush';
import { scaleTime, scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';
import useMeasure from 'react-use-measure';
import { useChartBrushContext } from './ChartBrushLayout.js';

export interface ChartBrushProps {
  data: any[];
  xDataKey?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  children?: React.ReactNode; 
}

export function ChartBrush({
  data,
  xDataKey = 'date',
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
  children
}: ChartBrushProps) {
  const [ref, bounds] = useMeasure();
  const { setXDomain } = useChartBrushContext();
  
  const width = bounds.width || 0;
  const height = bounds.height || 0;
  
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);
  
  const xScale = useMemo(() => {
    return scaleTime({
      range: [0, innerWidth],
      domain: extent(data, d => new Date(d[xDataKey])) as [Date, Date]
    });
  }, [data, innerWidth, xDataKey]);

  const dummyYScale = useMemo(() => scaleLinear({ range: [innerHeight, 0], domain: [0, 1] }), [innerHeight]);

  return (
    <div ref={ref} className="w-full h-full relative overflow-hidden">
      {width > 0 && height > 0 && (
        <svg width={width} height={height} className="absolute inset-0">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {children}
            <Brush
              xScale={xScale}
              yScale={dummyYScale}
              width={innerWidth}
              height={innerHeight}
              handleSize={8}
              resizeTriggerAreas={['left', 'right']}
              brushDirection="horizontal"
              onChange={(domain) => {
                if (domain) {
                  const { x0, x1 } = domain;
                  if (x0 != null && x1 != null) {
                    setXDomain([new Date(x0), new Date(x1)]);
                  }
                } else {
                  setXDomain(undefined);
                }
              }}
              selectedBoxStyle={{
                fill: 'var(--color-primary)',
                fillOpacity: 0.1,
                stroke: 'var(--color-primary)',
              }}
            />
          </g>
        </svg>
      )}
    </div>
  );
}
