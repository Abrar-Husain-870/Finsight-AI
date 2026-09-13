import React from 'react';
import { motion } from 'framer-motion';
import { useRingChart } from './RingChartContext.js';

export interface RingProps {
  index: number;
  color?: string;
  className?: string;
}

const defaultColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function Ring({ index, color, className }: RingProps) {
  const { data, size, ringGap, strokeWidth, hoveredIndex, setHoveredIndex } = useRingChart();
  const item = data[index];
  if (!item) return null;

  const center = size / 2;
  const outerRadius = center - strokeWidth / 2 - 4;
  const radius = Math.max(10, outerRadius - index * (strokeWidth + ringGap));
  const circumference = 2 * Math.PI * radius;

  const maxVal = item.max || (data.length === 1 ? 100 : Math.max(...data.map(d => d.value)));
  const percentage = Math.min(1, Math.max(0, item.value / (maxVal || 1)));
  const strokeDashoffset = circumference - percentage * circumference;

  const strokeColor = color || item.color || item.fill || defaultColors[index % defaultColors.length];
  const isHovered = hoveredIndex === index;

  return (
    <g
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="cursor-pointer transition-opacity duration-200"
      style={{ opacity: hoveredIndex === null || isHovered ? 1 : 0.4 }}
    >
      {/* Background Track Circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={0.15}
      />
      {/* Animated Ring Arc */}
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        strokeLinecap="round"
        className={className}
      />
    </g>
  );
}
