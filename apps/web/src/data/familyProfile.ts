/**
 * Family Profile Schema
 * 
 * Comprehensive data model for the Lifelong Companion architecture.
 * Captures socio-cultural context, family narrative, and multi-stakeholder relationships.
 */

import { Timestamp } from 'firebase/firestore';
import type { HomeplaceSupports } from './homeplaceSupports';

// ============================================
// CORE FAMILY PROFILE
// ============================================

export interface FamilyProfile {
    id: string;
    userId: string;  // Owner of this profile
    createdAt: Timestamp;
    updatedAt: Timestamp;

    // Family Identity
    familyName: string;
    culturalBackground: CulturalContext;

    // Members
    primaryCaregivers: Caregiver[];
    children: ChildProfile[];
    siblings: SiblingInfo[];
    extendedFamily: ExtendedFamilyMember[];

    // Narrative Layer
    familyStory: FamilyNarrative;

    // Stakeholders with access
    sharedWith: ShareAccess[];
}

// ============================================
// CULTURAL CONTEXT
// ============================================

export interface CulturalContext {
    // Identity (all optional, user-defined)
    race?: string[];                    // Multi-select or custom
    ethnicity?: string[];
    primaryLanguages: string[];
    homeLanguages: string[];            // Languages spoken at home

    // Community
    religiousTradition?: string;        // Optional
    communityAffiliations: string[];    // Church, cultural org, etc.
    neighborhoodContext?: string;       // Urban/suburban/rural

    // Immigration & Heritage
    immigrationStory?: string;          // Optional narrative
    generationsInCountry?: number;
    countriesOfOrigin: string[];

    // Values & Practices
    culturalValues: string[];           // User-defined list
    traditions: string[];               // Holidays, practices
    foodways: string[];                 // Food traditions that matter
}

// ============================================
// CAREGIVER / PARENT
// ============================================

export interface Caregiver {
    id: string;
    name: string;
    relationship: 'mother' | 'father' | 'guardian' | 'grandparent' | 'other';
    relationshipCustom?: string;

    // Contact
    email?: string;
    phone?: string;
    isEmergencyContact: boolean;

    // Context
    workSchedule?: string;              // "Works nights" etc.
    communicationPreference: 'email' | 'text' | 'phone' | 'app';
    primaryLanguage: string;

    // Involvement
    isPrimaryCaregiver: boolean;
    livesWithChild: boolean;
    custodyNotes?: string;              // Sensitive - encrypted
}

// ============================================
// CHILD PROFILE
// ============================================

export interface ChildProfile {
    id: string;

    // Basic Info
    firstName: string;
    lastName: string;
    preferredName?: string;
    pronouns: string;
    dateOfBirth: Date;

    // Identity
    avatar?: string;                    // URL to avatar image
    interests: string[];
    strengths: string[];

    // Diagnoses (user-controlled disclosure)
    diagnoses: Diagnosis[];

    // School
    currentSchool?: SchoolInfo;
    schoolHistory: SchoolHistoryEntry[];
    currentGrade: string;

    // Medical (optional, sensitive)
    medicalInfo?: MedicalInfo;

    // Support Systems
    homeplaceSupports: HomeplaceSupports;
    therapyServices: TherapyService[];

    // Communication
    communicationStyle: CommunicationProfile;

    // Timeline
    milestones: Milestone[];
    narrative: ChildNarrative;
}

export interface Diagnosis {
    name: string;
    diagnosedDate?: Date;
    diagnosedBy?: string;
    notes?: string;
    shareWithSchool: boolean;
    shareWithTherapists: boolean;
}

export interface SchoolInfo {
    name: string;
    district?: string;
    address?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    hasIEP: boolean;
    has504: boolean;
}

export interface SchoolHistoryEntry {
    schoolName: string;
    startDate: Date;
    endDate?: Date;
    grade: string;
    notes?: string;
}

export interface MedicalInfo {
    primaryCareProvider?: string;
    allergies: string[];
    medications: Medication[];
    sensoryNeeds: string[];
    dietaryNeeds: string[];
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    purpose: string;
    prescribedBy?: string;
}

export interface TherapyService {
    type: 'ABA' | 'OT' | 'PT' | 'Speech' | 'Mental Health' | 'Other';
    typeCustom?: string;
    providerName: string;
    providerOrg?: string;
    frequency: string;
    startDate: Date;
    isActive: boolean;
    contactEmail?: string;
    contactPhone?: string;
}

