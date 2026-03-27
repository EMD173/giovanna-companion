/**
 * Ambassador Access System
 * © 2026 Eli Davis. All Rights Reserved.
 *
 * Manages ambassador codes for product ambassadors (e.g., Shannon Mattox).
 * Ambassadors get full app access to learn the product before selling it.
 */

// ─────────────────────────────────────────
// AMBASSADOR CODES
// ─────────────────────────────────────────

export interface AmbassadorProfile {
    code: string;
    name: string;
    role: string;
    commissionTier: CommissionTier;
    activatedAt?: string;
}

export type CommissionTier = 'foundation' | 'growth' | 'impact' | 'legacy';

export const COMMISSION_TIERS: Record<CommissionTier, {
    label: string;
    rate: number;
    minMonthlySales: number;
    description: string;
}> = {
    foundation: {
        label: 'Foundation',
        rate: 0.08,
        minMonthlySales: 1,
        description: 'Base ambassador tier — 8% of product sales'
    },
    growth: {
        label: 'Growth',
        rate: 0.12,
        minMonthlySales: 11,
        description: '11–25 monthly sales — 12% commission'
    },
    impact: {
        label: 'Impact',
        rate: 0.15,
        minMonthlySales: 26,
        description: '26–50 monthly sales — 15% commission'
    },
    legacy: {
        label: 'Legacy',
        rate: 0.18,
        minMonthlySales: 51,
        description: '51+ monthly sales — 18% commission'
    }
};

/**
 * Valid ambassador codes.
 * Each code maps to an ambassador profile.
 */
const AMBASSADOR_REGISTRY: AmbassadorProfile[] = [
    {
        code: 'GIOVANNA-SHANNON-2026',
        name: 'Shannon Mattox',
        role: 'Founding Ambassador',
        commissionTier: 'foundation'
    }
];

/**
 * Validate an ambassador code and return the profile if valid.
 */
export function validateAmbassadorCode(code: string): AmbassadorProfile | null {
    const normalized = code.trim().toUpperCase();
    return AMBASSADOR_REGISTRY.find(a => a.code === normalized) || null;
}

// ─────────────────────────────────────────
// EC CONCEPT GUIDE
// ─────────────────────────────────────────
// Plain-language definitions of heavy EC terms.
// Powers the floating Concept Guide overlay
// so ambassadors can learn while navigating.

export interface ConceptEntry {
    term: string;
    simple: string;
    deeper: string;
    module?: string;
}

