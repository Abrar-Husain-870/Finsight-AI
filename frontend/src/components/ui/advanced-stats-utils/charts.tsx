"use client";

import React from "react";
import { curveMonotoneX } from "@visx/curve";
import {
  AreaChart,
  Area,
  Grid,
  SegmentBackground,
  SegmentLineFrom,
  SegmentLineTo,
  XAxis,
  ChartTooltip,
} from "../charts/index.js";
import { useCurrency } from "../../../lib/hooks/useCurrency.js";
import { TrendingUp } from "lucide-react";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  revenue: Math.floor(8000 + Math.sin(i / 5) * 4000 + ((i * 11) % 2000)),
  costs: Math.floor(5000 + Math.cos(i / 4) * 2000 + ((i * 7) % 1500)),
}));

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

      {/* Visx Area Chart */}
      <div className="w-full">
        <AreaChart aspectRatio="4 / 1" data={chartData}>
          <Grid horizontal />
          <Area curve={curveMonotoneX} dataKey="revenue" fill="var(--chart-line-primary)" fillOpacity={0.3} strokeWidth={2} />
          <Area curve={curveMonotoneX} dataKey="costs" fill="var(--chart-line-secondary)" fillOpacity={0.2} strokeWidth={1.5} />
          <SegmentBackground />
          <SegmentLineFrom />
          <SegmentLineTo />
          <XAxis />
          <ChartTooltip
            content={({ activeData }) => (
              <div className="flex flex-col gap-1.5 p-1 text-xs">
                <div className="font-bold text-[var(--color-text-primary)]">
                  {new Date(activeData.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="flex items-center justify-between gap-4 text-[var(--color-success)] font-medium">
                  <span>Revenue:</span>
                  <span className="font-semibold tabular-nums">+{formatMoney(activeData.revenue)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[var(--color-danger)] font-medium">
                  <span>Costs:</span>
                  <span className="font-semibold tabular-nums">-{formatMoney(activeData.costs)}</span>
                </div>
              </div>
            )}
          />
        </AreaChart>
      </div>
    </div>
  );
}

export default ClippedAreaChart;
