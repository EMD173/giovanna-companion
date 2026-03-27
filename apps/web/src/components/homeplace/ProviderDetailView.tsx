import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Star, Heart, Shield, DollarSign, Calendar, Users,
    Navigation, Plus, Phone, Mail, Globe, Award, MapPin, Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProviderReviews } from '../../hooks/useRespiteProviders';
import type { RespiteProvider, ProviderReview, DayOfWeek } from '../../data/respiteMarketplace';
import {
    SPECIALTY_LABELS, CREDENTIAL_LABELS, SERVICE_TYPE_LABELS,
    AGE_RANGE_LABELS, DAY_LABELS, formatRateRange,
    DEMO_PROVIDERS, DEMO_PROVIDER_REVIEWS
} from '../../data/respiteMarketplace';
import { sanctuary, typography } from '../../shared/theme';
import { tagStyle, backBtnStyle, contactBtnStyle, filterLabelStyle } from './SharedHomeplaceStyles';

export function ProviderDetailView({ providerId }: { providerId: string }) {
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
                const { db: fireDb } = await import('../../lib/firebase');
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
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit review.';
            alert(message);
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

// Sub-components only used in Detail View

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
