import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePieChart } from './PieChartContext.js';
import { cn } from '../../../lib/utils.js';

export interface PieCenterProps {
  defaultLabel?: string;
  formatOptions?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  children?: (props: { value: number; label: string }) => React.ReactNode;
  className?: string;
}

export function PieCenter({
  defaultLabel = 'Total',
  formatOptions,
  prefix = '',
  suffix = '',
  children,
  className
}: PieCenterProps) {
  const { hoveredIndex, data, total, innerRadius, centerX, centerY } = usePieChart();

  // If there's no inner hole, we shouldn't render center content
  if (innerRadius <= 0) return null;

  const activeData = hoveredIndex !== null ? data[hoveredIndex] : null;
  const value = activeData ? activeData.value : total;
  const label = activeData ? activeData.label : defaultLabel;

  const formattedValue = formatOptions 
    ? new Intl.NumberFormat('en-US', formatOptions).format(value)
    : value.toLocaleString();
    
  const displayValue = `${prefix}${formattedValue}${suffix}`;

  return (
    <foreignObject 
      x={0} 
      y={0} 
      width={centerX * 2} 
      height={centerY * 2}
      className="pointer-events-none"
    >
      <div 
        className={cn("flex flex-col items-center justify-center w-full h-full p-4 text-center", className)}
        style={{ width: innerRadius * 2, height: innerRadius * 2, margin: 'auto', marginTop: centerY - innerRadius, marginLeft: centerX - innerRadius }}
      >
        <AnimatePresence mode="wait">
          {children ? (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            >
              {children({ value, label })}
            </motion.div>
          ) : (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] whitespace-normal">
                {label}
              </span>
              <span className="text-lg sm:text-2xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight whitespace-normal">
                {displayValue}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </foreignObject>
  );
}
