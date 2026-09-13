/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { motion } from 'framer-motion';
import { usePieChart } from './PieChartContext.js';
import { } from './PieChartContext.js';

export interface PieSliceProps {
  index: number;
  color?: string;
  fill?: string;
  animate?: boolean;
  showGlow?: boolean;
  hoverEffect?: "translate" | "grow" | "none";
  hoverOffset?: number;
  // Injected by PieChart
  arc?: any; // Removed invalid PieArcDatum import
  path?: any;
}

export function PieSlice({
  index,
  color,
  fill,
  animate = true,
  showGlow = true,
  hoverEffect = "translate",
  hoverOffset = 10,
  arc,
  path
}: PieSliceProps) {
  const { hoveredIndex, setHoveredIndex, data } = usePieChart();

  if (!arc || !path) return null;

  const datum = data[index];
  if (!datum) return null;

  const sliceColor = color || datum.color || fill || `var(--chart-${(index % 5) + 1})`;
  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;
  const isFaded = isAnyHovered && !isHovered;

  // Calculate translation for hover effect
  const midAngle = (arc.startAngle + arc.endAngle) / 2;
  const xOffset = isHovered && hoverEffect === 'translate' ? Math.sin(midAngle) * hoverOffset : 0;
  const yOffset = isHovered && hoverEffect === 'translate' ? -Math.cos(midAngle) * hoverOffset : 0;
  const scale = isHovered && hoverEffect === 'grow' ? 1.05 : 1;

  const d = path(arc);

  return (
    <motion.path
      d={d || ''}
      fill={fill || sliceColor}
      style={{
        transformOrigin: '0px 0px',
        filter: isHovered && showGlow ? `drop-shadow(0 0 8px ${sliceColor}80)` : 'none',
      }}
      initial={animate ? { opacity: 0, scale: 0.8, x: 0, y: 0 } : false}
      animate={{
        opacity: isFaded ? 0.3 : 1,
        scale: scale,
        x: xOffset,
        y: yOffset,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        opacity: { duration: 0.2 },
        delay: animate ? index * 0.05 : 0
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      className="cursor-pointer focus:outline-none"
      role="button"
      tabIndex={0}
      aria-label={`${datum.label}: ${datum.value}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setHoveredIndex(isHovered ? null : index);
        }
      }}
    />
  );
}
