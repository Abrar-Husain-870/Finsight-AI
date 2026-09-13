import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  Menu,
  FileText,
  LayoutGrid,
  Clock,
  CreditCard,
  Sparkles,
  Bell,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  FileSpreadsheet,
  Activity,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import CardSwap, { Card } from './CardSwap.js';
import { Counter } from './animated-counter.js';

/* ─── Color constants (aligned with black, white, grey, emerald green landing page theme) ─── */
const THEME = {
  bg: '#000000',
  cardBg: '#131313',
  cardBgActive: '#1C1C1C',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorderActive: 'rgba(255, 255, 255, 0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#737373',
  accent: '#FFFFFF',
  accentGreen: '#34D399',
  accentGlow: 'rgba(255, 255, 255, 0.4)',
};

/* ─── Platform items matching authentic FinSight finance modules ─── */
interface PlatformItem {
  id: string;
  icon: React.ElementType;
  title: string;
}

const PLATFORM_ITEMS: PlatformItem[] = [
  { id: 'transactions', icon: CreditCard, title: 'Smart Transactions' },
  { id: 'cashflow', icon: TrendingUp, title: 'Cash Flow Stream' },
  { id: 'coach', icon: Sparkles, title: 'AI Financial Coach' },
  { id: 'health', icon: ShieldCheck, title: 'Health Index (0–100)' },
  { id: 'goals', icon: LayoutGrid, title: 'Savings Goal Vaults' },
  { id: 'simulation', icon: Zap, title: 'What-If Simulations' },
  { id: 'categorization', icon: Layers, title: 'Auto Categorization' },
  { id: 'statement', icon: FileSpreadsheet, title: 'Statement Ingestion' },
];

/* ─── Synchronized Platform Marquee List with Dynamic Position-Locked Highlight ─── */
interface PlatformMarqueeListProps {
  activePlatformIndex: number;
  setActivePlatformIndex: (idx: number) => void;
  reducedMotion?: boolean;
}

