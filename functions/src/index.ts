import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { defineSecret } from 'firebase-functions/params';

admin.initializeApp();

// Server-side secret - NEVER exposed to client
const geminiApiKey = defineSecret('GEMINI_API_KEY');

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

// Rate limit cache (in-memory, resets on function cold start)
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

export const giovannaChat = functions
    .runWith({
        secrets: [geminiApiKey],
        enforceAppCheck: true // Reject requests without valid App Check token
    })
    .https.onCall(async (data, context) => {
        // 1. AUTHENTICATE
        if (!context.auth) {
            throw new functions.https.HttpsError(
                'unauthenticated',
                'You must be logged in to use Giovanna AI.'
            );
        }

        const userId = context.auth.uid;

        // 2. RATE LIMITING (per-user, in-memory)
        const now = Date.now();
        const userLimit = rateLimitCache.get(userId);

        if (userLimit) {
            if (now < userLimit.resetTime) {
                if (userLimit.count >= RATE_LIMIT_REQUESTS) {
                    console.warn(`[AI] Rate limit exceeded for user: ${userId}`);
                    throw new functions.https.HttpsError(
                        'resource-exhausted',
                        `Too many requests. Please wait a moment before trying again.`
                    );
                }
                userLimit.count++;
            } else {
                // Reset window
                rateLimitCache.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
            }
        } else {
            rateLimitCache.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        }

        const db = admin.firestore();

        // 3. GET USER SUBSCRIPTION & USAGE
        const subRef = db.collection('subscriptions').doc(userId);
        const subDoc = await subRef.get();

        let tier: SubscriptionTier = 'free';
        let usage = { aiQueriesUsed: 0, lastResetDate: new Date() };

        if (subDoc.exists) {
            const subData = subDoc.data();
            tier = (subData?.tier || 'free') as SubscriptionTier;
            usage = subData?.usage || usage;

            // Check if monthly reset needed
            const serverNow = new Date();
            const lastReset = subData?.usage?.lastResetDate?.toDate?.() || new Date(0);
            if (serverNow.getMonth() !== lastReset.getMonth() || serverNow.getFullYear() !== lastReset.getFullYear()) {
                usage = { aiQueriesUsed: 0, lastResetDate: serverNow };
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

        // 4. CHECK TIER LIMITS
        const limit = TIER_LIMITS[tier].aiQueriesPerMonth;
        if (limit !== -1 && usage.aiQueriesUsed >= limit) {
            return {
                error: 'LIMIT_EXCEEDED',
                message: `You've reached your monthly limit of ${limit} AI queries. Upgrade to continue, or wait until next month.`,
                response: null
            };
        }

        // 5. INCREMENT USAGE ATOMICALLY
        await subRef.update({
            'usage.aiQueriesUsed': admin.firestore.FieldValue.increment(1)
        });

        // 6. CALL AI WITH SERVER SECRET
        const { message, context: hubContext } = data;

        if (!message) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Message is required'
            );
        }

        // Calculate input length for logging (no raw content stored)
        const inputLength = typeof message === 'string' ? message.length : 0;

        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey.value());

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

            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

            const prompt = systemPrompt + '\n\nUser question: ' + message;
            const result = await model.generateContent(prompt);

            const response = result.response;
            const text = response.text();

            // 7. LOG MINIMAL METADATA (no raw content)
            console.log(`[AI] Query processed: uid=${userId} tier=${tier} inputLen=${inputLength} outputLen=${text.length}`);

            return { response: text, error: null };
        } catch (error) {
            console.error('[AI] Giovanna AI error:', error);
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
    .runWith({ secrets: [geminiApiKey] })
    .https.onCall(async (data, context) => {
        // Admin only
        if (!context.auth || !ADMIN_UIDS.includes(context.auth.uid)) {
            throw new functions.https.HttpsError(
                'permission-denied',
                'Admin access required'
            );
        }

        // Check if key is configured (don't expose actual key)
        const keyConfigured = !!geminiApiKey.value();

        // Test the API
        let testResult = 'unknown';
        if (keyConfigured) {
            try {
                const genAI = new GoogleGenerativeAI(geminiApiKey.value());
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
                await model.generateContent('Hello');
                testResult = 'working';
            } catch {
                testResult = 'error';
            }
        }

        return {
            provider: 'gemini',
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

// ============================================
// SHARE PACKETS: SECURE PUBLIC ACCESS
// ============================================

interface SharePacketContent {
    logs: Array<{
        id: string;
        antecedent: string;
        behavior: string;
        consequence: string;
        timestamp: admin.firestore.Timestamp;
    }>;
    strategies: Array<{
        id: string;
        title: string;
        procedure: string;
    }>;
    summaryMessage: string;
}

interface SharePacketData {
    familyId: string;
    accessToken: string;
    recipientName: string;
    generatedAt: admin.firestore.Timestamp;
    expiresAt: admin.firestore.Timestamp;
    views: number;
    revoked?: boolean;
    hasPasscode?: boolean;
    passcodeHash?: string;
    content: SharePacketContent;
}

/**
 * Securely fetch a share packet using access token.
 * Does NOT require authentication - this is the public "bridge".
 * Validates: token format, expiry, revocation, optional passcode.
 */
export const getPublicSharePacket = functions.https.onCall(async (data) => {
    const { token, passcode } = data as { token?: string; passcode?: string };

    // 1. VALIDATE TOKEN FORMAT
    if (!token || typeof token !== 'string' || token.length < 32) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Invalid access token'
        );
    }

    const db = admin.firestore();

    // 2. QUERY BY TOKEN (not document ID)
    const packetsRef = db.collection('sharePackets');
    const snapshot = await packetsRef.where('accessToken', '==', token).limit(1).get();

    if (snapshot.empty) {
        // Log potential brute-force attempt (minimal data)
        console.warn(`[SHARE] Invalid token attempt: ${token.substring(0, 8)}...`);
        throw new functions.https.HttpsError(
            'not-found',
            'Share link not found or has been revoked'
        );
    }

    const packetDoc = snapshot.docs[0];
    const packet = packetDoc.data() as SharePacketData;

    // 3. CHECK REVOCATION
    if (packet.revoked === true) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'This share link has been revoked'
        );
    }

    // 4. CHECK EXPIRY (server-side time)
    const now = admin.firestore.Timestamp.now();
    if (packet.expiresAt.toMillis() < now.toMillis()) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'This share link has expired'
        );
    }

    // 5. CHECK PASSCODE (if required)
    if (packet.hasPasscode && packet.passcodeHash) {
        if (!passcode) {
            // Return that passcode is needed (don't reveal packet data)
            return {
                requiresPasscode: true,
                recipientName: packet.recipientName,
                expiresAt: packet.expiresAt.toDate().toISOString()
            };
        }

        // Simple hash comparison (in production, use bcrypt)
        const crypto = await import('crypto');
        const inputHash = crypto.createHash('sha256').update(passcode).digest('hex');
        if (inputHash !== packet.passcodeHash) {
            console.warn(`[SHARE] Invalid passcode attempt for packet: ${packetDoc.id}`);
            throw new functions.https.HttpsError(
                'permission-denied',
                'Invalid passcode'
            );
        }
    }

    // 6. INCREMENT VIEW COUNT (fire-and-forget)
    packetDoc.ref.update({
        views: admin.firestore.FieldValue.increment(1)
    }).catch(() => { /* ignore */ });

    // 7. RETURN SANITIZED PAYLOAD (read-only, no internal IDs exposed)
    return {
        requiresPasscode: false,
        recipientName: packet.recipientName,
        generatedAt: packet.generatedAt.toDate().toISOString(),
        expiresAt: packet.expiresAt.toDate().toISOString(),
        content: {
            summaryMessage: packet.content.summaryMessage,
            strategies: packet.content.strategies.map(s => ({
                title: s.title,
                procedure: s.procedure
            })),
            logs: packet.content.logs.map(l => ({
                antecedent: l.antecedent,
                behavior: l.behavior,
                consequence: l.consequence,
                timestamp: l.timestamp?.toDate?.()?.toISOString() || null
            }))
        }
    };
});

