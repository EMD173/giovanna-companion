/**
 * Personal Support Plan (PSP) Schema
 * 
 * A family-owned, strength-based alternative to traditional IEPs.
 * Living document that parents control and can share selectively.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// CORE PSP TYPES
// ============================================

export interface PersonalSupportPlan {
    id: string;
    childId: string;
    familyId: string;
    version: number;
    createdAt: Timestamp;
    lastUpdated: Timestamp;

    // Identity & Strengths
    identity: ChildIdentity;

    // Goals with progress tracking
    goals: PSPGoal[];

    // Supports organized by setting
    supports: {
        atHome: Support[];
        atSchool: Support[];
        inCommunity: Support[];
    };

    // Optional crisis plan
    crisisPlan?: CrisisPlan;

    // Share settings
    shareSettings: ShareSettings;
}

// ============================================
// IDENTITY SECTION
// ============================================

export interface ChildIdentity {
    // Strengths (what they're good at)
    strengths: string[];

    // Interests & motivators
    interests: string[];

    // Communication style
    communicationStyle: {
        primary: 'verbal' | 'aac' | 'gestures' | 'mixed' | 'other';
        details: string;
        bestWaysToConnect: string[];
    };

    // Learning style
    learningStyle: {
        preferences: ('visual' | 'auditory' | 'kinesthetic' | 'reading')[];
        bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'varies';
        optimalSessionLength: string;
        notes: string;
    };

    // Sensory profile summary
    sensoryProfile: {
        seeks: string[];      // What they seek out
        avoids: string[];     // What overwhelms
        calms: string[];      // What helps regulate
    };

    // In their own words (if applicable)
    selfDescription?: string;
}

// ============================================
// GOALS SECTION
// ============================================

export type GoalArea =
    | 'communication'
    | 'regulation'
    | 'social'
    | 'independence'
    | 'academic'
    | 'motor'
    | 'self-care'
    | 'custom';

export interface PSPGoal {
    id: string;
    area: GoalArea;
    customAreaName?: string;  // For 'custom' area

    // Goal definition
    title: string;
    description: string;
    whyImportant: string;     // Family's reason

    // Progress tracking
    currentLevel: string;
    targetLevel: string;
    startDate: Timestamp;
    targetDate?: Timestamp;

    // Strategies (AI-suggested + parent-added)
    strategies: GoalStrategy[];

    // Progress entries
    progress: ProgressEntry[];

    // AI suggestions (optional)
    aiSuggestions?: AISuggestion[];

    // Status
    status: 'active' | 'achieved' | 'paused' | 'modified';
}

export interface GoalStrategy {
    id: string;
    description: string;
    source: 'parent' | 'professional' | 'ai';
    isActive: boolean;
    notes?: string;
}

export interface ProgressEntry {
    id: string;
    date: Timestamp;
    notes: string;
    rating: 1 | 2 | 3 | 4 | 5;  // 1=struggling, 5=thriving
    evidenceType?: 'observation' | 'data' | 'milestone' | 'setback';
}

export interface AISuggestion {
    id: string;
    type: 'strategy' | 'modification' | 'resource';
    content: string;
    reasoning: string;
    accepted: boolean | null;  // null = pending
    generatedAt: Timestamp;
}

// ============================================
// SUPPORTS SECTION
// ============================================

export interface Support {
    id: string;
    category: 'accommodation' | 'modification' | 'tool' | 'strategy' | 'person';
    title: string;
    description: string;
    howToImplement: string;
    effectiveness: 'very-helpful' | 'somewhat-helpful' | 'trying' | 'not-helpful';
    notes?: string;
}

// ============================================
// CRISIS PLAN (Optional)
// ============================================

export interface CrisisPlan {
    isComplete: boolean;
    lastReviewed: Timestamp;

    // Warning signs
    triggers: string[];
    earlyWarnings: string[];

    // Response
    whatHelps: string[];
    whatMakesWorse: string[];
    deescalationSteps: string[];

    // Recovery
    afterCare: string[];

    // Contacts
    emergencyContacts: EmergencyContact[];

    // Safety notes
    safetyNotes?: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    notes?: string;
}

// ============================================
// SHARE SETTINGS
// ============================================

export interface ShareSettings {
    // What sections can be shared
    shareableSections: {
        identity: boolean;
        goals: boolean;
        supports: boolean;
        crisisPlan: boolean;
    };

    // Active shares
    activeShares: PSPShare[];
}

export interface PSPShare {
    id: string;
    recipientName: string;
    recipientRole: 'teacher' | 'therapist' | 'doctor' | 'family' | 'other';
    recipientEmail?: string;
    sectionsShared: string[];
    createdAt: Timestamp;
    expiresAt?: Timestamp;
    accessCode: string;
    viewCount: number;
}

// ============================================
// GOAL AREA METADATA
// ============================================

export const GOAL_AREAS: Record<GoalArea, {
    label: string;
    icon: string;
    color: string;
    examples: string[];
}> = {
    communication: {
        label: 'Communication',
        icon: 'MessageCircle',
        color: 'blue',
        examples: ['Requesting help', 'Expressing feelings', 'Answering questions']
    },
    regulation: {
        label: 'Regulation',
        icon: 'Heart',
        color: 'pink',
        examples: ['Managing frustration', 'Calm transitions', 'Sensory breaks']
    },
    social: {
        label: 'Social',
        icon: 'Users',
        color: 'purple',
        examples: ['Taking turns', 'Greeting others', 'Play skills']
    },
    independence: {
        label: 'Independence',
        icon: 'Star',
        color: 'amber',
        examples: ['Morning routine', 'Self-advocacy', 'Problem-solving']
    },
    academic: {
        label: 'Academic',
        icon: 'BookOpen',
        color: 'green',
        examples: ['Reading comprehension', 'Math facts', 'Writing']
    },
    motor: {
        label: 'Motor Skills',
        icon: 'Move',
        color: 'teal',
        examples: ['Handwriting', 'Coordination', 'Fine motor']
    },
    'self-care': {
        label: 'Self-Care',
        icon: 'Sparkles',
        color: 'orange',
        examples: ['Hygiene', 'Dressing', 'Eating']
    },
    custom: {
        label: 'Custom',
        icon: 'Plus',
        color: 'slate',
        examples: ['Define your own goal area']
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createEmptyPSP(childId: string, familyId: string): Omit<PersonalSupportPlan, 'id'> {
    const now = Timestamp.now();
    return {
        childId,
        familyId,
        version: 1,
        createdAt: now,
        lastUpdated: now,
        identity: {
            strengths: [],
            interests: [],
            communicationStyle: {
                primary: 'verbal',
                details: '',
                bestWaysToConnect: []
            },
            learningStyle: {
                preferences: [],
                bestTimeOfDay: 'varies',
                optimalSessionLength: '',
                notes: ''
            },
            sensoryProfile: {
                seeks: [],
                avoids: [],
                calms: []
            }
        },
        goals: [],
        supports: {
            atHome: [],
            atSchool: [],
            inCommunity: []
        },
        shareSettings: {
            shareableSections: {
                identity: true,
                goals: true,
                supports: true,
                crisisPlan: false
            },
            activeShares: []
        }
    };
}

export function calculateGoalProgress(goal: PSPGoal): number {
    if (goal.progress.length === 0) return 0;
    const avgRating = goal.progress.reduce((sum, p) => sum + p.rating, 0) / goal.progress.length;
    return Math.round((avgRating / 5) * 100);
}

export function generateShareSummary(psp: PersonalSupportPlan, sections: string[]): string {
    let summary = `# Support Plan Summary\n\n`;

    if (sections.includes('identity')) {
        summary += `## Strengths\n${psp.identity.strengths.join(', ')}\n\n`;
        summary += `## Communication\n${psp.identity.communicationStyle.details}\n\n`;
    }

    if (sections.includes('goals')) {
        summary += `## Current Goals\n`;
        psp.goals.filter(g => g.status === 'active').forEach(g => {
            summary += `- **${g.title}**: ${g.description}\n`;
        });
        summary += '\n';
    }

    if (sections.includes('supports') && sections.includes('atSchool')) {
        summary += `## School Supports\n`;
        psp.supports.atSchool.forEach(s => {
            summary += `- **${s.title}**: ${s.howToImplement}\n`;
        });
    }

    return summary;
}
