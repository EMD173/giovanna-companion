/**
 * UpgradePage — Subscription Tier Selection & Checkout
 *
 * Professional paywall UI with:
 * - Tier comparison cards (Free / Companion / Pro / Enterprise)
 * - Monthly ↔ Yearly billing toggle with savings callout
 * - 7-day free trial for Companion & Pro tiers
 * - Feature comparison table
 * - Stripe Checkout integration via Cloud Function
 * - Current tier indicator + manage subscription portal link
 *
 * File: src/pages/UpgradePage.tsx
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
    type SubscriptionTier,
    TIER_INFO,
} from '../data/subscriptionTiers';
import {
    redirectToCheckout,
    openCustomerPortal,
    getYearlySavings,
    formatPrice,
} from '../lib/stripe';
import {
    sanctuary,
    typography,
    pageStyle,
    cardStyle,
    headingStyle,
    buttonStyle,
} from '../shared/theme';

// ============================================
// TYPES
// ============================================

type BillingCycle = 'monthly' | 'yearly';

interface FeatureRow {
    label: string;
    free: string;
    companion: string;
    pro: string;
    enterprise: string;
}

// ============================================
// FEATURE COMPARISON DATA
// ============================================

const FEATURE_ROWS: FeatureRow[] = [
    {
        label: 'Oracle AI Conversations',
        free: '30 / month',
        companion: '150 / month',
        pro: '500 / month',
        enterprise: 'Unlimited',
    },
    {
        label: 'Bridge Share Packets',
        free: '3 / month',
        companion: '15 / month',
        pro: 'Unlimited',
        enterprise: 'Unlimited',
    },
    {
        label: 'Child Profiles',
        free: '1',
        companion: '3',
        pro: '5',
        enterprise: 'Unlimited',
    },
    {
        label: 'Strategy Cards',
        free: '10',
        companion: 'Unlimited',
        pro: 'Unlimited',
        enterprise: 'Unlimited',
    },
    {
        label: 'EC Mode (Epigenetic Consciousness)',
        free: '✓',
        companion: '✓',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'Homeplace Supports',
        free: '—',
        companion: '✓',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'Data Export',
        free: '—',
        companion: '✓',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'Custom Reports',
        free: '—',
        companion: '—',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'Priority Support',
        free: '—',
        companion: '✓',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'Early Access Features',
        free: '—',
        companion: '—',
        pro: '✓',
        enterprise: '✓',
    },
    {
        label: 'API Access',
        free: '—',
        companion: '—',
        pro: '—',
        enterprise: '✓',
    },
    {
        label: 'Custom Branding',
        free: '—',
        companion: '—',
        pro: '—',
        enterprise: '✓',
    },
];

// ============================================
// TIER CARD COMPONENT
// ============================================

function TierCard({
    tier,
    billing,
    isCurrentTier,
    isRecommended,
    onSelect,
    loading,
}: {
    tier: SubscriptionTier;
    billing: BillingCycle;
    isCurrentTier: boolean;
    isRecommended: boolean;
    onSelect: (tier: SubscriptionTier) => void;
    loading: boolean;
}) {
    const info = TIER_INFO[tier];
    const price = billing === 'monthly' ? info.monthlyPrice : info.yearlyPrice;
    const monthlyEquivalent = billing === 'yearly' && tier !== 'free'
        ? (info.yearlyPrice / 12).toFixed(2)
        : null;
    const savings = billing === 'yearly' ? getYearlySavings(tier) : 0;
    const hasTrial = tier === 'companion' || tier === 'pro';

    const accentColor = tier === 'companion'
        ? sanctuary.sage
        : tier === 'pro'
            ? sanctuary.purple
            : tier === 'enterprise'
                ? sanctuary.gold
                : sanctuary.textMuted;

    const accentBg = tier === 'companion'
        ? sanctuary.sageBg
        : tier === 'pro'
            ? sanctuary.purpleBg
            : tier === 'enterprise'
                ? sanctuary.goldBg
                : 'transparent';

    const cardBorder = isRecommended
        ? `2px solid ${accentColor}`
        : `1px solid ${sanctuary.border}`;

    return (
        <div
            style={{
                ...cardStyle(),
                border: cardBorder,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '420px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = sanctuary.shadowLg;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = sanctuary.shadow;
            }}
        >
            {/* Badge */}
            {info.badge && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: accentColor,
                        color: '#FFFFFF',
                        padding: '4px 16px',
                        borderRadius: '100px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        fontFamily: typography.body,
                    }}
                >
                    {info.badge}
                </div>
            )}

            {/* Tier Name */}
            <h3
                style={{
                    ...headingStyle,
                    fontSize: '1.3rem',
                    color: accentColor,
                    marginBottom: '8px',
                    marginTop: info.badge ? '8px' : '0',
                }}
            >
                {info.name}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontFamily: typography.body,
                    color: sanctuary.textSecondary,
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                    minHeight: '42px',
                }}
            >
                {info.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: '20px' }}>
                {tier === 'free' ? (
                    <div style={{ ...headingStyle, fontSize: '2.2rem' }}>Free</div>
                ) : tier === 'enterprise' ? (
                    <div>
                        <div style={{ ...headingStyle, fontSize: '2.2rem' }}>
                            {formatPrice(price)}
                        </div>
                        <span
                            style={{
                                fontFamily: typography.body,
                                color: sanctuary.textMuted,
                                fontSize: '0.82rem',
                            }}
                        >
                            / {billing === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <span style={{ ...headingStyle, fontSize: '2.2rem' }}>
                                {billing === 'yearly' && monthlyEquivalent
                                    ? `$${monthlyEquivalent}`
                                    : formatPrice(price)}
                            </span>
                            <span
                                style={{
                                    fontFamily: typography.body,
                                    color: sanctuary.textMuted,
                                    fontSize: '0.82rem',
                                }}
                            >
                                / month
                            </span>
                        </div>
                        {billing === 'yearly' && savings > 0 && (
                            <div
                                style={{
                                    fontFamily: typography.body,
                                    fontSize: '0.78rem',
                                    color: sanctuary.sage,
                                    fontWeight: 600,
                                    marginTop: '4px',
                                }}
                            >
                                Save {formatPrice(savings)} / year
                            </div>
                        )}
                        {billing === 'yearly' && (
                            <div
                                style={{
                                    fontFamily: typography.body,
                                    fontSize: '0.75rem',
                                    color: sanctuary.textMuted,
                                    marginTop: '2px',
                                }}
                            >
                                Billed {formatPrice(price)} annually
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Trial Badge */}
            {hasTrial && !isCurrentTier && (
                <div
                    style={{
                        background: accentBg,
                        border: `1px solid ${accentColor}20`,
                        borderRadius: '10px',
                        padding: '8px 14px',
                        marginBottom: '16px',
                        textAlign: 'center',
                    }}
                >
                    <span
                        style={{
                            fontFamily: typography.body,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: accentColor,
                        }}
                    >
                        7-day free trial included
                    </span>
                </div>
            )}

            {/* Key Features Preview */}
            <div style={{ flex: 1, marginBottom: '20px' }}>
                {getKeyFeatures(tier).map((feature, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 0',
                            fontFamily: typography.body,
                            fontSize: '0.85rem',
                            color: sanctuary.text,
                        }}
                    >
                        <span style={{ color: accentColor, fontSize: '1rem' }}>✓</span>
                        {feature}
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            {isCurrentTier ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '14px 28px',
                        borderRadius: '12px',
                        background: sanctuary.bgAlt,
                        fontFamily: typography.body,
                        fontWeight: 700,
                        color: sanctuary.textMuted,
                        fontSize: '0.95rem',
                    }}
                >
                    Current Plan
                </div>
            ) : (
                <button
                    onClick={() => onSelect(tier)}
                    disabled={loading}
                    style={{
                        ...(tier === 'free' ? buttonStyle('ghost') : buttonStyle('primary')),
                        width: '100%',
                        opacity: loading ? 0.6 : 1,
                        ...(tier === 'companion' && {
                            background: `linear-gradient(135deg, ${sanctuary.sage} 0%, ${sanctuary.sageLight} 100%)`,
                            color: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(122, 158, 126, 0.3)',
                        }),
                        ...(tier === 'pro' && {
                            background: `linear-gradient(135deg, ${sanctuary.purple} 0%, ${sanctuary.purpleLight} 100%)`,
                            color: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(107, 76, 154, 0.3)',
                        }),
                    }}
                >
                    {loading ? 'Processing...' : info.cta}
                </button>
            )}
        </div>
    );
}

