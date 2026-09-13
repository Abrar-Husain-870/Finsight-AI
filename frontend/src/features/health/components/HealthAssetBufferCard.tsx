import React, { useState } from 'react';
import {
  PieChart,
  PieSlice,
  PieCenter,
} from '../../../components/ui/charts/index.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../../../lib/utils.js';

export function HealthAssetBufferCard() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { formatMoney } = useCurrency();

  // Buffer allocation with ONLY 1 Green and shades of Black/Grey
  const pieData = [
    { name: 'Liquid Reserve', percentage: 48, label: 'Liquid Reserve (48%)', value: 302400, color: '#10B981' }, // Only 1 Green (Emerald)
    { name: 'Wealth Vaults', percentage: 38, label: 'Wealth Vaults (38%)', value: 245000, color: '#64748B' }, // Slate Grey
    { name: 'Operating Cash', percentage: 14, label: 'Operating Cash (14%)', value: 85000, color: '#1E293B' }, // Deep Charcoal / Black-Grey
  ];

  const totalBuffer = 632400;

  return (
    <div className="h-full flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0d0f17]/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Buffer Distribution
          </h3>
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)] bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.08] px-2.5 py-0.5 rounded-full">
            This Month
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
          Emergency reserves vs growth allocation
        </p>

        {/* Analytics Visx Pie Chart with interactive slices and center text */}
        <div className="w-full flex flex-col items-center justify-center gap-2 pt-2">
          <PieChart
            data={pieData}
            hoveredIndex={hoveredIndex}
            innerRadius={52}
            onHoverChange={setHoveredIndex}
            size={160}
          >
            {pieData.map((_, i) => (
              <PieSlice index={i} key={i} />
            ))}
            <PieCenter defaultLabel="Total Buffer">
              {({ value, label }) => (
                <div className="flex flex-col items-center justify-center text-center px-1">
                  <span className="text-[10px] font-semibold text-[var(--color-text-secondary)] tracking-wide">
                    {label}
                  </span>
                  <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums mt-0.5">
                    {value ? formatMoney(value) : formatMoney(totalBuffer)}
                  </span>
                </div>
              )}
            </PieCenter>
          </PieChart>

          {/* Perfectly Aligned Structured Legend Rows */}
          <div className="w-full flex flex-col gap-1 pt-1">
            {pieData.map((item, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all cursor-pointer select-none border border-transparent",
                    isHovered
                      ? "bg-slate-100/90 dark:bg-white/[0.08] border-slate-200/60 dark:border-white/[0.12] shadow-2xs"
                      : "hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                  )}
                >
                  {/* Left: Color Marker + Category Name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs transition-transform duration-150",
                        isHovered && "scale-125"
                      )}
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                      {item.name}
                    </span>
                  </div>

                  {/* Right: Percentage & Formatted Amount in same alignment */}
                  <div className="flex items-center gap-2.5 shrink-0 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                      {item.percentage}%
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)] tabular-nums">
                      {formatMoney(item.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Allocation Metric */}
      <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)]/60 flex items-center justify-between text-xs">
        <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Runway Reserve
        </span>
        <span className="font-semibold text-emerald-500 tabular-nums">
          5.8 Months <span className="text-[var(--color-text-secondary)] font-normal">(100% Target Met)</span>
        </span>
      </div>
    </div>
  );
}

export default HealthAssetBufferCard;
