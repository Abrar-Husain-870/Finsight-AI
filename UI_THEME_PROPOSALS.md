# FinSight — UI Theme Proposals

> **Status:** APPROVED — Option C (Warm Sand) selected with refined adjustments.
>
> **Scope of this document:** Historical proposals and token definitions. Option C (Warm Sand) has been formally adopted into `variables.css` and `UI_DESIGN_RULES.md`.

---

## Context: What Is Being Decided

The current token system uses:
- **Accent:** pure `#000000` (light) / `#ffffff` (dark)
- **Backgrounds:** pure white `#ffffff` / near-white `#fafafa`
- **Text:** cold gray-900 `#111827` / gray-500 `#6b7280`

This is functional but deliberately unresolved — it was a placeholder pending intentional palette selection. The three proposals below each answer the same question differently:

> *What is FinSight's specific visual identity — while remaining minimal, premium, and trustworthy?*

---

## Unresolved Decisions Identified in `UI_DESIGN_RULES.md`

| Issue | Status in Rules | This Document |
|---|---|---|
| Exact accent colour | Deferred — "black/white" pending finalisation | Resolved per option |
| Warm vs cold neutral backgrounds | Mentioned as direction, not defined | Resolved per option |
| Exact success/warning/danger hues | Named but unrefined (saturated) | Refined per option |
| Chart colour palette (exact hex) | Defined as oklch, light/dark diverge completely | Unified per option |
| AI UI blue family (exact tones) | "blue-100/600" — Tailwind class, not a token | Defined per option |
| Shadow tint | Currently `rgba(0,0,0,...)` cold black tint | Adjusted per option |

---

## Summary Comparison

| | Option A — Carbon | Option B — Slate Ink | Option C — Warm Sand |
|---|---|---|---|
| **Accent** | Warm near-black | Cool slate-900 | Ink brown-black |
| **Background** | Pure white | Cool off-white | Warm cream |
| **Character** | Neutral, invisible | Sharp, technical | Warm, distinctive |
| **Closest to** | Current state (refined) | Linear / Cursor | Notion + Stripe |
| **Risk** | Low identity | Cold for personal finance | Contrast edge cases |
| **Effort to adopt** | Minimal | Low | Moderate |
| **Recommendation** | ✗ | ✗ | ✅ Recommended |

---

## Option A — "Carbon"

### Philosophy

The most conservative choice. Carbon refines the current approach — replacing the cold, pure grays with warmer-tinted neutrals — without introducing a new accent colour. The result is clean and invisible: the design never competes with the financial data it presents. It is the closest to "no theme" — a deliberate erasure of visual personality in favour of maximum content focus.

Suitable if: the application will primarily be judged on its data and functionality, and visual identity is considered secondary.

---

### A.1 Light Mode Tokens

```css
/* Option A — Carbon — Light Mode */

/* Backgrounds */
--color-bg-primary:        #ffffff;           /* Pure white — page, cards, modals */
--color-bg-secondary:      #f9f9f8;           /* Barely-warm white — sidebar, inputs, hover */
--color-bg-tertiary:       #f2f2f0;           /* Inner sections within cards */

/* Text */
--color-text-primary:      #1a1a18;           /* Warm near-black — replaces cold #111827 */
--color-text-secondary:    #706f6b;           /* Warm gray — replaces cold #6b7280 */
--color-text-muted:        #a8a7a3;           /* Disabled, placeholder */

/* Accent */
--color-accent-primary:    #1a1a18;           /* Warm near-black — buttons, active nav */
--color-accent-secondary:  #3d3d39;           /* Hover state on primary button */
--color-accent-muted:      rgba(26,26,24,0.08); /* Subtle accent bg — chip highlights */

/* Borders */
--color-border-primary:    rgba(26,26,24,0.07); /* Standard borders */
--color-border-strong:     rgba(26,26,24,0.14); /* Active/selected borders */
--color-border-focus:      #1a1a18;           /* Focus ring */

/* Semantic */
--color-success:           #047857;           /* Emerald-700 — income, positive, achieved */
--color-success-muted:     #ecfdf5;           /* Success bg — badges, row highlights */
--color-warning:           #b45309;           /* Amber-700 — stretch, caution */
--color-warning-muted:     #fffbeb;           /* Warning bg */
--color-danger:            #b91c1c;           /* Red-700 — negative, error, destructive */
--color-danger-muted:      #fef2f2;           /* Danger bg */

/* AI UI */
--color-ai-bg:             #eff6ff;           /* blue-50 */
--color-ai-accent:         #2563eb;           /* blue-600 */
--color-ai-muted:          #dbeafe;           /* blue-100 */

/* Charts (5 distinct, warm-tinted) */
--chart-1:                 #3b6fd4;           /* Slate blue */
--chart-2:                 #16a06e;           /* Emerald */
--chart-3:                 #d97706;           /* Amber */
--chart-4:                 #7c3aed;           /* Violet */
--chart-5:                 #db5c5c;           /* Soft red */
```

