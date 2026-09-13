/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { bisector } from 'd3-array';
import { useLineChart } from './LineChartContext.js';
import { Line } from '@visx/shape';

export interface ChartTooltipProps {
  showCrosshair?: boolean;
  showDots?: boolean;
  indicatorColor?: string;
  content?: (props: { activeData: any }) => React.ReactNode;
}

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border-primary)',
  boxShadow: 'var(--shadow-dropdown)',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  zIndex: 50,
};

export function ChartTooltip({
  showCrosshair = true,
  showDots = true,
  indicatorColor = 'var(--color-text-primary)',
  content
}: ChartTooltipProps) {
  const { 
    data, 
    xScale, 
    yScale, 
    xDataKey, 
    innerWidth, 
    innerHeight,
    margin,
    tooltipOpen,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
    setActivePointIndex,
    containerRef
  } = useLineChart();

  const lastActiveIndexRef = React.useRef<number | null>(null);
  const rafIdRef = React.useRef<number | null>(null);

  const handlePointerMove = useCallback((event: React.PointerEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
    const point = localPoint(event);
    if (!point) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      // Convert screen coordinates to SVG coordinates
      const x = point.x - margin.left;
      const x0 = xScale.invert(x);

      // Find the closest data point
      const bisectDate = bisector((d: any) => new Date(d[xDataKey])).left;
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      
      let d = d0;
      let activeIndex = index - 1;
      if (d1 && d0) {
        const d0Date = new Date(d0[xDataKey]).getTime();
        const d1Date = new Date(d1[xDataKey]).getTime();
        if (x0.getTime() - d0Date > d1Date - x0.getTime()) {
          d = d1;
          activeIndex = index;
        }
      } else if (d1) {
        d = d1;
        activeIndex = index;
      }

      if (!d) return;

      if (lastActiveIndexRef.current === activeIndex) {
        return;
      }
      lastActiveIndexRef.current = activeIndex;

      setActivePointIndex(activeIndex);

      // Calculate Y coordinates for dots
      let maxY = 0;
      Object.keys(d).forEach(k => {
        if (k !== xDataKey && typeof d[k] === 'number') {
          if (d[k] > maxY) maxY = d[k];
        }
      });

      showTooltip({
        tooltipData: d,
        tooltipLeft: xScale(new Date(d[xDataKey])),
        tooltipTop: yScale(maxY)
      });
    });
  }, [data, xScale, yScale, xDataKey, margin, showTooltip, setActivePointIndex]);

  const handlePointerLeave = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    lastActiveIndexRef.current = null;
    hideTooltip();
    setActivePointIndex(null);
  }, [hideTooltip, setActivePointIndex]);

  return (
    <>
      {/* Invisible rect to capture events for continuous scale charts */}
      {showCrosshair && typeof xScale?.invert === 'function' && (
        <rect
          x={0}
          y={0}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="cursor-crosshair"
        />
      )}

      {tooltipOpen && tooltipData && (
        <g>
          {showCrosshair && (
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: innerHeight }}
              stroke={indicatorColor}
              strokeWidth={1}
              strokeDasharray="4,4"
              pointerEvents="none"
              opacity={0.3}
            />
          )}
          
          {showDots && Object.keys(tooltipData).map(k => {
            if (k !== xDataKey && typeof tooltipData[k] === 'number') {
              return (
                <circle
                  key={k}
                  cx={tooltipLeft}
                  cy={yScale(tooltipData[k])}
                  r={4}
                  fill="var(--color-bg-primary)"
                  stroke={indicatorColor}
                  strokeWidth={2}
                  pointerEvents="none"
                />
              );
            }
            return null;
          })}
        </g>
      )}

      {tooltipOpen && tooltipData && containerRef && createPortal(
        <TooltipWithBounds
          top={tooltipTop + margin.top}
          left={tooltipLeft + margin.left}
          style={tooltipStyles}
          unstyled={true}
          className="absolute z-50 pointer-events-none rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] shadow-md p-3 text-sm"
        >
          {content ? content({ activeData: tooltipData }) : (
            <div className="flex flex-col gap-1 p-1 text-xs">
              <div className="font-bold text-[var(--color-text-primary)] mb-0.5">
                {tooltipData[xDataKey] instanceof Date
                  ? (tooltipData[xDataKey] as Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : String(tooltipData[xDataKey] ?? '')}
              </div>
              {Object.keys(tooltipData).map(k => {
                if (k !== xDataKey && k !== 'fill' && typeof tooltipData[k] === 'number') {
                  return (
                    <div key={k} className="flex items-center justify-between gap-4 font-medium text-[var(--color-text-primary)]">
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                        {tooltipData.fill && (
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tooltipData.fill }} />
                        )}
                        <span className="capitalize">{k}</span>
                      </div>
                      <span className="font-bold tabular-nums">
                        {tooltipData[k] >= 1000 ? `$${tooltipData[k].toLocaleString()}` : `$${tooltipData[k]}`}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </TooltipWithBounds>,
        containerRef
      )}
    </>
  );
}
