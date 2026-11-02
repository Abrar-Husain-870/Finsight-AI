# FinSight

<div align="center">
  <h3>Intelligent Personal Finance, Grounded in Deterministic Analytics.</h3>
  <p>A privacy-first, enterprise-grade financial intelligence platform built for mathematical precision, cyber defense, and speed.</p>

  <p>
    <img src="https://img.shields.io/badge/Tests-76%2F76%20Passed%20(100%25)-success?style=flat-square" alt="Tests" />
    <img src="https://img.shields.io/badge/Security-OWASP%20Top%2010%20Hardened-blue?style=flat-square" alt="Security" />
    <img src="https://img.shields.io/badge/Node.js-v22+-green?style=flat-square" alt="Node" />
    <img src="https://img.shields.io/badge/TypeScript-5.5+-blue?style=flat-square" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-18+-indigo?style=flat-square" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/React-19-cyan?style=flat-square" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square" alt="Tailwind" />
  </p>
</div>

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#why-finsight">Why FinSight?</a> •
  <a href="#features">Features</a> •
  <a href="#cybersecurity--defense-in-depth">Cybersecurity</a> •
  <a href="#architecture--monorepo-structure">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#automated-testing--verification">Testing</a> •
  <a href="#api-reference">API</a>
</div>

<br />

<div align="center">
  <img src="assets/screenshots/dashboard.png" alt="FinSight Dashboard" width="100%" />
  <br />
  <em>FinSight Dashboard: 30-day velocity telemetry, net cash flow, and 4-pillar financial health score.</em>
</div>

---

## Overview

FinSight is a modern, high-performance personal finance platform designed to eliminate the fundamental flaws of legacy budgeting apps and naive AI wrappers. It couples **strictly deterministic financial modeling** with a **privacy-first Grounded AI Coach** to deliver explainable, reliable guidance.

Typical AI finance apps indiscriminately pipe raw user transaction logs to an LLM, leading to arithmetic hallucinations, prompt injection vulnerabilities, and severe privacy leaks. **FinSight flips this paradigm:** all analytics, cash flow trajectories, goal feasibility curves, and health scores are computed **deterministically on the backend** with exact minor-unit integer precision. The AI model only receives clean, pre-calculated aggregates, ensuring **zero hallucinations** while preserving contextual intelligence.

---

## Why FinSight?

- **Zero Financial Hallucinations**: LLMs are language engines, not calculators. All mathematical projections, spending velocities, and health indices are computed via deterministic backend algorithms. The AI explains the numbers—it never invents them.
- **Enterprise-Grade Cyber Defense**: Built with a defense-in-depth posture mitigating the OWASP Top 10 and CWE Top 25: constant-time timing attack mitigation, SSRF defense against cloud metadata endpoints, BOLA/IDOR database-level access controls, prototype pollution guards, XSS neutralization, and multi-tier rate limiters.
- **Floating-Point Precision Loss Prevention**: All monetary figures are strictly validated and stored as minor units (e.g., cents as 32-bit integers), preventing IEEE 754 floating-point drift over thousands of ledger entries.
- **Client-Controlled AI Privacy**: API keys (Groq or OpenAI) are stored client-side or symmetrically encrypted in PostgreSQL using **AES-256-GCM** with authenticated random initialization vectors (IVs).
- **Sub-Millisecond UI Experience**: Built on React 19, Tailwind CSS v4, Framer Motion, and TanStack Query with optimistic cache updates and server-side streaming responses (SSE).

---

## Features

