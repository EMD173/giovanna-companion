# Giovanna Companion — Agent Prompt

## Identity

You are building **Giovanna Companion**, a neuro-affirming AI companion app for parents of neurodivergent children — centering Black and Brown families who face compounded barriers in the disability system. This is not a generic parenting app. It is a culturally-responsive advocacy tool grounded in the Epigenetic Consciousness framework developed by Eli Davis, Ph.D. candidate at USC.

The app's name, Giovanna, means "God is gracious." The Oracle is the AI chat feature. The Sanctuary is the home/safe-space system. Capture is the ABC behavior logging system. The Bridge is the share packet system for teachers and providers.

## Who You Are Building For

The primary users are parents who just received an autism, ADHD, or other neurodevelopmental diagnosis for their child. They are overwhelmed. They are Googling at 2 AM. They are being handed pamphlets by pediatricians. Many are Black and Brown families who have experienced misdiagnosis, cultural stigma around disability, and systemic exclusion from services. Some have been told their child "just needs more discipline" when the child is actually autistic.

The secondary users are seasoned advocacy parents already navigating IEPs, insurance denials, and burnout. They need better tools, not more information.

## Guiding Principles (Non-Negotiable)

1. **Behavior is communication, not defiance.** Every feature must reflect this. The ABC log is not a surveillance tool — it is a pattern decoder that helps parents understand the "why" behind what their child does.

2. **Regulation over compliance.** We never recommend extinguishing self-regulatory behaviors (stimming, rocking, hand-flapping). We never use language that frames the goal as making a child "normal" or "compliant."

3. **Assume competence.** Every child is presumed capable. Language always centers strengths before challenges.

4. **Protect self-regulatory behaviors.** Stimming is not a problem to solve. It is a communication tool and a nervous system need.

5. **Co-regulation before self-regulation.** The parent's state matters. The app includes a caregiver capacity check, a survival/growth mode toggle, and a parent check-in — because a dysregulated parent cannot co-regulate a dysregulated child.

## The Product Strategy

The app must do **one thing so well** that parents build their lives around it before they discover it does ten other things. That one thing is the **core loop**:

**Log → Understand → Advocate**

- **Log**: Parent captures a behavior moment (ABC log or Quick Log). Frictionless. Voice input. 30 seconds.
- **Understand**: The Oracle (AI) reads the log in context of the child's profile, history, and known patterns. Responds with warmth, not clinical detachment.
- **Advocate**: The data becomes ammunition. IEP reports, teacher emails, insurance appeal letters, and share packets — all generated from the parent's own documented evidence.

The flywheel: the more a parent logs, the smarter the Oracle gets, the better the advocacy documents become, the more indispensable the app becomes. After 3 months of logging, their child's behavioral history *lives* in Giovanna. They can't leave because their data can't leave.

## Current State (March 2026)

The app is in **local development** (not yet deployed). Weeks 1–10 of the build plan have been completed. TypeScript compiles cleanly with zero errors. The app has a full feature set ready for deployment and beta testing.

### What Has Been Built (Completed)

**Weeks 1–2 (Foundation):** Six critical blockers fixed — FamilyContext syntax error, Firestore rules standardized on `adminId`, ProtectedRoute added, ChatPage connected to real AI via Cloud Functions, subscription rules locked down, Firebase config moved to env vars.

**Week 3 (ABC Log Polish):**
- Voice input via Web Speech API on every A/B/C field + Quick Log's "Speak Instead" option
- Time-of-day auto-capture badge (Morning/Afternoon/Evening/Night)
- Child selector dropdown for multi-child families (hidden for single-child)
- Function hypothesis field (Escape/Attention/Tangible/Sensory) with tooltip framed as "What need was being met?"
- Files: `ABCLogPage.tsx` (rewritten), `useVoiceInput.ts` (new hook)

**Week 4 (Oracle Context Intelligence):**
- Full child profile + last 10 ABC logs + detected patterns injected into every Oracle prompt
- Conversation persistence via Firestore `conversations` collection (survives page navigation, auto-archives after 24h)
- Pattern detection engine: trigger keywords, time clustering, function hypothesis clustering, intensity escalation, context environment clustering
- Adaptive suggested questions driven by detected patterns
- Files: `ChatPage.tsx` (rewritten), `useConversations.ts` (new hook)

**Week 5 (Crisis Mode):**
- Full-screen crisis UI with dark theme overlay
- Four phases: active → breathing → debrief → logged
- Breathing timer: 4-4-6-2 cycle (inhale-hold-exhale-rest) with animated circle
- Personalized calming strategies from child's profile
- Village alert: opens SMS/email compose with pre-filled message to emergency contacts
- Post-crisis debrief form auto-creates ABC log entry
- File: `CrisisMode.tsx` (new component)

