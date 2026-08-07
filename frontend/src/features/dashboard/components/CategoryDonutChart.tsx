import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategoryBreakdown, fromMinor } from '@finsight/shared';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { motion } from 'framer-motion';
import { useTheme } from '../../../providers/ThemeProvider.js';

// Tailwind color maps for pie chart
const colorMap: Record<string, string> = {
  'red-500': '#ef4444',
  'blue-500': '#3b82f6',
  'green-500': '#22c55e',
  'emerald-500': '#10b981',
  'orange-500': '#f97316',
  'purple-500': '#a855f7',
  'indigo-500': '#6366f1',
  'amber-500': '#f59e0b',
  'cyan-500': '#06b6d4',
  'pink-500': '#ec4899',
  'gray-500': '#6b7280'
};

export function CategoryDonutChart({ data }: { data: CategoryBreakdown[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { formatMoney } = useCurrency();

  const chartData = React.useMemo(() => {
    return data.map(d => ({
      name: d.categoryName,
      value: Math.abs(fromMinor(d.amount)),
      color: colorMap[d.categoryColor] || colorMap['gray-500'],
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
      className="flex flex-col h-full gap-6"
      role="figure"
      aria-label="Category Spending Breakdown Chart"
    >
      <div className="sr-only">
        Donut chart displaying spending by category. The top spending category is {data[0]?.categoryName} with {formatMoney(fromMinor(data[0]?.amount || 0))}.
      </div>
      <div className="h-[200px] w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: string | number | readonly (string | number)[] | undefined) => [formatMoney(Number(value || 0)), undefined]}
              contentStyle={{ 
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                borderRadius: '8px',
                color: isDark ? '#f3f4f6' : '#111827'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-3">
        {chartData.map((entry, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[var(--color-text-primary)]">{entry.name}</span>
            </div>
            <span className="font-medium text-[var(--color-text-primary)]">{formatMoney(entry.value)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
