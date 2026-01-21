# Secure API Key Rotation & Limits Documentation

## How to Rotate API Keys Safely

### Step 1: Generate New Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. **DO NOT** commit this key anywhere

### Step 2: Update Firebase Secret

```bash
# Set the new secret
firebase functions:secrets:set GEMINI_API_KEY

# You'll be prompted to enter the key securely
```

### Step 3: Deploy Functions

```bash
# Deploy only functions (includes new secret)
firebase deploy --only functions
```

### Step 4: Update Admin Dashboard

Update the `lastRotated` date in Firestore:

- Collection: `config`
- Document: `admin`
- Field: `lastRotated` → current date

### Step 5: Revoke Old Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Delete the old key

---

## How Usage Limits Work

### Tiers & Limits

| Tier | AI Queries/Month | Price |
|------|-----------------|-------|
| Free | 30 | $0 |
| Companion | 150 | $7.99/mo |
| Pro | 500 | $14.99/mo |
| Enterprise | Unlimited | $99/mo |

### How Limits Are Enforced

1. **Server-Side Only**: Limits are checked in the Cloud Function, not the client
2. **Atomic Increment**: Usage is incremented in a Firestore transaction before AI call
3. **Monthly Reset**: Usage resets on the 1st of each month (server time)

### When Limit Is Exceeded

User sees:
> "You've reached your monthly limit of 30 AI queries. Premium coming soon!"

### Checking Usage

Users can see their usage in Settings. Admins can see all users' usage in Admin Dashboard.

---

## Security Checklist

- [ ] API key is in Firebase Secrets, not environment variables
- [ ] No `VITE_*_API_KEY` in client code
- [ ] Cloud Function authenticates user before AI call
- [ ] Tier is checked server-side
- [ ] Usage is incremented atomically
- [ ] Admin endpoints verify admin UID
- [ ] `.env.local` is in `.gitignore`

---

## Emergency Procedures

### If Key Is Exposed

1. **Immediately** revoke the key in Google AI Studio
2. Generate a new key
3. Run `firebase functions:secrets:set GEMINI_API_KEY`
4. Deploy: `firebase deploy --only functions`
5. Check Cloud Function logs for unauthorized usage

### If Usage Is Abnormal

1. Enable `maintenanceMode` in Admin Settings
2. Check Firestore `subscriptions` for suspicious accounts
3. Review Cloud Function logs
4. Consider adding rate limiting at function level
