/**
 * Family Profile Context
 * 
 * Global state for family profile management with Firestore persistence.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
    type FamilyProfile,
    type ChildProfile,
    createEmptyFamilyProfile
} from '../data/familyProfile';
import type { IntakeProfile } from '../types/intake';

import { type FamilyRole } from '../types/family';

// ============================================
// CONTEXT INTERFACE
// ============================================

interface FamilyContextValue {
    family: FamilyProfile | null;
    intakeProfile: IntakeProfile | null;
    loading: boolean;
    error: string | null;
    updateFamily: (updates: Partial<FamilyProfile>) => Promise<void>;
    addChild: (child: ChildProfile) => Promise<void>;
    updateChild: (childId: string, updates: Partial<ChildProfile>) => Promise<void>;
    removeChild: (childId: string) => Promise<void>;
    getChild: (childId: string) => ChildProfile | undefined;
    activeChild: ChildProfile | null;
    setActiveChildId: (id: string | null) => void;
    inviteMember: (email: string, role: FamilyRole, name: string) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextValue>({
    family: null,
    intakeProfile: null,
    loading: true,
    error: null,
    updateFamily: async () => { },
    addChild: async () => { },
    updateChild: async () => { },
    removeChild: async () => { },
    getChild: () => undefined,
    activeChild: null,
    setActiveChildId: () => { },
    inviteMember: async () => { }
});

export function FamilyProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [family, setFamily] = useState<FamilyProfile | null>(null);
    const [intakeProfile, setIntakeProfile] = useState<IntakeProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeChildId, setActiveChildId] = useState<string | null>(null);

    // Load or create family profile
    useEffect(() => {
        if (!user) {
            setFamily(null);
            setIntakeProfile(null);
            setActiveChildId(null);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        const familyRef = doc(db, 'families', user.uid);

        const unsubscribe = onSnapshot(familyRef, async (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const data = snapshot.data() as FamilyProfile;
                    setFamily(data);

                    // Also fetch intake profile from user doc
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists() && userDoc.data().intakeProfile) {
                        setIntakeProfile(userDoc.data().intakeProfile as IntakeProfile);
                    } else {
                        setIntakeProfile(null);
                    }

                    // Keep the selected child when possible; otherwise choose the first available child.
                    setActiveChildId(prev => {
                        if (data.children.length === 0) {
                            return null;
                        }
                        if (prev && data.children.some(child => child.id === prev)) {
                            return prev;
                        }
                        if (data.children.length > 0) {
                            return data.children[0].id;
                        }
                        return null;
                    });
                } else {
                    // Create empty profile for new users
                    const newFamily = createEmptyFamilyProfile(user.uid, user.uid);
                    await setDoc(familyRef, newFamily);
                    setFamily(newFamily);
                    setActiveChildId(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

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

    const inviteMember = async (email: string, role: FamilyRole, name: string) => {
        if (!user || !family) return;
        const invitationRef = doc(collection(db, 'families', family.id, 'invitations'));
        await setDoc(invitationRef, {
            email,
            role,
            name,
            invitedBy: user.uid,
            status: 'pending',
            createdAt: new Date()
        });
    };

    const activeChild = activeChildId ? getChild(activeChildId) || null : null;

    return (
        <FamilyContext.Provider value={{
            family,
            intakeProfile,
            loading,
            error,
            updateFamily,
            addChild,
            updateChild,
            removeChild,
            getChild,
            inviteMember,
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
