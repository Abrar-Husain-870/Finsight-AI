import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "./Button.js";
import { cn } from "../../lib/utils.js";

export interface Stats2Props {
  onPrimaryAction?: () => void;
  className?: string;
}

export function Stats2({ onPrimaryAction, className }: Stats2Props) {
  return (
    <section className={cn("py-16 sm:py-24 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] w-full border-t border-[var(--color-border-primary)]", className)}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 3 Core Capability Stat Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] flex h-64 flex-col justify-between rounded-2xl p-6 shadow-xs hover:border-[var(--color-border-hover)] transition-all">
            <div>
              <p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                Income & Expenses
              </p>
            </div>
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">One view</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Understand where your money comes from and where it goes.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] flex h-64 flex-col justify-between rounded-2xl p-6 shadow-xs hover:border-[var(--color-border-hover)] transition-all">
            <div>
              <p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                Financial Health
              </p>
            </div>
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">Clearer picture</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                See the patterns behind your everyday spending.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] flex h-64 flex-col justify-between rounded-2xl p-6 shadow-xs hover:border-[var(--color-border-hover)] transition-all">
            <div>
              <p className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                Goals & Progress
              </p>
            </div>
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">Stay on track</h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                Turn financial plans into measurable progress.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="flex flex-col justify-center items-center p-6 pt-16 sm:pt-20 text-center max-w-3xl mx-auto">
          <div>
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Built for clarity, made for control
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 text-base sm:text-lg max-w-2xl leading-relaxed">
              FinSight brings your spending, cash flow, financial health and goals into one calm, focused workspace.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <Button size="lg" className="h-12 px-8 text-base font-semibold" onClick={onPrimaryAction}>
              Get started with FinSight
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-[var(--color-text-secondary)] text-xs font-medium">
              Your finances. One clear view.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mt-2">
              <div className="flex text-amber-500 gap-0.5">
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
                <Star className="h-4 w-4 fill-amber-500" />
              </div>
              <span className="font-semibold text-[var(--color-text-primary)] text-sm">Your money. Your goals. Your decisions.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats2;
