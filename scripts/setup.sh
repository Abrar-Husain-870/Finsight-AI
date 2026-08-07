#!/bin/bash
echo "Setting up FinSight..."
pnpm install
# Copy .env.example to .env
cp backend/.env.example backend/.env
echo "Setup complete!"
