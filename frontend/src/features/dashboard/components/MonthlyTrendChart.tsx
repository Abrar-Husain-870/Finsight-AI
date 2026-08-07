import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyTrend, fromMinor } from '@finsight/shared';
import { useTheme } from '../../../providers/ThemeProvider.js';
import { useCurrency } from '../../../lib/hooks/useCurrency.js';
import { motion } from 'framer-motion';

export function MonthlyTrendChart({ data }: { data: MonthlyTrend[] }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { formatMoney } = useCurrency();

  const chartData = React.useMemo(() => {
    return data.map(d => {
      const parts = d.month.split('-');
      const year = parts[0] || '2000';
      const month = parts[1] || '1';
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      return {
        name: monthName,
        Income: fromMinor(d.income),
        Expense: fromMinor(d.expense)
      };
    });
  }, [data]);
  
  const margin = React.useMemo(() => ({ top: 10, right: 10, left: 0, bottom: 0 }), []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[300px] w-full relative"
      role="figure"
      aria-label="Monthly Income and Expense Trend Chart"
    >
      <div className="sr-only">
        Area chart displaying income and expenses for the last {data.length} months.
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={margin}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
            tickFormatter={(val) => formatMoney(val * 100).replace(/\.\d{2}$/, '')} // Format major units without cents
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
              color: isDark ? '#f3f4f6' : '#111827'
            }}
            formatter={(value: string | number | readonly (string | number)[] | undefined) => [formatMoney(Number(value || 0) * 100), undefined]}
          />
          <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
          <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
