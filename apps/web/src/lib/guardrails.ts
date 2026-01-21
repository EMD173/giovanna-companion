/**
 * Content Guardrails & Validation
 * 
 * Protects against deficit-focused language, harmful framing,
 * and ensures dignity-centered communication.
 */

// ============================================
// GUARDRAIL TYPES
// ============================================

export type GuardrailCategory =
    | 'deficit_language'      // "low-functioning", "suffering from"
    | 'compliance_focus'      // "make them stop", "force"
    | 'cure_seeking'          // "cure", "fix", "normalize"
    | 'ableist_framing'       // "despite autism", "overcoming"
    | 'dehumanizing'          // "autistic" as noun vs adjective
    | 'sensationalism';       // "epidemic", "crisis"

export interface GuardrailViolation {
    category: GuardrailCategory;
    severity: 'warning' | 'block';
    flaggedText: string;
    suggestion: string;
}

export interface GuardrailResult {
    isValid: boolean;
    violations: GuardrailViolation[];
    score: number;  // 0-100, higher is better
}

// ============================================
// FLAGGED PHRASES (with replacements)
// ============================================

const DEFICIT_LANGUAGE: Array<{ pattern: RegExp; suggestion: string; severity: 'warning' | 'block' }> = [
    {
        pattern: /\blow[\s-]?functioning\b/gi,
        suggestion: 'high support needs',
        severity: 'block'
    },
    {
        pattern: /\bhigh[\s-]?functioning\b/gi,
        suggestion: 'lower support needs',
        severity: 'warning'
    },
    {
        pattern: /\bsuffering from autism\b/gi,
        suggestion: 'is autistic / has autism',
        severity: 'block'
    },
    {
        pattern: /\bafflicted with\b/gi,
        suggestion: 'has',
        severity: 'block'
    },
    {
        pattern: /\bmental age\b/gi,
        suggestion: 'developmental level in [specific area]',
        severity: 'warning'
    },
    {
        pattern: /\bretarded\b/gi,
        suggestion: 'intellectual disability',
        severity: 'block'
    },
    {
        pattern: /\bspecial needs\b/gi,
        suggestion: 'disability / support needs',
        severity: 'warning'
    }
];

const COMPLIANCE_FOCUS: Array<{ pattern: RegExp; suggestion: string; severity: 'warning' | 'block' }> = [
    {
        pattern: /\bmake (them|him|her) stop\b/gi,
        suggestion: 'understand why they... / support regulation',
        severity: 'warning'
    },
    {
        pattern: /\bforce (them|him|her) to\b/gi,
        suggestion: 'encourage / support / help them',
        severity: 'warning'
    },
    {
        pattern: /\bextinguish(ing)?\s+(the\s+)?behavior\b/gi,
        suggestion: 'address the underlying need',
        severity: 'warning'
    },
    {
        pattern: /\bnon[\s-]?complian(t|ce)\b/gi,
        suggestion: 'not yet able to / needs support with',
        severity: 'warning'
    }
];

const CURE_SEEKING: Array<{ pattern: RegExp; suggestion: string; severity: 'warning' | 'block' }> = [
    {
        pattern: /\bcure autism\b/gi,
        suggestion: '(remove - autism is not a disease)',
        severity: 'block'
    },
    {
        pattern: /\bfix (their|the) autism\b/gi,
        suggestion: 'support their needs',
        severity: 'block'
    },
    {
        pattern: /\brecovered from autism\b/gi,
        suggestion: '(autism is lifelong)',
        severity: 'block'
    },
    {
        pattern: /\bnormal(ize|izing)?\b/gi,
        suggestion: 'typical / neurotypical expectations',
        severity: 'warning'
    }
];

const ABLEIST_FRAMING: Array<{ pattern: RegExp; suggestion: string; severity: 'warning' | 'block' }> = [
    {
        pattern: /\bdespite (their|his|her) autism\b/gi,
        suggestion: 'as an autistic person',
        severity: 'warning'
    },
    {
        pattern: /\bovercom(e|ing) autism\b/gi,
        suggestion: 'thriving as an autistic person',
        severity: 'warning'
    },
    {
        pattern: /\btrapped (inside|by)\b/gi,
        suggestion: '(rephrase without imprisonment metaphor)',
        severity: 'warning'
    }
];

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export function validateContent(text: string): GuardrailResult {
    const violations: GuardrailViolation[] = [];

    // Check all categories
    const allPatterns: Array<{ patterns: typeof DEFICIT_LANGUAGE; category: GuardrailCategory }> = [
        { patterns: DEFICIT_LANGUAGE, category: 'deficit_language' },
        { patterns: COMPLIANCE_FOCUS, category: 'compliance_focus' },
        { patterns: CURE_SEEKING, category: 'cure_seeking' },
        { patterns: ABLEIST_FRAMING, category: 'ableist_framing' }
    ];

    for (const { patterns, category } of allPatterns) {
        for (const { pattern, suggestion, severity } of patterns) {
            const matches = text.match(pattern);
            if (matches) {
                for (const match of matches) {
                    violations.push({
                        category,
                        severity,
                        flaggedText: match,
                        suggestion
                    });
                }
            }
        }
    }

    // Calculate score (100 - penalties)
    const warningPenalty = 5;
    const blockPenalty = 20;
    const warnings = violations.filter(v => v.severity === 'warning').length;
    const blocks = violations.filter(v => v.severity === 'block').length;
    const score = Math.max(0, 100 - (warnings * warningPenalty) - (blocks * blockPenalty));

    return {
        isValid: blocks === 0,
        violations,
        score
    };
}

export function suggestReplacement(text: string): string {
    let result = text;

    const allPatterns = [
        ...DEFICIT_LANGUAGE,
        ...COMPLIANCE_FOCUS,
        ...CURE_SEEKING,
        ...ABLEIST_FRAMING
    ];

    for (const { pattern, suggestion } of allPatterns) {
        result = result.replace(pattern, suggestion);
    }

    return result;
}

// ============================================
// EC CONTEXT SUMMARY GENERATOR
// ============================================

export interface ECContextSummary {
    regulationContext: string;
    sensoryNeeds: string[];
    communicationNotes: string;
    homeplaceDetails: string;
}

export function generateECContextSection(
    childName: string,
    communicationStyle: { primaryMode: string; calmingStrategies: string[] },
    homeplaceSupports: { calmingPractices: string[]; sensoryTools: string[] }
): ECContextSummary {
    return {
        regulationContext: `${childName} may show signs of dysregulation when overwhelmed. This is a nervous system response, not a behavior choice.`,
        sensoryNeeds: homeplaceSupports.sensoryTools.length > 0
            ? homeplaceSupports.sensoryTools
            : ['Please ask family about specific sensory needs'],
        communicationNotes: `Primary communication: ${communicationStyle.primaryMode}. ` +
            (communicationStyle.calmingStrategies.length > 0
                ? `What helps: ${communicationStyle.calmingStrategies.join(', ')}.`
                : ''),
        homeplaceDetails: homeplaceSupports.calmingPractices.length > 0
            ? `Calming practices from home: ${homeplaceSupports.calmingPractices.join(', ')}`
            : 'Ask family about calming practices used at home.'
    };
}

// ============================================
// SHARE PACKET EC CONTEXT
// ============================================

export interface SharePacketECContext {
    includeECContext: boolean;
    summary?: ECContextSummary;
    additionalNotes?: string;
}
