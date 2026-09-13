import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

interface DataPoint {
  label: string;
  value: number; // in thousands (₹ or $)
  x: number;
  y: number;
}

export function HealthCashFlowCard() {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // SVG dimensions
  const width = 340;
  const height = 140;

  // Chart coordinates normalized to viewbox 0 0 340 140
  // Values representing +₹2k to -₹2k or similar wave
  const points: DataPoint[] = [
    { label: 'Sep 1', value: -1850, x: 20, y: 125 },
    { label: 'Sep 6', value: 1350, x: 70, y: 75 },
    { label: 'Sep 11', value: 2280, x: 120, y: 50 },
    { label: 'Sep 16', value: 4850, x: 170, y: 15 },
    { label: 'Sep 21', value: 2560, x: 220, y: 45 },
    { label: 'Sep 26', value: -1100, x: 270, y: 110 },
    { label: 'Sep 30', value: 2265, x: 320, y: 55 },
  ];

  // SVG Smooth Cubic Bezier path
  const pathD = `M 20 125 C 45 105, 55 85, 70 75 C 95 60, 105 52, 120 50 C 145 46, 155 15, 170 15 C 195 15, 205 38, 220 45 C 245 56, 255 105, 270 110 C 290 115, 305 70, 320 55`;
  const fillD = `${pathD} L 320 135 L 20 135 Z`;

  return (
    <div className="h-full flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Cash Flow Overview
            </h3>
            <div className="group relative cursor-pointer">
              <Info className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block w-48 p-2 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[11px] text-[var(--color-text-secondary)] shadow-lg z-20 pointer-events-none text-center">
                Net difference between total monthly income and expense outlays.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
            This Month
          </span>
        </div>

        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
          Your net cash flow for the selected period
        </p>

        {/* Large figure */}
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
            +₹48,265.75
          </div>
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Net Cash Flow
          </span>
        </div>
      </div>

      {/* Interactive Spline Chart */}
      <div className="mt-4 relative">
        <div className="flex justify-between items-center text-[10px] text-[var(--color-text-secondary)]/70 pb-1">
          <span>+₹50k</span>
          <span>₹0</span>
          <span>-₹20k</span>
        </div>

        <div className="relative w-full h-36">
          <svg
            viewBox="0 0 340 140"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cashflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1="15" y1="15" x2="325" y2="15" stroke="currentColor" className="text-neutral-200/40 dark:text-neutral-800/60" strokeDasharray="3 3" />
            <line x1="15" y1="75" x2="325" y2="75" stroke="currentColor" className="text-neutral-200/40 dark:text-neutral-800/60" strokeDasharray="3 3" />
            <line x1="15" y1="135" x2="325" y2="135" stroke="currentColor" className="text-neutral-200/40 dark:text-neutral-800/60" />

            {/* Area Fill */}
            <path d={fillD} fill="url(#cashflowGrad)" />

            {/* Smooth Spline Path */}
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              className="text-neutral-900 dark:text-neutral-100"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Node Dots */}
            {points.map((p, i) => (
              <g key={i} className="cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.label === p.label ? "6" : "3.5"}
                  className={cn(
                    "fill-[var(--color-bg-primary)] stroke-current transition-all duration-150",
                    hoveredPoint?.label === p.label ? "text-emerald-500 stroke-[3]" : "text-neutral-900 dark:text-neutral-100 stroke-2"
                  )}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-full px-2 py-1 rounded bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] text-[10px] font-semibold text-[var(--color-text-primary)] shadow-md"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100 - 8}%`,
              }}
            >
              {hoveredPoint.label}: {hoveredPoint.value > 0 ? `+₹${hoveredPoint.value}` : `-₹${Math.abs(hoveredPoint.value)}`}
            </div>
          )}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between items-center text-[10px] text-[var(--color-text-secondary)] pt-1 border-t border-[var(--color-border-primary)]/40">
          {points.map((p, i) => (
            <span key={i} className="tabular-nums">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HealthCashFlowCard;
