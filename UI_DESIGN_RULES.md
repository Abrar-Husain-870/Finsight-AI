# FinSight — UI Design Rules
### The Authoritative Visual Design System

> **Purpose:** This document is the single source of truth for all visual and UX decisions in FinSight. Every future UI change — whether implementing a new component, adapting a prebuilt component, or responding to an AI prompt — must be evaluated against the rules defined here. This file takes precedence over any external component's original styling.
>
> **When to update this file:** Only when a design decision is intentionally changed after deliberate consideration. Never update it passively because an external component brings a different style.

---

## Table of Contents

1. [Design Direction](#1-design-direction)
2. [Colour System](#2-colour-system)
3. [Typography](#3-typography)
4. [Spacing Scale](#4-spacing-scale)
5. [Border Radius](#5-border-radius)
6. [Borders & Shadows](#6-borders--shadows)
7. [Component Design Rules](#7-component-design-rules)
8. [Finance-Specific UI Rules](#8-finance-specific-ui-rules)
9. [Page Layout Rules](#9-page-layout-rules)
10. [Responsive Design Rules](#10-responsive-design-rules)
11. [Interaction & Motion Rules](#11-interaction--motion-rules)
12. [Iconography Rules](#12-iconography-rules)
13. [Accessibility Rules](#13-accessibility-rules)
14. [Rules for Integrating External / Prebuilt UI Components](#14-rules-for-integrating-external--prebuilt-ui-components)
15. [Do Not Introduce List](#15-do-not-introduce-list)
16. [UI Decision Hierarchy](#16-ui-decision-hierarchy)
17. [Pre-Implementation Consistency Checklist](#17-pre-implementation-consistency-checklist)

---

## 1. Design Direction

### 1.1 Core Philosophy

FinSight is a **serious financial application**. Its design language must communicate trustworthiness, clarity, and calm competence. Users are looking at their own money. Every visual decision must serve that context.

The design direction is:

> **Minimal. Modern. Calm. Premium. Trustworthy. Professional.**

### 1.2 Inspiration References

The following products inform the visual restraint and information clarity we aim for:

- **Linear** — structured information hierarchy, clean type, purposeful use of space
- **Cursor / Windsurf** — developer-grade calm, high density without noise
- **Stripe** — trustworthy financial UI, exceptional use of shadows and elevation
- **Modern fintech dashboards** — data-forward, chart-led, minimal chrome

These are **references for restraint and tone**, not blueprints to copy. FinSight has its own product identity.

### 1.3 What This Application Is

- A data-forward analytics application
- A personal financial workspace, used regularly
- A tool for making financial decisions — not a marketing page
- Designed for a single authenticated user in a focused session

### 1.4 What This Application Is Not

- A marketing website
- A consumer e-commerce product
- A colorful mobile app targeting non-technical users
- A product competing on visual novelty

### 1.5 Design Prohibitions

The following design approaches are **prohibited by default**:

| Prohibited | Why |
|---|---|
| Random colour choices | Undermines trust and consistency |
| Excessive gradients | Adds noise, feels unserious |
| Aggressive glassmorphism (heavy blur, coloured panels) | Trendy, not timeless; reduces legibility |
| Multiple competing accent colours | Visual confusion, inconsistent hierarchy |
| Decorative backgrounds | Distracts from financial data |
| Shadows as primary structure device | Creates visual noise at scale |
| Animations with no interaction purpose | Distracts, reduces perceived professionalism |
| Components that look imported from another product | Breaks product cohesion |

Any exception to the above requires an explicit written justification in a code comment or this document.

---

## 2. Colour System

### 2.1 Philosophy

The colour system uses **semantic roles**, not arbitrary values. Every colour decision must trace to a semantic role. No component is permitted to introduce a new colour not defined here without an explicit update to this document.

### 2.2 Core Product Identity & Colour Philosophy

> **Core Rule:** "Warm neutrals define the product identity. Saturated colours are reserved for semantic meaning and functional emphasis."

The application uses the approved **Option C — Warm Sand** theme tokens defined in `frontend/src/styles/tokens/variables.css`.

Four distinct categories of colours are preserved:
1. **Structural UI Colours:** Warm neutrals (`--color-bg-primary`, `--color-bg-secondary`, `--color-text-*`, `--color-border-*`).
2. **Semantic Colours:** Income/success (`#15803d`), warning (`#b45309`), danger/error (`#b91c1c`).
3. **Data Visualisation Colours:** `--chart-1` through `--chart-5`. Chart colours must not leak into generic UI buttons or navigation merely because they exist in the palette.
4. **AI & Functional Emphasis Colours:** Blue (`#1d4ed8`) is used for AI UI, primary interactive links, active focus rings, and primary chart series.

### 2.3 CSS Variables (Warm Sand Theme)

```css
/* Light mode */
--color-bg-primary:        #fdfcfb;           /* Warm cream page/card background */
--color-bg-secondary:      #f7f5f2;           /* Warm sand surface, sidebar, hover */
--color-bg-tertiary:       #eeebe6;           /* Warm stone inner sections */

--color-text-primary:      #1c1917;           /* Warm ink stone-900 */
--color-text-secondary:    #78716c;           /* Warm brown-gray stone-500 */
--color-text-muted:        #a8a29e;           /* Stone-400 disabled/placeholder */

--color-accent-primary:    #1c1917;           /* Warm ink stone-900 primary actions */
--color-accent-primary-foreground: #fdfcfb;   /* Primary button text foreground */
--color-accent-secondary:  #44403c;           /* Stone-700 hover state */
--color-accent-muted:      rgba(28,25,23,0.07);

--color-border-primary:    rgba(28,25,23,0.08); /* Standard subtle warm border */
--color-border-strong:     rgba(28,25,23,0.16); /* Active/selected containers */
--color-border-focus:      #1c1917;           /* Focus ring */

--color-overlay:           rgba(28,25,23,0.5);/* Modal & drawer backdrop overlay */

--color-success:           #15803d;           /* Income, positive, achieved */
--color-warning:           #b45309;           /* Caution, stretch goals */
--color-danger:            #b91c1c;           /* Expenses (contextual), errors, destructive */
--color-danger-foreground: #ffffff;

--color-ai-bg:             #eff6ff;           /* AI assistant bubble / info bg */
--color-ai-accent:         #1d4ed8;           /* AI primary accent & interactive links */
--color-ai-accent-foreground: #ffffff;
--color-ai-muted:          #dbeafe;
```

### 2.4 Semantic Colour Roles

#### Background Roles

| Role | Token | Purpose | Do NOT Use For |
|---|---|---|---|
| Page background | `--color-bg-primary` (`#fdfcfb`) | Full page, cards, modals | Hover backgrounds, secondary surfaces |
| Surface / secondary | `--color-bg-secondary` (`#f7f5f2`) | Sidebar, table row hover, input fill, inner sections | Page background, charts |
| Inner section / tertiary | `--color-bg-tertiary` (`#eeebe6`) | Sub-cards, inner container blocks | Page background |

#### Text Roles

| Role | Token | Use | Do NOT Use For |
|---|---|---|---|
| Primary text | `--color-text-primary` (`#1c1917`) | Headings, body text, labels, data values | Decorative text, subtle placeholders |
| Secondary text | `--color-text-secondary` (`#78716c`) | Subtitles, captions, metadata, timestamps, placeholders | Primary content |
| Muted text | `--color-text-muted` (`#a8a29e`) | Placeholder text, disabled states | Active text |

#### Border Roles

| Role | Token | Use |
|---|---|---|
| Standard border | `--color-border-primary` (`rgba(28,25,23,0.08)`) | All default borders, dividers |
| Focus ring | `--color-border-focus` (`#1c1917` light, `#fbbf24` dark) | Keyboard focus state on interactive elements |
| Strong border | `--color-border-strong` (`rgba(28,25,23,0.16)`) | Active states, selected containers |

#### Accent & Action Roles

| Role | Token | Use | Do NOT Use For |
|---|---|---|---|
| Primary accent | `--color-accent-primary` (`#1c1917` light, `#faf8f5` dark) | Primary buttons, active nav indicator, selected states | Backgrounds of large areas |
| Accent hover | `--color-accent-secondary` (`#44403c` light, `#d6d3d1` dark) | Hover state of primary button | Default state |
| Interactive Links & AI | `--color-ai-accent` (`#1d4ed8` / `#60a5fa`) | AI UI, primary text links, focus highlights | Generic card backgrounds |

#### Semantic / Financial Roles

| Role | Token | Use | Do NOT Use For |
|---|---|---|---|
| Income / Positive | `--color-success` (`#15803d` / `#4ade80`) | Income values, positive cash flow, goals achieved, health score good | All green use — strictly financial/success meaning |
| Warning / Stretch | `--color-warning` (`#b45309` / `#fbbf24`) | Budget at risk, stretch goal feasibility, caution states | Error states |
| Expense / Error / Destructive | `--color-danger` (`#b91c1c` / `#f87171`) | Negative cash flow, error states, delete actions, destructive buttons | All red use — strictly negative financial/error meaning |

### 2.5 Chart Colour Palette

Chart colours are sequential and distinct:

```css
--chart-1: #1d4ed8; /* Ink blue — primary series */
--chart-2: #15803d; /* Forest green — secondary */
--chart-3: #b45309; /* Warm amber */
--chart-4: #6d28d9; /* Deep violet */
--chart-5: #c2410c; /* Burnt orange */
```

Rules:
- Use chart colours **only** inside data visualisations (donut slices, area fills, line series)
- Never use chart colours for generic UI components or button styling
- In dark mode, chart tokens automatically shift to luminous warm-adjusted dark equivalents (`#60a5fa`, `#4ade80`, `#fbbf24`, `#c084fc`, `#fb923c`)

### 2.6 Dark Mode Principles

Dark mode is supported via `.dark` on `<html>`. The dark mode relies on warm dark `#141210` with stone surfaces (`#1c1917`) to maintain the same FinSight design language (warmth, restraint, high legibility) rather than simple mechanically inverted light themes.

Rules:
- Primary buttons in dark mode use warm off-white `#faf8f5` text on `#1c1917` surface, or solid `#faf8f5` background with `#141210` text, ensuring high legibility and cohesive brand identity.
- Never hardcode `dark:` Tailwind overrides with raw non-token hex codes.
- Always consume variables from `variables.css`.
- 1 background colour
- 1 border colour
- 1–2 text colours (primary + secondary)
- 1 accent colour (only if interactive)
- 1 semantic colour (only if conveying financial meaning)

If a component requires more than this, it is likely doing too much visually.

---

## 3. Typography

### 3.1 Fonts

| Font | Token | Purpose |
|---|---|---|
| **Inter** | `--font-sans` | All UI text — headings, body, labels, buttons, navigation |
| **JetBrains Mono** | `--font-mono` | Financial numbers in key contexts (optional), code references |

Inter is the primary and **only** UI font. Do not introduce additional fonts.

JetBrains Mono is used sparingly for `tabular-nums` financial display contexts where alignment across rows is important (e.g. transaction amounts in a table). It is not mandatory — Inter with `tabular-nums` is acceptable.

### 3.2 Heading Hierarchy

| Level | Element | Size | Weight | Tracking | Usage |
|---|---|---|---|---|---|
| Page Title | `h1` | `text-3xl` (30px) | `font-bold` | `tracking-tight` | One per page — the primary page identity |
| Section Title | `h2` / `h3` | `text-lg` (18px) | `font-semibold` | default | Sub-sections within a page |
| Widget Title | `h3` | `text-base`/`text-lg` | `font-medium` | `tracking-tight` | Card/widget headers |
| Sub-section | `h4` | `text-sm` (14px) | `font-semibold` | default | Within cards |

**Rule:** Every page must have exactly one `h1`. Do not skip heading levels. Do not use `h1` in cards or widgets.

**Dashboard Exception:** The Dashboard uses a hero financial number as the primary visual focus, not a traditional `h1`. The hero number (`text-[64px] sm:text-[88px]`) is the only permitted use of this scale.

### 3.3 Body Text

| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Body / Description | `text-sm` (14px) | `font-normal` | `leading-relaxed` | Page subtitles, card descriptions, form helper text |
| Supporting | `text-xs` (12px) | `font-normal` | default | Captions, timestamps, metadata |
| Emphasis | `text-sm` | `font-medium` | default | Important labels, section headers in lists |

### 3.4 Financial Number Typography

Financial numbers require careful typographic treatment based on their visual weight:

| Context | Size | Weight | Additional | Usage |
|---|---|---|---|---|
| Hero metric (dashboard) | `text-[64px]–[88px]` | `font-bold` | `tracking-tighter leading-none` | Net cash flow, primary KPI — one per page max |
| Primary metric | `text-3xl` (30px) | `font-bold` | `tabular-nums tracking-tight` | Analytics data ribbon, goals totals |
| Secondary metric | `text-2xl` (24px) | `font-bold` | `tabular-nums tracking-tight` | Simulation projections |
| Standard value | `text-xl` (20px) | `font-semibold` | `tabular-nums` | Goal cards, component scores |
| Table amount | `text-sm` | `font-semibold` | `tabular-nums` | Transaction rows |
| Small reference | `text-sm`–`text-xs` | `font-medium` | `tabular-nums` | Subtitles under metrics, ranges |

**Critical rules for financial numbers:**
- Always use `tabular-nums` to prevent layout shifting during updates
- Financial values that change sign (positive/negative) must use `--color-success` and `--color-danger` respectively
- Never show a raw negative sign to indicate an expense — communicate semantically via colour and context
- Trend indicators (`+x%` / `-x%`) are always small and secondary relative to the number they describe
- Do not use `font-black` or weights above `font-bold`

### 3.5 UI Text

| Role | Size | Weight | Tracking | Usage |
|---|---|---|---|---|
| Button text | `text-sm` | `font-medium` / `font-semibold` | `tracking-tight` | Primary and secondary buttons |
| Navigation label | `text-sm` | `font-medium` | default | Sidebar links |
| Form label | `text-xs` | `font-semibold` | `tracking-wider uppercase` | Form field labels |
| Badge / pill | `text-xs` | `font-medium` / `font-semibold` | default | Status badges, category pills |
| Table header | `text-xs` | `font-semibold` | default | Column headers |
| Tooltip | `text-xs` | `font-medium` | default | Hover tooltips |

### 3.6 Typography Don'ts

- Do not use font sizes below `text-xs` (10px)
- Do not use more than 3 distinct font sizes on a single card
- Do not use `font-extrabold` or `font-black` in UI
- Do not use italic text except in markdown-rendered AI content
- Do not use all-caps except for form labels and small section markers

---

## 4. Spacing Scale

### 4.1 Base Scale

The application uses Tailwind's 4px base unit spacing system. The following named levels are the **permitted** spacing values:

| Level | Tailwind | px | Usage |
|---|---|---|---|
| `xs` | `gap-1` / `p-1` | 4px | Icon padding, tight badge gaps |
| `sm` | `gap-2` / `p-2` | 8px | Icon-to-text gaps, inline element spacing |
| `md` | `gap-3`–`gap-4` / `p-3`–`p-4` | 12–16px | Component internal padding, form field gaps |
| `lg` | `gap-6` / `p-6` | 24px | Card padding (small), section gaps, page horizontal padding |
| `xl` | `gap-8` / `p-8` | 32px | Card padding (standard), major component gaps |
| `2xl` | `gap-10`–`gap-12` / `p-10`–`p-12` | 40–48px | Page section gaps, between major content areas |
| `3xl` | `gap-16` | 64px | Largest layout gaps, between major page sections |

### 4.2 Spacing Applications

#### Page Padding

- Standard page inner padding: `p-6 sm:p-10` (24px mobile → 40px desktop)
- This should be consistent across all pages (currently inconsistent — fix during redesign)

#### Card Internal Padding

- Standard card: `p-8` (32px) — use for all standard cards
- Compact card: `p-5` or `p-6` — use for dense list items or goal cards
- No-padding card: only when the content defines its own internal padding (e.g. tables)

#### Section Spacing

- Between major page sections: `gap-10` (40px)
- Between widget rows: `gap-8` (32px)
- Between cards in a grid: `gap-6` (24px)

#### Form Spacing

- Between form fields: `gap-6` (24px)
- Between label and input: `gap-1.5` (6px)
- Between input and error: `gap-1` (4px)
- Submit button margin-top: `mt-4` minimum

#### Navigation Spacing

- Sidebar nav item gap: `space-y-1` (4px between items)
- Sidebar nav item padding: `p-2` (8px)
- Sidebar section gap: `gap-y-7` (28px)

#### Chart Spacing

- Chart containers should have no inner padding at the container level — the chart component manages its own internal spacing
- Chart tooltip padding: `px-3 py-2`

### 4.3 Arbitrary Spacing

One-off spacing values (e.g. `mt-[22px]`, `gap-[13px]`) are prohibited. If the scale does not fit, adjust to the nearest permitted value unless there is a documented technical constraint.

---

## 5. Border Radius

### 5.1 Standard Radius Levels

| Level | Token | Value | Used For |
|---|---|---|---|
| **Small** | `--radius-sm` / `rounded-md` | 6px | Form inputs, small inline elements, badges |
| **Medium** | `--radius-md` / `rounded-lg` | 8px | Buttons, dropdown menus, toast notifications, small cards inside larger cards |
| **Large** | `--radius-lg` / `rounded-xl` | 12px | Cards, modals, table containers, transaction rows |
| **Extra Large** | `--radius-xl` / `rounded-2xl` | 20px | Standard `Card` component, major containers |
| **2XL** | `--radius-2xl` / `rounded-[28px]` | 28px | Auth modal, large overlay cards |
| **Full / Pill** | `rounded-full` | 9999px | Avatar circles, tag pills, icon-only buttons, AI message bubbles |

### 5.2 Radius Rules

- Every component uses exactly one radius value from the above scale
- Nested elements use smaller radii than their containers (inner radius = outer radius minus one level)
- Do not mix radius values within a single card (all corners should be the same)
- Do not use arbitrary radius values like `rounded-[14px]` or `rounded-3xl`
- Chart containers: `--radius-xl`
- Modal/dialog: `--radius-xl` or `--radius-2xl`
- Drawer: no radius (full-height edge panel)

---

## 6. Borders & Shadows

### 6.1 Border Philosophy

Borders should communicate **structure**, not decoration. The preferred approach is:

> Use **spacing and background colour contrast** as the primary organisational tool. Reach for borders only when spatial separation is insufficient.

### 6.2 Border Tokens

| Use | CSS | When |
|---|---|---|
| Standard border | `border border-[var(--color-border-primary)]` | Cards, inputs, table containers, dividers |
| Subtle border | `border border-[var(--color-border-primary)]/50` | Inner elements, muted separators |
| Strong border | `border border-[var(--color-border-primary)]/80` | Active/selected containers |
| No border | — | When background contrast is sufficient (e.g. surface on bg-primary) |
| Focus ring | `ring-2 ring-[var(--color-border-focus)]` | Keyboard focus state only |
| Danger border | `border border-[var(--color-danger)]/20` | Danger zone containers |

### 6.3 When to Use Borders

**Use a border when:**
- Separating interactive elements that need clear boundaries (inputs, buttons)
- Defining the edge of a card that sits on the same background colour as its container
- Creating a subtle divider between sections within a card
- Indicating a selected or active state

**Do NOT use borders for:**
- Decorative purposes
- Adding visual weight to elements that already have sufficient spatial separation
- Replacing padding as a way to create visual grouping
- Multiple nested borders creating a "box within box" pattern

### 6.4 Shadow System

Shadows follow a restrained elevation scale. Avoid using `shadow-lg` or `shadow-xl` on standard components — they create visual noise at scale.

| Token | When to Use |
|---|---|
| `--shadow-sm` | Nav active pill, smallest chrome elements |
| `--shadow-card` | Default card elevation — use this for all standard cards |
| `--shadow-card-hover` | Card on hover state only, not the default |
| `--shadow-dropdown` | Dropdown menus, auth card, overlays |
| `--shadow-drawer` | Right-side drawer panel |
| No shadow | Elements inside cards, nav items, table rows |

**Shadow rules:**
- Most cards use `--shadow-card` by default — it is intentionally subtle
- Only hoverable cards transition to `--shadow-card-hover`
- Do not stack shadows (a card inside a card should not add its own shadow)
- Modals and drawers use `--shadow-drawer` or `--shadow-dropdown`
- Never use `shadow-2xl` or Tailwind's built-in large shadow utilities

### 6.5 Background Contrast as Structure

The preferred way to create visual hierarchy is:

```
Page: --color-bg-primary
  ↳ Sidebar: --color-bg-secondary
  ↳ Card on page: --color-bg-primary + --shadow-card
    ↳ Inner section of card: --color-bg-secondary (no shadow, subtle border optional)
```

This layering creates depth through tone rather than elevation.

---

## 7. Component Design Rules

### 7.1 Buttons

**Variants and when to use:**

| Variant | Background | Text | Use | Do NOT Use |
|---|---|---|---|---|
| `primary` | `--color-accent-primary` (black/white) | `--color-bg-primary` | Main action per view (1 per screen area max) | Multiple times in the same card |
| `secondary` | `--color-bg-secondary` | `--color-text-primary` | Secondary actions, cancel, back | Primary action |
| `outline` | transparent + border | `--color-text-primary` | Tertiary actions, alternative paths | When secondary would do |
| `ghost` | transparent | `--color-text-primary` | Low-priority actions, inline | Primary actions |
| `danger` | `--color-danger` | white | Destructive-only actions (delete, clear) | Anything other than destructive |

**Button rules:**
- Use the `<Button>` component. Never write raw `<button>` with inline accent colour styles
- Every interactive button must have visible hover and focus states
- Loading state must show a spinner (`<Loader2>`) — never text change alone
- Disabled state uses `opacity-40` — no other style change
- Button text: concise verb phrases ("Save Changes", "Delete Goal", not "Click here")
- Icon + text: icon on the left, 8px gap (`gap-2`)
- Icon-only buttons must have `aria-label`

**Sizes:**
- `sm` (`h-8 px-4 text-xs`): compact actions in tables, inline secondary
- `md` (`h-10 px-6 text-sm`): default size for all standard buttons
- `lg` (`h-12 px-10 text-base`): primary form submission buttons only
- `icon` (`h-10 w-10`): icon-only square/round buttons

### 7.2 Inputs

- All inputs use the shared `<Input>` component
- Border: `border border-[var(--color-border-primary)]`
- Focus: `ring-2 ring-[var(--color-border-focus)]` + `border-transparent`
- Error state: red border + red ring
- Background: `bg-[var(--color-bg-primary)]`
- Text size: `text-[15px]` — slightly larger than typical sm for legibility
- Do not use `bg-[var(--color-bg-secondary)]` for input backgrounds — inputs should be on primary

**Textarea:** Same rules as inputs, with `resize-none`

**Number / Amount inputs:** Use `<AmountInput>` for currency values. Never use a plain `type="number"` input for money.

**Select:** Must use the same visual treatment as inputs. Avoid browser-default selects where possible; if used, apply consistent styling.

### 7.3 Cards

Three card patterns exist. Use each for its defined purpose:

| Pattern | Component | Shadow | Border | Background | Use For |
|---|---|---|---|---|---|
| Standard card | `<Card>` | `--shadow-card` | `--color-border-primary` | `bg-primary` | Most content containers |
| Widget card | `<WidgetContainer>` | `--shadow-card` | `--color-border-primary` | `bg-primary` | Chart containers, data widgets with titled header |
| Hoverable card | `<Card hoverable>` | `shadow-card → shadow-card-hover` | `--color-border-primary` | `bg-primary` | Clickable list items (goals, sessions) |
| Glassmorphism panel | (inline) | none | `border/30` | `bg-secondary/30 backdrop-blur-sm` | Summary panels, scenario controls — used sparingly |

**Card rules:**
- Never mix card patterns in the same list (all goal cards should be the same variant)
- Do not nest a standard card inside another standard card (creates visual noise)
- Glassmorphism is permitted only for the summary/stat ribbon pattern — not for regular content cards
- Card internal padding: `p-8` standard, `p-5`–`p-6` for compact cards
- All cards use `--radius-xl` (20px)

### 7.4 Tables

- Container: `rounded-xl border border-[var(--color-border-primary)] bg-primary overflow-hidden`
- Header row: `bg-[var(--color-bg-secondary)]`, `text-xs font-semibold text-[var(--color-text-secondary)]`
- Body rows: `hover:bg-[var(--color-bg-secondary)]/40`, `transition-colors`
- Row border: `divide-y divide-[var(--color-border-primary)]`
- Row actions: visible only on group-hover (`opacity-0 group-hover:opacity-100`)
- No zebra striping — hover state is sufficient differentiation

### 7.5 Tabs

- Not currently a standalone component; define when introduced
- Active tab: `text-[var(--color-text-primary)] font-medium` with underline or background indicator
- Inactive tab: `text-[var(--color-text-secondary)]`
- Use tabs for switching content context, not for primary navigation

### 7.6 Badges / Pills

- Background: semantic colour at `/10` opacity
- Text: semantic colour
- Border: semantic colour at `/20` (optional)
- Size: `text-xs font-medium px-2.5 py-1 rounded-full`
- Use for: status (FEASIBLE / STRETCH / UNREALISTIC), category labels, feature tags
- Do not use badges to convey information that should be in text

### 7.7 Tooltips

- Background: `--color-bg-primary` with `--shadow-dropdown`
- Border: `border-[var(--color-border-primary)]`
- Text: `text-xs font-medium`
- Do not use tooltips to hide critical information — all important data must be visible

### 7.8 Modals & Dialogs

- Backdrop: `bg-black/50 backdrop-blur-sm`
- Container: `bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-xl shadow-[var(--shadow-drawer)]`
- Max width: `max-w-md` (standard) or `max-w-2xl` (large info modals like About)
- Header: title + close button, separated from content with `border-b`
- Must have: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap, Escape key close
- Animation: scale + fade from `scale(0.95), opacity(0)` → `scale(1), opacity(1)`

### 7.9 Drawers

- Slides from right: `x: "100%" → 0` spring animation
- Width: `max-w-md` (single column form or detail)
- Background: `--color-bg-primary`
- Border: left border `border-[var(--color-border-primary)]`
- Shadow: `--shadow-drawer`
- No border radius (full-height edge panel)
- Header: title + close button (`rounded-full` close icon)
- Body: `overflow-y-auto p-6`
- Must have: focus trap, Escape key close, backdrop click to close

### 7.10 Alerts / System Banners

- Inline alerts (within page content): `rounded-md bg-[semantic-colour]/5 border border-[semantic-colour]/20 p-4`
- System banners (global top): full-width bar, `py-2`, icon + message, slide in from top
- Do not use alert styling for neutral information — only for success, warning, or error states

### 7.11 Toast Notifications

- Library: `sonner`
- Success: standard sonner success
- Error: standard sonner error
- Info: standard sonner
- Keep messages concise (max 1 line)
- Do not show toasts for routine operations — only for actions the user triggered that need confirmation

### 7.12 Navigation (Sidebar)

- Width: 288px fixed left, visible `lg+` only
- Background: `--color-bg-secondary`
- Right border: `border-r border-[var(--color-border-primary)]`
- Active item: spring `layoutId="sidebar-active"` animated pill (`bg-bg-primary shadow-sm ring-1 ring-border-primary`)
- Inactive item: `text-[var(--color-text-secondary)]`, hover: `text-[var(--color-text-primary)]`
- Icon: `h-6 w-6` Lucide icons
- Item height: implicit through `p-2` padding
- Do not add coloured icons to active states — the animated pill provides sufficient active indication

### 7.13 Page Headers

**This is currently inconsistent across pages. The following is the standardised rule for redesign:**

All pages except Dashboard must use a consistent page header structure:

```
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-[--color-text-primary]">Page Title</h1>
    <p class="text-sm text-[--color-text-secondary] mt-1">Subtitle describing the page purpose.</p>
  </div>
  <!-- Optional: right-side primary action (Button) -->
</div>
```

Rules:
- `text-3xl font-bold tracking-tight` for all page `h1`
- Subtitle always `text-sm text-[--color-text-secondary] mt-1`
- Right-side action: one primary `<Button>` maximum
- Margin below header: `mb-10` to the first content section

### 7.14 Section Headers

Within a page, sections are introduced with:

```
<h2 or h3 class="text-lg font-semibold text-[--color-text-primary]">Section Title</h2>
```

Small uppercase section markers (e.g. in scenario controls):

```
<span class="text-xs font-semibold text-[--color-text-secondary] uppercase tracking-wider">
  Scenario Controls
</span>
```

Never mix these two styles within the same context.

### 7.15 Stat / Metric Cards

The data ribbon pattern (as seen in Analytics):

```
<div class="flex flex-col gap-1 flex-1 min-w-[200px]">
  <div class="flex items-center gap-2 text-sm font-medium text-[--color-text-secondary]">
    <Icon class="h-4 w-4" /> Metric Label
  </div>
  <div class="text-3xl font-bold tabular-nums tracking-tight text-[--color-text-primary]">
    $12,345
  </div>
  <div class="text-xs font-medium mt-1 text-[--color-success]">
    +12.3% <span class="text-[--color-text-secondary] font-normal">vs last 30d</span>
  </div>
</div>
```

This is the standard borderless inline metric pattern. It separates from card-based metrics (which have border + shadow) by living directly in a divider-bounded horizontal row.

### 7.16 Charts

See Section 8.4 for chart-specific rules.

### 7.17 Empty States

The `<EmptyState>` component is the required pattern. Do not create custom empty state designs per page.

Structure: blue icon box (consistent `h-20 w-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20`) + h3 title + description + optional action button.

**Do not:**
- Create decorative full-page empty states with illustrations
- Use the goal completion "Perfect Health" pattern outside its specific context
- Show empty states for filtered results (show a simpler inline message instead)

### 7.18 Loading States

Two permitted patterns:

1. **Skeleton:** Animated `animate-pulse` gray boxes at the approximate shape of the content being loaded. Use `<Skeleton className="h-x w-y" />` from the shared component.

2. **Spinner:** `<Loader2 className="animate-spin" />` for button loading states and small inline loading indicators.

**Do not:**
- Use pulsing full-page grey states that don't match the content shape
- Show loading indicators for operations under 300ms
- Show multiple different loading patterns on the same page

### 7.19 Error States

Use the `<ErrorState>` component. Provide a retry action wherever possible. Do not create custom error states.

---

## 8. Finance-Specific UI Rules

### 8.1 Income

- Income values are displayed in `--color-text-primary` by default (neutral — income is normal)
- When contrasted against expenses, income uses `--color-success` (`#059669`)
- Income trend badges: `+x%` in `--color-success`
- Income category icon: green family, `Trending Up` icon

### 8.2 Expenses

- Expense values are displayed in `--color-text-primary` by default (neutral — spending is normal)
- When the distinction matters (e.g. analytics ribbon, cash flow context), expense uses `--color-danger`
- Expense trend badges: `+x%` (increasing spend) in `--color-danger`, `-x%` (decreasing) in `--color-success`
- Do not make the application feel aggressive or threatening simply because expenses are present
- Only use danger red when expenses are definitively negative to the user (overspending, negative cash flow)

### 8.3 Financial Balances and Totals

- Net positive cash flow: `--color-text-primary` (neutral)
- Net negative cash flow: `--color-danger`
- Large balance displays use the hero number typography (see Section 3.2)
- Currency format: always use the `formatMoney()` utility — never format manually

### 8.4 Charts

#### Container Treatment
- All charts live inside `<WidgetContainer>` with the title above and content inside
- The chart component itself manages its own internal padding
- Chart background: transparent (inherits card background)
- Do not add borders inside the chart area

#### Axis Styling
- Axis labels: `text-xs text-[--color-text-secondary]`
- Grid lines: subtle, `--color-border-primary` at low opacity
- No heavy axis lines — keep the chart feeling open

#### Legends
- Position: inside the widget header area or near the chart, not floating
- Size: `text-xs font-medium`
- Dot/line indicator: small (h-2 w-2 or h-3 w-3 rounded-full)

#### Tooltips
- Background: `--color-bg-primary` + `--shadow-dropdown` + border
- Content: value + label, formatted with `formatMoney()` where monetary

#### Chart Colour Rules
- Use `--chart-1` through `--chart-5` in order
- Do NOT use `--color-success` or `--color-danger` as chart colours unless the data is explicitly semantic (e.g. a chart where one line represents income and one represents expense)
- Do not use more than 5 series without a compelling reason
- Do not fill donut centre with heavy colour — centre text should use `--color-text-primary`

#### Chart Decoration
- No border around the chart itself (container border is sufficient)
- No drop shadow on chart elements
- No animation on initial render (framer-motion page transition covers the entry)
- Brush/zoom controls: use `<ChartBrush>` only when data spans enough time to require it

### 8.5 Goal Progress

- Progress ring: SVG-based `<GoalProgressRing>` — not CSS progress bars
- Goal achieved state: emerald (`green-500`) ring + glow — this is the only decorative visual effect permitted for achievement
- Feasibility badge: uses semantic colours (success/warning/danger at `/10` background)
- Required monthly savings: shown in danger colour only if the goal is flagged UNREALISTIC

### 8.6 Categories

- Each category has an associated icon (Lucide) and a colour class from a preset palette
- Category icons are displayed using `<CategoryIcon>` — do not duplicate this component
- Category representation is consistent: icon + name, always together, never icon alone in contexts where the name provides value
- The `<CategoryPicker>` component is the only permitted category selection UI

### 8.7 AI Insights

- AI-generated insights use the `<InsightCardWidget>` component
- They appear in a grid, styled as regular cards
- AI content does NOT get special background colours (no "AI blue glow" on insight cards)
- The AI interface (`/ai-coach`) is the designated space for AI-specific blue information styling
- On other pages, AI insights must visually match the surrounding card system

### 8.8 Health Score

- The numerical score (0–100) is displayed via `<ScoreCircle>` — a large SVG ring
- Colour should reflect the score level: high → success, medium → warning, low → danger
- The score is never just a number — always accompanied by the ring and trend indicator
- Component cards for breakdown use progress bars (not rings)

---

## 9. Page Layout Rules

### 9.1 Standard Page Anatomy

Every authenticated page must follow this structure:

```
<div class="flex flex-col [page-max-width] mx-auto w-full p-6 sm:p-10 gap-10">
  <!-- Page Header (standardised) -->
  <PageHeader title="..." subtitle="..." action={...} />

  <!-- Section 1 -->
  <!-- Section 2 -->
  <!-- ... -->
</div>
```

### 9.2 Maximum Content Widths

**Standardised during redesign — apply consistently:**

| Page Type | Max Width | Rationale |
|---|---|---|
| Dashboard | `max-w-[1400px]` | Chart-heavy, benefits from width |
| Analytics | `max-w-[1400px]` | Chart-heavy, benefits from width |
| AI Coach | `max-w-[1400px]` | Chat benefits from width |
| Transactions | `max-w-[1200px]` | Table readable at this width |
| Financial Health | `max-w-[1200px]` | Chart + cards balanced |
| Simulation | `max-w-[1200px]` | Two-column control + results |
| Goals | `max-w-[1200px]` | Card grid at comfortable width |
| Import | `max-w-5xl` (64rem) | Wizard steps are form-width |
| Settings | `max-w-3xl` (48rem) | Settings are form-width |
| Not Found / Auth | `max-w-md` | Centered single-column |

The shell already constrains to `max-w-7xl` — these inner widths are consistent sub-constraints.

### 9.3 Grid Patterns

| Layout | Breakpoints | Use |
|---|---|---|
| `grid-cols-1 lg:grid-cols-3` | Full below lg, 3-col at lg | Charts (2/3 + 1/3 split) |
| `grid-cols-1 md:grid-cols-2` | Full below md, 2-col at md | Cards (goals, settings theme) |
| `grid-cols-1 md:grid-cols-3` | Full below md, 3-col at md | Health score layout |
| `grid-cols-1` | Full-width | Tables, wizard steps, settings rows |

Column gap: `gap-8` (32px) standard, `gap-6` (24px) compact.

### 9.4 Dashboard Layout Exception

The dashboard is the only page without a standard `h1` page header. It uses:
- Hero net cash flow number (full-width centered)
- Micro-stats row below
- Charts grid below that

This layout must not be applied to any other page.

### 9.5 Section Spacing

Between major sections within a page: `gap-10` (40px). This is the consistent rhythm.

### 9.6 Sidebar Relationship

- The sidebar is a persistent fixture — never hidden on desktop
- Page content uses `lg:pl-72` (288px) left offset
- Do not render the sidebar inside page components — it is a shell-level concern

---

## 10. Responsive Design Rules

### 10.1 Breakpoints

| Breakpoint | Width | Design Target |
|---|---|---|
| `sm` | 640px | Small tablet / large phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop (primary) |
| `xl` | 1280px | Wide desktop |

### 10.2 Navigation at Each Breakpoint

| Screen | Navigation Pattern |
|---|---|
| Desktop (`lg+`) | Fixed left sidebar, 288px wide |
| Tablet (`md`) | Sidebar hidden — mobile nav required (redesign task) |
| Mobile (`sm-`) | Sidebar hidden — mobile nav required (redesign task) |

> **This is a critical design gap.** When the mobile navigation is introduced during redesign, it must use a bottom navigation bar pattern (not a hamburger overlay), consistent with the application's data-forward nature.

**Mobile navigation must include:** Dashboard, Transactions, Analytics, AI Coach, Settings (the 5 most-used destinations). Secondary pages (Import, Simulation, Goals, Health) accessible from Settings or a "More" tab.

### 10.3 Grid Collapse Rules

- `lg:grid-cols-3` → `md:grid-cols-2` → `grid-cols-1`
- `md:grid-cols-2` → `grid-cols-1`
- Cards never become horizontally scrollable — they always stack vertically

### 10.4 Table Adaptation

- Tables must be horizontally scrollable on mobile: container has `overflow-x-auto`
- On mobile, `<TransactionRow>` switches to card layout (already implemented — maintain this)
- Do not hide essential columns on mobile — instead switch to card layout

### 10.5 Page Padding at Each Breakpoint

- Mobile: `p-4` (16px) horizontal padding
- Tablet: `p-6` (24px)
- Desktop: `p-10` (40px)

Pattern: `px-4 sm:px-6 lg:px-8`

### 10.6 Charts at Mobile

- Charts should resize responsively — no fixed pixel widths
- On mobile, charts should remain legible — consider reducing data density
- The `<ChartBrush>` control should be hidden on mobile

### 10.7 Modal / Drawer at Mobile

- Modals: `w-full max-w-md` with `mx-4` margin — prevent full-screen takeover on phone
- Drawers: on mobile, use `max-w-full` or `80vw` drawer
- Dialogs must not exceed viewport height — internal scroll required

### 10.8 Touch Targets

- All interactive elements: minimum `44px × 44px` touch target
- Row action buttons: `p-2` minimum (`h-8 w-8` minimum)
- Navigation items: minimum `h-12` on mobile

---

## 11. Interaction & Motion Rules

### 11.1 Motion Philosophy

> Motion communicates state and interaction. It does not decorate.

Every animation must answer: *What does this motion communicate to the user?*

Acceptable answers:
- "This content is appearing" (entry animation)
- "This content is leaving" (exit animation)
- "This element is interactive" (hover lift)
- "This is the currently active item" (layout animation between items)
- "This is processing" (spinner)
- "This confirmed a successful action" (brief success state)

Unacceptable answers:
- "It looks cool"
- "Other apps do this"

### 11.2 Motion Duration Guidelines

| Type | Duration | Easing |
|---|---|---|
| Instant feedback (button press) | 100–150ms | ease-out |
| Element appear/disappear | 200ms | ease-out |
| Page transition | 200–300ms | `--ease-out-quart` |
| Drawer slide | spring (stiffness 400, damping 40) | spring |
| Active indicator slide | spring (stiffness 400, damping 30) | spring |
| Tooltip appear | 150ms | ease-out |

Never exceed 400ms for any non-modal animation.

### 11.3 Hover States

- Buttons: scale `1.015` via `whileHover` (already on `<Button>`)
- Hoverable cards: `y: -2, scale: 0.995` spring (already on `<Card hoverable>`)
- Navigation items: colour transition only (`transition-colors 150ms`)
- Table rows: background colour transition only
- Links: colour transition only

Do not apply hover scale to large elements (sections, page containers).

### 11.4 Focus States

- All focusable elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]`
- Do not use `outline: none` without providing a visible alternative
- Focus rings must be visible in both light and dark mode (token handles this)

### 11.5 Active / Pressed States

- Buttons: `whileTap: { scale: 0.97 }` (already on `<Button>`)
- Navigation items: no additional pressed state beyond the active indicator
- Table rows: no pressed state — rows are not interactive triggers

### 11.6 Disabled States

- All disabled elements: `opacity-40`
- `pointer-events-none` on disabled buttons
- Do not change colour or shape — opacity is the only indicator

### 11.7 Loading States in Context

| Context | Pattern |
|---|---|
| Button submitting | `isLoading` prop → spinner inside button |
| Page data loading | Skeleton shapes (approximate content shape) |
| Small inline | `<Loader2 className="animate-spin h-4 w-4">` |
| Full page initial load | Suspense fallback (pulsing text) |

### 11.8 Page Transitions

- Handled by `<AnimatePresence mode="wait">` in `AppShell`
- Uses `pageTransitionVariants` — do not create page-specific transitions
- Transition key: `pathname + currency` (currency change also re-animates)

### 11.9 `MotionConfig`

- `reducedMotion="user"` is set at the app root — all framer-motion animations automatically respect OS preference
- Never bypass this with CSS transitions for decorative animations

---

## 12. Iconography Rules

### 12.1 Icon Library

**Lucide React** is the only permitted icon library. Do not import from other icon sets (Heroicons, Phosphor, FontAwesome, etc.).

If a desired icon does not exist in Lucide, use the closest alternative or create an SVG inline with the same visual weight.

### 12.2 Standard Sizes

| Context | Size | Tailwind |
|---|---|---|
| Navigation icons | 24×24px | `h-6 w-6` |
| Button icons (with text) | 16×16px | `h-4 w-4` |
| Button icons (icon-only) | 20×20px | `h-5 w-5` |
| Metric / section header icons | 16×16px | `h-4 w-4` |
| Feature card icons | 24×24px | `h-6 w-6` |
| Empty state icons | 40×40px | `h-10 w-10` |
| Hero / large icons | 32×32px | `h-8 w-8` |

### 12.3 Icon Colour

| Context | Colour |
|---|---|
| Navigation inactive | `--color-text-secondary` |
| Navigation active | `--color-text-primary` |
| Button icon | Inherits button text colour |
| Section header icon | `--color-accent-primary` or `--color-text-secondary` |
| Semantic icon | Matching semantic colour (success/warning/danger) |
| Empty state icon | Category-appropriate (`blue-600`) |
| Destructive action | `--color-danger` or inherits from danger button |

### 12.4 Icon Placement

- Icon before text (left): navigation, buttons, list items
- Icon after text (right): arrows indicating navigation/progression only (`ArrowRight`, `ChevronRight`)
- Icon alone: only with `aria-hidden="true"` + parent element having `aria-label`

### 12.5 Icon-to-Text Spacing

- `gap-2` (8px) for button icon + text
- `gap-3` (12px) for navigation icon + text
- `gap-1.5` (6px) for inline icon within text flow

---

## 13. Accessibility Rules

Accessibility must be designed in, not added afterwards.

### 13.1 Colour Contrast

- All text on background combinations must meet WCAG AA minimum:
  - Normal text: 4.5:1 contrast ratio
  - Large text (18px+ or 14px+ bold): 3:1 contrast ratio
- `--color-text-secondary` on `--color-bg-primary` must meet AA minimum
- Do not use `--color-text-secondary` for interactive elements — use `--color-text-primary`

### 13.2 Focus States

- Every interactive element must have a visible focus ring
- Use `focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]` consistently
- Never use `outline: none` without a replacement
- Tab order must follow visual reading order

### 13.3 Keyboard Navigation

- All interactive elements reachable by Tab
- Escape closes all overlays (modals, drawers, dropdowns)
- Drawers and modals must trap focus while open
- `n` → new transaction, `/` → search — document shortcuts in `<KeyboardShortcutsDialog>`
- Arrow keys for lists/tabs where appropriate

### 13.4 Touch Targets

- Minimum 44×44px for all interactive elements on mobile
- Row action buttons: `p-2` minimum
- Navigation items: pad generously

### 13.5 Semantic HTML

- `<button>` for actions, `<a>` for navigation
- `<h1>` once per page, heading hierarchy unbroken
- `<form>` wraps all form elements
- `<table>` for tabular data (transactions)
- `<nav aria-label="Main Navigation">` on sidebar
- `<header>`, `<main>`, `<aside>` for shell structure

### 13.6 Form Accessibility

- Every input has a `<label>` with `htmlFor` matching the input `id`
- Error messages: `role="alert"` or associated via `aria-describedby`
- Required fields: marked with `aria-required="true"` + visual indicator (`*`)
- Validation summary: focused automatically on submit error (`tabIndex={-1}` + `.focus()`)

### 13.7 Screen Reader Support

- Icon-only buttons: `aria-label` required
- Decorative icons: `aria-hidden="true"`
- Chat log: `role="log"` + `aria-live="off"` (messages are in the log, not announced individually)
- Streaming AI response: `aria-live="polite"` on the streaming container
- Loading states: `aria-busy="true"` on the region being updated

### 13.8 Colour-Only Information

- Never communicate information exclusively through colour
- Income/expense distinction: use both colour AND sign/label
- Status: use both colour AND text (FEASIBLE / STRETCH / UNREALISTIC badges)
- Error states: icon + text + colour, not colour alone

---

## 14. Rules for Integrating External / Prebuilt UI Components

This section defines the mandatory procedure when incorporating any externally-sourced React component into FinSight.

Sources that trigger this procedure:
- A prebuilt React component from a UI library (shadcn/ui, Radix, Chakra, Mantine, etc.)
- A component generated by an AI prompt (v0.dev, Bolt, Lovable, Claude, GPT, etc.)
- A screenshot-to-code component
- A component from a design system other than this one
- Any component provided by the user as a reference or starting point

### 14.1 The Adaptation Process

```
External Component Received
         ↓
Step 1:  Understand its PURPOSE
         What does it do? What user need does it solve?
         ↓
Step 2:  Compare against UI_DESIGN_RULES.md
         Does a component for this purpose already exist?
         If yes → prefer the existing component over the new one
         ↓
Step 3:  Identify visual conflicts
         ─ What colours does it use that are not in the token system?
         ─ What font sizes/weights conflict with the typography rules?
         ─ What spacing values are arbitrary?
         ─ What border radii are non-standard?
         ─ What shadows are excessive?
         ─ Does it introduce new variants of existing component types?
         ↓
Step 4:  Adapt colours
         Replace all hardcoded hex/rgb/hsl values with token variables
         Replace semantic colours (red→danger, green→success) with tokens
         Remove decorative colour fills
         ↓
Step 5:  Adapt typography
         Replace font sizes with the typography scale
         Replace font weights with permitted values
         Replace arbitrary letter-spacing with standard values
         ↓
Step 6:  Adapt spacing
         Replace arbitrary padding/margin/gap with the spacing scale
         ↓
Step 7:  Adapt border radius
         Replace arbitrary radius values with standard radius tokens
         ↓
Step 8:  Adapt shadows
         Remove excessive shadows
         Replace with appropriate token
         ↓
Step 9:  Adapt interaction states
         Ensure hover, focus, active, disabled all follow Section 11 rules
         ↓
Step 10: Check responsive behaviour
         Does it work at all breakpoints?
         Mobile touch targets sufficient?
         ↓
Step 11: Check consistency with existing components
         Does it visually look like it was designed for FinSight?
         Would a user assume it's part of the same product?
         ↓
Step 12: Implement
```

### 14.2 What to Preserve from External Components

| Preserve | Rationale |
|---|---|
| Functional logic | The component's behaviour is why we're using it |
| Useful interaction patterns | e.g. combobox keyboard navigation, drag behaviour |
| Accessibility attributes | Only if they're correct and not already handled |
| Data structure / props API | Minimise API changes for integration ease |

### 14.3 What NOT to Preserve

| Do NOT Preserve | Replacement |
|---|---|
| Original colour palette | Use token system |
| Original font sizes | Use typography scale |
| Original font weights | Use permitted weights |
| Original border radius | Use radius standards |
| Original shadow | Use shadow token |
| Gradient backgrounds | Remove unless functional |
| Glassmorphism effects | Remove unless matching existing usage |
| Original accent colours | Use `--color-accent-primary` |
| Branded/themed dark backgrounds | Use token system |
| Original animation behaviour | Adapt to motion rules (Section 11) |
| Additional icon libraries | Replace with Lucide equivalents |

### 14.4 Specific External Patterns to Reject Outright

The following patterns from external components must be removed, not adapted:

- Blue/purple/indigo primary accent colours (our accent is `#000000` / `#ffffff`)
- Coloured sidebar backgrounds
- Gradient hero sections
- "Glassmorphism card grid" aesthetics used for regular data content
- Large emoji-heavy onboarding flows
- Floating action buttons (FAB)
- Bottom sheets used as primary modals (bottom sheets are only for mobile)
- Animated gradient backgrounds (CSS `@keyframes` animated gradients on backgrounds)
- Card carousels for regular content that fits in a grid
- "Neumorphism" (raised/pressed shadow effects)

### 14.5 Common External Component Adaptation Examples

#### Example A: shadcn/ui `<Card>`
```
External: white background, subtle rounded, shadow-sm, arbitrary padding
Adapt to: use existing <Card> component — do not add another Card implementation
```

#### Example B: A generated dashboard "stat card"
```
External: purple/blue gradient background, white text, large icon, bold number
Adapt:
- Remove gradient → bg-[var(--color-bg-primary)] + --shadow-card
- Replace purple → --color-accent-primary where accent needed
- Apply typography scale to number
- Replace icon with Lucide equivalent
- Use MetricCard or WidgetContainer pattern
```

#### Example C: A prebuilt sidebar component
```
External: dark sidebar, coloured active states, custom icons
Adapt:
- Match width (288px)
- Background → --color-bg-secondary
- Active state → existing spring-animated pill pattern
- Icons → Lucide equivalents
- Text → token colours
```

#### Example D: An AI-generated analytics chart
```
External: random colour palette, thick border, shadow on chart area, large legend
Adapt:
- Replace colours with --chart-1 through --chart-5
- Remove chart-area border and shadow
- Scale legend to text-xs
- Wrap in <WidgetContainer>
```

---

## 15. Do Not Introduce List

The following patterns must NOT be introduced unless explicitly justified in writing:

### Visual Patterns

- [ ] Colours not in the token system
- [ ] Arbitrary hex/rgb colour values in component code
- [ ] Gradients used for backgrounds (except existing auth layout ambient blobs — do not expand this pattern)
- [ ] Glassmorphism beyond the established summary panel pattern
- [ ] Multiple different coloured accent buttons (e.g. a blue button AND a green button on the same page)
- [ ] Coloured card backgrounds (cards must use `--color-bg-primary`)
- [ ] Coloured sidebar or header backgrounds
- [ ] Drop shadows on individual text elements
- [ ] Text with `font-black` or `font-extrabold`
- [ ] Font sizes below `text-xs` or above `text-3xl` (except the Dashboard hero number)
- [ ] Animated background gradients
- [ ] Confetti or celebration effects (the `celebrationTrigger` in uiStore is reserved — do not add new celebration patterns)
- [ ] Blurred/unfocused background content visible through modals (beyond the existing `backdrop-blur-sm`)

### Component Patterns

- [ ] A second Card component implementation (use `<Card>`, `<WidgetContainer>`, or `<MetricCard>`)
- [ ] A second Button component implementation (use `<Button>`)
- [ ] Raw `<button>` elements with inline colour styles that duplicate `<Button>` semantics
- [ ] Duplicate navigation patterns within the same screen
- [ ] Both "Your Profile" and "Settings" links pointing to the same route (header dropdown — fix this)
- [ ] Modals that don't have focus trap or Escape key close
- [ ] Form fields without visible labels
- [ ] Tables without accessible column headers
- [ ] `z-index` values above `z-50` without documented reasoning
- [ ] `!important` in CSS

### Motion Patterns

- [ ] Animations exceeding 400ms duration
- [ ] Looping decorative animations not triggered by user interaction (except the AI typing indicator)
- [ ] Hover animations on non-interactive elements
- [ ] Multiple simultaneous animations in the same viewport region
- [ ] CSS keyframe animations that bypass framer-motion and `reducedMotion` config

### Structural Patterns

- [ ] Different maximum content widths within the same page type
- [ ] Arbitrary spacing values not on the spacing scale
- [ ] Arbitrary border-radius values not in the radius standards
- [ ] Page-level designs that significantly deviate from the standard anatomy (page header + sections)
- [ ] New icon libraries alongside Lucide
- [ ] New fonts alongside Inter / JetBrains Mono

---

## 16. UI Decision Hierarchy

When a new component, design decision, or external element conflicts with an existing rule, apply this priority order:

```
Priority 1: Product Usability
            If a design rule makes the product harder to use, the rule must be updated.
            Usability always wins.

Priority 2: Established Application Design System (this document)
            The token system, typography, spacing, component rules.

Priority 3: Existing Reusable Components
            Prefer reusing <Button>, <Card>, <Drawer>, <WidgetContainer> etc.
            before creating new variants.

Priority 4: Accessibility Requirements
            WCAG AA compliance is non-negotiable.

Priority 5: New Component's Adapted Logic / Interaction Pattern
            The useful behaviour of external components, adapted to this system.

Priority 6: New Component's Original Styling
            Original colours, typography, radii — lowest priority.
            These are replaced, not preserved.

Priority 7: Decorative Visual Preferences
            "It looks nice" is not a justification for breaking the system.
```

**Practical implication:** If an external component has an interaction pattern worth keeping (e.g. a combobox's keyboard navigation), keep the interaction. Replace the styling. The component's visual identity is irrelevant — only its functional purpose matters.

---

## 17. Pre-Implementation Consistency Checklist

Before implementing any new UI change, verify each item:

### 17.1 Visual System

- [ ] All colours reference token variables (`var(--color-...)`) — no hardcoded hex/rgb values
- [ ] All text uses the defined typography scale
- [ ] All spacing uses the permitted spacing scale
- [ ] All border radii match the standard levels
- [ ] Borders follow the defined border treatment
- [ ] Shadows use the defined shadow tokens
- [ ] No new colours introduced that are not in the token system

### 17.2 Component Reuse

- [ ] Is there an existing component that serves this purpose?
- [ ] If yes — the existing component is used, not a duplicate created
- [ ] If a new component is introduced — it will not create a duplicate pattern
- [ ] The new component follows all rules for its type (button, card, modal, etc.)

### 17.3 UX Quality

- [ ] Visual hierarchy is clear — primary action is obvious
- [ ] All interactive states are handled: hover, focus, active, disabled, loading
- [ ] Empty state is handled
- [ ] Error state is handled
- [ ] Loading state uses the correct pattern (skeleton vs spinner)
- [ ] Interaction behaviour is consistent with similar components on other pages

### 17.4 Layout Consistency

- [ ] Page uses the standard page header structure
- [ ] Page uses the correct maximum content width for its type
- [ ] Page uses `p-6 sm:p-10` outer padding
- [ ] Section spacing uses `gap-10` between major sections
- [ ] Grid follows standard column patterns

### 17.5 Responsive Behaviour

- [ ] Works correctly on desktop (`lg+`)
- [ ] Works correctly on tablet (`md`)
- [ ] Works correctly on mobile (`sm-`)
- [ ] Touch targets meet 44px minimum on mobile
- [ ] Tables are scrollable or switch to card layout on mobile
- [ ] Modals/drawers behave correctly at all breakpoints

### 17.6 Accessibility

- [ ] Colour contrast meets WCAG AA
- [ ] Focus state is visible on all interactive elements
- [ ] All icon-only buttons have `aria-label`
- [ ] All form inputs have associated `<label>` elements
- [ ] Modals have `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape close
- [ ] No information conveyed by colour alone

### 17.7 External Component Adaptation

- [ ] The adaptation process (Section 14.1) was followed
- [ ] Original colours were replaced with token variables
- [ ] Original typography was replaced with the typography scale
- [ ] Original spacing was replaced with the spacing scale
- [ ] Original border radius was replaced with standard values
- [ ] Original shadow was replaced with a token
- [ ] No prohibited patterns were introduced (Section 15)

### 17.8 Consistency Judgement

- [ ] Does this component look like it was designed for FinSight?
- [ ] Would a user assume this was built as part of the same product?
- [ ] If the answer to either question is "no" — revise before implementing

---

## Appendix: Living Document Maintenance

This document must be updated when:

1. A new design token is intentionally added to `variables.css`
2. A new component pattern is established
3. A spacing, radius, or shadow convention changes
4. A new page type is introduced
5. A decision is made to override a rule (document the reasoning)

This document must NOT be updated when:

- An external component arrives with different styling
- A stakeholder prefers a different aesthetic without product reasoning
- An AI generates a component with conflicting styles
- The application is under time pressure — inconsistency now means rework later

The design system is the default authority. External inputs must adapt to it.

---

*Prepared from direct inspection of the FinSight codebase and `UI_UX_ARCHITECTURE.md`. No application code was modified to produce this document.*