// ============================================
// KEY FEATURES PER TIER (for card preview)
// ============================================

function getKeyFeatures(tier: SubscriptionTier): string[] {
    switch (tier) {
        case 'free':
            return [
                '30 Oracle AI conversations / month',
                '1 child profile',
                '3 Bridge share packets / month',
                'EC Mode access',
                'Learning Hub',
            ];
        case 'companion':
            return [
                '150 Oracle AI conversations / month',
                'Up to 3 child profiles',
                '15 Bridge share packets / month',
                'Homeplace Supports',
                'Data export',
                'Priority support',
            ];
        case 'pro':
            return [
                '500 Oracle AI conversations / month',
                'Up to 5 child profiles',
                'Unlimited Bridge share packets',
                'Custom reports',
                'Early access features',
                'Everything in Companion',
            ];
        case 'enterprise':
            return [
                'Unlimited everything',
                'API access for integrations',
                'Custom branding',
                'Dedicated support',
                'Multi-seat team accounts',
                'HIPAA-ready infrastructure',
            ];
        case 'ambassador':
        default:
            return [
                'Full platform access',
                'Unlimited AI conversations',
                'All practice modules',
                'Ambassador tools',
            ];
    }
}

// ============================================
// BILLING TOGGLE COMPONENT
// ============================================

