# Performance

FinSight is designed to feel instantaneous. Financial applications that suffer from heavy loading times drastically reduce user engagement. To combat this, we have implemented several layers of performance optimization across the stack.

## Frontend Optimizations

### 1. State Management Bifurcation
We strictly separate Server State from Client State:
- **TanStack Query (Server State)**: Caches API responses aggressively. When a user navigates between the Dashboard and Analytics pages, TanStack Query serves the cached data instantly while validating in the background (`stale-while-revalidate`), resulting in zero perceived loading time.
- **Zustand (Client State)**: Manages UI ephemeral state. By using selective state subscriptions (`useUiStore(state => state.presentationMode)`), we prevent unnecessary global re-renders when UI state changes.

### 2. Route Pre-fetching
The sidebar navigation implements intelligent pre-fetching. When a user hovers over a navigation link (e.g., `Analytics`), Vite dynamically imports the chunk containing the Analytics page components *before* the user clicks, ensuring the navigation is truly instant.

### 3. Render Optimization & Debouncing
- **Search & AI Streaming**: Text inputs used for transaction searching and AI context building are debounced. This prevents the React tree from re-rendering on every single keystroke.
- **Framer Motion**: Animations utilize hardware-accelerated CSS transforms (`translate`, `scale`, `opacity`) instead of animating layout properties (like `width` or `margin`), avoiding expensive browser repaints.

## Backend Optimizations

### 1. Database Indexing
The PostgreSQL database has been meticulously indexed based on actual query patterns:
```prisma
@@index([userId, date]) // Optimized for dashboard time-series queries
```
By creating composite indexes on `userId` and `date`, queries that aggregate 30-day transactional velocity run in sub-millisecond times, avoiding full table scans.

### 2. Memoized Context Building
When the AI Context Builder requests transactional data, it utilizes parallel execution (`Promise.all`) to fetch categories, transactions, and goals simultaneously rather than awaiting them sequentially, drastically reducing the time-to-first-byte (TTFB) for AI streaming.

### 3. Payload Reduction
Instead of hydrating the entire user object or fetching full categories on every request, backend routes aggressively use Prisma's `select` argument to only return the exact fields required by the frontend payload, minimizing JSON parsing overhead.
