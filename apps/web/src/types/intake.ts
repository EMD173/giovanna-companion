export interface IntakeProfileInterface {
    // Family Structure (The Village)
    // Research: "Familial Capital" - extended kin network is key resilience factor
    kinshipNetwork: string[]; // e.g., ["Grandmother", "Auntie", "Godparent", "Church Family"]
    caregiverStyle: 'communal' | 'solo' | 'co-parenting' | 'multi-generational';

    // Cultural Context (Heart & Spirit)
    // Research: Spirituality as primary coping mechanism
    faithCommunity: boolean;
    faithImportance: 'high' | 'medium' | 'low' | 'none';
    values: string[]; // e.g., "Interdependence", "Respect", "Joy", "Excellence", "Service"

    // Safety & Bias context
    // Research: Fear of encounters and systemic bias (misdiagnosis, over-discipline)
    policeAnxietyLevel: 'high' | 'medium' | 'low';
    experienceWithBias: string[]; // e.g., "Dismissed by doctor", "School discipline", "Public staring/comments"

    // Child Context (Our Strengths)
    // Research: NAI framework - focusing on strengths to combat deficit narratives
    diagnosisStatus: 'diagnosed' | 'seeking' | 'self-diagnosed';
    strengths: string[]; // e.g., "Memory", "Music", "Pattern Recognition", "Affectionate"

    // Capacity Check (Needs Assessment)
    // Research: "Time Poverty" - identifying if parent is in survival mode
    caregiverCapacity: 'survival' | 'growth';

    // Metadata
    completedAt?: Date | { seconds: number; nanoseconds: number }; // Firestore timestamp
    lastUpdated?: Date | { seconds: number; nanoseconds: number };
}

// Runtime export to prevent "does not provide an export" errors
export const IntakeProfile = {
    empty: true
};

// Type export
export type IntakeProfile = IntakeProfileInterface;

export const DEFAULT_INTAKE_PROFILE: IntakeProfile = {
    caregiverCapacity: 'growth', // Default to growth, but will be set by user
    kinshipNetwork: [],
    caregiverStyle: 'co-parenting',
    faithCommunity: false,
    faithImportance: 'medium',
    values: [],
    policeAnxietyLevel: 'medium',
    experienceWithBias: [],
    diagnosisStatus: 'diagnosed',
    strengths: []
};

// Selection Options (Research-Informed)

export const KINSHIP_OPTIONS = [
    "Grandmother / Big Mama",
    "Grandfather",
    "Auntie",
    "Uncle",
    "Older Siblings",
    "Godparent",
    "Church Family / Deacon",
    "Close Friends (Fictive Kin)"
];

export const VALUES_OPTIONS = [
    "Interdependence (We > Me)",
    "Respect for Elders",
    "Joy & Laughter",
    "Excellence & Achievement",
    "Faith / Spirituality",
    "Privacy / Protection",
    "Education",
    "Service to Community"
];

export const BIAS_EXPERIENCES = [
    "Dismissed by pediatricians",
    "School labeled behavior as 'bad'",
    "Family denial ('He's fine')",
    "Judgment in public",
    "Police/Security called on child",
    "Feeling unsafe in therapy"
];

export const STRENGTH_OPTIONS = [
    "Deep Focus",
    "Memory / Recall",
    "Music / Rhythm",
    "Honesty",
    "Visual Thinking",
    "Affectionate",
    "Pattern Recognition",
    "Logic / Order"
];
