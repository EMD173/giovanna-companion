/**
 * useModuleProgress Hook
 *
 * Tracks parent progress through Theory-to-Practice modules.
 * Persists to Firestore under: families/{familyId}/moduleProgress/{moduleId}
 *
 * Path: src/hooks/useModuleProgress.ts
 */

import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    getDocs,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import type { ModulePhase, ModuleProgress } from '../data/practiceModules';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface UseModuleProgressReturn {
    /** Progress for a specific module (null if not started) */
    progress: ModuleProgress | null;
    /** All module progress records for the family */
    allProgress: ModuleProgress[];
    /** Whether data is loading */
    loading: boolean;
    /** Start a module (creates the progress doc) */
    startModule: (moduleId: string) => Promise<void>;
    /** Mark a phase as completed */
    completePhase: (moduleId: string, phase: ModulePhase) => Promise<void>;
    /** Mark an activity as completed */
    completeActivity: (moduleId: string, activityId: string) => Promise<void>;
    /** Save a journal entry for a reflect-phase activity */
    saveJournalEntry: (moduleId: string, activityId: string, response: string) => Promise<void>;
    /** Check if a specific phase is completed */
    isPhaseCompleted: (phase: ModulePhase) => boolean;
    /** Check if a specific activity is completed */
    isActivityCompleted: (activityId: string) => boolean;
    /** Get percentage completion for current module (0-100) */
    completionPercent: number;
    /** Total modules completed across all modules */
    totalModulesCompleted: number;
    /** Total badges earned */
    badgesEarned: number;
}

// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────

export function useModuleProgress(moduleId?: string): UseModuleProgressReturn {
    const { user } = useAuth();
    const { family } = useFamily();
    const [progress, setProgress] = useState<ModuleProgress | null>(null);
    const [allProgress, setAllProgress] = useState<ModuleProgress[]>([]);
    const [loading, setLoading] = useState(true);

    const familyId = family?.id;
    const userId = user?.uid;

    // ── Fetch single module progress ──
    useEffect(() => {
        if (!familyId || !moduleId) {
            setProgress(null);
            setLoading(false);
            return;
        }

        const fetchProgress = async () => {
            try {
                const ref = doc(db, 'families', familyId, 'moduleProgress', moduleId);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    setProgress({
                        ...data,
                        startedAt: data.startedAt?.toDate?.() || new Date(),
                        completedAt: data.completedAt?.toDate?.() || undefined,
                        journalEntries: (data.journalEntries || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                    } as ModuleProgress);
                } else {
                    setProgress(null);
                }
            } catch (err) {
                console.error('Error fetching module progress:', err);
                setProgress(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [familyId, moduleId]);

    // ── Fetch all module progress ──
    useEffect(() => {
        if (!familyId) {
            setAllProgress([]);
            return;
        }

        const fetchAll = async () => {
            try {
                const colRef = collection(db, 'families', familyId, 'moduleProgress');
                const snap = await getDocs(colRef);
                const records = snap.docs.map(d => {
                    const data = d.data();
                    return {
                        ...data,
                        startedAt: data.startedAt?.toDate?.() || new Date(),
                        completedAt: data.completedAt?.toDate?.() || undefined,
                        journalEntries: (data.journalEntries || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                    } as ModuleProgress;
                });
                setAllProgress(records);
            } catch (err) {
                console.error('Error fetching all module progress:', err);
            }
        };

        fetchAll();
    }, [familyId]);

    // ── Start Module ──
    const startModule = useCallback(async (modId: string) => {
        if (!familyId || !userId) return;

        const ref = doc(db, 'families', familyId, 'moduleProgress', modId);
        const newProgress: Omit<ModuleProgress, 'startedAt'> & { startedAt: ReturnType<typeof serverTimestamp> } = {
            moduleId: modId,
            userId,
            familyId,
            completedPhases: [],
            completedActivities: [],
            journalEntries: [],
            startedAt: serverTimestamp() as ReturnType<typeof serverTimestamp>,
            badgeEarned: false,
        };

        await setDoc(ref, newProgress);
        setProgress({
            ...newProgress,
            startedAt: new Date(),
        } as unknown as ModuleProgress);
    }, [familyId, userId]);

    // ── Complete Phase ──
    const completePhase = useCallback(async (modId: string, phase: ModulePhase) => {
        if (!familyId) return;

        const ref = doc(db, 'families', familyId, 'moduleProgress', modId);
        const currentPhases = progress?.completedPhases || [];

        if (currentPhases.includes(phase)) return;

        const updatedPhases = [...currentPhases, phase];
        const allPhasesComplete = ['learn', 'observe', 'practice', 'reflect'].every(
            p => updatedPhases.includes(p as ModulePhase)
        );

        const update: Record<string, unknown> = {
            completedPhases: updatedPhases,
        };

        if (allPhasesComplete) {
            update.completedAt = serverTimestamp();
            update.badgeEarned = true;
        }

        await updateDoc(ref, update);
        setProgress(prev => prev ? {
            ...prev,
            completedPhases: updatedPhases,
            completedAt: allPhasesComplete ? new Date() : undefined,
            badgeEarned: allPhasesComplete,
        } : null);
    }, [familyId, progress]);

    // ── Complete Activity ──
    const completeActivity = useCallback(async (modId: string, activityId: string) => {
        if (!familyId) return;

        const ref = doc(db, 'families', familyId, 'moduleProgress', modId);
        const currentActivities = progress?.completedActivities || [];

        if (currentActivities.includes(activityId)) return;

        const updatedActivities = [...currentActivities, activityId];
        await updateDoc(ref, { completedActivities: updatedActivities });
        setProgress(prev => prev ? {
            ...prev,
            completedActivities: updatedActivities,
        } : null);
    }, [familyId, progress]);

    // ── Save Journal Entry ──
    const saveJournalEntry = useCallback(async (modId: string, activityId: string, response: string) => {
        if (!familyId) return;

        const ref = doc(db, 'families', familyId, 'moduleProgress', modId);
        const currentEntries = progress?.journalEntries || [];

        // Replace existing entry for this activity or add new
        const filtered = currentEntries.filter(e => e.activityId !== activityId);
        const updatedEntries = [
            ...filtered,
            { activityId, response, timestamp: new Date() },
        ];

        await updateDoc(ref, {
            journalEntries: updatedEntries.map(e => ({
                ...e,
                timestamp: Timestamp.fromDate(e.timestamp),
            })),
        });

        setProgress(prev => prev ? {
            ...prev,
            journalEntries: updatedEntries,
        } : null);
    }, [familyId, progress]);

    // ── Derived State ──
    const isPhaseCompleted = useCallback((phase: ModulePhase): boolean => {
        return progress?.completedPhases.includes(phase) || false;
    }, [progress]);

    const isActivityCompleted = useCallback((activityId: string): boolean => {
        return progress?.completedActivities.includes(activityId) || false;
    }, [progress]);

    // Calculate completion percentage based on activities completed vs total
    const completionPercent = progress ? Math.round(
        (progress.completedPhases.length / 4) * 100
    ) : 0;

    const totalModulesCompleted = allProgress.filter(p => p.completedAt).length;
    const badgesEarned = allProgress.filter(p => p.badgeEarned).length;

    return {
        progress,
        allProgress,
        loading,
        startModule,
        completePhase,
        completeActivity,
        saveJournalEntry,
        isPhaseCompleted,
        isActivityCompleted,
        completionPercent,
        totalModulesCompleted,
        badgesEarned,
    };
}
