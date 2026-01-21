/**
 * API Configuration
 * 
 * Centralized API key management for quick access when scaling.
 * Keys are loaded from environment variables for security.
 */

// API Endpoints
export const API_CONFIG = {
    // Giovanna AI Cloud Function
    giovannaAI: {
        url: import.meta.env.VITE_GIOVANNA_AI_URL || '',
        enabled: !!import.meta.env.VITE_GIOVANNA_AI_URL
    },

    // Stripe (for payments - future)
    stripe: {
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
        enabled: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    }
};

/**
 * Feature flags based on environment
 */
export const FEATURE_FLAGS = {
    // AI Features
    aiChat: API_CONFIG.giovannaAI.enabled,
    aiLocalFallback: true,  // Always enabled for MVP

    // Payment Features
    subscriptions: API_CONFIG.stripe.enabled,
    upgradeCTA: true,  // Show upgrade prompts even without Stripe

    // EC Layer
    epigeneticConsciousness: true,

    // Share Features
    publicShareLinks: true,

    // Admin Features
    adminPanel: import.meta.env.DEV,  // Only in development
};

/**
 * Check if we're in development mode
 */
export const IS_DEV = import.meta.env.DEV;

/**
 * Firebase Cloud Function URLs by environment
 */
export function getCloudFunctionUrl(functionName: string): string {
    const projectId = 'giovanna-companion';
    const region = 'us-central1';

    if (IS_DEV) {
        // Local emulator
        return `http://127.0.0.1:5001/${projectId}/${region}/${functionName}`;
    }

    // Production
    return `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
}

/**
 * Validate required environment variables
 */
export function validateEnvConfig(): { valid: boolean; missing: string[] } {
    const required: string[] = [];
    // Optional vars: VITE_GIOVANNA_AI_URL, VITE_STRIPE_PUBLISHABLE_KEY
    const missing = required.filter(key => !import.meta.env[key]);

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Quick reference for env setup
 */
export const ENV_TEMPLATE = `
# Giovanna Companion - Environment Variables
# Copy this to .env.local and fill in your values

# AI (Gemini via Cloud Function)
VITE_GIOVANNA_AI_URL=https://us-central1-giovanna-companion.cloudfunctions.net/giovannaChat

# Payments (Stripe - optional for now)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
`;
