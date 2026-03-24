/**
 * useRespiteProviders — Firestore hook for the Respite Care Marketplace
 *
 * Handles:
 * - Fetching active providers (with optional state pre-filter)
 * - Client-side radius filtering via Haversine
 * - Provider profile CRUD (for providers registering themselves)
 * - Reviews: submit, fetch, and rating recalculation
 * - Browser geolocation for "near me" search
 *
 * Firestore structure:
 *   respiteProviders/{providerId}         — Provider profiles
 *   respiteProviders/{providerId}/reviews/{reviewId} — Reviews
 */

import { useState, useEffect, useCallback } from 'react';
import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type {
    RespiteProvider, ProviderReview, MarketplaceSearchParams,
    ProviderWithDistance,
} from '../data/respiteMarketplace';
import { filterProviders, isSuperProvider, DEMO_PROVIDERS } from '../data/respiteMarketplace';

// ============================================
// GEOCODING UTILITY (OpenStreetMap Nominatim — free, no API key)
// ============================================

/**
 * Convert a city/state/zip into lat/lng coordinates using the free
 * OpenStreetMap Nominatim API. Falls back to { lat: 0, lng: 0 } on failure.
 *
 * Rate limit: 1 request per second (https://operations.osmfoundation.org/policies/nominatim/)
 * This is fine for provider registration (a single call per registration).
 */
export async function geocodeAddress(
    city: string, state: string, zipCode: string
): Promise<{ lat: number; lng: number; success: boolean }> {
    try {
        const query = [city, state, zipCode, 'US'].filter(Boolean).join(', ');
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'GiovannaCompanion/1.0' }, // Required by Nominatim TOS
        });
        if (!res.ok) return { lat: 0, lng: 0, success: false };
        const data = await res.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                success: true,
            };
        }
        return { lat: 0, lng: 0, success: false };
    } catch {
        return { lat: 0, lng: 0, success: false };
    }
}

// ============================================
// PROVIDER SEARCH HOOK
// ============================================

