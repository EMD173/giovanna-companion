/**
 * Respite Care Marketplace — Pillar 3
 *
 * An Airbnb-style discovery platform for respite care providers.
 * Families search by radius from their location, filter by specialty,
 * read reviews, and contact providers directly.
 *
 * MVP scope: Discovery + contact only. No booking or payment processing.
 * Provider profiles are self-reported; verification badges come in v2.
 *
 * Theoretical grounding:
 * - DeGruy (Post Traumatic Slave Syndrome): Caregiver burnout in Black families
 *   is compounded by systemic distrust of care systems. A rated, community-vetted
 *   marketplace builds trust through transparency.
 * - Menakem (My Grandmother's Hands): Respite is not luxury — it is somatic
 *   necessity. Bodies carrying intergenerational stress need periodic release
 *   to avoid passing dysregulation forward.
 * - Davis (EC Framework): The caregiver's nervous system IS the child's
 *   co-regulation environment. Sustainable care requires sustainable caregivers.
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// CORE TYPES
// ============================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type ServiceType = 'in-home' | 'center-based' | 'community-outing' | 'overnight' | 'emergency';

export type AgeRange = '0-5' | '6-12' | '13-17' | '18+';

export type Specialty =
    | 'autism'
    | 'adhd'
    | 'down-syndrome'
    | 'cerebral-palsy'
    | 'sensory-processing'
    | 'intellectual-disability'
    | 'emotional-behavioral'
    | 'medically-fragile'
    | 'nonverbal-aac'
    | 'feeding-support'
    | 'mobility-support'
    | 'seizure-management';

export type Credential =
    | 'rbt'          // Registered Behavior Technician
    | 'cna'          // Certified Nursing Assistant
    | 'bcba'         // Board Certified Behavior Analyst
    | 'special-ed'   // Special Education Teacher/Cert
    | 'ot'           // Occupational Therapist
    | 'slp'          // Speech-Language Pathologist
    | 'pt'           // Physical Therapist
    | 'lpn'          // Licensed Practical Nurse
    | 'rn'           // Registered Nurse
    | 'para'         // Paraprofessional
    | 'dsp'          // Direct Support Professional
    | 'cpr-first-aid'
    | 'crisis-intervention'
    | 'trauma-informed';

// ============================================
// PROVIDER PROFILE
// ============================================

export interface ProviderAddress {
    city: string;
    state: string;
    zipCode: string;
    lat: number;
    lng: number;
}

export interface ProviderAvailability {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    notes?: string; // e.g., "Evenings only on weekdays"
}

export interface RespiteProvider {
    id: string;
    userId: string; // Firebase Auth UID

    // Profile
    displayName: string;
    bio: string;
    photoURL?: string;
    phone?: string;
    email?: string;
    website?: string;

    // Location
    address: ProviderAddress;
    serviceRadiusMiles: number; // How far they travel from their base

    // Qualifications
    credentials: Credential[];
    specialties: Specialty[];
    ageRanges: AgeRange[];
    experienceYears: number;
    languages: string[]; // e.g., ["English", "Spanish", "ASL"]

    // Services
    serviceTypes: ServiceType[];
    hourlyRateMin: number;
    hourlyRateMax: number;
    availability: ProviderAvailability;

    // Ratings (denormalized for fast display)
    averageRating: number;
    totalReviews: number;
    superProvider: boolean; // 4.8+ average with 10+ reviews

    // Status
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ProviderReview {
    id: string;
    providerId: string;
    reviewerId: string;
    reviewerDisplayName: string;
    rating: number; // 1–5
    text: string;
    createdAt: Timestamp;
}

// ============================================
// SEARCH & FILTER
// ============================================

export interface MarketplaceSearchParams {
    lat?: number;
    lng?: number;
    radiusMiles: number;
    state?: string;
    specialties?: Specialty[];
    ageRanges?: AgeRange[];
    serviceTypes?: ServiceType[];
    credentials?: Credential[];
    minRating?: number;
    maxRate?: number;
    daysAvailable?: DayOfWeek[];
    sortBy: 'distance' | 'rating' | 'price-low' | 'price-high' | 'reviews';
}

export interface ProviderWithDistance extends RespiteProvider {
    distanceMiles: number;
}

// ============================================
// DISPLAY LABELS
// ============================================

export const SPECIALTY_LABELS: Record<Specialty, string> = {
    'autism': 'Autism Spectrum',
    'adhd': 'ADHD',
    'down-syndrome': 'Down Syndrome',
    'cerebral-palsy': 'Cerebral Palsy',
    'sensory-processing': 'Sensory Processing',
    'intellectual-disability': 'Intellectual Disability',
    'emotional-behavioral': 'Emotional / Behavioral',
    'medically-fragile': 'Medically Fragile',
    'nonverbal-aac': 'Nonverbal / AAC',
    'feeding-support': 'Feeding Support',
    'mobility-support': 'Mobility Support',
    'seizure-management': 'Seizure Management',
};

export const CREDENTIAL_LABELS: Record<Credential, string> = {
    'rbt': 'RBT',
    'cna': 'CNA',
    'bcba': 'BCBA',
    'special-ed': 'Special Ed Certified',
    'ot': 'Occupational Therapist',
    'slp': 'Speech-Language Pathologist',
    'pt': 'Physical Therapist',
    'lpn': 'LPN',
    'rn': 'RN',
    'para': 'Paraprofessional',
    'dsp': 'Direct Support Professional',
    'cpr-first-aid': 'CPR / First Aid',
    'crisis-intervention': 'Crisis Intervention',
    'trauma-informed': 'Trauma-Informed Care',
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
    'in-home': 'In-Home Care',
    'center-based': 'Center-Based',
    'community-outing': 'Community Outing',
    'overnight': 'Overnight Care',
    'emergency': 'Emergency / Short-Notice',
};

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
    '0-5': 'Early Childhood (0–5)',
    '6-12': 'School Age (6–12)',
    '13-17': 'Adolescent (13–17)',
    '18+': 'Adult (18+)',
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
};

// ============================================
// US STATES LIST (for dropdown)
// ============================================

export const US_STATES = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' },
];

// ============================================
// GEO UTILITIES
// ============================================

/**
 * Haversine distance between two lat/lng points in miles.
 * Used client-side to filter and sort providers by proximity.
 */
