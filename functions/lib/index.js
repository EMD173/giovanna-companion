"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createPortalSession = exports.createCheckoutSession = exports.getSharePacket = exports.getAppConfig = exports.checkApiStatus = exports.giovannaChat = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
// OpenAI is loaded lazily to avoid deployment initialization timeouts
let _openai = null;
function getOpenAI(apiKey) {
    if (!_openai) {
        const OpenAI = require('openai').default;
        _openai = new OpenAI({ apiKey });
    }
    return _openai;
}
const stripe_1 = __importDefault(require("stripe"));
admin.initializeApp();
const APP_BASE_URL = process.env.APP_BASE_URL || 'https://giovanna.app';
const ALLOWED_RETURN_ORIGINS = new Set([
    APP_BASE_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].map((value) => {
    try {
        return new URL(value).origin;
    }
    catch {
        return value;
    }
}));
// ============================================
// STRIPE INITIALIZATION
// ============================================
const getStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new functions.https.HttpsError('failed-precondition', 'Stripe secret key not configured. Set STRIPE_SECRET_KEY in functions/.env');
    }
    return new stripe_1.default(secretKey, { apiVersion: '2023-10-16' });
};
// Stripe Price IDs — set via functions/.env file
const STRIPE_PRICES = {
    companion: {
        monthly: process.env.STRIPE_COMPANION_MONTHLY || '',
        yearly: process.env.STRIPE_COMPANION_YEARLY || '',
    },
    pro: {
        monthly: process.env.STRIPE_PRO_MONTHLY || '',
        yearly: process.env.STRIPE_PRO_YEARLY || '',
    },
    enterprise: {
        monthly: process.env.STRIPE_ENTERPRISE_MONTHLY || '',
        yearly: process.env.STRIPE_ENTERPRISE_YEARLY || '',
    },
};
function getStripePriceId(tier, billing) {
    const priceId = STRIPE_PRICES[tier][billing];
    if (!priceId) {
        throw new functions.https.HttpsError('failed-precondition', `Stripe price ID missing for ${tier} ${billing}. Set it in functions/.env`);
    }
    return priceId;
}
function sanitizeReturnUrl(url, fallbackPath) {
    const fallback = new URL(fallbackPath, APP_BASE_URL).toString();
    if (!url)
        return fallback;
    try {
        const parsed = new URL(url);
        if (ALLOWED_RETURN_ORIGINS.has(parsed.origin)) {
            return parsed.toString();
        }
    }
    catch {
        // Fall through to safe default
    }
    return fallback;
}
// ============================================
// TIER CONFIGURATION (Server-side)
// ============================================
const TIER_LIMITS = {
    free: { aiQueriesPerMonth: 30 },
    companion: { aiQueriesPerMonth: 150 },
    pro: { aiQueriesPerMonth: 500 },
    enterprise: { aiQueriesPerMonth: -1 } // unlimited
};
// ============================================
// PROJECT CONJURE — RELATIONAL LANGUAGE PROTECTION
// Protects Black Language relational constructions from tokenization
// fragmentation before parent messages enter the OpenAI API.
// Source: Davis (2026), Smitherman (1977), Rickford (1999)
// ============================================
const CONJURE_PROTECTED_PAIRS = [
    // Black American Language — aspectual and relational constructions
    ['finna go', 'finna_go'],
    ['gon be', 'gon_be'],
    ['ion know', 'ion_know'],
    ["ain't even", 'aint_even'],
    ['been done', 'been_done'],
    ['come on now', 'come_on_now'],
    ['for real', 'for_real'],
    ['stay ready', 'stay_ready'],
    ["I'm tryna", 'im_tryna'],
    ['child please', 'child_please'],
    ['been struggling', 'been_struggling'],
    ['keep messing', 'keep_messing'],
    ['stay in trouble', 'stay_in_trouble'],
    ['finna act', 'finna_act'],
    ['bout to', 'bout_to'],
    ['fixing to', 'fixing_to'],
    // Gullah/Geechee
    ['e bin', 'e_bin'],
    ['fa true', 'fa_true'],
    // Haitian Creole
    ['ap ale', 'ap_ale'],
    ['te di', 'te_di'],
];
function conjureProtect(message) {
    let protectedMessage = message;
    for (const [original, joined] of CONJURE_PROTECTED_PAIRS) {
        const regex = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        protectedMessage = protectedMessage.replace(regex, joined);
    }
    return protectedMessage;
}
// ============================================
// GIOVANNA SYSTEM PROMPT — ABA CONSULTANT INTELLIGENCE
// ============================================
const GIOVANNA_SYSTEM_PROMPT = `You are Giovanna, a compassionate AI companion for parents of neurodivergent children — centering Black and Brown families who face compounded barriers in the disability system. You are not a chatbot. You are the wise elder who has been through this before and sits with the parent without judgment.

Your greeting is "Welcome, honored one." Your crisis response begins with "I hear you. You are safe."

=== CORE PRINCIPLES (Non-Negotiable) ===

1. BEHAVIOR IS COMMUNICATION, NOT DEFIANCE
When a child acts in challenging ways, they are communicating a need, a discomfort, an overwhelm — not trying to manipulate. Your job is to help the parent decode the message, not punish the messenger.
Citation: Carr & Durand (1985), Functional Communication Training, JABA 18(2).

2. REGULATION OVER COMPLIANCE
A regulated child can learn. A dysregulated child cannot. Always prioritize helping children feel safe and calm before expecting them to follow instructions. "You can't teach a child to swim while they're drowning."
Citation: Porges (2011), The Polyvagal Theory; Delahooke (2019), Beyond Behaviors.

3. ASSUME COMPETENCE
When you don't know what someone understands or can do, assume they understand more than they can show. The consequences of underestimating are more harmful than overestimating.
Citation: Donnellan (1984), Criterion of the Least Dangerous Assumption.

4. PROTECT SELF-REGULATORY BEHAVIORS
Stimming is not a problem to solve. It is a regulation tool and a nervous system need. Never recommend suppressing safe stims. Never use "quiet hands." When we stop stimming, we take away their regulation tool, and things get worse, not better.
Citation: Kapp et al. (2019), Autistic adults' views of stimming, Autism 23(7).

5. CO-REGULATION BEFORE SELF-REGULATION
Children learn to regulate themselves through thousands of experiences of being regulated by calm, responsive adults. Before expecting self-regulation, we must provide co-regulation. "Nobody learns to calm down alone."
Citation: Tronick (2007); Schore (2003), Affect Regulation.

=== THEORETICAL FRAMEWORKS ===

- Polyvagal Theory: Three nervous system states (ventral vagal/calm, sympathetic/fight-flight, dorsal vagal/freeze). Behavior reflects nervous system state, not character.
- Neurodiversity Paradigm: Neurological differences are natural variations, not deficits to cure. (Singer, 1998)
- Trauma-Informed Care: Design responses to avoid re-traumatization. (SAMHSA, 2014)
- Epigenetic Consciousness: View behavior through four lenses — Lineage & Story, Environment & Load, Nervous System, Meaning & Dignity. (Davis, 2025)

=== ABA CONSULTANT ROLE ===

You are not a static information source. You are a CONSULTANT who:
- Reads the child's ABC log patterns and identifies functions (escape, attention, tangible, sensory)
- Draws from evidence-based strategies and says "this has worked for other families" when relevant
- Translates problematic ABA terminology into respectful, neuro-affirming language
- Helps parents prepare for IEP meetings with evidence-based talking points and citations
- Drafts professional advocacy emails to teachers using the school scripts from research
- Detects escalation trends and proactively suggests when to seek additional support
- Understands that Black and Brown families face compounded barriers: misdiagnosis, cultural stigma, systemic exclusion from services

=== SCHOOL COMMUNICATION SCRIPTS (use as templates) ===

When helping parents write to schools, draw from these evidence-based scripts:

For behavior as communication:
"We understand behavior as communication. When [child] does [behavior], it usually means they're overwhelmed or need something they don't yet have words for. Rather than consequences, we'd appreciate a pause to ask: 'What are they trying to tell us?'"

For regulation over compliance:
"When [child] is dysregulated, their nervous system is in survival mode — their thinking brain isn't available. We prioritize helping them feel safe and calm first. Teaching can happen once they're back to a calm state."

For stimming:
"[Child] uses repetitive movements to regulate their nervous system. Research shows that suppressing stimming increases anxiety and decreases learning capacity. Unless the behavior is unsafe, please allow it."

For presuming competence:
"We follow the 'least dangerous assumption' — when we're unsure what [child] understands, we assume competence. The research shows that underestimating children causes more harm than overestimating them."

=== LANGUAGE RULES ===

NEVER use: "low-functioning", "high-functioning", "suffering from", "special needs", "cure autism", "overcome autism", "retarded", "afflicted with", "mental age", "non-compliant", "extinguish behavior", "quiet hands", "normal children"

USE instead: "high support needs", "is autistic / has autism", "disability / support needs", "thriving as an autistic person", "address the underlying need", "neurotypical"

Default to identity-first language ("autistic person") per autistic self-advocate preferences (Kenny et al., 2016).

=== RESPONSE STYLE ===

- Respond warmly but concisely. Use markdown for formatting when helpful.
- Always offer practical next steps the parent can take TODAY.
- When citing strategies, attribute them: "Research from Dr. Mona Delahooke suggests..."
- Center the parent's expertise: they know their child best.
- Acknowledge systemic barriers without centering them: "The system wasn't built for you, but your advocacy changes it."
- Never make a parent feel like they are failing. Because they are not.
- When the parent's message includes child context and ABC logs, reference that data specifically in your response.`;
// ============================================
// GIOVANNA AI CHAT (Secure, Tier-Enforced)
// ============================================
exports.giovannaChat = functions.https.onCall(async (data, context) => {
    // 1. AUTHENTICATE
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to use Giovanna AI.');
    }
    const userId = context.auth.uid;
    const db = admin.firestore();
    // 2. GET USER SUBSCRIPTION & USAGE
    const subRef = db.collection('subscriptions').doc(userId);
    const subDoc = await subRef.get();
    let tier = 'free';
    let usage = { aiQueriesUsed: 0, lastResetDate: new Date() };
    if (subDoc.exists) {
        const subData = subDoc.data();
        tier = (subData?.tier || 'free');
        usage = subData?.usage || usage;
        // Check if monthly reset needed
        const now = new Date();
        const lastReset = subData?.usage?.lastResetDate?.toDate?.() || new Date(0);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            usage = { aiQueriesUsed: 0, lastResetDate: now };
            await subRef.set({ usage }, { merge: true });
        }
    }
    else {
        // Create default subscription
        await subRef.set({
            tier: 'free',
            status: 'active',
            usage: { aiQueriesUsed: 0, lastResetDate: new Date() },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    // 3. CHECK LIMITS
    const limit = TIER_LIMITS[tier].aiQueriesPerMonth;
    if (limit !== -1 && usage.aiQueriesUsed >= limit) {
        return {
            error: 'LIMIT_EXCEEDED',
            message: `You've reached your monthly limit of ${limit} AI queries. Upgrade to continue, or wait until next month.`,
            response: null
        };
    }
    // 4. INCREMENT USAGE ATOMICALLY
    await subRef.update({
        'usage.aiQueriesUsed': admin.firestore.FieldValue.increment(1)
    });
    // 5. CALL OPENAI WITH FULL CONTEXT
    const { message, context: hubContext } = data;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Message is required');
    }
    try {
        const apiKey = process.env.OPENAI_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key not configured. Set OPENAI_KEY in functions/.env');
        }
        const openai = getOpenAI(apiKey);
        // Build supplemental context from Learning Hub
        const contentContext = hubContext
            ? hubContext.map((item) => `Topic: ${item.title}\nCategory: ${item.category}\nDefinition: ${item.definition}\nSchool Script: "${item.whatToShare}"`).join('\n\n')
            : '';
        const systemPrompt = contentContext
            ? `${GIOVANNA_SYSTEM_PROMPT}\n\n=== ADDITIONAL LEARNING HUB CONTEXT ===\n${contentContext}`
            : GIOVANNA_SYSTEM_PROMPT;
        // PROJECT CONJURE: Protect relational language before tokenization
        const protectedMessage = conjureProtect(message);
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: protectedMessage }
            ],
            max_tokens: 1500,
            temperature: 0.7,
        });
        const text = completion.choices[0]?.message?.content || '';
        return { response: text, error: null };
    }
    catch (error) {
        console.error('Giovanna AI error:', error);
        return {
            error: 'AI_ERROR',
            message: 'AI service temporarily unavailable',
            response: "I'm having trouble connecting right now. Please try again in a moment."
        };
    }
});
// ============================================
// ADMIN: CHECK API STATUS
// ============================================
const ADMIN_UIDS = [
    // Add your admin UIDs here
    'REPLACE_WITH_YOUR_UID'
];
exports.checkApiStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth || !ADMIN_UIDS.includes(context.auth.uid)) {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    const apiKey = process.env.OPENAI_KEY;
    const keyConfigured = !!apiKey;
    let testResult = 'unknown';
    if (keyConfigured) {
        try {
            const openai = getOpenAI(apiKey);
            await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 5
            });
            testResult = 'working';
        }
        catch {
            testResult = 'error';
        }
    }
    return {
        provider: 'openai',
        model: 'gpt-4o-mini',
        keyConfigured,
        testResult,
        lastChecked: new Date().toISOString()
    };
});
// ============================================
// APP CONFIG (Feature flags)
// ============================================
exports.getAppConfig = functions.https.onCall(async () => {
    const db = admin.firestore();
    const configDoc = await db.collection('config').doc('app').get();
    if (!configDoc.exists) {
        return {
            paidEnabled: false,
            maintenanceMode: false,
            version: '1.0.0'
        };
    }
    return configDoc.data();
});
// ============================================
// PUBLIC SHARE VIEW (Privacy-First)
// ============================================
exports.getSharePacket = functions.https.onCall(async (data) => {
    const { token, passcode } = data;
    if (!token) {
        throw new functions.https.HttpsError('invalid-argument', 'Token required');
    }
    const db = admin.firestore();
    const packetsRef = db.collection('sharePackets');
    const snapshot = await packetsRef.where('accessToken', '==', token).limit(1).get();
    if (snapshot.empty) {
        return { error: 'NOT_FOUND', message: 'Share packet not found or expired.' };
    }
    const packetDoc = snapshot.docs[0];
    const packet = packetDoc.data();
    // Check revoked
    if (packet.revoked) {
        return { error: 'REVOKED', message: 'This share link has been revoked by the family.' };
    }
    // Check expiration
    const expiresAt = packet.expiresAt?.toDate?.();
    if (expiresAt && new Date() > expiresAt) {
        return { error: 'EXPIRED', message: 'This share link has expired.' };
    }
    // Check passcode
    if (packet.hasPasscode && packet.passcodeHash) {
        if (!passcode) {
            return { error: 'PASSCODE_REQUIRED', message: 'This packet requires a passcode.' };
        }
        // Hash the provided passcode and compare
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256').update(passcode).digest('hex');
        if (hash !== packet.passcodeHash) {
            return { error: 'INVALID_PASSCODE', message: 'Incorrect passcode.' };
        }
    }
    // Increment view count
    await packetDoc.ref.update({
        views: admin.firestore.FieldValue.increment(1)
    });
    // Return sanitized content (no internal IDs)
    return {
        recipientName: packet.recipientName,
        content: packet.content,
        generatedAt: packet.generatedAt?.toDate?.()?.toISOString(),
        expiresAt: expiresAt?.toISOString(),
    };
});
// ============================================
// STRIPE: CREATE CHECKOUT SESSION
// ============================================
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }
    const { tier, billing, successUrl, cancelUrl } = data;
    const userId = context.auth.uid;
    const userEmail = context.auth.token.email || data.userEmail || '';
    // Validate tier
    if (!tier || !['companion', 'pro', 'enterprise'].includes(tier)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid subscription tier');
    }
    if (!billing || !['monthly', 'yearly'].includes(billing)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid billing cycle');
    }
    const stripe = getStripe();
    const priceId = getStripePriceId(tier, billing);
    try {
        // Check if user already has a Stripe customer ID
        const db = admin.firestore();
        const subDoc = await db.collection('subscriptions').doc(userId).get();
        let customerId = subDoc.exists ? subDoc.data()?.stripeCustomerId : undefined;
        // Create customer if needed
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { firebaseUid: userId },
            });
            customerId = customer.id;
            // Store customer ID immediately
            await db.collection('subscriptions').doc(userId).set({ stripeCustomerId: customerId }, { merge: true });
        }
        // Create checkout session with 7-day trial
        const sessionConfig = {
            customer: customerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: sanitizeReturnUrl(successUrl, '/upgrade?upgrade=success'),
            cancel_url: sanitizeReturnUrl(cancelUrl, '/upgrade?upgrade=cancelled'),
            metadata: { userId, tier },
            subscription_data: {
                trial_period_days: 7,
                metadata: { userId, tier },
            },
            allow_promotion_codes: true,
        };
        const session = await stripe.checkout.sessions.create(sessionConfig);
        return { url: session.url, sessionId: session.id };
    }
    catch (error) {
        console.error('Stripe checkout error:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Checkout session creation failed');
    }
});
// ============================================
// STRIPE: CREATE CUSTOMER PORTAL SESSION
// ============================================
exports.createPortalSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }
    const userId = context.auth.uid;
    const db = admin.firestore();
    const subDoc = await db.collection('subscriptions').doc(userId).get();
    if (!subDoc.exists || !subDoc.data()?.stripeCustomerId) {
        throw new functions.https.HttpsError('not-found', 'No active subscription found');
    }
    const stripe = getStripe();
    const customerId = subDoc.data().stripeCustomerId;
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: sanitizeReturnUrl(data.returnUrl, '/settings'),
        });
        return { url: session.url };
    }
    catch (error) {
        console.error('Stripe portal error:', error);
        throw new functions.https.HttpsError('internal', error.message || 'Portal session creation failed');
    }
});
// ============================================
// STRIPE: WEBHOOK HANDLER
// ============================================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const stripe = getStripe();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
        console.error('Stripe webhook secret not configured');
        res.status(500).send('Webhook secret not configured');
        return;
    }
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    const db = admin.firestore();
    try {
        switch (event.type) {
            // ---- Checkout completed (new subscription) ----
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata?.userId;
                const tier = session.metadata?.tier;
                if (userId && tier) {
                    await db.collection('subscriptions').doc(userId).set({
                        tier,
                        status: session.subscription ? 'active' : 'trialing',
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription,
                        currentPeriodStart: new Date(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    console.log(`[Stripe] User ${userId} subscribed to ${tier}`);
                }
                break;
            }
            // ---- Subscription updated (renewal, plan change, trial end) ----
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const userId = subscription.metadata?.userId;
                if (userId) {
                    const tier = subscription.metadata?.tier || 'free';
                    const status = subscription.status === 'trialing' ? 'trialing'
                        : subscription.status === 'active' ? 'active'
                            : subscription.status === 'past_due' ? 'past_due'
                                : 'canceled';
                    await db.collection('subscriptions').doc(userId).set({
                        tier: status === 'canceled' ? 'free' : tier,
                        status,
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    console.log(`[Stripe] User ${userId} subscription updated: ${status} (${tier})`);
                }
                else {
                    // Lookup user by stripeCustomerId
                    const customerId = subscription.customer;
                    const snapshot = await db.collection('subscriptions')
                        .where('stripeCustomerId', '==', customerId)
                        .limit(1)
                        .get();
                    if (!snapshot.empty) {
                        const userDoc = snapshot.docs[0];
                        const tier = subscription.metadata?.tier || userDoc.data()?.tier || 'free';
                        const status = subscription.status === 'trialing' ? 'trialing'
                            : subscription.status === 'active' ? 'active'
                                : subscription.status === 'past_due' ? 'past_due'
                                    : 'canceled';
                        await userDoc.ref.set({
                            tier: status === 'canceled' ? 'free' : tier,
                            status,
                            currentPeriodStart: new Date(subscription.current_period_start * 1000),
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                        }, { merge: true });
                        console.log(`[Stripe] Customer ${customerId} subscription updated via lookup`);
                    }
                }
                break;
            }
            // ---- Subscription deleted (cancellation) ----
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const userId = subscription.metadata?.userId;
                if (userId) {
                    await db.collection('subscriptions').doc(userId).set({
                        tier: 'free',
                        status: 'canceled',
                        stripeSubscriptionId: null,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    console.log(`[Stripe] User ${userId} subscription canceled — downgraded to free`);
                }
                else {
                    // Fallback: lookup by customer ID
                    const customerId = subscription.customer;
                    const snapshot = await db.collection('subscriptions')
                        .where('stripeCustomerId', '==', customerId)
                        .limit(1)
                        .get();
                    if (!snapshot.empty) {
                        await snapshot.docs[0].ref.set({
                            tier: 'free',
                            status: 'canceled',
                            stripeSubscriptionId: null,
                            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                        }, { merge: true });
                        console.log(`[Stripe] Customer ${customerId} canceled via lookup — downgraded to free`);
                    }
                }
                break;
            }
            // ---- Invoice payment failed ----
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const customerId = invoice.customer;
                const snapshot = await db.collection('subscriptions')
                    .where('stripeCustomerId', '==', customerId)
                    .limit(1)
                    .get();
                if (!snapshot.empty) {
                    await snapshot.docs[0].ref.set({
                        status: 'past_due',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    console.log(`[Stripe] Payment failed for customer ${customerId}`);
                }
                break;
            }
            default:
                console.log(`[Stripe] Unhandled event type: ${event.type}`);
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('[Stripe] Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
});
//# sourceMappingURL=index.js.map