- **🧠 Grounded AI Financial Coach**: Explains your finances using real context (net cash flow, top spending categories, savings velocity, health index) with SSE streaming tokens.
- **📊 Deterministic Analytics & Velocity Telemetry**: Real-time daily burn rate tracking, historical monthly trends, and automated heuristic alerts (e.g., spending spikes, negative net flow).
- **🩺 4-Pillar Financial Health Engine**: A deterministic 0–100 score synthesized across Savings Rate (35%), Expense Control (25%), Category Balance (20%), and Velocity Discipline (20%).
- **🎯 Dynamic Savings Goal Feasibility Engine**: Automatically calculates required monthly contributions and evaluates feasibility (`ACHIEVABLE`, `STRETCH`, or `UNREALISTIC`) against actual cash flow capacity.
- **🔮 Counterfactual What-If Simulation**: Model hypothetical income promotions or expense reductions with real-time recalculated health scores and net flow diffs.
- **⚡ Hardened CSV Ingestion Pipeline**: Ingest bank statements with automatic column mapping, category pattern suggestions, duplicate detection, and automated formula injection neutralization.
- **🎭 Procedural Presentation Mode**: One-click demo workspace seeding a realistic 6-month synthetic ledger, active goals, and pre-populated conversation history.

---

## Cybersecurity & Defense-in-Depth

FinSight incorporates a hardened security architecture verified by an automated 15-vector penetration test suite:

```mermaid
flowchart TD
    Attacker["External Adversary / Malicious Request"]

    subgraph DefensePerimeter["FinSight Defense-in-Depth Perimeter"]
        direction TB
        L1["Layer 1: Network & Protocol Hardening<br/>(Strict CORS Origin Allowlist, Helmet HSTS 1-Yr Preload, Frameguard DENY, NoSniff)"]
        L2["Layer 2: Ingestion & DoS Quotas<br/>(1MB JSON Limit, 5MB File Upload Quota, 5,000-Row CSV Ceiling, Multi-Tier Rate Limiters)"]
        L3["Layer 3: Sanitization & Neutralization<br/>(PostgreSQL Null-Byte Stripper, Stored XSS Neutralizer, Prototype Pollution Guard)"]
        L4["Layer 4: Cryptographic & Auth Engine<br/>(HS256 Pinning, Equalized Constant-Time Bcrypt, AES-256-GCM AI Key Vault)"]
        L5["Layer 5: Access Control & Authorization<br/>(Atomic DB where: { id, userId }, SSRF Outbound Link-Local/Private IP Guard)"]
    end

    Attacker --> L1
    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> CoreApp[("Secure Backend Engine & PostgreSQL Database")]
```

### Key Security Controls

1. **User Enumeration & Timing Attack Defense (CWE-208)**: Login routines execute a dummy `bcrypt.compare` on non-existent accounts using `DUMMY_BCRYPT_HASH`, equalizing response timing and preventing email enumeration.
2. **Server-Side Request Forgery (SSRF) Defense (OWASP A10)**: AI custom endpoints are validated against `isSafeOutboundUrl`, blocking cloud metadata endpoints (`169.254.169.254`), loopbacks (`127.0.0.0/8`, `localhost`), and RFC 1918 private subnets.
3. **Broken Object Level Authorization (BOLA / IDOR) Elimination (OWASP A01)**: All resource mutations (goals, transactions, chat sessions) enforce atomic database checks (`where: { id, userId }`), preventing cross-tenant data tampering.
4. **Bcrypt Payload Bomb / CPU Starvation DoS (CWE-400)**: Password schemas enforce `z.string().max(128)`, rejecting oversized inputs ($>100\text{KB}$) before they can trigger compute-heavy bcrypt KDF operations.
5. **CSV Formula Injection / DDE Neutralization (CWE-1236)**: Cells beginning with formula triggers (`=`, `+`, `-`, `@`, `\t`, `\r`) are automatically escaped with a leading single quote (`'`).
6. **Input Sanitization & Prototype Pollution**: All incoming payloads are sanitized against PostgreSQL null bytes (`\0`), HTML script tags (`<script>`, `javascript:`, DOM event handlers), and prototype-polluting keys (`__proto__`, `constructor`, `prototype`).
7. **Multi-Tier Rate Limiting**:
   - **Global**: 1,000 requests / 15 min per IP.
   - **Auth**: 20 requests / 15 min per IP on `/login`, `/register`, `/demo`, `/refresh`.
   - **AI Chat**: 15 requests / 1 min per IP on `/api/ai/chat`.
   - **Workspace Seeding**: 10 requests / 15 min per IP on `/api/demo/seed`.
   - **CSV Ingestion**: 25 requests / 15 min per IP on `/api/import/preview` and `/commit`.