export function haversineDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
): number {
    const R = 3958.8; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Compute a bounding box for a lat/lng + radius (miles).
 * Used to create a rough Firestore query range before exact filtering.
 */
export function boundingBox(lat: number, lng: number, radiusMiles: number): {
    minLat: number; maxLat: number; minLng: number; maxLng: number;
} {
    const latDelta = radiusMiles / 69.0; // ~69 miles per degree latitude
    const lngDelta = radiusMiles / (69.0 * Math.cos(toRad(lat)));
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLng: lng - lngDelta,
        maxLng: lng + lngDelta,
    };
}

// ============================================
// HELPERS
// ============================================

/**
 * Filter and sort providers by search params.
 * Designed for client-side use after Firestore fetch.
 */
export function filterProviders(
    providers: RespiteProvider[],
    params: MarketplaceSearchParams
): ProviderWithDistance[] {
    let results: ProviderWithDistance[] = providers.map(p => ({
        ...p,
        distanceMiles: (params.lat != null && params.lng != null)
            ? haversineDistance(params.lat, params.lng, p.address.lat, p.address.lng)
            : 0,
    }));

    // Filter by radius
    if (params.lat != null && params.lng != null) {
        results = results.filter(p => p.distanceMiles <= params.radiusMiles);
    }

    // Filter by state (if no geo coords provided)
    if (params.state && !params.lat) {
        results = results.filter(p =>
            p.address.state.toLowerCase() === params.state!.toLowerCase()
        );
    }

    // Filter by specialties (provider must have at least one matching)
    if (params.specialties && params.specialties.length > 0) {
        results = results.filter(p =>
            params.specialties!.some(s => p.specialties.includes(s))
        );
    }

    // Filter by age ranges
    if (params.ageRanges && params.ageRanges.length > 0) {
        results = results.filter(p =>
            params.ageRanges!.some(a => p.ageRanges.includes(a))
        );
    }

    // Filter by service types
    if (params.serviceTypes && params.serviceTypes.length > 0) {
        results = results.filter(p =>
            params.serviceTypes!.some(st => p.serviceTypes.includes(st))
        );
    }

    // Filter by credentials
    if (params.credentials && params.credentials.length > 0) {
        results = results.filter(p =>
            params.credentials!.some(c => p.credentials.includes(c))
        );
    }

    // Filter by minimum rating
    if (params.minRating) {
        results = results.filter(p => p.averageRating >= params.minRating!);
    }

    // Filter by max hourly rate
    if (params.maxRate) {
        results = results.filter(p => p.hourlyRateMin <= params.maxRate!);
    }

    // Filter by days available
    if (params.daysAvailable && params.daysAvailable.length > 0) {
        results = results.filter(p =>
            params.daysAvailable!.some(day => p.availability[day])
        );
    }

    // Sort
    switch (params.sortBy) {
        case 'distance':
            results.sort((a, b) => a.distanceMiles - b.distanceMiles);
            break;
        case 'rating':
            results.sort((a, b) => b.averageRating - a.averageRating);
            break;
        case 'price-low':
            results.sort((a, b) => a.hourlyRateMin - b.hourlyRateMin);
            break;
        case 'price-high':
            results.sort((a, b) => b.hourlyRateMax - a.hourlyRateMax);
            break;
        case 'reviews':
            results.sort((a, b) => b.totalReviews - a.totalReviews);
            break;
    }

    return results;
}

