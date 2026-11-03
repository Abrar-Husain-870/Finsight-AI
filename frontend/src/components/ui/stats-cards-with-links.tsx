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
import { useCurrency } from "../../lib/hooks/useCurrency.js";

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

function getDefaultItems(symbol: string): StatItem[] {
  return [
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
      currentText: `${symbol}56.3k of ${symbol}90k cap used`,
      description: `${symbol}33.7k discretionary buffer remaining`,
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
}

export function StatsCardsWithLinks({
  items,
  className,
}: StatsCardsWithLinksProps) {
  const { symbol } = useCurrency();
  const effectiveItems = items ?? getDefaultItems(symbol);

  return (
    <div className={cn("w-full py-1", className)}>
      <dl className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {effectiveItems.map((item) => (
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
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)]">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Center Content: Capacity Ring & Numerical Text */}
              <div className="flex items-center gap-3 mt-1">
                <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      barSize={4}
                      data={[{ name: item.name, value: item.capacity, fill: item.fill }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background={{ fill: "var(--color-bg-secondary)" }}
                        dataKey="value"
                        cornerRadius={30}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <span className="absolute text-[11px] font-black text-[var(--color-text-primary)] tabular-nums">
                    {item.capacity}%
                  </span>
                </div>

                <div className="flex flex-col min-w-0">
                  <dd className="text-sm font-black text-[var(--color-text-primary)] tracking-tight leading-snug truncate">
                    {item.currentText}
                  </dd>
                  {item.description && (
                    <p className="text-[11px] font-medium text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
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
