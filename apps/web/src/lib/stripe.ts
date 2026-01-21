/**
 * Stripe Payment Integration Stubs
 * 
 * Ready to connect when you add your Stripe API keys.
 * These functions provide the interface - just add your keys to make it work.
 */

import { TIER_INFO, type SubscriptionTier } from '../data/subscriptionTiers';

// ============================================
// CONFIGURATION
// ============================================

// Get from environment or API config
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_CHECKOUT_URL = import.meta.env.VITE_STRIPE_CHECKOUT_URL || '/api/create-checkout';

// Price IDs from your Stripe Dashboard
// Set these in your environment or update directly
const PRICE_IDS: Record<SubscriptionTier, { monthly: string; yearly: string }> = {
    free: { monthly: '', yearly: '' },
    companion: {
        monthly: import.meta.env.VITE_STRIPE_COMPANION_MONTHLY || 'price_companion_monthly',
        yearly: import.meta.env.VITE_STRIPE_COMPANION_YEARLY || 'price_companion_yearly'
    },
    pro: {
        monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY || 'price_pro_monthly',
        yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY || 'price_pro_yearly'
    },
    enterprise: {
        monthly: import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
        yearly: import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY || 'price_enterprise_yearly'
    }
};

// ============================================
// CHECKOUT FUNCTIONS
// ============================================

export interface CheckoutOptions {
    tier: SubscriptionTier;
    billing: 'monthly' | 'yearly';
    userId: string;
    userEmail: string;
    successUrl?: string;
    cancelUrl?: string;
}

/**
 * Create a Stripe Checkout session
 * Returns the checkout URL to redirect the user to
 */
export async function createCheckoutSession(options: CheckoutOptions): Promise<string> {
    const { tier, billing, userId, userEmail, successUrl, cancelUrl } = options;

    // Stub implementation - returns mock URL
    // Replace with actual Stripe API call when ready
    if (!STRIPE_PUBLISHABLE_KEY) {
        console.log('[Stripe Stub] Would create checkout for:', tier, billing);
        return `/checkout-stub?tier=${tier}&billing=${billing}`;
    }

    const priceId = PRICE_IDS[tier][billing];

    try {
        const response = await fetch(STRIPE_CHECKOUT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId,
                userId,
                userEmail,
                successUrl: successUrl || `${window.location.origin}/settings?upgrade=success`,
                cancelUrl: cancelUrl || `${window.location.origin}/settings?upgrade=cancelled`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        return url;
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}

/**
 * Navigate user to Stripe Checkout
 */
export async function redirectToCheckout(options: CheckoutOptions): Promise<void> {
    const url = await createCheckoutSession(options);
    window.location.href = url;
}

// ============================================
// PORTAL FUNCTIONS
// ============================================

/**
 * Open Stripe Customer Portal for managing subscription
 */
export async function openCustomerPortal(userId: string): Promise<string> {
    // Stub implementation
    if (!STRIPE_PUBLISHABLE_KEY) {
        console.log('[Stripe Stub] Would open portal for user:', userId);
        return '/portal-stub';
    }

    try {
        const response = await fetch('/api/create-portal-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            throw new Error('Failed to create portal session');
        }

        const { url } = await response.json();
        return url;
    } catch (error) {
        console.error('Portal error:', error);
        throw error;
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get display price for a tier
 */
export function getTierPrice(tier: SubscriptionTier, billing: 'monthly' | 'yearly'): number {
    if (tier === 'free') return 0;
    const info = TIER_INFO[tier];
    return billing === 'monthly' ? info.monthlyPrice : info.yearlyPrice;
}

/**
 * Calculate savings for yearly billing
 */
export function getYearlySavings(tier: SubscriptionTier): number {
    if (tier === 'free') return 0;
    const info = TIER_INFO[tier];
    const yearlyFromMonthly = info.monthlyPrice * 12;
    return yearlyFromMonthly - info.yearlyPrice;
}

/**
 * Format price for display
 */
export function formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

// ============================================
// WEBHOOK HANDLERS (for Firebase Functions)
// ============================================

/**
 * Webhook payload types for Stripe events
 * These would be handled by your Firebase Cloud Function
 */
export interface StripeWebhookPayload {
    type: 'checkout.session.completed' | 'customer.subscription.updated' | 'customer.subscription.deleted';
    data: {
        object: {
            id: string;
            customer: string;
            subscription?: string;
            metadata?: {
                userId: string;
                tier: SubscriptionTier;
            };
        };
    };
}

/**
 * Example webhook handler (for Firebase Cloud Function)
 * Copy this to your functions/src/index.ts
 */
export const WEBHOOK_HANDLER_TEMPLATE = `
// Firebase Cloud Function for Stripe webhooks
// Add to functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret_key, {
    apiVersion: '2023-10-16'
});

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = functions.config().stripe.webhook_secret;
    
    let event: Stripe.Event;
    
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed');
        res.status(400).send('Webhook Error');
        return;
    }
    
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const tier = session.metadata?.tier;
            
            if (userId && tier) {
                await admin.firestore().collection('subscriptions').doc(userId).set({
                    tier,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                    status: 'active',
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            }
            break;
            
        case 'customer.subscription.deleted':
            // Handle cancellation - downgrade to free
            // Find user by stripeCustomerId and update tier to 'free'
            break;
    }
    
    res.json({ received: true });
});
`;
