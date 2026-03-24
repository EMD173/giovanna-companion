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

The app is in **local development** (not yet deployed). Six critical blockers were just fixed:

1. **FamilyContext.tsx** — Syntax error fixed, dependency array corrected to prevent Firestore re-subscription loops
2. **Firestore rules** — Standardized on `adminId` field (was mismatched between `ownerId`, `adminId`, and `userId`)
3. **Route guards** — Added `ProtectedRoute` component; all authenticated routes are now protected
4. **ChatPage.tsx (The Oracle)** — Connected to real AI via `aiService.ts` + Cloud Functions. Previously used fake `setTimeout` responses. Now sends child context + conversation history in every prompt.
5. **Subscription rules** — Clients can create initial subscription docs; only Cloud Functions can update (prevents tier manipulation)
6. **Firebase config** — Moved from hardcoded values to environment variables

TypeScript compiles cleanly with zero errors.

## What Needs to Be Built Next (Build Sequence)

Follow this order. Each week builds on the last.

### Week 3: ABC Log Polish
- Add voice input to the ABC log form (Web Speech API already scaffolded in ChatPage)
- Add time-of-day auto-capture to log entries
- Add child selector dropdown for multi-child families
- Add a "function hypothesis" field (escape, attention, tangible, sensory) — this is what BCBAs look for
- Make Quick Log truly frictionless: voice → auto-categorize → save in under 15 seconds

### Week 4: Oracle Context Intelligence
- Inject full child profile + last 10 ABC logs + detected patterns into every Oracle prompt
- Add conversation persistence (save to Firestore so history survives page navigation)
- Add "suggested questions" that adapt based on recent log patterns (e.g., if 3 recent logs mention transitions, suggest "Help me with transition strategies")

### Week 5: Crisis Mode
- Crisis detection already exists (keyword matching in ChatPage.tsx)
- Build the full crisis UI: dark mode, personalized calming scripts using the child's known strategies, breathing timer, one-tap Village alert
- Add a "What Just Happened" post-crisis debrief that auto-creates an ABC log entry

### Week 6: Dashboard Simplification
- Reduce from 13 Quick Access pills to 4 contextual action cards
- Surface the most relevant action based on time of day and recent activity
- Make the Parent Check-In the first thing they see — it sets the capacity mode

### Week 7: Share Packet (The Bridge)
- Generate a teacher/provider share packet from logged data
- Run through guardrails validation (`validateContent()`)
- Include EC context section (regulation context, sensory needs, communication notes)
- Privacy-first: public access only through Cloud Functions, never direct Firestore reads

### Week 8: Child Profile + PDF Export
- Complete the child profile page with all fields from `ChildProfile` interface
- One-page PDF export (diagnosis, communication style, triggers, calming strategies, strengths)
- QR code that links to a time-limited share view

### Week 9: Deploy
- Firebase Hosting deployment
- SSL, custom domain
- Emulator testing for Cloud Functions
- Bug fix sprint

### Week 10: Stripe Integration
- Connect Stripe to subscription tiers (free → companion → pro)
- Paywall UI for gated features
- Trial period flow

### Week 11-12: Beta Testing
- 10 families using the app
- Feedback collection
- Iteration sprint

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
