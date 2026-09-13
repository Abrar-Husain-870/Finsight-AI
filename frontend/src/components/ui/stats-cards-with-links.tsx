"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { ArrowRight, ExternalLink, ShieldCheck, Target, PieChart, ShieldAlert } from "lucide-react";
import { cn } from "../../lib/utils.js";

export interface StatItem {
  name: string;
  capacity: number; // Percentage score (0-100)
  currentText: string;
  fill: string;
  href: string;
  icon?: React.ReactNode;
}

export interface StatsCardsWithLinksProps {
  items?: StatItem[];
  className?: string;
}

const defaultItems: StatItem[] = [
  {
    name: "Financial Score",
    capacity: 84,
    currentText: "84 of 100 health score",
    fill: "var(--primary)", // White in dark / Black in light
    href: "/health",
    icon: <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />,
  },
  {
    name: "Goals Milestone",
    capacity: 75,
    currentText: "9 of 12 goals reached",
    fill: "var(--chart-2)", // Blue
    href: "/goals",
    icon: <Target className="w-4 h-4 text-[var(--chart-2)]" />,
  },
  {
    name: "Budget Allocation",
    capacity: 62,
    currentText: "₹56.3k of ₹90k cap used",
    fill: "var(--muted-foreground)", // Grey
    href: "/analytics",
    icon: <PieChart className="w-4 h-4 text-[var(--muted-foreground)]" />,
  },
  {
    name: "Emergency Reserve",
    capacity: 90,
    currentText: "5.4 of 6 months covered",
    fill: "var(--chart-2)", // Blue
    href: "/simulation",
    icon: <ShieldAlert className="w-4 h-4 text-[var(--chart-2)]" />,
  },
];

export function StatsCardsWithLinks({
  items = defaultItems,
  className,
}: StatsCardsWithLinksProps) {
  return (
    <div className={cn("w-full py-2", className)}>
      <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col justify-between rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-xs transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-md p-3.5 sm:p-4 overflow-hidden"
          >
            {/* Top Metric Header with Radial Ring */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="relative flex items-center justify-center shrink-0">
                <div className="h-[52px] w-[52px] sm:h-[58px] sm:w-[58px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      data={[item]}
                      innerRadius={18}
                      outerRadius={24}
                      barSize={5}
                      startAngle={90}
                      endAngle={450}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                        axisLine={false}
                      />
                      <RadialBar
                        dataKey="capacity"
                        background={{ fill: "var(--color-border-primary)", opacity: 0.3 }}
                        cornerRadius={10}
                        fill={item.fill}
                        angleAxisId={0}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-text-primary)] tabular-nums">
                    {item.capacity}%
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <dt className="text-xs sm:text-xs font-bold text-[var(--color-text-primary)] leading-tight tracking-tight flex items-start gap-1 min-w-0">
                  {item.icon && <span className="shrink-0 mt-0.5">{item.icon}</span>}
                  <span className="break-words text-balance min-w-0 flex-1">{item.name}</span>
                </dt>
                <dd className="text-[11px] font-medium text-[var(--color-text-secondary)] leading-tight break-words text-balance">
                  {item.currentText}
                </dd>
              </div>
            </div>

            {/* Bottom Footer Action Link */}
            <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)] flex justify-end">
              <Link
                to={item.href}
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                View details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default StatsCardsWithLinks;
