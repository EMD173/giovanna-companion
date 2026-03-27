/**
 * ProfessionalReferral — Social Worker Distribution Page
 *
 * A clean page designed for social workers, case managers, and advocates
 * to share Giovanna with clients. Includes QR code area, share link,
 * and explanation of the app's value for ALL families.
 *
 * Route: /refer
 */

import { useState } from 'react';
import {
    Heart, Copy, CheckCircle2, Share2, Users, BookOpen,
    Shield, Brain, Sparkles, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sanctuary, typography } from '../shared/theme';
import { showToast } from '../components/Toast';

const APP_URL = 'https://giovanna-companion.web.app';

const VALUE_POINTS = [
    {
        icon: <BookOpen size={22} />,
        title: 'Behavior Logging',
        description: 'Families capture behaviors in 30 seconds with voice or text. The app identifies patterns invisible to the naked eye.',
        color: sanctuary.gold,
        bg: sanctuary.goldBg,
    },
    {
        icon: <Brain size={22} />,
        title: 'AI Companion',
        description: 'An always-available AI that understands their child\'s unique behavioral profile and provides research-backed strategies.',
        color: sanctuary.purple,
        bg: sanctuary.purpleBg,
    },
    {
        icon: <Heart size={22} />,
        title: 'The Sanctuary',
        description: 'Resources for the WHOLE family — caregiver mental health, advocacy organizations, funding sources, and community connections.',
        color: sanctuary.sage,
        bg: sanctuary.sageBg,
    },
    {
        icon: <Shield size={22} />,
        title: 'Professional Bridge',
        description: 'Turns family data into shareable reports for teachers, therapists, and doctors — empowering advocacy with evidence.',
        color: sanctuary.rose,
        bg: sanctuary.roseBg,
    },
];

const WHO_ITS_FOR = [
    'Families navigating autism, ADHD, or developmental disabilities',
    'Caregivers who may have their own neurodivergence or mental health needs',
    'Parents preparing for IEP meetings, doctor visits, or insurance appeals',
    'Families at ANY income level — from Section 8 to the suburbs',
    'Non-English-speaking families (English/Spanish supported)',
    'Families who\'ve never had access to behavioral analysis tools',
];

