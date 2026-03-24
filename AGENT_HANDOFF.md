# Giovanna Companion — Agent Handoff Document
**Date:** 03/21/2026
**User:** Eli Davis, Ph.D. candidate (USC), Black educator and researcher
**Project:** Giovanna Companion — neuro-affirming AI companion app for parents of neurodivergent children, centering Black and Brown families

---

## WHO IS ELI

Eli Davis is a special education teacher, Ph.D. candidate at USC, and researcher building apps for his dissertation on epigenetic consciousness and trauma-informed education. He is an intermediate, self-taught developer. He reads and understands code but appreciates support with architecture, debugging, and best practices. He works in React + TypeScript with Firebase/Firestore. Speak to him as a collaborator, not a beginner. Be direct, respectful, and clear.

**CRITICAL:** Begin every reply with the date in MM/DD/YYYY format. Eli requires this.

**Eli's preferences:**
- Complete, copy-pasteable files (not fragments)
- Tell him exactly where each file belongs in project structure
- Use strong, descriptive names matching his work (EpigeneticModule, ParticipantJournalEntry, etc.)
- Explain WHY you choose an approach before/after the code
- Default to modern React with hooks, TypeScript types, simple readable code
- Synthesize responses through an integrated lens of social/behavioral epigenetics, African Diaspora Literacy, Black history/psychology, developmental psych, and critical complex systems theory

---

## PROJECT OVERVIEW

Giovanna Companion is a React 18 + TypeScript + Vite + Firebase app with three main pillars built on top of a 12-week core build (completed in prior sessions).

### Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Firebase (Firestore, Auth, Cloud Functions)
- **Styling:** Inline styles via `apps/web/src/shared/theme.ts` (sanctuary light theme for interior, immersive dark theme for landing/onboarding). Tailwind IS installed (v4.1.18) but the app primarily uses inline styles. Do NOT default to Tailwind.
- **Icons:** Custom SVG icons in `SanctuaryIcons.tsx` + lucide-react
- **Auth:** Google Sign-In via Firebase Auth. Dev mode has a mock user fallback (1s timeout).
- **State:** Four React Context providers: AuthContext, FamilyContext, SubscriptionContext, ECModeContext
- **Routing:** React Router v6, lazy-loaded pages with Suspense + ErrorBoundary
- **Code splitting:** React.lazy() on all 32 pages

### Project Root
```
/sessions/kind-festive-heisenberg/mnt/Desktop/ABA Parent Resourse/
├── apps/web/src/
│   ├── components/         # Shared components
│   │   ├── icons/SanctuaryIcons.tsx  # Custom SVG icon set
│   │   ├── Layout.tsx      # Main nav (hidden on landing/onboarding)
│   │   ├── DevNav.tsx      # Dev-only floating route navigator
│   │   ├── ErrorBoundary.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/           # AuthContext, FamilyContext, SubscriptionContext, ECModeContext
│   ├── data/               # Static data models & content
│   │   ├── practiceModules.ts      # Pillar 1 data (6 parent modules)
│   │   ├── educatorModules.ts      # Pillar 2 data (4 educator modules, 9 scenarios)
│   │   ├── respiteMarketplace.ts   # Pillar 3 data (types, geo utils, filters)
│   │   ├── subscriptionTiers.ts    # Tier config (free/companion/pro/enterprise)
│   │   ├── learningContent.ts
│   │   ├── lensCards.ts
│   │   └── parentResourceHub.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useModuleProgress.ts    # Pillar 1 Firestore hook
│   │   ├── useEducatorProgress.ts  # Pillar 2 Firestore hook
│   │   ├── useRespiteProviders.ts  # Pillar 3 Firestore hook (search, profile, reviews)
│   │   └── ...
│   ├── pages/              # 32 lazy-loaded pages
│   │   ├── LandingPage.tsx         # Overhauled with 3 pillars + pricing
│   │   ├── Signup.tsx              # Restyled to immersive dark theme
│   │   ├── Dashboard.tsx           # Journey hub with QuickPills
│   │   ├── PracticeModulesPage.tsx # Pillar 1 UI
│   │   ├── EducatorTrainingPage.tsx # Pillar 2 UI
│   │   ├── RespiteMarketplacePage.tsx # Pillar 3 UI
│   │   └── ... (27 more pages)
│   ├── shared/theme.ts     # sanctuary (light) + immersive (dark) + typography
│   ├── lib/firebase.ts     # Firebase config
│   ├── App.tsx             # All routes defined here
│   └── index.css           # Global CSS including landing page classes
├── content/scholars/       # Research foundation docs
├── firestore.rules         # Security rules for all collections
└── package.json
```

