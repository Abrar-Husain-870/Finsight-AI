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
  description?: string;
  badge?: string;
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
    description: "Composite solvency, debt & runway index",
    badge: "Optimal",
    fill: "var(--primary)", // White in dark / Black in light
    href: "/health",
    icon: <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />,
  },
  {
    name: "Goals Milestone",
    capacity: 75,
    currentText: "9 of 12 goals reached",
    description: "75% of target objectives actively on track",
    badge: "On Track",
    fill: "var(--chart-2)", // Blue
    href: "/goals",
    icon: <Target className="w-4 h-4 text-[var(--chart-2)]" />,
  },
  {
    name: "Budget Allocation",
    capacity: 62,
    currentText: "₹56.3k of ₹90k cap used",
    description: "₹33.7k discretionary buffer remaining",
    badge: "Safe Zone",
    fill: "var(--muted-foreground)", // Grey
    href: "/analytics",
    icon: <PieChart className="w-4 h-4 text-[var(--muted-foreground)]" />,
  },
  {
    name: "Emergency Reserve",
    capacity: 90,
    currentText: "5.4 of 6 months covered",
    description: "Liquid cushion for unexpected obligations",
    badge: "Resilient",
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
    <div className={cn("w-full py-1", className)}>
      <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex flex-col justify-between rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-xs transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-md p-4 overflow-hidden"
          >
            {/* Top Metric Header with Radial Ring & Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <dt className="text-xs font-bold text-[var(--color-text-primary)] leading-tight tracking-tight flex items-center gap-1.5 min-w-0">
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.name}</span>
                </dt>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="h-[52px] w-[52px]">
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
                    <span className="text-[11px] font-bold text-[var(--color-text-primary)] tabular-nums">
                      {item.capacity}%
                    </span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <dd className="text-xs font-semibold text-[var(--color-text-primary)] leading-tight break-words">
                    {item.currentText}
                  </dd>
                  {item.description && (
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-tight mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Footer Action Link */}
            <div className="mt-3 pt-2.5 border-t border-[var(--color-border-primary)] flex items-center justify-between">
              <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">Goal: 80%+</span>
              <Link
                to={item.href}
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-primary)] hover:text-emerald-500 transition-colors"
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
