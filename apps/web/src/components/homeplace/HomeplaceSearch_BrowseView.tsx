import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Navigation, Filter, Plus, Heart, MapPin, Star } from 'lucide-react';
import { useRespiteSearch } from '../../hooks/useRespiteProviders';
import type { MarketplaceSearchParams, Specialty, AgeRange } from '../../data/respiteMarketplace';
import { US_STATES, SPECIALTY_LABELS, AGE_RANGE_LABELS } from '../../data/respiteMarketplace';
import { sanctuary, typography } from '../../shared/theme';
import { filterLabelStyle, selectStyle, ToggleChip } from './SharedHomeplaceStyles';
import { ProviderCard } from './ProviderCard';

export function HomeplaceSearch_BrowseView() {
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

    // Auto-search when location becomes available (one-time trigger)
    const didAutoSearch = useRef(false);
    useEffect(() => {
        if (userLocation && !didAutoSearch.current) {
            didAutoSearch.current = true;
            // Defer to avoid synchronous setState cascade
            const params: MarketplaceSearchParams = {
                lat: userLocation.lat,
                lng: userLocation.lng,
                radiusMiles,
                state: stateFilter || undefined,
                specialties: specialtyFilter.length > 0 ? specialtyFilter : undefined,
                ageRanges: ageFilter.length > 0 ? ageFilter : undefined,
                minRating: minRating > 0 ? minRating : undefined,
                sortBy,
            };
            search(params).then(() => setHasSearched(true));
        }
    }, [userLocation, radiusMiles, stateFilter, specialtyFilter, ageFilter, minRating, sortBy, search]);

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
                                    <select value={sortBy} onChange={e => setSortBy(e.target.value as MarketplaceSearchParams['sortBy'])} style={selectStyle}>
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

// Sub-components specific to BrowseView

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
