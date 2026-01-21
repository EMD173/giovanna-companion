import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defineSecret } from 'firebase-functions/params';
import OpenAI from 'openai';

admin.initializeApp();

// Server-side secret - NEVER exposed to client
const openaiApiKey = defineSecret('OPENAI_API_KEY');

// ============================================
// TIER CONFIGURATION (Server-side)
// ============================================

const TIER_LIMITS = {
    free: { aiQueriesPerMonth: 30 },
    companion: { aiQueriesPerMonth: 150 },
    pro: { aiQueriesPerMonth: 500 },
    enterprise: { aiQueriesPerMonth: -1 }  // unlimited
};

type SubscriptionTier = keyof typeof TIER_LIMITS;

// ============================================
// GIOVANNA AI CHAT (Secure, Tier-Enforced)
// ============================================

export const giovannaChat = functions
    .runWith({ secrets: [openaiApiKey] })
    .https.onCall(async (data, context) => {
        // 1. AUTHENTICATE
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'You must be logged in to use Giovanna AI.'
            );
        }

        const userId = context.auth.uid;
        const db = admin.firestore();

        // 2. GET USER SUBSCRIPTION & USAGE
        const subRef = db.collection('subscriptions').doc(userId);
        const subDoc = await subRef.get();

        let tier: SubscriptionTier = 'free';
        let usage = { aiQueriesUsed: 0, lastResetDate: new Date() };

        if (subDoc.exists) {
            const subData = subDoc.data();
            tier = (subData?.tier || 'free') as SubscriptionTier;
            usage = subData?.usage || usage;

            // Check if monthly reset needed
            const now = new Date();
            const lastReset = subData?.usage?.lastResetDate?.toDate?.() || new Date(0);
            if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
                usage = { aiQueriesUsed: 0, lastResetDate: now };
                await subRef.set({ usage }, { merge: true });
            }
        } else {
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

        // 5. CALL OPENAI WITH SERVER SECRET
        const { message, context: hubContext } = data;

        if (!message) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Message is required'
            );
        }

        try {
            const openai = new OpenAI({ apiKey: openaiApiKey.value() });

            // Build context from Learning Hub content
            const contentContext = hubContext
                ? hubContext.map((item: { title: string; category: string; definition: string; whatToShare: string }) =>
                    `Topic: ${item.title}\nCategory: ${item.category}\nDefinition: ${item.definition}\nSchool Script: "${item.whatToShare}"`
                ).join('\n\n')
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
                model: 'gpt-4o-mini',  // Cheapest and fast
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 1000
            });

            const text = completion.choices[0]?.message?.content || '';

            return { response: text, error: null };
        } catch (error) {
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

export const checkApiStatus = functions
    .runWith({ secrets: [openaiApiKey] })
    .https.onCall(async (data, context) => {
        // Admin only
        if (!context.auth || !ADMIN_UIDS.includes(context.auth.uid)) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Admin access required'
            );
        }

        // Check if key is configured (don't expose actual key)
        const keyConfigured = !!openaiApiKey.value();

        // Test the API
        let testResult = 'unknown';
        if (keyConfigured) {
            try {
                const openai = new OpenAI({ apiKey: openaiApiKey.value() });
                await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: 'Hello' }],
                    max_tokens: 5
                });
                testResult = 'working';
            } catch {
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

export const getAppConfig = functions.https.onCall(async () => {
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
