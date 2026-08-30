"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type TabMedia = {
  value: string; // unique value for Tabs
  label: string; // button label
  src?: string;   // image url
  alt?: string;
  content?: React.ReactNode;
};

export type ShowcaseStep = {
  id: string;
  title: string;
  text: string;
};

export type FeatureShowcaseProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** small chips under the description */
  stats?: string[];
  /** accordion steps on the left */
  steps?: ShowcaseStep[];
  /** right-side tabs (image or node per tab) */
  tabs: TabMedia[];
  /** which tab is active initially */
  defaultTab?: string;
  /** fixed panel height in px (also applied as min-height) */
  panelMinHeight?: number | string;
  className?: string;
  primaryActionTo?: string;
  primaryActionLabel?: string;
  secondaryActionTo?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export function FeatureShowcase({
  eyebrow = "Financial overview",
  title,
  description,
  stats = ["Income & expenses", "Spending insights", "Financial goals"],
  steps = [
    {
      id: "step-1",
      title: "Track your spending",
      text:
        "Upload a single image. We read it like a brief and extract palette, texture and cues.",
    },
    {
      id: "step-2",
      title: "Understand your cash flow",
      text:
        "Switch between mockup, screen, or abstract views and tune the mood instantly.",
    },
    {
      id: "step-3",
      title: "Plan ahead",
      text:
        "Get a moodboard ready for your team with consistent visuals and notes.",
    },
  ],
  tabs,
  defaultTab,
  panelMinHeight = "auto",
  className,
  primaryActionTo = "/transactions",
  primaryActionLabel = "Add transaction",
  secondaryActionTo = "/transactions",
  secondaryActionLabel = "View transactions",
  onPrimaryAction,
  onSecondaryAction,
}: FeatureShowcaseProps) {
  const initial = defaultTab ?? (tabs[0]?.value ?? "tab-0");

  return (
    <section className={cn("w-full bg-background text-foreground", className)}>
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 md:grid-cols-12 lg:gap-14">
        {/* Left column */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <Badge variant="outline" className="mb-6 uppercase tracking-wider text-xs px-3 py-1 font-semibold">
              {eyebrow}
            </Badge>

            <h1 className="text-balance text-4xl font-bold leading-[0.95] sm:text-5xl md:text-6xl tracking-tight">
              {title}
            </h1>

            {description ? (
              <p className="mt-6 max-w-xl text-muted-foreground text-base sm:text-lg leading-relaxed">{description}</p>
            ) : null}

            {/* Stats chips */}
            {stats.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {stats.map((s, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-muted text-foreground px-3 py-1 text-xs font-medium"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            )}

            {/* Steps (Accordion) */}
            <div className="mt-8 max-w-xl">
              <Accordion type="single" collapsible className="w-full" defaultValue={steps[0]?.id || "step-1"}>
                {steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger className="text-left text-base font-medium">
                      {step.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {step.text}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                {onPrimaryAction ? (
                  <Button size="lg" onClick={onPrimaryAction}>
                    {primaryActionLabel}
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <Link to={primaryActionTo}>{primaryActionLabel}</Link>
                  </Button>
                )}

                {onSecondaryAction ? (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="border border-border bg-transparent"
                    onClick={onSecondaryAction}
                  >
                    {secondaryActionLabel}
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="border border-border bg-transparent"
                  >
                    <Link to={secondaryActionTo}>{secondaryActionLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-6 flex flex-col">
          <Card
            noPadding
            className="relative overflow-hidden rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] shadow-sm"
            style={{ height: typeof panelMinHeight === 'number' ? `${panelMinHeight}px` : panelMinHeight, minHeight: typeof panelMinHeight === 'number' ? `${panelMinHeight}px` : panelMinHeight }}
          >
            <Tabs defaultValue={initial} className="relative h-full w-full">
              {/* Absolute-fill media container */}
              <div className="relative h-full w-full min-h-[500px]">
                {tabs.map((t, idx) => (
                  <TabsContent
                    key={t.value}
                    value={t.value}
                    className={cn(
                      "absolute inset-0 m-0 h-full w-full",
                      "data-[state=inactive]:hidden"
                    )}
                  >
                    {t.content ? (
                      t.content
                    ) : (
                      <img
                        src={t.src}
                        alt={t.alt ?? t.label}
                        className="h-full w-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                    )}
                  </TabsContent>
                ))}
              </div>

              {/* Tab controls (pill) */}
              <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex w-full justify-center px-4">
                <TabsList className="flex flex-wrap gap-2 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]/80 p-1.5 backdrop-blur-md shadow-md">
                  {tabs.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="rounded-lg px-4 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-[var(--color-text-primary)] data-[state=active]:text-[var(--color-bg-primary)] transition-all cursor-pointer"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}
