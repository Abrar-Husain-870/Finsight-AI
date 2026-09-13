/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useId } from 'react';
import useMeasure from 'react-use-measure';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';

export interface GaugeProps {
  orientation?: 'linear' | 'arc';
  value?: number; // 0 to 100 or ratio
  centerValue?: number | string;
  defaultLabel?: string;
  labelPlacement?: 'bottom' | 'center' | 'top';
  labelAlign?: 'center' | 'left' | 'right';
  formatOptions?: Intl.NumberFormatOptions;
  totalNotches?: number;
  spacing?: number;
  notchCornerRadius?: number;
  inactiveFillOpacity?: number;
  useGradient?: boolean;
  color?: string;
  className?: string;
  height?: number | string;
}

export function Gauge({
  orientation = 'linear',
  value = 72,
  centerValue,
  defaultLabel,
  labelPlacement = 'bottom',
  labelAlign = 'center',
  formatOptions,
  totalNotches = 72,
  spacing = 0,
  notchCornerRadius = 3,
  inactiveFillOpacity = 0.4,
  useGradient = true,
  color = 'var(--chart-2)',
  className,
  height = 110,
}: GaugeProps) {
  const { formatMoney } = useCurrency();
  const [ref, bounds] = useMeasure();
  const rawId = useId();
  const gradientId = `gauge-gradient-${rawId.replace(/:/g, '')}`;

  const width = bounds.width || 300;
  const N = Math.max(10, totalNotches);

  const pct = Math.min(100, Math.max(0, value));
  const activeCount = Math.round((pct / 100) * N);

  // Format centerValue
  let displayCenterValue = '';
  if (centerValue !== undefined && centerValue !== null) {
    if (typeof centerValue === 'string') {
      displayCenterValue = centerValue;
    } else if (typeof centerValue === 'number') {
      if (formatOptions) {
        displayCenterValue = new Intl.NumberFormat('en-US', formatOptions).format(centerValue);
      } else {
        displayCenterValue = formatMoney(centerValue);
      }
    }
  } else {
    displayCenterValue = `${value}%`;
  }

  const alignClass =
    labelAlign === 'left' ? 'items-start text-left' : labelAlign === 'right' ? 'items-end text-right' : 'items-center text-center';

  const isArc = orientation === 'arc' || spacing >= 10;

  if (isArc) {
    const arcNotches = totalNotches > 0 && totalNotches !== 72 ? totalNotches : 44;
    const arcPct = Math.min(100, Math.max(0, value));
    const arcActiveCount = Math.round((arcPct / 100) * arcNotches);
    
    const cx = 135;
    const cy = 135;
    const radiusOuter = 100;
    const notchLen = 22;
    const notchW = 4.5;
    const startAngleDeg = -135; // 7:30 o'clock
    const sweepAngleDeg = 270;  // 270 degree sweep to 4:30 o'clock

    return (
      <div
        ref={ref}
        className={cn('w-full flex flex-col items-center justify-center select-none font-sans relative py-2 min-w-[280px]', className)}
        style={{ height: height === 'auto' ? 'auto' : (typeof height === 'number' ? `${height}px` : height) }}
      >
        <div className="relative w-[270px] h-[220px] flex items-center justify-center">
          <svg width="270" height="220" viewBox="0 0 270 220" className="overflow-visible">
            <defs>
              {useGradient && (
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={1} />
                </linearGradient>
              )}
            </defs>

            {Array.from({ length: arcNotches }).map((_, i) => {
              const rotDeg = startAngleDeg + (i / (arcNotches - 1)) * sweepAngleDeg;
              const isActive = i < arcActiveCount;
              const notchFill = isActive ? (useGradient ? `url(#${gradientId})` : color) : 'var(--border)';
              const opacity = isActive ? 1.0 : inactiveFillOpacity;

              return (
                <g key={i} transform={`rotate(${rotDeg}, ${cx}, ${cy})`}>
                  <motion.rect
                    x={cx - notchW / 2}
                    y={cy - radiusOuter}
                    width={notchW}
                    height={notchLen}
                    rx={notchCornerRadius}
                    ry={notchCornerRadius}
                    fill={notchFill}
                    opacity={opacity}
                    initial={{ opacity: 0, scaleY: 0.5 }}
                    animate={{ opacity, scaleY: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.005, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: `${cx}px ${cy - radiusOuter + notchLen}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Label inside semi-circle arch */}
          <div 
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none w-[200px]"
            style={{
              left: '135px',
              top: '126px',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] tabular-nums tracking-tight">
              {displayCenterValue}
            </div>
            {defaultLabel && (
              <div className="text-xs font-semibold text-[var(--muted-foreground)] mt-1 tracking-wide">
                {defaultLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const px = 16;
  const W_avail = Math.max(100, width - 2 * px);
  const gap = Math.min(4, spacing > 0 ? spacing : 1.2);
  const gapSpace = (N - 1) * gap;
  const notchWidth = Math.max(1.5, (W_avail - gapSpace) / N);
  const notchHeight = 28;

  return (
    <div
      ref={ref}
      className={cn('w-full flex flex-col justify-center select-none font-sans py-1', className)}
      style={{ height: height === 'auto' ? 'auto' : (typeof height === 'number' ? `${height}px` : height) }}
    >
      {/* Top Label Placement */}
      {labelPlacement === 'top' && (
        <div className={cn('flex flex-col mb-2.5', alignClass)}>
          <div className="text-2xl font-extrabold text-[var(--foreground)] tabular-nums tracking-tight">
            {displayCenterValue}
          </div>
          {defaultLabel && <div className="text-xs font-semibold text-[var(--muted-foreground)] mt-0.5">{defaultLabel}</div>}
        </div>
      )}

      {/* Linear Notch Track SVG */}
      <div className="w-full flex items-center justify-center">
        <svg width={width} height={notchHeight + 4} className="w-full overflow-visible">
          <defs>
            {useGradient && (
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={1} />
              </linearGradient>
            )}
          </defs>

          {Array.from({ length: N }).map((_, i) => {
            const x = px + i * (notchWidth + gap);
            const isActive = i < activeCount;
            const notchFill = isActive ? (useGradient ? `url(#${gradientId})` : color) : 'var(--border)';
            const opacity = isActive ? 1.0 : inactiveFillOpacity;

            return (
              <motion.rect
                key={i}
                x={x}
                y={2}
                width={notchWidth}
                height={notchHeight}
                rx={notchCornerRadius}
                ry={notchCornerRadius}
                fill={notchFill}
                opacity={opacity}
                initial={{ opacity: 0, scaleY: 0.5 }}
                animate={{ opacity, scaleY: 1 }}
                transition={{ duration: 0.3, delay: i * 0.004, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${x + notchWidth / 2}px ${notchHeight / 2 + 2}px` }}
              />
            );
          })}
        </svg>
      </div>

      {/* Bottom Label Placement */}
      {(labelPlacement === 'bottom' || labelPlacement === 'center') && (
        <div className={cn('flex flex-col mt-2.5', alignClass)}>
          <div className="text-2xl font-extrabold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {displayCenterValue}
          </div>
          {defaultLabel && <div className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5">{defaultLabel}</div>}
        </div>
      )}
    </div>
  );
}
