/**
 * Subscription Tier System
 * 
 * Defines tier levels and feature access for scalability.
 * Free tier is fully functional; paid tier adds premium features.
 */

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface TierLimits {
    aiQueriesPerMonth: number;
    sharePacketsPerMonth: number;
    childProfiles: number;
    mediaLibraryAccess: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    dataExport: boolean;
    ecModeAccess: boolean;  // EC Layer
}

export interface UserSubscription {
    tier: SubscriptionTier;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    usage: UsageTracking;
}

export interface UsageTracking {
    aiQueriesUsed: number;
    sharePacketsUsed: number;
    lastResetDate: Date;
}

/**
 * Tier configuration
 */
export const TIER_CONFIG: Record<SubscriptionTier, TierLimits> = {
    free: {
        aiQueriesPerMonth: 50,
        sharePacketsPerMonth: 5,
        childProfiles: 2,
        mediaLibraryAccess: true,
        prioritySupport: false,
        apiAccess: false,
        customBranding: false,
        dataExport: true,
        ecModeAccess: true  // EC Mode is free!
    },
    pro: {
        aiQueriesPerMonth: 500,
        sharePacketsPerMonth: 50,
        childProfiles: 5,
        mediaLibraryAccess: true,
        prioritySupport: true,
        apiAccess: false,
        customBranding: false,
        dataExport: true,
        ecModeAccess: true
    },
    enterprise: {
        aiQueriesPerMonth: -1,  // Unlimited
        sharePacketsPerMonth: -1,
        childProfiles: -1,
        mediaLibraryAccess: true,
        prioritySupport: true,
        apiAccess: true,
        customBranding: true,
        dataExport: true,
        ecModeAccess: true
    }
};

/**
 * Tier display info
 */
export const TIER_INFO: Record<SubscriptionTier, {
    name: string;
    price: string;
    description: string;
    badge?: string;
}> = {
    free: {
        name: 'Free',
        price: '$0/mo',
        description: 'Perfect for getting started with neuro-affirming support.',
        badge: undefined
    },
    pro: {
        name: 'Pro',
        price: '$9.99/mo',
        description: 'For families who need more AI support and sharing capabilities.',
        badge: 'POPULAR'
    },
    enterprise: {
        name: 'Enterprise',
        price: 'Contact us',
        description: 'For organizations, schools, and therapy practices.',
        badge: 'TEAMS'
    }
};

/**
 * Check if a feature is available for a tier
 */
export function hasFeature(tier: SubscriptionTier, feature: keyof TierLimits): boolean {
    const limits = TIER_CONFIG[tier];
    const value = limits[feature];

    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;

    return false;
}

/**
 * Check if usage is within limits
 */
export function isWithinLimit(
    tier: SubscriptionTier,
    limitKey: 'aiQueriesPerMonth' | 'sharePacketsPerMonth' | 'childProfiles',
    currentUsage: number
): boolean {
    const limit = TIER_CONFIG[tier][limitKey];
    if (limit === -1) return true;  // Unlimited
    return currentUsage < limit;
}

/**
 * Get remaining usage
 */
export function getRemainingUsage(
    tier: SubscriptionTier,
    limitKey: 'aiQueriesPerMonth' | 'sharePacketsPerMonth' | 'childProfiles',
    currentUsage: number
): number | 'unlimited' {
    const limit = TIER_CONFIG[tier][limitKey];
    if (limit === -1) return 'unlimited';
    return Math.max(0, limit - currentUsage);
}

/**
 * Create default subscription for new users
 */
export function createDefaultSubscription(): UserSubscription {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
        tier: 'free',
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: endOfMonth,
        usage: {
            aiQueriesUsed: 0,
            sharePacketsUsed: 0,
            lastResetDate: now
        }
    };
}
