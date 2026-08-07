# Security

FinSight implements enterprise-grade security principles tailored for a modern web application, ensuring that sensitive financial metadata and AI credentials remain completely secure.

## AI Credential Encryption (AES-256-GCM)

Because users supply their own OpenAI or Groq API keys to power the AI Coach, securely storing these keys is paramount.

- **Algorithm**: We use `AES-256-GCM` (Galois/Counter Mode), an authenticated encryption algorithm.
- **Implementation**: Before an API key is saved to the PostgreSQL database, it is encrypted using a 32-byte master `ENCRYPTION_KEY` injected via environment variables.
- **Authentication Tag**: GCM provides an authentication tag alongside the ciphertext. If a malicious actor compromises the database and attempts to manipulate the ciphertext, the decryption process will violently fail, preventing tampering.

## Authentication System

FinSight avoids heavy third-party authentication providers in favor of a robust, self-hosted JSON Web Token (JWT) architecture.

1. **Access Tokens**: Short-lived (15 minutes), stateless JWTs used for API authorization.
2. **Refresh Tokens**: Long-lived (7 days), stored securely in the database and issued to the client via an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
3. **Protection**: Because the refresh token is `HttpOnly`, it is completely invisible to JavaScript, neutralizing Cross-Site Scripting (XSS) attacks designed to steal sessions.

## Rate Limiting

To prevent brute-force attacks and denial-of-service, FinSight employs a global in-memory rate limiter using `express-rate-limit`.

- **Global Limit**: 100 requests per 15 minutes per IP address.
- **AI Endpoints**: Stricter limits can be applied to AI endpoints to prevent abusive API consumption.

## SQL Injection Prevention

FinSight exclusively utilizes **Prisma ORM** for database interactions. Prisma automatically parameterizes all queries under the hood, making traditional SQL injection attacks mathematically impossible.

## Security Headers

The backend integrates `helmet.js` to automatically set crucial HTTP response headers:
- `Content-Security-Policy`
- `X-Frame-Options` (DENY to prevent clickjacking)
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options` (nosniff)