---

## THE THREE PILLARS (ALL COMPLETE)

### Pillar 1: Parent as Practitioner
**Files:** `practiceModules.ts`, `useModuleProgress.ts`, `PracticeModulesPage.tsx`, `PostLogInsight.tsx`
**Routes:** `/practice`, `/practice/:slug`
**Firestore:** `families/{familyId}/moduleProgress/{moduleId}`
**Content:** 6 modules (Behavior Is Communication, Understanding the Nervous System, The Sensory World, Assume Competence, Lineage & Story, The Whole Picture)
**Cycle:** Learn → Observe → Practice → Reflect
**Tier gating:** 2 free, 2 companion, 2 pro

### Pillar 2: Educator & Paraprofessional Literacy
**Files:** `educatorModules.ts`, `useEducatorProgress.ts`, `EducatorTrainingPage.tsx`
**Routes:** `/educator-training`, `/educator-training/:slug`
**Firestore:** `educatorProgress/{userId}_{moduleId}` (top-level, NOT under families)
**Content:** 4 modules, 9 interactive classroom scenarios with 3-choice decision trees (best/acceptable/harmful)
**Tier gating:** Pro and Enterprise only (`educatorTraining` boolean in TierLimits)

### Pillar 3: Respite Care Marketplace
**Files:** `respiteMarketplace.ts`, `useRespiteProviders.ts`, `RespiteMarketplacePage.tsx`
**Routes:** `/respite`, `/respite/:slug` (slug = provider ID or "register")
**Firestore:** `respiteProviders/{providerId}` + `respiteProviders/{providerId}/reviews/{reviewId}`
**Features:** GPS-based radius search (Haversine), 12 specialties, 14 credentials, 5 service types, Super Provider badges (4.8+ / 10+ reviews), 4-step provider registration wizard
**Scope:** Discovery only (no booking/payment). MVP.

---

## SUBSCRIPTION TIERS

Defined in `subscriptionTiers.ts`:
- **Free ($0):** 30 AI queries/mo, 1 child, 2 practice modules, respite search
- **Companion ($7.99/mo):** 150 queries, 3 children, 4 practice modules, homeplace
- **Pro ($14.99/mo):** 500 queries, 5 children, all 6 modules, educator training, custom reports
- **Enterprise ($99/mo):** Unlimited everything, API access, custom branding, district deployment

---

## FIRESTORE RULES

All rules are in `/firestore.rules`. Key collections:
- `users/{userId}` — owner read/write
- `families/{familyId}` — adminId-gated
- `families/{familyId}/moduleProgress/{moduleId}` — adminId-gated
- `children/{childId}` — familyId ownership
- `abcEntries/{entryId}` — familyId ownership
- `educatorProgress/{docId}` — userId field match
- `respiteProviders/{providerId}` — authenticated read, userId owner write
- `respiteProviders/{providerId}/reviews/{reviewId}` — authenticated read, reviewerId owner write
- `conversations/{conversationId}` — userId ownership

---

## NAVIGATION STRUCTURE

**Layout.tsx** nav items (9 items, first 5 shown in mobile bottom bar):
1. Home → `/`
2. Village → `/village`
3. Journey → `/dashboard`
4. Capture → `/log`
5. Oracle → `/chat`
6. Practice → `/practice`
7. Educator → `/educator-training`
8. Respite → `/respite`
9. Learn → `/learn`

**Dashboard.tsx** QuickPills: Practice, Educator PD, Respite Care, Learn, Child Profile, Strategies, Village, Insights, Settings

**DevNav.tsx** (dev only, floating ⚡ button): All 32 routes listed

---

## LANDING PAGE STRUCTURE

The landing page (`LandingPage.tsx`) is a full marketing page with:
1. **Hero** — Afrofuturist dark theme, gold particles, "Parenting with Wisdom, Not Worry"
2. **Philosophy Strip** — "Behavior is communication, not defiance"
3. **Three Pillars Section** (id="pillars") — Glass cards for each pillar
4. **Built-In Toolkit** — 6-card grid (Oracle, ABC Capture, Bridge, Village, EC Lens, Homeplace)
5. **Research-Grounded Section** — Scholar badges (Carr & Durand, Porges, Ladson-Billings, etc.)
6. **Pricing Section** (id="pricing") — 4-tier grid with feature lists
7. **Final CTA** — "Your Family Deserves This"
8. **Footer**

