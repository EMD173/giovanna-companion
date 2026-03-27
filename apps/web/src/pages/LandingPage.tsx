/**
 * Landing Page — Afrofuturist Sanctuary
 *
 * Dark immersive hero with aurora glow, floating gold particles,
 * glass morphism feature cards, and cinematic CTA.
 *
 * Overhauled to showcase the three pillars:
 *   1. Parent as Practitioner — Learn the science behind your child's behavior
 *   2. Educator & Paraprofessional Training — Scenario-based PD with credits
 *   3. Respite Care Homeplace — Find trusted providers who become your village
 *
 * Plus: Pricing tiers, testimonial strip, and a narrative grounded in the
 * Epigenetic Consciousness framework.
 */

import {
    ArrowRight, Sparkles, GraduationCap, Users,
    BookOpen, MessageCircle, Shield, Star, Heart, Check,
    ChevronRight, Award, Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useI18n, type Locale } from '../lib/i18n';

// ============================================
// PARTICLES (unchanged from original)
// ============================================

function Particles({ count = 20 }: { count?: number }) {
    const particles = React.useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${(i * 37 + 13) % 100}%`,
            bottom: `-${(i * 23 + 7) % 20}px`,
            duration: `${8 + (i * 3.7) % 12}s`,
            delay: `${(i * 1.3) % 8}s`,
            size: `${2 + (i * 0.7) % 3}px`,
        })), [count]
    );

    return (
        <div className="landing-particles">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="landing-particle"
                    style={{
                        left: p.left,
                        bottom: p.bottom,
                        width: p.size,
                        height: p.size,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}

// ============================================
// LANDING PAGE
// ============================================

export function LandingPage() {
    const navigate = useNavigate();
    const { t, locale, setLocale } = useI18n();

    const toggleLang = () => setLocale(locale === 'en' ? 'es' : 'en' as Locale);

    const handleTryDemo = () => {
        localStorage.setItem('DEMO_MODE', 'true');
        navigate('/dashboard');
    };
    return (
        <div className="landing-page">
            {/* ======== RESPONSIVE NAV ======== */}
            <nav className="landing-nav-container">
                <Link to="/" style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.5rem',
                    color: '#F5F0E8', textDecoration: 'none', letterSpacing: '0.02em',
                }}>
                    Giovanna
                </Link>
                <div className="landing-nav-actions">
                    <button onClick={toggleLang} className="landing-nav-lang" style={{
                        color: 'rgba(245, 240, 232, 0.6)', fontSize: '0.82rem',
                        fontWeight: 600, fontFamily: 'var(--font-body)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px', padding: '6px 12px',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        letterSpacing: '0.04em',
                    }}>
                        {locale === 'en' ? '🌐 ES' : '🌐 EN'}
                    </button>
                    <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="landing-nav-pricing" style={{
                        color: 'rgba(245, 240, 232, 0.6)', textDecoration: 'none',
                        fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-body)',
                        transition: 'color 0.2s ease', background: 'none', border: 'none',
                        cursor: 'pointer',
                    }}>
                        {t('landing.pricing')}
                    </button>
                    <Link to="/signup" className="landing-cta-ghost landing-nav-btn" style={{
                        padding: '10px 28px', fontSize: '0.9rem',
                    }}>
                        {t('landing.signIn')}
                    </Link>
                </div>
            </nav>

            {/* ======== HERO ======== */}
            <section className="landing-hero">
                <Particles count={24} />

                {/* Reality Statement Badge */}
                <div className="landing-badge landing-fade-up">
                    <Sparkles size={14} style={{ color: '#D4AF37' }} />
                    {t('landing.badge')}
                </div>

                {/* The Reality Statement — Headline */}
                <h1 className="landing-headline landing-fade-up landing-fade-up-delay-1">
                    {t('landing.headline1')}<br />
                    <span className="landing-text-gold">{t('landing.headline2')}</span>
                </h1>

                {/* Subheadline */}
                <p className="landing-subheadline landing-fade-up landing-fade-up-delay-2">
                    {t('landing.subheadline')}
                </p>

                {/* CTAs */}
                <div className="landing-fade-up landing-fade-up-delay-3" style={{
                    display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center',
                }}>
                    <Link to="/signup" className="landing-cta-primary">
                        {t('landing.beginJourney')}
                        <ArrowRight size={20} />
                    </Link>
                    <button onClick={handleTryDemo} className="landing-cta-ghost" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        color: '#E8C97A',
                    }}>
                        <Play size={16} fill="#E8C97A" />
                        {t('landing.tryDemo')}
                    </button>
                </div>

                {/* Trust Line */}
                <p className="landing-fade-up landing-fade-up-delay-4" style={{
                    color: 'rgba(245, 240, 232, 0.3)', fontSize: '0.82rem',
                    fontFamily: 'var(--font-body)', marginTop: '2.5rem',
                    letterSpacing: '0.04em',
                }}>
                    {t('landing.freeToStart')}
                </p>
            </section>

            {/* ======== PHILOSOPHY ======== */}
            <section className="landing-philosophy">
                <blockquote>
                    "{t('landing.philosophy1')}<br />
                    {t('landing.philosophy2')}<br />
                    {t('landing.philosophy3')} <em>{t('landing.philosophy3em')}</em> {t('landing.philosophy3end')}"
                </blockquote>
            </section>

            {/* ======== THREE PILLARS ======== */}
            <section id="pillars" className="landing-features">
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 className="landing-section-title">{t('landing.pillarsTitle')}</h2>
                    <p className="landing-section-sub">
                        {t('landing.pillarsSub')}
                    </p>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '28px',
                    }}>
                        {/* Pillar 1 — Parent as Practitioner */}
                        <div className="landing-glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="landing-icon-wrap landing-icon-purple">
                                <GraduationCap size={26} color="#F5F0E8" />
                            </div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 12px', borderRadius: '8px',
                                background: 'rgba(107, 76, 154, 0.15)', border: '1px solid rgba(107, 76, 154, 0.3)',
                                color: '#8B6CB8', fontSize: '0.72rem', fontWeight: 800,
                                fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
                                marginBottom: '1rem', width: 'fit-content',
                            }}>
                                PILLAR 1
                            </div>
                            <h3 className="landing-card-title" style={{ fontSize: '1.4rem' }}>
                                {t('landing.pillar1Title')}
                            </h3>
                            <p className="landing-card-text" style={{ flex: 1 }}>
                                {t('landing.pillar1Text')}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                                <PillarFeature text={t('landing.pillar1f1')} />
                                <PillarFeature text={t('landing.pillar1f2')} />
                                <PillarFeature text={t('landing.pillar1f3')} />
                            </div>
                            <Link to="/signup" className="landing-card-link">
                                {t('landing.pillar1cta')} <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Pillar 2 — Educator Training */}
                        <div className="landing-glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="landing-icon-wrap landing-icon-gold">
                                <BookOpen size={26} color="#1A0A2E" />
                            </div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 12px', borderRadius: '8px',
                                background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)',
                                color: '#E8C97A', fontSize: '0.72rem', fontWeight: 800,
                                fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
                                marginBottom: '1rem', width: 'fit-content',
                            }}>
                                PILLAR 2
                            </div>
                            <h3 className="landing-card-title" style={{ fontSize: '1.4rem' }}>
                                {t('landing.pillar2Title')}
                            </h3>
                            <p className="landing-card-text" style={{ flex: 1 }}>
                                {t('landing.pillar2Text')}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                                <PillarFeature text={t('landing.pillar2f1')} />
                                <PillarFeature text={t('landing.pillar2f2')} />
                                <PillarFeature text={t('landing.pillar2f3')} />
                            </div>
                            <Link to="/signup" className="landing-card-link">
                                {t('landing.pillar2cta')} <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Pillar 3 — Respite Care Homeplace */}
                        <div className="landing-glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="landing-icon-wrap landing-icon-rose">
                                <Heart size={26} color="#F5F0E8" />
                            </div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 12px', borderRadius: '8px',
                                background: 'rgba(184, 84, 80, 0.15)', border: '1px solid rgba(184, 84, 80, 0.3)',
                                color: '#D4837F', fontSize: '0.72rem', fontWeight: 800,
                                fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
                                marginBottom: '1rem', width: 'fit-content',
                            }}>
                                PILLAR 3
                            </div>
                            <h3 className="landing-card-title" style={{ fontSize: '1.4rem' }}>
                                {t('landing.pillar3Title')}
                            </h3>
                            <p className="landing-card-text" style={{ flex: 1 }}>
                                {t('landing.pillar3Text')}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                                <PillarFeature text={t('landing.pillar3f1')} />
                                <PillarFeature text={t('landing.pillar3f2')} />
                                <PillarFeature text={t('landing.pillar3f3')} />
                            </div>
                            <Link to="/signup" className="landing-card-link">
                                {t('landing.pillar3cta')} <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== CORE TOOLS (condensed) ======== */}
            <section style={{
                padding: '5rem 1.5rem', background: '#0A0A0A',
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 className="landing-section-title" style={{ marginBottom: '1rem' }}>
                        {t('landing.toolkitTitle')}
                    </h2>
                    <p className="landing-section-sub">
                        {t('landing.toolkitSub')}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px',
                    }}>
                        <ToolCard icon={<MessageCircle size={22} color="#D4AF37" />}
                            title={t('landing.tool.insight')}
                            text={t('landing.tool.insightDesc')} />
                        <ToolCard icon={<BookOpen size={22} color="#8B6CB8" />}
                            title={t('landing.tool.capture')}
                            text={t('landing.tool.captureDesc')} />
                        <ToolCard icon={<Shield size={22} color="#7A9E7E" />}
                            title={t('landing.tool.bridge')}
                            text={t('landing.tool.bridgeDesc')} />
                        <ToolCard icon={<Users size={22} color="#D4837F" />}
                            title={t('landing.tool.village')}
                            text={t('landing.tool.villageDesc')} />
                        <ToolCard icon={<Star size={22} color="#E8C97A" />}
                            title={t('landing.tool.ec')}
                            text={t('landing.tool.ecDesc')} />
                        <ToolCard icon={<Heart size={22} color="#B85450" />}
                            title={t('landing.tool.homeplace')}
                            text={t('landing.tool.homeplaceDesc')} />
                    </div>
                </div>
            </section>

            {/* ======== SOCIAL PROOF / GROUNDING ======== */}
            <section style={{
                padding: '5rem 1.5rem',
                background: 'linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginBottom: '2rem',
                    }}>
                        <Award size={20} color="#D4AF37" />
                        <span style={{
                            color: 'rgba(245, 240, 232, 0.5)', fontSize: '0.82rem',
                            fontFamily: 'var(--font-body)', fontWeight: 600,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                            {t('landing.researchBadge')}
                        </span>
                    </div>
                    <h2 className="landing-section-title" style={{ marginBottom: '1.5rem' }}>
                        {t('landing.notJust')}
                    </h2>
                    <p style={{
                        color: 'rgba(245, 240, 232, 0.5)', fontSize: '1.05rem',
                        fontFamily: 'var(--font-body)', lineHeight: 1.8,
                        marginBottom: '3rem',
                    }}>
                        {t('landing.notJustSub')}
                    </p>

                    {/* Scholar badges — universal descriptions of what the research DOES */}
                    <div style={{
                        display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
                    }}>
                        {[
                            'Functional Communication',
                            'Nervous System Science',
                            'Responsive Teaching',
                            'Intergenerational Healing',
                            'Somatic Intelligence',
                            'Behavioral Epigenetics',
                            'Presumed Competence',
                            'Neurodiversity-Affirming',
                            'Whole-Child Consciousness',
                        ].map(scholar => (
                            <span key={scholar} style={{
                                padding: '7px 16px', borderRadius: '100px',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                color: 'rgba(245, 240, 232, 0.5)',
                                fontSize: '0.78rem', fontWeight: 600,
                                fontFamily: 'var(--font-body)',
                            }}>
                                {scholar}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== PRICING ======== */}
            <section id="pricing" style={{
                padding: '6rem 1.5rem',
                background: 'linear-gradient(180deg, #0D0D0D 0%, #1A0A2E 50%, #0D0D0D 100%)',
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <h2 className="landing-section-title">{t('landing.pricingTitle')}</h2>
                    <p className="landing-section-sub">
                        {t('landing.pricingSub')}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px', alignItems: 'stretch',
                    }}>
                        {/* Free */}
                        <PricingCard
                            name="Free"
                            price="$0"
                            period="forever"
                            description="Get started with neuro-affirming support."
                            features={[
                                '30 Insight conversations/mo',
                                '1 child profile',
                                'ABC behavior logging',
                                'EC Mode access',
                                '2 Practice modules',
                                'Homeplace Care search',
                            ]}
                            cta="Get Started Free"
                            ctaLink="/signup"
                        />

                        {/* Companion */}
                        <PricingCard
                            name="Companion"
                            price="$7.99"
                            period="/month"
                            description="More support for growing families."
                            badge="BEST VALUE"
                            features={[
                                '150 Insight conversations/mo',
                                '3 child profiles',
                                'Professional share packets',
                                'Homeplace sanctuary tools',
                                '4 Practice modules',
                                'Priority support',
                            ]}
                            cta="Start Free Trial"
                            ctaLink="/signup"
                            highlighted
                        />

                        {/* Pro */}
                        <PricingCard
                            name="Pro"
                            price="$14.99"
                            period="/month"
                            description="Unlimited sharing + educator training."
                            badge="POPULAR"
                            features={[
                                '500 Insight conversations/mo',
                                '5 child profiles',
                                'Unlimited share packets',
                                'All 6 Practice modules',
                                'Educator PD training',
                                'Custom reports & early features',
                            ]}
                            cta="Go Pro"
                            ctaLink="/signup"
                        />

                        {/* Enterprise */}
                        <PricingCard
                            name="Enterprise"
                            price="$99"
                            period="/month"
                            description="For schools, clinics, and therapy practices."
                            badge="TEAMS"
                            features={[
                                'Unlimited everything',
                                'Unlimited child profiles',
                                'API access & custom branding',
                                'Full educator PD platform',
                                'District-wide deployment',
                                'Dedicated support',
                            ]}
                            cta="Contact Sales"
                            ctaLink="/signup"
                        />
                    </div>
                </div>
            </section>

            {/* ======== FINAL CTA ======== */}
            <section className="landing-final-cta">
                <div className="landing-final-panel">
                    <Sparkles size={36} style={{
                        color: '#D4AF37', margin: '0 auto 1.5rem', display: 'block',
                        position: 'relative', zIndex: 1,
                    }} />
                    <h2 className="landing-section-title" style={{ marginBottom: '1rem' }}>
                        {t('landing.finalTitle')}
                    </h2>
                    <p style={{
                        color: 'rgba(245, 240, 232, 0.5)', fontSize: '1.1rem',
                        marginBottom: '2.5rem', lineHeight: '1.7', position: 'relative', zIndex: 1,
                        maxWidth: '580px', margin: '0 auto 2.5rem',
                    }}>
                        {t('landing.finalText')}
                    </p>
                    <Link to="/signup" className="landing-cta-primary" style={{
                        position: 'relative', zIndex: 1,
                    }}>
                        {t('landing.beginFree')} <ArrowRight size={20} />
                    </Link>
                    <p style={{
                        marginTop: '1.25rem', color: 'rgba(245, 240, 232, 0.35)',
                        fontSize: '0.85rem', position: 'relative', zIndex: 1,
                    }}>
                        {t('landing.noCreditCard')}
                    </p>
                </div>
            </section>

            {/* ======== FOOTER ======== */}
            <footer style={{
                padding: '3rem 1.5rem 2rem',
                background: '#0D0D0D',
                borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                textAlign: 'center',
            }}>
                <p style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem',
                    color: '#F5F0E8', marginBottom: '0.75rem',
                }}>
                    Giovanna
                </p>
                <p style={{
                    color: 'rgba(245, 240, 232, 0.3)', fontSize: '0.82rem',
                    fontFamily: 'var(--font-body)', lineHeight: 1.7,
                }}>
                    {t('landing.footerTagline')}
                </p>
                <p style={{
                    color: 'rgba(245, 240, 232, 0.2)', fontSize: '0.75rem',
                    fontFamily: 'var(--font-body)', marginTop: '1rem',
                }}>
                    &copy; {new Date().getFullYear()} Giovanna Companion. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PillarFeature({ text }: { text: string }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
        }}>
            <Check size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
            <span style={{
                color: 'rgba(245, 240, 232, 0.55)', fontSize: '0.85rem',
                fontFamily: 'var(--font-body)', lineHeight: 1.5,
            }}>
                {text}
            </span>
        </div>
    );
}

function ToolCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px', padding: '24px',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ marginBottom: '12px' }}>{icon}</div>
            <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 700,
                color: '#F5F0E8', marginBottom: '6px',
            }}>
                {title}
            </h3>
            <p style={{
                color: 'rgba(245, 240, 232, 0.45)', fontSize: '0.88rem',
                fontFamily: 'var(--font-body)', lineHeight: 1.6,
            }}>
                {text}
            </p>
        </div>
    );
}

function PricingCard({
    name, price, period, description, features, cta, ctaLink,
    badge, highlighted,
}: {
    name: string; price: string; period: string; description: string;
    features: string[]; cta: string; ctaLink: string;
    badge?: string; highlighted?: boolean;
}) {
    return (
        <div style={{
            background: highlighted
                ? 'linear-gradient(170deg, rgba(107, 76, 154, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${highlighted ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
            borderRadius: '20px', padding: '32px 28px',
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.3s ease',
        }}>
            {/* Highlight accent */}
            {highlighted && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, #D4AF37, #6B4C9A, #D4AF37, transparent)',
                }} />
            )}

            {/* Badge */}
            {badge && (
                <span style={{
                    display: 'inline-flex', padding: '4px 12px', borderRadius: '8px',
                    background: highlighted ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    border: `1px solid ${highlighted ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: highlighted ? '#E8C97A' : 'rgba(245, 240, 232, 0.5)',
                    fontSize: '0.68rem', fontWeight: 800, fontFamily: 'var(--font-body)',
                    letterSpacing: '0.08em', width: 'fit-content', marginBottom: '16px',
                }}>
                    {badge}
                </span>
            )}

            {/* Tier Name */}
            <h3 style={{
                fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700,
                color: '#F5F0E8', marginBottom: '4px',
            }}>
                {name}
            </h3>

            {/* Price */}
            <div style={{ marginBottom: '8px' }}>
                <span style={{
                    fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700,
                    color: highlighted ? '#E8C97A' : '#F5F0E8',
                }}>
                    {price}
                </span>
                <span style={{
                    color: 'rgba(245, 240, 232, 0.4)', fontSize: '0.9rem',
                    fontFamily: 'var(--font-body)',
                }}>
                    {period}
                </span>
            </div>

            {/* Description */}
            <p style={{
                color: 'rgba(245, 240, 232, 0.45)', fontSize: '0.88rem',
                fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: '24px',
            }}>
                {description}
            </p>

            {/* Features */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={14} style={{
                            color: highlighted ? '#D4AF37' : 'rgba(122, 158, 126, 0.7)',
                            flexShrink: 0,
                        }} />
                        <span style={{
                            color: 'rgba(245, 240, 232, 0.55)', fontSize: '0.85rem',
                            fontFamily: 'var(--font-body)',
                        }}>
                            {f}
                        </span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Link to={ctaLink} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '14px 24px', borderRadius: '14px',
                background: highlighted
                    ? 'linear-gradient(135deg, #D4AF37, #E8C97A)'
                    : 'rgba(255, 255, 255, 0.06)',
                color: highlighted ? '#1A0A2E' : 'rgba(245, 240, 232, 0.7)',
                border: highlighted ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.92rem', fontWeight: 700, fontFamily: 'var(--font-body)',
                textDecoration: 'none', transition: 'all 0.3s ease',
                boxShadow: highlighted ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
            }}>
                {cta} <ChevronRight size={16} />
            </Link>
        </div>
    );
}