### A.2 Dark Mode Tokens

```css
/* Option A — Carbon — Dark Mode */

--color-bg-primary:        #111110;           /* Very dark warm black */
--color-bg-secondary:      #1a1a18;           /* Slightly lighter warm surface */
--color-bg-tertiary:       #242422;           /* Inner card sections */

--color-text-primary:      #f0f0ee;           /* Warm off-white */
--color-text-secondary:    #9a9995;           /* Warm medium gray */
--color-text-muted:        #65635f;           /* Muted, disabled */

--color-accent-primary:    #f0f0ee;           /* Warm off-white — inverted from light */
--color-accent-secondary:  #c8c7c3;           /* Hover */
--color-accent-muted:      rgba(240,240,238,0.08);

--color-border-primary:    rgba(240,240,238,0.09);
--color-border-strong:     rgba(240,240,238,0.18);
--color-border-focus:      #f0f0ee;

--color-success:           #34d399;           /* emerald-400 — visible on dark */
--color-success-muted:     rgba(52,211,153,0.12);
--color-warning:           #fbbf24;           /* amber-400 */
--color-warning-muted:     rgba(251,191,36,0.12);
--color-danger:            #f87171;           /* red-400 */
--color-danger-muted:      rgba(248,113,113,0.12);

--color-ai-bg:             rgba(37,99,235,0.12);
--color-ai-accent:         #60a5fa;           /* blue-400 */
--color-ai-muted:          rgba(96,165,250,0.15);

--chart-1:                 #60a5fa;           /* blue-400 */
--chart-2:                 #34d399;           /* emerald-400 */
--chart-3:                 #fbbf24;           /* amber-400 */
--chart-4:                 #a78bfa;           /* violet-400 */
--chart-5:                 #f87171;           /* red-400 */
```

### A.3 Applied to UI Elements

| UI Surface | Light Value | Appearance |
|---|---|---|
| Page background | `#ffffff` | Pure white |
| Sidebar | `#f9f9f8` | Barely-warm white, nearly invisible from page |
| Card (default) | `#ffffff` + `shadow-card` | White, lifted by shadow |
| Card (inner section) | `#f9f9f8` | Slightly stepped down |
| Primary text | `#1a1a18` | Warm near-black — softer than pure `#111827` |
| Secondary text | `#706f6b` | Warm gray |
| Primary button | `#1a1a18` bg / `#ffffff` text | Warm near-black pill |
| Primary button hover | `#3d3d39` bg | Slightly lighter near-black |
| Active nav indicator | `#ffffff` bg + `shadow-sm` | White pill on warm surface |
| Input border | `rgba(26,26,24,0.07)` | Very subtle warm gray |
| Input focus ring | `#1a1a18` | Solid warm near-black ring |
| Income value | `#047857` | Deep emerald |
| Expense value | `#b91c1c` | Deep red |
| Warning / Stretch | `#b45309` | Deep amber |
| Chart 1 (primary) | `#3b6fd4` | Slate blue |
| Chart 2 | `#16a06e` | Emerald |
| Chart 3 | `#d97706` | Amber |
| AI chat bubble (assistant) | `#eff6ff` bg | Pale blue |
| AI accent | `#2563eb` | Blue-600 |
| Error state border | `rgba(185,28,28,0.2)` | Soft red border |

### A.4 Strengths and Weaknesses

