import { HeartPulse, Sparkles, ExternalLink, Shield } from 'lucide-react';
import { SensoryDietTracker } from '../components/regulation/SensoryDietTracker';
import { ParentCheckIn } from '../components/regulation/ParentCheckIn';
import { useFamily } from '../contexts/FamilyContext';
import { sanctuary, typography } from '../shared/theme';

export function HomeplacePage() {
    const { activeChild: child } = useFamily();

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontFamily: typography.heading,
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        letterSpacing: '-0.02em',
                        marginBottom: '6px',
                    }}>The Homeplace</h1>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '1rem',
                        fontFamily: typography.body,
                    }}>
                        A safe harbor for regulation, sensory joy, and unconditional belonging.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

                    {/* Parent Co-Regulation Card */}
                    <section className="sanctuary-enter sanctuary-enter-1 sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            color: sanctuary.text,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.rose,
                            }}><HeartPulse size={18} /></div>
                            Parent Co-Regulation
                        </h2>
                        <ParentCheckIn />
                    </section>

                    {/* Safety & Advocacy Card */}
                    <section className="sanctuary-enter sanctuary-enter-2 sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.roseBorder}`,
                        padding: '24px',
                        boxShadow: sanctuary.shadow,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.rose}30, transparent)`,
                        }} />
                        <h3 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: sanctuary.text,
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.rose,
                            }}><Shield size={18} /></div>
                            Safety & Advocacy
                        </h3>
                        <p style={{
                            color: sanctuary.textSecondary,
                            fontSize: '0.9rem',
                            fontFamily: typography.body,
                            lineHeight: 1.6,
                            marginBottom: '16px',
                        }}>
                            Your child's safety is about more than childproofing. It's about preparing the world for them.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[
                                { href: '/resources/stigma', label: 'Using ID Cards' },
                                { href: '/resources/safety', label: 'Police Interaction Guide' },
                            ].map(link => (
                                <a key={link.href} href={link.href} style={{
                                    color: sanctuary.rose,
                                    fontWeight: 600,
                                    fontSize: '0.88rem',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    <ExternalLink size={14} /> {link.label}
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Sensory Joy Card */}
                    <section className="sanctuary-enter sanctuary-enter-3 sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1.15rem',
                            color: sanctuary.text,
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '10px',
                                background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.gold,
                            }}><Sparkles size={18} /></div>
                            {child ? `${child.firstName}'s Sensory Joy` : 'Sensory Joy'}
                        </h2>
                        {child ? (
                            <SensoryDietTracker />
                        ) : (
                            <div style={{
                                background: sanctuary.bgAlt,
                                border: `1px dashed ${sanctuary.border}`,
                                borderRadius: '12px',
                                padding: '32px',
                                textAlign: 'center',
                            }}>
                                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>
                                    Select a child profile to track their sensory wins.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Info Card */}
                    <section className="sanctuary-enter sanctuary-enter-4 sanctuary-card" style={{
                        background: sanctuary.purpleBg,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.purpleBorder}`,
                        padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h3 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: sanctuary.purple,
                            marginBottom: '8px',
                        }}>What is a Sensory Diet?</h3>
                        <p style={{
                            color: sanctuary.textSecondary,
                            fontSize: '0.9rem',
                            fontFamily: typography.body,
                            lineHeight: 1.7,
                        }}>
                            It's not about food. It's a menu of sensory activities (movement, pressure, quiet) 
                            that helps a neurodivergent nervous system feel "just right."
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
