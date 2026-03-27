/**
 * Family Profile Context
 * 
 * Global state for family profile management with Firestore persistence.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { doc, setDoc, onSnapshot, getDoc, collection, Timestamp } from 'firebase/firestore';
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
        // DEV BYPASS or DEMO MODE: seed mock data without touching Firestore
        const isDemoOrBypass = localStorage.getItem('DEMO_MODE') === 'true'
            || localStorage.getItem('AMBASSADOR_MODE') === 'true'
            || (!import.meta.env.PROD && localStorage.getItem('DEV_BYPASS') === 'true');
        if (isDemoOrBypass) {
            const mockChild = {
                ...createEmptyFamilyProfile('dev_mock_user', 'dev_mock_user'),
                familyName: 'Davis Family',
                children: [{
                    id: 'child_mock_amara',
                    firstName: 'Amara',
                    lastName: 'Davis',
                    preferredName: 'Mari',
                    pronouns: 'she/her',
                    dateOfBirth: new Date('2019-06-15'),
                    interests: ['music', 'drawing', 'animals'],
                    strengths: ['Visual Thinking', 'Music / Rhythm', 'Honesty', 'Deep Focus'],
                    diagnoses: [{
                        name: 'Autism Spectrum Disorder (Level 1)',
                        diagnosedDate: new Date('2022-03-01'),
                        diagnosedBy: 'Dr. Patricia Williams',
                        notes: 'Diagnosed at age 2.5 after developmental screening',
                        shareWithSchool: true,
                        shareWithTherapists: true
                    }, {
                        name: 'Sensory Processing Disorder',
                        diagnosedDate: new Date('2022-06-15'),
                        diagnosedBy: 'Dr. Patricia Williams',
                        notes: 'Primarily auditory and tactile sensitivities',
                        shareWithSchool: true,
                        shareWithTherapists: true
                    }],
                    currentGrade: 'Kindergarten',
                    currentSchool: {
                        name: 'Oakwood Elementary',
                        district: 'Birmingham City Schools',
                        contactName: 'Mrs. Jennifer Clark',
                        contactEmail: 'jclark@oakwood.edu',
                        hasIEP: true,
                        has504: false
                    },
                    schoolHistory: [],
                    homeplaceSupports: {
                        calmingPractices: ['Deep breathing', 'Weighted blanket'],
                        sensoryTools: ['Noise-canceling headphones', 'Fidget cube'],
                        movement: ['Swinging', 'Trampoline'],
                        routines: ['Visual schedule', 'Morning checklist'],
                        trustedPeople: ['Mama', 'Grandma Rose', 'Ms. Thomas (teacher)'],
                        communitySpaces: ['Library quiet room', 'Church nursery'],
                        musicSounds: ['Lo-fi beats', 'Nature sounds'],
                        comfortFoods: ['Mac and cheese', 'Apple slices'],
                        textures: ['Soft blankets', 'Play-Doh'],
                        customSupports: []
                    },
                    therapyServices: [{
                        type: 'OT' as const,
                        providerName: 'Sarah Mitchell, OTR/L',
                        providerOrg: 'Bright Futures Therapy',
                        frequency: '2x/week',
                        startDate: new Date('2023-01-15'),
                        isActive: true,
                        contactEmail: 'smitchell@brightfutures.com'
                    }, {
                        type: 'Speech' as const,
                        providerName: 'Dr. Marcus Johnson, CCC-SLP',
                        providerOrg: 'UAB Speech Clinic',
                        frequency: '1x/week',
                        startDate: new Date('2022-09-01'),
                        isActive: true,
                        contactEmail: 'mjohnson@uab.edu'
                    }],
                    communicationStyle: {
                        primaryMode: 'verbal' as const,
                        expressiveLevel: 'Speaks in full sentences but may need processing time',
                        receptiveLevel: 'Understands multi-step directions with visual support',
                        bestTimeToTalk: 'Morning, after breakfast routine',
                        triggers: ['Sudden loud noises', 'Unexpected schedule changes', 'Crowded spaces'],
                        calmingStrategies: ['Noise-canceling headphones', 'Deep pressure (weighted blanket)', 'Quiet corner with books']
                    },
                    milestones: [{
                        id: 'ms_1',
                        date: new Date('2024-12-15'),
                        category: 'win' as const,
                        title: 'First full day without meltdown',
                        description: 'Amara completed an entire school day using her strategies!',
                        isPositive: true
                    }, {
                        id: 'ms_2',
                        date: new Date('2025-01-20'),
                        category: 'school' as const,
                        title: 'IEP Goal Met — Letter Recognition',
                        description: 'She can now recognize all 26 letters!',
                        isPositive: true
                    }],
                    narrative: {
                        whoTheyAre: 'Amara is a bright, creative soul who sees the world in patterns and colors others miss.',
                        whatTheyLove: 'She loves music — especially drums and piano. She draws for hours and has an incredible memory for animal facts.',
                        howTheyShow: 'She shows love by sharing her drawings, singing songs she made up, and gentle touches on your hand.',
                        whatHelps: 'Visual schedules, advance notice of transitions, noise-canceling headphones in loud spaces, and patient adults who let her process at her own pace.',
                        dreams: 'She wants to be a veterinarian and "help all the animals feel safe."',
                        updatedAt: Timestamp.now()
                    }
                }],
                members: [{
                    userId: 'dev_mock_user',
                    role: 'admin',
                    name: 'Mama Giovanna',
                    email: 'dev@giovanna.app'
                }],
                plan: 'companion'
            };
            setFamily(mockChild as unknown as FamilyProfile);
            setActiveChildId('child_mock_amara');
            setIntakeProfile({
                capacityMode: 'growth',
                village: ['Grandmother / Big Mama', 'Auntie'],
                spiritualImportance: 'medium',
                familyValues: ['Faith / Spirituality', 'Joy & Laughter', 'Excellence & Achievement'],
                policeAnxiety: 'high',
                historicalChallenges: ['Dismissed by pediatricians', 'School labeled behavior as bad'],
                childStrengths: ['Music / Rhythm', 'Visual Thinking', 'Deep Focus']
            } as unknown as IntakeProfile);
            setLoading(false);
            return;
        }

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
                    // Create the family doc scaffolding for new users.
                    // CRITICAL: Do NOT include `children` here — Firestore merge
                    // replaces arrays entirely, so writing `children: []` would
                    // overwrite any children that Onboarding saved moments ago.
                    await setDoc(familyRef, {
                        id: user.uid,
                        adminId: user.uid,
                        userId: user.uid,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }, { merge: true });
                    // Let the next onSnapshot deliver the merged result.
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
