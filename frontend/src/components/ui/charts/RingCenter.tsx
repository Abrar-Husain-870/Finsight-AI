import React from 'react';
import { useRingChart } from './RingChartContext.js';
import { cn } from '../../../lib/utils.js';

export interface RingCenterProps {
  defaultLabel?: string;
  formatOptions?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  value?: number;
  className?: string;
}

export function RingCenter({
  defaultLabel = 'Total',
  formatOptions,
  prefix = '',
  suffix = '',
  value: overrideValue,
  className,
}: RingCenterProps) {
  const { data, hoveredIndex, totalValue } = useRingChart();

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;
  const rawVal = overrideValue ?? (activeItem ? activeItem.value : totalValue);
  const label = activeItem ? activeItem.label : defaultLabel;

  const formattedVal = React.useMemo(() => {
    if (formatOptions) {
      return new Intl.NumberFormat('en-US', formatOptions).format(rawVal);
    }
    return rawVal.toLocaleString();
  }, [rawVal, formatOptions]);

  return (
    <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4", className)}>
      <span className="text-3xl font-extrabold text-[var(--color-text-primary)] tabular-nums tracking-tight">
        {prefix}{formattedVal}{suffix}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mt-0.5">
        {label}
      </span>
    </div>
  );
}
