import { create } from 'zustand';

export interface TourStep {
  id: string;
  route: string;
  pageId: string;
  pageTitle: string;
  pageIndex: number; // 1 to totalPages
  totalPages: number;
  sectionId: string; // DOM element ID to scroll to & spotlight
  sectionIndex: number; // 1 to totalSectionsInPage
  totalSectionsInPage: number;
  badge: string;
  title: string;
  subtitle: string;
  whatItIs: string;
  whatItDoes: string;
  highlights: string[];
  durationMs: number; // default 5000ms (5 seconds)
}

export const DEMO_TOUR_STEPS: TourStep[] = [
  // ─── 1. DASHBOARD PAGE (5 SECTIONS) ──────────────────────────────
  {
    id: 'dash-net-position',
    route: '/',
    pageId: 'dashboard',
    pageTitle: 'Dashboard',
    pageIndex: 1,
    totalPages: 8,
    sectionId: 'dashboard-net-position',
    sectionIndex: 1,
    totalSectionsInPage: 5,
    badge: 'Liquid Stance & Momentum',
    title: 'Net Cash Position & Financial Ribbon',
    subtitle: 'Macro Solvency & Real-Time Verified Totals',
    whatItIs: 'An executive position summary consolidating verified liquid net capital, current month inflows, living expenses, and net surplus.',
    whatItDoes: 'Computes real-time liquidity without floating-point inaccuracies, synchronizing immediate cash flow changes across the ledger ribbon.',
    highlights: ['Net Cash Position', 'Live Income & Expense Ribbon', 'Dynamic Currency Sync'],
    durationMs: 5000,
  },
  {
    id: 'dash-health-milestones',
    route: '/',
    pageId: 'dashboard',
    pageTitle: 'Dashboard',
    pageIndex: 1,
    totalPages: 8,
    sectionId: 'dashboard-health-milestones',
    sectionIndex: 2,
    totalSectionsInPage: 5,
    badge: 'Health & Velocity Momentum',
    title: 'Financial Health Score & Velocity Momentum',
    subtitle: 'Top 15% Solvency Tier & 14-Period Velocity Curve',
    whatItIs: 'A 3-card balanced bento featuring the 0-100 Solvency Score, rolling 14-period Cash Flow Velocity bar chart, and habit Streak Tracker.',
    whatItDoes: 'Tracks rolling bi-weekly velocity periods to demonstrate whether your surplus generation is accelerating or slowing down over time.',
    highlights: ['84/100 Top Tier Health', '14-Period Velocity Momentum', '5.8 Mo Emergency Runway', 'Active Tracking Streak'],
    durationMs: 5000,
  },
  {
    id: 'dash-performance-kpis',
    route: '/',
    pageId: 'dashboard',
    pageTitle: 'Dashboard',
    pageIndex: 1,
    totalPages: 8,
    sectionId: 'dashboard-performance-kpis',
    sectionIndex: 3,
    totalSectionsInPage: 5,
    badge: 'Quarterly Trajectory',
    title: 'Performance Overview & Quarterly KPIs',
    subtitle: 'Target Milestones & Operational Financial Ratios',
    whatItIs: 'Consolidated KPI telemetry tracking capital accumulation curves, debt-to-income benchmarks, and living expense ratios.',
    whatItDoes: 'Measures progress against quarterly benchmarks, providing actionable indicators on capital retention efficiency and savings rates.',
    highlights: ['Quarterly Benchmarks', 'Capital Accumulation', 'Efficiency Ratios'],
    durationMs: 5000,
  },
  {
    id: 'dash-cashflow-analytics',
    route: '/',
    pageId: 'dashboard',
    pageTitle: 'Dashboard',
    pageIndex: 1,
    totalPages: 8,
    sectionId: 'dashboard-cashflow-analytics',
    sectionIndex: 4,
    totalSectionsInPage: 5,
    badge: 'Inflow vs Outflow Dynamics',
    title: 'Cash Flow Trend & Expense Breakdown',
    subtitle: '6-Month Inflow Trajectory & Category Distribution',
    whatItIs: 'An 8/4 grid combining a 6-month historical cash flow trend area spread with a categorized expense donut chart.',
    whatItDoes: 'Plots earned revenue against operational expenditures to visualize cash retention spread and reveal top expense drivers.',
    highlights: ['6-Month Historical Area Spread', 'Top Categorical Outflows', 'Essential vs Discretionary Ratio'],
    durationMs: 5000,
  },
  {
    id: 'dash-portfolio-activity',
    route: '/',
    pageId: 'dashboard',
    pageTitle: 'Dashboard',
    pageIndex: 1,
    totalPages: 8,
    sectionId: 'dashboard-portfolio-activity',
    sectionIndex: 5,
    totalSectionsInPage: 5,
    badge: 'Asset Growth & Ledger',
    title: 'Portfolio Assets & Recent Activity Stream',
    subtitle: 'Asset Allocation & Real-Time Verified Ledger',
    whatItIs: 'A unified view of investment portfolio holdings alongside the latest 10 verified transactions.',
    whatItDoes: 'Monitors asset growth across equity and cash reserves while surfacing live activity with instant category tagging.',
    highlights: ['Stock Portfolio & Market Intel', 'Verified Recent 10 Transactions', 'Instant Transaction Detail View'],
    durationMs: 5000,
  },

  // ─── 2. ANALYTICS PAGE (6 SECTIONS) ──────────────────────────────
  {
    id: 'analytics-bento-overview',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'analytics-bento',
    sectionIndex: 1,
    totalSectionsInPage: 6,
    badge: 'Macro Intelligence',
    title: 'Financial Intelligence & Analytics Bento',
    subtitle: 'Executive Summary, Radial Vitals & AI Risk Badges',
    whatItIs: 'A consolidated intelligence bento showcasing high-level health trajectories, net cash flow status, and AI insight badges.',
    whatItDoes: 'Aggregates comprehensive multi-period analytics into 4 radial metric dials and alerts you to urgent cash trends.',
    highlights: ['Bento Performance Showcase', 'AI Risk & Opportunity Badges', 'Radial Solvency Gauges'],
    durationMs: 5000,
  },
  {
    id: 'analytics-expense-discipline',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'expense-discipline',
    sectionIndex: 2,
    totalSectionsInPage: 6,
    badge: 'Behavioral Economics',
    title: '1. Expense Necessity & Discipline Analytics',
    subtitle: 'Subjective Utility & Regret Spend Analysis (1★-5★)',
    whatItIs: 'A behavioral economics engine based on subjective 1-to-5 star purchase necessity ratings.',
    whatItDoes: 'Distinguishes wise spend (4-5★ essentials) from regret spend (1-2★ impulse purchases) to eliminate lifestyle creep.',
    highlights: ['Regret vs Wise Spending Curves', 'Discipline Split Ratios', '1★-5★ Necessity Breakdown', 'Behavioral Donut'],
    durationMs: 5000,
  },
  {
    id: 'analytics-health-velocity',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'financial-health-velocity',
    sectionIndex: 3,
    totalSectionsInPage: 6,
    badge: 'Liquidity & Burn Rate',
    title: '2. Core Financial Health & Velocity Cards & Graphs',
    subtitle: 'Daily Outflow Velocity vs 20% Golden Rule Target',
    whatItIs: 'Real-time cash drain monitors calculating daily spending velocity pace against monthly budget ceilings.',
    whatItDoes: 'Computes daily burn velocity, tracks actual savings against the 20% benchmark, and plots historical solvency curves.',
    highlights: ['Daily Burn Rate Pacing', '20% Savings Benchmark Compliance', 'Dual-Area Inflow vs Outflow', 'Solvency Index Trend'],
    durationMs: 5000,
  },
  {
    id: 'analytics-merchant-deepdive',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'category-merchant-deepdive',
    sectionIndex: 4,
    totalSectionsInPage: 6,
    badge: 'Counterparty Exposure',
    title: '3. Category & Merchant Deep-Dive Visualizations',
    subtitle: 'Multi-Layer Funnel Exposure & Retailer Concentration',
    whatItIs: 'A granular expenditure decomposition revealing exact capital allocation across categories and individual counterparties.',
    whatItDoes: 'Identifies single-vendor over-reliance (flagging risk when a vendor exceeds 35% of total spend) with a multi-layer funnel.',
    highlights: ['Parent vs Subcategory Hierarchy', 'Merchant Frequency & Volume', '35% Over-Reliance Warning', 'Concentration Risk Funnel'],
    durationMs: 5000,
  },
  {
    id: 'analytics-goals-buffer',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'savings-goals-buffer',
    sectionIndex: 5,
    totalSectionsInPage: 6,
    badge: 'Capital Allocation',
    title: '4. Savings Goals & Financial Buffer Analytics',
    subtitle: 'Liquid Runway Buffers & Milestone Feasibility',
    whatItIs: 'Target feasibility engine comparing required goal allocations against actual monthly surplus.',
    whatItDoes: 'Tracks runway buffer safety (months of basic living covered) and visualizes progress toward wealth accumulation targets.',
    highlights: ['Emergency Buffer Months', 'Required Savings Feasibility', 'Goal Allocation Progress'],
    durationMs: 5000,
  },
  {
    id: 'analytics-ai-projections',
    route: '/analytics',
    pageId: 'analytics',
    pageTitle: 'Analytics',
    pageIndex: 2,
    totalPages: 8,
    sectionId: 'ai-insights-projections',
    sectionIndex: 6,
    totalSectionsInPage: 6,
    badge: 'Predictive Intelligence',
    title: '5. AI Insights & Financial Projections',
    subtitle: 'Forward-Looking Cash Scenarios & Pattern Recognition',
    whatItIs: 'Automated predictive modeling forecasting future balances based on current recurring commitments and run rates.',
    whatItDoes: 'Projects end-of-quarter solvency, flags creeping subscriptions, and suggests high-leverage optimization targets.',
    highlights: ['Quarterly Projections', 'Creeping Subscription Alerts', 'Predictive Cash Flow Model'],
    durationMs: 5000,
  },

  // ─── 3. TRANSACTIONS PAGE (3 SECTIONS) ───────────────────────────
  {
    id: 'tx-header-search',
    route: '/transactions',
    pageId: 'transactions',
    pageTitle: 'Transactions',
    pageIndex: 3,
    totalPages: 8,
    sectionId: 'transactions-header-search',
    sectionIndex: 1,
    totalSectionsInPage: 3,
    badge: 'Audit Register',
    title: 'Ledger Header & Instant Search',
    subtitle: 'Real-Time Search & Manual Entry Modal',
    whatItIs: 'An audit-ready transaction register supporting real-time text query filtering, new transaction entry, and bank CSV exports.',
    whatItDoes: 'Instantly filters thousands of records with keyboard shortcuts ("/" for search, "N" for new transaction) with zero lag.',
    highlights: ['Instant Substring Search', 'Keyboard Hotkeys (/ & N)', 'CSV Export & Import Integration'],
    durationMs: 5000,
  },
  {
    id: 'tx-filters',
    route: '/transactions',
    pageId: 'transactions',
    pageTitle: 'Transactions',
    pageIndex: 3,
    totalPages: 8,
    sectionId: 'transactions-filters',
    sectionIndex: 2,
    totalSectionsInPage: 3,
    badge: 'Parametric Filtering',
    title: 'Multi-Category & Date Range Filtering',
    subtitle: 'Parent Categories, Subcategories & Date Boundaries',
    whatItIs: 'Parametric filter bar combining cascading category selectors, calendar date range pickers, and multi-field sorting.',
    whatItDoes: 'Isolates exact transaction subsets by date boundaries, category taxonomy, and sort criteria with active filter pills.',
    highlights: ['Two-Tier Category Pickers', 'Calendar Date Range Filter', 'Multi-Column Sorting', 'Active Filter Pills'],
    durationMs: 5000,
  },
  {
    id: 'tx-table',
    route: '/transactions',
    pageId: 'transactions',
    pageTitle: 'Transactions',
    pageIndex: 3,
    totalPages: 8,
    sectionId: 'transactions-table',
    sectionIndex: 3,
    totalSectionsInPage: 3,
    badge: 'Integer Minor-Unit Accuracy',
    title: 'Granular Ledger & Necessity Rating Tags',
    subtitle: '1★-5★ Behavioral Utility & Integer Minor-Unit Math',
    whatItIs: 'High-density financial ledger recording merchant, category, necessity rating (1-5★), and integer minor-unit amounts.',
    whatItDoes: 'Prevents IEEE 754 floating-point rounding errors by calculating every transaction in integer minor units (cents/paisa).',
    highlights: ['Integer Minor-Unit Math', '1★-5★ Necessity Ratings', 'Inline Category Badges', 'Bulk Delete & Export Actions'],
    durationMs: 5000,
  },

  // ─── 4. FINANCIAL HEALTH PAGE (4 SECTIONS) ───────────────────────
  {
    id: 'health-spotlight',
    route: '/health',
    pageId: 'health',
    pageTitle: 'Financial Health',
    pageIndex: 4,
    totalPages: 8,
    sectionId: 'health-score-spotlight',
    sectionIndex: 1,
    totalSectionsInPage: 4,
    badge: 'Diagnostic Scoring',
    title: 'Radial Solvency Ring & Actionable Prescriptions',
    subtitle: 'Overall Stability Index (0-100) & High-Leverage Steps',
    whatItIs: 'Vo2Max-inspired diagnostic ring displaying your overall health score alongside AI-generated actionable prescriptions.',
    whatItDoes: 'Evaluates debt-to-income, liquidity runway, and spending volatility to produce step-by-step recommendations to reach 95+.',
    highlights: ['Radial Vo2Max Score Ring', 'Actionable Prescriptions List', 'Target Runway Expansion Steps'],
    durationMs: 5000,
  },
  {
    id: 'health-metrics',
    route: '/health',
    pageId: 'health',
    pageTitle: 'Financial Health',
    pageIndex: 4,
    totalPages: 8,
    sectionId: 'health-summary-metrics',
    sectionIndex: 2,
    totalSectionsInPage: 4,
    badge: 'Explainable Rules',
    title: 'Deterministic 4-Pillar Metric Cards',
    subtitle: 'Solvency, Emergency Runway, Debt Burden & Volatility',
    whatItIs: 'Four transparent metric cards tracking the foundational pillars of fiscal health with sparkline trendlines.',
    whatItDoes: 'Replaces opaque black-box scoring with deterministic formulas measuring exact liquid runway months and volatility.',
    highlights: ['4-Pillar Transparent Scorecard', '5.8 Months Liquid Runway', '26.4% Low Debt Burden', 'Spending Volatility Meter'],
    durationMs: 5000,
  },
  {
    id: 'health-stress',
    route: '/health',
    pageId: 'health',
    pageTitle: 'Financial Health',
    pageIndex: 4,
    totalPages: 8,
    sectionId: 'health-stress-matrix',
    sectionIndex: 3,
    totalSectionsInPage: 4,
    badge: 'Stress Testing',
    title: 'Financial Shock Resilience & Stress Matrix',
    subtitle: 'Survival Projections Against Income Loss & Shocks',
    whatItIs: 'A deterministic stress-test matrix simulating macroeconomic and personal financial crisis scenarios.',
    whatItDoes: 'Tests portfolio survival against a 3-month sudden income loss, emergency outlays, and inflation shocks without guessing.',
    highlights: ['3-Month Income Loss Simulation', 'Emergency Expense Shock Test', 'Inflation Resilience Rating', 'Survival Runway Horizon'],
    durationMs: 5000,
  },
  {
    id: 'health-burn',
    route: '/health',
    pageId: 'health',
    pageTitle: 'Financial Health',
    pageIndex: 4,
    totalPages: 8,
    sectionId: 'health-factors-burn',
    sectionIndex: 4,
    totalSectionsInPage: 4,
    badge: 'Diagnostic Vitals',
    title: 'Diagnostic Factors, Asset Buffer & Daily Burn Rate',
    subtitle: 'Factor Weightings, Liquidity Donut & Outflow Pace',
    whatItIs: 'A 3-column diagnostic grid examining component factor scores, asset allocation donut, and daily outflow velocity.',
    whatItDoes: 'Visualizes liquid vs invested capital allocation and paces daily operational spend against monthly targets.',
    highlights: ['Component Factor Weightings', 'Asset & Buffer Donut Distribution', 'Daily Outflow Velocity Pace'],
    durationMs: 5000,
  },

  // ─── 5. SAVINGS GOALS PAGE (3 SECTIONS) ──────────────────────────
  {
    id: 'goals-summary-section',
    route: '/goals',
    pageId: 'goals',
    pageTitle: 'Savings Goals',
    pageIndex: 5,
    totalPages: 8,
    sectionId: 'goals-summary',
    sectionIndex: 1,
    totalSectionsInPage: 3,
    badge: 'Feasibility Engine',
    title: 'Target Capital Summary & Feasibility Indicator',
    subtitle: 'Total Saved vs Required Monthly Allocations',
    whatItIs: 'An executive summary ribbon tracking aggregate savings progress, total target capital, and overall feasibility status.',
    whatItDoes: 'Calculates total required monthly savings across all targets and tags feasibility as Achievable, Stretch, or Unrealistic.',
    highlights: ['Aggregate Target vs Saved', 'Overall Feasibility Tag', 'Required Monthly Allocation Sum'],
    durationMs: 5000,
  },
  {
    id: 'goals-grid-section',
    route: '/goals',
    pageId: 'goals',
    pageTitle: 'Savings Goals',
    pageIndex: 5,
    totalPages: 8,
    sectionId: 'goals-grid',
    sectionIndex: 2,
    totalSectionsInPage: 3,
    badge: 'Milestone Planner',
    title: 'Dynamic Goals Grid & Visual Progress Rings',
    subtitle: 'Individual Milestone Cards & Goal Planner Modal',
    whatItIs: 'Interactive card grid displaying active financial targets (emergency fund, real estate, vehicles, travel) with progress rings.',
    whatItDoes: 'Provides detailed progress meters, target completion dates, and launches the interactive mathematical goal planner modal.',
    highlights: ['Circular Progress Rings', 'Target Completion Dates', 'Interactive Goal Planner Modal', 'One-Click Target Editing'],
    durationMs: 5000,
  },
  {
    id: 'goals-recs-section',
    route: '/goals',
    pageId: 'goals',
    pageTitle: 'Savings Goals',
    pageIndex: 5,
    totalPages: 8,
    sectionId: 'goals-recommendations',
    sectionIndex: 3,
    totalSectionsInPage: 3,
    badge: 'Algorithmic Validation',
    title: 'Goal Recommendations & Cash Flow Validation',
    subtitle: 'Algorithmic Verification Against Net Monthly Surplus',
    whatItIs: 'An algorithmic advisory card that validates whether your monthly savings demands fit safely within net cash flow.',
    whatItDoes: 'Flags if planned savings will induce cash flow strain, recommending timeline adjustments to maintain solvency.',
    highlights: ['Surplus Cash Flow Cross-Check', 'Proactive Over-Commitment Warning', 'Optimized Timeline Suggestions'],
    durationMs: 5000,
  },

  // ─── 6. BUDGET PAGE (3 SECTIONS) ─────────────────────────────────
  {
    id: 'budget-summary-section',
    route: '/budget',
    pageId: 'budget',
    pageTitle: 'Budget',
    pageIndex: 6,
    totalPages: 8,
    sectionId: 'budget-summary',
    sectionIndex: 1,
    totalSectionsInPage: 3,
    badge: 'Living Expense Ceilings',
    title: 'Monthly Budget Summary Metrics',
    subtitle: 'Total Budgeted, Total Spent & Total Remaining',
    whatItIs: 'Top metric cards calculating total monthly budgeted allowance, actual spent to date, and remaining buffer.',
    whatItDoes: 'Synchronizes dynamically with active currency and recalculates remaining allowance as transactions arrive.',
    highlights: ['Total Budgeted Ceiling', 'Live Outflow Consumption', 'Remaining Net Buffer', 'Dynamic Currency Sync'],
    durationMs: 5000,
  },
  {
    id: 'budget-overview-section',
    route: '/budget',
    pageId: 'budget',
    pageTitle: 'Budget',
    pageIndex: 6,
    totalPages: 8,
    sectionId: 'budget-overview-grid',
    sectionIndex: 2,
    totalSectionsInPage: 3,
    badge: 'Proactive Guardrails',
    title: 'Budget Overview Donut & Category Limits',
    subtitle: 'Progress Gauges with 80-90% Warning Thresholds',
    whatItIs: 'A central donut utilization gauge paired with category cards equipped with customizable limit thresholds.',
    whatItDoes: 'Turns amber at 80-85% threshold and red when exceeded, preventing unexpected month-end budget exhaustion.',
    highlights: ['Circular Utilization Gauge', 'Category Target Limit Cards', '80%-90% Threshold Warning Triggers', 'Custom Limit Modal'],
    durationMs: 5000,
  },
  {
    id: 'budget-charts-section',
    route: '/budget',
    pageId: 'budget',
    pageTitle: 'Budget',
    pageIndex: 6,
    totalPages: 8,
    sectionId: 'budget-charts',
    sectionIndex: 3,
    totalSectionsInPage: 3,
    badge: 'Variance Analytics',
    title: 'Budget vs Actual Spend Comparison Chart',
    subtitle: 'Category-by-Category Comparative Bar Chart',
    whatItIs: 'A comparative bar chart visualizing planned budget allocation against actual recorded outflows per category.',
    whatItDoes: 'Highlights exact dollar/rupee variance across living categories to rapidly isolate budget overrun culprits.',
    highlights: ['Side-by-Side Budget vs Actual', 'Exact Variance Breakdown', 'Overrun Culprit Isolation'],
    durationMs: 5000,
  },

  // ─── 7. SIMULATION PAGE (3 SECTIONS) ─────────────────────────────
  {
    id: 'sim-controls-section',
    route: '/simulation',
    pageId: 'simulation',
    pageTitle: 'Simulation',
    pageIndex: 7,
    totalPages: 8,
    sectionId: 'simulation-controls',
    sectionIndex: 1,
    totalSectionsInPage: 3,
    badge: 'What-If Sandbox',
    title: 'Dual Shift Scenario Sliders',
    subtitle: 'Income Shift & Living Expense Shift Controls',
    whatItIs: 'An interactive slider console allowing real-time adjustments to monthly earned income and operational living expenses.',
    whatItDoes: 'Adjust income shifts (e.g. raises, freelance) and expense shocks (e.g. rent increase) with immediate mathematical recalculation.',
    highlights: ['Dual Bidirectional Range Sliders', 'Live Currency Feedback', 'One-Click Reset Scenario'],
    durationMs: 5000,
  },
  {
    id: 'sim-projection-section',
    route: '/simulation',
    pageId: 'simulation',
    pageTitle: 'Simulation',
    pageIndex: 7,
    totalPages: 8,
    sectionId: 'simulation-projection',
    sectionIndex: 2,
    totalSectionsInPage: 3,
    badge: 'Downstream Impact',
    title: 'Cash Flow & Health Score Projection Impact',
    subtitle: 'Side-by-Side Baseline vs Projected Variance',
    whatItIs: 'Side-by-side projection cards displaying exact changes in net monthly cash flow and financial health score.',
    whatItDoes: 'Computes immediate downstream impacts on solvency tier without waiting for month-end data.',
    highlights: ['Baseline vs Simulated Cash Flow', 'Projected Health Score Variance', 'Instant Recalculation Engine'],
    durationMs: 5000,
  },
  {
    id: 'sim-goals-section',
    route: '/simulation',
    pageId: 'simulation',
    pageTitle: 'Simulation',
    pageIndex: 7,
    totalPages: 8,
    sectionId: 'simulation-goals',
    sectionIndex: 3,
    totalSectionsInPage: 3,
    badge: 'Milestone Feasibility',
    title: 'Goal Timeline Sensitivity & Milestone Impact',
    subtitle: 'Recalculated Target Completion Dates',
    whatItIs: 'Real-time goal sensitivity matrix demonstrating how changes in cash flow accelerate or delay your life milestones.',
    whatItDoes: 'Shows the exact month and year each savings goal will be achieved under the simulated scenario.',
    highlights: ['Timeline Acceleration / Delay', 'Dynamic Milestone Sensitivity', 'Feasibility Status Transitions'],
    durationMs: 5000,
  },

  // ─── 8. AI COACH PAGE (2 SECTIONS) ───────────────────────────────
  {
    id: 'coach-header-section',
    route: '/ai-coach',
    pageId: 'ai-coach',
    pageTitle: 'AI Coach',
    pageIndex: 8,
    totalPages: 8,
    sectionId: 'ai-coach-header',
    sectionIndex: 1,
    totalSectionsInPage: 2,
    badge: 'Zero-Hallucination AI',
    title: 'AI Coach Architecture & Provider Switcher',
    subtitle: 'AES-256 Client Encryption Supporting Groq & OpenAI',
    whatItIs: 'Executive controls and model configuration for the privacy-first financial intelligence engine.',
    whatItDoes: 'Connects to high-speed LLM models with your encrypted API keys, maintaining zero server storage of personal credentials.',
    highlights: ['Client AES-256 Key Encryption', 'Groq & OpenAI Multi-Provider Support', 'Configurable High-Speed Models'],
    durationMs: 5000,
  },
  {
    id: 'coach-chat-section',
    route: '/ai-coach',
    pageId: 'ai-coach',
    pageTitle: 'AI Coach',
    pageIndex: 8,
    totalPages: 8,
    sectionId: 'ai-coach-chat',
    sectionIndex: 2,
    totalSectionsInPage: 2,
    badge: 'Context Grounding',
    title: 'Grounded Conversational Streaming Advisor',
    subtitle: 'Real-Time SSE Streaming with Verified Financial Context',
    whatItIs: 'An intelligent financial advisor operating with strict context grounding in your deterministically verified metrics.',
    whatItDoes: 'Streams advice in markdown, utilizing live cash flow, expense categories, health score, and active currency.',
    highlights: ['Grounded in Verified User Metrics', 'Real-Time SSE Markdown Streaming', 'Context-Aware Prompt Suggestions', 'Zero Float Hallucinations'],
    durationMs: 5000,
  },
];

