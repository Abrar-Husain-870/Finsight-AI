import React from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Wallet, 
  DollarSign, 
  PiggyBank, 
  ShoppingBag, 
  Briefcase, 
  Fuel, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  LayoutDashboard,
  Receipt,
  PieChart as PieChartIcon,
  Target,
  Settings,
  Bell
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function FinSightDashboardShowcase({ className }: { className?: string }) {
  return (
    <div className={cn("w-full rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-2xl overflow-hidden flex flex-col md:flex-row text-xs sm:text-sm", className)}>
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="h-7 w-7 rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] flex items-center justify-center font-bold text-base shadow-xs">
              F
            </div>
            <span className="font-bold text-base tracking-tight text-[var(--color-text-primary)]">FinSight</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--color-bg-tertiary)] font-medium text-[var(--color-text-primary)] border border-[var(--color-border-primary)] shadow-2xs">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <Receipt className="h-4 w-4" />
              <span>Transactions</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <PieChartIcon className="h-4 w-4" />
              <span>Analytics</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </nav>
        </div>

        {/* User Card */}
        <div className="pt-4 mt-4 border-t border-[var(--color-border-primary)] flex items-center gap-2.5 px-2">
          <div className="h-8 w-8 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)] flex items-center justify-center font-semibold text-xs text-[var(--color-text-primary)]">
            JD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-[var(--color-text-primary)] truncate">Alex Morgan</span>
            <span className="text-[10px] text-[var(--color-text-secondary)] truncate">Pro Account</span>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">Dashboard</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Your finances at a glance</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <input 
                type="text"
                readOnly
                placeholder="Search transactions..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none"
              />
            </div>
            <div className="p-2 rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] shrink-0">
              <Bell className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 4 Core Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1 */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Net Cash Position</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                <Wallet className="h-3.5 w-3.5 text-[var(--color-text-primary)]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold tabular-nums tracking-tight text-[var(--color-text-primary)]">₹1,24,720.76</div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+8.4% from last month</span>
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Monthly Income</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                <DollarSign className="h-3.5 w-3.5 text-[var(--color-success)]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold tabular-nums tracking-tight text-[var(--color-success)]">+₹68,328.86</div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+6.2% from last month</span>
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Monthly Expenses</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                <ArrowUpRight className="h-3.5 w-3.5 text-[var(--color-danger)]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold tabular-nums tracking-tight text-[var(--color-danger)]">₹56,391.90</div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-1">
                <TrendingDown className="h-3 w-3" />
                <span>-4.8% from last month</span>
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Savings Rate</span>
              <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                <PiggyBank className="h-3.5 w-3.5 text-[var(--color-text-primary)]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold tabular-nums tracking-tight text-[var(--color-text-primary)]">17.5%</div>
              <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+2.1% from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cash Flow Overview Line Chart */}
          <div className="lg:col-span-2 p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Cash Flow Overview</h4>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)]">Last 6 months</span>
            </div>

            {/* Custom SVG Line Chart Visual */}
            <div className="h-44 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path 
                  d="M0,80 Q66,55 133,65 T266,45 T400,20 L400,120 L0,120 Z" 
                  fill="url(#chartGradient)" 
                />
                {/* Stroke Line */}
                <path 
                  d="M0,80 Q66,55 133,65 T266,45 T400,20" 
                  fill="none" 
                  stroke="var(--chart-1)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="0" cy="80" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
                <circle cx="80" cy="60" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
                <circle cx="160" cy="65" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
                <circle cx="240" cy="50" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
                <circle cx="320" cy="35" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
                <circle cx="400" cy="20" r="4" fill="var(--color-bg-primary)" stroke="var(--chart-1)" strokeWidth="2" />
              </svg>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between text-[11px] text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border-primary)] mt-2 font-medium">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Expense Breakdown Donut Chart */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Expense Breakdown</h4>
              <button type="button" className="text-[11px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">View Details</button>
            </div>

            {/* Donut Visual */}
            <div className="h-32 flex items-center justify-center relative my-2">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-bg-tertiary)" strokeWidth="4" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-danger)" strokeWidth="4" strokeDasharray="45, 100" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--chart-1)" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-45" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--chart-3)" strokeWidth="4" strokeDasharray="20, 100" strokeDashoffset="-70" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-medium">Expenses</span>
                <span className="text-sm font-bold text-[var(--color-text-primary)] tabular-nums">₹56,391</span>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--color-border-primary)] text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-danger)]" />
                  Housing (45%)
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">₹25,376</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
                  Food & Dining (25%)
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">₹14,097</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
                  Transport (20%)
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">₹11,278</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-text-secondary)]" />
                  Others (10%)
                </span>
                <span className="font-semibold tabular-nums text-[var(--color-text-primary)]">₹5,639</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Recent Transactions & Financial Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Transactions */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Transactions</h4>
              <button type="button" className="text-[11px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">View All</button>
            </div>

            <div className="space-y-2">
              {/* Row 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0">
                    <ShoppingBag className="h-4 w-4 text-[var(--color-text-primary)]" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[var(--color-text-primary)]">Grocery Store</div>
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Today · 2:35 PM</div>
                  </div>
                </div>
                <div className="font-semibold text-xs text-[var(--color-danger)] tabular-nums">−₹2,450</div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0">
                    <Briefcase className="h-4 w-4 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[var(--color-text-primary)]">Salary Credit</div>
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Yesterday · 10:20 AM</div>
                  </div>
                </div>
                <div className="font-semibold text-xs text-[var(--color-success)] tabular-nums">+₹68,328</div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0">
                    <Fuel className="h-4 w-4 text-[var(--color-text-primary)]" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[var(--color-text-primary)]">Fuel Station</div>
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Aug 28 · 6:45 PM</div>
                  </div>
                </div>
                <div className="font-semibold text-xs text-[var(--color-danger)] tabular-nums">−₹1,200</div>
              </div>
            </div>
          </div>

          {/* Financial Insights */}
          <div className="p-4 rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Financial Insights</h4>
              <button type="button" className="text-[11px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">View Insights</button>
            </div>

            <div className="space-y-2">
              {/* Insight 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-[var(--color-text-primary)]">Monthly spending is down</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">2 hours ago</div>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0 mt-0.5">
                  <AlertCircle className="h-4 w-4 text-[var(--color-danger)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-[var(--color-text-primary)]">Food spending increased this week</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">4 hours ago</div>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                <div className="p-1.5 rounded-lg bg-[var(--color-bg-tertiary)] shrink-0 mt-0.5">
                  <Sparkles className="h-4 w-4 text-[var(--color-ai-accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs text-[var(--color-text-primary)]">You're on track with your savings goal</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
