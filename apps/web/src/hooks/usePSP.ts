/**
 * usePSP Hook
 * 
 * Manages Personal Support Plan CRUD operations with Firestore.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    doc, setDoc, updateDoc, onSnapshot,
    serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import {
    type PersonalSupportPlan,
    type PSPGoal,
    type ProgressEntry,
    createEmptyPSP
} from '../data/personalSupportPlan';

export function usePSP() {
    const { user } = useAuth();
    const { activeChild, family } = useFamily();
    const [psp, setPsp] = useState<PersonalSupportPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load or create PSP for active child
    useEffect(() => {
        if (!user || !activeChild || !family) {
            setPsp(null);
            setLoading(false);
            return;
        }

        const pspRef = doc(db, 'psp', activeChild.id);

        const unsubscribe = onSnapshot(pspRef, async (snapshot) => {
            if (snapshot.exists()) {
                setPsp({ id: snapshot.id, ...snapshot.data() } as PersonalSupportPlan);
            } else {
                // Create new PSP for this child
                const newPsp = createEmptyPSP(activeChild.id, family.id);
                await setDoc(pspRef, newPsp);
                setPsp({ id: activeChild.id, ...newPsp } as PersonalSupportPlan);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeChild, family]);

    // Update PSP
    const updatePsp = useCallback(async (updates: Partial<PersonalSupportPlan>) => {
        if (!psp) return;

        setSaving(true);
        try {
            const pspRef = doc(db, 'psp', psp.id);
            await updateDoc(pspRef, {
                ...updates,
                lastUpdated: serverTimestamp()
            });
        } finally {
            setSaving(false);
        }
    }, [psp]);

    // Add a new goal
    const addGoal = useCallback(async (goal: Omit<PSPGoal, 'id' | 'progress' | 'aiSuggestions'>) => {
        if (!psp) return;

        const newGoal: PSPGoal = {
            ...goal,
            id: crypto.randomUUID(),
            progress: [],
            aiSuggestions: [],
            startDate: Timestamp.now()
        };

        await updatePsp({
            goals: [...psp.goals, newGoal]
        });

        return newGoal.id;
    }, [psp, updatePsp]);

    // Update a goal
    const updateGoal = useCallback(async (goalId: string, updates: Partial<PSPGoal>) => {
        if (!psp) return;

        const updatedGoals = psp.goals.map(g =>
            g.id === goalId ? { ...g, ...updates } : g
        );

        await updatePsp({ goals: updatedGoals });
    }, [psp, updatePsp]);

    // Add progress entry to a goal
    const addProgress = useCallback(async (goalId: string, entry: Omit<ProgressEntry, 'id' | 'date'>) => {
        if (!psp) return;

        const newEntry: ProgressEntry = {
            ...entry,
            id: crypto.randomUUID(),
            date: Timestamp.now()
        };

        const updatedGoals = psp.goals.map(g => {
            if (g.id === goalId) {
                return { ...g, progress: [...g.progress, newEntry] };
            }
            return g;
        });

        await updatePsp({ goals: updatedGoals });
    }, [psp, updatePsp]);

    // Delete a goal
    const deleteGoal = useCallback(async (goalId: string) => {
        if (!psp) return;

        await updatePsp({
            goals: psp.goals.filter(g => g.id !== goalId)
        });
    }, [psp, updatePsp]);

    return {
        psp,
        loading,
        saving,
        updatePsp,
        addGoal,
        updateGoal,
        addProgress,
        deleteGoal
    };
}