interface DemoTourState {
  isActive: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  isMinimized: boolean;
  currentStepIndex: number;
  stepProgress: number; // 0 to 100
  playbackSpeed: number; // 1, 1.5, 2
  startTour: (initialStep?: number) => void;
  pauseTour: () => void;
  resumeTour: () => void;
  togglePlayPause: () => void;
  nextStep: () => void;
  prevStep: () => void;
  nextPage: () => void;
  prevPage: () => void;
  goToStep: (index: number) => void;
  stopTour: () => void;
  restartTour: () => void;
  setMinimized: (minimized: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setStepProgress: (progress: number) => void;
}

export const useDemoTourStore = create<DemoTourState>((set, get) => ({
  isActive: false,
  isPlaying: false,
  isPaused: false,
  isCompleted: false,
  isMinimized: false,
  currentStepIndex: 0,
  stepProgress: 0,
  playbackSpeed: 1,

  startTour: (initialStep = 0) => {
    set({
      isActive: true,
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
      isMinimized: false,
      currentStepIndex: Math.max(0, Math.min(DEMO_TOUR_STEPS.length - 1, initialStep)),
      stepProgress: 0,
    });
  },

  pauseTour: () => {
    set({ isPlaying: false, isPaused: true });
  },

  resumeTour: () => {
    set({ isPlaying: true, isPaused: false });
  },

  togglePlayPause: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      set({ isPlaying: false, isPaused: true });
    } else {
      set({ isPlaying: true, isPaused: false });
    }
  },

  nextStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex < DEMO_TOUR_STEPS.length - 1) {
      set({
        currentStepIndex: currentStepIndex + 1,
        stepProgress: 0,
      });
    } else {
      // Completed all steps
      set({
        isPlaying: false,
        isCompleted: true,
        stepProgress: 100,
      });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({
        currentStepIndex: currentStepIndex - 1,
        stepProgress: 0,
        isCompleted: false,
      });
    }
  },

  nextPage: () => {
    const { currentStepIndex } = get();
    const currentStep = DEMO_TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    // Find the first step of the next page
    const nextPageIndex = currentStep.pageIndex + 1;
    const targetIdx = DEMO_TOUR_STEPS.findIndex(s => s.pageIndex === nextPageIndex);
    if (targetIdx !== -1) {
      set({
        currentStepIndex: targetIdx,
        stepProgress: 0,
      });
    } else {
      set({
        isPlaying: false,
        isCompleted: true,
        stepProgress: 100,
      });
    }
  },

  prevPage: () => {
    const { currentStepIndex } = get();
    const currentStep = DEMO_TOUR_STEPS[currentStepIndex];
    if (!currentStep) return;

    // Find the first step of the previous page
    const prevPageIndex = currentStep.pageIndex - 1;
    if (prevPageIndex >= 1) {
      const targetIdx = DEMO_TOUR_STEPS.findIndex(s => s.pageIndex === prevPageIndex);
      if (targetIdx !== -1) {
        set({
          currentStepIndex: targetIdx,
          stepProgress: 0,
          isCompleted: false,
        });
      }
    }
  },

  goToStep: (index: number) => {
    if (index >= 0 && index < DEMO_TOUR_STEPS.length) {
      set({
        currentStepIndex: index,
        stepProgress: 0,
        isCompleted: false,
      });
    }
  },

  stopTour: () => {
    set({
      isActive: false,
      isPlaying: false,
      isPaused: false,
      isCompleted: false,
      stepProgress: 0,
    });
  },

  restartTour: () => {
    set({
      isActive: true,
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
      isMinimized: false,
      currentStepIndex: 0,
      stepProgress: 0,
    });
  },

  setMinimized: (minimized: boolean) => {
    set({ isMinimized: minimized });
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },

  setStepProgress: (progress: number) => {
    set({ stepProgress: Math.max(0, Math.min(100, progress)) });
  },
}));
