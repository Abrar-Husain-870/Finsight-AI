# Viva & Evaluation Guide

This document is intended to prepare students for their B.Tech Final Year Project Viva Examination by providing clear answers to common architectural questions, tradeoffs, and limitations.

## Common Viva Questions

### 1. "Why did you choose React over plain HTML/JS or Angular?"
**Answer:** React's component-based architecture allowed us to build complex, highly interactive data visualization dashboards (using Recharts) that update seamlessly without page reloads. The Virtual DOM ensures that when a new transaction is added, only the affected table row and metric cards re-render, rather than the entire page, providing a premium user experience.

### 2. "How do you guarantee the AI doesn't hallucinate financial calculations?"
**Answer:** We implemented a "Deterministic RAG" (Retrieval-Augmented Generation) pipeline. The LLM never performs math. Instead, our Express backend queries the PostgreSQL database, performs exact integer arithmetic to find spending trends, and injects those final computed numbers into the AI's system prompt. The AI acts only as a conversational interface for our exact math.

### 3. "How is user data secured?"
**Answer:**
1. **In Transit:** All traffic requires HTTPS/TLS.
2. **At Rest:** Database is hosted securely.
3. **Authentication:** We use JWTs with short-lived access tokens and HttpOnly, Secure refresh cookies to prevent XSS attacks.
4. **Secrets:** User-provided AI API keys are encrypted symmetrically using AES-256-GCM before being stored in the database.

### 4. "What happens if I enter $10.55 and the system uses floating point math?"
**Answer:** It doesn't. We anticipated IEEE-754 floating point errors. Before a transaction hits the database, we multiply it by 100 and store it as an integer (`1055`). All aggregations happen on integers. It is only divided by 100 and formatted as currency at the final React render phase.

## Tradeoffs & Limitations

Being transparent about limitations shows engineering maturity.

- **No Plaid/Bank API Integration:** Real-time bank syncing requires expensive enterprise API licenses (like Plaid) and complex regulatory compliance. *Tradeoff:* We implemented a robust CSV Import pipeline instead, allowing users to upload bank statements manually.
- **Single Currency:** The MVP currently normalizes everything to a single currency. Multi-currency support would require real-time exchange rate tables and historical conversion logic, which was out of scope for the MVP timeline.

## Future Scope

If we were to continue developing FinSight, we would prioritize:
1. **WebSockets for AI Streaming:** Currently, AI streaming relies on standard HTTP streams. WebSockets would provide a more robust bidirectional pipeline.
2. **Push Notifications:** Implementing PWA Service Workers to alert users when they are approaching a spending limit.
3. **Advanced Exporting:** Generating automated PDF monthly tax reports based on category filters.
