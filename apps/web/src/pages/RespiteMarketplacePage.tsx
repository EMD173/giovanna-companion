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

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Search, MapPin, Star, Clock, Shield, Heart, ChevronRight,
    ChevronLeft, Filter, Phone, Mail, Globe, Award,
    Navigation, Users, DollarSign, Calendar, CheckCircle, Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRespiteSearch, useProviderProfile, useProviderReviews } from '../hooks/useRespiteProviders';
import type {
    RespiteProvider, ProviderWithDistance, ProviderReview,
    MarketplaceSearchParams, Specialty, AgeRange, ServiceType, Credential,
    DayOfWeek,
} from '../data/respiteMarketplace';
import {
    SPECIALTY_LABELS, CREDENTIAL_LABELS, SERVICE_TYPE_LABELS,
    AGE_RANGE_LABELS, DAY_LABELS, US_STATES,
    formatRateRange, formatDistance, createBlankProvider, DEMO_PROVIDERS, DEMO_PROVIDER_REVIEWS
} from '../data/respiteMarketplace';
import { sanctuary, typography } from '../shared/theme';

// ============================================
// MAIN COMPONENT
// ============================================

export function RespiteMarketplacePage() {
    const { slug } = useParams<{ slug?: string }>();

    // slug === 'register' → Provider registration form
    // slug === provider ID → Provider detail view
    // no slug → Search/browse view

    if (slug === 'register') {
        return <ProviderRegistration />;
    }

    if (slug) {
        return <ProviderDetail providerId={slug} />;
    }

    return <MarketplaceSearch />;
}

// ============================================
// SEARCH / BROWSE VIEW
// ============================================

