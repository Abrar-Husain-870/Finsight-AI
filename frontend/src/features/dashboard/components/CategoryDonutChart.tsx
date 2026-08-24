import React from 'react';
import { CategoryBreakdown, fromMinor } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { motion } from 'framer-motion';
import { PieChart, PieSlice, PieCenter } from '../../../components/ui/charts/index.js';

// Theme-aligned chart color palette fallbacks
const fallbackPalette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const colorMap: Record<string, string> = {
  'blue-500': 'var(--chart-1)',
  'green-500': 'var(--chart-2)',
  'emerald-500': 'var(--chart-2)',
  'amber-500': 'var(--chart-3)',
  'orange-500': 'var(--chart-5)',
  'purple-500': 'var(--chart-4)',
  'indigo-500': 'var(--chart-4)',
  'red-500': 'var(--color-danger)',
  'cyan-500': 'var(--chart-1)',
  'pink-500': 'var(--chart-4)',
  'gray-500': 'var(--color-text-muted)'
};

export function CategoryDonutChart({ data }: { data: CategoryBreakdown[] }) {
  const { formatMoney } = useCurrency();

  const chartData = React.useMemo(() => {
    return data.map((d, idx) => ({
      label: d.categoryName,
      value: Math.abs(fromMinor(d.amount)),
      color: d.categoryColor?.startsWith('#') 
        ? d.categoryColor 
        : (colorMap[d.categoryColor] || fallbackPalette[idx % fallbackPalette.length]),
      icon: d.categoryIcon,
      rawColor: d.categoryColor
    }));
  }, [data]);

  if (chartData.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-[var(--color-text-secondary)]">No expense data this month</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="flex flex-col h-full gap-8"
      role="figure"
      aria-label="Category Spending Breakdown Chart"
    >
      <div className="sr-only">
        Donut chart displaying spending by category. The top spending category is {data[0]?.categoryName} with {formatMoney(fromMinor(data[0]?.amount || 0))}.
      </div>
      <div className="h-[200px] w-full" aria-hidden="true">
        <PieChart 
          data={chartData} 
          innerRadius={75} 
          padAngle={0.05} 
          cornerRadius={4}
        >
          {chartData.map((_, index) => (
            <PieSlice key={index} index={index} />
          ))}
          <PieCenter 
            formatOptions={{ style: 'currency', currency: 'USD' }} 
            children={({ value, label }) => (
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-medium text-[var(--color-text-secondary)] whitespace-normal">
                  {label}
                </span>
                <span className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight whitespace-normal mt-0.5">
                  {formatMoney(value * 100)}
                </span>
              </div>
            )}
          />
        </PieChart>
      </div>
      <div className="flex flex-col gap-4">
        {chartData.map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-[var(--color-bg-secondary)]/50 p-2 -mx-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full shadow-sm transition-transform group-hover:scale-125" style={{ backgroundColor: entry.color }} />
              <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{entry.label}</span>
            </div>
            <span className="font-medium text-[var(--color-text-primary)] tracking-tight">{formatMoney(entry.value * 100)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
