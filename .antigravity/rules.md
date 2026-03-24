# Giovanna Companion — Project Rules

> These rules govern all code generation for this project.
> Updated: March 21, 2026

## Architecture

- **Stack**: React 18 + TypeScript + Vite + Firebase (Firestore, Auth, Cloud Functions)
- **Styling**: Inline styles via `shared/theme.ts` — **NOT Tailwind**. Import `sanctuary` and `typography` from `../shared/theme`. Never use Tailwind utility classes.
- **State**: React Context providers (AuthContext, FamilyContext, SubscriptionContext, ECModeContext)
- **AI**: All AI calls go through `src/services/aiService.ts` → Firebase Cloud Functions. No direct API calls from the client. Never use `fetch()` or direct HTTP calls to AI APIs.

## Critical Field Names

- **Family ownership**: The canonical field is `adminId` on the `families` Firestore collection. Firestore rules check `adminId`. The `FamilyProfile` TypeScript interface has both `adminId` (canonical) and `userId` (legacy alias). **Always set both** when creating a family document.
- **Never use `ownerId`** — this field does not exist in the data model.
- When querying families, filter by `adminId`, not `userId`.

## Firebase Config

- All Firebase config values come from environment variables (`import.meta.env.VITE_FIREBASE_*`).
- **Never hardcode API keys**, project IDs, or other config in source files.
- See `apps/web/.env.example` for required variables.

## Routing

- All authenticated routes are wrapped in `<ProtectedRoute />` in `App.tsx`.
- **New pages that require login must be placed inside the `<Route element={<ProtectedRoute />}>` block.**
- Public routes (Landing, Signup, Onboarding, Learn) are outside the protected block.
- Import ProtectedRoute from `src/components/ProtectedRoute.tsx`.

## Firestore Rules Summary

- **Subscriptions**: clients can `create` their own doc, but only Cloud Functions (Admin SDK) can `update`. Never write client-side code that updates subscription documents.
- **Families**: `create` requires auth; `read/update/delete` requires `adminId == auth.uid`.
- **ABC entries, children, strategies, share packets**: access via `isFamilyOwner()` which checks `adminId`.
- **Share packets**: NO public read access. All public sharing goes through Cloud Functions.

## AI Service

- `src/services/aiService.ts` is the **only** client-side AI interface.
- It calls `giovannaChat` Cloud Function via `httpsCallable`.
- `ChatPage.tsx` sends child context + conversation history in every message.
- Crisis detection is local (no API latency) — see `CRISIS_KEYWORDS` in `ChatPage.tsx`.
- Always check `canUseAI()` from `useSubscription()` before making AI calls.
- Always call `incrementAIUsage()` after a successful AI response.

## Content Guardrails

- `src/lib/guardrails.ts` validates content against deficit language, compliance framing, cure-seeking, and ableist patterns.
- All user-facing content that describes children or behaviors should be run through `validateContent()`.
- Share packets must be guardrails-validated before generation.
- Never generate text containing blocked terms. See the `DEFICIT_LANGUAGE`, `COMPLIANCE_FOCUS`, `CURE_SEEKING`, and `ABLEIST_FRAMING` arrays in guardrails.ts.

## Language Rules (Non-Negotiable)

- Default to **identity-first language** per autistic self-advocate preferences.
- **Never use**: "low-functioning", "high-functioning", "suffering from", "special needs", "cure autism", "overcome autism", "retarded", "afflicted with", "mental age", "non-compliant", "extinguish behavior".
- **Use instead**: "high support needs", "is autistic / has autism", "disability / support needs", "thriving as an autistic person", "address the underlying need".
- See `content/scholars/LANGUAGE_GUIDE.md` for the full reference.

## Theme System

