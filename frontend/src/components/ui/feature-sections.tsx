"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils.js";
import { FlippableCreditCard } from "./credit-debit-card.tsx";
import {
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  Sparkles,
  Lock,
  TrendingUp,
  CreditCard,
  Layers,
  Activity,
  Download,
  FileText,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export interface FeatureSectionsProps {
  className?: string;
}

export function FeatureSections({ className }: FeatureSectionsProps) {
  // activeFeature: "cards" | "analytics" | "security" | "reports"
  const [activeFeature, setActiveFeature] = useState<"cards" | "analytics" | "security" | "reports">("cards");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(8); // Default to Sep (index 8)
  const [chartTimeframe, setChartTimeframe] = useState<"3M" | "6M" | "1Y" | "YTD">("1Y");

  const sideFeatures = [
    {
      id: "analytics" as const,
      icon: BarChart3,
      title: "Real-Time Analytics",
      description:
        "Get instant insights into your finances with live interactive dashboards and real-time cash flow tracking.",
      badge: "Analytics",
    },
    {
      id: "security" as const,
      icon: ShieldCheck,
      title: "Bank-Grade Security",
      description:
        "256-bit SSL encryption, multi-factor authentication, and compliance with global financial data privacy standards.",
      badge: "Security",
    },
    {
      id: "reports" as const,
      icon: FileSpreadsheet,
      title: "Customizable Reports",
      description:
        "Export professional, audit-ready financial summaries and CSV reports for tax filing or personal review.",
      badge: "Reports",
    },
  ];

  // Professional 12-Month High-Density Financial Data Points
  const monthlyData = [
    { month: "Jan", inflow: 78, outflow: 42, val: "₹78,000", outVal: "₹42,000" },
    { month: "Feb", inflow: 85, outflow: 45, val: "₹85,000", outVal: "₹45,000" },
    { month: "Mar", inflow: 92, outflow: 48, val: "₹92,000", outVal: "₹48,000" },
    { month: "Apr", inflow: 88, outflow: 40, val: "₹88,000", outVal: "₹40,000" },
    { month: "May", inflow: 96, outflow: 50, val: "₹96,000", outVal: "₹50,000" },
    { month: "Jun", inflow: 110, outflow: 52, val: "₹1,10,000", outVal: "₹52,000" },
    { month: "Jul", inflow: 104, outflow: 46, val: "₹1,04,000", outVal: "₹46,000" },
    { month: "Aug", inflow: 128, outflow: 55, val: "₹1,28,000", outVal: "₹55,000" },
    { month: "Sep", inflow: 148, outflow: 52, val: "₹1,48,250", outVal: "₹52,100" },
    { month: "Oct", inflow: 135, outflow: 48, val: "₹1,35,000", outVal: "₹48,000" },
    { month: "Nov", inflow: 142, outflow: 50, val: "₹1,42,000", outVal: "₹50,000" },
    { month: "Dec", inflow: 160, outflow: 58, val: "₹1,60,000", outVal: "₹58,000" },
  ];

  const currentHovered = monthlyData[selectedMonthIndex] ?? {
    month: "Sep",
    inflow: 148,
    outflow: 52,
    val: "₹1,48,250",
    outVal: "₹52,100",
  };

  return (
    <section
      className={cn(
        "w-full py-14 sm:py-20 bg-[#000000] text-white border-t border-white/10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-neutral-300 uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Built for total financial clarity
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed pt-1">
            Everything you need to manage, track, and grow your finances, securely and efficiently.
          </p>
        </div>

        {/* Feature Showcase Bento Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch gap-6 lg:gap-8 bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-9 shadow-2xl">
          
          {/* Main Visual Showcase Column */}
          <div className="lg:col-span-7 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#141414] p-5 sm:p-7 min-h-[440px] shadow-inner relative">
            {/* Background subtle radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {/* --- VIEW 0: DEFAULT CREDIT CARDS SHOWCASE --- */}
              {activeFeature === "cards" && (
                <motion.div
                  key="cards-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between h-full space-y-4"
                >
                  {/* Top Status Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                        FinSight Smart Card Multi-Vault
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-neutral-400" />
                      Hover to Flip 3D
                    </span>
                  </div>

                  {/* Stacked Cards Composition */}
                  <div className="relative z-10 my-auto pt-10 pb-6 sm:pt-12 sm:pb-8 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      
                      {/* Background Secondary Titanium Card */}
                      <div className="absolute -top-4 -left-6 sm:-top-5 sm:-left-8 rotate-[-9deg] scale-[0.96] opacity-60 hover:opacity-85 transition-all duration-300 pointer-events-none sm:pointer-events-auto">
                        <div className="w-68 h-42 sm:w-76 sm:h-46 rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-white/20 p-4 sm:p-5 flex flex-col justify-between shadow-2xl">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                              FinSight Reserve
                            </span>
                            <div className="flex flex-col items-end">
                              <span className="font-serif italic font-black text-sm text-neutral-300">
                                VISA
                              </span>
                              <span className="text-[7px] font-bold tracking-widest text-neutral-500 uppercase">
                                Platinum
                              </span>
                            </div>
                          </div>
                          <div className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.2em]">
                            4242 •••• •••• 8812
                          </div>
                          <div className="flex justify-between items-end text-[10px] text-neutral-400 border-t border-white/10 pt-1">
                            <span>Balance: ₹4,12,000</span>
                            <span className="font-mono">09/29</span>
                          </div>
                        </div>
                      </div>

                      {/* Foreground Interactive Flippable FinSight Visa Card */}
                      <div className="relative z-20 rotate-[2deg] hover:rotate-0 transition-transform duration-300">
                        <FlippableCreditCard
                          cardholderName="Sofia Gracenia"
                          cardNumber="4242 •••• •••• 2255"
                          expiryDate="08/28"
                          cvv="987"
                          balance="₹1,84,250.00"
                          bankName="FinSight Infinite"
                          cardType="visa"
                          cardVariant="black"
                          className="h-44 w-72 sm:h-48 sm:w-80 shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 pt-3.5 border-t border-white/10">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] text-neutral-400">Active Vaults</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">3 Connected</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] text-neutral-400">Monthly Limit</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">₹10,00,000</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[10px] text-neutral-400">Protection</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">Zero Liability</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- VIEW 1: REAL-TIME ANALYTICS (HIGH DENSITY PROFESSIONAL FINANCIAL CHART) --- */}
              {activeFeature === "analytics" && (
                <motion.div
                  key="analytics-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between h-full space-y-3.5"
                >
                  {/* Top Bar with Timeframe Filter & Back button */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                          Live Analytics Engine
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                          Cash Flow Stream
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
                        <Zap className="w-3 h-3" /> Live
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/10 text-[11px]">
                        {(["3M", "6M", "1Y", "YTD"] as const).map((tf) => (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => setChartTimeframe(tf)}
                            className={cn(
                              "px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer",
                              chartTimeframe === tf
                                ? "bg-white text-black font-semibold shadow-xs"
                                : "text-neutral-400 hover:text-white"
                            )}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveFeature("cards")}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cards</span>
                      </button>
                    </div>
                  </div>

                  {/* Cash Flow Main Metric Strip */}
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <div className="text-[11px] text-neutral-400">
                        {currentHovered.month} Inflow Rate
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        {currentHovered.val}
                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" /> +14.2%
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-neutral-400">Outflow & Burn</div>
                      <div className="text-sm sm:text-base font-semibold text-neutral-300 font-mono">
                        {currentHovered.outVal}
                      </div>
                    </div>
                  </div>

                  {/* High-Density 12-Month Financial Dual Bar Chart with Gridlines & Curve */}
                  <div className="relative bg-black/40 rounded-xl border border-white/10 p-3 pt-4 space-y-2 overflow-hidden">
                    {/* Background Subtle Grid Lines */}
                    <div className="absolute inset-x-3 top-4 bottom-7 flex flex-col justify-between pointer-events-none opacity-15">
                      <div className="border-b border-white border-dashed w-full" />
                      <div className="border-b border-white border-dashed w-full" />
                      <div className="border-b border-white border-dashed w-full" />
                    </div>

                    {/* Chart Bars (12 data columns with Inflow/Outflow pairs) */}
                    <div className="relative z-10 h-32 flex items-end justify-between gap-1.5 sm:gap-2">
                      {monthlyData.map((item, idx) => {
                        const isSelected = selectedMonthIndex === idx;
                        const heightPct = (item.inflow / 160) * 100;
                        const outflowHeightPct = (item.outflow / 160) * 100;

                        return (
                          <div
                            key={item.month}
                            onMouseEnter={() => setSelectedMonthIndex(idx)}
                            className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                          >
                            {/* Hover Tooltip Pill */}
                            {isSelected && (
                              <motion.div
                                layoutId="chart-tooltip"
                                className="absolute -top-1 bg-white text-black px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md shadow-black/80 pointer-events-none z-30"
                              >
                                {item.val}
                              </motion.div>
                            )}

                            {/* Dual Bar Cluster */}
                            <div className="w-full max-w-[22px] sm:max-w-[26px] flex items-end justify-center gap-0.5 h-full">
                              {/* Inflow Bar */}
                              <div
                                className={cn(
                                  "w-1/2 rounded-t-sm transition-all duration-200",
                                  isSelected
                                    ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                                    : "bg-neutral-400/80 group-hover:bg-neutral-200"
                                )}
                                style={{ height: `${heightPct}%` }}
                              />
                              {/* Outflow Bar */}
                              <div
                                className={cn(
                                  "w-1/2 rounded-t-sm transition-all duration-200",
                                  isSelected
                                    ? "bg-neutral-500"
                                    : "bg-neutral-800 group-hover:bg-neutral-700"
                                )}
                                style={{ height: `${outflowHeightPct}%` }}
                              />
                            </div>

                            {/* Month Label */}
                            <span
                              className={cn(
                                "text-[9px] sm:text-[10px] mt-1.5 font-medium transition-colors",
                                isSelected ? "text-white font-bold" : "text-neutral-500 group-hover:text-neutral-300"
                              )}
                            >
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart Legend */}
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-xs bg-white" />
                          Inflow Cash
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-xs bg-neutral-700" />
                          Operating Outflow
                        </span>
                      </div>
                      <span className="font-mono text-neutral-400">12M Stream • 99.9% Telemetry</span>
                    </div>
                  </div>

                  {/* Telemetry Row */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Net Margin</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">38.4%</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Monthly Burn</div>
                      <div className="text-xs sm:text-sm font-bold text-neutral-300 mt-0.5">₹42,500/mo</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Projected Runway</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">24+ Months</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- VIEW 2: BANK-GRADE SECURITY --- */}
              {activeFeature === "security" && (
                <motion.div
                  key="security-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between h-full space-y-3.5"
                >
                  {/* Top Bar with Return to Cards option */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Security Framework
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                        Bank-Grade Shield
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveFeature("cards")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                  </div>

                  {/* Security Modules Grid */}
                  <div className="grid grid-cols-2 gap-2.5 my-auto py-1">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                        <Lock className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                        256-Bit AES
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">
                        Data at rest & transit encrypted with military-grade keys.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                        Zero-Knowledge
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">
                        Your credentials & secrets never leave your local session.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                        <Layers className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                        Daily Backups
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">
                        Point-in-time state recovery with zero transaction loss.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                        <Activity className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                        Audit Verifiable
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed">
                        Tamper-evident logs of all account actions & logins.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Standard</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">SOC 2 Type II</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Privacy</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">GDPR Aligned</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Verification</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">100% Passed</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- VIEW 3: CUSTOMIZABLE REPORTS --- */}
              {activeFeature === "reports" && (
                <motion.div
                  key="reports-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between h-full space-y-3.5"
                >
                  {/* Top Bar with Return to Cards option */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Reporting Suite
                      </div>
                      <div className="text-base sm:text-lg font-bold text-white tracking-tight">
                        Audit-Ready Statements
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveFeature("cards")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                  </div>

                  {/* Document Preview Box */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 my-auto">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        FY2025_Q3_Tax_Summary.pdf
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">Generated 2m ago</span>
                    </div>

                    <div className="space-y-1 py-1 text-xs">
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-neutral-400">Gross Invoiced Revenue</span>
                        <span className="font-semibold text-white">₹4,28,500.00</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span className="text-neutral-400">Allowable Deductions</span>
                        <span className="font-semibold text-neutral-300">₹86,200.00</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-neutral-400">Estimated Tax Liability</span>
                        <span className="font-semibold text-white">₹34,230.00</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Tax Package (.ZIP)</span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Export Formats</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">PDF, CSV, XLSX</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Schedule</div>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">Monthly Auto</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                      <div className="text-[9px] text-neutral-400">Audit Status</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">Verified</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Feature List Selection Cards Column */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5">
            {sideFeatures.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;
              return (
                <div
                  key={feature.id}
                  onClick={() => {
                    // Clicking active tab toggles back to "cards", clicking inactive switches to that feature
                    setActiveFeature(isActive ? "cards" : feature.id);
                  }}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none",
                    isActive
                      ? "bg-[#181818] border-white/40 shadow-lg shadow-black/80 translate-x-1"
                      : "bg-[#121212]/80 border-white/[0.08] hover:border-white/20 hover:bg-[#161616]"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl border shrink-0 transition-colors",
                      isActive
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-neutral-400 border-white/10"
                    )}
                  >
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={cn("text-sm sm:text-base font-bold transition-colors", isActive ? "text-white" : "text-neutral-200")}>
                        {feature.title}
                      </h3>
                      <span className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border transition-colors",
                        isActive
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-neutral-400 border-white/10"
                      )}>
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed pt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSections;