function MarketplaceSearch() {
    const navigate = useNavigate();
    const {
        results, loading, error, isDemoMode,
        userLocation, locationLoading,
        requestLocation, search,
    } = useRespiteSearch();

    const [showFilters, setShowFilters] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Search params
    const [radiusMiles, setRadiusMiles] = useState(50);
    const [stateFilter, setStateFilter] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState<Specialty[]>([]);
    const [ageFilter, setAgeFilter] = useState<AgeRange[]>([]);
    const [sortBy, setSortBy] = useState<MarketplaceSearchParams['sortBy']>('distance');
    const [minRating, setMinRating] = useState(0);

    const handleSearch = async () => {
        const params: MarketplaceSearchParams = {
            lat: userLocation?.lat,
            lng: userLocation?.lng,
            radiusMiles,
            state: stateFilter || undefined,
            specialties: specialtyFilter.length > 0 ? specialtyFilter : undefined,
            ageRanges: ageFilter.length > 0 ? ageFilter : undefined,
            minRating: minRating > 0 ? minRating : undefined,
            sortBy,
        };
        await search(params);
        setHasSearched(true);
    };

    const handleNearMe = async () => {
        if (!userLocation) {
            requestLocation();
            return;
        }
        await handleSearch();
    };

    // Auto-search when location becomes available
    useEffect(() => {
        if (userLocation && !hasSearched) {
            handleSearch();
        }
    }, [userLocation]);

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '140px' }}>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Hero Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{
                                fontFamily: typography.heading, fontSize: '2.2rem', fontWeight: 700,
                                color: sanctuary.text, marginBottom: '8px', lineHeight: 1.15,
                                letterSpacing: '-0.02em',
                            }}>
                                Respite Care Homeplace
                            </h1>
                            <p style={{
                                color: sanctuary.textMuted, fontSize: '1rem',
                                fontFamily: typography.body, fontWeight: 400, lineHeight: 1.6,
                                maxWidth: '520px',
                            }}>
                                Build real relationships with trusted providers who become part of your village.
                                Because sustainable caregiving starts with a place that feels like home.
                            </p>
                        </div>
                        <Link to="/respite/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px', borderRadius: '14px',
                            background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                            color: sanctuary.sage, fontSize: '0.85rem', fontWeight: 700,
                            fontFamily: typography.body, textDecoration: 'none',
                            transition: 'all 0.2s ease',
                        }}>
                            <Plus size={16} />
                            Join the Homeplace Network
                        </Link>
                    </div>

                    {/* What is a Homeplace? */}
                    <div style={{
                        marginTop: '20px', padding: '20px 24px', borderRadius: '16px',
                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                    }}>
                        <p style={{
                            fontFamily: typography.heading, fontSize: '0.95rem', fontWeight: 700,
                            color: sanctuary.text, marginBottom: '6px',
                        }}>
                            🏡 What is a Homeplace?
                        </p>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.88rem',
                            color: sanctuary.textSecondary, lineHeight: 1.7,
                        }}>
                            A Homeplace is a place that feels like home — caring, loving, safe. It's where your
                            child is known by name, where their sensory needs are anticipated, where the adults
                            speak their language. Whether it's a family down the street, a trained provider, or a
                            facility that has earned your trust — Homeplace care means your child gets what YOU
                            would give them. These are relationships, not transactions.
                        </p>
                    </div>
                </header>

                {/* Search Bar */}
                <section className="sanctuary-enter sanctuary-enter-1" style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`, padding: '24px',
                    boxShadow: sanctuary.shadow, marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Near Me Button */}
                        <button onClick={handleNearMe} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px', borderRadius: '14px', border: 'none',
                            background: userLocation
                                ? `linear-gradient(135deg, ${sanctuary.sageBg}, ${sanctuary.purpleBg})`
                                : sanctuary.purpleBg,
                            color: sanctuary.purple, fontSize: '0.88rem', fontWeight: 700,
                            fontFamily: typography.body, cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}>
                            <Navigation size={16} />
                            {locationLoading ? 'Locating...' : userLocation ? 'Near Me' : 'Use My Location'}
                        </button>

                        {/* State Dropdown (fallback if no location) */}
                        <select
                            value={stateFilter}
                            onChange={e => setStateFilter(e.target.value)}
                            style={{
                                padding: '12px 16px', borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`,
                                background: sanctuary.bgCard, color: sanctuary.text,
                                fontSize: '0.88rem', fontFamily: typography.body,
                                fontWeight: 500, cursor: 'pointer', minWidth: '160px',
                            }}
                        >
                            <option value="">All States</option>
                            {US_STATES.map(s => (
                                <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                        </select>

                        {/* Radius Selector */}
                        <select
                            value={radiusMiles}
                            onChange={e => setRadiusMiles(Number(e.target.value))}
                            style={{
                                padding: '12px 16px', borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`,
                                background: sanctuary.bgCard, color: sanctuary.text,
                                fontSize: '0.88rem', fontFamily: typography.body,
                                fontWeight: 500, cursor: 'pointer',
                            }}
                        >
                            <option value={10}>10 miles</option>
                            <option value={25}>25 miles</option>
                            <option value={50}>50 miles</option>
                            <option value={100}>100 miles</option>
                            <option value={250}>250 miles</option>
                        </select>

                        {/* Filter Toggle */}
                        <button onClick={() => setShowFilters(!showFilters)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '12px 16px', borderRadius: '14px', border: `1px solid ${sanctuary.border}`,
                            background: showFilters ? sanctuary.purpleBg : sanctuary.bgCard,
                            color: showFilters ? sanctuary.purple : sanctuary.textSecondary,
                            fontSize: '0.85rem', fontWeight: 600, fontFamily: typography.body,
                            cursor: 'pointer', transition: 'all 0.2s ease',
                        }}>
                            <Filter size={15} />
                            Filters
                        </button>

                        {/* Search Button */}
                        <button onClick={handleSearch} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '14px', border: 'none',
                            background: sanctuary.purple, color: '#FFFFFF',
                            fontSize: '0.88rem', fontWeight: 700, fontFamily: typography.body,
                            cursor: 'pointer', marginLeft: 'auto',
                            transition: 'all 0.2s ease',
                        }}>
                            <Search size={16} />
                            Search
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div style={{
                            marginTop: '20px', paddingTop: '20px',
                            borderTop: `1px solid ${sanctuary.border}`,
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                                {/* Specialties */}
                                <FilterGroup
                                    label="Specialties"
                                    options={Object.entries(SPECIALTY_LABELS).map(([k, v]) => ({ key: k as Specialty, label: v }))}
                                    selected={specialtyFilter}
                                    onChange={(v) => setSpecialtyFilter(v as Specialty[])}
                                />
                                {/* Age Ranges */}
                                <FilterGroup
                                    label="Age Ranges"
                                    options={Object.entries(AGE_RANGE_LABELS).map(([k, v]) => ({ key: k as AgeRange, label: v }))}
                                    selected={ageFilter}
                                    onChange={(v) => setAgeFilter(v as AgeRange[])}
                                />
                                {/* Min Rating */}
                                <div>
                                    <label style={filterLabelStyle}>Minimum Rating</label>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {[0, 3, 3.5, 4, 4.5].map(r => (
                                            <button key={r} onClick={() => setMinRating(r)} style={{
                                                padding: '8px 14px', borderRadius: '10px',
                                                border: `1px solid ${minRating === r ? sanctuary.goldBorder : sanctuary.border}`,
                                                background: minRating === r ? sanctuary.goldBg : sanctuary.bgCard,
                                                color: minRating === r ? sanctuary.gold : sanctuary.textSecondary,
                                                fontSize: '0.82rem', fontWeight: 600, fontFamily: typography.body,
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                {r === 0 ? 'Any' : <><Star size={12} fill={sanctuary.gold} color={sanctuary.gold} /> {r}+</>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Sort By */}
                                <div>
                                    <label style={filterLabelStyle}>Sort By</label>
                                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={selectStyle}>
                                        <option value="distance">Nearest First</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="reviews">Most Reviews</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '16px 20px', borderRadius: '14px',
                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                        color: sanctuary.rose, fontSize: '0.88rem', fontFamily: typography.body,
                        marginBottom: '20px',
                    }}>
                        {error}
                    </div>
                )}

                {isDemoMode && (
                    <div style={{
                        padding: '14px 18px', borderRadius: '14px',
                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                        color: sanctuary.text, fontSize: '0.86rem', fontFamily: typography.body,
                        marginBottom: '20px',
                    }}>
                        Showing demo providers because live marketplace data is not available yet.
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{
                            width: '40px', height: '40px', border: `3px solid ${sanctuary.border}`,
                            borderTopColor: sanctuary.purple, borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                        }} />
                        <p style={{ color: sanctuary.textMuted, fontFamily: typography.body, fontSize: '0.92rem' }}>
                            Searching for providers...
                        </p>
                    </div>
                )}

                {/* Results */}
                {!loading && hasSearched && (
                    <>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '20px',
                        }}>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.88rem',
                                color: sanctuary.textMuted, fontWeight: 500,
                            }}>
                                {results.length} provider{results.length !== 1 ? 's' : ''} found
                                {userLocation && ` within ${radiusMiles} miles`}
                            </p>
                        </div>

                        {results.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '20px',
                            }}>
                                {results.map((provider, i) => (
                                    <ProviderCard
                                        key={provider.id}
                                        provider={provider}
                                        index={i}
                                        onClick={() => navigate(`/respite/${provider.id}`)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Pre-Search State */}
                {!loading && !hasSearched && (
                    <div className="sanctuary-enter sanctuary-enter-2" style={{
                        textAlign: 'center', padding: '80px 24px',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px',
                            background: `linear-gradient(135deg, ${sanctuary.roseBg}, ${sanctuary.purpleBg})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px', color: sanctuary.purple,
                        }}>
                            <Heart size={36} />
                        </div>
                        <h2 style={{
                            fontFamily: typography.heading, fontSize: '1.5rem', fontWeight: 700,
                            color: sanctuary.text, marginBottom: '12px',
                        }}>
                            Find Homeplace Care Near You
                        </h2>
                        <p style={{
                            color: sanctuary.textSecondary, fontFamily: typography.body,
                            fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 28px',
                        }}>
                            Discover providers who become part of your village — people
                            who know your child and build real relationships with your family.
                        </p>
                        <button onClick={handleNearMe} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '14px 28px', borderRadius: '16px', border: 'none',
                            background: sanctuary.purple, color: '#FFFFFF',
                            fontSize: '0.95rem', fontWeight: 700, fontFamily: typography.body,
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}>
                            <Navigation size={18} />
                            {locationLoading ? 'Locating...' : 'Search Near Me'}
                        </button>
                        <button onClick={handleSearch} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '14px 28px', borderRadius: '16px',
                            border: `1px solid ${sanctuary.border}`,
                            background: sanctuary.bgCard, color: sanctuary.text,
                            fontSize: '0.95rem', fontWeight: 700, fontFamily: typography.body,
                            cursor: 'pointer',
                        }}>
                            <Heart size={18} />
                            Browse Homeplace Providers
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// PROVIDER CARD
// ============================================

