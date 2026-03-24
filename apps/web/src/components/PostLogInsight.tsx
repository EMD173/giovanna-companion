/**
 * PostLogInsight — Contextual Learning After ABC Logging
 *
 * Appears after a parent logs a behavior in the ABC Logger.
 * Connects their real observation to the relevant theory module.
 *
 * "You just identified an escape function. Here's what that means,
 *  and here's what you can try tonight."
 *
 * Path: src/components/PostLogInsight.tsx
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, X, Sparkles, Lightbulb } from 'lucide-react';
import { getModulesForFunction } from '../data/practiceModules';
import { sanctuary, typography } from '../shared/theme';

// ─────────────────────────────────────────
// Function-specific insights
// ─────────────────────────────────────────

interface FunctionInsight {
    title: string;
    explanation: string;
    quickTip: string;
    emoji: string;
}

const FUNCTION_INSIGHTS: Record<string, FunctionInsight> = {
    escape: {
        title: 'Escape Function Detected',
        explanation: 'Your child\'s behavior is communicating "I need to get away from this." Something in the environment — a demand, a sensation, a social situation — has exceeded their capacity right now.',
        quickTip: 'Try reducing the demand. Break the task into smaller steps, offer a "break" signal, or remove the stressor temporarily. The behavior often decreases when the escape need is met through a safer alternative.',
        emoji: '🚪',
    },
    attention: {
        title: 'Attention Function Detected',
        explanation: 'Your child\'s behavior is communicating "I need to be seen." They\'re seeking connection, acknowledgment, or engagement — and the behavior is the method they\'ve found that works.',
        quickTip: 'Give attention proactively — before the challenging behavior occurs. Set up regular 1-on-1 check-ins. When the behavior does happen, keep your response neutral (big reactions reinforce attention-seeking). Teach them easier ways to get your attention.',
        emoji: '👋',
    },
    tangible: {
        title: 'Tangible Function Detected',
        explanation: 'Your child\'s behavior is communicating "I need access to something." They want a specific item, activity, or outcome and don\'t yet have the negotiation or waiting skills for this situation.',
        quickTip: 'Teach waiting and turn-taking when your child is calm (not during the moment). Use visual timers so they can see the waiting period. Create clear "first/then" sequences: "First homework, then tablet."',
        emoji: '🎯',
    },
    sensory: {
        title: 'Sensory Function Detected',
        explanation: 'Your child\'s behavior is driven by their nervous system\'s need for sensory input — or need to escape sensory overload. This isn\'t social; it\'s physiological. Their body is telling them something.',
        quickTip: 'If they\'re seeking input: provide it proactively (movement breaks, chew tools, deep pressure). If they\'re avoiding input: reduce the sensory load (quieter space, dimmer lights, fewer transitions). The body gets what it needs — with or without our help.',
        emoji: '🌊',
    },
};

// ─────────────────────────────────────────
// Component Props
// ─────────────────────────────────────────

interface PostLogInsightProps {
    /** The function hypothesis from the ABC log */
    behaviorFunction: 'escape' | 'attention' | 'tangible' | 'sensory';
    /** Callback to dismiss */
    onDismiss: () => void;
    /** Whether to show the component */
    visible: boolean;
}

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

export function PostLogInsight({ behaviorFunction, onDismiss, visible }: PostLogInsightProps) {
    const [dismissed, setDismissed] = useState(false);

    if (!visible || dismissed) return null;

    const insight = FUNCTION_INSIGHTS[behaviorFunction];
    if (!insight) return null;

    const relatedModules = getModulesForFunction(behaviorFunction).slice(0, 2);

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss();
    };

    return (
        <div
            className="sanctuary-enter"
            style={{
                background: sanctuary.bgCard,
                borderRadius: '16px',
                border: `1px solid ${sanctuary.goldBorder}`,
                boxShadow: sanctuary.shadowMd,
                overflow: 'hidden',
                marginTop: '16px',
                marginBottom: '16px',
            }}
        >
            {/* Gold accent bar */}
            <div style={{
                height: '3px',
                background: `linear-gradient(90deg, ${sanctuary.gold}, ${sanctuary.purple})`,
            }} />

            <div style={{ padding: '18px' }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: sanctuary.goldBg,
                            border: `1px solid ${sanctuary.goldBorder}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                        }}>
                            {insight.emoji}
                        </div>
                        <div>
                            <h3 style={{
                                fontFamily: typography.heading,
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                color: sanctuary.text,
                            }}>{insight.title}</h3>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: sanctuary.gold,
                                fontFamily: typography.body,
                            }}>
                                <Sparkles size={10} /> PRACTITIONER INSIGHT
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: sanctuary.textMuted,
                            padding: '4px',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Explanation */}
                <p style={{
                    color: sanctuary.textSecondary,
                    fontSize: '0.88rem',
                    fontFamily: typography.body,
                    lineHeight: 1.7,
                    marginBottom: '12px',
                }}>
                    {insight.explanation}
                </p>

                {/* Quick Tip */}
                <div style={{
                    background: sanctuary.sageBg,
                    border: `1px solid ${sanctuary.sageBorder}`,
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '14px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '6px',
                    }}>
                        <Lightbulb size={14} style={{ color: sanctuary.sage }} />
                        <span style={{
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: sanctuary.sage,
                            fontFamily: typography.body,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                        }}>What to Try Tonight</span>
                    </div>
                    <p style={{
                        color: sanctuary.textSecondary,
                        fontSize: '0.85rem',
                        fontFamily: typography.body,
                        lineHeight: 1.6,
                    }}>
                        {insight.quickTip}
                    </p>
                </div>

                {/* Related Modules */}
                {relatedModules.length > 0 && (
                    <div>
                        <span style={{
                            fontFamily: typography.body,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: sanctuary.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            display: 'block',
                            marginBottom: '8px',
                        }}>
                            Go Deeper
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {relatedModules.map((mod) => (
                                <Link
                                    key={mod.id}
                                    to={`/practice/${mod.slug}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px 14px',
                                        borderRadius: '10px',
                                        background: sanctuary.bgAlt,
                                        border: `1px solid ${sanctuary.border}`,
                                        textDecoration: 'none',
                                        color: sanctuary.text,
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <BookOpen size={14} style={{ color: sanctuary.purple }} />
                                        <span style={{
                                            fontFamily: typography.body,
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                        }}>
                                            Module {mod.order}: {mod.title}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} style={{ color: sanctuary.textMuted }} />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