- Interior pages: `sanctuary` theme (warm parchment light mode) from `shared/theme.ts`.
- Landing page and onboarding: `immersive` theme (Afrofuturist dark mode) from `shared/theme.ts`.
- Typography: `Playfair Display` for headings, `Inter` for body.
- Color palette: gold (#D4AF37), sage (#7A9E7E), purple (#6B4C9A), rose (#B85450).
- Use the exported helper functions: `cardStyle()`, `buttonStyle()`, `accentBadgeStyle()`.
- All components use inline `style={{}}` objects. No CSS modules, no styled-components, no Tailwind.

## Component Patterns

- Functional components with hooks only. No class components.
- Use `useAuth()` for authentication state.
- Use `useFamily()` and `useActiveChild()` for family/child data.
- Use `useSubscription()` for tier checks and feature gating.
- Use `useECMode()` for Epigenetic Consciousness lens toggle.
- Use `useABCLogs()` for behavior log data.
- All pages should have `paddingBottom: '128px'` to account for bottom navigation.

## File Structure

```
apps/web/src/
  components/              # Reusable UI components
  components/ec/           # Epigenetic Consciousness lens components
  components/onboarding/   # Intake wizard steps
  components/regulation/   # Parent check-in, sensory tracking
  components/village/      # Community/support network features
  contexts/                # React Context providers
  data/                    # Static data, schemas, tier config
  hooks/                   # Custom React hooks
  lib/                     # Firebase init, guardrails, utilities
  pages/                   # Route-level page components
  services/                # API service layer (aiService)
  shared/                  # Theme system (theme.ts)
  styles/                  # Brand design system tokens
  types/                   # TypeScript type definitions
```

## Subscription Tiers

- `free`: 30 AI queries/mo, 3 share packets/mo, 1 child profile
- `companion` ($7.99/mo): 150 AI queries, 3 profiles, data export
- `pro` ($14.99/mo): 500 AI queries, unlimited shares, custom reports
- `enterprise` ($99/mo): Unlimited everything, API access, custom branding
- EC Mode is **always free** — core to mission, never gated.
- Feature gating: use `hasFeature()` from `useSubscription()`.

## Stripe Integration

- **Client-side**: `src/lib/stripe.ts` calls Cloud Functions via `httpsCallable`. Never call Stripe APIs directly from the client.
- **Cloud Functions**: `createCheckoutSession`, `createPortalSession`, and `stripeWebhook` live in `functions/src/index.ts`.
- **Price IDs**: Set via Firebase config (`firebase functions:config:set stripe.companion_monthly="price_..."`) or replace defaults in the `STRIPE_PRICES` object in `functions/src/index.ts`.
- **Webhook events handled**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
- **Trial period**: 7 days on Companion and Pro tiers (set in `createCheckoutSession`).
- **Upgrade UI**: `UpgradePage.tsx` at `/upgrade` route. Shows tier cards, billing toggle, feature comparison table.
- **Customer portal**: For existing paid subscribers to manage/cancel. Called via `openCustomerPortal()`.
- All Stripe secrets are in Firebase Functions config — never in client-side env vars.

## Conversation Persistence

- Chat conversations are stored in Firestore `conversations` collection.
- Scoped to `familyId` + `childId`. Auto-archives after 24 hours of inactivity.
- Use `useConversations(childId)` hook from `src/hooks/useConversations.ts`.
- Messages are appended atomically via `arrayUnion`. Real-time updates via `onSnapshot`.

## Pattern Detection (Oracle)

- `detectPatterns(logs)` in `ChatPage.tsx` analyzes last 10 ABC logs for 5 pattern types: trigger keywords, time-of-day clustering, function hypothesis clustering, intensity escalation, context environment clustering.
- `buildFullContext(child, logs, patterns)` injects child profile + logs + patterns into every AI prompt.
- `getAdaptiveQuestions(patterns, child)` generates suggested questions driven by detected patterns.

## Crisis Mode

- Local keyword matching in `ChatPage.tsx` — no API latency for crisis detection.
- `CrisisMode.tsx` component: 4-phase flow (active → breathing → debrief → logged).
- Breathing cycle: 4-4-6-2 (inhale-hold-exhale-rest).
- Post-crisis debrief auto-creates an ABC log entry.

## The Bridge (Share Packets)

- Communication Protocol structure: likes, needs, do-nots, currentlyWorkingOn, strategiesThatWork, whatWeVeLearned.
- Auto-populated from child profile data + ABC log patterns via `buildProtocolFromProfile()`.
- Must pass guardrails validation before generation.
- Public access only through `getSharePacket` Cloud Function — never direct Firestore reads.

## Scholarly Research

- Research files live in `content/scholars/`: FRAMEWORKS.md, PRINCIPLES.md, RESEARCHERS.md, LANGUAGE_GUIDE.md, CORE_FOUNDATIONS.md.
- The Cloud Function system prompt (`GIOVANNA_SYSTEM_PROMPT` in `functions/src/index.ts`) integrates all 5 core principles with citations, 4 theoretical frameworks, ABA consultant role, school communication scripts, and language rules.
- Always consult these files when adding new AI-facing features or modifying the system prompt.

## Data Visualization

- `BehaviorCharts.tsx` renders 4 Recharts charts from ABC log data.
- Color scheme follows sanctuary theme: gold for frequency, purple/gold/sage/rose for functions, time-specific colors for time-of-day.
- Each chart has an auto-generated insight string that contextualizes the data for the parent.
- Charts are collapsible and only shown in growth mode when logs exist.
- If adding new chart types, follow the `ChartSection` wrapper pattern and generate an insight.

## Analytics

- `useAnalytics` hook tracks core loop events to localStorage (privacy-first, no network calls).
- Event types: `log_created`, `oracle_message_sent`, `share_packet_created`, `crisis_mode_activated/completed`, `onboarding_step_completed/completed`, `feedback_submitted`, `error_boundary_triggered`, `page_viewed`.
- Integrate tracking by calling the appropriate convenience method (e.g., `trackLogCreated({ type: 'full', hasVoice: true })`).
- `getAnalyticsSummary()` returns event counts for admin dashboards.

## Accessibility

- Skip-to-content link on Layout (`.skip-to-content` class).
- Global `*:focus-visible` ring (gold, 2px) for keyboard navigation.
- All interactive elements must have minimum 44px touch targets on mobile.
- All nav elements require `aria-label`. All expandable elements require `aria-expanded` + `aria-controls`.
- Use `.sr-only` class for screen-reader-only text.
- Respect `prefers-reduced-motion` and `prefers-contrast` media queries.
- Never remove focus indicators. Never use `outline: none` without `:focus-visible` guard.
