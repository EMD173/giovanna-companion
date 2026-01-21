/**
 * Family Profile Context
 * 
 * Global state for family profile management with Firestore persistence.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
    type FamilyProfile,
    type ChildProfile,
    createEmptyFamilyProfile
} from '../data/familyProfile';

interface FamilyContextValue {
    family: FamilyProfile | null;
    loading: boolean;
    error: string | null;

    // Family operations
    updateFamily: (updates: Partial<FamilyProfile>) => Promise<void>;

    // Child operations
    addChild: (child: ChildProfile) => Promise<void>;
    updateChild: (childId: string, updates: Partial<ChildProfile>) => Promise<void>;
    removeChild: (childId: string) => Promise<void>;
    getChild: (childId: string) => ChildProfile | undefined;

    // Active child (for single-child views)
    activeChild: ChildProfile | null;
    setActiveChildId: (id: string | null) => void;
}

const FamilyContext = createContext<FamilyContextValue>({
    family: null,
    loading: true,
    error: null,
    updateFamily: async () => { },
    addChild: async () => { },
    updateChild: async () => { },
    removeChild: async () => { },
    getChild: () => undefined,
    activeChild: null,
    setActiveChildId: () => { }
});

export function FamilyProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [family, setFamily] = useState<FamilyProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeChildId, setActiveChildId] = useState<string | null>(null);

    // Load or create family profile
    useEffect(() => {
        if (!user) {
            setFamily(null);
            setLoading(false);
            return;
        }

        const familyRef = doc(db, 'families', user.uid);

        const unsubscribe = onSnapshot(familyRef, async (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const data = snapshot.data() as FamilyProfile;
                    setFamily(data);

                    // Set first child as active if none selected
                    if (!activeChildId && data.children.length > 0) {
                        setActiveChildId(data.children[0].id);
                    }
                } else {
                    // Create empty profile for new users
                    const newFamily = createEmptyFamilyProfile(user.uid, user.uid);
                    await setDoc(familyRef, newFamily);
                    setFamily(newFamily);
                }
                setError(null);
            } catch (err) {
                console.error('Error loading family:', err);
                setError('Failed to load family profile');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [user, activeChildId]);

    const updateFamily = async (updates: Partial<FamilyProfile>) => {
        if (!user || !family) return;

        const familyRef = doc(db, 'families', user.uid);
        await setDoc(familyRef, { ...updates, updatedAt: new Date() }, { merge: true });
    };

    const addChild = async (child: ChildProfile) => {
        if (!user || !family) return;

        const updatedChildren = [...family.children, child];
        await updateFamily({ children: updatedChildren });
        setActiveChildId(child.id);
    };

    const updateChild = async (childId: string, updates: Partial<ChildProfile>) => {
        if (!family) return;

        const updatedChildren = family.children.map(c =>
            c.id === childId ? { ...c, ...updates } : c
        );
        await updateFamily({ children: updatedChildren });
    };

    const removeChild = async (childId: string) => {
        if (!family) return;

        const updatedChildren = family.children.filter(c => c.id !== childId);
        await updateFamily({ children: updatedChildren });

        if (activeChildId === childId) {
            setActiveChildId(updatedChildren[0]?.id || null);
        }
    };

    const getChild = (childId: string) => {
        return family?.children.find(c => c.id === childId);
    };

    const activeChild = activeChildId ? getChild(activeChildId) || null : null;

    return (
        <FamilyContext.Provider value={{
            family,
            loading,
            error,
            updateFamily,
            addChild,
            updateChild,
            removeChild,
            getChild,
            activeChild,
            setActiveChildId
        }}>
            {children}
        </FamilyContext.Provider>
    );
}

export function useFamily() {
    const context = useContext(FamilyContext);
    if (!context) {
        throw new Error('useFamily must be used within a FamilyProvider');
    }
    return context;
}

export function useActiveChild() {
    const { activeChild, updateChild } = useFamily();

    const update = async (updates: Partial<ChildProfile>) => {
        if (!activeChild) return;
        await updateChild(activeChild.id, updates);
    };

    return { child: activeChild, update };
}
