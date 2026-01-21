/**
 * Media Library Schema & Seed Data
 * 
 * Curated media items for the Learning Hub.
 * Quality Filters:
 * ✅ Evidence-informed
 * ✅ Respectful language
 * ❌ No fearmongering
 * ❌ No "compliance at all costs"
 * ❌ No miracle-cure claims
 */

export type MediaType = 'video' | 'infographic' | 'art-prompt' | 'guide';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface MediaItem {
    id: string;
    type: MediaType;
    title: string;
    source: string;
    url?: string;
    thumbnailUrl?: string;
    description: string;
    whyUseful: string;
    useWithCare?: string;
    tags: string[];
    approvalStatus: ApprovalStatus;
    approvedBy?: string;
    duration?: string;  // For videos
}

/**
 * Category metadata for UI
 */
export const MEDIA_TYPES: Record<MediaType, {
    label: string;
    icon: string;
    color: string;
}> = {
    'video': { label: 'Video', icon: 'Play', color: 'red' },
    'infographic': { label: 'Infographic', icon: 'Image', color: 'blue' },
    'art-prompt': { label: 'Art Prompt', icon: 'Palette', color: 'purple' },
    'guide': { label: 'Guide', icon: 'FileText', color: 'green' }
};

/**
 * Seeded Media Items (10 items)
 */
export const initialMediaItems: MediaItem[] = [
    // VIDEOS (4 items)
    {
        id: 'video-polyvagal-kids',
        type: 'video',
        title: 'The Polyvagal Theory Explained for Parents',
        source: 'YouTube - Beacon House',
        url: 'https://www.youtube.com/watch?v=example1',
        description: 'A gentle introduction to understanding your child\'s nervous system states and what behaviors might be telling you.',
        whyUseful: 'Helps parents recognize fight/flight/freeze responses and respond with co-regulation instead of punishment.',
        tags: ['nervous-system', 'regulation', 'beginner'],
        approvalStatus: 'approved',
        duration: '8:32'
    },
    {
        id: 'video-stimming-purpose',
        type: 'video',
        title: 'Understanding Stimming: Not a Behavior to Fix',
        source: 'YouTube - Neurodivergent Insights',
        url: 'https://www.youtube.com/watch?v=example2',
        description: 'Autistic adults explain why stimming is essential for regulation, not a behavior problem to eliminate.',
        whyUseful: 'Provides autistic perspective on stimming, helping parents understand rather than suppress.',
        useWithCare: 'Some stims that cause harm (self-injury) may need support—but never elimination of all stimming.',
        tags: ['stimming', 'sensory', 'autistic-voices'],
        approvalStatus: 'approved',
        duration: '12:45'
    },
    {
        id: 'video-meltdown-support',
        type: 'video',
        title: 'How to Support a Child During a Meltdown',
        source: 'YouTube - The Autism Collective',
        url: 'https://www.youtube.com/watch?v=example3',
        description: 'Practical, calm guidance for what to do (and not do) when your child is in overwhelm.',
        whyUseful: 'Replaces reactive responses with regulated, supportive strategies.',
        tags: ['meltdowns', 'regulation', 'practical'],
        approvalStatus: 'approved',
        duration: '6:18'
    },
    {
        id: 'video-iep-advocacy',
        type: 'video',
        title: 'IEP Meeting Preparation: Know Your Rights',
        source: 'YouTube - Wrightslaw',
        url: 'https://www.youtube.com/watch?v=example4',
        description: 'Legal expert explains parent rights in IEP meetings and how to advocate effectively.',
        whyUseful: 'Empowers parents with knowledge before high-stakes school meetings.',
        tags: ['iep', 'advocacy', 'school'],
        approvalStatus: 'approved',
        duration: '18:22'
    },

    // INFOGRAPHICS & GUIDES (3 items)
    {
        id: 'guide-sensory-profile',
        type: 'guide',
        title: 'Creating a Sensory Profile Worksheet',
        source: 'Original - Giovanna',
        description: 'A printable worksheet to identify your child\'s sensory preferences, sensitivities, and supports.',
        whyUseful: 'Helps systematically understand what environments and stimuli help vs. harm.',
        tags: ['sensory', 'worksheet', 'practical'],
        approvalStatus: 'approved'
    },
    {
        id: 'infographic-regulation-ladder',
        type: 'infographic',
        title: 'The Regulation Ladder',
        source: 'Adapted from polyvagal research',
        description: 'Visual showing the levels of nervous system activation and what each state looks/feels like.',
        whyUseful: 'Quick reference for identifying where your child (and you) are on the regulation spectrum.',
        tags: ['regulation', 'visual', 'quick-reference'],
        approvalStatus: 'approved'
    },
    {
        id: 'guide-school-bridge-template',
        type: 'guide',
        title: 'Teacher Communication Template',
        source: 'Original - Giovanna',
        description: 'A fill-in-the-blank template for sharing your child\'s needs with teachers in respectful, practical language.',
        whyUseful: 'Removes the pressure of writing from scratch; ensures key information is shared.',
        tags: ['school', 'communication', 'template'],
        approvalStatus: 'approved'
    },

    // ART PROMPTS (3 items)
    {
        id: 'art-body-map',
        type: 'art-prompt',
        title: 'Body Map: Where Do You Feel It?',
        source: 'Original - Giovanna',
        description: 'A drawing activity where children color where they feel different emotions in their body.',
        whyUseful: 'Builds interoception (body awareness) and gives language to internal experiences.',
        tags: ['art', 'interoception', 'emotions'],
        approvalStatus: 'approved'
    },
    {
        id: 'art-safe-place',
        type: 'art-prompt',
        title: 'Draw Your Safe Place',
        source: 'Original - Giovanna',
        description: 'Children draw a real or imagined place where they feel completely safe and calm.',
        whyUseful: 'Creates a visual anchor for regulation; can be referenced during dysregulation.',
        tags: ['art', 'regulation', 'calming'],
        approvalStatus: 'approved'
    },
    {
        id: 'art-breathing-colors',
        type: 'art-prompt',
        title: 'Breathing with Colors',
        source: 'Original - Giovanna',
        description: 'Breathe in while drawing one color, breathe out while drawing another. Creates a calming abstract artwork.',
        whyUseful: 'Combines breath regulation with motor activity; creates tangible proof of calm.',
        tags: ['art', 'breathing', 'regulation'],
        approvalStatus: 'approved'
    }
];

/**
 * Get approved media items only
 */
export function getApprovedMedia(): MediaItem[] {
    return initialMediaItems.filter(item => item.approvalStatus === 'approved');
}

/**
 * Get media by type
 */
export function getMediaByType(type: MediaType): MediaItem[] {
    return initialMediaItems.filter(item => item.type === type && item.approvalStatus === 'approved');
}

/**
 * Get media by tag
 */
export function getMediaByTag(tag: string): MediaItem[] {
    return initialMediaItems.filter(item =>
        item.tags.includes(tag) && item.approvalStatus === 'approved'
    );
}
