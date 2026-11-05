"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  ShieldCheck,
  PieChart
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import { useCurrency } from "../../lib/hooks/useCurrency.js";

export type FinancialOverviewItem = {
  id: string;
  name: string;
  subtitle?: string;
  value: string;
  change: string;
  isPositive: boolean;
  type: 'income' | 'expense' | 'savings';
};

export type InsightCardItem = {
  category: string;
  title: string;
  actionText: string;
  link: string;
  icon?: React.ReactNode;
};

export type StockPortfolioCardProps = {
  totalNetSavings?: number;
  savingsChangePercent?: number;
  periodLabel?: string;
  overviewItems?: FinancialOverviewItem[];
  insights?: InsightCardItem[];
  className?: string;
};

const defaultInsights: InsightCardItem[] = [
  {
    category: "SPENDING • THIS MONTH",
    title: "Your spending is trending lower this month",
    actionText: "View spending insights",
    link: "/analytics",
    icon: <PieChart className="w-3.5 h-3.5 text-[var(--theme-accent-highlight,var(--chart-2))]" />,
  },
  {
    category: "FINANCIAL HEALTH",
    title: "Your savings are on track this month",
    actionText: "View financial health",
    link: "/health",
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-accent-highlight,var(--chart-2))]" />,
  },
];

export function StockPortfolioCard({
  totalNetSavings = 124720.76,
  savingsChangePercent = 12.6,
  periodLabel = "This Month, " + new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  overviewItems,
  insights = defaultInsights,
  className,
}: StockPortfolioCardProps) {
  const { formatMoney, symbol, currency } = useCurrency();
  const isINR = currency === 'INR';

  const defaultOverviewItems: FinancialOverviewItem[] = [
    {
      id: "income",
      name: "Monthly Income",
      subtitle: "Total credited earnings",
      value: isINR ? "₹68,328.86" : `${symbol}6,832.86`,
      change: "↑ 8.2% vs Last Month",
      isPositive: true,
      type: "income",
    },
    {
      id: "expenses",
      name: "Monthly Expenses",
      subtitle: "Total spending & outgoings",
      value: isINR ? "₹56,391.90" : `${symbol}5,639.90`,
      change: "↓ 4.1% vs Last Month",
      isPositive: true,
      type: "expense",
    },
    {
      id: "savings",
      name: "Savings Rate",
      subtitle: "64.8% of Income",
      value: "64.8%",
      change: "↑ 6.3% vs Last Month",
      isPositive: true,
      type: "savings",
    },
  ];

  const effectiveOverviewItems = overviewItems ?? defaultOverviewItems;

  const newsScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollNews = (direction: 'left' | 'right') => {
    if (newsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      newsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("w-full rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-xs p-6 sm:p-8 space-y-6", className)}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--color-border-primary)] pb-6">
        <div>
          <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Wallet className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
            Total Net Savings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-[var(--color-text-primary)]">
            +{formatMoney(totalNetSavings)}
          </h2>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold tabular-nums text-[var(--chart-2)]">
            <ChevronUp className="h-4 w-4" />
            <span>↑ {savingsChangePercent.toFixed(1)}% vs Last Month</span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium text-[var(--color-text-secondary)]">{periodLabel}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-full text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
            LIVE FINANCIAL INSIGHTS
          </span>
        </div>
      </motion.div>

      {/* Financial Overview Rows Section */}
      <motion.div variants={itemVariants}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">Your Financial Overview</h3>
        </div>
        <div className="space-y-1">
          {effectiveOverviewItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between py-3.5 border-b border-[var(--color-border-primary)] last:border-0 hover:bg-[var(--color-bg-secondary)]/50 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)]">
                  {item.type === 'income' && <ArrowDownLeft className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />}
                  {item.type === 'expense' && <ArrowUpRight className="w-4 h-4 text-red-500 dark:text-red-400" />}
                  {item.type === 'savings' && <PiggyBank className="w-4 h-4 text-[var(--color-text-primary)]" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">{item.name}</p>
                  {item.subtitle && <p className="text-xs text-[var(--color-text-secondary)]">{item.subtitle}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm tabular-nums text-[var(--color-text-primary)]">{item.value}</p>
                <span className={cn(
                  "text-xs font-bold inline-flex items-center gap-0.5 tabular-nums",
                  item.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                )}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommended Actionable Insights Carousel */}
      <motion.div variants={itemVariants} className="pt-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--chart-2)]" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">Actionable Insights</h3>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollNews('left')}
              className="p-1.5 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
              aria-label="Scroll insights left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollNews('right')}
              className="p-1.5 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
              aria-label="Scroll insights right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={newsScrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {insights.map((insight, index) => (
            <Link
              key={index}
              to={insight.link}
              className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 p-4.5 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-hover)] transition-all snap-start flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--color-text-secondary)] tracking-wider uppercase flex items-center gap-1.5">
                  {insight.icon}
                  {insight.category}
                </span>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 group-hover:text-[var(--chart-2)] transition-colors">
                  {insight.title}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--color-border-primary)] flex items-center justify-between text-xs font-bold text-[var(--chart-2)]">
                <span>{insight.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StockPortfolioCard;
