/**
 * Stripe Payment Integration — Cloud Function Client
 *
 * Connects the client UI to Firebase Cloud Functions that handle
 * Stripe Checkout and Customer Portal sessions server-side.
 *
 * File: src/lib/stripe.ts
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { TIER_INFO, type SubscriptionTier } from '../data/subscriptionTiers';

// ============================================
// CLOUD FUNCTION REFERENCES
// ============================================

const createCheckoutFn = httpsCallable<
    { tier: string; billing: string; userEmail: string; successUrl: string; cancelUrl: string },
    { url: string; sessionId: string }
>(functions, 'createCheckoutSession');

const createPortalFn = httpsCallable<
    { returnUrl?: string },
    { url: string }
>(functions, 'createPortalSession');

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
 * Create a Stripe Checkout session via Cloud Function.
 * Returns the Stripe-hosted checkout URL.
 */
export async function createCheckoutSession(options: CheckoutOptions): Promise<string> {
    const { tier, billing, userEmail, successUrl, cancelUrl } = options;

    try {
        const result = await createCheckoutFn({
            tier,
            billing,
            userEmail,
            successUrl: successUrl || `${window.location.origin}/upgrade?upgrade=success`,
            cancelUrl: cancelUrl || `${window.location.origin}/upgrade?upgrade=cancelled`,
        });

        return result.data.url;
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
 * Open Stripe Customer Portal for managing subscription.
 * userId param kept for interface compatibility.
 */
export async function openCustomerPortal(_userId: string): Promise<string> {
    try {
        const result = await createPortalFn({
            returnUrl: `${window.location.origin}/settings`,
        });

        return result.data.url;
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any
});

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
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
