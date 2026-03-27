/**
 * Therapy Approaches Data
 *
 * Defines the therapeutic frameworks users can choose from.
 * This selection shapes how Giovanna frames strategies and recommendations.
 *
 * Each approach is grounded in real clinical methodology — no jargon dumping,
 * just practical descriptions of HOW each approach works in daily life.
 */

export interface TherapyApproach {
    id: string;
    name: string;
    shortName: string;
    icon: string; // emoji
    color: string;
    tagline: string;
    description: string;
    bestFor: string[];
    howGiovannaApplies: string;
}

export const THERAPY_APPROACHES: TherapyApproach[] = [
    {
        id: 'aba',
        name: 'Applied Behavior Analysis',
        shortName: 'ABA',
        icon: '📊',
        color: '#6B4C9A',
        tagline: 'Understanding behavior through patterns and data',
        description: 'ABA focuses on understanding WHY behaviors happen (the function) and using data to shape positive alternatives. Modern ABA is collaborative, not compliance-based.',
        bestFor: [
            'Building specific skills (communication, self-care, social)',
            'Reducing behaviors that are dangerous or harmful',
            'Tracking measurable progress over time',
        ],
        howGiovannaApplies: 'Giovanna uses ABC logging (Antecedent-Behavior-Consequence) to identify patterns, track behavior functions, and suggest research-backed replacement behaviors.',
    },
    {
        id: 'floortime',
        name: 'DIR/Floortime',
        shortName: 'Floortime',
        icon: '🎭',
        color: '#D4AF37',
        tagline: 'Following your child\'s lead through play',
        description: 'DIR/Floortime meets children where they are developmentally. It uses play and emotional connection to build communication, thinking, and problem-solving from the ground up.',
        bestFor: [
            'Building emotional connection and co-regulation',
            'Children who learn best through play and relationship',
            'Strengthening social-emotional development',
        ],
        howGiovannaApplies: 'Giovanna frames strategies around following your child\'s interests, building "circles of communication," and celebrating emotional engagement milestones.',
    },
    {
        id: 'teacch',
        name: 'TEACCH Structured Teaching',
        shortName: 'TEACCH',
        icon: '🗂️',
        color: '#7A9E7E',
        tagline: 'Structuring the environment for success',
        description: 'TEACCH adapts the environment TO the child, rather than forcing the child to adapt. It uses visual supports, physical organization, and predictable routines.',
        bestFor: [
            'Children who thrive with visual schedules and structure',
            'Creating independence through environmental design',
            'Reducing anxiety by making the world predictable',
        ],
        howGiovannaApplies: 'Giovanna emphasizes visual supports, environmental modifications, routine building, and task organization in its recommendations.',
    },
    {
        id: 'rdi',
        name: 'Relationship Development Intervention',
        shortName: 'RDI',
        icon: '🤝',
        color: '#B85C6B',
        tagline: 'Building flexible thinking through guided participation',
        description: 'RDI focuses on building "dynamic intelligence" — the ability to think flexibly, handle uncertainty, and engage in back-and-forth relationships. Parents are the primary therapists.',
        bestFor: [
            'Building flexible thinking and problem-solving',
            'Parent-led intervention at home',
            'Developing resilience and adaptability',
        ],
        howGiovannaApplies: 'Giovanna frames challenges as opportunities for guided participation, emphasizing parent coaching and flexible thinking over rigid skill drilling.',
    },
    {
        id: 'polyvagal',
        name: 'Polyvagal-Informed',
        shortName: 'Polyvagal',
        icon: '🌊',
        color: '#4A8EC2',
        tagline: 'Understanding behavior through the nervous system',
        description: 'Polyvagal theory focuses on the nervous system states (safe/social, fight/flight, shutdown) behind behavior. It prioritizes co-regulation and safety before skill-building.',
        bestFor: [
            'Children with trauma histories or high anxiety',
            'Understanding meltdowns as nervous system responses, not "bad behavior"',
            'Building co-regulation between parent and child',
        ],
        howGiovannaApplies: 'Giovanna frames behaviors through a nervous system lens — identifying triggers, supporting regulation, and prioritizing safety and connection before demands.',
    },
    {
        id: 'blended',
        name: 'Blended / All of the Above',
        shortName: 'Blended',
        icon: '✨',
        color: '#D4AF37',
        tagline: 'Take what works from every approach',
        description: 'Most experienced families use a blended approach — taking what works from ABA, Floortime, TEACCH, and others and adapting it to their child\'s unique needs. There\'s no one-size-fits-all.',
        bestFor: [
            'Families who have tried multiple approaches',
            'Children whose needs span multiple areas',
            'Parents who want flexibility rather than dogma',
        ],
        howGiovannaApplies: 'Giovanna draws from all approaches and adapts recommendations based on the specific situation — data-driven when it helps, relationship-first when that\'s what\'s needed.',
    },
];

export const THERAPY_STORAGE_KEY = 'GIOVANNA_THERAPY_APPROACH';

export function getSelectedApproach(): string {
    return localStorage.getItem(THERAPY_STORAGE_KEY) || 'blended';
}

export function setSelectedApproach(id: string): void {
    localStorage.setItem(THERAPY_STORAGE_KEY, id);
}
