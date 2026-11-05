import { create } from 'zustand';

export interface TourStep {
  id: string;
  route: string;
  badge: string;
  title: string;
  subtitle: string;
  whatItIs: string;
  whatItDoes: string;
  highlights: string[];
  durationMs?: number; // duration for this step in milliseconds (default 9000ms)
}

export const DEMO_TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard-overview',
    route: '/',
    badge: 'Executive Mission Control',
    title: 'Executive Financial Dashboard',
    subtitle: 'Macro Solvency & Real-Time Cash Velocity',
    whatItIs: 'A unified executive dashboard consolidating liquid net position, monthly cash flow trajectory, savings rate benchmarks, and multi-period financial velocity.',
    whatItDoes: 'Tracks rolling 14-period cash velocity momentum, aggregates verified income against operational living outlays, and provides high-density KPI telemetry with zero precision drift.',
    highlights: [
      'Net Cash Position & Ledger Ribbon',
      '14-Period Velocity Momentum Curve',
      'Performance Overview & Quarterly KPIs',
      'Monthly Inflow vs Outflow Area Spread',
    ],
    durationMs: 10000,
  },
  {
    id: 'expense-discipline',
    route: '/analytics',
    badge: 'Behavioral Economics',
    title: 'Expense Necessity & Discipline Analytics',
    subtitle: 'Subjective Utility & Regret Spend Analysis',
    whatItIs: 'A behavioral economics engine based on subjective 1-to-5 star purchase necessity ratings to evaluate emotional vs rational capital allocation.',
    whatItDoes: 'Distinguishes wise spend (4-5★ essential commitments) from regret spend (1-2★ impulse purchases) over time, measuring category satisfaction to systematically prevent lifestyle creep.',
    highlights: [
      'Regret vs Wise Spending Trajectory',
      'Discipline Split Ratio (Essential vs Discretionary)',
      'Category Satisfaction Ratings (1★-5★)',
      'Behavioral Volume Breakdown Donut',
    ],
    durationMs: 10000,
  },
  {
    id: 'velocity-burn-rate',
    route: '/analytics',
    badge: 'Liquidity & Burn Velocity',
    title: 'Spending Velocity & 20% Benchmark Target',
    subtitle: 'Daily Outflow Pace vs Monthly Budget Ceilings',
    whatItIs: 'A real-time cash drain monitor calculating daily spending velocity pace against monthly budget ceilings and gold-standard savings benchmarks.',
    whatItDoes: 'Calculates daily outflow velocity, tracks actual capital retention against the 20% golden rule target, and plots dual-area earned revenue vs operating expenditure.',
    highlights: [
      'Daily Burn Rate Velocity Pace',
      '20% Savings Benchmark Compliance',
      'Income vs Expense Velocity Spread',
      'Historical Solvency Index Curve',
    ],
    durationMs: 9500,
  },
  {
    id: 'category-deep-dive',
    route: '/analytics',
    badge: 'Counterparty Risk',
    title: 'Vendor Volume & Concentration Risk',
    subtitle: 'Multi-Layer Funnel Exposure & Retailer Deep-Dive',
    whatItIs: 'A granular expenditure decomposition revealing exact capital allocation across parent categories, nested subcategories, and individual counterparties.',
    whatItDoes: 'Identifies single-vendor over-reliance (flagging risk when a vendor exceeds 35% of total spend) and renders a multi-layer funnel chart highlighting exposure across major merchants.',
    highlights: [
      'Parent vs Subcategory Hierarchy',
      'Top Merchant Frequency & Spend Volume',
      'Category Concentration Risk Funnel',
      'Automated Exposure Warnings',
    ],
    durationMs: 9500,
  },
  {
    id: 'health-score',
    route: '/health',
    badge: 'Explainable Rule-Based Model',
    title: 'Deterministic 4-Pillar Financial Health',
    subtitle: 'Mathematical Solvency Scoring (0-100) & Shock Resilience',
    whatItIs: 'An explainable, rule-based diagnostic model evaluating four non-negotiable financial pillars: Solvency, Liquidity Buffer, Debt Burden, and Spending Volatility.',
    whatItDoes: 'Replaces black-box approximations with deterministic formulas, monitors liquid runway months, and stress-tests portfolio survival against 3-month income loss, emergencies, and inflation.',
    highlights: [
      '4-Pillar Transparent Scorecard',
      'Emergency Buffer Runway (Months)',
      'Deterministic Stress-Test Shock Matrix',
      'Core Solvency & Velocity Vitals Grid',
    ],
    durationMs: 10000,
  },
  {
    id: 'goals-engine',
    route: '/goals',
    badge: 'Milestone Feasibility Engine',
    title: 'Dynamic Savings Goals & Feasibility',
    subtitle: 'Mathematically Grounded Capital Target Allocation',
    whatItIs: 'An automated capital accumulation planner that deterministically calculates feasibility for every life objective and wealth target.',
    whatItDoes: 'Compares required monthly savings allocations against actual available surplus cash flow, tagging each goal as ACHIEVABLE, STRETCH, or UNREALISTIC with progress rings.',
    highlights: [
      'Real-Time Feasibility Categorization',
      'Required Monthly Savings Calculation',
      'Interactive Goal Planner Modal',
      'Target Date Milestone Rings',
    ],
    durationMs: 9500,
  },
  {
    id: 'budget-guardrails',
    route: '/budget',
    badge: 'Proactive Guardrails',
    title: 'Category Budgets & Variance Alerts',
    subtitle: 'Enforced Living Expense Ceilings with Warning Thresholds',
    whatItIs: 'A real-time expense boundary manager configured per category with automated pacing indicators and visual progress meters.',
    whatItDoes: 'Monitors actual expenditures against customized monthly target limits with 80-90% warning thresholds, preventing budget exhaustion before month-end surprises occur.',
    highlights: [
      'Category Target Limit vs Actual Spend',
      'Custom Warning Threshold Triggers (75%-90%)',
      'Interactive Budget Allocation Creation',
      'Dynamic Multi-Currency Synchronization',
    ],
    durationMs: 9500,
  },
  {
    id: 'counterfactual-simulation',
    route: '/simulation',
    badge: 'What-If Simulation Engine',
    title: 'Counterfactual Scenario Simulator',
    subtitle: 'Interactive Stress-Testing of Income & Expense Shifts',
    whatItIs: 'A deterministic projection sandbox that stress-tests potential lifestyle changes and income adjustments before committing real capital.',
    whatItDoes: 'Interactively adjust income shifts (e.g. salary raises, bonuses) and expense shocks (e.g. rent increase, car lease) to instantly project downstream impact on net cash flow and health score.',
    highlights: [
      'Interactive Dual Shift Sliders',
      'Baseline vs Projected Variance Impact',
      'Health Score Sensitivity Rating',
      'Immediate Mathematical Recalculation',
    ],
    durationMs: 10000,
  },
  {
    id: 'ai-coach',
    route: '/ai-coach',
    badge: 'Zero-Hallucination AI',
    title: 'Grounded AI Financial Coach',
    subtitle: 'Privacy-First SSE Streaming with User Currency Context',
    whatItIs: 'An intelligent conversational financial advisor operating with zero hallucinations, grounded exclusively in your deterministically verified metrics.',
    whatItDoes: 'Feeds live cash flow, category breakdowns, health scores, and your active currency (USD, INR, EUR, GBP) into an encrypted streaming pipeline providing actionable, markdown-formatted guidance.',
    highlights: [
      'Strict Context Grounding (No Hallucinations)',
      'Real-Time SSE Response Streaming',
      'AES-256 Encrypted API Key Storage',
      'Multi-Provider LLM Engine (Groq, OpenAI)',
    ],
    durationMs: 10000,
  },
  {
    id: 'ledger-and-currencies',
    route: '/transactions',
    badge: 'Global Ledger Engine',
    title: 'Granular Transaction Ledger & Multi-Currency',
    subtitle: 'Audit-Ready Record Register with Instant Global Currency Sync',
    whatItIs: 'A high-performance transaction register featuring search, date filters, bank CSV imports, and synchronized global currency formatting.',
    whatItDoes: 'Stores amounts as exact integer minor units (preventing float drift), captures 1-5 star necessity ratings, and synchronizes dynamically across USD ($), INR (₹), EUR (€), GBP (£), CAD ($), AUD ($), and JPY (¥).',
    highlights: [
      'Audit-Ready CSV Export & Bank Import',
      '1-5 Star Expense Utility Rating Tags',
      'Global Currency Switcher in Settings',
      'Integer Minor-Unit Mathematical Accuracy',
    ],
    durationMs: 10000,
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
    const validStep = Math.max(0, Math.min(initialStep, DEMO_TOUR_STEPS.length - 1));
    set({
      isActive: true,
      isPlaying: true,
      isPaused: false,
      isCompleted: false,
      isMinimized: false,
      currentStepIndex: validStep,
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
        isPaused: false,
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

  goToStep: (index: number) => {
    const validStep = Math.max(0, Math.min(index, DEMO_TOUR_STEPS.length - 1));
    set({
      currentStepIndex: validStep,
      stepProgress: 0,
      isCompleted: false,
    });
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
