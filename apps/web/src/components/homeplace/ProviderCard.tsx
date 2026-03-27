import { Award, MapPin, Star } from 'lucide-react';
import type { ProviderWithDistance } from '../../data/respiteMarketplace';
import { SPECIALTY_LABELS, CREDENTIAL_LABELS, formatRateRange, formatDistance } from '../../data/respiteMarketplace';
import { sanctuary, typography } from '../../shared/theme';
import { tagStyle } from './SharedHomeplaceStyles';

export function ProviderCard({ provider, index, onClick }: {
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
