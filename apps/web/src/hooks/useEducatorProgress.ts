/**
 * useEducatorProgress Hook
 *
 * Tracks educator progress through training modules.
 * Persists to Firestore under: educatorProgress/{userId}_{moduleId}
 *
 * Separate from family-based moduleProgress because educators may not
 * have a family profile — they're using the enterprise/district tier.
 *
 * Path: src/hooks/useEducatorProgress.ts
 */

import { useState, useEffect, useCallback } from 'react';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { EducatorProgress } from '../data/educatorModules';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

interface UseEducatorProgressReturn {
    progress: EducatorProgress | null;
    allProgress: EducatorProgress[];
    loading: boolean;
    startModule: (moduleId: string) => Promise<void>;
    completeScenario: (moduleId: string, scenarioId: string, choiceId: string) => Promise<void>;
    saveReflection: (moduleId: string, response: string) => Promise<void>;
    isScenarioCompleted: (scenarioId: string) => boolean;
    getChoiceForScenario: (scenarioId: string) => string | undefined;
    completionPercent: number;
    totalModulesCompleted: number;
    totalPDHours: number;
    generateCertificateData: () => CertificateData | null;
}

export interface CertificateData {
    educatorName: string;
    moduleTitle: string;
    pdHours: number;
    completionDate: string;
    certificateId: string;
}

// ─────────────────────────────────────────
// Hook
// ─────────────────────────────────────────

export function useEducatorProgress(moduleId?: string): UseEducatorProgressReturn {
    const { user } = useAuth();
    const [progress, setProgress] = useState<EducatorProgress | null>(null);
    const [allProgress, setAllProgress] = useState<EducatorProgress[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = user?.uid;

    const getDocId = (modId: string) => `${userId}_${modId}`;

    // ── Fetch single module progress ──
    useEffect(() => {
        if (!userId || !moduleId) {
            setProgress(null);
            setLoading(false);
            return;
        }

        const fetchProgress = async () => {
            try {
                const ref = doc(db, 'educatorProgress', getDocId(moduleId));
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    setProgress({
                        ...data,
                        startedAt: data.startedAt?.toDate?.() || new Date(),
                        completedAt: data.completedAt?.toDate?.() || undefined,
                        choiceHistory: (data.choiceHistory || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                        reflections: (data.reflections || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                    } as EducatorProgress);
                } else {
                    setProgress(null);
                }
            } catch (err) {
                console.error('Error fetching educator progress:', err);
                setProgress(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [userId, moduleId]);

    // ── Fetch all progress ──
    useEffect(() => {
        if (!userId) {
            setAllProgress([]);
            return;
        }

        const fetchAll = async () => {
            try {
                const colRef = collection(db, 'educatorProgress');
                const q = query(colRef, where('userId', '==', userId));
                const snap = await getDocs(q);
                const records = snap.docs.map(d => {
                    const data = d.data();
                    return {
                        ...data,
                        startedAt: data.startedAt?.toDate?.() || new Date(),
                        completedAt: data.completedAt?.toDate?.() || undefined,
                        choiceHistory: (data.choiceHistory || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                        reflections: (data.reflections || []).map((e: Record<string, unknown>) => ({
                            ...e,
                            timestamp: (e.timestamp as Timestamp)?.toDate?.() || new Date(),
                        })),
                    } as EducatorProgress;
                });
                setAllProgress(records);
            } catch (err) {
                console.error('Error fetching all educator progress:', err);
            }
        };

        fetchAll();
    }, [userId]);

    // ── Start Module ──
    const startModule = useCallback(async (modId: string) => {
        if (!userId) return;

        const ref = doc(db, 'educatorProgress', getDocId(modId));
        const newProgress = {
            moduleId: modId,
            userId,
            completedScenarios: [],
            choiceHistory: [],
            reflections: [],
            startedAt: serverTimestamp(),
            certificateGenerated: false,
            pdHoursEarned: 0,
        };

        await setDoc(ref, newProgress);
        setProgress({
            ...newProgress,
            startedAt: new Date(),
        } as unknown as EducatorProgress);
    }, [userId]);

    // ── Complete Scenario ──
    const completeScenario = useCallback(async (modId: string, scenarioId: string, choiceId: string) => {
        if (!userId) return;

        const ref = doc(db, 'educatorProgress', getDocId(modId));
        const currentScenarios = progress?.completedScenarios || [];
        const currentHistory = progress?.choiceHistory || [];

        if (currentScenarios.includes(scenarioId)) return;

        const updatedScenarios = [...currentScenarios, scenarioId];
        const updatedHistory = [
            ...currentHistory,
            { scenarioId, choiceId, timestamp: new Date() },
        ];

        await updateDoc(ref, {
            completedScenarios: updatedScenarios,
            choiceHistory: updatedHistory.map(h => ({
                ...h,
                timestamp: Timestamp.fromDate(h.timestamp),
            })),
        });

        setProgress(prev => prev ? {
            ...prev,
            completedScenarios: updatedScenarios,
            choiceHistory: updatedHistory,
        } : null);
    }, [userId, progress]);

    // ── Save Reflection ──
    const saveReflection = useCallback(async (modId: string, response: string) => {
        if (!userId) return;

        const ref = doc(db, 'educatorProgress', getDocId(modId));
        const currentReflections = progress?.reflections || [];
        const updatedReflections = [
            ...currentReflections,
            { moduleId: modId, response, timestamp: new Date() },
        ];

        await updateDoc(ref, {
            reflections: updatedReflections.map(r => ({
                ...r,
                timestamp: Timestamp.fromDate(r.timestamp),
            })),
        });

        setProgress(prev => prev ? {
            ...prev,
            reflections: updatedReflections,
        } : null);
    }, [userId, progress]);

    // ── Derived State ──
    const isScenarioCompleted = useCallback((scenarioId: string): boolean => {
        return progress?.completedScenarios.includes(scenarioId) || false;
    }, [progress]);

    const getChoiceForScenario = useCallback((scenarioId: string): string | undefined => {
        return progress?.choiceHistory.find(h => h.scenarioId === scenarioId)?.choiceId;
    }, [progress]);

    const completionPercent = progress
        ? Math.round((progress.completedScenarios.length / Math.max(1, progress.completedScenarios.length + 1)) * 100)
        : 0;

    const totalModulesCompleted = allProgress.filter(p => p.completedAt).length;
    const totalPDHours = allProgress.reduce((sum, p) => sum + (p.pdHoursEarned || 0), 0);

    const generateCertificateData = useCallback((): CertificateData | null => {
        if (!progress?.completedAt || !user) return null;
        return {
            educatorName: user.displayName || user.email || 'Educator',
            moduleTitle: progress.moduleId,
            pdHours: progress.pdHoursEarned,
            completionDate: progress.completedAt.toLocaleDateString(),
            certificateId: `GIO-${progress.moduleId.slice(0, 8)}-${Date.now().toString(36)}`.toUpperCase(),
        };
    }, [progress, user]);

    return {
        progress,
        allProgress,
        loading,
        startModule,
        completeScenario,
        saveReflection,
        isScenarioCompleted,
        getChoiceForScenario,
        completionPercent,
        totalModulesCompleted,
        totalPDHours,
        generateCertificateData,
    };
}
