import React, { useState, useMemo } from 'react';
import { useCurrency } from '../lib/hooks/useCurrency.js';
import { Button } from '../components/ui/Button.js';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X,
  PieChart as PieIcon,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../lib/utils.js';
import { 
  BarChart, 
  Bar, 
  BarXAxis, 
  YAxis as CustomYAxis, 
  Grid, 
  ChartTooltip,
  Gauge
} from '../components/ui/charts/index.js';
import { ResponsiveContainer, BarChart as ReBarChart, Bar as ReBar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import { useAnalyticsSummary } from '../features/analytics/hooks/useAnalytics.js';

export interface CategoryBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  notes?: string;
  alertThreshold?: number; // e.g. 85%
}

const INITIAL_BUDGETS: CategoryBudget[] = [
  {
    id: 'b-1',
    category: 'Housing',
    limit: 280000,
    spent: 227000,
    alertThreshold: 90,
    notes: 'Fixed monthly lease & utilities'
  },
  {
    id: 'b-2',
    category: 'Food & Dining',
    limit: 120000,
    spent: 94000,
    alertThreshold: 85,
    notes: 'Groceries, dining out, and coffee runs'
  },
  {
    id: 'b-3',
    category: 'Shopping',
    limit: 95000,
    spent: 75000,
    alertThreshold: 85,
    notes: 'Electronics, clothing, and general shopping'
  },
  {
    id: 'b-4',
    category: 'Investments',
    limit: 70000,
    spent: 55000,
    alertThreshold: 85,
    notes: 'Monthly index fund and crypto purchases'
  },
  {
    id: 'b-5',
    category: 'Transportation',
    limit: 25000,
    spent: 19000,
    alertThreshold: 85,
    notes: 'Fuel, public transit pass, and rideshare'
  },
  {
    id: 'b-6',
    category: 'Entertainment',
    limit: 12000,
    spent: 8998,
    alertThreshold: 80,
    notes: 'Streaming subscriptions and gaming'
  }
];