function PlatformMarqueeList({
  activePlatformIndex,
  setActivePlatformIndex,
  reducedMotion = false,
}: PlatformMarqueeListProps) {
  const [isHovered, setIsHovered] = useState(false);
  const y = useMotionValue(0);

  const ITEM_HEIGHT = 40;
  const GAP = 6;
  const ITEM_PITCH = ITEM_HEIGHT + GAP; // 46px
  const TOTAL_ITEMS = PLATFORM_ITEMS.length; // 8
  const CYCLE_HEIGHT = TOTAL_ITEMS * ITEM_PITCH; // 368px
  const DURATION_SECONDS = 28; // Slower, relaxed scroll speed
  const SPEED_PX_PER_SEC = CYCLE_HEIGHT / DURATION_SECONDS; // ~13.14 px/s

  const animState = React.useRef({
    currentScroll: 0,
    lastTime: 0,
  });

  useAnimationFrame((time) => {
    if (reducedMotion) return;
    if (animState.current.lastTime === 0) {
      animState.current.lastTime = time;
      return;
    }
    const deltaMs = Math.min(64, time - animState.current.lastTime);
    animState.current.lastTime = time;

    if (!isHovered) {
      animState.current.currentScroll =
        (animState.current.currentScroll + (SPEED_PX_PER_SEC * deltaMs) / 1000) % CYCLE_HEIGHT;

      const scrollY = animState.current.currentScroll;
      y.set(-scrollY);

      // Lock highlighter to whatever item is passing through the upper-center viewport sweet spot (~72px from top)
      const centerItemIdx = Math.floor((scrollY + 72) / ITEM_PITCH) % TOTAL_ITEMS;
      if (centerItemIdx !== activePlatformIndex) {
        setActivePlatformIndex(centerItemIdx);
      }
    }
  });

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[180px] overflow-hidden rounded-xl [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.div
        style={{ y: reducedMotion ? 0 : y }}
        className="flex flex-col gap-1.5"
      >
        {[...PLATFORM_ITEMS, ...PLATFORM_ITEMS, ...PLATFORM_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          const itemSetIndex = idx % TOTAL_ITEMS;
          const isSelected = activePlatformIndex === itemSetIndex;

          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => setActivePlatformIndex(itemSetIndex)}
              className={cn(
                'flex h-[40px] items-center gap-3 rounded-xl border px-3 transition-all duration-300 cursor-pointer select-none shrink-0',
                isSelected
                  ? 'border-white/30 bg-[#1E1E1E] shadow-md shadow-black/50'
                  : 'border-white/[0.06] bg-[#141414] hover:bg-[#181818] hover:border-white/15'
              )}
            >
              <div
                className={cn(
                  'flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg border transition-colors',
                  isSelected
                    ? 'bg-white text-black border-white'
                    : 'bg-[#202020] text-[#737373] border-white/5'
                )}
              >
                <Icon className="h-3.5 w-3.5 stroke-[1.8]" />
              </div>
              <span
                className={cn(
                  'text-xs transition-colors truncate',
                  isSelected
                    ? 'text-[#FFFFFF] font-semibold'
                    : 'text-[#A3A3A3] font-normal'
                )}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Swappable card states with authentic FinSight telemetry and semantic emerald green / red alerts ─── */
interface SwappableAlertState {
  badge: string;
  badgeDotColor?: string;
  badgeBg: string;
  badgeBorder?: string;
  badgeText: string;
  timestamp: string;
  title: string;
  subtitle: string;
  highlightText: string;
  statusText: string;
  statusBg: string;
  statusBorder?: string;
  statusTextColor: string;
  actionText: string;
  route: string;
}

const SWAPPABLE_CARDS: SwappableAlertState[] = [
  {
    badge: '88 Health Score',
    badgeDotColor: '#10B981',
    badgeBg: '#ECFDF5',
    badgeBorder: '#A7F3D0',
    badgeText: '#059669',
    timestamp: 'Updated just now',
    title: 'Financial Health Index',
    subtitle: 'Emergency Buffer & Debt Ratio',
    highlightText: 'Emergency runway covers 5.8 months of living expenses',
    statusText: 'Optimal Range',
    statusBg: '#ECFDF5',
    statusBorder: '#A7F3D0',
    statusTextColor: '#059669',
    actionText: 'View Health',
    route: '/health',
  },
  {
    badge: '77% Milestone',
    badgeDotColor: '#10B981',
    badgeBg: '#ECFDF5',
    badgeBorder: '#A7F3D0',
    badgeText: '#059669',
    timestamp: '2m ago',
    title: 'Emergency Fund Vault',
    subtitle: 'Savings target ₹5,00,000',
    highlightText: '₹3,85,000 saved • On pace to finish in 42 days',
    statusText: 'On Track',
    statusBg: '#ECFDF5',
    statusBorder: '#A7F3D0',
    statusTextColor: '#059669',
    actionText: 'View Goal',
    route: '/goals',
  },
  {
    badge: 'Spending Velocity Alert',
    badgeDotColor: '#EF4444',
    badgeBg: '#FEF2F2',
    badgeBorder: '#FECACA',
    badgeText: '#DC2626',
    timestamp: '12m ago',
    title: 'Dining & Takeout Spike',
    subtitle: 'Anomalous category outflow',
    highlightText: 'Expenses are 28% higher than 30d rolling average',
    statusText: 'Over Budget',
    statusBg: '#FEF2F2',
    statusBorder: '#FECACA',
    statusTextColor: '#DC2626',
    actionText: 'Analyze',
    route: '/analytics',
  },
  {
    badge: 'Recurring Subscription',
    badgeDotColor: '#10B981',
    badgeBg: '#ECFDF5',
    badgeBorder: '#A7F3D0',
    badgeText: '#059669',
    timestamp: 'Due Tomorrow',
    title: 'AWS & Cloud Tools',
    subtitle: 'Auto-detected recurring expense',
    highlightText: 'Upcoming renewal for ₹899 scheduled on HDFC Card',
    statusText: 'Auto Tracked',
    statusBg: '#ECFDF5',
    statusBorder: '#A7F3D0',
    statusTextColor: '#059669',
    actionText: 'Manage',
    route: '/transactions',
  },
];

/* ─── Fluctuating Number Telemetry Component with Physical Rolling Counter ─── */
interface FluctuatingStatProps {
  initial: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
  intervalMs?: number;
  className?: string;
  label?: string;
  fontSize?: number;
}

function FluctuatingStat({
  initial,
  min,
  max,
  step = 1,
  suffix = '',
  prefix = '',
  intervalMs = 5200,
  className = '',
  label,
  fontSize = 17,
}: FluctuatingStatProps) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const jitter = Math.floor(Math.random() * 1600) - 800;
    const delay = Math.max(4500, intervalMs + jitter);

    const timer = setInterval(() => {
      setValue((prev) => {
        const increase = Math.random() > 0.48;
        const delta = increase ? step : -step;
        const next = prev + delta;
        if (next > max) return prev - step;
        if (next < min) return prev + step;
        return next;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [initial, min, max, step, intervalMs]);

  return (
    <div className={cn('flex flex-col', className)}>
      <Counter
        end={value}
        fontSize={fontSize}
        prefix={prefix}
        suffix={suffix}
        className="text-[#FFFFFF] tracking-tight p-0 font-bold"
      />
      {label && (
        <span className="text-[11px] text-[#A3A3A3] mt-0.5 truncate font-normal">
          {label}
        </span>
      )}
    </div>
  );
}

/* ─── Lazy Loading AI Analysis Card Component with Concise Insights ─── */
interface LazyAICardProps {
  activeTrigger?: number;
}

function LazyAICard({ activeTrigger = 0 }: LazyAICardProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, [activeTrigger]);

  return (
    <div
      className="col-span-3 rounded-2xl border p-3.5 space-y-2.5 transition-all duration-300"
      style={{
        backgroundColor: THEME.cardBg,
        borderColor: THEME.cardBorder,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FFFFFF]">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          <span>FinSight AI Reasoning</span>
        </div>
        {isLoading && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Analyzing...
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 py-1 animate-pulse">
          <div className="h-3 w-4/5 rounded bg-white/10" />
          <div className="h-3 w-11/12 rounded bg-white/10" />
          <div className="h-3 w-3/4 rounded bg-white/10" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-1.5 text-[11px] text-[#A3A3A3]"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-emerald-400 font-bold shrink-0 text-[10px]">◇</span>
            <span className="text-[#E5E5E5] truncate font-medium">Inflow velocity: +14.2% vs 30d avg</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-emerald-400 font-bold shrink-0 text-[10px]">◇</span>
            <span className="text-[#E5E5E5] truncate font-medium">Auto-classified 42 txns (99.4% acc)</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-emerald-400 font-bold shrink-0 text-[10px]">◇</span>
            <span className="text-[#E5E5E5] truncate font-medium">Runway buffer protected (5.8 mo)</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Dedicated Intelligence Flow Connector Component ─── */
interface IntelligenceFlowConnectorProps {
  reducedMotion?: boolean;
}

function IntelligenceFlowConnector({ reducedMotion = false }: IntelligenceFlowConnectorProps) {
  const W = 76;
  const H = 480;
  const CX = 38;
  const CY = H / 2; // 240px - THE CENTRAL GEOMETRIC ANCHOR

  const leftFeederStartX = 2;
  const leftFeederPath = `M ${leftFeederStartX} ${CY} L ${CX} ${CY}`;

  const rightEndX = W - 4;
  const rightSpineX = 56;
  const rightSpanY = 160;
  const arrowSize = 4.5;

  const rightUpperPath = `M ${CX} ${CY} C ${CX + 12} ${CY}, ${rightSpineX} ${CY - 25}, ${rightSpineX} ${CY - 50} L ${rightSpineX} ${CY - rightSpanY + 22} C ${rightSpineX} ${CY - rightSpanY}, ${rightEndX - 8} ${CY - rightSpanY}, ${rightEndX} ${CY - rightSpanY}`;
  const rightLowerPath = `M ${CX} ${CY} C ${CX + 12} ${CY}, ${rightSpineX} ${CY + 25}, ${rightSpineX} ${CY + 50} L ${rightSpineX} ${CY + rightSpanY - 22} C ${rightSpineX} ${CY + rightSpanY}, ${rightEndX - 8} ${CY + rightSpanY}, ${rightEndX} ${CY + rightSpanY}`;

  const upperArrow = `M ${rightEndX - arrowSize - 1.5} ${CY - rightSpanY - arrowSize} L ${rightEndX} ${CY - rightSpanY} L ${rightEndX - arrowSize - 1.5} ${CY - rightSpanY + arrowSize}`;
  const lowerArrow = `M ${rightEndX - arrowSize - 1.5} ${CY + rightSpanY - arrowSize} L ${rightEndX} ${CY + rightSpanY} L ${rightEndX - arrowSize - 1.5} ${CY + rightSpanY + arrowSize}`;

  return (
    <div
      className="relative hidden lg:flex w-[56px] sm:w-[68px] lg:w-[76px] self-stretch shrink-0 items-center justify-center pointer-events-none select-none"
      style={{ minHeight: H }}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base Subtle Dotted Track */}
        <path
          d={leftFeederPath}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          strokeLinecap="round"
        />
        <path
          d={rightUpperPath}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rightLowerPath}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.5"
          strokeDasharray="4 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Single Tiny Silver/White Dash Flowing */}
        {!reducedMotion && (
          <>
            <path
              d={leftFeederPath}
              pathLength="100"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="packet-dash-left"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))' }}
            />
            <path
              d={rightUpperPath}
              pathLength="200"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="packet-dash-upper"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))' }}
            />
            <path
              d={rightLowerPath}
              pathLength="200"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="packet-dash-lower"
              style={{ filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))' }}
            />
          </>
        )}

        {/* Directional Arrowheads */}
        <path
          d={upperArrow}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={lowerArrow}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {!reducedMotion && (
          <>
            <path
              d={upperArrow}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="arrowhead-glow-upper"
            />
            <path
              d={lowerArrow}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="arrowhead-glow-lower"
            />
          </>
        )}
      </svg>

      {/* Central Glowing White/Emerald Circular Node */}
      <div
        className="absolute z-20 flex h-4 w-4 sm:h-[18px] sm:w-[18px] items-center justify-center rounded-full pointer-events-none transition-transform duration-300 node-pulse"
        style={{
          left: 'calc(50% - 9px)',
          top: 'calc(50% - 9px)',
          backgroundColor: '#FFFFFF',
          border: '2px solid #000000',
        }}
        title="FinSight Flow Node"
      >
        <svg
          className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-black fill-black"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
    </div>
  );
}

export function IntelligenceFlowSection() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [activePlatformIndex, setActivePlatformIndex] = useState(1);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  return (
    <section
      className="relative w-full overflow-hidden text-[#FFFFFF] border-t border-white/10"
      style={{ backgroundColor: THEME.bg }}
    >
      {/* Pure CSS Animation Styles */}
      <style>{`
        .packet-dash-left {
          stroke-dasharray: 14 300;
          animation: packetLeftFlow 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .packet-dash-upper {
          stroke-dasharray: 18 500;
          animation: packetUpperBranch 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .packet-dash-lower {
          stroke-dasharray: 18 500;
          animation: packetLowerBranch 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .node-pulse {
          animation: nodePacketGlow 3.6s ease-in-out infinite;
        }
        .arrowhead-glow-upper {
          animation: upperArrowGlow 3.6s ease-in-out infinite;
        }
        .arrowhead-glow-lower {
          animation: lowerArrowGlow 3.6s ease-in-out infinite;
        }

        @keyframes packetLeftFlow {
          0% { stroke-dashoffset: 14; opacity: 0; }
          2% { opacity: 1; }
          16% { stroke-dashoffset: -100; opacity: 1; }
          18%, 50% { stroke-dashoffset: 14; opacity: 0; }
          52% { opacity: 1; }
          66% { stroke-dashoffset: -100; opacity: 1; }
          68%, 100% { stroke-dashoffset: 14; opacity: 0; }
        }

        @keyframes packetUpperBranch {
          0%, 16% { stroke-dashoffset: 18; opacity: 0; }
          17% { stroke-dashoffset: 18; opacity: 1; }
          44% { stroke-dashoffset: -200; opacity: 1; }
          46%, 100% { stroke-dashoffset: 18; opacity: 0; }
        }

        @keyframes packetLowerBranch {
          0%, 66% { stroke-dashoffset: 18; opacity: 0; }
          67% { stroke-dashoffset: 18; opacity: 1; }
          94% { stroke-dashoffset: -200; opacity: 1; }
          96%, 100% { stroke-dashoffset: 18; opacity: 0; }
        }

        @keyframes nodePacketGlow {
          0%, 14% { box-shadow: 0 0 6px rgba(255, 255, 255, 0.3); transform: scale(1); }
          17%, 22% { box-shadow: 0 0 16px rgba(255, 255, 255, 0.9), 0 0 28px rgba(52, 211, 153, 0.5); transform: scale(1.08); }
          25%, 64% { box-shadow: 0 0 6px rgba(255, 255, 255, 0.3); transform: scale(1); }
          67%, 72% { box-shadow: 0 0 16px rgba(255, 255, 255, 0.9), 0 0 28px rgba(52, 211, 153, 0.5); transform: scale(1.08); }
          75%, 100% { box-shadow: 0 0 6px rgba(255, 255, 255, 0.3); transform: scale(1); }
        }

        @keyframes upperArrowGlow {
          0%, 40% { opacity: 0; }
          44%, 48% { opacity: 1; }
          54%, 100% { opacity: 0; }
        }

        @keyframes lowerArrowGlow {
          0%, 90% { opacity: 0; }
          94%, 98% { opacity: 1; }
          100% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .packet-dash-left,
          .packet-dash-upper,
          .packet-dash-lower,
          .node-pulse,
          .arrowhead-glow-upper,
          .arrowhead-glow-lower {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle Background Lighting Accent */}
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full blur-[140px] opacity-10 bg-emerald-500/10" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-[400px] w-[400px] rounded-full blur-[120px] opacity-5 bg-white/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">

          {/* ────────────────── LEFT COLUMN: Marketing Copy & CTAs ────────────────── */}
          <div className="flex flex-col justify-center lg:col-span-5 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-neutral-300 uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Intelligence Flow
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                Financial Telemetry That Unifies Your Wealth
              </h2>

              <p className="text-base sm:text-lg leading-relaxed text-[#A3A3A3]">
                FinSight ingests your bank feeds, classifies transactions in real time, and runs continuous health simulations — alerting you to anomalies, forecasting cash flow, and keeping your savings goals on track.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold tracking-tight text-black transition-all duration-200 hover:bg-neutral-200 active:scale-95 cursor-pointer shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold tracking-tight text-white transition-all duration-200 hover:bg-white/10 active:scale-95 cursor-pointer shadow-sm"
                >
                  Explore Demo
                </button>
              </div>
            </motion.div>
          </div>

          {/* ────────────────── RIGHT COLUMN: Full Interactive Pipeline System (Floating Free Canvas) ────────────────── */}
          <div className="relative flex items-center justify-center lg:col-span-7 xl:col-span-7">
            <div className="relative flex w-full max-w-[720px] items-center gap-2 sm:gap-3 justify-center">

              {/* 1. Left Stack: Integrations, Work, Platform (Uniform Width for All) */}
              <div className="flex w-[220px] sm:w-[235px] shrink-0 flex-col justify-center space-y-3 z-10 select-none">
                
                {/* 1A. Integrations (Taller in Height) */}
                <div className="w-full">
                  <div className="px-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#888888] mb-1.5">
                    Integrations
                  </div>
                  <div className="flex w-full items-center gap-3.5 rounded-2xl border border-white/[0.09] bg-[#141414] p-3.5 sm:p-4 transition-all hover:border-white/20 shadow-xs">
                    <div className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10 shadow-xs">
                      <Globe className="h-4.5 w-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-[13px] font-semibold text-[#FFFFFF] leading-snug">Data Feeds</div>
                      <div className="text-[10.5px] text-[#8E8E93] truncate mt-0.5">
                        Plaid · Bank Sync · UPI · CSV
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1B. Work (Taller in Height) */}
                <div className="w-full">
                  <div className="px-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#888888] mb-1.5">
                    Workspace
                  </div>
                  <div className="flex w-full items-center gap-3.5 rounded-2xl border border-white/[0.09] bg-[#141414] p-3.5 sm:p-4 transition-all hover:border-white/20 shadow-xs">
                    <div className="flex h-9 w-9 sm:h-9.5 sm:w-9.5 shrink-0 items-center justify-center rounded-xl bg-white/10 text-neutral-300 border border-white/5 shadow-xs">
                      <Menu className="h-4.5 w-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-[13px] font-semibold text-[#FFFFFF] leading-snug">Financial Core</div>
                      <div className="text-[10.5px] text-[#8E8E93] truncate mt-0.5">
                        Cash Flow · Goals · Health · Scenarios
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1C. Platform with Synchronized Auto-Scrolling List */}
                <div>
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#888888]">
                      Platform
                    </span>
                    <span className="text-[9px] font-medium text-emerald-400 font-mono flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Stream
                    </span>
                  </div>

                  <PlatformMarqueeList
                    activePlatformIndex={activePlatformIndex}
                    setActivePlatformIndex={setActivePlatformIndex}
                    reducedMotion={Boolean(shouldReduceMotion)}
                  />
                </div>

              </div>

              {/* 2. Middle Connector System: Horizontally Mirrored '{ }' Flow Junction */}
              <IntelligenceFlowConnector reducedMotion={Boolean(shouldReduceMotion)} />

              {/* 3. Right Column: Swappable Card (Top) + 7 Grid Cards (Bottom) */}
              <div className="flex flex-1 flex-col justify-center space-y-2.5 sm:space-y-3 min-w-0 z-10">

                {/* 3A. React Bits CardSwap Component (Top Stack) - Themed Dark Luxury FinSight Cards */}
                <div className="relative w-full h-[180px] sm:h-[190px] flex items-center justify-center">
                  <CardSwap
                    width="100%"
                    height="100%"
                    cardDistance={0}
                    verticalDistance={6}
                    swapDirection="horizontal"
                    swapDistance={320}
                    delay={3600}
                    skewAmount={0}
                    easing="elastic"
                    pauseOnHover={false}
                    reducedMotion={Boolean(shouldReduceMotion)}
                    onCardChange={(frontIdx) => {
                      setActiveCardIndex(frontIdx);
                    }}
                  >
                    {SWAPPABLE_CARDS.map((alert) => (
                      <Card
                        key={alert.title}
                        className="rounded-3xl p-4 sm:p-5 shadow-2xl bg-[#FFFFFF] border border-[#E5E7EB] text-neutral-900 select-none flex flex-col justify-between cursor-pointer"
                      >
                        {/* Top Row: Pill Badge & Timestamp */}
                        <div className="flex items-center justify-between">
                          <div
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border"
                            style={{
                              backgroundColor: alert.badgeBg,
                              borderColor: alert.badgeBorder || 'transparent',
                              color: alert.badgeText,
                            }}
                          >
                            {alert.badgeDotColor && (
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: alert.badgeDotColor }}
                              />
                            )}
                            {alert.badge}
                          </div>
                          <span className="text-[11px] font-medium text-neutral-600 bg-[#F3F4F6] px-2 py-0.5 rounded-md border border-[#E5E7EB]/50">
                            {alert.timestamp}
                          </span>
                        </div>

                        {/* Title & Notification Bell Icon */}
                        <div className="flex items-start justify-between gap-2 pt-1">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 leading-snug">
                              {alert.title}
                            </h3>
                            <p className="text-xs text-neutral-500">
                              {alert.subtitle}
                            </p>
                          </div>
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6] text-neutral-800">
                            <Bell className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Middle Detail / Highlight Box */}
                        <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-3.5 py-2 text-xs font-normal text-neutral-700 leading-relaxed truncate text-center">
                          {alert.highlightText}
                        </div>

                        {/* Footer Status Pill & Action Button */}
                        <div className="flex items-center justify-between pt-0.5">
                          <div
                            className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium border"
                            style={{
                              backgroundColor: alert.statusBg,
                              borderColor: alert.statusBorder || 'transparent',
                              color: alert.statusTextColor,
                            }}
                          >
                            {alert.statusText}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(alert.route);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-black transition-colors cursor-pointer"
                          >
                            <span>{alert.actionText}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>

                {/* 3B. The 7 Grid Cards System */}
                <div className="grid grid-cols-3 gap-2">

                  {/* Card 1: Cash Flow */}
                  <div
                    className="flex flex-col justify-between rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-[#A3A3A3] mb-1.5">
                      Cash Velocity
                    </span>
                    <FluctuatingStat initial={148} min={140} max={162} prefix="₹" suffix="k" label="Monthly Inflow" />
                    <div className="mt-1.5 pt-1.5 border-t border-white/5">
                      <FluctuatingStat initial={52} min={48} max={58} prefix="₹" suffix="k" label="Monthly Outflow" />
                    </div>
                  </div>

                  {/* Card 2: Transactions Ingestion */}
                  <div
                    className="flex flex-col justify-between rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-[#A3A3A3] mb-1.5">
                      Transactions
                    </span>
                    <FluctuatingStat initial={42} min={38} max={48} label="Categorized" />
                    <div className="mt-1.5 pt-1.5 border-t border-white/5">
                      <FluctuatingStat initial={2} min={0} max={4} label="Flagged" />
                    </div>
                  </div>

                  {/* Card 3: Net Margin & Savings Rate */}
                  <div
                    className="flex flex-col justify-between rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-[#A3A3A3] mb-1.5">
                      Net Margin
                    </span>
                    <FluctuatingStat initial={38} min={35} max={42} suffix="%" label="Savings Rate" />
                    <div className="mt-1.5 pt-1.5 border-t border-white/5">
                      <FluctuatingStat initial={96} min={90} max={104} prefix="₹" suffix="k" label="Net Surplus" />
                    </div>
                  </div>

                  {/* Card 4: FinSight AI Reasoning (Middle Full-Width Card with Lazy Loading) */}
                  <LazyAICard activeTrigger={activeCardIndex} />

                  {/* Card 5: Financial Health Score */}
                  <div
                    className="flex flex-col justify-center rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <FluctuatingStat
                      initial={88}
                      min={84}
                      max={92}
                      suffix="/100"
                      label="Health Score"
                    />
                  </div>

                  {/* Card 6: Goal Completion */}
                  <div
                    className="flex flex-col justify-center rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <FluctuatingStat
                      initial={77}
                      min={74}
                      max={80}
                      suffix="%"
                      label="Emergency Goal"
                    />
                  </div>

                  {/* Card 7: Runway Forecast */}
                  <div
                    className="flex flex-col justify-center rounded-xl border p-2.5 transition-colors hover:border-white/20"
                    style={{
                      backgroundColor: THEME.cardBg,
                      borderColor: THEME.cardBorder,
                    }}
                  >
                    <FluctuatingStat
                      initial={24}
                      min={22}
                      max={28}
                      suffix="+ mo"
                      label="Runway Forecast"
                    />
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default IntelligenceFlowSection;
