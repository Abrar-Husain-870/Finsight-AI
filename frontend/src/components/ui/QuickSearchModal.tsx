"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Receipt,
  Activity,
  Target,
  Upload,
  Calculator,
  Bot,
  Settings,
  ShieldCheck,
  Wallet,
  Play,
  Moon,
  Sun,
  Plus,
  HelpCircle,
  ArrowRight,
  CornerDownLeft,
  X,
  Sparkles,
  Command,
  Tag,
  Calendar,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../../store/uiStore.js';
import { useTheme } from '../../providers/ThemeProvider.js';
import { useDemoTourStore } from '../../features/tour/demoTourStore.js';
import { useCurrency } from '../../lib/hooks/useCurrency.js';
import { useTransactions } from '../../features/transactions/hooks/useTransactions.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { cn } from '../../lib/utils.js';

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Transactions';
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export function QuickSearchModal() {
  const { isQuickSearchOpen, setQuickSearchOpen } = useUiStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  const startTour = useDemoTourStore((s) => s.startTour);
  const { formatMoney, symbol } = useCurrency();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Live transaction search query
  const { data: txData, isLoading: isTxLoading } = useTransactions({
    merchant: debouncedQuery.length >= 2 ? debouncedQuery : undefined,
    limit: 5,
    page: 1,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Focus input on open
  useEffect(() => {
    if (isQuickSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isQuickSearchOpen]);

  // Global Navigation Catalog
  const navItems: SearchItem[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      title: 'Dashboard',
      subtitle: 'Financial core trajectory & cash overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => { navigate('/'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-transactions',
      title: 'Transactions',
      subtitle: 'Ledger records, filtering, and categorization',
      category: 'Navigation',
      icon: Receipt,
      action: () => { navigate('/transactions'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-analytics',
      title: 'Analytics Overview',
      subtitle: 'Spending velocity and merchant deep dive',
      category: 'Navigation',
      icon: Activity,
      action: () => { navigate('/analytics'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-analytics-discipline',
      title: 'Expense Necessity & Discipline',
      subtitle: 'Discretionary vs essential outlays breakdown',
      category: 'Navigation',
      icon: Sparkles,
      action: () => { navigate('/analytics#expense-discipline'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-analytics-merchants',
      title: 'Merchant & Category Deep Dive',
      subtitle: 'Top spending destinations and recurring subscriptions',
      category: 'Navigation',
      icon: Layers,
      action: () => { navigate('/analytics#category-merchant-deepdive'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-health',
      title: 'Financial Health',
      subtitle: 'Composite solvency score, runway, and stress tests',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => { navigate('/health'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-goals',
      title: 'Goals & Savings',
      subtitle: 'Target reserves and goal completion dates',
      category: 'Navigation',
      icon: Target,
      action: () => { navigate('/goals'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-budgets',
      title: 'Budgets',
      subtitle: 'Category caps and monthly discretionary limits',
      category: 'Navigation',
      icon: Wallet,
      action: () => { navigate('/budget'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-import',
      title: 'Import Ledgers',
      subtitle: 'CSV and bank statement ledger ingestion',
      category: 'Navigation',
      icon: Upload,
      action: () => { navigate('/import'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-simulation',
      title: 'Financial Simulation',
      subtitle: 'What-if income shifts and 6-month wealth trajectory',
      category: 'Navigation',
      icon: Calculator,
      action: () => { navigate('/simulation'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-ai',
      title: 'AI Financial Coach',
      subtitle: 'Deterministic coaching grounded in authentic ledger data',
      category: 'Navigation',
      icon: Bot,
      badge: 'AI',
      action: () => { navigate('/ai-coach'); setQuickSearchOpen(false); },
    },
    {
      id: 'nav-settings',
      title: 'Settings',
      subtitle: 'User profile, currency, theme palettes, and security',
      category: 'Navigation',
      icon: Settings,
      action: () => { navigate('/settings'); setQuickSearchOpen(false); },
    },
  ], [navigate, setQuickSearchOpen]);

  // Quick Action Commands
  const actionItems: SearchItem[] = useMemo(() => [
    {
      id: 'act-new-tx',
      title: 'Add New Transaction',
      subtitle: 'Record an income or expense ledger entry',
      category: 'Actions',
      icon: Plus,
      badge: '⌘N',
      action: () => {
        navigate('/transactions');
        setQuickSearchOpen(false);
      },
    },
    {
      id: 'act-tour',
      title: 'Start Interactive Tour',
      subtitle: '10-feature automated walkthrough of FinSight',
      category: 'Actions',
      icon: Play,
      action: () => {
        setQuickSearchOpen(false);
        startTour(0);
      },
    },
    {
      id: 'act-theme',
      title: `Toggle Theme (${resolvedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`,
      subtitle: 'Switch between light and dark visual presentation',
      category: 'Actions',
      icon: resolvedTheme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        setQuickSearchOpen(false);
      },
    },
  ], [navigate, setQuickSearchOpen, startTour, resolvedTheme, toggleTheme]);

  // Live Transaction Items
  const transactionItems: SearchItem[] = useMemo(() => {
    if (!txData?.data || debouncedQuery.trim().length < 2) return [];

    return txData.data.map((tx) => {
      const isExpense = tx.amount < 0;
      const amountStr = `${isExpense ? '-' : '+'}${formatMoney(Math.abs(tx.amount))}`;

      return {
        id: `tx-${tx.id}`,
        title: tx.merchant || tx.description || 'Transaction',
        subtitle: `${new Date(tx.date).toLocaleDateString()} • ${tx.description || 'Ledger Entry'}`,
        category: 'Transactions',
        icon: Receipt,
        badge: amountStr,
        action: () => {
          navigate(`/transactions?search=${encodeURIComponent(tx.merchant || '')}`);
          setQuickSearchOpen(false);
        },
      };
    });
  }, [txData, debouncedQuery, formatMoney, navigate, setQuickSearchOpen]);

  // Filtered items based on user query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...navItems.slice(0, 6), ...actionItems];
    }

    const matchedNav = navItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
    );

    const matchedActions = actionItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
    );

    return [...matchedNav, ...matchedActions, ...transactionItems];
  }, [query, navItems, actionItems, transactionItems]);

  // Keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuickSearchOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Reset index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  return (
    <AnimatePresence>
      {isQuickSearchOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-[10vh] sm:pt-[14vh] p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setQuickSearchOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]"
          >
            {/* Top Search Input Bar */}
            <div className="flex items-center px-4 h-14 border-b border-[var(--color-border-primary)] gap-3 shrink-0">
              <div className="p-1 rounded-lg bg-[var(--theme-badge-bg)] text-[var(--theme-badge-text)]">
                <Search className="h-4 w-4" />
              </div>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions, jump to pages, or execute actions..."
                className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/60 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd
                onClick={() => setQuickSearchOpen(false)}
                className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-mono font-bold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-md cursor-pointer hover:border-[var(--color-border-hover)]"
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 divide-y divide-[var(--color-border-primary)]/40"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                  <Command className="h-8 w-8 text-[var(--color-text-secondary)]/40" />
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Try searching for a page name (e.g. Health, Goals) or merchant name.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 py-1">
                  {filteredItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isSelected = selectedIndex === idx;

                    return (
                      <button
                        key={item.id}
                        data-index={idx}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        type="button"
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group",
                          isSelected
                            ? "bg-[var(--theme-badge-bg)] text-[var(--color-text-primary)] border border-[var(--theme-badge-border)] shadow-2xs font-semibold"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg shrink-0 transition-colors",
                              isSelected
                                ? "bg-[var(--color-bg-primary)] text-[var(--theme-badge-text)] shadow-2xs border border-[var(--theme-badge-border)]"
                                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] border border-[var(--color-border-primary)]"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] truncate leading-tight">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-[11px] text-[var(--color-text-secondary)] truncate mt-0.5">
                                {item.subtitle}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border",
                                item.category === 'Transactions'
                                  ? item.badge.startsWith('+')
                                    ? "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20"
                                    : "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20"
                                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-primary)]"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                          <span
                            className={cn(
                              "text-xs transition-transform duration-150",
                              isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                            )}
                          >
                            <CornerDownLeft className="h-3.5 w-3.5 text-[var(--theme-badge-text)]" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Keyboard Navigation Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 text-[11px] text-[var(--color-text-secondary)] shrink-0">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded font-mono text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded font-mono text-[10px]">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded font-mono text-[10px]">↵</kbd>
                  <span>Open</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded font-mono text-[10px]">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>
              <span className="font-semibold text-[var(--theme-badge-text)] hidden sm:inline">
                FinSight Command
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

