# FinSight

<div align="center">
  <h3>Intelligent Personal Finance, Grounded in Deterministic Analytics.</h3>
  <p>A privacy-first financial intelligence platform built for precision, explainability, and speed.</p>
</div>

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#getting-started">Getting Started</a>
</div>

<br />

<div align="center">
  <img src="assets/screenshots/dashboard.png" alt="FinSight Dashboard" width="100%" />
  <br />
  <em>FinSight Dashboard: 30-day velocity, cash flow, and health metrics.</em>
</div>

---

## Overview

FinSight is a modern, high-performance personal finance manager designed to solve the limitations of generic expense trackers. It combines **strictly deterministic financial modeling** with a **privacy-first AI Coach** to deliver insights you can actually trust. 

Unlike typical AI wrappers that naively feed raw transactions into an LLM and hope for accurate math, FinSight computes every metric (cash flow, velocity, feasibility, health score) mathematically on the backend. The AI engine is only granted access to these pre-calculated aggregates, completely eliminating financial hallucinations while providing deeply contextual advice.

## Why FinSight?

- **Zero Financial Hallucinations**: LLMs are language engines, not calculators. By calculating everything deterministically in our architecture and passing the results to the AI context window, the AI explains the math rather than doing it.
- **Privacy by Design**: Your raw transaction history is never bulk-exported to proprietary models. You configure your own API keys (Groq or OpenAI), keeping you in control.
- **Architectural Precision**: We store all currency as minor units (e.g., cents) in a PostgreSQL database using Prisma, avoiding floating-point precision loss.
- **Premium UX**: Built with React 19, Tailwind CSS v4, Framer Motion, and TanStack Query, the interface feels instantaneous, fluid, and native.

## Features

- **🧠 Contextual AI Coach**: Understands your recent cash flow, category velocity, and goal feasibility.
- **📊 Deterministic Analytics**: Track your exact daily spending velocity and historical trends.
- **🩺 Financial Health Score**: A mathematically derived 0-100 score indicating your financial stability.
- **🎯 Dynamic Goal Planning**: Automatically detects if a savings goal is unrealistic given your historical cash flow.
- **🔮 What-If Simulations**: Safely simulate salary changes or major purchases to see the projected impact on your health score.
- **⚡ Smart Import Pipeline**: Safely ingest bank CSVs with automatic categorization mapping.
- **🎭 Presentation Mode**: A built-in demo workspace with 6 months of synthetic data and guided tours, perfect for showcases and evaluations.

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory.

- 🏗️ **[Architecture Overview](./docs/Architecture.md)**: Explore our layered Controller-Service-Repository pattern.
- 🤖 **[AI Pipeline & Grounding](./docs/AI.md)**: How we prevent LLM hallucinations.
- 🔒 **[Security & Cryptography](./docs/Security.md)**: AES-256-GCM encryption and JWT strategies.
- ⚡ **[Performance Optimizations](./docs/Performance.md)**: Caching, rendering, and database indexing.
- 🗄️ **[Database Schema (ER Diagram)](./docs/Database.md)**: Normalization and relational design.
- 🧠 **[Engineering Decisions](./docs/Engineering-Decisions.md)**: Why we chose our specific stack.
- 🎓 **[Viva & Evaluation Guide](./docs/Viva-Guide.md)**: Limitations, tradeoffs, and academic context.
- 🚀 **[API Reference](./docs/API.md)**: RESTful endpoint specifications.

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query, Recharts, Framer Motion
- **Backend**: Node.js, Express.js 5, TypeScript, Prisma ORM, Pino (Logging)
- **Database**: PostgreSQL (Neon)
- **AI Integration**: Official SDKs (OpenAI, Groq)
- **Infrastructure**: Vercel (Frontend), Render (Backend)

## Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm (v9+)
- PostgreSQL Database URL

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
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/finsight"
JWT_SECRET="your-secure-jwt-secret-minimum-32-chars"
ENCRYPTION_KEY="your-32-byte-hex-encryption-key" # Must be exactly 32 bytes (64 hex characters)
FRONTEND_URL="http://localhost:5173"
```

### 4. Database Setup
```bash
cd backend
pnpm prisma db push
```

### 5. Start Development Servers
From the repository root:
```bash
pnpm dev
```
- Frontend will be available at `http://localhost:5173`
- Backend API will be available at `http://localhost:3000`

## Demo Workspace

FinSight includes a robust demonstration mode. If you are a recruiter, evaluator, or just exploring the project:
1. Register a new account.
2. In the bottom-left sidebar, click **"Load Demo Workspace"**.
3. This will instantly seed your account with 6 months of interconnected, mathematically coherent financial history, active goals, and a pre-populated AI chat history to perfectly demonstrate the platform's capabilities.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
