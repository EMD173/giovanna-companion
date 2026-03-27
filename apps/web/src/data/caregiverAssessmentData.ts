/**
 * Caregiver Self-Assessment Data
 *
 * "Caregivers of people with disabilities often have disabilities themselves."
 * — Shannon Mattox, Founding Ambassador
 *
 * A trauma-informed self-screening covering 6 domains.
 * This is NOT a diagnostic tool — it's a guided self-reflection
 * that connects caregivers with resources for their OWN needs.
 *
 * File: src/data/caregiverAssessmentData.ts
 */

export interface AssessmentQuestion {
    id: string;
    text: string;
    subtext?: string;
    options: { label: string; value: number }[];
}

export interface AssessmentDomain {
    id: string;
    title: string;
    emoji: string;
    description: string;
    color: string;
    questions: AssessmentQuestion[];
    resourceSlugs: string[]; // links back to The Sanctuary
}

export interface AssessmentResult {
    domainId: string;
    score: number;
    maxScore: number;
    level: 'low' | 'moderate' | 'high';
    insight: string;
}

const FREQUENCY_OPTIONS = [
    { label: 'Rarely or never', value: 0 },
    { label: 'Sometimes', value: 1 },
    { label: 'Often', value: 2 },
    { label: 'Almost always', value: 3 },
];

export const ASSESSMENT_DOMAINS: AssessmentDomain[] = [
    {
        id: 'executive-function',
        title: 'Executive Function',
        emoji: '🧠',
        description: 'Planning, organizing, task management, and time awareness.',
        color: '#6B4C9A',
        questions: [
            {
                id: 'ef-1',
                text: 'I struggle to keep track of appointments, deadlines, and paperwork.',
                subtext: 'IEP dates, therapy schedules, medication refills...',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ef-2',
                text: 'I start tasks but have trouble finishing them before moving to something else.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ef-3',
                text: 'I lose track of time or consistently underestimate how long things take.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ef-4',
                text: 'I feel overwhelmed by multi-step processes like insurance claims or school forms.',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['your-neurodivergence'],
    },
    {
        id: 'sensory-processing',
        title: 'Sensory Processing',
        emoji: '🌊',
        description: 'How you experience sound, light, touch, and environment.',
        color: '#D4AF37',
        questions: [
            {
                id: 'sp-1',
                text: 'Certain sounds (screaming, repetitive noise, alarms) affect me more intensely than others seem affected.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sp-2',
                text: 'I need quiet time alone to recover after busy or loud environments.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sp-3',
                text: 'I\'m sensitive to bright lights, certain textures, or strong smells.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sp-4',
                text: 'Caregiving demands (physical contact, constant noise) leave me physically drained beyond what feels normal.',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['your-neurodivergence', 'caregiver-mental-health'],
    },
    {
        id: 'emotional-regulation',
        title: 'Emotional Regulation',
        emoji: '💛',
        description: 'Managing intense feelings, especially under caregiving stress.',
        color: '#C08A2B',
        questions: [
            {
                id: 'er-1',
                text: 'I have big emotional reactions that feel disproportionate to the situation.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'er-2',
                text: 'I feel numb, detached, or "switched off" as a way of coping.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'er-3',
                text: 'Small frustrations (a spill, a schedule change) trigger intense irritation.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'er-4',
                text: 'I have difficulty calming down once I\'m activated or upset.',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['caregiver-mental-health', 'burnout'],
    },
    {
        id: 'social-communication',
        title: 'Social Communication',
        emoji: '💬',
        description: 'Navigating social situations, reading cues, and advocating.',
        color: '#7A9E7E',
        questions: [
            {
                id: 'sc-1',
                text: 'I find it draining to explain my child\'s needs to people who don\'t understand.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sc-2',
                text: 'I "mask" or perform a version of myself in professional settings (IEP meetings, doctor visits) that doesn\'t feel authentic.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sc-3',
                text: 'Small talk and social obligations feel exhausting rather than energizing.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'sc-4',
                text: 'I struggle to ask for help, even when I clearly need it.',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['isolation', 'community-events'],
    },
    {
        id: 'learning-style',
        title: 'Learning & Processing',
        emoji: '📖',
        description: 'How you take in information, read, and learn new things.',
        color: '#B85C6B',
        questions: [
            {
                id: 'ls-1',
                text: 'I prefer learning by doing or watching rather than reading long documents.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ls-2',
                text: 'I need to re-read things multiple times to fully absorb complex information.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ls-3',
                text: 'I retain information better when it\'s spoken aloud or in a video than in text.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'ls-4',
                text: 'Medical or legal jargon in reports makes me feel lost or frustrated.',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['your-neurodivergence', 'school-prep'],
    },
    {
        id: 'energy-burnout',
        title: 'Energy & Burnout',
        emoji: '🔋',
        description: 'Your overall capacity and signs of chronic depletion.',
        color: '#D35F5F',
        questions: [
            {
                id: 'eb-1',
                text: 'I wake up already tired, no matter how much sleep I get.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'eb-2',
                text: 'I\'ve lost interest in things I used to enjoy.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'eb-3',
                text: 'I feel like I\'m failing even when people tell me I\'m doing well.',
                options: FREQUENCY_OPTIONS,
            },
            {
                id: 'eb-4',
                text: 'My physical health has declined since becoming a primary caregiver.',
                subtext: 'Headaches, weight changes, chronic pain, immune issues...',
                options: FREQUENCY_OPTIONS,
            },
        ],
        resourceSlugs: ['burnout', 'caregiver-mental-health', 'ssi-ssdi-caregivers'],
    },
];

/**
 * Calculate results for each domain
 */
export function calculateResults(answers: Record<string, number>): AssessmentResult[] {
    return ASSESSMENT_DOMAINS.map(domain => {
        const domainAnswers = domain.questions.map(q => answers[q.id] || 0);
        const score = domainAnswers.reduce((a, b) => a + b, 0);
        const maxScore = domain.questions.length * 3;
        const percentage = score / maxScore;

        let level: 'low' | 'moderate' | 'high';
        let insight: string;

        if (percentage <= 0.33) {
            level = 'low';
            insight = `Your ${domain.title.toLowerCase()} appears manageable right now. This is a strength to build on.`;
        } else if (percentage <= 0.66) {
            level = 'moderate';
            insight = `You're experiencing moderate ${domain.title.toLowerCase()} challenges. Small supports could make a real difference.`;
        } else {
            level = 'high';
            insight = `${domain.title} is a significant area of challenge for you. You deserve support here — explore the resources below.`;
        }

        return { domainId: domain.id, score, maxScore, level, insight };
    });
}

export const STORAGE_KEY = 'GIOVANNA_CAREGIVER_ASSESSMENT';