/**
 * Format rate range for display: "$20–$35/hr"
 */
export function formatRateRange(min: number, max: number): string {
    if (min === max) return `$${min}/hr`;
    return `$${min}–$${max}/hr`;
}

/**
 * Format distance for display: "2.4 mi" or "< 1 mi"
 */
export function formatDistance(miles: number): string {
    if (miles < 1) return '< 1 mi';
    return `${miles.toFixed(1)} mi`;
}

/**
 * Check if a provider qualifies as a Super Provider
 * Requires 4.8+ average rating AND 10+ reviews
 */
export function isSuperProvider(averageRating: number, totalReviews: number): boolean {
    return averageRating >= 4.8 && totalReviews >= 10;
}

/**
 * Create a blank provider profile for registration
 */
export function createBlankProvider(userId: string, displayName: string, email?: string): Omit<RespiteProvider, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        userId,
        displayName,
        bio: '',
        email: email || '',
        address: {
            city: '',
            state: '',
            zipCode: '',
            lat: 0,
            lng: 0,
        },
        serviceRadiusMiles: 25,
        credentials: [],
        specialties: [],
        ageRanges: [],
        experienceYears: 0,
        languages: ['English'],
        serviceTypes: ['in-home'],
        hourlyRateMin: 15,
        hourlyRateMax: 30,
        availability: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
        },
        averageRating: 0,
        totalReviews: 0,
        superProvider: false,
        isActive: false,
    };
}

// ============================================
// DEMO PROVIDERS (for presentations when Firestore is empty)
// ============================================

/**
 * Sample providers displayed when no real providers exist in Firestore.
 * These showcase the marketplace's full feature set: diverse specialties,
 * credentials, service types, ratings, and a Super Provider badge.
 *
 * A banner in the UI clearly marks these as demo data.
 */
