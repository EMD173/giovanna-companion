/**
 * Analytics Hook — Core Loop Event Tracking
 *
 * Tracks the Log → Understand → Advocate flywheel.
 * Uses localStorage for beta. Can plug into Firebase Analytics later.
 *
 * No external dependencies. No network calls. Privacy-first.
 */

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'giovanna_analytics';
const MAX_EVENTS = 500;

export type AnalyticsEvent =
    | 'log_created'
    | 'oracle_message_sent'
    | 'share_packet_created'
    | 'crisis_mode_activated'
    | 'crisis_mode_completed'
    | 'onboarding_step_completed'
    | 'onboarding_completed'
    | 'feedback_submitted'
    | 'error_boundary_triggered'
    | 'page_viewed';

interface AnalyticsEntry {
    event: AnalyticsEvent;
    properties?: Record<string, string | number | boolean>;
    timestamp: string;
    userId?: string;
}

function getStoredEvents(): AnalyticsEntry[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function storeEvents(events: AnalyticsEntry[]) {
    try {
        // Keep only last MAX_EVENTS entries
        const trimmed = events.slice(-MAX_EVENTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
        // localStorage may be full
    }
}

export function useAnalytics() {
    const { user } = useAuth();

    const trackEvent = useCallback((
        event: AnalyticsEvent,
        properties?: Record<string, string | number | boolean>
    ) => {
        const entry: AnalyticsEntry = {
            event,
            properties,
            timestamp: new Date().toISOString(),
            userId: user?.uid,
        };

        const events = getStoredEvents();
        events.push(entry);
        storeEvents(events);

        // Dev logging
        if (import.meta.env.DEV) {
            console.log(`📊 [Analytics] ${event}`, properties || '');
        }
    }, [user?.uid]);

    // Pre-built convenience methods for the core loop
    const trackLogCreated = useCallback((props: {
        type: 'full' | 'quick';
        hasVoice?: boolean;
        hasFunctionHypothesis?: boolean;
        childId?: string;
    }) => {
        trackEvent('log_created', props);
    }, [trackEvent]);

    const trackOracleMessage = useCallback((props: {
        hasContext?: boolean;
        patternCount?: number;
    }) => {
        trackEvent('oracle_message_sent', props);
    }, [trackEvent]);

    const trackSharePacketCreated = useCallback((props: {
        recipientRole?: string;
    }) => {
        trackEvent('share_packet_created', props);
    }, [trackEvent]);

    const trackCrisis = useCallback((phase: 'activated' | 'completed') => {
        trackEvent(phase === 'activated' ? 'crisis_mode_activated' : 'crisis_mode_completed');
    }, [trackEvent]);

    const trackOnboarding = useCallback((step?: number) => {
        if (step !== undefined) {
            trackEvent('onboarding_step_completed', { step });
        } else {
            trackEvent('onboarding_completed');
        }
    }, [trackEvent]);

    return {
        trackEvent,
        trackLogCreated,
        trackOracleMessage,
        trackSharePacketCreated,
        trackCrisis,
        trackOnboarding,
    };
}

/**
 * Get analytics summary for admin/debug purposes
 */
export function getAnalyticsSummary(): {
    totalEvents: number;
    eventCounts: Record<string, number>;
    coreLoopCounts: { logs: number; oracle: number; shares: number };
    lastEvent?: string;
} {
    const events = getStoredEvents();
    const eventCounts: Record<string, number> = {};

    for (const e of events) {
        eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
    }

    return {
        totalEvents: events.length,
        eventCounts,
        coreLoopCounts: {
            logs: eventCounts['log_created'] || 0,
            oracle: eventCounts['oracle_message_sent'] || 0,
            shares: eventCounts['share_packet_created'] || 0,
        },
        lastEvent: events.length > 0 ? events[events.length - 1].timestamp : undefined,
    };
}
