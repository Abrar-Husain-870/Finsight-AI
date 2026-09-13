"use client";

import React, { useState } from 'react';
import { CategoryBreakdown, fromMinor } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { motion } from 'framer-motion';
import {
  PieChart,
  PieSlice,
  PieCenter,
  Legend,
  LegendItemComponent,
  LegendMarker,
  LegendLabel,
} from '../../../components/ui/charts/index.js';

// Single blue shade + harmonious monochrome gray scale palette matching Analytics page theme rules
const distinctThemePalette = [
  'var(--chart-2)',     // Signature Blue
  'oklch(0.68 0 0)',    // Light Slate Gray
  'oklch(0.50 0 0)',    // Mid Gray
  'oklch(0.35 0 0)',    // Dark Gray
  'oklch(0.82 0 0)',    // Muted Silver
  'oklch(0.25 0 0)',    // Charcoal Gray
];

export function CategoryDonutChart({ data }: { data: CategoryBreakdown[] }) {
  const { formatMoney } = useCurrency();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pieData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { label: 'Housing', value: 25376, color: 'var(--chart-2)' },
        { label: 'Food & Dining', value: 14097, color: 'oklch(0.68 0 0)' },
        { label: 'Transport', value: 11278, color: 'oklch(0.50 0 0)' },
        { label: 'Others', value: 5639, color: 'oklch(0.35 0 0)' },
      ];
    }

    return data.map((d, idx) => {
      return {
        label: d.categoryName,
        value: Math.abs(fromMinor(d.amount)),
        color: distinctThemePalette[idx % distinctThemePalette.length],
      };
    });
  }, [data]);

  const legendItems = React.useMemo(() => {
    return pieData.map(item => ({
      label: item.label,
      color: item.color || 'var(--chart-2)',
    }));
  }, [pieData]);

  const totalExpense = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.value, 0);
  }, [pieData]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="flex flex-col items-center justify-between h-full space-y-4 py-2 w-full"
      role="figure"
      aria-label="Category Spending Breakdown Chart"
    >
      {/* Centered Donut Chart */}
      <div className="flex items-center justify-center w-full my-auto py-2">
        <PieChart
          data={pieData}
          hoveredIndex={hoveredIndex}
          innerRadius={65}
          onHoverChange={setHoveredIndex}
          size={210}
        >
          {pieData.map((_, i) => (
            <PieSlice index={i} key={i} />
          ))}
          <PieCenter
            children={({ value, label }) => {
              const isHovered = hoveredIndex !== null;
              const displayVal = isHovered ? value : totalExpense;
              const displayLabel = isHovered ? label : "Expenses";
              return (
                <div className="flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] tabular-nums tracking-tight">
                    {formatMoney(displayVal * 100)}
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5">
                    {displayLabel}
                  </span>
                </div>
              );
            }}
          />
        </PieChart>
      </div>

      {/* Horizontal Centered Legend */}
      <div className="w-full pt-1">
        <Legend
          hoveredIndex={hoveredIndex}
          items={legendItems}
          onHoverChange={setHoveredIndex}
        >
          <LegendItemComponent>
            <LegendMarker />
            <LegendLabel />
          </LegendItemComponent>
        </Legend>
      </div>

      {/* Bottom Summary Footer Line */}
      <div className="pt-3 border-t border-[var(--color-border-primary)] w-full text-center text-xs font-medium text-[var(--color-text-secondary)]">
        Trending down by <span className="text-[var(--chart-2)] font-semibold">4.8%</span> this month
      </div>
    </motion.div>
  );
}

export default CategoryDonutChart;