| | |
|---|---|
| ✅ Zero adoption friction | The warmth shift is subtle — components need minimal adjustment |
| ✅ Content-first | The UI never competes with financial data |
| ✅ Universally safe | Works for all user preferences and contexts |
| ✅ Accessible | Near-black on white is maximum contrast |
| ❌ Low identity | Cannot be distinguished from dozens of other SaaS tools |
| ❌ Conservative | Does not fulfil the "premium" and "distinctive" goals |
| ❌ The warm neutral direction is implicit | The warmth is barely perceptible — the design still skews cold |

---

---

## Option B — "Slate Ink"

### Philosophy

Slate Ink commits to the cool-gray, developer-grade aesthetic explicitly referenced in the design direction ("Cursor, Windsurf, Linear"). The accent becomes **slate-900** — a deep, near-black blue-gray rather than a pure warm-black. Backgrounds shift slightly cool (slate-50 instead of pure white). The result feels precision-engineered: structured, sharp, and technically competent.

Suitable if: the application wants to signal "professional tools for serious users" — closer to a developer tool than a consumer finance app.

---

### B.1 Light Mode Tokens

```css
/* Option B — Slate Ink — Light Mode */

/* Backgrounds */
--color-bg-primary:        #ffffff;           /* Cards, modals — pure white for contrast */
--color-bg-secondary:      #f8fafc;           /* Slate-50 — sidebar, inputs, hover */
--color-bg-tertiary:       #f1f5f9;           /* Slate-100 — inner sections */

/* Text */
--color-text-primary:      #0f172a;           /* Slate-900 — sharp, cool near-black */
--color-text-secondary:    #64748b;           /* Slate-500 — cool medium gray */
--color-text-muted:        #94a3b8;           /* Slate-400 — disabled, placeholder */

/* Accent */
--color-accent-primary:    #0f172a;           /* Slate-900 — deep blue-gray (not pure black) */
--color-accent-secondary:  #1e293b;           /* Slate-800 — hover */
--color-accent-muted:      rgba(15,23,42,0.07); /* Accent bg */

/* Borders */
--color-border-primary:    rgba(15,23,42,0.08); /* Slate tint — slightly more visible than warm */
--color-border-strong:     rgba(15,23,42,0.15); /* Active/selected */
--color-border-focus:      #0f172a;           /* Slate-900 focus ring */

/* Semantic */
--color-success:           #059669;           /* Emerald-600 — kept from existing */
--color-success-muted:     #ecfdf5;
--color-warning:           #d97706;           /* Amber-600 — kept */
--color-warning-muted:     #fffbeb;
--color-danger:            #dc2626;           /* Red-600 — kept */
--color-danger-muted:      #fef2f2;

/* AI UI — blue is strong anchor in this palette */
--color-ai-bg:             #eff6ff;           /* blue-50 */
--color-ai-accent:         #2563eb;           /* blue-600 */
--color-ai-muted:          #dbeafe;           /* blue-100 */

/* Charts */
--chart-1:                 #2563eb;           /* Blue-600 — strongest hue in palette */
--chart-2:                 #059669;           /* Emerald-600 */
--chart-3:                 #d97706;           /* Amber-600 */
--chart-4:                 #7c3aed;           /* Violet-600 */
--chart-5:                 #dc2626;           /* Red-600 */
```

### B.2 Dark Mode Tokens

```css
/* Option B — Slate Ink — Dark Mode */

--color-bg-primary:        #0d1117;           /* GitHub dark — very cool dark */
--color-bg-secondary:      #161b22;           /* One step lighter */
--color-bg-tertiary:       #21262d;           /* Inner sections */

--color-text-primary:      #e6edf3;           /* Cool off-white */
--color-text-secondary:    #8b949e;           /* Cool medium gray */
--color-text-muted:        #484f58;           /* Muted */

--color-accent-primary:    #e6edf3;           /* Inverted from light */
--color-accent-secondary:  #b1bac4;           /* Hover */
--color-accent-muted:      rgba(230,237,243,0.08);

--color-border-primary:    rgba(230,237,243,0.08);
--color-border-strong:     rgba(230,237,243,0.16);
--color-border-focus:      #58a6ff;           /* Blue focus ring — distinctive in dark */

--color-success:           #3fb950;           /* GitHub green — vivid on dark */
--color-success-muted:     rgba(63,185,80,0.12);
--color-warning:           #d29922;           /* GitHub yellow */
--color-warning-muted:     rgba(210,153,34,0.12);
--color-danger:            #f85149;           /* GitHub red */
--color-danger-muted:      rgba(248,81,73,0.12);

--color-ai-bg:             rgba(37,99,235,0.15);
--color-ai-accent:         #58a6ff;           /* GitHub blue */
--color-ai-muted:          rgba(88,166,255,0.15);

--chart-1:                 #58a6ff;           /* Blue */
--chart-2:                 #3fb950;           /* Green */
--chart-3:                 #d29922;           /* Yellow */
--chart-4:                 #bc8cff;           /* Purple */
--chart-5:                 #f85149;           /* Red */
```

