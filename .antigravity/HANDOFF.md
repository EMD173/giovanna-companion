# Giovanna Companion — Agent Handoff (Updated March 22, 2026)

## Status: Verified Build-Clean — Core Loop Fixed — Ready for Pre-Deploy

The 12-week build plan is **100% feature-complete**. Both TypeScript builds pass with zero errors. The app runs locally at `localhost:5173`. No blockers remain in code — what's left is operational setup (Stripe config, Firebase deploy).

---

## CRITICAL UPDATE: March 22, 2026 — Onboarding Pipeline Fixed

Two files were rewritten to fix a **critical data-flow break** in the core Log → Understand → Advocate loop. Before this fix, new users bypassed onboarding entirely and arrived at the dashboard with `activeChild === null`, which silently broke every downstream feature (ABC logging, Oracle context, Bridge builder, IEP report).

### What Changed

**`apps/web/src/pages/Signup.tsx` (rewritten)**
- OLD: `useEffect` redirected ALL authenticated users to `/dashboard` unconditionally.
- NEW: On auth, performs a single Firestore `getDoc` on `families/{uid}`. If the doc exists AND `children.length > 0` → `/dashboard` (returning user). Otherwise → `/onboarding` (new or incomplete user). Error fallback also routes to `/onboarding`.
- Added imports: `doc, getDoc` from `firebase/firestore`, `db` from `../lib/firebase`.
- Added `checking` state so button shows "Preparing..." during the brief Firestore read.

**`apps/web/src/pages/Onboarding.tsx` (rewritten)**
- OLD: Single-phase — IntakeWizard completed → wrote family doc with `children: []` → navigated to `/dashboard`. Result: `activeChild` was always `null`.
- NEW: Two-phase flow:
  - **Phase 1**: IntakeWizard (existing 6 steps: Pledge → Strengths). On complete, intake data stored in React state. Nothing written to Firestore yet.
  - **Phase 2**: `MeetYourChild` form collects minimum viable child profile: first name (required), preferred name (optional), pronouns (required, button selector), date of birth (required).
  - **On final submit**: Validates child form, then writes BOTH Firestore documents — `users/{uid}` with intake profile AND `families/{uid}` with `children: [childProfile]` already populated. Uses `createEmptyChildProfile()` from `data/familyProfile.ts` as scaffold. Only then navigates to `/dashboard`.
- Added imports: `createEmptyChildProfile` from `../data/familyProfile`, lucide icons (`Heart, ArrowRight, ArrowLeft, Calendar, User, Smile`).
- Visual style matches IntakeWizard (same `colors` object, same card/button patterns, immersive dark theme).
- `onboardingVersion` bumped to `'2.0'`.

### Why This Matters

`FamilyContext.tsx` lines 85–90 auto-sets `activeChildId` to `data.children[0].id` when the family doc loads. With the old code, `children` was always empty, so `activeChild` was always `null`. Now the first child exists before the parent ever sees the dashboard. Every downstream component — `ABCLogForm`, `ChatPage`, `SharePage`, `IEPReportPage` — receives a valid `activeChild` from session one.

### Verification

- `npx tsc --noEmit` → **ZERO ERRORS** (verified after both changes)
- No other files modified
- IntakeWizard.tsx is UNCHANGED — Phase 1 behavior is identical

---

## STEP 1: Read These First

```text
.antigravity/prompt.md    — Full project identity, completed feature manifest, what to build next
.antigravity/rules.md     — All coding conventions (INLINE STYLES ONLY, no Tailwind, adminId canonical, etc.)
```

These two files are your source of truth. Read them before touching any code.

---

## STEP 2: What Exists (Verified March 21, 2026)

### Build Status

- `apps/web/` → `npx tsc --noEmit` → **ZERO ERRORS**
- `functions/` → `npx tsc --noEmit` → **ZERO ERRORS**
- Dev server: `cd apps/web && npm run dev` → runs on `localhost:5173`
- Import chain verified: `stripe.ts` line 11 imports `functions` from `./firebase.ts` line 45

### File Inventory (Key Files)

| Category   | Count | Examples                                                                                                          |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| Pages      | 32    | Dashboard, ChatPage, ABCLogPage, PracticeModulesPage, EducatorTrainingPage, RespiteMarketplacePage, Settings...   |
| Hooks      | 13    | useABCLogs, useConversations, useModuleProgress, useRespiteProviders, useVoiceInput...                            |
| Components | 45+   | ErrorBoundary, PostLogInsight, BehaviorCharts, FeedbackModal, OnboardingWalkthrough...                            |
| Data       | 3     | practiceModules.ts, educatorModules.ts, respiteMarketplace.ts                                                     |

### Architecture

```text
React 18 + TypeScript + Vite + Firebase (Firestore, Auth, Cloud Functions)
4 Context Providers: AuthContext, FamilyContext, SubscriptionContext, ECModeContext
AI: Client → aiService.ts → Cloud Function (giovannaChat) → OpenAI gpt-4o-mini
Stripe: Client → httpsCallable → Cloud Function → Stripe API → Webhook → Firestore
```