---

## Architecture & Monorepo Structure

FinSight is organized as a high-efficiency `pnpm` workspace monorepo:

```
finsight/
├── backend/                  # Express 5 REST API & Computation Engine
│   ├── prisma/               # PostgreSQL schema & idempotent category taxonomy seed
│   ├── src/
│   │   ├── core/             # Middleware (auth, rate-limit, sanitize, errors, SSRF util)
│   │   ├── features/         # Modular feature modules (Controller-Service-Repository)
│   │   │   ├── ai/           # Grounded AI coach & AES-256-GCM encryption vault
│   │   │   ├── analytics/    # Velocity telemetry & historical aggregations
│   │   │   ├── auth/         # JWT (HS256), bcrypt, cookie management
│   │   │   ├── categories/   # Hierarchical taxonomy tree
│   │   │   ├── dashboard/    # Monthly rollups & summary telemetry
│   │   │   ├── demo/         # Procedural 6-month synthetic ledger seeder
│   │   │   ├── goals/        # Dynamic feasibility state machine
│   │   │   ├── health/       # Deterministic 4-pillar scoring engine
│   │   │   ├── import/       # Hardened CSV ingestion pipeline
│   │   │   ├── simulation/   # Counterfactual projection calculator
│   │   │   └── transactions/ # Minor-unit ledger CRUD & absolute-value sorting
│   │   ├── test-suite.ts     # 38-test functional integration suite
│   │   ├── stress-and-edge-test.ts # 23-test load & boundary suite
│   │   └── security-audit-test.ts  # 15-test cyber penetration suite
│   └── package.json
├── frontend/                 # React 19 Client SPA
│   ├── src/
│   │   ├── components/       # Fluid UI components & modals
│   │   ├── features/         # Page controllers & visualizations
│   │   ├── services/         # TanStack Query API service layer
│   │   └── store/            # Lightweight Zustand global state
│   ├── vite.config.ts
│   └── package.json
├── shared/                   # Shared TypeScript contracts & schemas
│   ├── src/
│   │   ├── schemas/          # Zod validation schemas with length & boundary limits
│   │   ├── types/            # Canonical TypeScript interfaces
│   │   └── utils/            # Money arithmetic & deterministic health math
│   └── package.json
├── docs/                     # Architectural & evaluation documentation
└── package.json              # Monorepo root scripts & configurations
```

---

## Getting Started

### Prerequisites

- **Node.js**: v20+ (v22 LTS recommended)
- **pnpm**: v9+
- **PostgreSQL**: v16+ running locally or in the cloud

### 1. Clone the repository

```bash
git clone https://github.com/MohdSajidJafri/FinalYearProject.git finsight
cd finsight
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Configuration

#### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finsight"

# 32-byte hexadecimal secrets (or 64-char strings)
JWT_SECRET="generate-a-secure-32-byte-hex-string-for-access-token"
JWT_REFRESH_SECRET="generate-a-secure-32-byte-hex-string-for-refresh-token"
ENCRYPTION_KEY="generate-a-secure-32-byte-hex-string-for-ai-vault"

FRONTEND_URL="http://localhost:5173"

# Optional OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

#### Frontend Configuration
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Database Migration & Taxonomy Seeding

Push the schema to your PostgreSQL database and seed the default category taxonomy (`INCOME`, `EXPENSE`, `SAVINGS`, `INVESTMENT`):

```bash
# Push Prisma schema to PostgreSQL
pnpm --filter @finsight/backend prisma db push

# Idempotently seed default category taxonomy
pnpm --filter @finsight/backend prisma db seed
```

### 5. Start Development Servers

Run both the frontend and backend in parallel from the root directory:

```bash
pnpm dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **API Root Directory**: `http://localhost:3001/api`
- **Health Check Endpoint**: `http://localhost:3001/api/health`

---

## Automated Testing & Verification

FinSight features a unified **76-scenario test battery** with **100% pass rate**:

