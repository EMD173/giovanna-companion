/**
 * NotAloneCards Content Type
 * 
 * Statistics and resources to help parents feel seen and supported.
 * Data-backed with citations and nuanced caveat text.
 */

export interface NotAloneCard {
    id: string;
    title: string;
    statText: string;
    sourceName: string;
    sourceLink: string;
    caveat: string;
    supportiveAction: {
        label: string;
        type: 'link' | 'copy' | 'navigate';
        content: string; // URL, copy text, or route
    };
    tags: ('prevalence' | 'mental-health' | 'support' | 'education' | 'family')[];
}

/**
 * Seed data for NotAloneCards
 */
export const NOT_ALONE_CARDS: NotAloneCard[] = [
    {
        id: 'cdc-prevalence-2023',
        title: 'You are part of a growing community',
        statText: '1 in 31 children (age 8) are identified as autistic — a community of millions of families.',
        sourceName: 'CDC ADDM Network, 2023',
        sourceLink: 'https://www.cdc.gov/mmwr/volumes/72/ss/ss7202a1.htm',
        caveat: 'Prevalence varies by region and demographic factors. Identification ≠ diagnosis for all.',
        supportiveAction: {
            label: 'Find local support groups',
            type: 'link',
            content: 'https://www.autismspeaks.org/resource-guide'
        },
        tags: ['prevalence', 'support']
    },
    {
        id: 'caregiver-mental-health',
        title: 'Caregiver burnout is real',
        statText: 'Parents of autistic children report significantly higher rates of stress and depression than parents of neurotypical children.',
        sourceName: 'Hayes & Watson, 2013 (Systematic Review)',
        sourceLink: 'https://pubmed.ncbi.nlm.nih.gov/22302147/',
        caveat: 'This reflects systemic lack of support, not parenting ability. You are doing hard work.',
        supportiveAction: {
            label: 'Self-care resources',
            type: 'navigate',
            content: '/resources/burnout'
        },
        tags: ['mental-health', 'support']
    },
    {
        id: 'school-partnership',
        title: 'You know your child best',
        statText: 'Research shows that parent involvement in educational planning leads to better outcomes for children.',
        sourceName: 'Jeynes, 2018 (Meta-analysis)',
        sourceLink: 'https://doi.org/10.1080/03054985.2018.1438239',
        caveat: 'Outcomes vary. "Better" is defined by the child and family, not external metrics alone.',
        supportiveAction: {
            label: 'School meeting prep guide',
            type: 'navigate',
            content: '/resources/school-prep'
        },
        tags: ['education', 'support']
    },
    {
        id: 'sibling-support',
        title: 'Siblings need support too',
        statText: 'Siblings of autistic children often develop remarkable empathy — and may also need space to process their own feelings.',
        sourceName: 'Hastings, 2003 (Review)',
        sourceLink: 'https://doi.org/10.1007/s10803-006-0168-0',
        caveat: 'Every sibling experience is unique. No single narrative applies to all families.',
        supportiveAction: {
            label: 'Sibling conversation starters',
            type: 'copy',
            content: '"I see you working hard to understand your sibling. Your feelings matter too. Would you like to talk about what\'s been on your mind?"'
        },
        tags: ['family', 'support']
    },
    {
        id: 'extended-family',
        title: 'Family can learn too',
        statText: 'Many grandparents and extended family members want to help but don\'t know how.',
        sourceName: 'Woodgate et al., 2008',
        sourceLink: 'https://doi.org/10.1111/j.1365-2648.2008.04791.x',
        caveat: 'Some family members may need time. You get to set boundaries about who learns what, when.',
        supportiveAction: {
            label: 'Copy letter for family',
            type: 'copy',
            content: 'Dear Family,\n\nWe\'re learning that [child\'s name] experiences the world in a unique way. Instead of seeing this as a problem to fix, we\'re focusing on understanding and supporting their needs.\n\nWhat helps:\n• Following their lead in play\n• Giving extra time to process\n• Reducing sensory overload\n• Celebrating their strengths\n\nWe\'d love your support in learning alongside us.\n\nWith love,\n[Your name]'
        },
        tags: ['family', 'support']
    }
];

/**
 * Get cards by tag
 */
export function getCardsByTag(tag: NotAloneCard['tags'][number]): NotAloneCard[] {
    return NOT_ALONE_CARDS.filter(card => card.tags.includes(tag));
}

/**
 * Get a random card for display
 */
export function getRandomCard(): NotAloneCard {
    return NOT_ALONE_CARDS[Math.floor(Math.random() * NOT_ALONE_CARDS.length)];
}
