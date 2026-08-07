# Security Policy

## Supported Versions

Currently, only the `main` branch (v1.0.0+) receives security updates.

## Reporting a Vulnerability

Security is a core pillar of FinSight. If you discover a vulnerability, we ask that you report it responsibly.

Please do **not** file a public GitHub issue for security vulnerabilities. Instead, please reach out to the project maintainer directly via email (or the contact method provided in the repository profile).

### What to include:
- A description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact (e.g., "Allows bypass of JWT validation").

We will acknowledge receipt of your vulnerability report within 48 hours and strive to send you regular updates about our progress.

## Scope
We are particularly interested in:
- Bypasses of the JWT authentication mechanism.
- Flaws in the AES-256-GCM encryption logic for AI keys.
- Injection attacks (SQL, XSS) that bypass current Prisma/React protections.
