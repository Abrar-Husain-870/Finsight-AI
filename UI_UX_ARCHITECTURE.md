# FinSight — UI/UX Architecture & App Flow Document

> **Purpose:** This document is the canonical reference for understanding the current UI/UX structure of FinSight before a redesign. It records every screen, layout, component, interaction pattern, data flow, and design inconsistency, based on direct source-code inspection. No code was modified to produce this document.

---

## Table of Contents

1. [Application Overview](#1-application-overview)
2. [Technology Stack](#2-technology-stack)
3. [Layout System](#3-layout-system)
4. [Design Token System](#4-design-token-system)
5. [Routing & Navigation Architecture](#5-routing--navigation-architecture)
6. [Screen / Page Inventory](#6-screen--page-inventory)
7. [Global UI Component Inventory](#7-global-ui-component-inventory)
8. [Feature-Level Component Inventory](#8-feature-level-component-inventory)
9. [State Management Architecture](#9-state-management-architecture)
10. [User Flows](#10-user-flows)
11. [Interaction Patterns & Micro-Animations](#11-interaction-patterns--micro-animations)
12. [Accessibility Audit](#12-accessibility-audit)
13. [Responsive / Mobile Behavior](#13-responsive--mobile-behavior)
14. [Design Inconsistencies & Redesign Notes](#14-design-inconsistencies--redesign-notes)
15. [Backend API Surface (Frontend-Facing)](#15-backend-api-surface-frontend-facing)

---

## 1. Application Overview

**FinSight** is an AI-based Personal Finance Manager SPA built with React. It provides deterministic financial analytics, health scoring, goal planning, a CSV import pipeline, an interactive financial simulation tool, and an AI chat coach backed by configurable LLM providers (Groq, OpenAI, or custom OpenAI-compatible).

The application is structured for a single authenticated user per session. The entire authenticated area lives inside a persistent sidebar + header shell. All data is prefetched and cached via React Query with stale-while-revalidate semantics.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (SPA, Vite-based) |
| Routing | `react-router-dom` v6 |
| Styling | Tailwind CSS v4 (custom `@theme` tokens) |
| Animations | `framer-motion` (page transitions, micro-interactions) |
| Server State | `@tanstack/react-query` |
| Client State | `zustand` (auth store, ui store) |
| Form Handling | `react-hook-form` + `zod` (via `@hookform/resolvers/zod`) |
| Type Sharing | `@finsight/shared` (monorepo package) |
| Icons | `lucide-react` |
| Charts | Custom SVG charts (no third-party chart library) |
| Toast/Notifications | `sonner` |
| Markdown rendering | `react-markdown` (in AI Coach) |
| CSV parsing | `papaparse` (in Import) |
| File drop | `react-dropzone` (in Import) |
| Font | Inter (sans), JetBrains Mono (mono) |

---

## 3. Layout System

Two layout trees exist in the application. They are completely separate.

### 3.1 AuthLayout — Unauthenticated

**File:** `frontend/src/components/layout/AuthLayout.tsx`

```
<div min-h-screen flex items-center justify-center bg-primary>
  ── Ambient glow blobs (top-left: green/5%, bottom-right: amber/5%)
  <div max-w-md centered>
    ── Logo block: black square + "FinSight" wordmark
    <div card (rounded-2xl, shadow-dropdown, bordered)>
      <Outlet />     <- LoginPage or RegisterPage renders here
    </div>
  </div>
</div>
```

**Visual Notes:**
- Full-page centered layout, no sidebar or header
- Background has two soft ambient blurs (green top-left, amber bottom-right) at `blur-[120px]` — purely decorative
- Logo is a plain black square (`h-8 w-8 rounded-lg bg-accent-primary`) beside "FinSight" text
- The card uses `--shadow-dropdown` elevation and `--radius-2xl`

---

### 3.2 AppShell — Authenticated

**File:** `frontend/src/components/layout/AppShell.tsx`

```
<div min-h-screen bg-primary>
  ── [Skip to main content] link (sr-only, accessible)
  <Sidebar />           <- Fixed left, 288px wide (lg:w-72), hidden on mobile
  <div lg:pl-72 flex flex-col min-h-screen>
    <Header />          <- Sticky top, h-16, backdrop-blur
    <main flex-1>
      <div px-4..8 py-8 max-w-7xl mx-auto>
        <AnimatePresence mode="wait">
          <motion.div key="{pathname}-{currency}">
            <Outlet />  <- Page content renders here
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
    <KeyboardShortcutsDialog />
    <AboutModal />
  </div>
</div>
```

**Visual Notes:**
- Page content is constrained to `max-w-7xl` within the shell container
- Each navigation change triggers a `motion.div` fade/slide animation keyed on `pathname + currency`
- `data-presentation` attribute on root div enables Presentation Mode styling

---

### 3.3 Sidebar

**File:** `frontend/src/components/layout/Sidebar.tsx`

- Width: 288px (`lg:w-72`), fixed position, visible only on `lg+`
- Background: `--color-bg-secondary`, right border
- Logo at top: "FinSight" wordmark in `text-xl font-bold`
- **Navigation links** (9 items): animated active indicator via `framer-motion`'s `layoutId="sidebar-active"` spring animation — creates a "sliding pill" effect between active items
- Route prefetching on `onMouseEnter` for lazy-loaded pages
- **Bottom controls** (`SidebarBottomControls.tsx`):
  - Load Demo Workspace (with amber-tinted inline confirmation)
  - Presentation Mode toggle (blue-tinted when active)
  - About FinSight (opens `AboutModal`)

**Navigation Items:**

| Label | Route | Icon | Load Strategy |
|---|---|---|---|
| Dashboard | `/` | `Home` | Eager |
| Transactions | `/transactions` | `Receipt` | Eager |
| Analytics | `/analytics` | `PieChart` | Lazy |
| Financial Health | `/health` | `Activity` | Lazy |
| Goals | `/goals` | `Target` | Lazy |
| Import | `/import` | `Upload` | Lazy |
| Simulation | `/simulation` | `Calculator` | Lazy |
| AI Coach | `/ai-coach` | `Bot` | Lazy |
| Settings | `/settings` | `Settings` | Lazy |

---

### 3.4 Header

**File:** `frontend/src/components/layout/Header.tsx`

- Sticky top, height: `h-16`
- Background: `bg-primary/80 backdrop-blur-md` — glassmorphism effect
- Left side: empty flex container (placeholder for future global search)
- Right side:
  - **Theme toggle**: Moon/Sun icon button with animated swap (rotate + fade via `AnimatePresence`)
  - **Separator**: vertical 1px line
  - **Profile dropdown**: Avatar (photo if Google OAuth, else initial letter in `h-8 w-8 rounded-full bg-blue-100`), chevron indicator, animated dropdown on click

**Profile Dropdown contents:**
1. User name + email header (read-only)
2. "Your Profile" link → `/settings`
3. "Settings" link → `/settings`
4. "Sign out" button (red, calls `authApi.logout()` then clears Zustand state)

---

## 4. Design Token System

**File:** `frontend/src/styles/tokens/variables.css`

Tokens are defined inside a `@theme` block (Tailwind v4 pattern) and override per `.dark` class.

### 4.1 Color Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg-primary` | `#ffffff` | `#0a0a0a` | Page background, cards |
| `--color-bg-secondary` | `#fafafa` | `#111111` | Sidebar, hover states, input backgrounds |
| `--color-text-primary` | `#111827` | `#f3f4f6` | Headlines, body text |
| `--color-text-secondary` | `#6b7280` | `#9ca3af` | Labels, captions, secondary info |
| `--color-accent-primary` | `#000000` | `#ffffff` | Primary CTA buttons, active states |
| `--color-accent-secondary` | `#374151` | `#d1d5db` | Hover on accent buttons |
| `--color-border-primary` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.1)` | All borders, dividers |
| `--color-border-focus` | `#000000` | `#ffffff` | Focus rings |
| `--color-success` | `#059669` | (unchanged) | Positive cash flow, income, health good |
| `--color-warning` | `#d97706` | (unchanged) | Caution states, amber alerts |
| `--color-danger` | `#dc2626` | (unchanged) | Errors, delete, negative flow |

**Chart Colors** (5 sequential, oklch-based):
- `--chart-1` through `--chart-5` — distinct colors for pie/donut slices and area charts

### 4.2 Typography

| Token | Value |
|---|---|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'SF Mono', monospace` |

### 4.3 Spacing Tokens

| Token | Value | Usage |
|---|---|---|
| `--spacing-container` | `2.5rem` | Outer page padding |
| `--spacing-widget` | `2rem` | Widget internal padding |

### 4.4 Border Radii

| Token | Value |
|---|---|
| `--radius-sm` | `0.375rem` |
| `--radius-md` | `0.5rem` |
| `--radius-lg` | `0.75rem` |
| `--radius-xl` | `1.25rem` |
| `--radius-2xl` | `1.75rem` |

### 4.5 Shadow / Elevation System

Inspired by Stripe/Linear. Layered multi-shadow with tiny opacity values:

| Token | Usage |
|---|---|
| `--shadow-sm` | Nav active pill, small chrome |
| `--shadow-md` | Elevated elements |
| `--shadow-lg` | Modals, overlays |
| `--shadow-xl` | Full-screen dialogs |
| `--shadow-card` | Default card shadow |
| `--shadow-card-hover` | Card hover state shadow |
| `--shadow-dropdown` | Dropdowns, auth modal |
| `--shadow-drawer` | Right-side drawer panels |

### 4.6 Animation Easing

| Token | Curve |
|---|---|
| `--ease-spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` |

---

## 5. Routing & Navigation Architecture

**File:** `frontend/src/App.tsx`

```
App
├── AppProviders (QueryProvider, AuthProvider, ThemeProvider)
│   └── SystemBanners (fixed, above everything)
│       └── BrowserRouter
│           └── Routes
│               ├── GuestGuard > AuthLayout
│               │   ├── /login        → LoginPage (eager)
│               │   └── /register     → RegisterPage (eager)
│               ├── /auth/success     → OAuthSuccessPage (eager, GuestGuard only)
│               └── AuthGuard > AppShell
│                   ├── /             → DashboardPage (eager)
│                   ├── /transactions → TransactionsPage (eager)
│                   ├── /import       → ImportPage (Suspense lazy)
│                   ├── /analytics    → AnalyticsPage (Suspense lazy)
│                   ├── /health       → HealthPage (Suspense lazy)
│                   ├── /goals        → GoalsPage (Suspense lazy)
│                   ├── /simulation   → SimulationPage (Suspense lazy)
│                   ├── /ai-coach     → AiCoachPage (Suspense lazy)
│                   ├── /settings     → SettingsPage (Suspense lazy)
│                   └── *             → NotFoundPage (eager)
```

**Guards:**
- `AuthGuard`: If user is not authenticated, redirects to `/login`
- `GuestGuard`: If user IS authenticated, redirects to `/`

**Lazy Loading Pattern:** All pages except Dashboard, Transactions, and auth pages are code-split with `React.lazy()` and wrapped in `<React.Suspense>` with a pulsing text fallback (e.g. "Loading Analytics...").

**Route Prefetching:** On sidebar link hover, the corresponding lazy chunk is `import()`-ed to reduce first-load latency.

**Page Transition:** All page content is wrapped in `<AnimatePresence mode="wait">` → `<motion.div>` keyed by `pathname + currency`. Transition uses `pageTransitionVariants` (defined in `lib/motion.ts`).

---

## 6. Screen / Page Inventory

### 6.1 Login Page (`/login`)

**File:** `pages/auth/LoginPage.tsx`

**Layout:** Centered card inside `AuthLayout`

**Sections:**
1. Heading: "Welcome back" + link to `/register`
2. `LoginForm` — email/password inputs with validation
3. "Login as Demo User" button — calls `authApi.demoLogin()`, sets auth, navigates to `/`
4. Divider: "OR"
5. `GoogleLoginButton` — redirects to Google OAuth flow

**States:** Normal | Loading (demo login in progress) | Form validation errors inline

---

### 6.2 Register Page (`/register`)

**File:** `pages/auth/RegisterPage.tsx`

**Layout:** Centered card inside `AuthLayout`

**Sections:**
1. Heading: "Create an account" + link to `/login`
2. `RegisterForm` — name, email, password, confirm password
3. Divider: "OR"
4. `GoogleLoginButton`
5. Terms of Service / Privacy Policy disclaimer (text only — no links)

---

### 6.3 OAuth Success Page (`/auth/success`)

**File:** `pages/auth/OAuthSuccessPage.tsx`

**Purpose:** Landing page after Google OAuth redirect. Reads `?token=` query param, calls `authApi.getMe()`, sets auth state, redirects to `/`.

**Displayed UI:** `SessionLoader` — a full-screen loading indicator.

---

### 6.4 Dashboard (`/`)

**File:** `pages/DashboardPage.tsx`

**Two top-level states:**

#### State A: Empty (no transactions)
Renders `DashboardOnboarding` — a centered CTA grid:
- 4 action cards (Import Transactions, Create First Goal, Configure AI Coach, Load Demo Workspace)
- Each card has a colored icon box, heading with animated arrow, and description
- Cards border-highlight on hover (emerald, purple, blue, amber respectively)

#### State B: Data present
**Hero Section (top):**
- Label: "Net Cash Flow" (small uppercase)
- Large hero number: `text-[64px] sm:text-[88px] font-bold tracking-tighter` — displays net cash flow
- Color changes to `--color-danger` if negative
- Micro-stats row below hero number: Income | Expenses | Savings (center-aligned flex)

**Charts Grid** (`lg:grid-cols-3`):
- 2/3 col: `WidgetContainer "Cash Flow Trend"` → `MonthlyTrendChart` (area chart)
- 1/3 col: `WidgetContainer "Expense Breakdown"` → `CategoryDonutChart` (donut chart)

**Recent Transactions** (full-width):
- `WidgetContainer "Recent Transactions"` with "View all →" link action
- → `RecentTransactionsWidget` (compact list of most recent transactions)

**Loading state:** Animated `animate-pulse` gray boxes at correct dimensions per widget

**Error state:** Full `ErrorState` component with retry button

**Data Source:** `useDashboardSummary()` → `GET /api/dashboard/summary`

---

### 6.5 Transactions (`/transactions`)

**File:** `pages/transactions/TransactionsPage.tsx`

**Layout:** Full flex-column, no additional max-width constraint

**Sections:**
1. **Page header bar:**
   - Left: "Transactions" h1 + subtitle
   - Right: `SearchBar` (debounced merchant search, 500ms) + "New" button (accent)

2. **Content area:**
   - Bordered rounded-xl container
   - `TransactionTable` (scrollable inner)
   - `Pagination` (fixed bottom of container)

3. **Overlays:**
   - `TransactionDrawer` — right-side drawer (create or edit mode)
   - `DeleteConfirmationDialog` — modal dialog

**Filters:** page, limit=15, sortBy=date, sortOrder=desc, merchant (debounced text search)

**Keyboard Shortcuts:**
- `n` — Open new transaction drawer
- `/` — Focus search bar

**Data Source:** `useTransactions(filters)` → `GET /api/transactions` (paginated)

---

### 6.6 Analytics (`/analytics`)

**File:** `pages/AnalyticsPage.tsx`

**Layout:** Max-width `1400px`, centered, `p-6 sm:p-10`, `gap-10`

**Sections:**
1. **Page header:** "Financial Intelligence" h1 + "Deep dive into your financial patterns and velocity."

2. **Insight Cards row:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — one `InsightCardWidget` per AI-generated insight (only shown when insights array is non-empty)

3. **Data Ribbon** (border-y separator):
   - 4 inline metric blocks: Cash Flow (30d), Income, Expenses, Spending Velocity
   - Each has an icon, large `text-3xl` value, and a small `%` trend badge

4. **Charts grid** (`lg:grid-cols-3`):
   - 2/3: `WidgetContainer "Monthly Cash Flow Trends"` → `MonthlyTrendChart`
   - 1/3: `WidgetContainer "Category Breakdown (30d)"` → `CategoryDonutChart`

5. **Bottom grid** (`lg:grid-cols-2`):
   - `WidgetContainer "Top Merchants (30d)"` → `MerchantAnalysisWidget`
   - `WidgetContainer "Largest Transactions (30d)"` → list of `TransactionRow` (read-only)

**Loading state:** Multiple pulse skeletons matching grid layout

**Data Source:** `useAnalyticsSummary()` → `GET /api/analytics/summary`

---

### 6.7 Financial Health (`/health`)

**File:** `pages/HealthPage.tsx`

**Layout:** Max-width `1200px`, centered, `p-6 sm:p-10`, `gap-10`

**Sections:**
1. **Page header:** "Financial Health" h1 + "Your deterministic financial stability score..."

2. **Top row** (`md:grid-cols-3`):
   - 1/3: `ScoreCircle` (large SVG circle, 0-100 score, trend arrow) — centered, with component count text
   - 2/3: `WidgetContainer "Health Trend (Last 6 Months)"` → `HealthTrendChart`

3. **Bottom row** (`md:grid-cols-2`):
   - Left: "Score Breakdown" section + list of `ComponentCard` per health metric
   - Right: "Recommendations" section + list of `RecommendationCard`
   - Special empty state for "Perfect Health": glassmorphism card with gradient + `🎉` emoji

**Data Source:** `useHealthScore()` → `GET /api/health/score`

---

### 6.8 Goals / Financial Planning (`/goals`)

**File:** `pages/GoalsPage.tsx`

**Layout:** Max-width `6xl`, centered, `p-6 sm:p-10`, `gap-10`

**Sections:**
1. **Page header row:**
   - Left: "Financial Planning" h1 + subtitle
   - Right: `Button "+ New Goal"`

2. **Summary bar** (glassmorphism card with `backdrop-blur-sm border/30`):
   - Total Target | Total Saved | Feasibility Indicator (pill badge: FEASIBLE / STRETCH / UNREALISTIC) + Required Monthly

3. **Content grid** (`lg:grid-cols-3`):
   - 2/3: "Your Goals" section → `grid-cols-1 md:grid-cols-2` of `GoalCard`
   - 1/3: "Planning Recommendations" → list of recommendation items (icon type varies by severity text)

4. **Overlay:** `GoalPlanner` — full-screen overlay form for creating/editing goals

**Empty state (no goals):** `EmptyState` with Target icon and "Create Your First Goal" button

**Data Source:** `useGoalSummary()` → `GET /api/goals/summary`

---

### 6.9 Import (`/import`)

**File:** `pages/import/ImportPage.tsx`

**Layout:** Max-width `5xl`, centered, `p-6`

**Header:** "Smart Import" h1 + "Import your bank statements via CSV and categorize them in bulk."

**Content:** `ImportWizard` — a 4-step stateful component:

#### Step 1: UPLOAD
- Full-width dashed-border drag-and-drop zone (`react-dropzone`)
- Accepts `.csv` only, max 1 file
- `UploadCloud` icon + "Upload your CSV" heading

#### Step 2: MAP_COLUMNS
- Card with 4 select dropdowns (Date*, Amount*, Merchant*, Description — optional)
- Options populated from detected CSV column headers
- Back + Next buttons

#### Step 3: PREVIEW
- Header stats: Total | Valid | Duplicates | Errors
- Scrollable table: Date | Merchant | Amount | Category
- Per valid row: `CategoryPicker` dropdown
- Per duplicate row: yellow "Duplicate transaction" badge
- Per invalid row: red error message
- Back + "Complete Import" button

#### Step 4: SUMMARY
- Success panel: green circle icon, import count
- "Import Another File" resets wizard to Step 1

---

### 6.10 Simulation (`/simulation`)

**File:** `pages/SimulationPage.tsx`

**Layout:** Max-width `1200px`, centered — `md:grid-cols-3` (controls left 1/3, results right 2/3)

**Left Panel — Scenario Controls:**
- Glassmorphism card
- **Income Shift** slider: -5000 to +5000, step 50, live formatted value (green/red/gray)
- **Expense Shift** slider: same range, inverted color logic
- "Reset Scenario" button

**Right Panel — Projection Impact:**
- Empty state while pending (pulsing `Calculator` icon)
- After 500ms debounce:
  - 2-col card grid: Cash Flow Impact (Baseline → Projected + diff badge) | Health Score Impact (same structure)
  - Goal Feasibility Shift: full-width card, text labels (FEASIBLE / STRETCH / UNREALISTIC)

**Data Source:** `useRunSimulation()` → `POST /api/simulation/run` (debounced 500ms)

---

### 6.11 AI Coach (`/ai-coach`)

**File:** `pages/AiCoachPage.tsx`

**Layout:** Max-width `1400px`, centered, `p-6 sm:p-10`, `gap-8`

**Sections:**
1. **Page header row:**
   - Left: "AI Financial Coach" h1 + subtitle
   - Right: Config button (red danger if no API key, secondary if configured)

2. **Feature pills:** "Explainable AI" | "Privacy First" | "Deterministic Analytics"

3. **Main content** (flex, `gap-8`):

   **Left session sidebar** (w-64, hidden on mobile):
   - "New Chat" button (black pill icon)
   - "Recent Sessions" list — session titles with active highlight

   **Chat window** (flex-1):
   - **Empty state:** Bot icon + "FinSight Intelligence" heading + 4 quick-prompt buttons in 2×2 grid
   - **Messages:** `AiMessageRow` — user: right-aligned black bubble | assistant: left-aligned white bordered bubble with markdown
   - **Streaming:** animated 3-dot bouncing indicator OR live markdown stream
   - **Input bar:** plain text input + send button with focus-within ring

4. **Config modal** (fixed `inset-0`, `backdrop-blur-md`):
   - Provider select, API Key password field, Model text field
   - Cancel + Save Engine buttons

**Data Sources:** SSE stream via `fetch POST /api/ai/chat` + React Query for config/sessions

---

### 6.12 Settings (`/settings`)

**File:** `pages/SettingsPage.tsx`

**Layout:** Max-width `3xl`, centered, `p-6 sm:p-10`

**Sections:**

1. **Account Information** (`User` icon):
   - Read-only bordered rows: Full Name | Email (with `CheckCircle2` verified) | Preferred Currency (`<select>` inline, 7 options: USD, EUR, GBP, INR, JPY, CAD, AUD)

2. **Appearance** (`Sun` icon):
   - 2-col grid: Light mode card | Dark mode card
   - Active theme: animated `motion.div layoutId="theme-active"` border outline

3. **Danger Zone** (`ShieldAlert` icon, danger styling):
   - "Clear Workspace Data" row + description + `Button variant="danger"`
   - Currently restricted in demo environment

---

### 6.13 Not Found (`*`)

Renders `ErrorState` component with "Page Not Found" title and "Go to Dashboard" button.

---

## 7. Global UI Component Inventory

All in `frontend/src/components/ui/`

### 7.1 `Card`

**Variants:** Standard (padded `p-8`) | No-Padding | Hoverable (lifts on hover with spring: `y: -2, scale: 0.995`)

**Base:** `rounded-[--radius-xl] bg-bg-primary shadow-card`

### 7.2 `Button`

**Variants:** `primary` | `secondary` | `outline` | `ghost` | `danger`
**Sizes:** `sm` | `md` | `lg` | `icon`
**Features:** `isLoading` (shows `Loader2` spinner), disabled state, hover/tap scale via `motion.button`

### 7.3 `Drawer`

Right-side sliding panel (`max-w-md`, spring animation `x: 100% → 0`).
Includes: backdrop overlay, focus trap, Escape key close, body scroll-lock, `aria-modal`

### 7.4 `Input`

Styled text input with error state (red border + ring).

### 7.5 `AmountInput`

Currency-formatted input for transaction amount entry.

### 7.6 `MetricCard`

KPI card: icon (rounded bg) + title + large value + optional trend badge.

### 7.7 `WidgetContainer`

Card chrome with titled header + optional action slot + padded content area. **The most commonly used layout wrapper.**

### 7.8 `EmptyState`

Centered panel (blue icon box, dashed border, 400px min-height) with title, description, and action slots.

### 7.9 `ErrorState`

Like `EmptyState` but danger-themed (red). Supports `onRetry`, countdown timer, `referenceId`.

### 7.10 `Pagination`

Page navigation with prev/next buttons and current/total display.

### 7.11 `Badge`

Small pill label component.

### 7.12 `Skeleton`

Animated `animate-pulse` gray block.

### 7.13 `SystemBanners`

Fixed top overlay (`z-50`):
- Offline banner: red bar with `WifiOff` icon
- System alert banner: triggered by custom DOM event from API interceptors

### 7.14 `AboutModal`

App info modal from sidebar: description, 4 feature cards, presentation features box, "Start Interactive Tour" button.

### 7.15 `KeyboardShortcutsDialog`

Modal showing all registered keyboard shortcuts.

---

### 7.16 Chart Components (Custom SVG — `components/ui/charts/`)

Built entirely without third-party libraries:

| Component | Purpose |
|---|---|
| `AreaChart` / `Area` | SVG area chart with gradient fill |
| `LineChart` / `Line` / `LineChartContext` | SVG line chart with context |
| `PieChart` / `PieSlice` / `PieCenter` / `PieChartContext` | SVG pie/donut chart |
| `ChartTooltip` | Hover tooltip overlay |
| `ChartBrush` / `ChartBrushLayout` | Range selection brush |
| `Grid` | SVG grid lines |
| `Background` | SVG background rect |
| `SegmentHighlight` | Highlighted segment |
| `XAxis` | X-axis labels |

---

## 8. Feature-Level Component Inventory

### 8.1 Auth (`features/auth/`)

| Component | Purpose |
|---|---|
| `AuthGuard` | HOC redirects unauthenticated users to `/login` |
| `GuestGuard` | HOC redirects authenticated users to `/` |
| `SessionLoader` | Full-screen loading spinner for OAuth callback |
| `LoginForm` | Email + Password form |
| `RegisterForm` | Name + Email + Password + Confirm form |
| `PasswordField` | Input with show/hide toggle |
| `GoogleLoginButton` | Triggers Google OAuth redirect |

### 8.2 Dashboard (`features/dashboard/`)

| Component | Purpose |
|---|---|
| `DashboardOnboarding` | First-time user CTA grid |
| `MonthlyTrendChart` | Area chart: Income vs Expenses over months |
| `CategoryDonutChart` | Donut chart: spending by category |
| `RecentTransactionsWidget` | Compact list of most recent transactions |

### 8.3 Transactions (`features/transactions/`)

| Component | Purpose |
|---|---|
| `TransactionTable` | Table header + list of `TransactionRow` |
| `TransactionRow` | Desktop grid row + mobile card (responsive dual layout) |
| `TransactionDrawer` | `Drawer` wrapper containing `TransactionForm` |
| `TransactionForm` | Create/Edit form (amount, category, date, merchant, description, notes) |
| `SearchBar` | Controlled search input with ref forwarding |
| `DeleteConfirmationDialog` | "Are you sure?" modal |

### 8.4 Analytics (`features/analytics/`)

| Component | Purpose |
|---|---|
| `InsightCardWidget` | Single AI-generated financial insight with severity icon |
| `MerchantAnalysisWidget` | Horizontal bar list of top merchants with amounts |

### 8.5 Goals (`features/goals/`)

| Component | Purpose |
|---|---|
| `GoalCard` | Goal summary card with progress ring, amounts, dates |
| `GoalProgressRing` | Small SVG circular progress indicator |
| `GoalPlanner` | Full-screen overlay form for creating/editing goals |

### 8.6 Health (`features/health/`)

| Component | Purpose |
|---|---|
| `ScoreCircle` | Large circular SVG score (0-100) with trend indicator |
| `ComponentCard` | Individual health metric with score progress bar |
| `RecommendationCard` | Actionable recommendation with priority icon |
| `HealthTrendChart` | Line chart: 6-month health score history |

### 8.7 Categories (`features/categories/`)

| Component | Purpose |
|---|---|
| `CategoryPicker` | Searchable tree dropdown for selecting a category |
| `CategoryIcon` | Renders Lucide icon by name string (dynamic lookup) |

### 8.8 Tour (`features/tour/`)

| Hook | Purpose |
|---|---|
| `useProductTour()` | Manages guided interactive product tour |

---

## 9. State Management Architecture

### 9.1 Auth State — Zustand (`features/auth/store/auth.store.ts`)

```typescript
{
  user: { id, name, email, picture?, currency } | null
  accessToken: string | null
  setAuth(user, token): void
  clearAuth(): void
}
```

- Populated by `AuthProvider` on app boot via `authApi.refresh()` (silent token refresh using HTTP-only cookie)
- `accessToken` injected into all axios requests via request interceptor
- On 401 response: interceptor calls refresh, retries original request
- On refresh failure: `clearAuth()` called → user redirected to login

### 9.2 UI State — Zustand (`store/uiStore.ts`)

```typescript
{
  presentationMode: boolean       // sidebar toggle
  setPresentationMode(val): void
  isAboutModalOpen: boolean       // sidebar "About FinSight"
  setAboutModalOpen(val): void
  celebrationTrigger: number      // incremented to fire celebration animation
  triggerCelebration(): void
}
```

### 9.3 Theme State — React Context (`providers/ThemeProvider.tsx`)

- Reads/writes `localStorage` for preference
- Applies `.dark` class to `<html>` element
- Exposes `{ theme, setTheme }` via `useTheme()`

### 9.4 Server State — React Query

All server data is cached via `@tanstack/react-query`:

| Feature | Query Key | Endpoint |
|---|---|---|
| Dashboard | `['dashboard', 'summary']` | `GET /api/dashboard/summary` |
| Transactions | `['transactions', filters]` | `GET /api/transactions` |
| Analytics | `['analytics', 'summary']` | `GET /api/analytics/summary` |
| Health | `['health', 'score']` | `GET /api/health/score` |
| Goals | `['goals', 'summary']` | `GET /api/goals/summary` |
| Categories | `['categories', 'tree']` | `GET /api/categories/tree` |
| AI Config | `['ai', 'config']` | `GET /api/ai/config` |
| AI Sessions | `['ai', 'sessions']` | `GET /api/ai/sessions` |
| AI Session | `['ai', 'session', id]` | `GET /api/ai/sessions/:id` |
| Simulation | mutation | `POST /api/simulation/run` |

---

## 10. User Flows

### 10.1 Authentication Flow

```
New User:
  Visit protected route → AuthGuard → /login
  → RegisterPage → fill form → POST /api/auth/register → auto-login → /
  OR → LoginPage → "Login as Demo User" → /
  OR → LoginPage → Google button → OAuth → /auth/success → /

Returning User (session via HTTP-only cookie):
  App boot → AuthProvider → POST /api/auth/refresh → set token → render app
  If refresh fails → clearAuth → /login
```

### 10.2 First-Time User / Onboarding Flow

```
/ (Dashboard, no data) → DashboardOnboarding
  [Import Transactions]  → /import → ImportWizard
  [Create First Goal]    → /goals → GoalPlanner overlay
  [Configure AI Coach]   → /ai-coach → configOpen=true (modal)
  [Load Demo Workspace]  → POST /api/demo/seed → invalidateAllQueries → reload /
```

### 10.3 Transaction Management Flow

```
/transactions
  → View paginated list (15 per page)
  → Search by merchant (debounced 500ms)
  → [New] or N key → TransactionDrawer opens (empty form)
    → Fill form → POST /api/transactions → toast "Transaction created" → drawer closes
  → Row hover → Edit or Delete icons appear:
    → [Edit] → TransactionDrawer (pre-filled) → PATCH /api/transactions/:id
    → [Delete] → DeleteConfirmationDialog → confirm → DELETE /api/transactions/:id
```

### 10.4 CSV Import Flow

```
/import
  UPLOAD → drag/click → .csv selected → parse headers → MAP_COLUMNS
  MAP_COLUMNS → select column mappings → Next → POST /api/import/preview
  PREVIEW → assign categories per row via CategoryPicker
          → "Complete Import" → POST /api/import/commit
  SUMMARY → show success count → "Import Another File" resets
```

### 10.5 Goal Creation Flow

```
/goals → [New Goal] → GoalPlanner overlay
  → Fill: Name, Target Amount, Current Amount, Target Date, Color
  → POST /api/goals → overlay closes → GoalCard appears
  → Click GoalCard → GoalPlanner opens (pre-filled for edit)
```

### 10.6 Simulation Flow

```
/simulation
  → Page loads → POST /api/simulation/run (0,0) → show baseline
  → Drag Income Shift slider → 500ms debounce → POST → results update live
  → Drag Expense Shift slider → 500ms debounce → POST → results update live
  → [Reset Scenario] → sliders to 0 → recalculate
```

### 10.7 AI Coach Flow

```
/ai-coach
  → If config.hasApiKey = false:
    → Click "Configure Engine" → config modal opens
    → Select provider → enter API key → enter model → Save
    → POST /api/ai/config → modal closes → button becomes "Engine Configured"
  
  → [New Chat] → activeSessionId = undefined, messages = []
  → Empty state shows 4 quick-prompt suggestions
  → Type message OR click suggestion → fill input
  → Submit → fetch POST /api/ai/chat (SSE)
    → session_id event → setActiveSessionId
    → chunk events → streamContent accumulates (live markdown)
    → done → message finalized
  → Previous sessions: click sidebar item → load history
```

---

## 11. Interaction Patterns & Micro-Animations

All animations via **Framer Motion** with `MotionConfig reducedMotion="user"` (respects OS preference).

| Pattern | Implementation | Location |
|---|---|---|
| Page transitions | `AnimatePresence mode="wait"` + `pageTransitionVariants` | AppShell |
| Sidebar active pill | `motion.div layoutId="sidebar-active"` spring slide | Sidebar |
| Theme icon swap | `AnimatePresence` rotate + fade | Header |
| Profile dropdown | `motion.div` scale + fade from top | Header |
| Card hover lift | `whileHover: { y: -2, scale: 0.995 }` spring | Card (hoverable) |
| Button press | `whileHover: {scale: 1.015}` + `whileTap: {scale: 0.97}` | Button |
| Drawer slide | `x: "100%" → 0` spring (stiffness 400, damping 40) | Drawer |
| Transaction row appear | `opacity: 0, y: 5 → 1, 0` fade-in per row | TransactionRow |
| AI message appear | `opacity: 0, y: 10, scale: 0.95 → 1` | AiMessageRow |
| AI typing indicator | 3 dots bouncing `y: [0, -4, 0]` staggered | AiCoachPage |
| Goal card hover | `whileHover: { scale: 1.01 }` | GoalCard |
| Goal achieved glow | Emerald shadow + ring on card | GoalCard |
| Trophy on completion | Spring `scale: 0, rotate: -180 → 1, 0` | GoalCard |
| Settings theme picker | `motion.div layoutId="theme-active"` border | SettingsPage |
| System banner slide | `y: -50 → 0` enter/exit | SystemBanners |
| EmptyState/ErrorState | `staggerItemVariants` fade-in | Shared UI |
| Dashboard onboarding arrow | `opacity/translateX` on group-hover | DashboardOnboarding |

---

## 12. Accessibility Audit

| Feature | Status | Notes |
|---|---|---|
| Skip-to-content link | Implemented | AppShell, sr-only with focus reveal |
| `aria-label` on icon buttons | Implemented | Theme toggle, close buttons, row actions |
| `role="dialog"` + `aria-modal` | Implemented | Drawer, About Modal, Config Modal |
| `aria-labelledby` on dialogs | Implemented | All modal headings linked |
| Focus trap in modals | Implemented | `useFocusTrap` hook on all overlays |
| Escape key to close | Implemented | Drawer, Config Modal, Keyboard dialog |
| `aria-live` for chat | Implemented | `role="log"` on chat, streaming `aria-live="polite"` |
| Keyboard navigation | Implemented | Focus rings using `--color-border-focus` |
| Form validation summary | Implemented | `role="alert"` div focused on error |
| Unsaved changes warning | Implemented | `useUnsavedChanges` hook on TransactionForm |
| Reduced motion | Implemented | `MotionConfig reducedMotion="user"` at app root |

---

## 13. Responsive / Mobile Behavior

| Element | Desktop (lg+) | Mobile |
|---|---|---|
| Sidebar | Fixed left, 288px | **Hidden entirely — no replacement** |
| Header | Full with separator + profile | Same |
| Transaction rows | Desktop grid layout | Card layout (stacked) |
| AI Coach sessions sidebar | Visible (w-64) | Hidden (`hidden md:flex`) |
| Dashboard hero number | `text-[88px]` | `text-[64px]` |
| Analytics data ribbon | Horizontal flex-row | Wraps to vertical |
| Goals summary bar | `md:flex-row` | `flex-col` |
| Import wizard table | Horizontal scrollable | Same |
| Settings sections | Stacked | Same |

> **Critical Gap:** No mobile navigation exists. On mobile, the sidebar is completely hidden and there is no hamburger menu, bottom navigation, or drawer replacement. Mobile users have no way to navigate between pages.

---

## 14. Design Inconsistencies & Redesign Notes

### 14.1 Page Header — No Shared Component

Each page has an independently implemented header. No `<PageHeader>` component exists.

| Page | H1 Size | Description location | Right-side actions |
|---|---|---|---|
| Dashboard | None (hero number instead) | — | — |
| Transactions | `text-2xl font-bold` | Same row | SearchBar + New button |
| Analytics | `text-3xl font-bold` | `mt-1` below | — |
| Health | `text-3xl font-bold` | `mt-1` below | — |
| Goals | `text-3xl font-bold` | `mt-1` below | New Goal button |
| Import | `text-2xl font-bold` | Same row | — |
| Simulation | `text-3xl font-bold` | `mt-1` below | — |
| AI Coach | `text-3xl font-bold` | `mt-1` below | Config button |
| Settings | `text-3xl font-bold` | `mt-2` below | — |

Transactions and Import use `text-2xl` while all others use `text-3xl`.

### 14.2 Max-Width — Inconsistent Per Page

| Page | Max Width |
|---|---|
| Dashboard | `max-w-[1400px]` |
| Analytics | `max-w-[1400px]` |
| AI Coach | `max-w-[1400px]` |
| Health | `max-w-[1200px]` |
| Simulation | `max-w-[1200px]` |
| Goals | `max-w-6xl` (72rem) |
| Transactions | None (full width) |
| Import | `max-w-5xl` (64rem) |
| Settings | `max-w-3xl` (48rem) |

The shell already constrains to `max-w-7xl` — pages re-constrain themselves inconsistently inside it.

### 14.3 Padding — Inconsistent

- Most pages: `p-6 sm:p-10`
- Dashboard: `p-6 sm:p-10` on wrapper + `flex flex-col gap-12`
- Transactions: header `p-6 pb-4` + content `px-6 pb-6` (no outer page wrapper padding)
- Import: `p-6` (no responsive scaling)

### 14.4 Button Implementation — Mixed

- Some pages use the shared `<Button>` component (Goals, Settings, AI Coach config modal)
- Other pages use raw `<button>` with inline Tailwind (ImportWizard "Next"/"Back", Simulation "Reset", Transactions "New" — uses hardcoded `bg-[var(--color-accent-primary)]` instead of `<Button>`)

### 14.5 Card Background Patterns — Multiple Coexisting Styles

1. `WidgetContainer` → `Card (noPadding)` → `bg-bg-primary shadow-card` — standard
2. Goals summary bar → `bg-secondary/30 backdrop-blur-sm border/30` — glassmorphism
3. Simulation controls → same glassmorphism pattern
4. Goals recommendations → `bg-bg-primary shadow-sm border/50` — lighter shadow
5. Health/Goals onboarding → `bg-secondary border` — muted

No unified rule for when to use which card treatment.

### 14.6 Section Headings — Mixed Scales

- `text-lg font-semibold` — Health sections, Goals sections, AI Coach
- `text-sm font-semibold uppercase tracking-wider` — Simulation controls
- No consistent sub-section heading hierarchy

### 14.7 Loading States — Inconsistent

- Dashboard: Inline `animate-pulse` divs per widget
- Analytics: Full loading tree (not matching actual page structure exactly)
- Health/Goals: Simplified loading skeleton tree
- Transactions: Row-level skeletons in table
- AI Coach: Raw text "Loading AI Coach..."

No shared page-level loading skeleton pattern.

### 14.8 Empty States — Inconsistent

- Dashboard empty: Custom `DashboardOnboarding` (rich, beautiful, designed)
- Goals empty: Shared `EmptyState` component
- AI Coach empty: Inline custom JSX (prompt suggestions grid)
- Analytics/Health: No explicit empty state (API returns data or error)

### 14.9 Mobile Navigation — Complete Gap

No mobile navigation mechanism of any kind exists. This is the most critical structural issue.

### 14.10 Global Search — Placeholder Only

Header has a `{/* Global search placeholder */}` comment in the left area. No functionality implemented.

### 14.11 Transaction Page Layout vs Others

Transactions is the only page with no wrapping `max-w-*` constraint. The table feels very wide on large screens compared to other pages which narrow down significantly.

### 14.12 Duplicate Profile Links

The profile dropdown in the Header has both "Your Profile" and "Settings" links — both navigate to `/settings`. These are functionally identical duplicates.

---

## 15. Backend API Surface (Frontend-Facing)

Backend is an Express monolith at `backend/src/features/`. All routes prefixed `/api`.

| Feature | Routes |
|---|---|
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, `/auth/profile` (PATCH), `/auth/demo-login`, `/auth/google`, `/auth/google/callback` |
| Dashboard | `GET /dashboard/summary` |
| Transactions | `GET /transactions` (paginated + filtered), `POST /transactions`, `PATCH /transactions/:id`, `DELETE /transactions/:id` |
| Categories | `GET /categories/tree` |
| Analytics | `GET /analytics/summary` |
| Health | `GET /health/score` |
| Goals | `GET /goals`, `POST /goals`, `PATCH /goals/:id`, `DELETE /goals/:id`, `GET /goals/summary` |
| Import | `POST /import/preview`, `POST /import/commit` |
| Simulation | `POST /simulation/run` |
| AI | `GET /ai/config`, `POST /ai/config`, `GET /ai/sessions`, `GET /ai/sessions/:id`, `POST /ai/chat` (SSE stream) |
| Demo | `POST /demo/seed` |

---

*Document produced by direct source-code inspection. No application code was modified. All file paths reference the `finsight/` monorepo.*
