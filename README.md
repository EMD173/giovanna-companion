# Giovanna Companion

A lifelong, neuro-affirming AI companion for neurodivergent individuals and their families.

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions)
- **AI**: Gemini API with RAG context from Learning Hub

## Getting Started

```bash
# Install frontend dependencies
cd apps/web && npm install

# Run development server
npm run dev

# Build frontend
npm run build

# Install and build cloud functions
cd ../../functions && npm install && npm run build

# Deploy
cd .. && firebase deploy
```

## Environment Setup

```bash
# Frontend env
cp apps/web/.env.example apps/web/.env

# Functions env
cp functions/.env.example functions/.env
```

The frontend reads Firebase config from `apps/web/.env`.
The Cloud Functions code reads server-side secrets from `functions/.env`.

## Beta Readiness

- Launch checklist: `docs/BETA_LAUNCH_CHECKLIST.md`
- Repeatable smoke test: `cd apps/web && npm run smoke:beta`

## Project Structure

```
├── apps/web/          # React PWA
├── functions/         # Firebase Cloud Functions
├── docs/              # Documentation
└── content/           # Learning Hub content
```

## Philosophy

> Behavior is communication, not defiance. Regulation over compliance.

This system reimagines ABA by centering dignity, socio-cultural context, and lifelong support.
