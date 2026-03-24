/**
 * Quick Log Mode — Emergency Capture with Child Selector + Function Hypothesis
 *
 * When a meltdown is happening, parents can't type paragraphs.
 * This gives them preset options to tap through in seconds.
 *
 * Flow: [Child Select (if multi)] → A → B → C → Intensity → Function → Done
 *
 * Informed by Bruce Perry's Neurosequential Model:
 * We prioritize capturing WHAT happened (regulation data) before asking WHY
 * (function hypothesis) — because a dysregulated parent processes bottom-up.
 */

import { useState } from 'react';
import { Check, ArrowRight, RotateCcw, Mic, MicOff, User } from 'lucide-react';
import { useABCLogs, type FunctionHypothesis } from '../hooks/useABCLogs';
import { useFamily } from '../contexts/FamilyContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { sanctuary, typography } from '../shared/theme';

const QUICK_ANTECEDENTS = [
    'Denied request', 'Loud noise', 'Transition/change', 'Social conflict',
    'Hunger/tired', 'Sensory overload', 'New environment', 'Screen taken away',
    'Unexpected event', 'Unclear instruction',
];

const QUICK_BEHAVIORS = [
    'Screaming/crying', 'Hitting/kicking', 'Self-harm', 'Running/bolting',
    'Throwing objects', 'Shutting down', 'Floor drop', 'Refusing to move',
    'Verbal aggression', 'Stimming (intense)',
];

const QUICK_CONSEQUENCES = [
    'Deep pressure/hug', 'Quiet space offered', 'Item removed', 'Distraction used',
    'Verbal reassurance', 'Ignored behavior', 'Physical restraint', 'Timer set',
    'Walked away', 'Sensory tool given',
];

const FUNCTION_OPTIONS: { value: FunctionHypothesis; label: string; emoji: string }[] = [
    { value: 'escape', label: 'Escape', emoji: '🚪' },
    { value: 'attention', label: 'Attention', emoji: '👋' },
    { value: 'tangible', label: 'Tangible', emoji: '🧸' },
    { value: 'sensory', label: 'Sensory', emoji: '✨' },
];

type QuickStep = 'child' | 'antecedent' | 'behavior' | 'consequence' | 'intensity' | 'function' | 'done';

const ABC_STEP_CONFIG: Record<string, { label: string; sublabel: string; color: string; bg: string; border: string; options: string[] }> = {
    antecedent: { label: 'A', sublabel: 'What happened before?', color: sanctuary.text, bg: sanctuary.bgAlt, border: sanctuary.border, options: QUICK_ANTECEDENTS },
    behavior: { label: 'B', sublabel: 'What did they do?', color: sanctuary.rose, bg: sanctuary.roseBg, border: sanctuary.roseBorder, options: QUICK_BEHAVIORS },
    consequence: { label: 'C', sublabel: 'What happened after?', color: sanctuary.purple, bg: sanctuary.purpleBg, border: sanctuary.purpleBorder, options: QUICK_CONSEQUENCES },
};

const STEP_ORDER: QuickStep[] = ['child', 'antecedent', 'behavior', 'consequence', 'intensity', 'function', 'done'];

