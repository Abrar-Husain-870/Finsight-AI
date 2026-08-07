# Engineering Decisions

When building FinSight, we prioritized maintainability, type-safety, and performance. Below is the rationale for our core technology choices.

## 1. Monorepo vs Polyrepo
**Decision:** `pnpm` Workspaces (Monorepo).
**Rationale:** A personal finance app requires absolute parity between frontend interfaces and backend database schemas. By using a monorepo with a `shared` package, we can define our TypeScript interfaces (`TransactionResponse`, `GoalResponse`) once. If the backend changes a response shape, the frontend immediately fails compilation during `pnpm typecheck`, preventing runtime crashes.

## 2. Prisma ORM over Raw SQL
**Decision:** Prisma.
**Rationale:** While raw SQL via `pg` can be slightly faster, Prisma provides auto-generated, strictly-typed clients. In an application dealing with user money, type safety prevents catastrophic type-coercion errors (e.g., accidentally treating a currency string as an integer). Prisma's automatic query parameterization also completely neutralizes SQL injection vectors.

## 3. Zustand + TanStack Query
**Decision:** Bifurcated state management instead of Redux.
**Rationale:** 
- **Redux** requires massive boilerplate and traditionally stores both server data and UI state in one massive tree, leading to complex invalidation logic.
- **TanStack Query** treats the backend as the source of truth, handling caching, refetching, and stale-while-revalidate logic automatically for our transactions and analytics.
- **Zustand** is used purely for ephemeral client state (e.g., `presentationMode`, `isAboutModalOpen`) avoiding React Context re-render hell.

## 4. Minor Unit Currency Storage
**Decision:** Store all money as `Int` (cents/paise) in PostgreSQL.
**Rationale:** JavaScript uses IEEE 754 double-precision floats. This means `0.1 + 0.2 === 0.30000000000000004`. Storing floats in the database for financial apps leads to accounting errors. By storing `$10.50` as `1050`, we only ever do integer math on the backend, which is 100% precise. We divide by 100 strictly at the final render step on the frontend.

## 5. Express.js over NestJS
**Decision:** Express 5.
**Rationale:** While NestJS provides excellent structure, it introduces heavy dependency injection boilerplate. We achieved the same structural benefits (Controller -> Service -> Repository) using plain Express classes, keeping the backend bundle size small and the execution fast, while remaining easy to explain to evaluators.
