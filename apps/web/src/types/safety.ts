/**
 * Safety Profile Types (FACES Model)
 * 
 * Fostering Advocacy, Communication, Empowerment, and Support.
 * This data is HIGHLY SENSITIVE.
 */

export interface SafetyProfile {
    id: string;
    updatedAt: any; // Firestore timestamp or null

    // 1. Facts (Identity)
    diagnosis: string; // e.g., "Autistic, ADHD, Non-Speaking"
    communicationStyle: string; // e.g., "Uses AAC, Gestures, Scripting"

    // 2. Triggers (What escalates) - Simple array
    triggers: string[];

    // 3. Comforts / De-escalation (What helps) - Simple array
    comforts: string[];

    // 4. Emergency Script (For Police/EMS)
    emergencyScript: string;

    // 5. Emergency Contacts
    emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
    name: string;
    relation: string;
    phone: string;
    priority: number;
}

export const DEFAULT_SAFETY_PROFILE: Omit<SafetyProfile, 'id' | 'updatedAt'> = {
    diagnosis: '',
    communicationStyle: '',
    triggers: [],
    comforts: [],
    emergencyScript: 'I am autistic. I process information differently. I am not resisting. Please give me time to respond.',
    emergencyContacts: []
};

/**
 * Common trigger options for the Safety Profile
 */
export const COMMON_TRIGGERS: string[] = [
    'Loud noises',
    'Sirens / Alarms',
    'Flashing lights',
    'Physical touch',
    'Crowded spaces',
    'Changes in routine',
    'Direct eye contact',
    'Raised voices',
    'Unfamiliar people',
    'Time pressure',
    'Waiting',
    'Transitions'
];

/**
 * Common comfort/de-escalation strategies
 */
export const COMMON_COMFORTS: string[] = [
    'Weighted blanket',
    'Noise-cancelling headphones',
    'Dim lighting',
    'Quiet space',
    'Favorite toy/object',
    'Music',
    'Deep breathing prompts',
    'Counting',
    'Give space & time',
    'Calm, slow speech',
    'Written instructions',
    'Familiar person present'
];

/**
 * Default emergency script template
 */
export const DEFAULT_SCRIPT = `Hello, my name is [Name].

I am autistic. I process information differently. I am not trying to be difficult or non-compliant.

Please:
- Speak calmly and slowly
- Give me extra time to respond
- Avoid sudden movements
- Do not touch me without permission

I am not resisting. Please be patient with me.`;
