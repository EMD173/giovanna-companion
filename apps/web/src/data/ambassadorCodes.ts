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
    {
        term: 'Epigenetic Consciousness',
        simple: 'Understanding that your environment and experiences can change how your genes work — and that you can influence this process.',
        deeper: 'A framework showing that history lives in the body, identity is shaped by inherited experience, and conscious awareness creates the power to change biological patterns.',
        module: 'Core Framework'
    },
    {
        term: 'Epigenome',
        simple: 'The system that controls which genes are turned on or off. Think of it as the DJ deciding which tracks to play.',
        deeper: 'The complete set of chemical modifications on your DNA that determine gene expression. It responds to environment without changing the underlying genetic code.',
        module: 'Module 2: Epigenetic Literacy'
    },
    {
        term: 'Epigenetics',
        simple: 'The science of how your life experiences affect which genes are active — and how those effects can pass to your children.',
        deeper: 'The study of changes in gene expression caused by mechanisms other than changes in the DNA sequence. These changes can be heritable and are influenced by environment, stress, nutrition, and relationships.',
        module: 'Module 2: Epigenetic Literacy'
    },
    {
        term: 'Sociogenic Entropy',
        simple: 'When systems designed to harm keep spreading confusion and fragmentation through identity, language, and learning.',
        deeper: 'The diagnostic vocabulary of EC — naming how ontological denial creates cascading distortion across identity, language, learning, and biological expression. Energy disperses. Coherence breaks down.',
        module: 'Module 1: Sociogenic Entropy'
    },
    {
        term: 'Sociogenesis',
        simple: 'The idea that who we are is shaped by the stories society tells about us — our identity is narrated into being.',
        deeper: 'Wynter and Fanon\'s concept: identity is not discovered but constructed through social narration. Race, intelligence, worth — all are storied into existence by dominant systems.',
        module: 'Module 1: Sociogenic Entropy'
    },
    {
        term: 'Somatic',
        simple: 'Related to the body. Your body holds memories, stress, and healing — not just your mind.',
        deeper: 'Somatic experience refers to sensations, physical responses, and embodied emotion. Healing that includes the body can shift stored stress patterns at the biological level.',
        module: 'Module 4: Ancestral Neurogenesis'
    },
    {
        term: 'Epigenetic Memory',
        simple: 'The biological imprint of what you and your ancestors experienced, stored as chemical marks on your DNA.',
        deeper: 'Chemical modifications (like DNA methylation) that record lived experience. These marks can persist across generations, meaning your grandparents\' stress can influence your gene expression today.',
        module: 'Module 3: Lineage Mapping'
    },
    {
        term: 'The DJ Framework',
        simple: 'An analogy: your genome is a crate of records, your genes are individual tracks, the epigenome is the DJ choosing what plays, and your environment is the crowd influencing the DJ.',
        deeper: 'You don\'t always choose what\'s in the crate. But you develop influence over how the DJ mixes. This is the core teaching metaphor of Epigenetic Consciousness.',
        module: 'Core Framework'
    },
    {
        term: 'Neurodivergent',
        simple: 'A brain that works differently from what society considers "typical." This includes autism, ADHD, dyslexia, and more.',
        deeper: 'The neurodiversity paradigm (Singer/Kapp) reframes neurological differences as natural human variation rather than deficits to be fixed. Neurodivergence is identity, not pathology.',
        module: 'Practice Modules'
    },
    {
        term: 'Behavior Is Communication',
        simple: 'Every behavior — meltdowns, stimming, withdrawal — is your child telling you something. It\'s a message, not defiance.',
        deeper: 'Grounded in Functional Communication Training (Carr & Durand): behavior serves a function (escape, attention, access, sensory). Understanding the function replaces punishment with connection.',
        module: 'Pillar 1: Parent as Practitioner'
    },
    {
        term: 'Co-regulation',
        simple: 'You calm down first, and your calm helps your child calm down. Regulation is shared, not demanded.',
        deeper: 'Polyvagal theory (Porges): the nervous system is wired for connection. A regulated adult nervous system literally sends safety signals to a dysregulated child\'s nervous system.',
        module: 'Pillar 1: Parent as Practitioner'
    },
    {
        term: 'Culturally Sustaining Pedagogy',
        simple: 'Teaching that doesn\'t just "include" a child\'s culture — it strengthens and sustains it.',
        deeper: 'Paris (2012): goes beyond tolerance or relevance. The goal is to sustain the cultural and linguistic practices of communities that have been systematically erased by schooling.',
        module: 'Pillar 2: Educator & Paraprofessional Literacy'
    },
    {
        term: 'Black Language as Healing',
        simple: 'The way Black people speak — call-and-response, tonal shifts, rhythm — isn\'t broken English. It\'s a healing technology refined over 400 years.',
        deeper: 'EC applied to linguistics: Black Language operates through the same HPA axis and vagal nerve pathways as clinical somatic interventions. Every time a teacher says "speak properly," they interrupt inherited medicine.',
        module: 'BLH Application'
    },
    {
        term: 'Ontology',
        simple: 'What we believe a person IS — their being, their fullness, their reality.',
        deeper: 'If teaching ignores who the learner actually is (their history, language, body, lineage), it collapses. "Pedagogy without ontology collapses because it tries to teach over the person instead of through the person."',
        module: 'Core Framework'
    },
    {
        term: 'Ifá / Ebó',
        simple: 'A Yoruba spiritual tradition and its healing rituals. Affirms that nothing is permanent or absolute — healing is always possible.',
        deeper: 'African diasporic spiritual practice that aligns with EC\'s core premise: epigenetic changes are plastic and reversible. The spiritual and the biological converge on the same truth.',
        module: 'African Epistemological Traditions'
    },
    {
        term: 'Sankofa',
        simple: 'An Akan symbol: a bird that flies forward while looking back. The past is retrievable. The trajectory is changeable.',
        deeper: 'More scientifically accurate than Waddington\'s landscape (which encodes determinism). Meaney and Yehuda proved epigenetic changes ARE reversible. Sankofa captures what the science actually shows.',
        module: 'Module 3: Lineage Mapping'
    },
    {
        term: 'Presumed Competence',
        simple: 'Always assume your child CAN — even when they can\'t show it yet. The least dangerous assumption is belief.',
        deeper: 'Donnellan (1984): when in doubt about a person\'s abilities, assume competence. The cost of underestimating someone is far greater than the cost of overestimating them.',
        module: 'Pillar 1: Parent as Practitioner'
    },
    {
        term: 'Homeplace',
        simple: 'A space — physical or digital — where your family is safe, seen, and whole. No performance required.',
        deeper: 'hooks (1990): the homeplace as a site of resistance. In a world that fragments Black identity, the homeplace is where you are put back together.',
        module: 'Giovanna Features'
    }
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
