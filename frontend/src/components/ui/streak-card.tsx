"use client";

import * as React from "react";
import {
  CheckCircle2,
  ChevronDown,
  Flame,
  RefreshCcw,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { Button } from "./Button.js";
import {
  StreakCalendar,
  type StreakPeriod,
} from "./streak-calendar.js";

export interface StreakCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Streak periods passed through to StreakCalendar */
  streak?: StreakPeriod[];
  /** Current streak value in days */
  currentStreak?: number;
  /** Longest streak value in days */
  longestStreak?: number;
  /** Secondary total metric value */
  total?: number;
  /** Optional heading text */
  title?: string;
  /** Label for the action button */
  actionLabel?: string;
  /** Callback for action click */
  onActionClick?: () => void;
  /** Show "How streaks work" dropdown section */
  showHowItWorks?: boolean;
  /** Title for the dropdown trigger */
  howItWorksTitle?: string;
  /** Content rows shown when the dropdown is expanded */
  howItWorksItems?: string[];
  /** Initial expanded state for dropdown */
  defaultHowItWorksOpen?: boolean;
}

const defaultStreak: StreakPeriod[] = [
  { periodStart: "2026-05-24", periodEnd: "2026-05-24" },
  { periodStart: "2026-05-25", periodEnd: "2026-05-25" },
  { periodStart: "2026-05-26", periodEnd: "2026-05-26" },
  { periodStart: "2026-05-27", periodEnd: "2026-05-27" },
  { periodStart: "2026-05-28", periodEnd: "2026-05-28" },
];

const defaultItems = [
  "Log your daily transactions or review insights to build your financial streak.",
  "Each active day increases your streak and unlocks personalized AI insights.",
  "Consistency helps FinSight deliver more accurate cash flow projections.",
];

const StreakCard = React.forwardRef<HTMLDivElement, StreakCardProps>(
  (
    {
      className,
      streak = defaultStreak,
      currentStreak = 16,
      longestStreak = 100,
      total = 131,
      title = "Financial Tracking Streak",
      actionLabel = "View Details",
      onActionClick,
      showHowItWorks = true,
      howItWorksTitle = "How do financial streaks work?",
      howItWorksItems = defaultItems,
      defaultHowItWorksOpen = false,
      ...props
    },
    ref
  ) => {
    const [isHowItWorksOpen, setIsHowItWorksOpen] = React.useState(
      defaultHowItWorksOpen
    );
    const howItWorksContentId = React.useId();

    return (
      <section
        ref={ref}
        aria-label="Streak summary card"
        className={cn(
          "bg-[var(--color-bg-secondary)] rounded-3xl border border-[var(--color-border-primary)] p-6 sm:p-8 shadow-xs text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-hover)]",
          className
        )}
        {...props}
      >
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="text-amber-500 h-6 w-6 fill-amber-400 dark:fill-amber-300" aria-hidden="true" />
            <h3 className="text-xl sm:text-2xl leading-none font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onActionClick}
            aria-label={actionLabel}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-semibold transition-colors"
          >
            {actionLabel}
          </Button>
        </header>

        <p className="mb-4 text-4xl sm:text-5xl leading-none font-extrabold tracking-tight tabular-nums text-[var(--color-text-primary)]">
          {currentStreak}
          <span className="text-[var(--color-text-secondary)] ml-2 text-xl sm:text-2xl font-semibold">
            days active
          </span>
        </p>

        <StreakCalendar
          streak={streak}
          view="week"
          startOfWeek={1}
          className="max-w-none"
        />

        <div
          className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--color-border-primary)] border-dashed pt-4"
          aria-label="Streak stats"
        >
          <div>
            <p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">Longest Streak</p>
            <p className="text-2xl sm:text-3xl leading-tight font-bold tabular-nums text-[var(--color-text-primary)]">
              {longestStreak}
              <span className="ml-1 text-base font-semibold text-[var(--color-text-secondary)]">days</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">Total Logged</p>
            <p className="text-2xl sm:text-3xl leading-tight font-bold tabular-nums text-[var(--color-text-primary)]">{total}</p>
          </div>
        </div>

        {showHowItWorks && (
          <div className="mt-4 border-t border-[var(--color-border-primary)] pt-4">
            <button
              type="button"
              className="bg-[var(--color-bg-primary)] flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left border border-[var(--color-border-primary)] cursor-pointer"
              onClick={() => setIsHowItWorksOpen((prev) => !prev)}
              aria-expanded={isHowItWorksOpen}
              aria-controls={howItWorksContentId}
            >
              <span className="text-sm font-bold text-[var(--color-text-primary)]">{howItWorksTitle}</span>
              <ChevronDown
                className={cn(
                  "text-[var(--color-text-secondary)] h-4 w-4 transition-transform duration-200",
                  isHowItWorksOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            {isHowItWorksOpen && (
              <div id={howItWorksContentId} className="space-y-3 px-2 pt-4">
                {howItWorksItems.map((item, index) => {
                  const Icon =
                    index === 0
                      ? CheckCircle2
                      : index === 1
                        ? Flame
                        : RefreshCcw;
                  return (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-start gap-2.5"
                    >
                      <Icon
                        className="text-amber-500 mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm leading-relaxed">
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    );
  }
);
StreakCard.displayName = "StreakCard";

export { StreakCard };
export default StreakCard;
