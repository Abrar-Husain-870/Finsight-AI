# Research Context

FinSight was developed as a Final Year Engineering Project to address structural flaws in existing Personal Finance Management (PFM) and AI-assisted financial tools.

## The Problem Statement

Current AI-driven financial applications suffer from three critical flaws:
1. **The Hallucination Problem:** Large Language Models (LLMs) are stochastic text generators, not arithmetic calculators. When fed raw CSVs of thousands of transactions and asked "How much did I spend on food?", models frequently hallucinate totals, rendering the financial advice dangerous and untrustworthy.
2. **The Privacy Dilemma:** Users are deeply uncomfortable allowing startups to ingest, store, and continuously fine-tune models on their sensitive, raw banking data.
3. **The Static UX Problem:** Traditional PFMs present static charts. They tell you *what* happened, but require the user to analyze *why* it happened or *how* to fix it.

## The FinSight Solution (Our Research Contribution)

FinSight addresses these problems through a hybrid architectural model known as **Strictly Grounded Retrieval-Augmented Generation (Grounded-RAG for Math)**.

1. **Deterministic Pre-computation:** FinSight intercepts all mathematical queries *before* they reach the AI. The backend PostgreSQL database and Prisma ORM perform exact, integer-based queries (e.g., aggregating 30-day velocity). 
2. **Context Injection:** Instead of passing raw data, FinSight injects these mathematically infallible aggregates into the LLM's system prompt.
3. **Role Restriction:** The LLM is restricted via system prompts to act solely as an *interpreter* of the provided math, rather than a calculator.

### Result
This architecture ensures 100% mathematical accuracy while retaining the conversational nuance of an LLM. Furthermore, because only aggregates are sent, the payload sizes to the LLM are drastically reduced, preventing massive token consumption and minimizing data exposure.