Anchor links use `scrollIntoView({ behavior: 'smooth' })` via button onClick (NOT `<a href="#...">` — React Router intercepts those).

All pillar card CTAs link to `/signup` (not the protected routes) since unauthenticated visitors can't access them.

---

## AUTH FLOW

1. Landing page → "Begin Your Journey" → `/signup`
2. Signup page (immersive dark theme, Google Sign-In only)
3. On auth success → redirects to `/dashboard`
4. Onboarding (`/onboarding`) creates user doc + family doc in Firestore → redirects to `/dashboard`
5. `ProtectedRoute` wraps all interior routes — unauthenticated → `/signup`
6. **Dev mode:** If Firebase auth hangs >1s, mock user auto-created (`dev_mock_user`)

---

## THEME SYSTEM

Two themes in `shared/theme.ts`:
- **`sanctuary`** (light) — Used on ALL interior pages. Warm parchment bg (#F8F5EF), soft borders, gold/sage/purple/rose accents
- **`immersive`** (dark) — Used on landing page, signup, onboarding. Deep purple-black gradients, glass morphism

Typography: Playfair Display (headings) + Inter (body)

**IMPORTANT:** The app uses inline styles, NOT Tailwind classes, for all components. The `sanctuary` object provides all color tokens. Do not switch to Tailwind utilities.

---

## SCHOLARLY FOUNDATIONS

Every module, scenario, and feature is grounded in these researchers (treat as one integrated thinking ecology):
- **Carr & Durand** — Functional Communication Training (FCT)
- **Porges** — Polyvagal Theory
- **Singer/Kapp** — Neurodiversity paradigm, stimming research
- **Donnellan** — Presumed Competence (least dangerous assumption)
- **Ladson-Billings** — Culturally Responsive Teaching
- **DeGruy** — Post Traumatic Slave Syndrome
- **Menakem** — My Grandmother's Hands (somatic/racial trauma)
- **Yehuda** — Intergenerational epigenetic trauma transmission
- **Davis** — Epigenetic Consciousness Framework (Eli's original framework)
- **van der Kolk, Maté** — Trauma and the body
- **SAMHSA** — Trauma-Informed Care principles

---

## KNOWN ISSUES / TECH DEBT

1. **`dist/` folder has permission-locked files** — User needs to manually delete `apps/web/dist/` before running `vite build` locally. Files from a previous build have spaces in names (e.g., `index 2.html`) that can't be removed programmatically.

2. **Dashboard.tsx bundle is 430KB** — The `BehaviorCharts` component (recharts) inflates it. Could be code-split further.

3. **Respite marketplace has no seed data** — Firestore is empty. No sample providers exist for testing. A seed data script or demo mode would help for demos.

4. **No cross-pillar integration yet** — The Oracle doesn't surface practice modules or respite care contextually. No role-based onboarding (parent vs. educator vs. provider). PostLogInsight only links to Pillar 1 modules.

5. **Geolocation for respite search** — Uses browser geolocation API + Haversine client-side filtering. No geohashing. Works for MVP but won't scale past ~500 providers without server-side geo queries.

6. **Provider registration doesn't geocode** — Providers enter city/state/zip but lat/lng default to 0,0. Needs a geocoding step (Google Maps API or similar) to convert address to coordinates.

7. **No email/password auth** — Only Google Sign-In. May want to add email/password for users without Google accounts.

8. **Onboarding may be skipped** — Signup redirects to `/dashboard` directly. New users who skip onboarding won't have a family doc created, which could cause errors in family-dependent features.

---

## WHAT ELI MIGHT ASK NEXT

Based on the conversation trajectory:
- **Deploy to Firebase Hosting** — Get the app live on a real URL
- **Seed data / demo mode** — Sample providers and content for investor demos
- **Cross-pillar integration** — Role-based onboarding, Oracle connecting to all pillars
- **Pitch deck** — Presentation for investors, grants, or dissertation committee
- **Bug fixes** — He mentioned buttons not working; we fixed anchor links, signup styling, and redirects, but there may be more issues he encounters

---

## HOW TO VERIFY THE BUILD

```bash
cd "apps/web"
npx tsc --noEmit          # TypeScript check — should be 0 errors
npm install               # If platform mismatch on node_modules
npx vite build --outDir /tmp/build-test  # Production build — should succeed in ~4s
```

All 32 pages compile and chunk correctly. Last verified: 03/21/2026.
