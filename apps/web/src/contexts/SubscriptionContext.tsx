/**
 * Subscription Context
 * 
 * Global state for user subscription tier and usage tracking.
 * Enables feature gating based on tier limits.
 * 
 * Ambassador Mode: When AMBASSADOR_MODE is set in localStorage,
 * the tier overrides to 'ambassador' with full product access.
 * © 2026 Eli Davis. All Rights Reserved.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { shouldResetUsageCycle, toDate } from '../lib/launchGuards';
import {
    type SubscriptionTier,
    type UserSubscription,
    type TierLimits,
    TIER_CONFIG,
    createDefaultSubscription,
    isWithinLimit,
    getRemainingUsage
} from '../data/subscriptionTiers';

interface SubscriptionContextValue {
    subscription: UserSubscription | null;
    tier: SubscriptionTier;
    loading: boolean;
    isAmbassador: boolean;
    ambassadorName: string | null;

    // Feature checks
    hasFeature: (feature: keyof TierLimits) => boolean;
    canUseAI: () => boolean;
    canCreateSharePacket: () => boolean;

    // Usage tracking
    incrementAIUsage: () => Promise<void>;
    incrementShareUsage: () => Promise<void>;
    getRemainingAIQueries: () => number | 'unlimited';

    // Upgrade prompts
    shouldShowUpgrade: () => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
    subscription: null,
    tier: 'free',
    loading: true,
    isAmbassador: false,
    ambassadorName: null,
    hasFeature: () => false,
    canUseAI: () => true,
    canCreateSharePacket: () => true,
    incrementAIUsage: async () => { },
    incrementShareUsage: async () => { },
    getRemainingAIQueries: () => 50,
    shouldShowUpgrade: () => false
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    // Ambassador mode detection
    const ambassadorMode = typeof window !== 'undefined' && localStorage.getItem('AMBASSADOR_MODE') === 'true';
    const ambassadorName = typeof window !== 'undefined' ? localStorage.getItem('AMBASSADOR_NAME') : null;

    // Load/create subscription from Firestore
    useEffect(() => {
        if (!user) {
            setSubscription(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const subRef = doc(db, 'subscriptions', user.uid);

        // Real-time listener
        const unsubscribe = onSnapshot(subRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data() as UserSubscription;

                // Check if usage needs monthly reset
                const now = new Date();
                if (shouldResetUsageCycle(data.usage.lastResetDate, now)) {
                    // Reset monthly usage
                    const updatedUsage = {
                        aiQueriesUsed: 0,
                        sharePacketsUsed: 0,
                        lastResetDate: now
                    };
                    await setDoc(subRef, { usage: updatedUsage }, { merge: true });
                    data.usage = updatedUsage;
                } else {
                    data.usage.lastResetDate = toDate(data.usage.lastResetDate);
                }

                setSubscription(data);
            } else {
                // Create default subscription for new users
                const defaultSub = createDefaultSubscription();
                await setDoc(subRef, defaultSub);
                setSubscription(defaultSub);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Ambassador override: full access regardless of Firestore tier
    const tier: SubscriptionTier = ambassadorMode ? 'ambassador' : (subscription?.tier || 'free');
    const limits = TIER_CONFIG[tier];

    const hasFeature = (feature: keyof TierLimits): boolean => {
        const value = limits[feature];
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value !== 0;
        return false;
    };

    const canUseAI = (): boolean => {
        if (ambassadorMode) return true; // Ambassadors have unlimited access
        if (!subscription) return true;  // Allow before loaded
        return isWithinLimit(tier, 'aiQueriesPerMonth', subscription.usage.aiQueriesUsed);
    };

    const canCreateSharePacket = (): boolean => {
        if (ambassadorMode) return true;
        if (!subscription) return true;
        return isWithinLimit(tier, 'sharePacketsPerMonth', subscription.usage.sharePacketsUsed);
    };

    const incrementAIUsage = async () => {
        if (ambassadorMode) return; // Don't track ambassador usage
        if (!user || !subscription) return;
        const subRef = doc(db, 'subscriptions', user.uid);
        await setDoc(subRef, {
            usage: {
                aiQueriesUsed: increment(1)
            }
        }, { merge: true });
    };

    const incrementShareUsage = async () => {
        if (ambassadorMode) return;
        if (!user || !subscription) return;
        const subRef = doc(db, 'subscriptions', user.uid);
        await setDoc(subRef, {
            usage: {
                sharePacketsUsed: increment(1)
            }
        }, { merge: true });
    };

    const getRemainingAIQueries = (): number | 'unlimited' => {
        if (ambassadorMode) return 'unlimited';
        if (!subscription) return 50;
        return getRemainingUsage(tier, 'aiQueriesPerMonth', subscription.usage.aiQueriesUsed);
    };

    const shouldShowUpgrade = (): boolean => {
        if (ambassadorMode) return false; // Never show upgrade to ambassadors
        if (tier !== 'free') return false;
        if (!subscription) return false;

        // Show upgrade if >80% of AI quota used
        const remaining = getRemainingAIQueries();
        if (remaining === 'unlimited') return false;

        const limit = limits.aiQueriesPerMonth;
        return remaining < limit * 0.2;
    };

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            tier,
            loading,
            isAmbassador: ambassadorMode,
            ambassadorName,
            hasFeature,
            canUseAI,
            canCreateSharePacket,
            incrementAIUsage,
            incrementShareUsage,
            getRemainingAIQueries,
            shouldShowUpgrade
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
