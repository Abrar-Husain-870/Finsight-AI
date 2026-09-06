/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import useMeasure from 'react-use-measure';
import { scaleTime, scaleLinear } from '@visx/scale';
import { extent } from 'd3-array';
import { LineChartProvider } from './LineChartContext.js';
import { cn } from '../../../lib/utils.js';

export interface LineChartProps {
  data: any[];
  xDataKey?: string;
  margin?: { top: number; right: number; bottom: number; left: number };
  children: React.ReactNode;
  className?: string;
  xDomain?: [Date, Date] | undefined;
  tweenYDomainOnXDomainChange?: boolean;
}

const defaultMargin = { top: 25, right: 20, bottom: 35, left: 50 };

export function LineChart({
  data,
  xDataKey = 'date',
  margin = defaultMargin,
  children,
  className,
  xDomain,
  tweenYDomainOnXDomainChange
}: LineChartProps) {
  const [containerRef, setContainerRef] = React.useState<HTMLDivElement | null>(null);
  const [ref, bounds] = useMeasure();
  
  const width = bounds.width || 0;
  const height = bounds.height || 0;
  
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Collect all data including projection lines for proper domain scaling
  const allDataPoints = useMemo(() => {
    const points = [...data];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props && Array.isArray((child.props as any).data)) {
        points.push(...(child.props as any).data);
      }
    });
    return points;
  }, [data, children]);

  // Scales
  const xScale = useMemo(() => {
    return scaleTime({
      range: [0, innerWidth],
      domain: xDomain || (extent(allDataPoints, d => new Date(d[xDataKey])) as [Date, Date]),
    });
  }, [allDataPoints, innerWidth, xDataKey, xDomain]);

  const yScale = useMemo(() => {
    let maxVal = 0;
    
    // Filter data if tweenYDomainOnXDomainChange is true and xDomain is provided
    const relevantData = (tweenYDomainOnXDomainChange && xDomain) 
      ? allDataPoints.filter(d => {
          const date = new Date(d[xDataKey]).getTime();
          return date >= xDomain[0].getTime() && date <= xDomain[1].getTime();
        })
      : allDataPoints;

    relevantData.forEach(d => {
      Object.keys(d).forEach(k => {
        if (k !== xDataKey && typeof d[k] === 'number') {
          if (d[k] > maxVal) maxVal = d[k];
        }
      });
    });
    
    // Add 25% padding to top so peak markers and tooltips are never cropped
    return scaleLinear({
      range: [innerHeight, 0],
      domain: [0, maxVal * 1.25 || 10],
      nice: true,
    });
  }, [allDataPoints, innerHeight, xDataKey, xDomain, tweenYDomainOnXDomainChange]);

  return (
    <div 
      ref={(node) => { 
        ref(node); 
        setContainerRef(node); 
      }} 
      className={cn("w-full h-full min-h-[250px] relative select-none", className)}
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
