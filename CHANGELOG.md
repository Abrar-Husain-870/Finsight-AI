# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Release Candidate

This marks the official Release Candidate for the FinSight B.Tech Final Year Project evaluation. The application is feature-complete, structurally sound, and heavily optimized.

### Added
- **Core Architecture:** Monorepo structure initialized with `pnpm` workspaces separating `frontend`, `backend`, and `shared` logic.
- **Authentication System:** Secure JWT-based authentication with refresh token rotation and HTTP-only cookies.
- **Deterministic Analytics Engine:** Backend service calculating spending velocity, cash flow, and 30-day trends dynamically.
- **Financial Health Score:** Algorithmic calculation scoring users from 0-100 based on exact transactional math (liquidity, burn rate, goal adherence).
- **Dynamic Goals:** Feasibility tracking based on real-time cash flow availability.
- **Simulation Engine:** Ability to safely simulate future income/expense changes to view projected impacts on the health score.
- **Privacy-First AI Coach:** Grounded RAG-style pipeline that injects deterministic metrics into the LLM context to completely eliminate financial math hallucinations. Supports user-provided API keys (Groq/OpenAI) via AES-256-GCM encrypted database storage.
- **Smart Import Pipeline:** Fast CSV ingestion with intelligent, historical-based categorization.
- **Presentation Suite:** Included `driver.js` product tour, global Presentation Mode density toggles, and a 1-click synthetic data seeder ("Load Demo Workspace") for seamless live evaluations.

### Security & Performance
- Enforced strict minor-unit integer math across the entire stack for absolute precision.
- Implemented robust `helmet` and CORS configurations on the Express backend.
- Applied debouncing to all search inputs and AI streaming interactions to reduce render overhead.
- Centralized Zustand state management alongside optimized TanStack Query caching to minimize API roundtrips.
