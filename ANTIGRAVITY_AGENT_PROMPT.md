# Giovanna Companion — Development Handoff Prompt

Paste this into Antigravity's agent to bring it up to speed on what has been built and what to do next.

---

## PROMPT START

You are picking up development on **Giovanna Companion**, a neuro-affirming AI companion app for parents of neurodivergent children. Weeks 1–10 of a 12-week build plan have been completed in prior sessions. Your job is to understand what exists, verify it, and continue building.

### STEP 1: Read the project context files

Before doing anything, read these two files — they contain the full project identity, architecture, and coding rules:

```
.antigravity/prompt.md    — Project identity, completed work manifest, what to build next
.antigravity/rules.md     — All coding conventions, patterns, and constraints
```

### STEP 2: Understand what was built (Weeks 3–10)

These files were **created new** — verify they exist and are complete:

```
apps/web/src/hooks/useConversations.ts     — Firestore-persisted chat history for Oracle
apps/web/src/hooks/useVoiceInput.ts        — Web Speech API hook for voice input
apps/web/src/components/CrisisMode.tsx     — Full-screen crisis UI (4-phase: active → breathing → debrief → logged)
apps/web/src/lib/exportUtils.ts            — Meet My Child PDF export + QR code generation
apps/web/src/pages/UpgradePage.tsx         — Stripe paywall with 4 tier cards, billing toggle, feature table
```

These files were **rewritten** with major new functionality:

```
apps/web/src/pages/ChatPage.tsx       — Pattern detection engine, full context injection, conversation persistence, adaptive suggested questions, expanded crisis detection (24 keywords)
apps/web/src/pages/Dashboard.tsx      — Contextual suggestion banner, weekly activity summary, survival/growth mode action cards
apps/web/src/pages/SharePage.tsx      — Structured Communication Protocol (likes/needs/do-nots/strategies/what-we-learned), auto-populate from profile + logs, guardrails validation
apps/web/src/pages/ABCLogPage.tsx     — Voice input on A/B/C fields, time-of-day badge, child selector, function hypothesis field
apps/web/src/lib/stripe.ts           — Rewritten from stubs to Cloud Function client using httpsCallable
functions/src/index.ts                — Added: GIOVANNA_SYSTEM_PROMPT (3000 chars, 5 principles with citations, 4 frameworks, ABA consultant role, school scripts, language rules), getSharePacket Cloud Function, createCheckoutSession, createPortalSession, stripeWebhook (handles 4 event types)
```

These files were **modified**:

```
apps/web/src/App.tsx          — Added UpgradePage import + /upgrade route
firebase.json                 — Security headers + cache headers
firestore.rules               — Added conversations collection rules
firestore.indexes.json        — Added conversation query indexes
.firebaserc                   — Set project to giovanna-companion
functions/package.json        — Added stripe ^14.14.0 dependency
```

### STEP 3: Run verification

Before building anything new, verify the existing codebase:

1. `cd apps/web && npx tsc --noEmit` — Confirm zero TypeScript errors
2. `cd functions && npm install && npx tsc --noEmit` — Install Stripe dep and verify Cloud Functions compile
3. Check that all imports in App.tsx resolve to real files
4. Check that `stripe.ts` imports `functions` from `./firebase` (it's exported on line 45 of `lib/firebase.ts`)

### STEP 4: What to build next

The **pre-deploy checklist** and **Weeks 11–12** are detailed in `.antigravity/prompt.md` under "What Needs to Be Built Next." The priority order is:

**Immediate (Pre-Deploy):**
- Set Stripe config keys via `firebase functions:config:set`
- Register Stripe webhook endpoint
- Set up Firebase Hosting with custom domain
- Test full checkout flow end-to-end
- Deploy with `firebase deploy`

**Week 11–12 (Beta Polish):**
- Onboarding walkthrough/tutorial for new users
- Data visualization: behavior trend charts (frequency over time, function distribution)
- Error boundary components around each major feature
- Accessibility audit (WCAG 2.1 AA)
- Performance audit (lazy loading, bundle splitting)
- Analytics event tracking for core loop (log → understand → advocate)
- Push notifications for logging reminders and crisis follow-ups
- Feedback collection mechanism

### CRITICAL CONVENTIONS

Read `.antigravity/rules.md` for the full list. The non-negotiables:

- **Styling**: Inline styles via `shared/theme.ts` (sanctuary light theme + immersive dark theme). NEVER Tailwind. NEVER CSS files.
- **AI calls**: Always through Cloud Functions via `services/aiService.ts`. Never direct API calls from client.
- **Field names**: `adminId` is canonical for family ownership in Firestore. Never `ownerId` or `userId`.
- **Language**: Identity-first ("autistic person"). Never deficit language. See `content/scholars/LANGUAGE_GUIDE.md`.
- **Guardrails**: All content describing children runs through `validateContent()` from `lib/guardrails.ts`.
- **Stripe**: All Stripe calls go through Cloud Functions. Client uses `httpsCallable`. Secrets live in Firebase Functions config, never in client env vars.
- **Research grounding**: The scholarly research in `content/scholars/` (FRAMEWORKS.md, PRINCIPLES.md, RESEARCHERS.md, LANGUAGE_GUIDE.md, CORE_FOUNDATIONS.md) informs every AI-facing feature. Consult these files when modifying the system prompt or adding new AI features.

### KEY ARCHITECTURE

```
React 18 + TypeScript + Vite + Firebase (Firestore, Auth, Cloud Functions)
4 Context Providers: AuthContext, FamilyContext, SubscriptionContext, ECModeContext
AI Pipeline: Client → aiService.ts → Cloud Function (giovannaChat) → OpenAI gpt-4o-mini
Subscription Tiers: free ($0) / companion ($7.99) / pro ($14.99) / enterprise ($99)
Stripe Flow: Client → httpsCallable → Cloud Function → Stripe API → Webhook → Firestore update
```

### THE CORE LOOP (Never Break This)

**Log → Understand → Advocate**

Every feature must serve this flywheel. The more a parent logs, the smarter the Oracle gets, the better the advocacy documents become, the more indispensable the app becomes.

## PROMPT END