// ============================================
// PRIVACY: DELETE ACCOUNT
// ============================================

/**
 * Delete user account and all associated data.
 * Cascades: families, children, abcEntries, strategies, sharePackets, preferences.
 */
export const deleteAccount = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    const userId = context.auth.uid;
    const db = admin.firestore();
    const batch = db.batch();

    try {
        // 1. Delete families owned by user
        const familiesSnap = await db.collection('families')
            .where('ownerId', '==', userId).get();

        for (const familyDoc of familiesSnap.docs) {
            const familyId = familyDoc.id;

            // Delete children
            const childrenSnap = await db.collection('children')
                .where('familyId', '==', familyId).get();
            childrenSnap.docs.forEach(doc => batch.delete(doc.ref));

            // Delete ABC entries
            const abcSnap = await db.collection('abcEntries')
                .where('familyId', '==', familyId).get();
            abcSnap.docs.forEach(doc => batch.delete(doc.ref));

            // Delete strategies
            const stratSnap = await db.collection('strategies')
                .where('familyId', '==', familyId).get();
            stratSnap.docs.forEach(doc => batch.delete(doc.ref));

            // Delete share packets
            const packetsSnap = await db.collection('sharePackets')
                .where('familyId', '==', familyId).get();
            packetsSnap.docs.forEach(doc => batch.delete(doc.ref));

            // Delete family
            batch.delete(familyDoc.ref);
        }

        // 2. Delete user preferences
        const prefRef = db.collection('userPreferences').doc(userId);
        batch.delete(prefRef);

        // 3. Delete subscription
        const subRef = db.collection('subscriptions').doc(userId);
        batch.delete(subRef);

        // Commit all deletions
        await batch.commit();

        // 4. Delete auth user
        await admin.auth().deleteUser(userId);

        console.log(`[PRIVACY] Account deleted: ${userId}`);
        return { success: true };
    } catch (error) {
        console.error(`[PRIVACY] Delete failed for ${userId}:`, error);
        throw new functions.https.HttpsError('internal', 'Failed to delete account');
    }
});

