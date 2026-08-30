import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "../../lib/utils.js";

export interface Compare2Props {
  className?: string;
}

export function Compare2({ className }: Compare2Props) {
  return (
    <section className={cn("py-12 sm:py-16 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] w-full border-t border-[var(--color-border-primary)]", className)}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Feature Comparison</span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mt-1">
            Why choose FinSight over traditional spreadsheets?
          </h2>
        </div>

        {/* Constrained Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl border border-[var(--color-border-primary)] overflow-hidden shadow-xs">
          
          {/* Column 1: Traditional Finance Tools */}
          <div className="p-6 sm:p-8 bg-[var(--color-bg-primary)] space-y-5 md:border-r border-[var(--color-border-primary)]">
            <div className="pb-3 border-b border-[var(--color-border-primary)]">
              <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Traditional Tools</span>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">Normal Finance Manager</h3>
            </div>

            <div className="space-y-3.5">
              {/* Point 1 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Manual Expense Entry</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Record transactions manually one at a time.</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Basic Category Limits</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Static monthly budgets without contextual spending alerts.</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Static Balance Summaries</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Simple monthly totals without deeper cash flow analysis.</p>
                </div>
              </div>

              {/* Point 4 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Generic Financial Advice</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">One-size-fits-all tips not tailored to your habits.</p>
                </div>
              </div>

              {/* Point 5 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Expense Tracking Only</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Tracks where money went, but leaves decisions up to you.</p>
                </div>
              </div>

              {/* Point 6 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">No Goal Projections</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Does not track long-term progress toward savings milestones.</p>
                </div>
              </div>

              {/* Point 7 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] shrink-0 mt-0.5">
                  <X className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">Assumption-Based Planning</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">No scenario simulations to test future financial choices.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: FinSight */}
          <div className="p-6 sm:p-8 bg-[var(--color-bg-secondary)]/80 space-y-5">
            <div className="pb-3 border-b border-[var(--color-border-primary)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[var(--color-success)] uppercase tracking-wider">Intelligent Workspace</span>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">FinSight</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)]">Recommended</span>
            </div>

            <div className="space-y-3.5">
              {/* Point 1 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Automated Cash Flow Overview</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Income, expenses, and net position in one clear view.</p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Intelligent Category Insights</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Surface spending trends and pattern alerts automatically.</p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">AI Financial Coach</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Context-aware guidance tailored specifically to your data.</p>
                </div>
              </div>

              {/* Point 4 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Dynamic Goal Tracking</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Turn financial plans into measurable, trackable progress.</p>
                </div>
              </div>

              {/* Point 5 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Financial Health Index</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Understand overall financial standing beyond monthly balances.</p>
                </div>
              </div>

              {/* Point 6 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Scenario Simulation & Planning</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Test spending and saving choices before making decisions.</p>
                </div>
              </div>

              {/* Point 7 */}
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">Bank-Grade Privacy & Encryption</h4>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5">Local data encryption and privacy-first architecture.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Compare2;