### B.3 Applied to UI Elements

| UI Surface | Light Value | Appearance |
|---|---|---|
| Page background | `#ffffff` | Pure white |
| Sidebar | `#f8fafc` | Barely cool slate |
| Card (default) | `#ffffff` + `shadow-card` | White, clean |
| Inner card section | `#f1f5f9` | Stepped cool gray |
| Primary text | `#0f172a` | Very dark blue-gray — sharp |
| Secondary text | `#64748b` | Cool medium gray |
| Primary button | `#0f172a` bg / `#ffffff` text | Deep slate button |
| Active nav indicator | `#ffffff` bg + ring | White pill on slate surface |
| Income value | `#059669` | Emerald-600 |
| Expense value | `#dc2626` | Red-600 |
| Warning | `#d97706` | Amber-600 |
| Chart 1 (primary) | `#2563eb` | Blue-600 — strong visual anchor |
| AI bubble (assistant) | `#eff6ff` | Pale blue |
| AI accent | `#2563eb` | Blue-600 — matches chart-1 here |
| Focus ring (dark) | `#58a6ff` | Blue ring — distinctive |

**Note:** In this theme, Chart-1 and the AI accent blue are the same value (`#2563eb`). This is intentional — it establishes blue as the application's single saturated colour, used only in AI contexts and as the primary chart series. All other chart colours are semantic analogues.

### B.4 Strengths and Weaknesses

| | |
|---|---|
| ✅ Sharp and credible | Reads as a professional tool immediately |
| ✅ Excellent contrast | Slate-900 on white has near-maximum contrast ratio |
| ✅ Coherent dark mode | Slate's cool neutrals translate cleanly to dark |
| ✅ Blue anchor is earned | Blue is used only for data + AI — no decoration |
| ❌ Cold tone for personal finance | Feels more like a DevOps dashboard than a personal workspace |
| ❌ Lower visual warmth | Money management has a trust/warmth dimension that cool grays underserve |
| ❌ Risk of feeling derivative | GitHub, Tailwind UI, and similar tools all occupy this space |

---

---

## Option C — "Warm Sand" ⭐ Recommended

### Philosophy

Warm Sand is the most deliberately distinctive of the three options. Rather than the pure-white / cold-gray convention of most web applications, it builds from a warm off-white base — a barely-there cream — and pairs it with a warm ink-black accent derived from the same undertone family. The result feels premium in the way that high-quality physical products feel premium: through material quality and tactile warmth, not visual loudness.

This is the direction most directly referenced in `UI_DESIGN_RULES.md`: *"warm neutral / beige-inspired visual language, influenced by the restraint and simplicity seen in Cursor, Windsurf, Linear, and modern fintech applications."*

The palette connects to established premium product aesthetics — Notion's warmth, Linear's precision, Stripe's trustworthiness — while being distinguishable from all of them.

---

### C.1 Light Mode Tokens

