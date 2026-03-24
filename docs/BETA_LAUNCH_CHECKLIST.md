# Beta Launch Checklist

## Environment

- Copy `apps/web/.env.example` to `apps/web/.env`
- Copy `functions/.env.example` to `functions/.env`
- Confirm Firebase project values in `apps/web/.env`
- Confirm `OPENAI_KEY`, Stripe keys, Stripe price IDs, and `APP_BASE_URL` in `functions/.env`

## Build

- Run `cd apps/web && npm run build`
- Run `cd functions && npm run build`
- Run `cd apps/web && npm run test:logic`
- Run `cd apps/web && npm run smoke:beta`

## Deploy

- Deploy functions first: `firebase deploy --only functions`
- Deploy hosting after the web build: `firebase deploy --only hosting`
- Deploy Firestore rules/indexes when changed: `firebase deploy --only firestore`

## Smoke Test

- Sign in with Google
- Confirm first-time users are routed to onboarding
- Complete onboarding and confirm dashboard access
- Create an ABC log
- Send one Oracle message and confirm quota decrements only once
- Generate one share packet and confirm packet quota increments
- Open the public share link and confirm content loads
- Open Respite Care, use `Browse Sample Providers`, and open a demo provider detail page
- Test “Use My Location” on hosted build

## Stripe Validation

- Start checkout from the upgrade page
- Confirm success/cancel URLs return to the app correctly
- Confirm webhook updates subscription status in Firestore
- Open customer portal from settings
- Confirm subscription downgrade/cancel paths work

## Live Ops

- Review Firebase Hosting headers after deploy
- Check Cloud Functions logs after first AI request and first Stripe checkout
- Confirm Firestore rules permit expected client writes and block unexpected access