export function useRespiteSearch() {
    const [providers, setProviders] = useState<RespiteProvider[]>([]);
    const [results, setResults] = useState<ProviderWithDistance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [isDemoMode, setIsDemoMode] = useState(false);

    /**
     * Request browser geolocation
     */
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocationLoading(false);
            },
            (err) => {
                setError(`Location access denied: ${err.message}`);
                setLocationLoading(false);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    /**
     * Fetch all active providers from Firestore.
     * We fetch broadly and filter client-side for MVP.
     * In production, use geohashing or a geo-query extension.
     */
    const fetchProviders = useCallback(async (stateFilter?: string) => {
        setLoading(true);
        setError(null);
        try {
            const ref = collection(db, 'respiteProviders');
            let q;
            if (stateFilter) {
                q = query(ref,
                    where('isActive', '==', true),
                    where('address.state', '==', stateFilter),
                    limit(200)
                );
            } else {
                q = query(ref,
                    where('isActive', '==', true),
                    limit(200)
                );
            }
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as RespiteProvider));

            // Demo fallback: if Firestore has no providers, show sample
            // data so the marketplace is functional for demos/presentations.
            // The UI will display a banner indicating demo mode.
            if (data.length === 0) {
                const demoData = stateFilter
                    ? DEMO_PROVIDERS.filter(p => p.address.state === stateFilter)
                    : DEMO_PROVIDERS;
                setProviders(demoData);
                setIsDemoMode(true);
                return demoData;
            }

            setProviders(data);
            setIsDemoMode(false);
            return data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load providers.';
            setError(message);
            // Even on error, show demo providers so the page isn't blank
            setProviders(DEMO_PROVIDERS);
            setIsDemoMode(true);
            return DEMO_PROVIDERS;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Search with full filter params.
     * Fetches from Firestore then applies client-side filtering.
     */
    const search = useCallback(async (params: MarketplaceSearchParams) => {
        const fetched = await fetchProviders(params.state);
        const filtered = filterProviders(fetched, params);
        setResults(filtered);
        return filtered;
    }, [fetchProviders]);

    return {
        providers, results, loading, error, isDemoMode,
        userLocation, locationLoading,
        requestLocation, setUserLocation,
        fetchProviders, search, setResults,
    };
}

// ============================================
// PROVIDER PROFILE HOOK (for providers managing their own profile)
// ============================================

export function useProviderProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<RespiteProvider | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch the current user's provider profile (if they have one)
     */
    const fetchMyProfile = useCallback(async () => {
        if (!user) return null;
        setLoading(true);
        try {
            const ref = collection(db, 'respiteProviders');
            const q = query(ref, where('userId', '==', user.uid), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const data = { id: snap.docs[0].id, ...snap.docs[0].data() } as RespiteProvider;
                setProfile(data);
                return data;
            }
            setProfile(null);
            return null;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load profile.';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Create a new provider profile
     */
    const createProfile = useCallback(async (
        data: Omit<RespiteProvider, 'id' | 'createdAt' | 'updatedAt'>
    ) => {
        if (!user) throw new Error('Must be logged in');
        setLoading(true);
        try {
            // Auto-geocode address if lat/lng are 0,0 (the default)
            let profileData = { ...data };
            if (profileData.address.lat === 0 && profileData.address.lng === 0
                && profileData.address.city && profileData.address.state) {
                const geo = await geocodeAddress(
                    profileData.address.city,
                    profileData.address.state,
                    profileData.address.zipCode
                );
                if (geo.success) {
                    profileData = {
                        ...profileData,
                        address: { ...profileData.address, lat: geo.lat, lng: geo.lng },
                    };
                } else {
                    console.warn('[Giovanna] Geocoding failed — provider will default to 0,0 coordinates.');
                }
            }

            const ref = collection(db, 'respiteProviders');
            const docRef = await addDoc(ref, {
                ...profileData,
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            const created = { ...profileData, id: docRef.id } as RespiteProvider;
            setProfile(created);
            return created;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create profile.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    /**
     * Update an existing provider profile
     */
    const updateProfile = useCallback(async (
        providerId: string,
        updates: Partial<RespiteProvider>
    ) => {
        if (!user) throw new Error('Must be logged in');
        setLoading(true);
        try {
            const ref = doc(db, 'respiteProviders', providerId);
            await updateDoc(ref, {
                ...updates,
                updatedAt: serverTimestamp(),
            });
            if (profile) {
                const updated = { ...profile, ...updates };
                setProfile(updated);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to update profile.';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, profile]);

    /**
     * Deactivate (soft-delete) a provider profile
     */
    const deactivateProfile = useCallback(async (providerId: string) => {
        await updateProfile(providerId, { isActive: false });
    }, [updateProfile]);

    useEffect(() => {
        if (user) fetchMyProfile();
    }, [user, fetchMyProfile]);

    return {
        profile, loading, error,
        fetchMyProfile, createProfile, updateProfile, deactivateProfile,
    };
}

// ============================================
// REVIEWS HOOK
// ============================================

export function useProviderReviews(providerId: string | null) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<ProviderReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all reviews for a provider
     */
    const fetchReviews = useCallback(async () => {
        if (!providerId) return;
        setLoading(true);
        try {
            const ref = collection(db, 'respiteProviders', providerId, 'reviews');
            const q = query(ref, orderBy('createdAt', 'desc'), limit(50));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProviderReview));
            setReviews(data);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to load reviews.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [providerId]);

    /**
     * Submit a review and update the provider's aggregate rating
     */
    const submitReview = useCallback(async (rating: number, text: string) => {
        if (!user || !providerId) throw new Error('Must be logged in and have a provider selected');

        // Check if user already reviewed this provider
        const existingRef = collection(db, 'respiteProviders', providerId, 'reviews');
        const existingQ = query(existingRef, where('reviewerId', '==', user.uid), limit(1));
        const existingSnap = await getDocs(existingQ);
        if (!existingSnap.empty) {
            throw new Error('You have already reviewed this provider.');
        }

        // Add the review
        const reviewRef = collection(db, 'respiteProviders', providerId, 'reviews');
        await addDoc(reviewRef, {
            providerId,
            reviewerId: user.uid,
            reviewerDisplayName: user.displayName || 'Anonymous Family',
            rating,
            text,
            createdAt: serverTimestamp(),
        });

        // Recalculate aggregate rating
        const allReviewsSnap = await getDocs(collection(db, 'respiteProviders', providerId, 'reviews'));
        let totalRating = 0;
        let count = 0;
        allReviewsSnap.forEach(d => {
            const r = d.data();
            if (typeof r.rating === 'number') {
                totalRating += r.rating;
                count++;
            }
        });
        const newAverage = count > 0 ? totalRating / count : 0;
        const providerRef = doc(db, 'respiteProviders', providerId);
        await updateDoc(providerRef, {
            averageRating: Math.round(newAverage * 10) / 10,
            totalReviews: count,
            superProvider: isSuperProvider(newAverage, count),
            updatedAt: serverTimestamp(),
        });

        // Refresh reviews
        await fetchReviews();
    }, [user, providerId, fetchReviews]);

    /**
     * Delete own review
     */
    const deleteReview = useCallback(async (reviewId: string) => {
        if (!user || !providerId) return;
        const reviewRef = doc(db, 'respiteProviders', providerId, 'reviews', reviewId);
        const reviewSnap = await getDoc(reviewRef);
        if (reviewSnap.exists() && reviewSnap.data().reviewerId === user.uid) {
            await deleteDoc(reviewRef);
            await fetchReviews();
        }
    }, [user, providerId, fetchReviews]);

    useEffect(() => {
        if (providerId) fetchReviews();
    }, [providerId, fetchReviews]);

    return { reviews, loading, error, submitReview, deleteReview, fetchReviews };
}
