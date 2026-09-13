"use client";

import React from "react";
import { Check, X, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils.js";

export interface Compare2Props {
  className?: string;
}

export function Compare2({ className }: Compare2Props) {
  return (
    <section
      className={cn(
        "py-14 sm:py-20 bg-[#000000] text-white w-full border-t border-white/10",
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-neutral-300 uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Why Us
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Why choose FinSight over traditional spreadsheets?
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed pt-1">
            Ditch manual data entry, disconnected bank statements, and blind assumptions for an intelligent, automated financial control center.
          </p>
        </div>

        {/* 2-Column Comparison Bento Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Column 1: Traditional Finance Tools (Muted Dark Palette) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0D0D0D] p-6 sm:p-8 md:p-9 shadow-xl relative overflow-hidden">
            <div className="space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Legacy Spreadsheets & Apps
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-300 mt-0.5">
                    Standard Money Trackers
                  </h3>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                  Manual & Static
                </span>
              </div>

              {/* List of Limitations */}
              <div className="space-y-4">
                {[
                  {
                    title: "Manual Transaction Entry",
                    desc: "Requires tedious copy-pasting of receipts, bank PDFs, and expense logs one by one.",
                  },
                  {
                    title: "Rigid & Static Category Limits",
                    desc: "Fixed monthly budget caps without real-time contextual notifications or pace alerts.",
                  },
                  {
                    title: "Historical-Only Balance Summaries",
                    desc: "Shows where money went last month, but fails to project future cash flow or runway.",
                  },
                  {
                    title: "Generic One-Size-Fits-All Advice",
                    desc: "Vague financial tips disconnected from your actual earnings, debt, or tax brackets.",
                  },
                  {
                    title: "Siloed Accounts & Multiple Logins",
                    desc: "Fragmented views across different credit cards, bank portals, and investment brokers.",
                  },
                  {
                    title: "No Automated Goal Projections",
                    desc: "Does not calculate dynamic target completion dates or adjust for unexpected windfalls.",
                  },
                  {
                    title: "Zero Simulation Capabilities",
                    desc: "Cannot simulate major life purchases, career transitions, or loan payoff scenarios.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="p-1 rounded-md bg-white/5 border border-white/10 text-neutral-500 shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-300">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: FinSight (Elevated Dark Titanium with Emerald Green Accents) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/20 bg-[#121212] p-6 sm:p-8 md:p-9 shadow-2xl relative overflow-hidden">
            {/* Subtle radial emerald background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Intelligent Financial Workspace
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                    FinSight Intelligence
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-black shadow-sm">
                  Recommended
                </span>
              </div>

              {/* List of FinSight Capabilities */}
              <div className="space-y-4">
                {[
                  {
                    title: "Automated Real-Time Telemetry",
                    desc: "Live cash flow sync, instant balance aggregation, and sub-second transaction ingestion.",
                  },
                  {
                    title: "Predictive Category Intelligence",
                    desc: "AI auto-categorization breaks down spending patterns with 99.4% precision and pace alerts.",
                  },
                  {
                    title: "Context-Aware AI Financial Coach",
                    desc: "Deep reasoning engine that analyzes your specific cash flow velocity and tax opportunities.",
                  },
                  {
                    title: "Dynamic Milestone & Goal Engine",
                    desc: "Real-time trajectory forecasting with automated target completion countdowns and pacing.",
                  },
                  {
                    title: "Unified Multi-Vault & Card Architecture",
                    desc: "Single pane of glass across business ledgers, personal vaults, credit limits, and investments.",
                  },
                  {
                    title: "Monte Carlo Scenario Simulation",
                    desc: "Stress-test career changes, big investments, and inflation impacts before committing capital.",
                  },
                  {
                    title: "Bank-Grade Privacy & 256-Bit Encryption",
                    desc: "Zero-knowledge architecture. Your financial credentials and secrets never leave local memory.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="p-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5 shadow-xs">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Telemetry Footer in FinSight Column */}
            <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SOC 2 Type II & GDPR Aligned
              </span>
              <span className="text-emerald-400 font-semibold font-mono text-[11px]">
                Active AI Stream
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Compare2;
