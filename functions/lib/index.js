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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppConfig = exports.checkApiStatus = exports.giovannaChat = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const openai_1 = __importDefault(require("openai"));
admin.initializeApp();
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
    // 5. CALL OPENAI WITH SERVER CONFIG
    const { message, context: hubContext } = data;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'Message is required');
    }
    try {
        // Get API key from Firebase config
        const apiKey = functions.config().openai?.key;
        if (!apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        const openai = new openai_1.default({ apiKey });
        // Build context from Learning Hub content
        const contentContext = hubContext
            ? hubContext.map((item) => `Topic: ${item.title}\nCategory: ${item.category}\nDefinition: ${item.definition}\nSchool Script: "${item.whatToShare}"`).join('\n\n')
            : '';
        const systemPrompt = `You are Giovanna, a compassionate AI assistant for parents of neurodivergent children. 

Your role is to:
1. Explain neurodivergent behaviors in neuro-affirming language
2. Help parents draft professional, advocacy-centered emails to teachers
3. Prepare parents for IEP meetings with evidence-based talking points
4. Translate problematic ABA terminology into respectful, person-first language

Key principles:
- Behavior is communication, not defiance
- Regulation over compliance
- Assume competence
- Never recommend extinction of self-regulatory behaviors (stimming)
- Emphasize co-regulation and sensory needs

Here is your knowledge base of neuro-affirming content:
${contentContext}

Respond warmly but concisely. Use markdown for formatting when helpful. Always offer practical next steps.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            max_tokens: 1000
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
// ADMIN: CHECK API STATUS (No key exposure)
// ============================================
const ADMIN_UIDS = [
    // Add your admin UIDs here
    'REPLACE_WITH_YOUR_UID'
];
exports.checkApiStatus = functions.https.onCall(async (data, context) => {
    // Admin only
    if (!context.auth || !ADMIN_UIDS.includes(context.auth.uid)) {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    // Check if key is configured (don't expose actual key)
    const apiKey = functions.config().openai?.key;
    const keyConfigured = !!apiKey;
    // Test the API
    let testResult = 'unknown';
    if (keyConfigured) {
        try {
            const openai = new openai_1.default({ apiKey });
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
        // Default config
        return {
            paidEnabled: false,
            maintenanceMode: false,
            version: '1.0.0'
        };
    }
    return configDoc.data();
});
//# sourceMappingURL=index.js.map