function ProviderCard({ provider, index, onClick }: {
    provider: ProviderWithDistance;
    index: number;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`sanctuary-card sanctuary-enter sanctuary-enter-${Math.min(index + 2, 8)}`}
            style={{
                background: sanctuary.bgCard, borderRadius: '20px',
                border: `1px solid ${sanctuary.border}`, padding: '24px',
                boxShadow: sanctuary.shadow, cursor: 'pointer',
                textAlign: 'left', width: '100%',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.2s ease',
            }}
        >
            {/* Super Provider Badge */}
            {provider.superProvider && (
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '8px',
                    background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                }}>
                    <Award size={12} color={sanctuary.gold} />
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 800, color: sanctuary.gold,
                        fontFamily: typography.body, letterSpacing: '0.04em',
                    }}>
                        SUPER
                    </span>
                </div>
            )}

            {/* Avatar + Name */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '16px',
                    background: `linear-gradient(135deg, ${sanctuary.purpleBg}, ${sanctuary.sageBg})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: sanctuary.purple, fontSize: '1.3rem', fontWeight: 700,
                    fontFamily: typography.heading,
                    border: provider.superProvider ? `2px solid ${sanctuary.gold}` : 'none',
                }}>
                    {provider.photoURL ? (
                        <img src={provider.photoURL} alt="" style={{
                            width: '100%', height: '100%', borderRadius: '16px', objectFit: 'cover',
                        }} />
                    ) : (
                        provider.displayName.charAt(0).toUpperCase()
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700, fontSize: '1.1rem',
                        color: sanctuary.text, marginBottom: '4px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                        {provider.displayName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: '3px',
                            color: sanctuary.gold, fontSize: '0.82rem', fontWeight: 700,
                            fontFamily: typography.body,
                        }}>
                            <Star size={13} fill={sanctuary.gold} color={sanctuary.gold} />
                            {provider.averageRating > 0 ? provider.averageRating.toFixed(1) : 'New'}
                        </span>
                        {provider.totalReviews > 0 && (
                            <span style={{
                                color: sanctuary.textMuted, fontSize: '0.78rem',
                                fontFamily: typography.body,
                            }}>
                                ({provider.totalReviews} review{provider.totalReviews !== 1 ? 's' : ''})
                            </span>
                        )}
                        {provider.distanceMiles > 0 && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: '3px',
                                color: sanctuary.sage, fontSize: '0.78rem', fontWeight: 600,
                                fontFamily: typography.body,
                            }}>
                                <MapPin size={11} />
                                {formatDistance(provider.distanceMiles)}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio snippet */}
            <p style={{
                fontFamily: typography.body, fontSize: '0.85rem', color: sanctuary.textSecondary,
                lineHeight: 1.6, marginBottom: '14px',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
            }}>
                {provider.bio || 'Experienced respite care provider.'}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {provider.specialties.slice(0, 3).map(s => (
                    <span key={s} style={tagStyle(sanctuary.purpleBg, sanctuary.purple)}>
                        {SPECIALTY_LABELS[s]}
                    </span>
                ))}
                {provider.specialties.length > 3 && (
                    <span style={tagStyle(sanctuary.purpleBg, sanctuary.purple)}>
                        +{provider.specialties.length - 3}
                    </span>
                )}
            </div>

            {/* Footer: Rate + Credentials */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '14px', borderTop: `1px solid ${sanctuary.border}`,
            }}>
                <span style={{
                    fontFamily: typography.body, fontSize: '0.92rem', fontWeight: 700,
                    color: sanctuary.text,
                }}>
                    {formatRateRange(provider.hourlyRateMin, provider.hourlyRateMax)}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                    {provider.credentials.slice(0, 3).map(c => (
                        <span key={c} style={tagStyle(sanctuary.sageBg, sanctuary.sage)}>
                            {CREDENTIAL_LABELS[c]}
                        </span>
                    ))}
                </div>
            </div>
        </button>
    );
}

// ============================================
// PROVIDER DETAIL VIEW
// ============================================

function ProviderDetail({ providerId }: { providerId: string }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { reviews, submitReview } = useProviderReviews(providerId);
    const [provider, setProvider] = useState<RespiteProvider | null>(null);
    const [isDemoProvider, setIsDemoProvider] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const { doc: docFn, getDoc: getDocFn } = await import('firebase/firestore');
                const { db: fireDb } = await import('../lib/firebase');
                const ref = docFn(fireDb, 'respiteProviders', providerId);
                const snap = await getDocFn(ref);
                if (snap.exists()) {
                    setProvider({ id: snap.id, ...snap.data() } as RespiteProvider);
                    setIsDemoProvider(false);
                    return;
                }

                const demoProvider = DEMO_PROVIDERS.find((item) => item.id === providerId);
                if (demoProvider) {
                    setProvider(demoProvider);
                    setIsDemoProvider(true);
                }
            } catch (err) {
                console.error('Failed to load provider:', err);
                const demoProvider = DEMO_PROVIDERS.find((item) => item.id === providerId);
                if (demoProvider) {
                    setProvider(demoProvider);
                    setIsDemoProvider(true);
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [providerId]);

    const displayedReviews = isDemoProvider
        ? (DEMO_PROVIDER_REVIEWS[providerId] || [])
        : reviews;

    const handleSubmitReview = async () => {
        if (isDemoProvider) return;
        if (!reviewText.trim()) return;
        setSubmittingReview(true);
        try {
            await submitReview(reviewRating, reviewText.trim());
            setReviewText('');
            setReviewRating(5);
            setShowReviewForm(false);
        } catch (err: any) {
            alert(err.message || 'Failed to submit review.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>Loading provider...</p>
            </div>
        );
    }

    if (!provider) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body, fontSize: '1.1rem' }}>
                    Provider not found.
                </p>
                <button onClick={() => navigate('/respite')} style={backBtnStyle}>
                    <ChevronLeft size={16} /> Back to Search
                </button>
            </div>
        );
    }

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '140px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Back Button */}
                <button onClick={() => navigate('/respite')} className="sanctuary-enter" style={backBtnStyle}>
                    <ChevronLeft size={16} /> Back to Search
                </button>

                {/* Profile Header */}
                <section className="sanctuary-enter sanctuary-enter-1" style={{
                    background: sanctuary.bgCard, borderRadius: '24px',
                    border: `1px solid ${sanctuary.border}`, padding: '32px',
                    boxShadow: sanctuary.shadow, marginBottom: '24px',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Gold top accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: provider.superProvider
                            ? `linear-gradient(90deg, transparent, ${sanctuary.gold}60, ${sanctuary.gold}60, transparent)`
                            : `linear-gradient(90deg, transparent, ${sanctuary.purple}30, transparent)`,
                    }} />

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '90px', height: '90px', borderRadius: '22px',
                            background: `linear-gradient(135deg, ${sanctuary.purpleBg}, ${sanctuary.sageBg})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, color: sanctuary.purple, fontSize: '2rem', fontWeight: 700,
                            fontFamily: typography.heading,
                            border: provider.superProvider ? `3px solid ${sanctuary.gold}` : `1px solid ${sanctuary.border}`,
                        }}>
                            {provider.photoURL ? (
                                <img src={provider.photoURL} alt="" style={{
                                    width: '100%', height: '100%', borderRadius: '22px', objectFit: 'cover',
                                }} />
                            ) : (
                                provider.displayName.charAt(0).toUpperCase()
                            )}
                        </div>

                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                <h1 style={{
                                    fontFamily: typography.heading, fontSize: '1.8rem', fontWeight: 700,
                                    color: sanctuary.text, lineHeight: 1.2,
                                }}>
                                    {provider.displayName}
                                </h1>
                                {isDemoProvider && (
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '5px 12px', borderRadius: '10px',
                                        background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                        color: sanctuary.purple, fontSize: '0.75rem', fontWeight: 800,
                                        fontFamily: typography.body, letterSpacing: '0.05em',
                                    }}>
                                        DEMO PROFILE
                                    </span>
                                )}
                                {provider.superProvider && (
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                        padding: '5px 12px', borderRadius: '10px',
                                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                        color: sanctuary.gold, fontSize: '0.75rem', fontWeight: 800,
                                        fontFamily: typography.body, letterSpacing: '0.05em',
                                    }}>
                                        <Award size={13} /> SUPER PROVIDER
                                    </span>
                                )}
                            </div>

                            {/* Rating + Location + Experience */}
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sanctuary.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: typography.body }}>
                                    <Star size={15} fill={sanctuary.gold} color={sanctuary.gold} />
                                    {provider.averageRating > 0 ? provider.averageRating.toFixed(1) : 'New'}
                                    <span style={{ color: sanctuary.textMuted, fontWeight: 400 }}>
                                        ({provider.totalReviews} review{provider.totalReviews !== 1 ? 's' : ''})
                                    </span>
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sanctuary.textSecondary, fontSize: '0.88rem', fontFamily: typography.body }}>
                                    <MapPin size={14} />
                                    {provider.address.city}, {provider.address.state}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sanctuary.textSecondary, fontSize: '0.88rem', fontFamily: typography.body }}>
                                    <Clock size={14} />
                                    {provider.experienceYears} year{provider.experienceYears !== 1 ? 's' : ''} experience
                                </span>
                            </div>

                            {/* Bio */}
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.95rem', color: sanctuary.textSecondary,
                                lineHeight: 1.75, marginBottom: '20px',
                            }}>
                                {provider.bio}
                            </p>

                            {/* Contact Actions */}
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {provider.phone && (
                                    <a href={`tel:${provider.phone}`} style={contactBtnStyle(sanctuary.sageBg, sanctuary.sage)}>
                                        <Phone size={15} /> Call
                                    </a>
                                )}
                                {provider.email && (
                                    <a href={`mailto:${provider.email}`} style={contactBtnStyle(sanctuary.purpleBg, sanctuary.purple)}>
                                        <Mail size={15} /> Email
                                    </a>
                                )}
                                {provider.website && (
                                    <a href={provider.website} target="_blank" rel="noopener noreferrer" style={contactBtnStyle(sanctuary.goldBg, sanctuary.gold)}>
                                        <Globe size={15} /> Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    {/* Specialties Card */}
                    <DetailCard title="Specialties" icon={<Heart size={18} />} iconColor={sanctuary.rose} iconBg={sanctuary.roseBg}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {provider.specialties.map(s => (
                                <span key={s} style={tagStyle(sanctuary.roseBg, sanctuary.rose)}>{SPECIALTY_LABELS[s]}</span>
                            ))}
                        </div>
                    </DetailCard>

                    {/* Credentials Card */}
                    <DetailCard title="Credentials" icon={<Shield size={18} />} iconColor={sanctuary.sage} iconBg={sanctuary.sageBg}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {provider.credentials.map(c => (
                                <span key={c} style={tagStyle(sanctuary.sageBg, sanctuary.sage)}>{CREDENTIAL_LABELS[c]}</span>
                            ))}
                        </div>
                    </DetailCard>

                    {/* Services & Rates Card */}
                    <DetailCard title="Services & Rates" icon={<DollarSign size={18} />} iconColor={sanctuary.gold} iconBg={sanctuary.goldBg}>
                        <p style={{ fontFamily: typography.body, fontSize: '1.1rem', fontWeight: 700, color: sanctuary.text, marginBottom: '10px' }}>
                            {formatRateRange(provider.hourlyRateMin, provider.hourlyRateMax)}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {provider.serviceTypes.map(st => (
                                <span key={st} style={tagStyle(sanctuary.goldBg, sanctuary.gold)}>{SERVICE_TYPE_LABELS[st]}</span>
                            ))}
                        </div>
                    </DetailCard>

                    {/* Availability Card */}
                    <DetailCard title="Availability" icon={<Calendar size={18} />} iconColor={sanctuary.purple} iconBg={sanctuary.purpleBg}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(Object.entries(provider.availability) as [DayOfWeek | 'notes', boolean | string | undefined][])
                                .filter(([key]) => key !== 'notes')
                                .map(([day, available]) => (
                                    <span key={day} style={{
                                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem',
                                        fontWeight: 700, fontFamily: typography.body,
                                        background: available ? sanctuary.sageBg : sanctuary.bg,
                                        color: available ? sanctuary.sage : sanctuary.textMuted,
                                        border: `1px solid ${available ? sanctuary.sageBorder : sanctuary.border}`,
                                    }}>
                                        {DAY_LABELS[day as DayOfWeek]}
                                    </span>
                                ))}
                        </div>
                        {provider.availability.notes && (
                            <p style={{ fontFamily: typography.body, fontSize: '0.82rem', color: sanctuary.textMuted, marginTop: '8px', fontStyle: 'italic' }}>
                                {provider.availability.notes}
                            </p>
                        )}
                    </DetailCard>

                    {/* Age Ranges Card */}
                    <DetailCard title="Ages Served" icon={<Users size={18} />} iconColor={sanctuary.purple} iconBg={sanctuary.purpleBg}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {provider.ageRanges.map(a => (
                                <span key={a} style={tagStyle(sanctuary.purpleBg, sanctuary.purple)}>{AGE_RANGE_LABELS[a]}</span>
                            ))}
                        </div>
                    </DetailCard>

                    {/* Languages & Radius Card */}
                    <DetailCard title="Service Area" icon={<Navigation size={18} />} iconColor={sanctuary.sage} iconBg={sanctuary.sageBg}>
                        <p style={{ fontFamily: typography.body, fontSize: '0.88rem', color: sanctuary.textSecondary, marginBottom: '8px' }}>
                            Serves within <strong>{provider.serviceRadiusMiles} miles</strong> of {provider.address.city}, {provider.address.state}
                        </p>
                        {provider.languages.length > 0 && (
                            <p style={{ fontFamily: typography.body, fontSize: '0.85rem', color: sanctuary.textMuted }}>
                                Languages: {provider.languages.join(', ')}
                            </p>
                        )}
                    </DetailCard>
                </div>

                {/* Reviews Section */}
                <section className="sanctuary-enter sanctuary-enter-3" style={{
                    background: sanctuary.bgCard, borderRadius: '24px',
                    border: `1px solid ${sanctuary.border}`, padding: '32px',
                    boxShadow: sanctuary.shadow,
                }}>
                    {isDemoProvider && (
                        <div style={{
                            padding: '14px 18px', borderRadius: '14px',
                            background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                            color: sanctuary.text, fontSize: '0.85rem', fontFamily: typography.body,
                            marginBottom: '20px',
                        }}>
                            This is a demo provider profile with sample reviews for presentation and testing.
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{
                            fontFamily: typography.heading, fontSize: '1.3rem', fontWeight: 700,
                            color: sanctuary.text,
                        }}>
                            Reviews ({provider.totalReviews})
                        </h2>
                        {user && !showReviewForm && !isDemoProvider && (
                            <button onClick={() => setShowReviewForm(true)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 18px', borderRadius: '12px', border: 'none',
                                background: sanctuary.purple, color: '#FFFFFF',
                                fontSize: '0.85rem', fontWeight: 700, fontFamily: typography.body,
                                cursor: 'pointer',
                            }}>
                                <Plus size={15} /> Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div style={{
                            padding: '24px', borderRadius: '16px',
                            background: sanctuary.bg, border: `1px solid ${sanctuary.border}`,
                            marginBottom: '24px',
                        }}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={filterLabelStyle}>Rating</label>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <button key={r} onClick={() => setReviewRating(r)} style={{
                                            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                                        }}>
                                            <Star
                                                size={24}
                                                fill={r <= reviewRating ? sanctuary.gold : 'none'}
                                                color={sanctuary.gold}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                placeholder="Share your experience with this provider..."
                                rows={4}
                                style={{
                                    width: '100%', padding: '14px 16px', borderRadius: '14px',
                                    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
                                    fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.text,
                                    resize: 'vertical', marginBottom: '12px', boxSizing: 'border-box',
                                }}
                            />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowReviewForm(false)} style={{
                                    padding: '10px 18px', borderRadius: '12px',
                                    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
                                    color: sanctuary.textSecondary, fontSize: '0.85rem', fontWeight: 600,
                                    fontFamily: typography.body, cursor: 'pointer',
                                }}>
                                    Cancel
                                </button>
                                <button onClick={handleSubmitReview} disabled={submittingReview || !reviewText.trim()} style={{
                                    padding: '10px 18px', borderRadius: '12px', border: 'none',
                                    background: submittingReview ? sanctuary.textMuted : sanctuary.purple,
                                    color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700,
                                    fontFamily: typography.body, cursor: submittingReview ? 'default' : 'pointer',
                                }}>
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Review List */}
                    {displayedReviews.length === 0 ? (
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.textMuted,
                            textAlign: 'center', padding: '32px 0',
                        }}>
                            No reviews yet. Be the first to share your experience.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {displayedReviews.map(review => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function ReviewCard({ review }: { review: ProviderReview }) {
    const date = review.createdAt?.toDate?.() || new Date();
    return (
        <div style={{
            padding: '20px', borderRadius: '16px',
            background: sanctuary.bg, border: `1px solid ${sanctuary.border}`,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        background: sanctuary.purpleBg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: sanctuary.purple, fontSize: '0.85rem',
                        fontWeight: 700, fontFamily: typography.heading,
                    }}>
                        {review.reviewerDisplayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p style={{ fontFamily: typography.body, fontWeight: 700, fontSize: '0.88rem', color: sanctuary.text }}>
                            {review.reviewerDisplayName}
                        </p>
                        <p style={{ fontFamily: typography.body, fontSize: '0.75rem', color: sanctuary.textMuted }}>
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={13} fill={s <= review.rating ? sanctuary.gold : 'none'} color={sanctuary.gold} />
                    ))}
                </div>
            </div>
            <p style={{
                fontFamily: typography.body, fontSize: '0.88rem', color: sanctuary.textSecondary,
                lineHeight: 1.7,
            }}>
                {review.text}
            </p>
        </div>
    );
}

// ============================================
// PROVIDER REGISTRATION
// ============================================

function ProviderRegistration() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile, createProfile, loading } = useProviderProfile();

    const [formData, setFormData] = useState(() =>
        createBlankProvider(user?.uid || '', user?.displayName || '', user?.email || '')
    );
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already has a profile
    useEffect(() => {
        if (profile) {
            navigate(`/respite/${profile.id}`);
        }
    }, [profile, navigate]);

    if (!user) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
                <p style={{ color: sanctuary.textSecondary, fontFamily: typography.body, fontSize: '1.05rem' }}>
                    Please sign in to register as a respite care provider.
                </p>
            </div>
        );
    }

    const updateForm = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const updateAddress = (updates: Partial<typeof formData.address>) => {
        setFormData(prev => ({ ...prev, address: { ...prev.address, ...updates } }));
    };

    const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] => {
        return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    };

    const handleSubmit = async () => {
        setError(null);
        // Basic validation
        if (!formData.displayName.trim()) { setError('Display name is required.'); return; }
        if (!formData.bio.trim()) { setError('Please write a short bio.'); return; }
        if (!formData.address.city.trim() || !formData.address.state) { setError('City and state are required.'); return; }
        if (formData.specialties.length === 0) { setError('Select at least one specialty.'); return; }

        try {
            await createProfile({ ...formData, isActive: true });
            navigate('/respite');
        } catch (err: any) {
            setError(err.message || 'Failed to create profile.');
        }
    };

    const totalSteps = 4;

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '140px' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Back Button */}
                <button onClick={() => navigate('/respite')} className="sanctuary-enter" style={backBtnStyle}>
                    <ChevronLeft size={16} /> Back to Marketplace
                </button>

                <header className="sanctuary-enter sanctuary-enter-1" style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '8px',
                    }}>
                        List Your Services
                    </h1>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.95rem', color: sanctuary.textMuted, lineHeight: 1.6,
                    }}>
                        Join a community of providers supporting neurodivergent families.
                    </p>

                    {/* Progress Bar */}
                    <div style={{
                        display: 'flex', gap: '8px', marginTop: '24px',
                    }}>
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} style={{
                                flex: 1, height: '4px', borderRadius: '2px',
                                background: s <= step ? sanctuary.purple : sanctuary.border,
                                transition: 'background 0.3s ease',
                            }} />
                        ))}
                    </div>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.78rem', color: sanctuary.textMuted,
                        marginTop: '8px',
                    }}>
                        Step {step} of {totalSteps}
                    </p>
                </header>

                {error && (
                    <div style={{
                        padding: '14px 20px', borderRadius: '14px',
                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                        color: sanctuary.rose, fontSize: '0.88rem', fontFamily: typography.body,
                        marginBottom: '20px',
                    }}>
                        {error}
                    </div>
                )}

                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    background: sanctuary.bgCard, borderRadius: '24px',
                    border: `1px solid ${sanctuary.border}`, padding: '32px',
                    boxShadow: sanctuary.shadow,
                }}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <>
                            <h2 style={stepTitleStyle}>About You</h2>
                            <FormField label="Display Name" required>
                                <input type="text" value={formData.displayName}
                                    onChange={e => updateForm({ displayName: e.target.value })}
                                    placeholder="How families will see your name"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Bio" required>
                                <textarea value={formData.bio}
                                    onChange={e => updateForm({ bio: e.target.value })}
                                    placeholder="Tell families about your experience, approach, and what makes your care special..."
                                    rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
                            </FormField>
                            <FormField label="Phone (optional)">
                                <input type="tel" value={formData.phone || ''}
                                    onChange={e => updateForm({ phone: e.target.value })}
                                    placeholder="(555) 555-5555"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Email">
                                <input type="email" value={formData.email || ''}
                                    onChange={e => updateForm({ email: e.target.value })}
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Website (optional)">
                                <input type="url" value={formData.website || ''}
                                    onChange={e => updateForm({ website: e.target.value })}
                                    placeholder="https://..."
                                    style={inputStyle} />
                            </FormField>
                        </>
                    )}

                    {/* Step 2: Location */}
                    {step === 2 && (
                        <>
                            <h2 style={stepTitleStyle}>Your Location</h2>
                            <FormField label="City" required>
                                <input type="text" value={formData.address.city}
                                    onChange={e => updateAddress({ city: e.target.value })}
                                    placeholder="Birmingham"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="State" required>
                                <select value={formData.address.state}
                                    onChange={e => updateAddress({ state: e.target.value })}
                                    style={inputStyle}>
                                    <option value="">Select state...</option>
                                    {US_STATES.map(s => (
                                        <option key={s.code} value={s.code}>{s.name}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="ZIP Code">
                                <input type="text" value={formData.address.zipCode}
                                    onChange={e => updateAddress({ zipCode: e.target.value })}
                                    placeholder="35203"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Service Radius (miles)">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input type="range" min={5} max={100} step={5}
                                        value={formData.serviceRadiusMiles}
                                        onChange={e => updateForm({ serviceRadiusMiles: Number(e.target.value) })}
                                        style={{ flex: 1 }} />
                                    <span style={{
                                        fontFamily: typography.body, fontWeight: 700,
                                        color: sanctuary.purple, fontSize: '1rem', minWidth: '60px',
                                    }}>
                                        {formData.serviceRadiusMiles} mi
                                    </span>
                                </div>
                            </FormField>
                            <FormField label="Languages">
                                <input type="text" value={formData.languages.join(', ')}
                                    onChange={e => updateForm({ languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="English, Spanish, ASL"
                                    style={inputStyle} />
                            </FormField>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.78rem', color: sanctuary.textMuted,
                                fontStyle: 'italic', marginTop: '8px',
                            }}>
                                Your exact address is never shown. Only your city and state are displayed to families.
                            </p>
                        </>
                    )}

                    {/* Step 3: Specialties & Credentials */}
                    {step === 3 && (
                        <>
                            <h2 style={stepTitleStyle}>Specialties & Credentials</h2>
                            <FormField label="Specialties (select all that apply)" required>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(SPECIALTY_LABELS) as [Specialty, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.specialties.includes(key)}
                                            onClick={() => updateForm({ specialties: toggleArrayItem(formData.specialties, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Credentials">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(CREDENTIAL_LABELS) as [Credential, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.credentials.includes(key)}
                                            onClick={() => updateForm({ credentials: toggleArrayItem(formData.credentials, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Age Ranges Served">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(AGE_RANGE_LABELS) as [AgeRange, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.ageRanges.includes(key)}
                                            onClick={() => updateForm({ ageRanges: toggleArrayItem(formData.ageRanges, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Years of Experience">
                                <input type="number" min={0} max={50}
                                    value={formData.experienceYears}
                                    onChange={e => updateForm({ experienceYears: Number(e.target.value) })}
                                    style={{ ...inputStyle, maxWidth: '120px' }} />
                            </FormField>
                        </>
                    )}

                    {/* Step 4: Services & Availability */}
                    {step === 4 && (
                        <>
                            <h2 style={stepTitleStyle}>Services & Availability</h2>
                            <FormField label="Service Types">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.serviceTypes.includes(key)}
                                            onClick={() => updateForm({ serviceTypes: toggleArrayItem(formData.serviceTypes, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Hourly Rate Range">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>$</span>
                                    <input type="number" min={0} value={formData.hourlyRateMin}
                                        onChange={e => updateForm({ hourlyRateMin: Number(e.target.value) })}
                                        style={{ ...inputStyle, maxWidth: '100px' }} />
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>to $</span>
                                    <input type="number" min={0} value={formData.hourlyRateMax}
                                        onChange={e => updateForm({ hourlyRateMax: Number(e.target.value) })}
                                        style={{ ...inputStyle, maxWidth: '100px' }} />
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>/hr</span>
                                </div>
                            </FormField>
                            <FormField label="Availability">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(DAY_LABELS) as [DayOfWeek, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.availability[key]}
                                            onClick={() => updateForm({
                                                availability: { ...formData.availability, [key]: !formData.availability[key] }
                                            })} />
                                    ))}
                                </div>
                            </FormField>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', marginTop: '32px',
                        paddingTop: '24px', borderTop: `1px solid ${sanctuary.border}`,
                    }}>
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '12px 20px', borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
                                color: sanctuary.textSecondary, fontSize: '0.88rem', fontWeight: 600,
                                fontFamily: typography.body, cursor: 'pointer',
                            }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        ) : <div />}

                        {step < totalSteps ? (
                            <button onClick={() => setStep(step + 1)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '12px 24px', borderRadius: '14px', border: 'none',
                                background: sanctuary.purple, color: '#FFFFFF',
                                fontSize: '0.88rem', fontWeight: 700, fontFamily: typography.body,
                                cursor: 'pointer',
                            }}>
                                Next <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 28px', borderRadius: '14px', border: 'none',
                                background: loading ? sanctuary.textMuted : sanctuary.sage,
                                color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700,
                                fontFamily: typography.body, cursor: loading ? 'default' : 'pointer',
                            }}>
                                <CheckCircle size={18} />
                                {loading ? 'Creating...' : 'Publish Profile'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SHARED SUB-COMPONENTS
// ============================================

function DetailCard({ title, icon, iconColor, iconBg, children }: {
    title: string; icon: React.ReactNode; iconColor: string; iconBg: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            background: sanctuary.bgCard, borderRadius: '20px',
            border: `1px solid ${sanctuary.border}`, padding: '24px',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '12px',
                    background: iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: iconColor,
                }}>
                    {icon}
                </div>
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700, fontSize: '1rem',
                    color: sanctuary.text,
                }}>
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}

function FilterGroup<T extends string>({ label, options, selected, onChange }: {
    label: string; options: { key: T; label: string }[];
    selected: T[]; onChange: (v: T[]) => void;
}) {
    const toggle = (key: T) => {
        onChange(selected.includes(key) ? selected.filter(x => x !== key) : [...selected, key]);
    };
    return (
        <div>
            <label style={filterLabelStyle}>{label}</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {options.map(o => (
                    <ToggleChip key={o.key} label={o.label}
                        active={selected.includes(o.key)}
                        onClick={() => toggle(o.key)} />
                ))}
            </div>
        </div>
    );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: '7px 14px', borderRadius: '10px',
            border: `1px solid ${active ? sanctuary.purpleBorder : sanctuary.border}`,
            background: active ? sanctuary.purpleBg : sanctuary.bgCard,
            color: active ? sanctuary.purple : sanctuary.textSecondary,
            fontSize: '0.78rem', fontWeight: active ? 700 : 500,
            fontFamily: typography.body, cursor: 'pointer',
            transition: 'all 0.15s ease',
        }}>
            {label}
        </button>
    );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'block', fontFamily: typography.body, fontWeight: 700,
                fontSize: '0.85rem', color: sanctuary.text, marginBottom: '8px',
            }}>
                {label} {required && <span style={{ color: sanctuary.rose }}>*</span>}
            </label>
            {children}
        </div>
    );
}

function EmptyState() {
    return (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: sanctuary.roseBg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 20px', color: sanctuary.rose,
            }}>
                <MapPin size={28} />
            </div>
            <h3 style={{
                fontFamily: typography.heading, fontWeight: 700, fontSize: '1.2rem',
                color: sanctuary.text, marginBottom: '8px',
            }}>
                No providers found
            </h3>
            <p style={{
                fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.textMuted,
                lineHeight: 1.6, maxWidth: '400px', margin: '0 auto',
            }}>
                Try expanding your search radius or adjusting your filters.
                You can also browse by state.
            </p>
        </div>
    );
}

// ============================================
// SHARED STYLES
// ============================================

const filterLabelStyle: React.CSSProperties = {
    display: 'block', fontFamily: typography.body, fontWeight: 700,
    fontSize: '0.78rem', color: sanctuary.textMuted, marginBottom: '8px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
};

const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
    fontFamily: typography.body, fontSize: '0.88rem', color: sanctuary.text,
    cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '14px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bg,
    fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.text,
    boxSizing: 'border-box',
};

const backBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '10px 16px', borderRadius: '12px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
    color: sanctuary.textSecondary, fontSize: '0.85rem', fontWeight: 600,
    fontFamily: typography.body, cursor: 'pointer', marginBottom: '24px',
    textDecoration: 'none',
};

const stepTitleStyle: React.CSSProperties = {
    fontFamily: typography.heading, fontWeight: 700, fontSize: '1.3rem',
    color: sanctuary.text, marginBottom: '24px',
};

function tagStyle(bg: string, color: string): React.CSSProperties {
    return {
        padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem',
        fontWeight: 700, fontFamily: typography.body,
        background: bg, color: color,
    };
}

function contactBtnStyle(bg: string, color: string): React.CSSProperties {
    return {
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '10px 18px', borderRadius: '12px',
        background: bg, color: color,
        fontSize: '0.85rem', fontWeight: 700, fontFamily: typography.body,
        textDecoration: 'none', border: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease',
    };
}
