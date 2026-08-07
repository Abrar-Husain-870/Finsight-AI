# Presentation Guide

If you are evaluating FinSight for a university viva, recruitment portfolio review, or showcasing it to users, this guide will help you deliver an unforgettable 5-minute presentation.

## 1. The Demo Workspace

A major hurdle when presenting financial software is the "Empty State Problem". A dashboard with zero data is impossible to demonstrate.

FinSight includes a robust synthetic data seeder.
1. Create a brand new account.
2. In the bottom-left of the sidebar, click **"Load Demo Workspace"**.
3. *What this does:* The backend wipes any existing data for the user and procedurally generates a coherent 6-month financial history. It creates realistic salary income, rent, variable expenses, smart goals, and an AI chat history. 

## 2. Presentation Mode

When projecting your screen or sharing via Zoom, high-density UIs can be difficult to read.
1. Click **"Presentation Mode"** in the sidebar.
2. *What this does:* It expands the UI from a fixed `max-w-7xl` container to fill the screen, marginally increases font weights, and optimizes chart colors for projectors.

## 3. The Guided Tour

To explain the architecture without diving into source code:
1. Click **"About FinSight"** in the sidebar.
2. Click **"Start Interactive Tour"**.
3. *What this does:* `driver.js` will highlight key sections of the interface (Dashboard, Health Score, AI Coach) while explaining the backend architecture that powers them.

## 4. Demonstrating the AI

The best way to prove FinSight's deterministic architecture is through the AI Quick Prompts.
Navigate to the **AI Coach** and click the quick prompt:
> *"What would happen if my salary increased by ₹10,000?"*

The AI will immediately respond using the user's exact current salary, calculate the new total, and explain how the increased cash flow could accelerate the specific goals (e.g., "Emergency Fund") that were seeded by the Demo Workspace.