export interface CommunicationProfile {
    primaryMode: 'verbal' | 'AAC' | 'sign' | 'mixed';
    aacSystem?: string;
    expressiveLevel: string;
    receptiveLevel: string;
    bestTimeToTalk?: string;
    triggers: string[];
    calmingStrategies: string[];
}

// ============================================
// TIMELINE & NARRATIVE
// ============================================

export interface Milestone {
    id: string;
    date: Date;
    category: 'development' | 'school' | 'therapy' | 'medical' | 'personal' | 'win';
    title: string;
    description: string;
    isPositive: boolean;
    attachments?: string[];
}

export interface ChildNarrative {
    whoTheyAre: string;           // "They are..."
    whatTheyLove: string;         // "They love..."
    howTheyShow: string;          // "They show care by..."
    whatHelps: string;            // "What helps them..."
    dreams: string;               // "Their dreams..."
    updatedAt: Timestamp;
}

export interface FamilyNarrative {
    ourStory: string;             // Family origin/journey
    whatMatters: string;          // Core values
    howWeSupport: string;         // Support philosophy
    ourHopes: string;             // Future vision
    updatedAt: Timestamp;
}

// ============================================
// SIBLING & EXTENDED FAMILY
// ============================================

export interface SiblingInfo {
    id: string;
    name: string;
    age: number;
    relationship: 'brother' | 'sister' | 'sibling' | 'step-sibling' | 'half-sibling';
    livesWithChild: boolean;
    notes?: string;
}

export interface ExtendedFamilyMember {
    id: string;
    name: string;
    relationship: string;
    isEmergencyContact: boolean;
    contactPhone?: string;
    notes?: string;
}

// ============================================
// SHARING & ACCESS
// ============================================

export type StakeholderRole =
    | 'parent'
    | 'therapist'
    | 'teacher'
    | 'doctor'
    | 'social_worker'
    | 'family_member'
    | 'emergency_contact';

export interface ShareAccess {
    id: string;
    email: string;
    name: string;
    role: StakeholderRole;
    accessLevel: 'full' | 'summary' | 'emergency';
    canEdit: boolean;
    invitedAt: Timestamp;
    acceptedAt?: Timestamp;
    expiresAt?: Timestamp;
    sections: ShareableSection[];
}

export type ShareableSection =
    | 'basic_info'
    | 'diagnoses'
    | 'school'
    | 'medical'
    | 'communication'
    | 'supports'
    | 'narrative'
    | 'timeline'
    | 'abc_logs'
    | 'strategies';

// ============================================
// DEFAULTS & HELPERS
// ============================================

export function createEmptyChildProfile(id: string): ChildProfile {
    return {
        id,
        firstName: '',
        lastName: '',
        pronouns: '',
        dateOfBirth: new Date(),
        interests: [],
        strengths: [],
        diagnoses: [],
        currentGrade: '',
        schoolHistory: [],
        homeplaceSupports: {
            calmingPractices: [],
            sensoryTools: [],
            movement: [],
            routines: [],
            trustedPeople: [],
            communitySpaces: [],
            musicSounds: [],
            comfortFoods: [],
            textures: [],
            customSupports: []
        },
        therapyServices: [],
        communicationStyle: {
            primaryMode: 'verbal',
            expressiveLevel: '',
            receptiveLevel: '',
            triggers: [],
            calmingStrategies: []
        },
        milestones: [],
        narrative: {
            whoTheyAre: '',
            whatTheyLove: '',
            howTheyShow: '',
            whatHelps: '',
            dreams: '',
            updatedAt: Timestamp.now()
        }
    };
}

export function createEmptyFamilyProfile(userId: string, id: string): FamilyProfile {
    return {
        id,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        familyName: '',
        culturalBackground: {
            primaryLanguages: ['English'],
            homeLanguages: ['English'],
            communityAffiliations: [],
            countriesOfOrigin: [],
            culturalValues: [],
            traditions: [],
            foodways: []
        },
        primaryCaregivers: [],
        children: [],
        siblings: [],
        extendedFamily: [],
        familyStory: {
            ourStory: '',
            whatMatters: '',
            howWeSupport: '',
            ourHopes: '',
            updatedAt: Timestamp.now()
        },
        sharedWith: []
    };
}
