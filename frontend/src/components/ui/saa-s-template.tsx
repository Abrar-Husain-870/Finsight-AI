import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { FinSightDashboardShowcase } from "./FinSightDashboardShowcase.js";

interface SaasTemplateProps {
  badgeText?: string;
  badgeLinkText?: string;
  badgeLinkTo?: string;
  onBadgeLinkClick?: () => void;
  title?: React.ReactNode;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  className?: string;
}

export function SaasTemplateSection({
  badgeText = "FinSight v2.0 is live!",
  badgeLinkText = "Explore features",
  onBadgeLinkClick,
  title = (
    <>
      Give your financial future <br className="hidden sm:inline" />
      the clarity it deserves
    </>
  ),
  description = "Track spending, analyze monthly cash flow, and achieve your financial goals with bank-grade privacy and automated insights.",
  primaryActionLabel = "Get started free",
  onPrimaryAction,
  className,
}: SaasTemplateProps) {
  return (
    <section
      className={cn(
        "relative w-full flex flex-col items-center justify-start px-4 sm:px-6 py-12 md:py-20 text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] overflow-hidden",
        className
      )}
    >
      {/* Badge Pill */}
      <aside className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] backdrop-blur-sm max-w-full shadow-xs">
        <span className="text-xs text-[var(--color-text-secondary)] font-medium text-center">
          {badgeText}
        </span>
        <button
          type="button"
          onClick={onBadgeLinkClick}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text-primary)] hover:underline transition-all cursor-pointer"
        >
          {badgeLinkText}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </aside>

      {/* Main Headline */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center max-w-4xl px-4 leading-[1.1] mb-6 tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h2>

      {/* Subheadline */}
      <p className="text-base sm:text-lg text-center max-w-2xl px-4 mb-8 text-[var(--color-text-secondary)] leading-relaxed font-normal">
        {description}
      </p>

      {/* Primary CTA Action */}
      <div className="flex items-center gap-4 relative z-10 mb-12">
        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-[var(--color-bg-primary)] bg-[var(--color-text-primary)] hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {primaryActionLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Interactive FinSight Dashboard Showcase Preview */}
      <div className="w-full max-w-5xl relative pb-12">
        <div
          className="absolute left-1/2 w-[90%] pointer-events-none z-0 opacity-40 dark:opacity-20"
          style={{
            top: "-15%",
            transform: "translateX(-50%)"
          }}
          aria-hidden="true"
        >
          <img
            src="https://i.postimg.cc/Ss6yShGy/glows.png"
            alt=""
            className="w-full h-auto"
            loading="eager"
          />
        </div>
        
        <div className="relative z-10 p-1 sm:p-2">
          <FinSightDashboardShowcase />
        </div>
      </div>
    </section>
  );
}