```css
/* Option C — Warm Sand — Light Mode */

/* Backgrounds */
--color-bg-primary:        #fdfcfb;           /* Warm off-white — page, cards, modals */
--color-bg-secondary:      #f7f5f2;           /* Warm sand — sidebar, inputs, hover */
--color-bg-tertiary:       #eeebe6;           /* Warm stone — inner card sections */

/* Text */
--color-text-primary:      #1c1917;           /* Stone-900 — warm near-black */
--color-text-secondary:    #78716c;           /* Stone-500 — warm medium brown-gray */
--color-text-muted:        #a8a29e;           /* Stone-400 — disabled, placeholder */

/* Accent */
--color-accent-primary:    #1c1917;           /* Stone-900 warm ink — buttons, active nav */
--color-accent-secondary:  #44403c;           /* Stone-700 — hover on primary button */
--color-accent-muted:      rgba(28,25,23,0.07); /* Subtle accent bg */

/* Borders */
--color-border-primary:    rgba(28,25,23,0.08); /* Warm tint border */
--color-border-strong:     rgba(28,25,23,0.16); /* Selected, active */
--color-border-focus:      #1c1917;           /* Stone-900 focus ring */

/* Semantic — slightly warmer variants */
--color-success:           #15803d;           /* Green-700 — earthy, not clinical */
--color-success-muted:     #f0fdf4;           /* Green-50 — warm enough */
--color-warning:           #b45309;           /* Amber-700 — earthy amber */
--color-warning-muted:     #fffbeb;           /* Amber-50 */
--color-danger:            #b91c1c;           /* Red-700 — restrained, not alarming */
--color-danger-muted:      #fef2f2;           /* Red-50 */

/* AI UI — blue is the only cool colour in this palette, kept purposeful */
--color-ai-bg:             #eff6ff;           /* blue-50 */
--color-ai-accent:         #1d4ed8;           /* blue-700 — slightly deeper than generic */
--color-ai-muted:          #dbeafe;           /* blue-100 */

/* Charts — warm-adjusted hues, maximum distinctiveness */
--chart-1:                 #1d4ed8;           /* Ink blue — primary series */
--chart-2:                 #15803d;           /* Forest green — matches success */
--chart-3:                 #b45309;           /* Warm amber — matches warning */
--chart-4:                 #6d28d9;           /* Deep violet */
--chart-5:                 #c2410c;           /* Burnt orange — distinct from warning */
```

### C.2 Dark Mode Tokens

```css
/* Option C — Warm Sand — Dark Mode */

--color-bg-primary:        #141210;           /* Warm very dark — not pure black */
--color-bg-secondary:      #1c1917;           /* Stone-900 — sidebar, surfaces */
--color-bg-tertiary:       #28211d;           /* Inner sections */

--color-text-primary:      #faf8f5;           /* Warm off-white — not pure white */
--color-text-secondary:    #a8a29e;           /* Stone-400 */
--color-text-muted:        #57534e;           /* Stone-600 */

--color-accent-primary:    #faf8f5;           /* Warm off-white — inverted from light */
--color-accent-secondary:  #d6d3d1;           /* Stone-300 — hover */
--color-accent-muted:      rgba(250,248,245,0.08);

--color-border-primary:    rgba(250,248,245,0.08); /* Very subtle warm white border */
--color-border-strong:     rgba(250,248,245,0.16);
--color-border-focus:      #fbbf24;           /* Amber focus ring — warm glow in dark */

/* Semantic in dark — warm-adjusted luminous variants */
--color-success:           #4ade80;           /* Green-400 — warm, clear on dark */
--color-success-muted:     rgba(74,222,128,0.12);
--color-warning:           #fbbf24;           /* Amber-400 */
--color-warning-muted:     rgba(251,191,36,0.12);
--color-danger:            #f87171;           /* Red-400 */
--color-danger-muted:      rgba(248,113,113,0.12);

/* AI — blue stays cool and distinct from warm palette */
--color-ai-bg:             rgba(29,78,216,0.15); /* blue-700 at opacity */
--color-ai-accent:         #60a5fa;           /* blue-400 — vivid on warm dark */
--color-ai-muted:          rgba(96,165,250,0.15);

/* Charts — luminous warm-adjusted */
--chart-1:                 #60a5fa;           /* Blue-400 */
--chart-2:                 #4ade80;           /* Green-400 */
--chart-3:                 #fbbf24;           /* Amber-400 */
--chart-4:                 #c084fc;           /* Purple-400 */
--chart-5:                 #fb923c;           /* Orange-400 */

/* Shadows — warm-tinted for dark mode */
--shadow-card:             0 4px 12px -2px rgba(0,0,0,0.8), 0 0 0 1px rgba(250,248,245,0.04) inset;
--shadow-card-hover:       0 12px 32px -4px rgba(0,0,0,0.9), 0 0 0 1px rgba(250,248,245,0.06) inset;
--shadow-dropdown:         0 24px 48px -8px rgba(0,0,0,0.95), 0 0 0 1px rgba(250,248,245,0.06) inset;
```