export const EC_CONCEPT_GUIDE: ConceptEntry[] = [
    // ──────── CORE APP FEATURES ────────
    {
        term: 'Capture (Behavior Logging)',
        simple: 'Where families log what happened. Type, voice record, or quick-tap to capture a behavior in under 30 seconds. The app asks: what happened before, what happened, what happened after.',
        deeper: 'This ABC format (Antecedent → Behavior → Consequence) is the professional standard used by BCBAs. Giovanna puts that power in a parent\'s hands with zero training required.',
        module: 'Core Feature'
    },
    {
        term: 'Oracle AI (Chat)',
        simple: 'An AI companion that knows the child\'s profile and behavioral history. Families can ask questions like "Why does my son scream at bedtime?" and get research-backed strategies.',
        deeper: 'The AI reads their logged data to give PERSONALIZED answers, not generic web results. It adapts its language based on the therapy approach they\'ve chosen in Settings.',
        module: 'Core Feature'
    },
    {
        term: 'Dashboard (Home)',
        simple: 'The home screen. Shows recent behaviors, trend charts, and quick-access to every feature. At a glance: what\'s happening this week and what\'s improving.',
        deeper: 'The charts show behavior frequency over time — so families can SEE progress that\'s invisible day-to-day. Show them the donut chart that breaks down behavior functions.',
        module: 'Core Feature'
    },
    {
        term: 'The Sanctuary (Resources)',
        simple: 'A resource library covering three areas: your child\'s care, YOUR own needs, and advocacy/funding. It personalizes recommendations based on the Self-Assessment results.',
        deeper: 'The Sanctuary is AGENTIC — it remembers what the user has viewed and what their self-check flagged. It surfaces "Recommended for You" resources automatically.',
        module: 'Core Feature'
    },
    {
        term: 'Bridge (Share Reports)',
        simple: 'Turns logged data into shareable PDF/link reports for doctors, teachers, and therapists. Families show up to meetings with EVIDENCE instead of just memories.',
        deeper: 'This is often the most powerful demo moment. Show them how a week of logs becomes a professional-grade report they can hand to their child\'s school team.',
        module: 'Core Feature'
    },
    {
        term: 'Self-Assessment',
        simple: 'A self-check tool for the CAREGIVER — not just the child. Asks about executive function, sensory needs, burnout, and emotional regulation. Takes 5 minutes.',
        deeper: 'Research shows caregivers of neurodivergent children are often neurodivergent themselves. This tool helps them recognize their OWN patterns and connects them with personalized resources.',
        module: 'Core Feature'
    },
    // ──────── SETUP & SETTINGS ────────
    {
        term: 'Onboarding Wizard',
        simple: 'When a new user signs up, a step-by-step walkthrough collects their child\'s name, age, diagnosis, triggers, strengths, and communication style.',
        deeper: 'This intake builds the child\'s profile that the Oracle AI uses to personalize every response. The more detail here, the better the AI recommendations become.',
        module: 'Setup'
    },
    {
        term: 'Therapy Approach Selector',
        simple: 'In Settings, families choose their preferred approach: ABA, Floortime, TEACCH, RDI, Polyvagal-Informed, or Blended. Giovanna adapts its language to match.',
        deeper: 'Not every family uses the same method. A Floortime family doesn\'t want ABA language. This selector makes the app feel like it was built specifically for their philosophy.',
        module: 'Settings'
    },
    {
        term: 'Guided Tour',
        simple: 'A step-by-step walkthrough of the app. Perfect for social workers to walk through with a new client. Can be replayed from Settings anytime.',
        deeper: 'When demonstrating to a client: sit with them, start the tour, and walk through each step together. This is how the app was designed to be introduced.',
        module: 'Settings'
    },
    {
        term: 'Voice Input',
        simple: 'The app supports speech-to-text throughout. Families can talk instead of type — critical for accessibility and for logging behaviors while hands are busy.',
        deeper: 'Many caregivers have their own accessibility needs. Voice makes the app usable for people who struggle with typing, have low vision, or are holding a child during a meltdown.',
        module: 'Accessibility'
    },
    // ──────── PROFESSIONAL TOOLS ────────
    {
        term: 'Professional Referral (/refer)',
        simple: 'A shareable page designed for YOU as an ambassador or social worker. Copy the link, share with clients — includes what the app does and who it\'s for.',
        deeper: 'This page positions Giovanna for ALL income levels and family types. It includes a "Share with Client" button that uses the phone\'s native share feature.',
        module: 'Ambassador Tool'
    },
    {
        term: 'Educator Training',
        simple: 'A training module that helps teachers and school staff understand behavior communication and neuro-affirming practices.',
        deeper: 'Families can share this section with their child\'s teacher as a gentle introduction. It bridges the gap between home understanding and classroom practice.',
        module: 'Professional'
    },
    // ──────── KEY CONCEPTS (Plain Language) ────────
    {
        term: 'Behavior Is Communication',
        simple: 'Every behavior — meltdowns, stimming, withdrawal — is your child telling you something. It\'s a message, not defiance.',
        deeper: 'The app asks "What function does this behavior serve?" — escape, attention, access to something, or sensory need. Understanding the function changes EVERYTHING.',
        module: 'Key Concept'
    },
    {
        term: 'Neurodivergent',
        simple: 'A brain that works differently from what society considers "typical." Includes autism, ADHD, dyslexia, sensory processing differences, and more.',
        deeper: 'Giovanna treats neurodivergence as a natural variation — not a deficit. The language throughout the app reflects this: "different wiring, not broken wiring."',
        module: 'Key Concept'
    },
    {
        term: 'Presumed Competence',
        simple: 'Always assume your child CAN — even when they can\'t show it yet. The app is built on the philosophy that every child has untapped potential.',
        deeper: 'When in doubt about a person\'s abilities, assume competence. The cost of underestimating someone is far greater than the cost of overestimating them.',
        module: 'Key Concept'
    },
];

/**
 * Search the concept guide by term or keyword
 */
export function searchConcepts(query: string): ConceptEntry[] {
    if (!query.trim()) return EC_CONCEPT_GUIDE;
    const q = query.toLowerCase();
    return EC_CONCEPT_GUIDE.filter(c =>
        c.term.toLowerCase().includes(q) ||
        c.simple.toLowerCase().includes(q) ||
        c.deeper.toLowerCase().includes(q) ||
        (c.module && c.module.toLowerCase().includes(q))
    );
}
