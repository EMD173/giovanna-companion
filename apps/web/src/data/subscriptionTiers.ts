/**
 * Subscription Tier System
 * 
 * Defines tier levels and feature access for scalability.
 * Free tier is fully functional; paid tier adds premium features.
 */

export type SubscriptionTier = 'free' | 'companion' | 'pro' | 'enterprise';

export interface TierLimits {
    aiQueriesPerMonth: number;
    sharePacketsPerMonth: number;
    childProfiles: number;
    strategyCards: number;
    mediaLibraryAccess: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    dataExport: boolean;
    ecModeAccess: boolean;
    homeplaceSupports: boolean;
    customReports: boolean;
    earlyFeatures: boolean;
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
 * Tier configuration - based on market analysis
 * 
 * Competitors:
 * - Autism360: $7.95/mo
 * - AutismHelpApp: $19-39/mo
 * - ABA Therapy Apps: $24.99/mo (family)
 * - Saner.AI: $6-16/mo
 * - Inflow ADHD: $47.99/mo (with coaching)
 */
export const TIER_CONFIG: Record<SubscriptionTier, TierLimits> = {
    free: {
        aiQueriesPerMonth: 30,
        sharePacketsPerMonth: 3,
        childProfiles: 1,
        strategyCards: 10,
        mediaLibraryAccess: true,
        prioritySupport: false,
        apiAccess: false,
        customBranding: false,
        dataExport: false,
        ecModeAccess: true,  // EC Mode is FREE - core to mission
        homeplaceSupports: false,
        customReports: false,
        earlyFeatures: false
    },
    companion: {
        aiQueriesPerMonth: 150,
        sharePacketsPerMonth: 15,
        childProfiles: 3,
        strategyCards: -1,  // Unlimited
        mediaLibraryAccess: true,
        prioritySupport: true,
        apiAccess: false,
        customBranding: false,
        dataExport: true,
        ecModeAccess: true,
        homeplaceSupports: true,
        customReports: false,
        earlyFeatures: false
    },
    pro: {
        aiQueriesPerMonth: 500,
        sharePacketsPerMonth: -1,  // Unlimited
        childProfiles: 5,
        strategyCards: -1,
        mediaLibraryAccess: true,
        prioritySupport: true,
        apiAccess: false,
        customBranding: false,
        dataExport: true,
        ecModeAccess: true,
        homeplaceSupports: true,
        customReports: true,
        earlyFeatures: true
    },
    enterprise: {
        aiQueriesPerMonth: -1,  // Unlimited
        sharePacketsPerMonth: -1,
        childProfiles: -1,
        strategyCards: -1,
        mediaLibraryAccess: true,
        prioritySupport: true,
        apiAccess: true,
        customBranding: true,
        dataExport: true,
        ecModeAccess: true,
        homeplaceSupports: true,
        customReports: true,
        earlyFeatures: true
    }
};

/**
 * Tier display info with market-competitive pricing
 */
export const TIER_INFO: Record<SubscriptionTier, {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    description: string;
    badge?: string;
    cta: string;
}> = {
    free: {
        name: 'Free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Get started with neuro-affirming support.',
        cta: 'Get Started Free'
    },
    companion: {
        name: 'Companion',
        monthlyPrice: 7.99,
        yearlyPrice: 76.70,  // ~20% off
        description: 'More AI support and sharing for growing families.',
        badge: 'BEST VALUE',
        cta: 'Start Free Trial'
    },
    pro: {
        name: 'Pro',
        monthlyPrice: 14.99,
        yearlyPrice: 143.90,  // ~20% off
        description: 'Unlimited sharing and custom reports for advocates.',
        badge: 'POPULAR',
        cta: 'Go Pro'
    },
    enterprise: {
        name: 'Enterprise',
        monthlyPrice: 99,
        yearlyPrice: 999,
        description: 'For clinics, schools, and therapy practices.',
        badge: 'TEAMS',
        cta: 'Contact Sales'
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