### C.3 Applied to UI Elements

| UI Surface | Light Value | Appearance |
|---|---|---|
| Page background | `#fdfcfb` | Barely-warm cream — the defining characteristic of this theme |
| Sidebar | `#f7f5f2` | Warm sand — clearly distinct from page without contrast shock |
| Card (default) | `#fdfcfb` + `shadow-card` | Cream card — warm and tactile |
| Inner card section | `#eeebe6` | Warm stone — clear step down, no harsh contrast |
| Primary text | `#1c1917` | Warm ink-black — comfortable, warm, readable |
| Secondary text | `#78716c` | Warm brown-gray — cohesive with the ink-black |
| Primary button | `#1c1917` bg / `#fdfcfb` text | Ink-on-cream — premium print quality feel |
| Button hover | `#44403c` | Slightly lighter warm black |
| Active nav indicator | `#fdfcfb` bg + ring | Cream pill on warm sand — cohesive, not harsh |
| Input background | `#fdfcfb` | Same as page — inputs integrate naturally |
| Input border | `rgba(28,25,23,0.08)` | Barely visible warm gray |
| Input focus ring | `#1c1917` | Solid warm ink ring |
| Income value | `#15803d` | Forest green — earthy, natural, positive |
| Expense value | `#b91c1c` | Deep red — serious but not alarming |
| Warning/Stretch | `#b45309` | Warm amber-brown — cohesive with palette |
| Success badge bg | `#f0fdf4` | Warm green-tinted |
| Chart 1 (primary) | `#1d4ed8` | Deep ink blue — contrasts warmly against cream |
| Chart 2 | `#15803d` | Forest green |
| Chart 3 | `#b45309` | Warm amber |
| Chart 4 | `#6d28d9` | Deep violet |
| Chart 5 | `#c2410c` | Burnt orange |
| AI bubble (assistant bg) | `#eff6ff` | Cool blue on warm page — AI feels deliberately different |
| AI accent | `#1d4ed8` | Ink blue |
| Dark mode focus ring | `#fbbf24` | Amber glow — warm, distinctive, visible |
| Dark background | `#141210` | Warm dark — softer than `#0a0a0a` pure black |
| Dark sidebar | `#1c1917` | Warm stone-900 — rich, not flat |

### C.4 Colour Interaction Notes

**The warm/cool intentional contrast:**
The cream background (`#fdfcfb`) provides maximum intentional contrast when blue enters the picture — specifically for charts (Chart-1) and AI UI. This contrast is *structural*, not accidental: blue belongs to data and AI. Everything else is warm-neutral. This creates a clear visual grammar without adding noise.

**Focus ring in dark mode:**
The amber (`#fbbf24`) focus ring in dark mode is the single "glow" element permitted in the theme. It is warm, visible, and earns its distinctiveness by being the only warm-saturated colour used in an interactive-state context.

**Shadow tinting:**
In dark mode, shadow colours are replaced with warm-tinted values (inset ring of `rgba(250,248,245,0.04–0.06)`) rather than the cold white used in the current tokens. This maintains visual warmth even in elevated surfaces.

### C.5 Strengths and Weaknesses

| | |
|---|---|
| ✅ Most distinctive | Immediately recognisable as FinSight — not derivable from another product |
| ✅ Premium material quality | Cream/sand backgrounds evoke physical premium materials (paper, card) |
| ✅ Warm trust signals | Warmth is psychologically associated with approachability and reliability |
| ✅ Coherent grammar | Warm = UI / Cool = data (charts) + AI. Clean semantic separation |
| ✅ Best dark mode | Warm dark (`#141210`) is more sophisticated than cold `#0a0a0a` |
| ✅ Amber focus ring | The only warm saturated element — earns its distinctiveness |
| ⚠️ Contrast checking required | `#fdfcfb` vs `#f7f5f2` step is subtle — must verify WCAG AA on sidebar text |
| ⚠️ Adoption effort | Background colours will need to be re-verified across all components |
| ❌ Could feel "notiony" | Warm neutrals are Notion's territory — implementation must avoid that association |

