"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useCurrency } from "../../../lib/hooks/useCurrency.js";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Jan", income: 45000, expenses: 32000, netWorth: 185000 },
  { month: "Feb", income: 52000, expenses: 34000, netWorth: 203000 },
  { month: "Mar", income: 49000, expenses: 31000, netWorth: 221000 },
  { month: "Apr", income: 58000, expenses: 36000, netWorth: 243000 },
  { month: "May", income: 63000, expenses: 38000, netWorth: 268000 },
  { month: "Jun", income: 68328, expenses: 42000, netWorth: 294328 },
];

export function ClippedAreaChart() {
  const { formatMoney } = useCurrency();

  return (
    <div className="flex flex-col justify-between h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
            Performance Overview
          </span>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mt-1">
            Cash Flow & Net Worth Growth
          </h3>
        </div>

        <div className="flex items-center gap-3 bg-[var(--color-bg-primary)] px-3.5 py-1.5 rounded-full border border-[var(--color-border-primary)] shadow-2xs">
          <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">
            +18.4% this quarter
          </span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[240px] sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-primary)" opacity={0.5} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 12, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--color-text-secondary)", fontSize: 11 }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length >= 2) {
                  const incomeVal = payload[0]?.value;
                  const expenseVal = payload[1]?.value;
                  return (
                    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] p-3 rounded-xl shadow-xl text-xs space-y-1.5">
                      <p className="font-bold text-[var(--color-text-primary)] mb-1">{label}</p>
                      <div className="flex items-center justify-between gap-4 text-[var(--color-success)]">
                        <span>Income:</span>
                        <span className="font-semibold tabular-nums">+{formatMoney(Number(incomeVal ?? 0))}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-[var(--color-danger)]">
                        <span>Expenses:</span>
                        <span className="font-semibold tabular-nums">-{formatMoney(Number(expenseVal ?? 0))}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#incomeGradient)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#expensesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ClippedAreaChart;
