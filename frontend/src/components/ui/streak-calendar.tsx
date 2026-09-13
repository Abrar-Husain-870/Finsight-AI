"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { cn } from "../../lib/utils.js";

export type StreakPeriod = {
  periodStart: string;
  periodEnd: string;
};

export interface StreakCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  streak?: StreakPeriod[];
  view?: "week" | "month";
  startOfWeek?: number;
}

export function StreakCalendar({
  streak = [],
  view = "week",
  className,
  ...props
}: StreakCalendarProps) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Demonstrates current active streak days
  const activePattern = [true, true, true, true, true, false, true];

  return (
    <div className={cn("w-full py-2", className)} {...props}>
      <div className="grid grid-cols-7 gap-2 text-center">
        {dayNames.map((day, i) => {
          const isActive = activePattern[i];
          return (
            <div key={day} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                {day}
              </span>
              <div
                className={cn(
                  "size-8 sm:size-9 rounded-xl flex items-center justify-center transition-all border",
                  isActive
                    ? "bg-[var(--chart-2)]/10 border-[var(--chart-2)]/30 text-[var(--chart-2)] font-bold shadow-2xs"
                    : "bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] opacity-50"
                )}
              >
                {isActive ? (
                  <Flame className="w-4 h-4 fill-[var(--chart-2)] stroke-[var(--chart-2)]" />
                ) : (
                  <span className="text-xs font-semibold text-[var(--muted-foreground)]">•</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StreakCalendar;