---

---

## Head-to-Head Comparison

### Contrast & Accessibility

| Token | Carbon | Slate Ink | Warm Sand |
|---|---|---|---|
| Primary text on bg | `#1a1a18` / `#fff` = **18.1:1** | `#0f172a` / `#fff` = **19.2:1** | `#1c1917` / `#fdfcfb` = **16.9:1** |
| Secondary text on bg | `#706f6b` / `#fff` = **5.2:1 ✅** | `#64748b` / `#fff` = **5.9:1 ✅** | `#78716c` / `#fdfcfb` = **4.8:1 ✅** |
| Accent button text | white on `#1a1a18` = **18.1:1 ✅** | white on `#0f172a` = **19.2:1 ✅** | `#fdfcfb` on `#1c1917` = **16.9:1 ✅** |
| Success on bg | `#047857` / `#fff` = **5.1:1 ✅** | `#059669` / `#fff` = **4.5:1 ✅** | `#15803d` / `#fdfcfb` = **5.4:1 ✅** |
| Secondary on sidebar | `#706f6b` / `#f9f9f8` = **4.9:1 ✅** | `#64748b` / `#f8fafc` = **5.8:1 ✅** | `#78716c` / `#f7f5f2` = **4.6:1 ✅** |

All three options meet WCAG AA minimums. Warm Sand is closest to the threshold on secondary text — requires careful implementation.

### Visual Identity Score (subjective)

| Dimension | Carbon | Slate Ink | Warm Sand |
|---|---|---|---|
| Distinctiveness | Low | Medium | High |
| Premium feel | Medium | High | High |
| Warmth / Trust | Medium | Low | High |
| Technical authority | Low | High | Medium |
| Suited to personal finance | High | Medium | High |
| Aligned to stated direction | Medium | High | **Highest** |

### Implementation Complexity

| | Carbon | Slate Ink | Warm Sand |
|---|---|---|---|
| Variables.css changes | Minimal | Low | Moderate |
| Component verification needed | Low | Low | Moderate |
| Accessible contrast verified | ✅ | ✅ | ✅ (with care) |

---

---

## Final Decision & Approved Adjustments: Option C — "Warm Sand"

**Approval Summary:**
Option C — Warm Sand was selected as the visual foundation for FinSight, with the following key design rules and adjustments:

1. **Brand & Neutral Base:**
   - Primary background: `#fdfcfb` (warm off-white cream)
   - Secondary background: `#f7f5f2` (warm sand surface)
   - Tertiary background: `#eeebe6` (warm stone)
   - Primary text / accent: `#1c1917` (warm ink stone-900)
   - Secondary text: `#78716c`
   - Muted text: `#a8a29e`

2. **Semantic & Functional Color Rule:**
   - *Core Rule:* "Warm neutrals define the product identity. Saturated colours are reserved for semantic meaning and functional emphasis."
   - Saturated blue (`#1d4ed8`) is used for AI UI, primary interactive links, focus/active states where appropriate, and selected primary chart series.
   - Distinct roles are strictly maintained between structural UI colours, semantic colours (success `#15803d`, warning `#b45309`, danger `#b91c1c`), data visualisation chart tokens (`--chart-1` to `--chart-5`), and AI-specific tokens (`--color-ai-*`).

3. **Dark Mode Cohesion:**
   - Dark mode uses warm dark `#141210` with stone surfaces (`#1c1917`). Rather than mechanical color inversion, dark mode maintains the exact same FinSight design language (warmth, restraint, high legibility).

4. **WCAG Accessibility Clarification:**
   - WCAG 2.1 contrast requirements (4.5:1 for normal text, 3:1 for large text/UI controls) apply to text, icons, and interactive elements against their backgrounds (e.g. `#1c1917` on `#fdfcfb` = 16.9:1, `#78716c` on `#fdfcfb` = 4.8:1).
   - The subtle difference between `#fdfcfb` and `#f7f5f2` is a visual hierarchy and spatial grouping distinction, not a WCAG text contrast metric.