export function QuickLogMode({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
    const { addLog } = useABCLogs();
    const { family, activeChild, setActiveChildId } = useFamily();
    const { isSupported: voiceSupported, isListening, startListening, stopListening } = useVoiceInput();

    const children = family?.children || [];
    const hasMultipleChildren = children.length > 1;

    // Skip child step if single child
    const initialStep: QuickStep = hasMultipleChildren ? 'child' : 'antecedent';

    const [step, setStep] = useState<QuickStep>(initialStep);
    const [antecedent, setAntecedent] = useState('');
    const [behavior, setBehavior] = useState('');
    const [consequence, setConsequence] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [functionHypothesis, setFunctionHypothesis] = useState<FunctionHypothesis | null>(null);
    const [saving, setSaving] = useState(false);

    const stepIndex = STEP_ORDER.indexOf(step);
    const totalSteps = hasMultipleChildren ? 6 : 5; // exclude 'done'
    const progressIndex = hasMultipleChildren ? stepIndex : stepIndex - 1;

    const handleSelect = (value: string) => {
        if (step === 'antecedent') { setAntecedent(value); setStep('behavior'); }
        else if (step === 'behavior') { setBehavior(value); setStep('consequence'); }
        else if (step === 'consequence') { setConsequence(value); setStep('intensity'); }
    };

    const handleVoiceForStep = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening(step, (transcript) => {
                // Auto-advance after voice capture
                if (step === 'antecedent') { setAntecedent(transcript); setStep('behavior'); }
                else if (step === 'behavior') { setBehavior(transcript); setStep('consequence'); }
                else if (step === 'consequence') { setConsequence(transcript); setStep('intensity'); }
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await addLog({
                timestamp: new Date(),
                antecedent, behavior, consequence,
                intensity,
                context: ['Quick Log'],
                notes: '',
                childId: activeChild?.id,
                childName: activeChild?.preferredName || activeChild?.firstName,
                functionHypothesis,
            });
            setStep('done');
            setTimeout(onComplete, 1500);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const goBack = () => {
        const currentIndex = STEP_ORDER.indexOf(step);
        const minIndex = hasMultipleChildren ? 0 : 1;
        if (currentIndex > minIndex) {
            setStep(STEP_ORDER[currentIndex - 1]);
        }
    };

    // Progress bar
    const ProgressBar = () => (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {[...Array(totalSteps)].map((_, i) => (
                <div key={i} style={{
                    flex: 1, height: '4px', borderRadius: '2px',
                    background: i <= progressIndex ? sanctuary.gold : sanctuary.border,
                    transition: 'background 0.3s ease',
                }} />
            ))}
        </div>
    );

    // ============ DONE ============
    if (step === 'done') {
        return (
            <div style={{
                background: sanctuary.sageBg, borderRadius: '20px',
                border: `1px solid ${sanctuary.sageBorder}`,
                padding: '48px 24px', textAlign: 'center',
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: sanctuary.sage + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <Check size={32} color={sanctuary.sage} />
                </div>
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700,
                    color: sanctuary.sage, fontSize: '1.3rem', marginBottom: '4px',
                }}>Captured.</h3>
                <p style={{
                    color: sanctuary.textMuted, fontFamily: typography.body, fontSize: '0.9rem',
                }}>You're doing important work. Take a breath.</p>
            </div>
        );
    }

    // ============ CHILD SELECTOR ============
    if (step === 'child') {
        return (
            <div>
                <ProgressBar />
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: sanctuary.sageBg, border: `1.5px solid ${sanctuary.sageBorder}`,
                        color: sanctuary.sage, marginBottom: '8px',
                    }}>
                        <User size={20} />
                    </span>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700,
                        fontSize: '1.2rem', color: sanctuary.text, marginBottom: '4px',
                    }}>Who is this for?</h3>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.82rem',
                        fontFamily: typography.body,
                    }}>Select the child.</p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                }}>
                    {children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => {
                                setActiveChildId(child.id);
                                setStep('antecedent');
                            }}
                            style={{
                                padding: '18px 16px',
                                borderRadius: '12px',
                                background: activeChild?.id === child.id ? sanctuary.sageBg : sanctuary.bgCard,
                                border: activeChild?.id === child.id
                                    ? `2px solid ${sanctuary.sage}`
                                    : `1px solid ${sanctuary.border}`,
                                color: sanctuary.text,
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontFamily: typography.body,
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {child.preferredName || child.firstName}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                    <button onClick={onClose} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: sanctuary.textMuted, fontWeight: 600,
                        fontSize: '0.82rem', fontFamily: typography.body,
                    }}>Cancel</button>
                </div>
            </div>
        );
    }

    // ============ INTENSITY ============
    if (step === 'intensity') {
        return (
            <div>
                <ProgressBar />
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700,
                    fontSize: '1.2rem', color: sanctuary.text, textAlign: 'center',
                    marginBottom: '8px',
                }}>How intense was it?</h3>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px', marginBottom: '20px',
                }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <button key={n} onClick={() => setIntensity(n)} style={{
                            padding: '14px 0',
                            borderRadius: '12px',
                            border: intensity === n ? `2px solid ${n > 7 ? sanctuary.rose : sanctuary.gold}` : `1px solid ${sanctuary.border}`,
                            background: intensity === n
                                ? (n > 7 ? sanctuary.roseBg : sanctuary.goldBg)
                                : sanctuary.bgCard,
                            color: intensity === n
                                ? (n > 7 ? sanctuary.rose : sanctuary.gold)
                                : sanctuary.textMuted,
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            fontFamily: typography.body,
                            transition: 'all 0.15s ease',
                        }}>{n}</button>
                    ))}
                </div>

                <button onClick={() => setStep('function')} style={{
                    width: '100%', padding: '16px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                    color: '#1A1A1A', border: 'none',
                    fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer',
                    fontFamily: typography.body,
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px',
                }}>
                    Next <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                    <button onClick={goBack} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: sanctuary.textMuted, fontWeight: 600,
                        fontSize: '0.82rem', fontFamily: typography.body,
                    }}>
                        <RotateCcw size={14} /> Back
                    </button>
                </div>
            </div>
        );
    }

    // ============ FUNCTION HYPOTHESIS ============
    if (step === 'function') {
        return (
            <div>
                <ProgressBar />
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700,
                        fontSize: '1.2rem', color: sanctuary.text, marginBottom: '4px',
                    }}>What need was being met?</h3>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.82rem',
                        fontFamily: typography.body,
                    }}>Behavior is communication. What was it saying?</p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px', marginBottom: '16px',
                }}>
                    {FUNCTION_OPTIONS.map(fn => (
                        <button
                            key={fn.value}
                            onClick={() => setFunctionHypothesis(
                                functionHypothesis === fn.value ? null : fn.value
                            )}
                            style={{
                                padding: '20px 16px',
                                borderRadius: '14px',
                                background: functionHypothesis === fn.value
                                    ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                    : sanctuary.bgCard,
                                border: functionHypothesis === fn.value
                                    ? `2px solid ${sanctuary.gold}`
                                    : `1px solid ${sanctuary.border}`,
                                color: functionHypothesis === fn.value ? '#1A1A1A' : sanctuary.text,
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                fontFamily: typography.body,
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '6px' }}>{fn.emoji}</span>
                            {fn.label}
                        </button>
                    ))}
                </div>

                {/* Save + Skip */}
                <button onClick={handleSave} disabled={saving} style={{
                    width: '100%', padding: '16px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                    color: '#1A1A1A', border: 'none',
                    fontWeight: 700, fontSize: '1rem',
                    cursor: saving ? 'default' : 'pointer',
                    opacity: saving ? 0.5 : 1,
                    fontFamily: typography.body,
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                }}>
                    {saving ? 'Saving...' : 'Save Quick Log'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', gap: '16px' }}>
                    <button onClick={goBack} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: sanctuary.textMuted, fontWeight: 600,
                        fontSize: '0.82rem', fontFamily: typography.body,
                    }}>
                        <RotateCcw size={14} /> Back
                    </button>
                    <button onClick={() => { setFunctionHypothesis(null); handleSave(); }} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: sanctuary.textMuted, fontWeight: 600,
                        fontSize: '0.82rem', fontFamily: typography.body,
                    }}>I'm not sure — skip</button>
                </div>
            </div>
        );
    }

    // ============ A / B / C Steps ============
    const config = ABC_STEP_CONFIG[step];

    return (
        <div>
            <ProgressBar />

            {/* Step Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: config.bg, border: `1.5px solid ${config.border}`,
                    color: config.color, fontWeight: 800, fontSize: '1.1rem',
                    fontFamily: typography.heading, marginBottom: '8px',
                }}>{config.label}</span>
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700,
                    fontSize: '1.2rem', color: sanctuary.text, marginBottom: '4px',
                }}>
                    {config.sublabel}
                </h3>
                <p style={{
                    color: sanctuary.textMuted, fontSize: '0.82rem',
                    fontFamily: typography.body,
                }}>Tap the closest match, or use voice.</p>
            </div>

            {/* Voice Input Button */}
            {voiceSupported && (
                <button
                    onClick={handleVoiceForStep}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        background: isListening ? sanctuary.rose : sanctuary.bgAlt,
                        border: isListening
                            ? `2px solid ${sanctuary.rose}`
                            : `1.5px solid ${sanctuary.border}`,
                        color: isListening ? '#fff' : sanctuary.textSecondary,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        fontFamily: typography.body,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        transition: 'all 0.2s ease',
                        boxShadow: isListening ? `0 0 0 3px ${sanctuary.roseBg}` : 'none',
                    }}
                >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    {isListening ? 'Listening... tap to stop' : 'Speak instead'}
                </button>
            )}

            {/* Options Grid */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
            }}>
                {config.options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: sanctuary.bgCard,
                            border: `1px solid ${sanctuary.border}`,
                            color: sanctuary.text,
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: typography.body,
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <ArrowRight size={14} color={config.color} style={{ opacity: 0.5 }} />
                        {opt}
                    </button>
                ))}
            </div>

            {/* Back / Cancel */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '16px' }}>
                {step !== (hasMultipleChildren ? 'child' : 'antecedent') && (
                    <button
                        onClick={goBack}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: sanctuary.textMuted, fontWeight: 600,
                            fontSize: '0.82rem', fontFamily: typography.body,
                        }}
                    >
                        <RotateCcw size={14} /> Back
                    </button>
                )}
                <button onClick={onClose} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: sanctuary.textMuted, fontWeight: 600,
                    fontSize: '0.82rem', fontFamily: typography.body,
                }}>Cancel</button>
            </div>
        </div>
    );
}
