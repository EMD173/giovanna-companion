/**
 * OnboardingWalkthrough — Post-Signup Tutorial
 *
 * 4-step tooltip walkthrough that introduces the core loop:
 * Capture → Oracle → Sanctuary → Bridge
 *
 * Triggers on first Dashboard visit. Persisted to localStorage.
 * "Skip tour" always available — never trap a stressed parent.
 */

import { useState, useEffect } from 'react';
import { Bookmark, MessageCircle, Heart, FileText, X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useAnalytics } from '../hooks/useAnalytics';

const WALKTHROUGH_KEY = 'giovanna_walkthrough_completed';

interface WalkthroughStep {
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
    tip: string;
}

const STEPS: WalkthroughStep[] = [
    {
        icon: <Bookmark size={28} />,
        iconColor: sanctuary.gold,
        iconBg: sanctuary.goldBg,
        title: 'Capture',
        description: 'Document moments with voice or text. Each log teaches the Oracle about your child.',
        tip: 'Voice input means you can log in 30 seconds — even mid-meltdown.',
    },
    {
        icon: <MessageCircle size={28} />,
        iconColor: sanctuary.purple,
        iconBg: sanctuary.purpleBg,
        title: 'The Oracle',
        description: 'Your AI companion. The more you log, the smarter it gets at understanding your child.',
        tip: 'Ask it "What patterns do you see?" after logging a few moments.',
    },
    {
        icon: <Heart size={28} />,
        iconColor: sanctuary.sage,
        iconBg: sanctuary.sageBg,
        title: 'Sanctuary',
        description: 'Safe spaces and calming tools. When crisis hits, this is your command center.',
        tip: 'Your child\'s calming strategies are pulled from their profile automatically.',
    },
    {
        icon: <FileText size={28} />,
        iconColor: sanctuary.rose,
        iconBg: sanctuary.roseBg,
        title: 'The Bridge',
        description: 'Turn your data into advocacy. Share packets for teachers, therapists, and doctors.',
        tip: 'After 5 logs, you have enough data for your first powerful share packet.',
    },
];

export function OnboardingWalkthrough() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { trackOnboarding } = useAnalytics();

    useEffect(() => {
        const completed = localStorage.getItem(WALKTHROUGH_KEY);
        if (!completed) {
            // Small delay so the dashboard renders first
            const timer = setTimeout(() => setIsVisible(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) return null;

    const step = STEPS[currentStep];
    const isLast = currentStep === STEPS.length - 1;

    const handleNext = () => {
        trackOnboarding(currentStep);
        if (isLast) {
            handleComplete();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleComplete = () => {
        localStorage.setItem(WALKTHROUGH_KEY, 'true');
        trackOnboarding();
        setIsVisible(false);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            {/* Backdrop */}
            <div
                onClick={handleComplete}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(26, 10, 46, 0.65)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            />

            {/* Card */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '420px',
                background: sanctuary.bgCard,
                borderRadius: '24px',
                border: `1px solid ${sanctuary.border}`,
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                overflow: 'hidden',
            }}>
                {/* Gold accent line */}
                <div style={{
                    height: '3px',
                    background: `linear-gradient(90deg, ${sanctuary.gold}, ${sanctuary.purple}, ${sanctuary.sage}, ${sanctuary.rose})`,
                }} />

                {/* Close button */}
                <button
                    onClick={handleComplete}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: sanctuary.bgAlt,
                        color: sanctuary.textMuted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    aria-label="Skip tour"
                >
                    <X size={14} />
                </button>

                {/* Content */}
                <div style={{ padding: '40px 32px 32px' }}>
                    {/* Step indicator */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '24px',
                    }}>
                        <Sparkles size={14} color={sanctuary.gold} />
                        <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: sanctuary.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontFamily: typography.body,
                        }}>
                            Welcome Tour — Step {currentStep + 1} of {STEPS.length}
                        </span>
                    </div>

                    {/* Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: step.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.iconColor,
                        marginBottom: '20px',
                    }}>
                        {step.icon}
                    </div>

                    {/* Title */}
                    <h2 style={{
                        fontFamily: typography.heading,
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        marginBottom: '10px',
                        letterSpacing: '-0.02em',
                    }}>
                        {step.title}
                    </h2>

                    {/* Description */}
                    <p style={{
                        fontFamily: typography.body,
                        fontSize: '0.95rem',
                        color: sanctuary.textSecondary,
                        lineHeight: 1.7,
                        marginBottom: '16px',
                    }}>
                        {step.description}
                    </p>

                    {/* Tip */}
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: sanctuary.goldBg,
                        border: `1px solid ${sanctuary.goldBorder}`,
                        marginBottom: '28px',
                    }}>
                        <span style={{
                            fontSize: '0.82rem',
                            color: sanctuary.gold,
                            fontWeight: 600,
                            fontFamily: typography.body,
                            lineHeight: 1.5,
                        }}>
                            💡 {step.tip}
                        </span>
                    </div>

                    {/* Progress dots */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '6px',
                        marginBottom: '24px',
                    }}>
                        {STEPS.map((_, i) => (
                            <div key={i} style={{
                                width: i === currentStep ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: i === currentStep ? sanctuary.gold : sanctuary.border,
                                transition: 'all 0.3s ease',
                            }} />
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                style={{
                                    padding: '14px 20px',
                                    borderRadius: '12px',
                                    background: 'none',
                                    border: `1.5px solid ${sanctuary.border}`,
                                    color: sanctuary.textSecondary,
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    fontFamily: typography.body,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                background: isLast
                                    ? `linear-gradient(135deg, ${sanctuary.sage}, #5A8A5E)`
                                    : `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                color: isLast ? '#fff' : '#1A1A1A',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                fontFamily: typography.body,
                                boxShadow: isLast
                                    ? '0 4px 16px rgba(122, 158, 126, 0.3)'
                                    : '0 4px 16px rgba(212, 175, 55, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {isLast ? <>Let's Begin <Sparkles size={16} /></> : <>Next <ArrowRight size={16} /></>}
                        </button>
                    </div>

                    {/* Skip link */}
                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <button
                            onClick={handleComplete}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: sanctuary.textMuted,
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: typography.body,
                            }}
                        >
                            Skip tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
