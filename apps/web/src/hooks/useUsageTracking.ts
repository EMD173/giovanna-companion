/**
 * Usage Tracking Hook
 * 
 * Tracks feature usage across the application for tier limits.
 */

import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCallback } from 'react';

interface UsageRecord {
    aiQueries: number;
    sharePackets: number;
    strategyCards: number;
    abcLogs: number;
    monthReset: Date;
}

export function useUsageTracking() {
    const { user } = useAuth();

    const getUsageRef = useCallback(() => {
        if (!user) return null;
        return doc(db, 'usage', user.uid);
    }, [user]);

    const incrementUsage = useCallback(async (field: keyof Omit<UsageRecord, 'monthReset'>) => {
        const ref = getUsageRef();
        if (!ref) return;

        try {
            await updateDoc(ref, {
                [field]: increment(1),
                lastUpdated: new Date()
            });
        } catch (error) {
            // If doc doesn't exist, create it
            const currentMonth = new Date();
            currentMonth.setDate(1);
            currentMonth.setHours(0, 0, 0, 0);

            await setDoc(ref, {
                aiQueries: field === 'aiQueries' ? 1 : 0,
                sharePackets: field === 'sharePackets' ? 1 : 0,
                strategyCards: field === 'strategyCards' ? 1 : 0,
                abcLogs: field === 'abcLogs' ? 1 : 0,
                monthReset: currentMonth,
                lastUpdated: new Date()
            });
        }
    }, [getUsageRef]);

    const getUsage = useCallback(async (): Promise<UsageRecord | null> => {
        const ref = getUsageRef();
        if (!ref) return null;

        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data() as UsageRecord;
        }
        return null;
    }, [getUsageRef]);

    const trackAIQuery = useCallback(() => incrementUsage('aiQueries'), [incrementUsage]);
    const trackSharePacket = useCallback(() => incrementUsage('sharePackets'), [incrementUsage]);
    const trackStrategyCard = useCallback(() => incrementUsage('strategyCards'), [incrementUsage]);
    const trackABCLog = useCallback(() => incrementUsage('abcLogs'), [incrementUsage]);

    return {
        trackAIQuery,
        trackSharePacket,
        trackStrategyCard,
        trackABCLog,
        getUsage
    };
}