export default function BudgetPage() {
  const { formatMoney } = useCurrency();
  const { data: analyticsData } = useAnalyticsSummary();

  const [customLimits, setCustomLimits] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('finsight_budget_limits');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Dynamically compute budgets from backend seeded workspace transactions or fallback INITIAL_BUDGETS
  const budgets = useMemo<CategoryBudget[]>(() => {
    let list: CategoryBudget[] = [];

    if (analyticsData?.categoryAnalysis && analyticsData.categoryAnalysis.length > 0) {
      list = analyticsData.categoryAnalysis.map((c, idx) => {
        const spent = Math.abs(c.amount);
        const defaultLimit = Math.max(10000, Math.ceil((spent > 0 ? spent * 1.25 : 40000) / 5000) * 5000);
        const customVal = customLimits[c.categoryName];
        const limit = typeof customVal === 'number' ? customVal : defaultLimit;

        return {
          id: `b-cat-${idx}`,
          category: c.categoryName,
          limit,
          spent,
          alertThreshold: 85,
          notes: `Monthly category allocation for ${c.categoryName}`
        };
      });
    } else {
      list = INITIAL_BUDGETS.map(b => {
        const customVal = customLimits[b.category];
        const limit = typeof customVal === 'number' ? customVal : b.limit;
        return {
          ...b,
          limit
        };
      });
    }

    // Include custom user-added categories if not already present
    const existingCats = new Set(list.map(b => b.category.toLowerCase()));
    Object.entries(customLimits).forEach(([catName, limitVal], i) => {
      if (limitVal > 0 && !existingCats.has(catName.toLowerCase())) {
        list.push({
          id: `b-custom-${i}`,
          category: catName,
          limit: limitVal,
          spent: 0,
          alertThreshold: 85,
          notes: `Custom monthly allocation for ${catName}`
        });
      }
    });

    return list.filter(b => b.limit > 0);
  }, [analyticsData, customLimits]);

  const mainBudgets = useMemo(() => budgets.slice(0, 6), [budgets]);
  const extraBudgets = useMemo(() => budgets.slice(6), [budgets]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<CategoryBudget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    notes: '',
    alertThreshold: '85'
  });

  // Calculated Summary Metrics
  const totalBudget = useMemo(() => budgets.reduce((acc, b) => acc + b.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + b.spent, 0), [budgets]);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Chart Data for Budget vs Actual (Bar Chart)
  const chartData = useMemo(() => {
    return budgets.map(b => ({
      category: b.category.split(' ')[0], // short name for x-axis label
      fullCategory: b.category,
      Budget: Math.round(b.limit / 100),
      Actual: Math.round(b.spent / 100),
      BudgetMinor: b.limit,
      ActualMinor: b.spent
    }));
  }, [budgets]);

  // Risk ranking data (highest % used first)
  const riskCategories = useMemo(() => {
    return [...budgets]
      .map(b => ({
        ...b,
        pct: b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [budgets]);

  const handleOpenModal = (budget?: CategoryBudget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        category: budget.category,
        limit: Math.round(budget.limit / 100).toString(),
        notes: budget.notes || '',
        alertThreshold: (budget.alertThreshold || 85).toString()
      });
    } else {
      setEditingBudget(null);
      setFormData({
        category: '',
        limit: '450',
        notes: '',
        alertThreshold: '85'
      });
    }
    setModalOpen(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = Math.round((parseFloat(formData.limit) || 0) * 100);
    const categoryName = formData.category.trim();

    if (categoryName) {
      const updated = { ...customLimits, [categoryName]: limitNum };
      setCustomLimits(updated);
      try {
        localStorage.setItem('finsight_budget_limits', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save budget limit to localStorage', err);
      }
    }
    setModalOpen(false);
  };

  const handleDeleteBudget = (id: string) => {
    const target = budgets.find(b => b.id === id);
    if (target) {
      const updated = { ...customLimits, [target.category]: 0 };
      setCustomLimits(updated);
      try {
        localStorage.setItem('finsight_budget_limits', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to update budget limits', err);
      }
    }
  };

  const renderCategoryCard = (b: CategoryBudget) => {
    const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
    const remaining = b.limit - b.spent;
    const isHigh = pct >= (b.alertThreshold || 85);
    const isExceeded = pct > 100;

    return (
      <div 
        key={b.id}
        className="p-5 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-150"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[var(--color-text-primary)] truncate max-w-[130px]">
              {b.category}
            </h4>
            <span className={cn("text-xs font-bold tabular-nums", 
              isExceeded ? "text-red-500" : isHigh ? "text-amber-600 dark:text-amber-400" : "text-[var(--color-text-primary)]"
            )}>
              {pct}% used
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
            MONTHLY
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-300", 
              isExceeded ? "bg-red-500" : isHigh ? "bg-amber-500" : "bg-[var(--color-text-primary)]"
            )}
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>

        {/* Data Table */}
        <div className="flex flex-col gap-1.5 text-xs font-medium pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">Budget</span>
            <span className="font-bold text-[var(--color-text-primary)] tabular-nums">{formatMoney(b.limit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">Spent</span>
            <span className="font-bold text-red-500 tabular-nums">{formatMoney(b.spent)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-secondary)]">Remaining</span>
            <span className={cn("font-bold tabular-nums", remaining < 0 ? "text-red-500" : "text-emerald-500")}>
              {formatMoney(remaining)}
            </span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border-primary)]/40 text-[var(--color-text-secondary)]">
          <button
            onClick={() => handleOpenModal(b)}
            title="Edit Budget"
            className="p-1 rounded hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDeleteBudget(b.id)}
            title="Delete Budget"
            className="p-1 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col p-6 sm:p-10 max-w-[1400px] mx-auto w-full gap-8 pb-20 font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Budget
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">
            Track how your planned spending compares with reality.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold text-sm shadow-sm hover:opacity-90 transition-all select-none self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Budget
        </button>
      </div>

      {/* 2. Top Summary Metric Cards (Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budgeted */}
        <div className="p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Total Budgeted
          </span>
          <div className="text-3xl font-extrabold text-[var(--color-text-primary)] tabular-nums tracking-tight">
            {formatMoney(totalBudget)}
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Total Spent
          </span>
          <div className="text-3xl font-extrabold text-red-500 tabular-nums tracking-tight">
            {formatMoney(totalSpent)}
          </div>
        </div>

        {/* Total Remaining */}
        <div className="p-6 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Total Remaining
          </span>
          <div className={cn("text-3xl font-extrabold tabular-nums tracking-tight", totalRemaining < 0 ? "text-red-500" : "text-emerald-500")}>
            {formatMoney(totalRemaining)}
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Budget Overview (Left) & Category Cards Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 4 Cols: Budget Overview Card */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Budget Overview
            </h3>
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">
              This Month
            </span>
          </div>

          {/* Donut Gauge Chart */}
          <div className="relative flex items-center justify-center my-1">
            <Gauge
              orientation="arc"
              centerValue={totalBudget}
              defaultLabel="Total Budget"
              inactiveFillOpacity={0.3}
              spacing={25}
              value={overallPercentage}
            />
          </div>

          {/* Breakdown List */}
          <div className="flex flex-col gap-3 pt-4 border-t border-[var(--color-border-primary)]/50 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Spent</span>
              <span className="font-bold text-red-500 tabular-nums">{formatMoney(totalSpent)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Remaining</span>
              <span className={cn("font-bold tabular-nums", totalRemaining < 0 ? "text-red-500" : "text-emerald-500")}>
                {formatMoney(totalRemaining)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)] font-medium">Overall Percentage</span>
              <span className="font-bold text-[var(--color-text-primary)] tabular-nums">{overallPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: First 6 Category Budget Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {mainBudgets.map(renderCategoryCard)}
        </div>
      </div>

      {/* 3b. Additional Category Budget Cards (>6) starting from Left Margin of Budget Overview */}
      {extraBudgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
          {extraBudgets.map(renderCategoryCard)}
        </div>
      )}

      {/* 4. Bottom Section: Budget vs Actual Bar Chart (Left) & Budget Risk (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols: Budget vs Actual Bar Chart */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col justify-between gap-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Budget vs Actual
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                Planned budget limits compared to real outlays
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[var(--color-text-primary)]" />
                <span>Budget</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-neutral-400" />
                <span>Actual</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="h-[260px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={v => `$${v}`}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-bg-secondary)', opacity: 0.5 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0 && payload[0]?.payload) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] shadow-xl text-xs font-sans flex flex-col gap-1.5">
                          <div className="font-bold text-[var(--color-text-primary)]">{data.fullCategory}</div>
                          <div className="flex items-center justify-between gap-4 text-[var(--color-text-secondary)]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-text-primary)]" /> Budget:
                            </span>
                            <span className="font-bold text-[var(--color-text-primary)]">{formatMoney(data.BudgetMinor)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-[var(--color-text-secondary)]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-neutral-400" /> Actual:
                            </span>
                            <span className="font-bold text-red-500">{formatMoney(data.ActualMinor)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReBar dataKey="Budget" fill="var(--color-text-primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <ReBar dataKey="Actual" fill="#9CA3AF" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 4 Cols: Budget Risk Card */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] shadow-2xs flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Budget Risk
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                Categories approaching or exceeding limits
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Highest Used
            </span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[260px] pr-1">
            {riskCategories.map(r => (
              <div key={r.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--color-text-primary)] truncate max-w-[150px]">
                    {r.category}
                  </span>
                  <span className={cn("font-bold tabular-nums", 
                    r.pct > 100 ? "text-red-500" : r.pct >= 85 ? "text-amber-600 dark:text-amber-400" : "text-[var(--color-text-primary)]"
                  )}>
                    {r.pct}% used
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--color-bg-secondary)] overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-300", 
                      r.pct > 100 ? "bg-red-500" : r.pct >= 85 ? "bg-amber-500" : "bg-[var(--color-text-primary)]"
                    )}
                    style={{ width: `${Math.min(100, r.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Set / Edit Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-2xl shadow-2xl p-6 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[var(--color-border-primary)]/50 pb-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                {editingBudget ? 'Edit Category Budget' : 'Set New Category Budget'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Category Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Dining Out, Transportation, Entertainment"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Monthly Target Limit ($)
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  step="10"
                  placeholder="e.g. 450"
                  value={formData.limit}
                  onChange={e => setFormData({ ...formData, limit: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Alert Warning Threshold (%)
                </label>
                <select
                  value={formData.alertThreshold}
                  onChange={e => setFormData({ ...formData, alertThreshold: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                >
                  <option value="75">75% of limit</option>
                  <option value="80">80% of limit</option>
                  <option value="85">85% of limit (Default)</option>
                  <option value="90">90% of limit</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Notes / Strategy (Optional)
                </label>
                <textarea 
                  rows={2}
                  placeholder="Add notes about spending rules or targets..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-primary)]/50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-bold text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  {editingBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
