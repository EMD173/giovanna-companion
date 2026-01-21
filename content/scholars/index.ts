/**
 * Scholars Directory Index
 * 
 * Programmatic access to the scholars directory metadata.
 * Full content is in markdown files—this provides paths and summaries only.
 */

export interface ScholarFile {
    path: string;
    title: string;
    summary: string;
}

export const SCHOLARS_INDEX: Record<string, ScholarFile> = {
    readme: {
        path: './README.md',
        title: 'About This Directory',
        summary: 'Purpose, evidence types, and disclaimer'
    },
    frameworks: {
        path: './FRAMEWORKS.md',
        title: 'Theoretical Frameworks',
        summary: 'Polyvagal Theory, Neurodiversity, Co-Regulation, Trauma-Informed Care, Epigenetic Consciousness'
    },
    researchers: {
        path: './RESEARCHERS.md',
        title: 'Researchers',
        summary: 'Carr & Durand (FCT), Kapp (stimming), Porges (polyvagal), Delahooke, Donnellan, Singer'
    },
    principles: {
        path: './PRINCIPLES.md',
        title: 'Core Principles',
        summary: 'Five guiding principles with citations and school scripts'
    },
    languageGuide: {
        path: './LANGUAGE_GUIDE.md',
        title: 'Language Guide',
        summary: 'Anti-deficit language patterns and autistic self-advocacy resources'
    }
};

/**
 * Core principles referenced in the AI system prompt
 */
export const CORE_PRINCIPLES = [
    'Behavior is communication, not defiance',
    'Regulation over compliance',
    'Assume competence',
    'Protect self-regulatory behaviors',
    'Co-regulation before self-regulation'
] as const;

/**
 * Evidence types for transparency
 */
export type EvidenceType =
    | 'peer-reviewed'      // Academic journals, controlled studies
    | 'clinical'           // Professional books, treatment manuals
    | 'community'          // Autistic self-advocacy, lived experience
    | 'designer';          // Frameworks created for this app

export interface FoundationEntry {
    name: string;
    evidenceType: EvidenceType;
    primaryFeature: string;
}

export const FOUNDATIONS: FoundationEntry[] = [
    { name: 'Functional Communication Training', evidenceType: 'peer-reviewed', primaryFeature: 'Learning Hub, ABC Logger' },
    { name: 'Autistic Stimming Research', evidenceType: 'peer-reviewed', primaryFeature: 'Learning Hub, Guardrails' },
    { name: 'Polyvagal Theory', evidenceType: 'peer-reviewed', primaryFeature: 'Lens Cards: Nervous System' },
    { name: 'Neurodiversity Paradigm', evidenceType: 'community', primaryFeature: 'Guardrails, AI Principles' },
    { name: 'Co-Regulation', evidenceType: 'clinical', primaryFeature: 'Lens Cards, Homeplace Supports' },
    { name: 'Trauma-Informed Care', evidenceType: 'clinical', primaryFeature: 'Crisis Plan' },
    { name: 'Presuming Competence', evidenceType: 'clinical', primaryFeature: 'AI Principle #3' },
    { name: 'Beyond Behaviors', evidenceType: 'clinical', primaryFeature: 'Meltdown vs Tantrum' },
    { name: 'Epigenetic Consciousness', evidenceType: 'designer', primaryFeature: 'Lens Cards 4-lens' },
    { name: 'Autistic Self-Advocacy', evidenceType: 'community', primaryFeature: 'Language Guide' }
];
