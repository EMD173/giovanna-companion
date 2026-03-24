# Giovanna Companion — Project Conventions

> These rules govern all code generation for this project.
> Updated: March 21, 2026

## Architecture

- **Stack**: React 18 + TypeScript + Vite + Firebase (Firestore, Auth, Cloud Functions)
- **Styling**: Inline styles via `shared/theme.ts` — NOT Tailwind. Import `sanctuary` and `typography` from `../shared/theme`.
- **State**: React Context providers (AuthContext, FamilyContext, SubscriptionContext, ECModeContext)
- **AI**: All AI calls go through `src/services/aiService.ts` → Firebase Cloud Functions. No direct API calls from the client.

## Critical Field Names

- **Family ownership**: The canonical field is `adminId` on the `families` Firestore collection. Firestore rules check `adminId`. The `FamilyProfile` TypeScript interface has both `adminId` (canonical) and `userId` (legacy alias). Always set both when creating a family document.
- **Never use `ownerId`** — this field does not exist in the data model.

## Firebase Config

- All Firebase config values come from environment variables (`import.meta.env.VITE_FIREBASE_*`).
- Never hardcode API keys, project IDs, or other config in source files.
- See `apps/web/.env.example` for required variables.

## Routing

- All authenticated routes are wrapped in `<ProtectedRoute />` in `App.tsx`.
- New pages that require login must be placed inside the `<Route element={<ProtectedRoute />}>` block.
- Public routes (Landing, Signup, Onboarding, Learn) are outside the protected block.

## Firestore Rules

- Subscriptions: clients can `create` their own doc, but only Cloud Functions (Admin SDK) can `update`.
- Families: `create` requires auth; `read/update/delete` requires `adminId == auth.uid`.
- ABC entries, children, strategies, share packets: access via `isFamilyOwner()` which checks `adminId`.

## AI Service

- `src/services/aiService.ts` is the only client-side AI interface.
- It calls `giovannaChat` Cloud Function via `httpsCallable`.
- ChatPage.tsx sends child context + conversation history in every message.
- Crisis detection is local (no API latency) — see `CRISIS_KEYWORDS` in ChatPage.tsx.

## Content Guardrails

- `src/lib/guardrails.ts` validates content against deficit language, compliance framing, cure-seeking, and ableist patterns.
- All user-facing content that describes children or behaviors should be run through `validateContent()`.
- Share packets must be guardrails-validated before generation.

## Language

- Default to identity-first language per autistic self-advocate preferences.
- Never use: "low-functioning", "suffering from", "special needs", "cure autism", "overcome autism".
- See `content/scholars/LANGUAGE_GUIDE.md` for the full reference.

## Theme System

- Interior pages use the `sanctuary` theme (warm parchment light mode).
- Landing page and onboarding use the `immersive` theme (Afrofuturist dark mode).
- Typography: `Playfair Display` for headings, `Inter` for body.
- Color palette: gold (#D4AF37), sage (#7A9E7E), purple (#6B4C9A), rose (#B85450).

## File Structure

```
src/
  components/       # Reusable UI components
  components/ec/    # Epigenetic Consciousness lens components
  components/onboarding/  # Intake wizard steps
  components/regulation/  # Parent check-in, sensory tracking
  components/village/     # Community/support network features
  contexts/         # React Context providers
  data/             # Static data, schemas, tier config
  hooks/            # Custom React hooks
  lib/              # Firebase init, guardrails, utilities
  pages/            # Route-level page components
  services/         # API service layer (aiService)
  shared/           # Theme system
  styles/           # Brand design system tokens
  types/            # TypeScript type definitions
```
