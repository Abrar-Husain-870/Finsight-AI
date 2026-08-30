"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils.js";
import { BarChart3, ShieldCheck, FileSpreadsheet, Sparkles, ArrowRight } from "lucide-react";

export interface FeatureSectionsProps {
  className?: string;
}

export function FeatureSections({ className }: FeatureSectionsProps) {
  const [activeFeature, setActiveFeature] = useState(0);

  const sideFeatures = [
    {
      icon: (
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0">
          <BarChart3 className="w-6 h-6" />
        </div>
      ),
      title: "Real-Time Analytics",
      description: "Get instant insights into your finances with live interactive dashboards and real-time cash flow tracking.",
      badge: "Analytics",
    },
    {
      icon: (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
      ),
      title: "Bank-Grade Security",
      description: "256-bit SSL encryption, multi-factor authentication, and compliance with global financial data privacy standards.",
      badge: "Security",
    },
    {
      icon: (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
      ),
      title: "Customizable Reports",
      description: "Export professional, audit-ready financial summaries and CSV reports for tax filing or personal review.",
      badge: "Reports",
    },
  ];

  const gridFeatures = [
    {
      image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png",
      title: "Smart Category Insights",
      description: "Automated AI classification breaks down your income and spending patterns with precision.",
    },
    {
      image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png",
      title: "Goal & Budget Tracking",
      description: "Set custom savings milestones and receive real-time alerts before overspending occurs.",
    },
    {
      image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png",
      title: "Audit-Ready Exporting",
      description: "Download detailed monthly ledgers and tax breakdown reports in one single click.",
    },
  ];

  return (
    <section className={cn("w-full py-16 sm:py-24 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-t border-[var(--color-border-primary)]", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-full text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Powerful Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Built for total financial clarity
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed pt-1">
            Everything you need to manage, track, and grow your finances, securely and efficiently.
          </p>
        </div>

        {/* Feature Showcase Grid Row (Demo.tsx layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12 bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border-primary)] rounded-3xl p-6 sm:p-10 shadow-xs">
          
          {/* Main Showcase Image Column */}
          <div className="lg:col-span-7 flex justify-center items-center overflow-hidden rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-tertiary)]/50 p-2">
            <img
              className="max-w-2xl w-full h-auto rounded-xl object-cover transition-transform duration-500 hover:scale-102"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/card-image-1.png"
              alt="FinSight Real-Time Analytics & Financial Overview Showcase"
            />
          </div>

          {/* Feature List Cards Column */}
          <div className="lg:col-span-5 space-y-4">
            {sideFeatures.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <div
                  key={feature.title}
                  onClick={() => setActiveFeature(index)}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                    isActive
                      ? "bg-[var(--color-bg-primary)] border-[var(--color-text-primary)]/30 shadow-md translate-x-1"
                      : "bg-[var(--color-bg-primary)]/60 border-[var(--color-border-primary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-primary)]"
                  )}
                >
                  {feature.icon}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                        {feature.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)]">
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed pt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Grid Feature Cards Row (Feature-sections.tsx layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4">
          {gridFeatures.map((card) => (
            <div
              key={card.title}
              className="group flex flex-col justify-between bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-2xl p-4 sm:p-5 shadow-xs hover:-translate-y-1 hover:border-[var(--color-border-hover)] hover:shadow-md transition-all duration-300"
            >
              <div className="overflow-hidden rounded-xl bg-[var(--color-bg-tertiary)] mb-4">
                <img
                  className="w-full h-48 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  src={card.image}
                  alt={card.title}
                />
              </div>
              <div className="space-y-2 p-1">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeatureSections;
