import React from 'react';
import { useLineChart } from './LineChartContext.js';

export function SegmentBackground() {
  const { data, xScale, xDataKey, innerHeight, activePointIndex } = useLineChart();

  if (activePointIndex === null || !data || data.length === 0) return null;
  
  const startIndex = activePointIndex;
  const endIndex = Math.min(activePointIndex + 1, data.length - 1);
  
  if (startIndex === endIndex) return null; // Last point

  const x0 = xScale(new Date(data[startIndex][xDataKey]));
  const x1 = xScale(new Date(data[endIndex][xDataKey]));
  
  if (x0 == null || x1 == null) return null;

  return (
    <rect
      x={x0}
      y={0}
      width={Math.max(0, x1 - x0)}
      height={innerHeight}
      fill="var(--color-primary)"
      fillOpacity={0.05}
      pointerEvents="none"
    />
  );
}

export function SegmentLineFrom() {
  const { data, xScale, xDataKey, innerHeight, activePointIndex } = useLineChart();

  if (activePointIndex === null || !data || data.length === 0) return null;
  
  const startIndex = activePointIndex;
  const endIndex = Math.min(activePointIndex + 1, data.length - 1);
  if (startIndex === endIndex) return null;

  const x0 = xScale(new Date(data[startIndex][xDataKey]));
  if (x0 == null) return null;

  return (
    <line
      x1={x0}
      y1={0}
      x2={x0}
      y2={innerHeight}
      stroke="var(--color-primary)"
      strokeWidth={1}
      strokeDasharray="4,4"
      strokeOpacity={0.5}
      pointerEvents="none"
    />
  );
}

export function SegmentLineTo() {
  const { data, xScale, xDataKey, innerHeight, activePointIndex } = useLineChart();

  if (activePointIndex === null || !data || data.length === 0) return null;
  
  const startIndex = activePointIndex;
  const endIndex = Math.min(activePointIndex + 1, data.length - 1);
  if (startIndex === endIndex) return null;

  const x1 = xScale(new Date(data[endIndex][xDataKey]));
  if (x1 == null) return null;

  return (
    <line
      x1={x1}
      y1={0}
      x2={x1}
      y2={innerHeight}
      stroke="var(--color-primary)"
      strokeWidth={1}
      strokeDasharray="4,4"
      strokeOpacity={0.5}
      pointerEvents="none"
    />
  );
}