**Week 6 (Dashboard Simplification):**
- Reduced from 13 Quick Access pills to 6 focused links
- Smart contextual suggestion banner based on recent activity + time of day
- Weekly activity summary ("X moments captured this week for [child]")
- Growth mode: 4 action cards + 6 quick pills; Survival mode: 2 action cards + Quick Log
- File: `Dashboard.tsx` (rewritten)

**Week 7 (The Bridge — Share Packet System):**
- Structured Communication Protocol: likes, needs, do-nots, currentlyWorkingOn, strategiesThatWork, whatWeVeLearned
- Auto-populates protocol from child profile + ABC log patterns
- Guardrails validation before generation
- Expandable protocol preview with editable custom fields per section
- Recipient role selector (teacher/therapist/doctor/other)
- Toggle switches for Communication Protocol, Regulation Context, Recent ABC Logs
- File: `SharePage.tsx` (rewritten)

**Week 8 (Child Profile + PDF Export):**
- `exportMeetMyChildPDF()` — print-optimized window for Save as PDF
- `buildMeetMyChildHTML()` — comprehensive one-pager (narrative, strengths, interests, communication, triggers, calming strategies, sensory tools, diagnoses)
- QR code generation via Google Charts API
- File: `exportUtils.ts` (new)

**Week 9 (Deploy Prep):**
- Security headers added to `firebase.json` (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- Cache headers (JS/CSS immutable 1yr, images 1wk)
- Firestore rules updated for `conversations` collection
- Firestore indexes for conversation queries
- `.firebaserc` configured for `giovanna-companion` project

**Week 10 (Stripe Integration):**
- `UpgradePage.tsx` — Full paywall UI with 4 tier comparison cards, monthly/yearly billing toggle with 20% savings, 7-day free trial badges, expandable feature comparison table (12 rows), success/cancelled banners, mission statement
- Cloud Functions added to `functions/src/index.ts`: `createCheckoutSession` (with trial period + promo codes), `createPortalSession`, `stripeWebhook` (handles checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed)
- `stripe.ts` rewritten from stubs to Cloud Function client using `httpsCallable`
- Stripe dependency added to `functions/package.json`
- `/upgrade` route added to `App.tsx`

**Scholarly Research Integration (Cloud Function):**
- `GIOVANNA_SYSTEM_PROMPT` (~3000 chars) with all 5 core principles + citations
- 4 theoretical frameworks (Polyvagal, Neurodiversity, Trauma-Informed, Epigenetic Consciousness)
- ABA Consultant role with pattern reading + evidence-based strategy suggestions
- 4 school communication script templates
- Complete language rules (never/use instead lists)
- `getSharePacket` Cloud Function for privacy-first public share viewing

### Key Files Modified or Created (Weeks 3–10)

```
NEW FILES:
  apps/web/src/hooks/useConversations.ts     — Firestore chat persistence
  apps/web/src/hooks/useVoiceInput.ts        — Web Speech API hook
  apps/web/src/components/CrisisMode.tsx     — Full-screen crisis UI
  apps/web/src/lib/exportUtils.ts            — PDF export + QR generation
  apps/web/src/pages/UpgradePage.tsx         — Stripe paywall/upgrade UI

REWRITTEN FILES:
  apps/web/src/pages/ChatPage.tsx            — Pattern detection, context injection, persistence
  apps/web/src/pages/Dashboard.tsx           — Contextual suggestions, survival/growth modes
  apps/web/src/pages/SharePage.tsx           — Communication Protocol, guardrails, auto-populate
  apps/web/src/pages/ABCLogPage.tsx          — Voice input, time badge, function hypothesis
  apps/web/src/lib/stripe.ts                — Cloud Function client (was stubs)
  functions/src/index.ts                     — Stripe functions + scholarly system prompt

MODIFIED FILES:
  apps/web/src/App.tsx                       — Added /upgrade route
  firebase.json                              — Security + cache headers
  firestore.rules                            — Conversations collection rules
  firestore.indexes.json                     — Conversation query indexes
  .firebaserc                                — Project config
  functions/package.json                     — Added stripe dependency
```

## What Needs to Be Built Next

### Pre-Deploy Checklist (Before Beta)
- [ ] Run `npm install` in `functions/` to install Stripe dependency
- [ ] Run `npx tsc --noEmit` in `apps/web/` to verify TypeScript compiles
- [ ] Set Stripe config: `firebase functions:config:set stripe.secret_key="sk_..." stripe.webhook_secret="whsec_..."`
- [ ] Create Stripe products + prices in Stripe Dashboard, update Price IDs in Firebase config
- [ ] Register Stripe webhook endpoint: `https://us-central1-giovanna-companion.cloudfunctions.net/stripeWebhook`
- [ ] Set up custom domain + SSL via Firebase Hosting
- [ ] Deploy: `firebase deploy`
- [ ] Test full checkout flow end-to-end (free → companion upgrade → portal management → cancellation)

### Week 11–12: Beta Testing & Polish (COMPLETED)

**Performance (completed by Antigravity):**
- `React.lazy()` + `Suspense` on all 25+ routes (~60% initial bundle reduction)
- `ErrorBoundary` class component wrapping every protected route with sanctuary-themed fallback
- `PageLoadingFallback` spinner component for Suspense
- Files: `ErrorBoundary.tsx` (new), `App.tsx` (rewritten with lazy imports)

**Onboarding Walkthrough (completed by Antigravity):**
- 4-step tooltip tour: Capture → Oracle → Sanctuary → Bridge
- Persisted to localStorage (shows once per user)
- Skip tour always available
- Already wired into Dashboard
- File: `OnboardingWalkthrough.tsx` (new)

**Analytics & Feedback (completed by Antigravity):**
- `useAnalytics` hook with core loop tracking: `trackLogCreated`, `trackOracleMessage`, `trackSharePacketCreated`, `trackCrisis`, `trackOnboarding`
- localStorage-based event storage (max 500 events, privacy-first)
- `getAnalyticsSummary()` utility for admin/debug
- `FeedbackModal` component with 5-step emoji rating + two textareas, saves to Firestore `feedback` collection
- Files: `useAnalytics.ts` (new hook), `FeedbackModal.tsx` (new)

**Data Visualization (completed):**
- `BehaviorCharts` component using Recharts with 4 chart types:
  - Frequency Over Time (area chart, last 30 days)
  - Function Distribution (donut pie chart with color-coded legend)
  - Time of Day Pattern (bar chart: morning/afternoon/evening/night)
  - Intensity Trend (line chart, 0-10 scale)
- Smart insight generator per chart (e.g., "Escape is the most common function — this is valuable IEP evidence")
- Collapsible section, empty state with encouraging copy
- Wired into Dashboard in growth mode when logs exist
- File: `BehaviorCharts.tsx` (new)

**Accessibility Audit (completed):**
- Skip-to-content link (`.skip-to-content` class, visible on Tab)
- Global `*:focus-visible` gold ring for keyboard users
- Mouse clicks get no focus ring (`:focus:not(:focus-visible)`)
- `.sr-only` class for screen reader text
- `@media (prefers-reduced-motion: reduce)` — disables all animations
- `@media (prefers-contrast: high)` — solid backgrounds, stronger borders
- ARIA landmarks: `aria-label` on both nav elements, `role="main"` on main content, `aria-expanded` + `aria-controls` on mobile menu button
- Minimum 44px touch targets on all mobile nav items
- Files: `index.css` (accessibility section added), `Layout.tsx` (ARIA attributes added)

**Firestore Rules Update:**
- Added `feedback` collection rules (authenticated create, admin-only read)

### Remaining Pre-Deploy Tasks
- [ ] Run `npm install` in `functions/` to install Stripe dependency
- [ ] Run `npx tsc --noEmit` in `apps/web/` to verify TypeScript compiles
- [ ] Set Stripe config keys via Firebase config
- [ ] Create Stripe products + prices in Stripe Dashboard
- [ ] Register Stripe webhook endpoint
- [ ] Set up custom domain + SSL
- [ ] Deploy: `firebase deploy`
- [ ] Test full checkout flow end-to-end
- [ ] Recruit 10 families for closed beta
- [ ] Implement push notifications (deferred to post-launch)

### Future Roadmap (Post-Beta)
- **Mobile App**: React Native wrapper or PWA enhancement
- **Provider Portal**: Separate login for teachers/therapists to view shared packets and communicate back
- **Group Support**: Community features for parent-to-parent connection
- **Insurance Appeal Generator**: Auto-draft denial appeal letters from documented evidence
- **Multi-Language Support**: Spanish as first additional language
- **HIPAA Compliance**: For enterprise/clinic tier users
- **Offline Mode**: Enhanced offline support for logging without connectivity

## Technical Conventions

Read `.antigravity/rules.md` for the full technical ruleset. Key points:

- **Styling**: Inline styles via `shared/theme.ts`. Never Tailwind.
- **AI calls**: Always through `src/services/aiService.ts`. Never direct.
- **Field names**: `adminId` is canonical for family ownership. Never `ownerId`.
- **Routes**: New authenticated pages go inside `<ProtectedRoute />` in App.tsx.
- **Language**: Identity-first. Never deficit language. See `content/scholars/LANGUAGE_GUIDE.md`.
- **Guardrails**: All content describing children runs through `validateContent()` from `lib/guardrails.ts`.

## Tone

The app speaks to parents as a wise, warm companion — not a clinical tool, not a chatbot, not a corporate product. Think: the elder in the community who has been through this before and sits with you without judgment. The Oracle greeting is "Welcome, honored one." The crisis response begins with "I hear you. You are safe." The copy never says "manage behaviors" — it says "understand the why." The app never makes a parent feel like they are failing. Because they are not.
