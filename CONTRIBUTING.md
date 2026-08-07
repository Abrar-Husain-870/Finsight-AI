# Contributing to FinSight

Thank you for your interest in contributing to FinSight! We welcome pull requests, bug reports, and feature ideas from the community.

## Development Workflow

1. **Fork & Clone:** Fork the repository to your own GitHub account and clone it locally.
2. **Install Dependencies:** Run `pnpm install` at the root to install workspace dependencies.
3. **Environment Setup:** Copy the `.env.example` (or refer to the `README.md`) to create your backend `.env` file.
4. **Branching Strategy:** Create a new branch for your feature (`feature/add-new-chart`) or bugfix (`fix/chart-rendering-bug`).
5. **Linting & Typing:** Before committing, ensure you run:
   ```bash
   pnpm lint
   pnpm typecheck
   ```
6. **Commit Format:** We prefer conventional commits (e.g., `feat: added new chart`, `fix: corrected auth middleware`).
7. **Pull Request:** Open a PR against the `main` branch. Ensure you fill out the Pull Request Template.

## Architectural Guidelines

- Do not introduce floating point math for currency. Always use integers (minor units) and utilize the `shared` workspace types.
- Ensure the AI Controller remains restricted. Do not pass raw transactional rows to the LLM; always compute aggregates in the backend service layer first.
- If adding a frontend feature, verify it works in both Light and Dark mode.

Thank you for helping make FinSight better!