function BillingToggle({
    billing,
    onChange,
}: {
    billing: BillingCycle;
    onChange: (cycle: BillingCycle) => void;
}) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '40px',
            }}
        >
            <span
                style={{
                    fontFamily: typography.body,
                    fontWeight: billing === 'monthly' ? 700 : 500,
                    color: billing === 'monthly' ? sanctuary.text : sanctuary.textMuted,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                }}
                onClick={() => onChange('monthly')}
            >
                Monthly
            </span>

            {/* Toggle Track */}
            <div
                onClick={() => onChange(billing === 'monthly' ? 'yearly' : 'monthly')}
                style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: billing === 'yearly'
                        ? `linear-gradient(135deg, ${sanctuary.sage}, ${sanctuary.sageLight})`
                        : sanctuary.border,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background 0.3s ease',
                }}
            >
                <div
                    style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        position: 'absolute',
                        top: '3px',
                        left: billing === 'yearly' ? '27px' : '3px',
                        transition: 'left 0.3s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                    style={{
                        fontFamily: typography.body,
                        fontWeight: billing === 'yearly' ? 700 : 500,
                        color: billing === 'yearly' ? sanctuary.text : sanctuary.textMuted,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'color 0.2s ease',
                    }}
                    onClick={() => onChange('yearly')}
                >
                    Yearly
                </span>
                <span
                    style={{
                        background: sanctuary.sageBg,
                        border: `1px solid ${sanctuary.sageBorder}`,
                        color: sanctuary.sage,
                        padding: '2px 10px',
                        borderRadius: '100px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        fontFamily: typography.body,
                    }}
                >
                    SAVE 20%
                </span>
            </div>
        </div>
    );
}

// ============================================
// FEATURE COMPARISON TABLE
// ============================================

