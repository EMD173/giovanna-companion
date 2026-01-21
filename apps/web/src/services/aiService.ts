/**
 * AI Service - Client-side interface
 * 
 * SECURITY: All AI calls go through Firebase Cloud Functions.
 * No API keys are stored or used client-side.
 */

import { httpsCallable, getFunctions } from 'firebase/functions';
import { getApp } from 'firebase/app';

// ============================================
// TYPES
// ============================================

interface ChatResponse {
    response: string | null;
    error: string | null;
    message?: string;
}

interface LearningHubItem {
    title: string;
    category: string;
    definition: string;
    whatToShare: string;
}

// ============================================
// AI SERVICE
// ============================================

const functions = getFunctions(getApp());

/**
 * Send a message to Giovanna AI
 * 
 * @param message - User's message
 * @param context - Optional Learning Hub content for context
 * @returns AI response or error
 */
export async function sendMessage(
    message: string,
    context?: LearningHubItem[]
): Promise<{ response: string; error?: string }> {
    try {
        const giovannaChat = httpsCallable<
            { message: string; context?: LearningHubItem[] },
            ChatResponse
        >(functions, 'giovannaChat');

        const result = await giovannaChat({ message, context });

        if (result.data.error === 'LIMIT_EXCEEDED') {
            return {
                response: '',
                error: result.data.message || 'Monthly limit reached. Upgrade for more queries.'
            };
        }

        if (result.data.error) {
            return {
                response: result.data.response || '',
                error: result.data.message || 'AI error occurred'
            };
        }

        return { response: result.data.response || '' };
    } catch (error: unknown) {
        console.error('AI Service error:', error);

        // Handle Firebase function errors
        if (error && typeof error === 'object' && 'code' in error) {
            const fbError = error as { code: string; message: string };
            if (fbError.code === 'functions/unauthenticated') {
                return { response: '', error: 'Please log in to use Giovanna AI.' };
            }
        }

        return {
            response: '',
            error: 'Unable to connect to Giovanna AI. Please try again.'
        };
    }
}

/**
 * Check API status (Admin only)
 */
export async function checkApiStatus(): Promise<{
    provider: string;
    keyConfigured: boolean;
    testResult: string;
    lastChecked: string;
}> {
    const checkStatus = httpsCallable(functions, 'checkApiStatus');
    const result = await checkStatus({});
    return result.data as {
        provider: string;
        keyConfigured: boolean;
        testResult: string;
        lastChecked: string;
    };
}

/**
 * Get app configuration (feature flags)
 */
export async function getAppConfig(): Promise<{
    paidEnabled: boolean;
    maintenanceMode: boolean;
    version: string;
}> {
    const getConfig = httpsCallable(functions, 'getAppConfig');
    const result = await getConfig({});
    return result.data as {
        paidEnabled: boolean;
        maintenanceMode: boolean;
        version: string;
    };
}