// ============================================
// PRIVACY: EXPORT USER DATA
// ============================================

/**
 * Export all user data as JSON.
 */
export const exportUserData = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    const userId = context.auth.uid;
    const db = admin.firestore();

    try {
        const exportData: Record<string, unknown> = {
            exportedAt: new Date().toISOString(),
            userId
        };

        // Get families
        const familiesSnap = await db.collection('families')
            .where('ownerId', '==', userId).get();
        exportData.families = familiesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Get children from those families
        const familyIds = familiesSnap.docs.map(d => d.id);
        if (familyIds.length > 0) {
            const childrenSnap = await db.collection('children')
                .where('familyId', 'in', familyIds).get();
            exportData.children = childrenSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const abcSnap = await db.collection('abcEntries')
                .where('familyId', 'in', familyIds).get();
            exportData.abcEntries = abcSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const stratSnap = await db.collection('strategies')
                .where('familyId', 'in', familyIds).get();
            exportData.strategies = stratSnap.docs.map(d => ({ id: d.id, ...d.data() }));

            const packetsSnap = await db.collection('sharePackets')
                .where('familyId', 'in', familyIds).get();
            exportData.sharePackets = packetsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        }

        // Get preferences
        const prefDoc = await db.collection('userPreferences').doc(userId).get();
        if (prefDoc.exists) {
            exportData.preferences = prefDoc.data();
        }

        // Get subscription
        const subDoc = await db.collection('subscriptions').doc(userId).get();
        if (subDoc.exists) {
            exportData.subscription = subDoc.data();
        }

        console.log(`[PRIVACY] Data exported for: ${userId}`);
        return exportData;
    } catch (error) {
        console.error(`[PRIVACY] Export failed for ${userId}:`, error);
        throw new functions.https.HttpsError('internal', 'Failed to export data');
    }
});

