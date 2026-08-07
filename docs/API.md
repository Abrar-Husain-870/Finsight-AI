# API Reference

The FinSight backend is powered by Express 5, strictly adhering to RESTful principles. All API responses follow a standardized envelope format to ensure predictable frontend parsing.

## Standardized Response Envelope

**Success (2xx):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error (4xx, 5xx):**
```json
{
  "error": {
    "message": "Human readable error message",
    "code": "ERROR_CODE",
    "requestId": "uuid-for-tracing"
  }
}
```

## Endpoints Overview

All endpoints (except Authentication) require a valid JWT Access Token passed in the `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)
- `POST /login`: Authenticates a user and issues JWT (returns `accessToken`, sets `refreshToken` HttpOnly cookie).
- `POST /register`: Creates a new user.
- `POST /refresh`: Uses the HttpOnly cookie to issue a new `accessToken`.
- `POST /logout`: Invalidates the session and clears cookies.

### Transactions (`/api/transactions`)
- `GET /`: Retrieves paginated transactions. Supports filtering by `dateRange` and `categoryId`.
- `POST /`: Creates a new transaction.
- `PUT /:id`: Updates an existing transaction.
- `DELETE /:id`: Soft deletes a transaction.

### Analytics & Dashboard
- `GET /api/dashboard/summary`: Retrieves lightweight 30-day cash flow aggregates and recent transactions.
- `GET /api/analytics/summary`: Heavy endpoint retrieving category breakdowns, spending velocity, and AI-generated insights.
- `GET /api/health-score`: Calculates the deterministic 0-100 financial health score.

### Goals (`/api/goals`)
- `GET /`: Retrieves all active goals with dynamic feasibility calculations based on current cash flow.
- `POST /`: Creates a new goal.
- `PUT /:id`: Updates goal progress or targets.

### AI Coach (`/api/ai`)
- `POST /chat`: Initiates a streaming LLM response grounded in the user's financial context.
- `GET /config`: Retrieves the user's encrypted AI provider configuration status.
- `POST /config`: Saves and encrypts a new Groq/OpenAI API key.

### Import & Demo
- `POST /api/import/csv`: Accepts a `multipart/form-data` CSV file and intelligently maps it to categories.
- `POST /api/demo/seed`: Wipes current user data and generates 6 months of interconnected, realistic synthetic data for presentations.