function FeatureTable() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ marginTop: '60px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    ...buttonStyle('ghost'),
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                }}
            >
                {expanded ? 'Hide' : 'Show'} Full Feature Comparison
                <span style={{ fontSize: '0.8rem', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                </span>
            </button>

            {expanded && (
                <div
                    style={{
                        ...cardStyle(),
                        padding: '0',
                        overflow: 'hidden',
                    }}
                >
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontFamily: typography.body,
                            fontSize: '0.85rem',
                        }}
                    >
                        <thead>
                            <tr style={{ background: sanctuary.bgAlt }}>
                                <th style={thStyle}>Feature</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Free</th>
                                <th style={{ ...thStyle, textAlign: 'center', color: sanctuary.sage }}>Companion</th>
                                <th style={{ ...thStyle, textAlign: 'center', color: sanctuary.purple }}>Pro</th>
                                <th style={{ ...thStyle, textAlign: 'center', color: sanctuary.gold }}>Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FEATURE_ROWS.map((row, i) => (
                                <tr
                                    key={i}
                                    style={{
                                        borderBottom: `1px solid ${sanctuary.borderLight}`,
                                        background: i % 2 === 0 ? 'transparent' : sanctuary.bgAlt + '40',
                                    }}
                                >
                                    <td style={tdStyle}>{row.label}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>{renderCell(row.free)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>{renderCell(row.companion)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>{renderCell(row.pro)}</td>
                                    <td style={{ ...tdStyle, textAlign: 'center' }}>{renderCell(row.enterprise)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 700,
    fontSize: '0.82rem',
    color: sanctuary.text,
    borderBottom: `2px solid ${sanctuary.border}`,
};

const tdStyle: React.CSSProperties = {
    padding: '12px 16px',
    color: sanctuary.textSecondary,
};

function renderCell(value: string) {
    if (value === '✓') {
        return <span style={{ color: sanctuary.sage, fontWeight: 700, fontSize: '1.1rem' }}>✓</span>;
    }
    if (value === '—') {
        return <span style={{ color: sanctuary.textMuted }}>—</span>;
    }
    return <span style={{ fontWeight: 500 }}>{value}</span>;
}

// ============================================
// MAIN UPGRADE PAGE
// ============================================

export function UpgradePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { tier: currentTier } = useSubscription();
    const [billing, setBilling] = useState<BillingCycle>('yearly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Detect if user just upgraded (URL param)
    const params = new URLSearchParams(window.location.search);
    const upgradeStatus = params.get('upgrade');

    const handleSelectTier = async (selectedTier: SubscriptionTier) => {
        if (!user) {
            navigate('/signup');
            return;
        }

        // If selecting free while on paid, open Stripe portal to cancel
        if (selectedTier === 'free' && currentTier !== 'free') {
            try {
                setLoading(true);
                const portalUrl = await openCustomerPortal(user.uid);
                window.location.href = portalUrl;
            } catch (err) {
                setError('Unable to open subscription management. Please try again.');
                setLoading(false);
            }
            return;
        }

        // Enterprise — contact sales
        if (selectedTier === 'enterprise') {
            window.location.href = 'mailto:support@giovanna.app?subject=Enterprise%20Inquiry&body=I%20am%20interested%20in%20the%20Enterprise%20plan%20for%20my%20organization.';
            return;
        }

        // Companion or Pro — redirect to Stripe Checkout
        try {
            setLoading(true);
            setError(null);
            await redirectToCheckout({
                tier: selectedTier,
                billing,
                userId: user.uid,
                userEmail: user.email || '',
                successUrl: `${window.location.origin}/upgrade?upgrade=success`,
                cancelUrl: `${window.location.origin}/upgrade?upgrade=cancelled`,
            });
        } catch (err) {
            console.error('Checkout redirect failed:', err);
            setError('Unable to start checkout. Please try again.');
            setLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const portalUrl = await openCustomerPortal(user.uid);
            window.location.href = portalUrl;
        } catch (err) {
            setError('Unable to open subscription portal. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{ ...pageStyle, padding: '24px 20px 80px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Success / Cancel Banner */}
                {upgradeStatus === 'success' && (
                    <div
                        style={{
                            background: sanctuary.sageBg,
                            border: `1px solid ${sanctuary.sageBorder}`,
                            borderRadius: '14px',
                            padding: '16px 24px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <span style={{ fontSize: '1.3rem' }}>✓</span>
                        <div>
                            <div
                                style={{
                                    fontFamily: typography.body,
                                    fontWeight: 700,
                                    color: sanctuary.sage,
                                    fontSize: '0.95rem',
                                }}
                            >
                                Welcome to your upgraded experience
                            </div>
                            <div
                                style={{
                                    fontFamily: typography.body,
                                    color: sanctuary.textSecondary,
                                    fontSize: '0.85rem',
                                    marginTop: '2px',
                                }}
                            >
                                Your subscription is now active. All premium features are unlocked.
                            </div>
                        </div>
                    </div>
                )}

                {upgradeStatus === 'cancelled' && (
                    <div
                        style={{
                            background: sanctuary.goldBg,
                            border: `1px solid ${sanctuary.goldBorder}`,
                            borderRadius: '14px',
                            padding: '16px 24px',
                            marginBottom: '24px',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: typography.body,
                                color: sanctuary.gold,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                            }}
                        >
                            No changes made. You can upgrade anytime.
                        </div>
                    </div>
                )}

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1
                        style={{
                            ...headingStyle,
                            fontSize: '2rem',
                            marginBottom: '12px',
                        }}
                    >
                        Choose Your Path
                    </h1>
                    <p
                        style={{
                            fontFamily: typography.body,
                            color: sanctuary.textSecondary,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        Every family deserves neuro-affirming support. Start free, and upgrade
                        when you're ready for deeper partnership.
                    </p>
                    {currentTier !== 'free' && (
                        <button
                            onClick={handleManageSubscription}
                            disabled={loading}
                            style={{
                                ...buttonStyle('ghost'),
                                marginTop: '16px',
                                fontSize: '0.85rem',
                            }}
                        >
                            Manage Current Subscription
                        </button>
                    )}
                </div>

                {/* Error Banner */}
                {error && (
                    <div
                        style={{
                            background: sanctuary.roseBg,
                            border: `1px solid ${sanctuary.roseBorder}`,
                            borderRadius: '12px',
                            padding: '12px 20px',
                            marginBottom: '24px',
                            textAlign: 'center',
                            fontFamily: typography.body,
                            color: sanctuary.rose,
                            fontSize: '0.9rem',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Billing Toggle */}
                <BillingToggle billing={billing} onChange={setBilling} />

                {/* Tier Cards Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '24px',
                        marginBottom: '24px',
                    }}
                >
                    {(['free', 'companion', 'pro', 'enterprise'] as SubscriptionTier[]).map(
                        (tier) => (
                            <TierCard
                                key={tier}
                                tier={tier}
                                billing={billing}
                                isCurrentTier={tier === currentTier}
                                isRecommended={tier === 'companion'}
                                onSelect={handleSelectTier}
                                loading={loading}
                            />
                        )
                    )}
                </div>

                {/* Trust Signals */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '32px',
                        flexWrap: 'wrap',
                        marginTop: '32px',
                        marginBottom: '20px',
                    }}
                >
                    {[
                        { icon: '🔒', text: 'Secure checkout via Stripe' },
                        { icon: '↩️', text: 'Cancel anytime, no penalties' },
                        { icon: '🛡️', text: '7-day free trial on paid plans' },
                    ].map((signal, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontFamily: typography.body,
                                fontSize: '0.82rem',
                                color: sanctuary.textMuted,
                            }}
                        >
                            <span>{signal.icon}</span>
                            {signal.text}
                        </div>
                    ))}
                </div>

                {/* Feature Comparison Table */}
                <FeatureTable />

                {/* Mission Statement */}
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '60px',
                        padding: '32px 24px',
                        background: sanctuary.goldBg,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.goldBorder}`,
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <h3
                        style={{
                            ...headingStyle,
                            fontSize: '1.2rem',
                            color: sanctuary.gold,
                            marginBottom: '12px',
                        }}
                    >
                        Why We Charge
                    </h3>
                    <p
                        style={{
                            fontFamily: typography.body,
                            color: sanctuary.textSecondary,
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                        }}
                    >
                        Giovanna is built for families who have been underserved, misdiagnosed,
                        and overlooked by the disability system — especially Black and Brown families.
                        Your subscription funds the AI infrastructure, scholarly research integration,
                        and ongoing development that keeps this tool alive and evolving. EC Mode
                        and core features remain free because every family deserves access.
                        Paid tiers exist so we can sustain the depth of support your family needs.
                    </p>
                </div>

                {/* Back to Dashboard */}
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            ...buttonStyle('ghost'),
                            fontSize: '0.85rem',
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