export const DEMO_PROVIDERS: RespiteProvider[] = [
    {
        id: 'demo-1',
        userId: 'demo',
        displayName: 'Keisha Williams, RBT',
        bio: 'With 8 years of experience supporting autistic children and their families, I bring warmth, patience, and deep knowledge of sensory-friendly practices into every session. I believe every child communicates — my job is to listen.',
        email: 'demo@giovanna.app',
        address: { city: 'Birmingham', state: 'AL', zipCode: '35203', lat: 33.5186, lng: -86.8104 },
        serviceRadiusMiles: 20,
        credentials: ['rbt', 'cpr-first-aid', 'trauma-informed'],
        specialties: ['autism', 'sensory-processing', 'nonverbal-aac'],
        ageRanges: ['0-5', '6-12'],
        experienceYears: 8,
        languages: ['English'],
        serviceTypes: ['in-home', 'community-outing'],
        hourlyRateMin: 22,
        hourlyRateMax: 30,
        availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
        averageRating: 4.9,
        totalReviews: 14,
        superProvider: true,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: 'demo-2',
        userId: 'demo',
        displayName: 'Marcus Chen, CNA',
        bio: 'Former special education paraprofessional turned respite care specialist. I work with children who have high support needs, including medically fragile children. Families are my priority — I show up so you can breathe.',
        email: 'demo@giovanna.app',
        address: { city: 'Huntsville', state: 'AL', zipCode: '35801', lat: 34.7304, lng: -86.5861 },
        serviceRadiusMiles: 30,
        credentials: ['cna', 'para', 'cpr-first-aid', 'crisis-intervention'],
        specialties: ['medically-fragile', 'intellectual-disability', 'mobility-support', 'seizure-management'],
        ageRanges: ['6-12', '13-17'],
        experienceYears: 5,
        languages: ['English', 'Mandarin'],
        serviceTypes: ['in-home', 'overnight'],
        hourlyRateMin: 25,
        hourlyRateMax: 40,
        availability: { monday: false, tuesday: true, wednesday: true, thursday: false, friday: true, saturday: true, sunday: true },
        averageRating: 4.7,
        totalReviews: 8,
        superProvider: false,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: 'demo-3',
        userId: 'demo',
        displayName: 'Aliyah Robinson, Special Ed',
        bio: 'Licensed special education teacher with BCBA supervision hours completed. I specialize in helping families navigate the emotional-behavioral landscape with culturally responsive strategies rooted in presumed competence.',
        email: 'demo@giovanna.app',
        address: { city: 'Montgomery', state: 'AL', zipCode: '36104', lat: 32.3792, lng: -86.3077 },
        serviceRadiusMiles: 15,
        credentials: ['special-ed', 'rbt', 'trauma-informed'],
        specialties: ['autism', 'adhd', 'emotional-behavioral'],
        ageRanges: ['6-12', '13-17', '18+'],
        experienceYears: 12,
        languages: ['English', 'Spanish'],
        serviceTypes: ['in-home', 'center-based', 'community-outing'],
        hourlyRateMin: 28,
        hourlyRateMax: 45,
        availability: { monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: true, sunday: false },
        averageRating: 4.8,
        totalReviews: 11,
        superProvider: true,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
    {
        id: 'demo-4',
        userId: 'demo',
        displayName: 'Jasmine Torres, DSP',
        bio: 'Bilingual direct support professional passionate about creating joyful, safe spaces for neurodivergent children. My approach centers on sensory play, co-regulation, and building genuine connection. Every child deserves to be seen.',
        email: 'demo@giovanna.app',
        address: { city: 'Tuscaloosa', state: 'AL', zipCode: '35401', lat: 33.2098, lng: -87.5692 },
        serviceRadiusMiles: 25,
        credentials: ['dsp', 'cpr-first-aid', 'trauma-informed'],
        specialties: ['autism', 'adhd', 'sensory-processing', 'feeding-support'],
        ageRanges: ['0-5', '6-12'],
        experienceYears: 3,
        languages: ['English', 'Spanish', 'ASL'],
        serviceTypes: ['in-home', 'community-outing', 'emergency'],
        hourlyRateMin: 18,
        hourlyRateMax: 25,
        availability: { monday: true, tuesday: true, wednesday: false, thursday: true, friday: true, saturday: true, sunday: true },
        averageRating: 4.6,
        totalReviews: 5,
        superProvider: false,
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
    },
];

export const DEMO_PROVIDER_REVIEWS: Record<string, ProviderReview[]> = {
    'demo-1': [
        {
            id: 'demo-review-1',
            providerId: 'demo-1',
            reviewerId: 'demo-family-1',
            reviewerDisplayName: 'Danielle M.',
            rating: 5,
            text: 'Keisha was calm, prepared, and deeply respectful of my son’s sensory needs. This was the first time I felt like someone truly saw him instead of trying to manage him.',
            createdAt: Timestamp.now(),
        },
        {
            id: 'demo-review-2',
            providerId: 'demo-1',
            reviewerId: 'demo-family-2',
            reviewerDisplayName: 'Alicia R.',
            rating: 5,
            text: 'Reliable, warm, and excellent with AAC communication support. My daughter looked forward to their afternoons together.',
            createdAt: Timestamp.now(),
        },
    ],
    'demo-2': [
        {
            id: 'demo-review-3',
            providerId: 'demo-2',
            reviewerId: 'demo-family-3',
            reviewerDisplayName: 'Marcus J.',
            rating: 5,
            text: 'Marcus handled medical routines with confidence and gave us our first real overnight break in months.',
            createdAt: Timestamp.now(),
        },
    ],
    'demo-3': [
        {
            id: 'demo-review-4',
            providerId: 'demo-3',
            reviewerId: 'demo-family-4',
            reviewerDisplayName: 'Kiara B.',
            rating: 5,
            text: 'Aliyah brought a strong educator lens without making our child feel like a project. Thoughtful, affirming, and organized.',
            createdAt: Timestamp.now(),
        },
        {
            id: 'demo-review-5',
            providerId: 'demo-3',
            reviewerId: 'demo-family-5',
            reviewerDisplayName: 'T. Nguyen',
            rating: 4,
            text: 'Great communication and strong behavior support knowledge. We would book again.',
            createdAt: Timestamp.now(),
        },
    ],
    'demo-4': [
        {
            id: 'demo-review-6',
            providerId: 'demo-4',
            reviewerId: 'demo-family-6',
            reviewerDisplayName: 'Erica S.',
            rating: 5,
            text: 'Jasmine connected with our child immediately through play and movement. Very grounding presence.',
            createdAt: Timestamp.now(),
        },
    ],
};
