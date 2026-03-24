# Giovanna Companion — Beta Polish Complete — Handoff Prompt

Copy everything between PROMPT START and PROMPT END into Antigravity's agent.

---

## PROMPT START

You are continuing development on **Giovanna Companion**. The full 12-week build plan is now complete — Weeks 1–10 plus all beta polish items (Weeks 11–12). Read `.antigravity/prompt.md` and `.antigravity/rules.md` for the full context. Both files have been updated to reflect everything that was just built.

### WHAT WAS JUST BUILT (This Session — Beta Polish)

**1. Data Visualization — `apps/web/src/components/BehaviorCharts.tsx` (NEW)**
- 4 Recharts charts: Frequency Over Time (area), Function Distribution (donut pie), Time of Day (bar), Intensity Trend (line)
- Auto-generated insight text per chart (e.g., "Escape is the most common function — this is valuable IEP evidence")
- Collapsible section, empty state with encouraging copy
- Uses `ABCEntry` types from `useABCLogs.ts`, sanctuary theme colors
- Wired into `Dashboard.tsx` — shows in growth mode when logs > 0

**2. Accessibility Audit — `apps/web/src/index.css` (MODIFIED) + `apps/web/src/components/Layout.tsx` (MODIFIED)**
- Skip-to-content link (`.skip-to-content` class, Tab-visible)
- Global `*:focus-visible` gold ring (2px, 2px offset) for keyboard navigation
- Mouse clicks suppressed via `:focus:not(:focus-visible)`
- `.sr-only` class for screen-reader-only text
- `@media (prefers-reduced-motion: reduce)` — kills all animations
- `@media (prefers-contrast: high)` — solid backgrounds, stronger borders
- `@keyframes spin` for PageLoadingFallback spinner
- Layout.tsx: `aria-label` on both nav elements, `role="main"` on `<main>`, `aria-expanded` + `aria-controls` on mobile menu button, `id="mobile-menu"` with `role="dialog"`

**3. Firestore Rules — `firestore.rules` (MODIFIED)**
- Added `feedback` collection: authenticated create, admin-only read

**4. Dashboard Integration — `apps/web/src/pages/Dashboard.tsx` (MODIFIED)**
- Added `BehaviorCharts` import and rendering after Quick Access section, before Wisdom Card
- Charts only appear in growth mode when `logs.length > 0`

### PREVIOUSLY BUILT BY ANTIGRAVITY (Already Verified)

These files were created by the Antigravity agent in a prior session. They are complete and wired in:

- `apps/web/src/components/OnboardingWalkthrough.tsx` — 4-step welcome tour, imported in Dashboard
- `apps/web/src/hooks/useAnalytics.ts` — Core loop event tracking (localStorage, privacy-first)
- `apps/web/src/components/FeedbackModal.tsx` — Emoji rating + textareas, saves to Firestore
- `apps/web/src/components/ErrorBoundary.tsx` — Class component with sanctuary fallback + PageLoadingFallback
- `apps/web/src/App.tsx` — Rewritten with `React.lazy()` + `Suspense` + `ErrorBoundary` on all routes

### COMPLETE FILE MANIFEST (Everything Modified This Session)

```
NEW:
  apps/web/src/components/BehaviorCharts.tsx    — Recharts data visualization

MODIFIED:
  apps/web/src/pages/Dashboard.tsx              — Added BehaviorCharts import + rendering
  apps/web/src/components/Layout.tsx            — Skip-to-content, ARIA landmarks, aria-expanded
  apps/web/src/index.css                        — Accessibility section (focus-visible, sr-only, reduced-motion, high-contrast, spin keyframes)
  firestore.rules                               — feedback collection rules
  .antigravity/prompt.md                        — Updated with all completed beta polish work
  .antigravity/rules.md                         — Added Data Visualization, Analytics, Accessibility sections
```

### VERIFICATION CHECKLIST

Before building anything new, verify:

1. `cd apps/web && npx tsc --noEmit` — Confirm zero TypeScript errors (especially BehaviorCharts Recharts imports)
2. Check that `recharts` is in `apps/web/package.json` dependencies — if not, run `npm install recharts`
3. Verify `BehaviorCharts` import resolves in Dashboard.tsx
4. Verify `OnboardingWalkthrough` import resolves in Dashboard.tsx
5. Verify `useAnalytics` import resolves in OnboardingWalkthrough.tsx
6. Verify the `@keyframes spin` in index.css matches PageLoadingFallback's border-top animation
7. Test skip-to-content link: Tab on page load should show gold "Skip to main content" link

### WHAT TO BUILD NEXT

The app is feature-complete for beta. The remaining work is deployment and testing:

**Deploy:**
- `npm install` in `functions/` (Stripe dependency)
- Set Firebase config: `firebase functions:config:set stripe.secret_key="sk_..." stripe.webhook_secret="whsec_..."`
- Create Stripe products/prices in Dashboard, update Firebase config with Price IDs
- Register webhook: `https://us-central1-giovanna-companion.cloudfunctions.net/stripeWebhook`
- `firebase deploy`
- Set up custom domain + SSL

**Post-Deploy:**
- Test full user flow: Signup → Onboarding → Log → Oracle → Bridge → Upgrade
- Test Stripe checkout → portal → cancellation → downgrade
- Recruit 10 beta families
- Monitor `feedback` collection in Firestore Console
- Check `getAnalyticsSummary()` output for core loop engagement metrics

**Future Features (Post-Beta):**
- Push notifications for logging reminders + crisis follow-ups
- Provider Portal (separate login for teachers/therapists)
- Insurance Appeal Generator
- Multi-language support (Spanish first)
- Mobile app (React Native or PWA)

## PROMPT END
