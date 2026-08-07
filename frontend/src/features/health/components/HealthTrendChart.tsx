
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '../../../providers/ThemeProvider.js';

interface Props {
  data: { date: string; score: number }[];
}

export function HealthTrendChart({ data }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const margin = React.useMemo(() => ({ top: 10, right: 10, left: -20, bottom: 0 }), []);

  return (
    <div 
      className="h-64 w-full relative" 
      role="figure" 
      aria-label="Health Score Trend Chart"
    >
      <div className="sr-only">
        Line chart displaying health score over time. The most recent score is {data[data.length - 1]?.score || 0}.
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              borderColor: isDark ? '#374151' : '#e5e7eb',
              borderRadius: '8px',
              color: isDark ? '#f3f4f6' : '#111827'
            }}
          />
          <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