```bash
# Run the complete test battery (Functional + Stress + Cyber Penetration)
pnpm --filter @finsight/backend test

# Run only the 38 functional integration scenarios
pnpm --filter @finsight/backend test:functional

# Run only the 23 production load & boundary scenarios
pnpm --filter @finsight/backend test:stress

# Run only the 15 cyber security penetration tests
pnpm --filter @finsight/backend test:security

# Typecheck all monorepo packages
pnpm -r typecheck

# Build all monorepo packages for production
pnpm -r build
```

### Test Suite Highlights
- **Functional Integration (`test-suite.ts`)**: 38 tests validating session lifecycles, ledger CRUD, soft-deletes, cash flow calculations, goal engines, and CSV parsing in **~1.8s**.
- **Load & Concurrency (`stress-and-edge-test.ts`)**: 23 scenarios benchmarking **50 concurrent requests** (avg 2.1 ms), **100 batch transaction inserts**, zero-state division-by-zero resilience, and cascade wipes in **~9.8s**.
- **Cyber Penetration (`security-audit-test.ts`)**: 15 scenarios simulating live exploits (bcrypt bombs, user enumeration timing attacks, SSRF metadata probes, BOLA/IDOR cross-tenant drains, XSS injection, CSV formula injection) with **100% mitigation**.

---

## API Reference

The backend provides a standardized JSON envelope for all responses:

- **Success Envelope**: `{ success: true, data: T, meta?: { ... } }`
- **Error Envelope**: `{ success: false, error: { code: string, message: string, requestId?: string, details?: unknown } }`

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api` | Root API metadata and route discovery directory | No |
| `GET` | `/api/health` | PostgreSQL connectivity and server uptime status | No |
| `POST` | `/api/auth/register` | Register account (strict Zod email/password limits) | No |
| `POST` | `/api/auth/login` | Login user (constant-time verification) | No |
| `POST` | `/api/auth/demo` | Instant demo login | No |
| `POST` | `/api/auth/refresh` | Rotate JWT access token using HttpOnly cookie | No |
| `POST` | `/api/auth/logout` | Revoke refresh token and clear cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `GET` | `/api/categories` | Retrieve flat category taxonomy | Yes |
| `GET` | `/api/categories/tree` | Retrieve nested category tree hierarchy | Yes |
| `GET` | `/api/transactions` | Filtered, paginated transaction ledger | Yes |
| `POST` | `/api/transactions` | Create transaction (minor-unit integer storage) | Yes |
| `PATCH` | `/api/transactions/:id` | Update transaction (scoped to owner) | Yes |
| `DELETE` | `/api/transactions/:id`| Soft-delete transaction record | Yes |
| `GET` | `/api/dashboard/summary` | Net cash flow, spending pace, 6-month trends | Yes |
| `GET` | `/api/analytics/summary`| Spending velocity telemetry and breakdown | Yes |
| `GET` | `/api/health-score` | Deterministic 4-pillar financial score (0-100) | Yes |
| `GET` | `/api/goals/summary` | Savings goals with cash-flow feasibility curves | Yes |
| `POST` | `/api/goals` | Create target savings goal | Yes |
| `PATCH` | `/api/goals/:id` | Update goal (atomic database ownership check) | Yes |
| `POST` | `/api/simulation/run` | Counterfactual projection modeling | Yes |
| `GET` | `/api/ai/config` | View configured AI provider without exposing key | Yes |
| `POST` | `/api/ai/config` | Save API key (AES-256-GCM) with SSRF validation | Yes |
| `POST` | `/api/ai/chat` | SSE streaming AI chat with grounded context | Yes |
| `POST` | `/api/import/preview` | Ingest CSV file with formula neutralization | Yes |
| `POST` | `/api/import/commit` | Persist parsed CSV transactions into ledger | Yes |
| `POST` | `/api/demo/seed` | Seed 6-month synthetic demo dataset | Yes |

---

## Demo Workspace

FinSight includes an interactive demonstration mode:
1. Register an account or click **"Demo Login"**.
2. Click **"Load Demo Workspace"** in the sidebar.
3. Your account is procedurally populated with 6 months of interconnected ledger entries, active savings goals, and contextual AI coaching data.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