export function ProfessionalReferral() {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(APP_URL);
            setCopied(true);
            showToast('Link copied!', 'success');
            setTimeout(() => setCopied(false), 3000);
        } catch {
            showToast('Failed to copy — try manually', 'error');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Giovanna — Parenting with Confidence, Not Compliance',
                    text: 'A free behavioral intelligence tool for families navigating neurodivergence. Resources, AI support, and advocacy tools for the WHOLE family.',
                    url: APP_URL,
                });
            } catch {
                // User cancelled — fine
            }
        } else {
            handleCopyLink();
        }
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <div className="sanctuary-enter" style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '22px',
                        background: `linear-gradient(135deg, ${sanctuary.goldBg}, ${sanctuary.sageBg})`,
                        border: `1px solid ${sanctuary.goldBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <Share2 size={32} color={sanctuary.gold} />
                    </div>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                        color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '8px',
                    }}>
                        Share Giovanna
                    </h1>
                    <p style={{
                        fontFamily: typography.body, fontSize: '1rem',
                        color: sanctuary.textSecondary, lineHeight: 1.7,
                        maxWidth: '440px', margin: '0 auto',
                    }}>
                        A free resource you can share with any family navigating neurodivergence.
                        Designed to be walked through together.
                    </p>
                </div>

                {/* Share Actions */}
                <div className="sanctuary-enter sanctuary-enter-1" style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.goldBorder}`,
                    padding: '24px', marginBottom: '20px',
                    boxShadow: sanctuary.shadow, position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px',
                        background: `linear-gradient(90deg, transparent, ${sanctuary.gold}40, transparent)`,
                    }} />

                    <h3 style={{
                        fontFamily: typography.heading, fontSize: '1rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '16px',
                    }}>
                        🔗 Share the App
                    </h3>

                    {/* URL display */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 16px', borderRadius: '12px',
                        background: sanctuary.bgAlt, marginBottom: '12px',
                    }}>
                        <span style={{
                            flex: 1, fontFamily: 'monospace', fontSize: '0.85rem',
                            color: sanctuary.text, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {APP_URL}
                        </span>
                        <button
                            onClick={handleCopyLink}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '8px 14px', borderRadius: '10px',
                                background: copied ? sanctuary.sageBg : sanctuary.goldBg,
                                border: `1px solid ${copied ? sanctuary.sageBorder : sanctuary.goldBorder}`,
                                color: copied ? sanctuary.sage : sanctuary.gold,
                                fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                                fontFamily: typography.body, flexShrink: 0,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {copied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                        </button>
                    </div>

                    <button
                        onClick={handleShare}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '14px',
                            background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            color: '#1A1A1A', border: 'none', fontWeight: 700,
                            fontSize: '0.92rem', cursor: 'pointer', fontFamily: typography.body,
                            boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                    >
                        <Share2 size={16} /> Share with Client
                    </button>
                </div>

                {/* What the App Does */}
                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    padding: '24px', marginBottom: '20px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontSize: '1rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '16px',
                    }}>
                        What It Does
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {VALUE_POINTS.map((point, i) => (
                            <div key={i} style={{ display: 'flex', gap: '12px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '14px',
                                    background: point.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: point.color, flexShrink: 0,
                                }}>
                                    {point.icon}
                                </div>
                                <div>
                                    <p style={{
                                        fontFamily: typography.heading, fontWeight: 700,
                                        color: sanctuary.text, fontSize: '0.92rem', marginBottom: '2px',
                                    }}>{point.title}</p>
                                    <p style={{
                                        fontFamily: typography.body, fontSize: '0.82rem',
                                        color: sanctuary.textMuted, lineHeight: 1.5,
                                    }}>{point.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Who It's For */}
                <div className="sanctuary-enter sanctuary-enter-3" style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    padding: '24px', marginBottom: '20px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px',
                    }}>
                        <Users size={20} color={sanctuary.sage} />
                        <h3 style={{
                            fontFamily: typography.heading, fontSize: '1rem', fontWeight: 700,
                            color: sanctuary.text,
                        }}>
                            Who It's For — Everyone
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {WHO_ITS_FOR.map((point, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                padding: '10px 12px', borderRadius: '12px',
                                background: sanctuary.bgAlt,
                            }}>
                                <span style={{
                                    color: sanctuary.sage, fontWeight: 700, fontSize: '0.85rem',
                                    marginTop: '1px',
                                }}>✓</span>
                                <span style={{
                                    fontFamily: typography.body, fontSize: '0.85rem',
                                    color: sanctuary.textSecondary, lineHeight: 1.5,
                                }}>{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Professional Tip */}
                <div className="sanctuary-enter sanctuary-enter-4" style={{
                    padding: '18px', borderRadius: '16px',
                    background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                    marginBottom: '28px',
                }}>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.88rem',
                        color: sanctuary.gold, fontWeight: 600, lineHeight: 1.6,
                    }}>
                        <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                        <strong>Pro Tip:</strong> Sit with your client and walk through the app together
                        using the Guided Tour. The self-assessment helps them discover resources
                        personalized to their own needs — not just their child's.
                    </p>
                </div>

                {/* Try It Yourself */}
                <button
                    onClick={() => navigate('/self-assessment')}
                    className="sanctuary-enter sanctuary-enter-5"
                    style={{
                        width: '100%', padding: '16px', borderRadius: '16px',
                        background: `linear-gradient(135deg, ${sanctuary.sage}, #5A8A5E)`,
                        color: '#fff', border: 'none', fontWeight: 700,
                        fontSize: '0.95rem', cursor: 'pointer', fontFamily: typography.body,
                        boxShadow: '0 6px 20px rgba(122, 158, 126, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    }}
                >
                    <Heart size={18} /> Try the Self-Assessment <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
