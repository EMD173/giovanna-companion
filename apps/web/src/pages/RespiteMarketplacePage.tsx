/**
 * RespiteMarketplacePage — Pillar 3: Respite Care Homeplace
 *
 * A relationship-centered discovery platform for respite care providers.
 * Three views:
 *   1. Search/Browse — Location-based search with filters
 *   2. Provider Detail — Full profile, reviews, contact info
 *   3. Provider Registration — For care providers to list themselves
 *
 * MVP: Discovery only. Families find and contact providers directly.
 * No booking or payment processing.
 *
 * "A Homeplace is where your child is known, not just watched."
 * — grounded in Menakem, DeGruy, and the EC Framework
 */


import { useParams } from 'react-router-dom';

// New Extracted Sub-Components
import { ProviderRegistrationForm } from '../components/homeplace/ProviderRegistrationForm';
import { ProviderDetailView } from '../components/homeplace/ProviderDetailView';
import { HomeplaceSearch_BrowseView } from '../components/homeplace/HomeplaceSearch_BrowseView';

// ============================================
// MAIN COMPONENT & CONTROLLER
// ============================================

export function RespiteMarketplacePage() {
    const { slug } = useParams<{ slug?: string }>();

    // slug === 'register' → Provider registration form
    // slug === provider ID → Provider detail view
    // no slug → Search/browse view

    if (slug === 'register') {
        return <ProviderRegistrationForm />;
    }

    if (slug) {
        return <ProviderDetailView providerId={slug} />;
    }

    return <HomeplaceSearch_BrowseView />;
}
