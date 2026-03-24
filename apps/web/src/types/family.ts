/**
 * Family Role & Permissions
 * 
 * Implements the "Onion Model" of privacy:
 * - Admin: Full Access
 * - Co-Captain: Full Trust (Partner)
 * - Legal Guardian: High Access / Low Trust (Ex-Spouse) - No Journal/Feelings
 * - Village: Low Access (Calendar/Events only)
 * - Responder: Emergency Access (Safety Profile only)
 */

export type FamilyRole = 'admin' | 'co-captain' | 'legal-guardian' | 'village' | 'responder';

export interface RolePermission {
    label: string;
    description: string;
    viewJournal: boolean;   // Can see ABC logs, personal journal
    viewMedical: boolean;   // Can see meds, diagnoses, therapy
    viewCalendar: boolean;  // Can see events
    viewSafety: boolean;    // Can see Safety Profile (FACES)
    editAll: boolean;       // Admin privileges
}

export const ROLE_PERMISSIONS: Record<FamilyRole, RolePermission> = {
    'admin': {
        label: 'Chief (Admin)',
        description: 'Full control over the household.',
        viewJournal: true,
        viewMedical: true,
        viewCalendar: true,
        viewSafety: true,
        editAll: true
    },
    'co-captain': {
        label: 'Co-Captain',
        description: 'Partner or Spouse. Full trust and access.',
        viewJournal: true,
        viewMedical: true,
        viewCalendar: true,
        viewSafety: true,
        editAll: true
    },
    'legal-guardian': {
        label: 'Legal Guardian',
        description: 'Co-parent with legal rights but separate household. Sees facts (Medical/IEP), not feelings (Journal).',
        viewJournal: false,
        viewMedical: true,
        viewCalendar: true,
        viewSafety: true,
        editAll: false
    },
    'village': {
        label: 'Village Member',
        description: 'Aunties, Grandparents, Friends. Helping hands who see the calendar and joy.',
        viewJournal: false,
        viewMedical: false,
        viewCalendar: true,
        viewSafety: true, // Need to know safety if babysitting
        editAll: false
    },
    'responder': {
        label: 'First Responder',
        description: 'Police/EMT access to Safety Profile only.',
        viewJournal: false,
        viewMedical: false,
        viewCalendar: false,
        viewSafety: true,
        editAll: false
    }
};
