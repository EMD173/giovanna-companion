/**
 * Capture Preview — "See What You Get"
 * 
 * Shows hesitant parents what they'll receive from logging moments.
 * Demonstrates: voice → log entry → behavioral intelligence → individualized strategies.
 * The thesis: the output sells the input.
 */

import { useState } from 'react';
import { Mic, FileText, TrendingUp, ArrowRight, Play, ChevronRight, Sparkles } from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';

const EXAMPLE_VOICE_TEXT = "He threw his plate because I changed the routine without warning. I gave him his weighted blanket and he calmed down in about five minutes.";

const EXAMPLE_LOG = {
    antecedent: 'Changed the dinner routine without warning',
    behavior: 'Threw his plate off the table',
    consequence: 'Given weighted blanket — calmed in 5 minutes',
    intensity: 6,
    context: 'Home',
    function: 'Escape',
};

const EXAMPLE_PATTERNS = [
    { trigger: 'Routine changes', count: 8, pct: 42 },
    { trigger: 'Loud noises', count: 5, pct: 26 },
    { trigger: 'Transitions', count: 4, pct: 21 },
];

export function CapturePreview({ onStartLogging }: { onStartLogging: () => void }) {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 'speak',
            icon: <Mic size={20} />,
            title: 'Speak It',
            subtitle: '10 seconds',
            color: sanctuary.rose,
            bgColor: sanctuary.roseBg,
            borderColor: sanctuary.roseBorder,
        },
        {
            id: 'log',
            icon: <FileText size={20} />,
            title: 'Log Created',
            subtitle: 'Automatic',
            color: sanctuary.purple,
            bgColor: sanctuary.purpleBg,
            borderColor: sanctuary.purpleBorder,
        },
        {
            id: 'insights',
            icon: <TrendingUp size={20} />,
            title: 'Patterns Emerge',
            subtitle: 'After 5+ logs',
            color: sanctuary.gold,
            bgColor: sanctuary.goldBg,
            borderColor: sanctuary.goldBorder,
        },
    ];

    return (
        <div className="sanctuary-enter" style={{
            background: sanctuary.bgCard,
            borderRadius: '20px',
            border: `1px solid ${sanctuary.border}`,
            overflow: 'hidden',
            boxShadow: sanctuary.shadowMd,
        }}>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${sanctuary.text} 0%, #2A2A2A 100%)`,
                padding: '24px',
                color: '#fff',
                textAlign: 'center',
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: sanctuary.gold,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '12px',
                    fontFamily: typography.body,
                }}>
                    <Sparkles size={10} /> See What You Get
                </div>
                <h2 style={{
                    fontFamily: typography.heading,
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                }}>
                    Talk for 10 seconds.<br />
                    Get individualized strategies.
                </h2>
                <p style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem',
                    fontFamily: typography.body,
                }}>
                    Here&apos;s what happens when you log a moment.
                </p>
            </div>

            {/* Step Selector */}
            <div style={{
                display: 'flex',
                gap: '2px',
                padding: '16px 16px 0',
            }}>
                {steps.map((step, idx) => (
                    <button
                        key={step.id}
                        onClick={() => setActiveStep(idx)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '12px 8px',
                            borderRadius: '12px',
                            border: activeStep === idx
                                ? `2px solid ${step.color}`
                                : `1px solid ${sanctuary.border}`,
                            background: activeStep === idx ? step.bgColor : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: typography.body,
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: activeStep === idx ? step.color : sanctuary.bgAlt,
                            color: activeStep === idx ? '#fff' : sanctuary.textMuted,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                        }}>
                            {step.icon}
                        </div>
                        <div>
                            <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: activeStep === idx ? step.color : sanctuary.textSecondary,
                            }}>{step.title}</div>
                            <div style={{
                                fontSize: '0.68rem',
                                color: sanctuary.textMuted,
                            }}>{step.subtitle}</div>
                        </div>
                        {idx < steps.length - 1 && (
                            <ArrowRight size={10} style={{
                                position: 'absolute',
                                right: '-7px',
                                color: sanctuary.textMuted,
                            }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ padding: '16px' }}>
                {activeStep === 0 && (
                    <div className="sanctuary-enter" style={{
                        background: sanctuary.roseBg,
                        border: `1px solid ${sanctuary.roseBorder}`,
                        borderRadius: '16px',
                        padding: '20px',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '12px',
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: sanctuary.rose,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 2s infinite',
                            }}>
                                <Mic size={20} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: sanctuary.rose,
                                    fontFamily: typography.body,
                                }}>Voice Capture Example</div>
                                <div style={{
                                    fontSize: '0.72rem',
                                    color: sanctuary.textMuted,
                                    fontFamily: typography.body,
                                }}>Just talk — we&apos;ll handle the rest</div>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.7)',
                            borderRadius: '12px',
                            padding: '14px',
                            fontStyle: 'italic',
                            color: sanctuary.textSecondary,
                            fontSize: '0.88rem',
                            fontFamily: typography.body,
                            lineHeight: 1.6,
                            borderLeft: `3px solid ${sanctuary.rose}`,
                        }}>
                            &ldquo;{EXAMPLE_VOICE_TEXT}&rdquo;
                        </div>
                        <div style={{
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: sanctuary.textMuted,
                            fontSize: '0.75rem',
                            fontFamily: typography.body,
                        }}>
                            <Play size={10} />
                            <span>That&apos;s all you have to say. We turn it into a structured log automatically.</span>
                        </div>
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="sanctuary-enter" style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        <div style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: sanctuary.purple,
                            padding: '10px 16px',
                            background: sanctuary.purpleBg,
                            fontFamily: typography.body,
                        }}>Auto-Generated Log Entry</div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr',
                            gap: '1px',
                            background: sanctuary.border,
                        }}>
                            {[
                                { label: 'A — TRIGGER', value: EXAMPLE_LOG.antecedent, bg: sanctuary.bg },
                                { label: 'B — BEHAVIOR', value: EXAMPLE_LOG.behavior, bg: sanctuary.roseBg },
                                { label: 'C — WHAT HELPED', value: EXAMPLE_LOG.consequence, bg: sanctuary.purpleBg },
                            ].map(row => (
                                <div key={row.label} style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    background: row.bg,
                                }}>
                                    <span style={{
                                        fontSize: '0.6rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        color: sanctuary.textMuted,
                                        minWidth: '80px',
                                        paddingTop: '2px',
                                        fontFamily: typography.body,
                                    }}>{row.label}</span>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        color: sanctuary.text,
                                        fontFamily: typography.body,
                                        lineHeight: 1.5,
                                    }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{
                            padding: '10px 16px',
                            display: 'flex',
                            gap: '12px',
                            background: sanctuary.bgAlt,
                        }}>
                            <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: sanctuary.textMuted,
                                fontFamily: typography.body,
                            }}>Intensity: <strong style={{ color: sanctuary.gold }}>{EXAMPLE_LOG.intensity}/10</strong></span>
                            <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: sanctuary.textMuted,
                                fontFamily: typography.body,
                            }}>Context: <strong style={{ color: sanctuary.sage }}>{EXAMPLE_LOG.context}</strong></span>
                            <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: sanctuary.textMuted,
                                fontFamily: typography.body,
                            }}>ƒ <strong style={{ color: sanctuary.purple }}>{EXAMPLE_LOG.function}</strong></span>
                        </div>
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="sanctuary-enter" style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: `1px solid ${sanctuary.goldBorder}`,
                    }}>
                        <div style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: sanctuary.gold,
                            padding: '10px 16px',
                            background: sanctuary.goldBg,
                            fontFamily: typography.body,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}>
                            <TrendingUp size={12} /> Your Behavioral Intelligence Shows
                        </div>
                        
                        {/* Pattern Bars */}
                        <div style={{ padding: '16px' }}>
                            <div style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: sanctuary.textSecondary,
                                marginBottom: '12px',
                                fontFamily: typography.body,
                            }}>Top Triggers (from 19 entries)</div>
                            {EXAMPLE_PATTERNS.map(p => (
                                <div key={p.trigger} style={{ marginBottom: '10px' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '4px',
                                    }}>
                                        <span style={{
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            color: sanctuary.text,
                                            fontFamily: typography.body,
                                        }}>{p.trigger}</span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: sanctuary.textMuted,
                                            fontFamily: typography.body,
                                        }}>{p.count}× ({p.pct}%)</span>
                                    </div>
                                    <div style={{
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: sanctuary.border,
                                        overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            width: `${p.pct}%`,
                                            height: '100%',
                                            borderRadius: '3px',
                                            background: `linear-gradient(90deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                            transition: 'width 0.8s ease',
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* What You Can Say in the IEP Meeting */}
                        <div style={{
                            margin: '0 16px 16px',
                            padding: '14px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, rgba(75,0,130,0.05), rgba(212,175,55,0.05))',
                            border: `1px solid ${sanctuary.purpleBorder}`,
                        }}>
                            <div style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: sanctuary.purple,
                                marginBottom: '6px',
                                fontFamily: typography.body,
                            }}>What you now know about YOUR child:</div>
                            <p style={{
                                fontSize: '0.85rem',
                                color: sanctuary.textSecondary,
                                fontFamily: typography.body,
                                lineHeight: 1.6,
                                fontStyle: 'italic',
                            }}>
                                &ldquo;42% of incidents are triggered by routine changes. 
                                When we give him advance warning and a weighted blanket, 
                                he self-regulates within 5 minutes.&rdquo;
                            </p>
                            <p style={{
                                fontSize: '0.75rem',
                                color: sanctuary.textMuted,
                                fontFamily: typography.body,
                                marginTop: '8px',
                                lineHeight: 1.5,
                            }}>
                                Use this at school, therapy, the doctor, or at home — anywhere your child needs understanding.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* CTA */}
            <div style={{ padding: '0 16px 20px' }}>
                <button
                    onClick={onStartLogging}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        fontFamily: typography.body,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(107,76,154,0.3)',
                    }}
                >
                    <Mic size={18} /> Start Your First Capture
                    <ChevronRight size={16} />
                </button>
                <p style={{
                    textAlign: 'center',
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: sanctuary.textMuted,
                    fontFamily: typography.body,
                }}>
                    Just talk into your phone. 10 seconds is all it takes.
                </p>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(184, 84, 80, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(184, 84, 80, 0); }
                }
            `}</style>
        </div>
    );
}
