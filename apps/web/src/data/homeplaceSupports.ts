/**
 * Homeplace Supports Schema
 * 
 * User-defined supports for regulation, comfort, and identity.
 * All items are customizable—no stereotypes, no assumptions.
 */

export interface TrustedPerson {
    name: string;
    relationship: string;
    howTheyHelp?: string;
}

export interface CustomSupport {
    label: string;
    value: string;
}

export interface HomeplaceSupports {
    // Calming & Regulation
    calmingPractices: string[];
    sensoryTools: string[];
    movement: string[];
    routines: string[];

    // People & Places
    trustedPeople: TrustedPerson[];
    communitySpaces: string[];

    // Comfort & Identity
    musicSounds: string[];
    comfortFoods: string[];
    textures: string[];
    spiritualPractice?: string;  // Optional, user-defined

    // Fully Custom
    customSupports: CustomSupport[];
}

/**
 * Neutral, inclusive suggestions (not stereotypes)
 * Users can select from these OR add their own
 */
export const HOMEPLACE_SUGGESTIONS = {
    calmingPractices: [
        'Deep breathing',
        'Counting backwards',
        'Humming or singing',
        'Rocking',
        'Being held tightly',
        'Quiet time alone',
        'Watching water or movement',
        'Listening to a specific song',
        'Weighted blanket',
        'Dim lighting'
    ],
    sensoryTools: [
        'Fidget toys',
        'Noise-canceling headphones',
        'Sunglasses indoors',
        'Chewy necklace',
        'Stress ball',
        'Textured fabric',
        'Essential oil (specific scent)',
        'Weighted lap pad',
        'Vibrating pillow',
        'White noise machine'
    ],
    movement: [
        'Jumping',
        'Swinging',
        'Spinning',
        'Running',
        'Stomping',
        'Stretching',
        'Dancing',
        'Swimming',
        'Rolling on floor',
        'Climbing'
    ],
    relationships: [
        'Parent',
        'Grandparent',
        'Sibling',
        'Aunt/Uncle',
        'Cousin',
        'Family friend',
        'Teacher',
        'Therapist',
        'Pet',
        'Neighbor'
    ],
    communitySpaces: [
        'Library',
        'Park',
        'Place of worship',
        'Grandparent\'s house',
        'Specific playground',
        'Therapy center',
        'Friend\'s house',
        'Nature trail',
        'Pool/water space',
        'Quiet corner at home'
    ]
};

/**
 * Empty Homeplace Supports template
 */
export function createEmptyHomeplaceSupports(): HomeplaceSupports {
    return {
        calmingPractices: [],
        sensoryTools: [],
        movement: [],
        routines: [],
        trustedPeople: [],
        communitySpaces: [],
        musicSounds: [],
        comfortFoods: [],
        textures: [],
        spiritualPractice: undefined,
        customSupports: []
    };
}

/**
 * Validate Homeplace Supports (no empty labels)
 */
export function validateHomeplaceSupports(supports: HomeplaceSupports): boolean {
    // Custom supports must have both label and value
    for (const custom of supports.customSupports) {
        if (!custom.label.trim() || !custom.value.trim()) {
            return false;
        }
    }

    // Trusted people must have name and relationship
    for (const person of supports.trustedPeople) {
        if (!person.name.trim() || !person.relationship.trim()) {
            return false;
        }
    }

    return true;
}
