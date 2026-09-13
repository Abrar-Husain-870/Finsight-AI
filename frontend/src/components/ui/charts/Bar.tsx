/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { useLineChart } from './LineChartContext.js';

export interface BarProps {
  dataKey: string;
  fill?: string;
  lineCap?: string | number;
  radius?: number;
  animate?: boolean;
  seriesIndex?: number;
  seriesCount?: number;
}

function getTopRoundedPath(x: number, y: number, width: number, height: number, radius: number) {
  if (height <= 0 || width <= 0) return '';
  const r = Math.min(radius, width / 2, height / 2);
  if (r <= 0) {
    return `M ${x},${y} L ${x + width},${y} L ${x + width},${y + height} L ${x},${y + height} Z`;
  }
  return `M ${x},${y + r} A ${r},${r} 0 0,1 ${x + r},${y} L ${x + width - r},${y} A ${r},${r} 0 0,1 ${x + width},${y + r} L ${x + width},${y + height} L ${x},${y + height} Z`;
}

function getRightRoundedPath(x: number, y: number, width: number, height: number, radius: number) {
  if (height <= 0 || width <= 0) return '';
  const r = Math.min(radius, width / 2, height / 2);
  if (r <= 0) {
    return `M ${x},${y} L ${x + width},${y} L ${x + width},${y + height} L ${x},${y + height} Z`;
  }
  return `M ${x},${y} L ${x + width - r},${y} A ${r},${r} 0 0,1 ${x + width},${y + r} L ${x + width},${y + height - r} A ${r},${r} 0 0,1 ${x + width - r},${y + height} L ${x},${y + height} Z`;
}

export function Bar({
  dataKey,
  fill,
  lineCap = 'round',
  radius = 8,
  animate = true,
  seriesIndex = 0,
  seriesCount = 1,
}: BarProps) {
  const {
    data,
    xScale,
    yScale,
    xDataKey,
    innerHeight,
    orientation = 'vertical',
    activePointIndex,
    setActivePointIndex,
    showTooltip,
    hideTooltip,
  } = useLineChart();

  const isHorizontal = orientation === 'horizontal';

  return (
    <g>
      {data.map((d, i) => {
        const catVal = String(d[xDataKey] ?? '');
        const val = Number(d[dataKey]) || 0;
        const barFill = d.fill || fill || 'var(--color-primary)';
        const numRadius = typeof lineCap === 'number' ? lineCap : lineCap === 'round' ? 8 : radius;

        let x = 0;
        let y = 0;
        let bWidth = 0;
        let bHeight = 0;
        let dPath = '';
        let dotCx = 0;
        let dotCy = 0;

        if (isHorizontal) {
          const fullHeight = yScale.bandwidth ? yScale.bandwidth() : 20;
          const singleBarHeight = (fullHeight / seriesCount) * 0.85;
          const offset = seriesIndex * (fullHeight / seriesCount) + (fullHeight / seriesCount - singleBarHeight) / 2;

          y = (yScale(catVal) ?? 0) + offset;
          x = 0;
          bWidth = Math.max(0, xScale(val) ?? 0);
          bHeight = Math.max(2, singleBarHeight);
          const r = Math.min(numRadius, bWidth / 2, bHeight / 2);
          dPath = getRightRoundedPath(x, y, bWidth, bHeight, r);
          dotCx = x + bWidth;
          dotCy = y + bHeight / 2;
        } else {
          const fullWidth = xScale.bandwidth ? xScale.bandwidth() : 30;
          const singleBarWidth = (fullWidth / seriesCount) * 0.85;
          const offset = seriesIndex * (fullWidth / seriesCount) + (fullWidth / seriesCount - singleBarWidth) / 2;

          x = (xScale(catVal) ?? 0) + offset;
          y = yScale(val) ?? 0;
          bWidth = Math.max(2, singleBarWidth);
          bHeight = Math.max(0, innerHeight - y);
          const r = Math.min(numRadius, bWidth / 2, bHeight / 2);
          dPath = getTopRoundedPath(x, y, bWidth, bHeight, r);
          dotCx = x + bWidth / 2;
          dotCy = y;
        }

        const isHovered = activePointIndex === i;
        const isAnyHovered = activePointIndex !== null;
        const barOpacity = isHovered ? 1 : isAnyHovered ? 0.35 : 0.9;

        const handleMouseEnter = () => {
          setActivePointIndex(i);
          showTooltip({
            tooltipData: d,
            tooltipLeft: dotCx,
            tooltipTop: dotCy,
          });
        };

        const handleMouseLeave = () => {
          setActivePointIndex(null);
          hideTooltip();
        };

        return (
          <g key={i}>
            <motion.path
              initial={animate ? (isHorizontal ? { opacity: 0, scaleX: 0 } : { opacity: 0, scaleY: 0 }) : false}
              animate={isHorizontal ? { opacity: barOpacity, scaleX: 1 } : { opacity: barOpacity, scaleY: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: isHorizontal ? `0px ${y + bHeight / 2}px` : `${x + bWidth / 2}px ${innerHeight}px` }}
              d={dPath}
              fill={barFill}
              className="cursor-pointer transition-opacity"
              onPointerEnter={handleMouseEnter}
              onPointerLeave={handleMouseLeave}
            />
            {isHovered && (
              <circle
                cx={dotCx}
                cy={dotCy}
                r={4}
                fill={barFill}
                stroke="var(--color-bg-primary)"
                strokeWidth={2}
                className="pointer-events-none"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
