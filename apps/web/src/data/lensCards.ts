/**
 * Lens Cards Schema & Seed Data
 * 
 * Lens Cards provide an Epigenetic Consciousness perspective alongside ABA guidance.
 * They offer reflection prompts that help interpret behavior through:
 * - Environment + History + Nervous System + Meaning + Relationship
 */

export type LensCategory = 'lineage' | 'environment' | 'nervous-system' | 'meaning';
export type LensContext = 'learning' | 'log' | 'strategy' | 'share';

export interface LensCard {
    id: string;
    category: LensCategory;
    title: string;
    reflectionPrompt: string;
    tryThis: string;
    noticeThis: string;
    icon: string;  // Lucide icon name
    contexts: LensContext[];
}

/**
 * Category metadata for UI rendering
 */
export const LENS_CATEGORIES: Record<LensCategory, {
    title: string;
    icon: string;
    color: string;
    description: string;
}> = {
    'lineage': {
        title: 'Lineage & Story',
        icon: 'Users',
        color: 'amber',
        description: 'Family narratives, community contexts, and identity pressures'
    },
    'environment': {
        title: 'Environment & Load',
        icon: 'Cloud',
        color: 'sky',
        description: 'Changes in routine, sensory environment, and demands'
    },
    'nervous-system': {
        title: 'Nervous System',
        icon: 'Activity',
        color: 'rose',
        description: 'Regulation, sensory needs, and communication signals'
    },
    'meaning': {
        title: 'Meaning & Dignity',
        icon: 'Heart',
        color: 'teal',
        description: 'Responding in ways that protect dignity and build skill'
    }
};

/**
 * Seeded Lens Cards (10 cards)
 */
export const initialLensCards: LensCard[] = [
    // LINEAGE & STORY (3 cards)
    {
        id: 'lineage-family-stress',
        category: 'lineage',
        title: 'Family Stress Echoes',
        reflectionPrompt: 'What family worries, financial pressures, or relationship tensions might your child be absorbing—even without words?',
        tryThis: 'Name one current stress out loud to a trusted adult, away from your child. Releasing it helps you regulate.',
        noticeThis: 'Do you hold tension in your body when thinking about this? Your child may sense that tension.',
        icon: 'Users',
        contexts: ['log', 'strategy']
    },
    {
        id: 'lineage-identity-pressure',
        category: 'lineage',
        title: 'Identity Messages',
        reflectionPrompt: 'What messages about "being good," "being strong," or "not causing trouble" were passed down in your family? How might these shape expectations?',
        tryThis: 'Write down one family saying about behavior. Ask: does this serve my child, or does it pressure them?',
        noticeThis: 'Pressure to "be normal" can come from love. Notice if that pressure shows up in your responses.',
        icon: 'Quote',
        contexts: ['learning', 'log']
    },
    {
        id: 'lineage-community-belonging',
        category: 'lineage',
        title: 'Community Belonging',
        reflectionPrompt: 'Does your child feel seen and welcomed in your community, church, neighborhood, or extended family? Belonging regulates the nervous system.',
        tryThis: 'Identify one space where your child is fully accepted. Increase time there if possible.',
        noticeThis: 'Rejection or exclusion—even subtle—can show up as dysregulation later.',
        icon: 'Home',
        contexts: ['strategy', 'share']
    },

    // ENVIRONMENT & LOAD (3 cards)
    {
        id: 'environment-sleep-food',
        category: 'environment',
        title: 'Basic Needs Check',
        reflectionPrompt: 'Has sleep, food, water, or movement been disrupted recently? Unmet basic needs amplify every other challenge.',
        tryThis: 'Before analyzing behavior, ask: "Did they sleep? Did they eat? Did they move?"',
        noticeThis: 'A "behavior problem" at 4pm might really be hunger + fatigue + 7 hours of masking.',
        icon: 'Moon',
        contexts: ['log', 'strategy']
    },
    {
        id: 'environment-transitions',
        category: 'environment',
        title: 'Transition Load',
        reflectionPrompt: 'How many transitions happened today? Each shift in activity, location, or expectation costs energy.',
        tryThis: 'Count transitions today. If more than 5, expect a harder afternoon. Build in recovery time.',
        noticeThis: 'Transitions are invisible labor. What looks like "refusing to cooperate" may be transition exhaustion.',
        icon: 'ArrowRightLeft',
        contexts: ['log', 'learning']
    },
    {
        id: 'environment-sensory-load',
        category: 'environment',
        title: 'Sensory Environment',
        reflectionPrompt: 'What sounds, lights, textures, smells, or movement is happening around your child right now?',
        tryThis: 'Close your eyes for 10 seconds. What do you hear? What your child hears may be 10x louder.',
        noticeThis: 'Sensory overload often looks like defiance. The body says "no" before words can.',
        icon: 'Volume2',
        contexts: ['log', 'strategy', 'share']
    },

    // NERVOUS SYSTEM (2 cards)
    {
        id: 'nervous-system-regulation',
        category: 'nervous-system',
        title: 'Regulation State',
        reflectionPrompt: 'Is your child\'s nervous system in a calm, alert, fight, flight, or freeze state right now?',
        tryThis: 'Match their energy gently. If they\'re activated, lower your voice and slow your movements.',
        noticeThis: 'Teaching and correction only work in a calm, alert state. Regulation comes before instruction.',
        icon: 'Activity',
        contexts: ['log', 'learning', 'share']
    },
    {
        id: 'nervous-system-communication',
        category: 'nervous-system',
        title: 'Behavior as Message',
        reflectionPrompt: 'If this behavior could talk, what would it be saying? "I need space"? "I\'m overwhelmed"? "I don\'t know how to ask"?',
        tryThis: 'Respond to the message, not just the behavior. "It looks like something is hard right now."',
        noticeThis: 'Difficult behavior is often the most important communication. Listen to what the body is saying.',
        icon: 'MessageCircle',
        contexts: ['log', 'strategy']
    },

    // MEANING & DIGNITY (2 cards)
    {
        id: 'meaning-dignity-response',
        category: 'meaning',
        title: 'Dignity-First Response',
        reflectionPrompt: 'Will your next response protect or harm your child\'s sense of worth? Will they feel respected or shamed?',
        tryThis: 'Before correcting, say something that acknowledges their experience. "This is really hard for you."',
        noticeThis: 'Shame shuts down learning. Connection opens it.',
        icon: 'Heart',
        contexts: ['log', 'strategy', 'share']
    },
    {
        id: 'meaning-skill-building',
        category: 'meaning',
        title: 'Teaching, Not Punishing',
        reflectionPrompt: 'What skill is your child still learning? Patience? Flexibility? Asking for help? Tolerating discomfort?',
        tryThis: 'Name the skill out loud: "You\'re still learning how to wait. I\'ll help you practice."',
        noticeThis: 'Punishment assumes they know better. Teaching assumes they\'re still learning—which they are.',
        icon: 'GraduationCap',
        contexts: ['learning', 'strategy']
    }
];

/**
 * Get lens cards for a specific context
 */
export function getLensCardsForContext(context: LensContext): LensCard[] {
    return initialLensCards.filter(card => card.contexts.includes(context));
}

/**
 * Get lens cards by category
 */
export function getLensCardsByCategory(category: LensCategory): LensCard[] {
    return initialLensCards.filter(card => card.category === category);
}
