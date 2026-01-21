/**
 * Adult Life Skills Module
 * 
 * Schema and seed data for supporting neurodivergent adults
 * with life skills: bills, social functioning, appointments,
 * self-advocacy, and independent living.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// SKILL CATEGORIES
// ============================================

export type LifeSkillCategory =
    | 'financial'       // Bills, budgeting, banking
    | 'social'          // Relationships, communication
    | 'self-care'       // Health, hygiene, medication
    | 'household'       // Cooking, cleaning, maintenance
    | 'employment'      // Job skills, workplace navigation
    | 'advocacy'        // Self-advocacy, rights, disclosure
    | 'transportation'  // Driving, public transit, rideshare
    | 'technology';     // Digital literacy, safety

export type SkillLevel = 'learning' | 'practicing' | 'mastered' | 'needs-support';

// ============================================
// LIFE SKILL DEFINITION
// ============================================

export interface LifeSkill {
    id: string;
    category: LifeSkillCategory;
    name: string;
    description: string;
    whyItMatters: string;
    tips: string[];
    accommodations: string[];
    resources: SkillResource[];
    relatedSkills: string[];  // IDs of related skills
}

export interface SkillResource {
    title: string;
    type: 'video' | 'article' | 'template' | 'app';
    url?: string;
    description: string;
}

// ============================================
// USER SKILL TRACKING
// ============================================

export interface UserLifeSkillProgress {
    skillId: string;
    level: SkillLevel;
    notes: string;
    accommodationsUsed: string[];
    lastPracticed?: Timestamp;
    goals: SkillGoal[];
}

export interface SkillGoal {
    id: string;
    description: string;
    targetDate?: Date;
    completed: boolean;
    completedAt?: Timestamp;
}

// ============================================
// REMINDERS & ROUTINES
// ============================================

export interface LifeSkillReminder {
    id: string;
    userId: string;
    category: LifeSkillCategory;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
    customDays?: number[];  // 0-6 for weekly, 1-31 for monthly
    time?: string;          // HH:MM format
    reminderBefore?: number; // Minutes before
    isRecurring: boolean;
    nextDue: Timestamp;
    enabled: boolean;
}

export interface BillTracker {
    id: string;
    userId: string;
    name: string;
    amount: number;
    dueDay: number;         // Day of month
    category: 'rent' | 'utilities' | 'insurance' | 'subscription' | 'phone' | 'medical' | 'other';
    autoPay: boolean;
    notes?: string;
    remindDaysBefore: number;
    enabled: boolean;
}

// ============================================
// CATEGORY METADATA
// ============================================

export const LIFE_SKILL_CATEGORIES: Record<LifeSkillCategory, {
    label: string;
    icon: string;
    color: string;
    description: string;
}> = {
    financial: {
        label: 'Money & Bills',
        icon: 'DollarSign',
        color: 'green',
        description: 'Managing money, paying bills, budgeting'
    },
    social: {
        label: 'Social & Relationships',
        icon: 'Users',
        color: 'pink',
        description: 'Building relationships, communication, boundaries'
    },
    'self-care': {
        label: 'Self-Care & Health',
        icon: 'Heart',
        color: 'red',
        description: 'Health, hygiene, medication management'
    },
    household: {
        label: 'Home & Household',
        icon: 'Home',
        color: 'amber',
        description: 'Cooking, cleaning, home maintenance'
    },
    employment: {
        label: 'Work & Career',
        icon: 'Briefcase',
        color: 'blue',
        description: 'Finding work, workplace skills, career growth'
    },
    advocacy: {
        label: 'Self-Advocacy',
        icon: 'Megaphone',
        color: 'purple',
        description: 'Knowing your rights, disclosure, asking for accommodations'
    },
    transportation: {
        label: 'Getting Around',
        icon: 'Car',
        color: 'teal',
        description: 'Transit, driving, rideshare, navigation'
    },
    technology: {
        label: 'Digital Skills',
        icon: 'Smartphone',
        color: 'slate',
        description: 'Online safety, apps, digital communication'
    }
};

// ============================================
// SEED DATA - INITIAL SKILLS
// ============================================

export const INITIAL_LIFE_SKILLS: LifeSkill[] = [
    // FINANCIAL
    {
        id: 'fin-pay-bills',
        category: 'financial',
        name: 'Paying Bills on Time',
        description: 'Understanding when bills are due and setting up systems to pay them.',
        whyItMatters: 'Late bills can result in extra fees, service shutoffs, and credit damage.',
        tips: [
            'Set up auto-pay whenever possible',
            'Use a bill calendar or app',
            'Keep a list of all monthly bills with due dates',
            'Set reminders 3-5 days before due dates'
        ],
        accommodations: [
            'Visual bill tracker on wall or fridge',
            'Weekly "bill check" routine',
            'Body double with trusted person for financial tasks'
        ],
        resources: [
            { title: 'YNAB (You Need A Budget)', type: 'app', description: 'Budgeting app with clear categories' }
        ],
        relatedSkills: ['fin-budgeting', 'fin-banking']
    },
    {
        id: 'fin-budgeting',
        category: 'financial',
        name: 'Creating and Following a Budget',
        description: 'Planning how to spend money before spending it.',
        whyItMatters: 'Helps prevent running out of money and reduces financial anxiety.',
        tips: [
            'Start simple: income minus fixed bills = what\'s left',
            'Use the envelope system (physical or digital)',
            'Review budget weekly, not just monthly',
            'Build in fun money so you don\'t feel deprived'
        ],
        accommodations: [
            'Visual budget with colors',
            'Round numbers up for easier math',
            'Separate accounts for bills vs spending'
        ],
        resources: [],
        relatedSkills: ['fin-pay-bills']
    },

    // SELF-ADVOCACY
    {
        id: 'adv-disclosure',
        category: 'advocacy',
        name: 'Disclosure at Work or School',
        description: 'Deciding if, when, and how to share your diagnosis with employers or educators.',
        whyItMatters: 'Strategic disclosure can unlock accommodations and understanding.',
        tips: [
            'You never have to disclose—it\'s always your choice',
            'Consider: What accommodations do I need?',
            'You can disclose without naming a diagnosis',
            'Practice what you\'ll say ahead of time'
        ],
        accommodations: [
            'Script or template for disclosure conversation',
            'Bring a trusted advocate to meetings',
            'Request conversations in writing'
        ],
        resources: [
            { title: 'JAN - Job Accommodation Network', type: 'article', url: 'https://askjan.org', description: 'Free resource for workplace accommodations' }
        ],
        relatedSkills: ['adv-accommodations']
    },
    {
        id: 'adv-accommodations',
        category: 'advocacy',
        name: 'Requesting Accommodations',
        description: 'Knowing your rights and how to ask for what you need.',
        whyItMatters: 'Accommodations are legal rights, not special favors.',
        tips: [
            'Research your rights (ADA, Section 504)',
            'Be specific about what you need',
            'Frame accommodations as helping you do your best work',
            'Document all requests in writing'
        ],
        accommodations: [
            'Template letters for accommodation requests',
            'List of past accommodations that worked'
        ],
        resources: [],
        relatedSkills: ['adv-disclosure']
    },

    // SOCIAL
    {
        id: 'soc-boundaries',
        category: 'social',
        name: 'Setting Boundaries',
        description: 'Communicating your limits clearly and kindly.',
        whyItMatters: 'Protects your energy and prevents burnout or resentment.',
        tips: [
            'Start with small, low-stakes boundaries',
            '"No" is a complete sentence',
            'You can set a boundary without explaining why',
            'Expect some pushback—boundaries are new for everyone'
        ],
        accommodations: [
            'Pre-written phrases for common situations',
            'Practice with a safe person first',
            'Text instead of verbal for difficult boundaries'
        ],
        resources: [],
        relatedSkills: ['soc-communication']
    },

    // HOUSEHOLD
    {
        id: 'house-cooking',
        category: 'household',
        name: 'Basic Meal Preparation',
        description: 'Making simple, nutritious meals for yourself.',
        whyItMatters: 'Eating well supports regulation, energy, and health.',
        tips: [
            'Start with 3-5 easy meals you can rotate',
            'Prep ingredients on a calm day',
            'Use visual recipes with photos',
            'No shame in convenience foods'
        ],
        accommodations: [
            'Meal prep once a week',
            'Frozen vegetables are just as nutritious',
            'Timer alerts for cooking steps'
        ],
        resources: [],
        relatedSkills: ['house-cleaning', 'house-shopping']
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSkillsByCategory(category: LifeSkillCategory): LifeSkill[] {
    return INITIAL_LIFE_SKILLS.filter(s => s.category === category);
}

export function getSkillById(id: string): LifeSkill | undefined {
    return INITIAL_LIFE_SKILLS.find(s => s.id === id);
}

export function createEmptyProgress(skillId: string): UserLifeSkillProgress {
    return {
        skillId,
        level: 'learning',
        notes: '',
        accommodationsUsed: [],
        goals: []
    };
}