### The Core Loop (NEVER BREAK THIS)

#### Log → Understand → Advocate

- **Log**: ABC behavior capture (voice, quick log, full form)
- **Understand**: Oracle AI reads logs + patterns + child profile
- **Advocate**: Share packets, IEP reports, teacher emails from documented evidence

### Three-Pillar Ecosystem (Built March 21, 2026)

| Pillar | Route | What | Gate |
| ------ | ----- | ---- | ---- |
| 1. Parent as Practitioner | `/practice` | 6 modules: Learn/Observe/Practice/Reflect cycle, Firestore progress, journal, badges | Modules 1-2 free, 3-4 companion, 5-6 pro |
| 2. Educator Training | `/educator-training` | 4 modules, 9 scenarios, PD credit tracking | Pro + Enterprise |
| 3. Respite Marketplace | `/respite` | Provider discovery, geolocation radius search, ratings, provider registration | Authenticated users |

- **PostLogInsight** bridges Pillar 1 to the ABC log — after saving a log with a function hypothesis, parents see contextual education + "Go Deeper" links to relevant modules
- Educator auth is `userId`-based (educators own their own progress), separate from family `adminId`
- Respite providers have independent Firestore rules under `respiteProviders/{providerId}`

1. **STYLING**: Inline styles via `shared/theme.ts`. Import `sanctuary` and `typography`. **NEVER Tailwind. NEVER CSS files.**
2. **AI CALLS**: Always through Cloud Functions via `services/aiService.ts`. Never direct API calls.
3. **FIRESTORE FIELD**: `adminId` is canonical for family ownership. **Never `ownerId`** — it doesn't exist.
4. **LANGUAGE**: Identity-first ("autistic person"). Never deficit language. See `content/scholars/LANGUAGE_GUIDE.md`.
5. **GUARDRAILS**: All child-descriptive content runs through `validateContent()` from `lib/guardrails.ts`.
6. **STRIPE**: Client calls Cloud Functions via `httpsCallable`. Secrets in Firebase Functions config, never client env vars.
7. **ROUTES**: Authenticated pages go inside `<ProtectedRoute />` in App.tsx.
8. **ERROR BOUNDARIES**: Every protected route in App.tsx is wrapped in `<ErrorBoundary>`.
9. **LAZY LOADING**: All 29 pages use `React.lazy` + `Suspense` in App.tsx.

---

## STEP 4: What's Left To Do

### Pre-Deploy Checklist (Operational — Not Code)

- [ ] `firebase functions:config:set stripe.secret_key="sk_..." stripe.webhook_secret="whsec_..."`
- [ ] Create Stripe products + prices in Stripe Dashboard → get Price IDs
- [ ] Register webhook: `https://us-central1-giovanna-companion.cloudfunctions.net/stripeWebhook`
- [ ] Set up Firebase Hosting + custom domain + SSL
- [ ] `firebase deploy` (Hosting + Functions + Rules + Indexes)
- [ ] Test: free → companion upgrade → portal management → cancellation

### Future Roadmap (Post-Beta)

- Mobile app (React Native or PWA)
- Provider portal (teachers/therapists view share packets)
- Insurance appeal generator (auto-draft denial letters)
- Multi-language (Spanish first)
- HIPAA compliance (enterprise tier)
- Offline mode (enhanced offline logging)
- Push notifications (logging reminders, crisis follow-ups)

---

## STEP 5: Recent Work (This Session)

Items built by the previous agent in this session:

| File                                     | What                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `components/ErrorBoundary.tsx`           | Class component crash guard with sanctuary fallback + localStorage logging   |
| `App.tsx`                                | Rewritten: all 26 pages `React.lazy` + `Suspense`, every route in ErrorBound |
| `hooks/useAnalytics.ts`                 | Core loop event tracking (localStorage, privacy-first, max 500 events)       |
| `components/OnboardingWalkthrough.tsx`   | 4-step post-signup tour (Capture → Oracle → Sanctuary → Bridge)              |
| `components/BehaviorTrends.tsx`          | Pure SVG bar chart + donut chart (14-day frequency, function distribution)   |
| `components/FeedbackModal.tsx`           | 5-emoji rating + textareas → Firestore `feedback` collection                |

The user also separately created `BehaviorCharts.tsx` (Recharts-based, 4 chart types) and wired it into Dashboard. The user completed an accessibility audit on `index.css` and `Layout.tsx`. Both `BehaviorTrends.tsx` and `BehaviorCharts.tsx` exist — the user's `BehaviorCharts.tsx` is the canonical one per `rules.md` line 156.

---

## Tone Reminder

The app speaks to parents as a wise, warm companion. Think: the elder in the community who sits with you without judgment. The Oracle greeting is "Welcome, honored one." Crisis response begins with "I hear you. You are safe." Never say "manage behaviors" — say "understand the why." Never make a parent feel like they are failing.
