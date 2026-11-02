"use client";

import React, { useState } from "react";
import { Play, PlayCircle, Wallet, TrendingUp, Sparkles, Target, DollarSign, Receipt, PieChart, ShieldCheck, Cpu, Sliders } from "lucide-react";
import { Card, CardContent } from "./Card.js";
import { cn } from "../../lib/utils.js";

export interface FeaturedCrmDemoSectionProps {
  className?: string;
}

export function FeaturedCrmDemoSection({ className }: FeaturedCrmDemoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const features = [
    {
      icon: Wallet,
      title: "Financial Overview",
      subtitle: "See your income, expenses, savings and cash flow in one place."
    },
    {
      icon: TrendingUp,
      title: "Personalised Insights",
      subtitle: "Understand the patterns behind your spending, not just the numbers."
    },
    {
      icon: Sparkles,
      title: "AI Financial Coach",
      subtitle: "Get contextual guidance based on your own financial situation."
    },
    {
      icon: Target,
      title: "Goals & Planning",
      subtitle: "Turn financial goals into something you can track, evaluate and work towards."
    }
  ];

  const capabilities = [
    { icon: DollarSign, name: "Income Tracking", subtitle: "Know where your money comes from" },
    { icon: Receipt, name: "Expense Tracking", subtitle: "Understand where your money goes" },
    { icon: PieChart, name: "Analytics", subtitle: "See patterns in your finances" },
    { icon: ShieldCheck, name: "Financial Health", subtitle: "Understand your overall position" },
    { icon: Target, name: "Goals", subtitle: "Track progress towards what matters" },
    { icon: Sparkles, name: "AI Coach", subtitle: "Get guidance based on your finances" },
    { icon: Sliders, name: "Simulation", subtitle: "Explore possible financial outcomes" },
    { icon: Cpu, name: "Smart Planning", subtitle: "Make decisions with more context" },
  ];

  return (
    <section className={cn("w-full py-8 sm:py-12 lg:py-14 min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-t border-[var(--color-border-primary)]", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col justify-between">
        
        {/* Header */}
        <div className="text-left mb-5 sm:mb-6 max-w-3xl space-y-1.5">
          <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Product Showcase</span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
            Understand your money. <br className="hidden sm:inline" />Plan what comes next.
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            FinSight brings your income, spending, goals and financial health together to give you a clearer picture of where you stand and where you&apos;re heading.
          </p>
        </div>

        {/* Video & Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          
          {/* Main Video Demo Card */}
          <div className="lg:col-span-2 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] p-2 overflow-hidden relative flex flex-col h-[280px] sm:h-[340px] lg:h-[370px] shadow-sm">
            <div className="relative flex-grow group w-full h-full rounded-xl overflow-hidden isolate bg-black/40">
              {isPlaying ? (
                <video
                  src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/crm(1)(1)(1).mp4"
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover rounded-xl overflow-hidden"
                />
              ) : (
                <>
                  <img
                    src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/crm-featured.png"
                    alt="FinSight Demo Showcase Preview"
                    className="w-full h-full object-cover rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Play Button Overlay */}
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs group-hover:bg-black/40 transition-all cursor-pointer rounded-xl overflow-hidden"
                    aria-label="Play FinSight Interactive Demo Video"
                  >
                    <div className="p-3.5 rounded-full bg-[var(--color-bg-primary)]/90 text-[var(--color-text-primary)] shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                    </div>
                    <span className="mt-2.5 text-xs font-bold text-white tracking-wide bg-black/60 px-3.5 py-1 rounded-full border border-white/20">
                      Watch FinSight Interactive Demo
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 4 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col justify-center border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 rounded-xl p-3 hover:border-[var(--color-border-hover)] hover:shadow-xs transition-all gap-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)]">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
                    {feature.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8 FinSight Capabilities Grid */}
        <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.name}
                className="p-2.5 flex items-center gap-2.5 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/40 hover:bg-[var(--color-bg-secondary)] transition-colors"
              >
                <div className="p-1.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-[var(--color-text-primary)] truncate">{cap.name}</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] truncate">{cap.subtitle}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FeaturedCrmDemoSection;
