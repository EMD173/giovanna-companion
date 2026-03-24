import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Mic, MicOff, ChevronDown, HelpCircle } from 'lucide-react';
import { useABCLogs, type FunctionHypothesis } from '../hooks/useABCLogs';
import { useFamily } from '../contexts/FamilyContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { sanctuary, typography } from '../shared/theme';

const TIME_OF_DAY_LABELS: Record<string, { emoji: string; label: string }> = {
    morning: { emoji: '🌅', label: 'Morning' },
    afternoon: { emoji: '🌤️', label: 'Afternoon' },
    evening: { emoji: '🌙', label: 'Evening' },
    night: { emoji: '🌑', label: 'Night' },
};

function getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

const FUNCTION_OPTIONS: { value: FunctionHypothesis; label: string; description: string }[] = [
    { value: 'escape', label: 'Escape', description: 'Avoiding a task or situation' },
    { value: 'attention', label: 'Attention', description: 'Seeking connection or response' },
    { value: 'tangible', label: 'Tangible', description: 'Wanting an item or activity' },
    { value: 'sensory', label: 'Sensory', description: 'Meeting a sensory need' },
];

export function ABCLogForm({ onClose, onSave }: { onClose?: () => void; onSave?: (functionHypothesis: FunctionHypothesis | null) => void }) {
    const { addLog } = useABCLogs();
    const { family, activeChild, setActiveChildId } = useFamily();
    const { isSupported: voiceSupported, isListening, activeField, startListening, stopListening } = useVoiceInput();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [antecedent, setAntecedent] = useState('');
    const [behavior, setBehavior] = useState('');
    const [consequence, setConsequence] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [functionHypothesis, setFunctionHypothesis] = useState<FunctionHypothesis | null>(null);
    const [showFunctionInfo, setShowFunctionInfo] = useState(false);

    const CONTEXT_OPTIONS = ['Home', 'School', 'Public', 'Transition', 'Mealtime', 'Bedtime', 'Loud Noise'];
    const [selectedContext, setSelectedContext] = useState<string[]>([]);

    const children = family?.children || [];
    const hasMultipleChildren = children.length > 1;
    const timeOfDay = useMemo(() => getCurrentTimeOfDay(), []);
    const todLabel = TIME_OF_DAY_LABELS[timeOfDay];

    const toggleContext = (ctx: string) => {
        if (selectedContext.includes(ctx)) {
            setSelectedContext(selectedContext.filter(c => c !== ctx));
        } else {
            setSelectedContext([...selectedContext, ctx]);
        }
    };

    const handleVoiceToggle = (
        fieldName: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        if (isListening && activeField === fieldName) {
            stopListening();
        } else {
            startListening(fieldName, (transcript) => {
                setter(prev => prev ? `${prev} ${transcript}` : transcript);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addLog({
                timestamp: new Date(),
                antecedent, behavior, consequence,
                intensity, context: selectedContext, notes: '',
                childId: activeChild?.id,
                childName: activeChild?.preferredName || activeChild?.firstName,
                functionHypothesis,
            });
            if (onSave) onSave(functionHypothesis);
            if (onClose) onClose();
            else navigate('/log');
        } catch (error) {
            console.error("Error saving log", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: `1.5px solid ${sanctuary.border}`,
        background: sanctuary.bg,
        color: sanctuary.text,
        fontSize: '0.92rem',
        fontFamily: typography.body,
        outline: 'none',
        resize: 'vertical' as const,
        boxSizing: 'border-box',
        lineHeight: 1.6,
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 700,
        color: sanctuary.text,
        marginBottom: '6px',
        fontFamily: typography.body,
    };

    const hintStyle: React.CSSProperties = {
        fontWeight: 500,
        color: sanctuary.textMuted,
        fontSize: '0.82rem',
    };

    const micButtonStyle = (field: string): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: isListening && activeField === field
            ? sanctuary.rose
            : sanctuary.bgAlt,
        color: isListening && activeField === field
            ? '#fff'
            : sanctuary.textMuted,
        boxShadow: isListening && activeField === field
            ? `0 0 0 3px ${sanctuary.roseBg}`
            : 'none',
    });

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Time of Day Badge + Child Selector Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
            }}>
                {/* Time of Day Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    background: sanctuary.goldBg,
                    border: `1px solid ${sanctuary.goldBorder}`,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: sanctuary.gold,
                    fontFamily: typography.body,
                }}>
                    <span>{todLabel.emoji}</span>
                    <span>{todLabel.label}</span>
                </div>

                {/* Child Selector */}
                {hasMultipleChildren && (
                    <div style={{ position: 'relative', flex: 1, minWidth: '140px' }}>
                        <select
                            value={activeChild?.id || ''}
                            onChange={(e) => setActiveChildId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 32px 8px 14px',
                                borderRadius: '100px',
                                border: `1.5px solid ${sanctuary.sageBorder}`,
                                background: sanctuary.sageBg,
                                color: sanctuary.sage,
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                fontFamily: typography.body,
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                cursor: 'pointer',
                                outline: 'none',
                            }}
                        >
                            {children.map(child => (
                                <option key={child.id} value={child.id}>
                                    {child.preferredName || child.firstName}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            size={14}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: sanctuary.sage,
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                )}
            </div>

            {/* A — Antecedent */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={labelStyle}>
                        Antecedent <span style={hintStyle}>(What happened before?)</span>
                    </label>
                    {voiceSupported && (
                        <button
                            type="button"
                            onClick={() => handleVoiceToggle('antecedent', setAntecedent)}
                            style={micButtonStyle('antecedent')}
                            aria-label={isListening && activeField === 'antecedent' ? 'Stop recording' : 'Start voice input'}
                        >
                            {isListening && activeField === 'antecedent'
                                ? <MicOff size={14} />
                                : <Mic size={14} />
                            }
                        </button>
                    )}
                </div>
                <textarea
                    required rows={2}
                    value={antecedent}
                    onChange={(e) => setAntecedent(e.target.value)}
                    placeholder="e.g., Asked to turn off iPad, loud siren passed by..."
                    style={{
                        ...inputStyle,
                        ...(isListening && activeField === 'antecedent' ? {
                            borderColor: sanctuary.rose,
                            boxShadow: `0 0 0 2px ${sanctuary.roseBg}`,
                        } : {}),
                    }}
                />
            </div>

            {/* B — Behavior */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={labelStyle}>
                        Behavior <span style={hintStyle}>(What did they do?)</span>
                    </label>
                    {voiceSupported && (
                        <button
                            type="button"
                            onClick={() => handleVoiceToggle('behavior', setBehavior)}
                            style={micButtonStyle('behavior')}
                            aria-label={isListening && activeField === 'behavior' ? 'Stop recording' : 'Start voice input'}
                        >
                            {isListening && activeField === 'behavior'
                                ? <MicOff size={14} />
                                : <Mic size={14} />
                            }
                        </button>
                    )}
                </div>
                <textarea
                    required rows={2}
                    value={behavior}
                    onChange={(e) => setBehavior(e.target.value)}
                    placeholder="e.g., Covered ears, dropped to floor, hit self..."
                    style={{
                        ...inputStyle,
                        background: sanctuary.roseBg,
                        borderColor: sanctuary.roseBorder,
                        ...(isListening && activeField === 'behavior' ? {
                            borderColor: sanctuary.rose,
                            boxShadow: `0 0 0 2px ${sanctuary.roseBg}`,
                        } : {}),
                    }}
                />
            </div>

            {/* C — Consequence */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={labelStyle}>
                        Consequence <span style={hintStyle}>(What happened after?)</span>
                    </label>
                    {voiceSupported && (
                        <button
                            type="button"
                            onClick={() => handleVoiceToggle('consequence', setConsequence)}
                            style={micButtonStyle('consequence')}
                            aria-label={isListening && activeField === 'consequence' ? 'Stop recording' : 'Start voice input'}
                        >
                            {isListening && activeField === 'consequence'
                                ? <MicOff size={14} />
                                : <Mic size={14} />
                            }
                        </button>
                    )}
                </div>
                <textarea
                    required rows={2}
                    value={consequence}
                    onChange={(e) => setConsequence(e.target.value)}
                    placeholder="e.g., Gave deep pressure, offered quiet space, ignored..."
                    style={{
                        ...inputStyle,
                        background: sanctuary.purpleBg,
                        borderColor: sanctuary.purpleBorder,
                        ...(isListening && activeField === 'consequence' ? {
                            borderColor: sanctuary.rose,
                            boxShadow: `0 0 0 2px ${sanctuary.roseBg}`,
                        } : {}),
                    }}
                />
            </div>

            {/* Intensity Slider */}
            <div style={{
                background: sanctuary.bgAlt,
                padding: '20px',
                borderRadius: '16px',
                border: `1px solid ${sanctuary.goldBorder}`,
            }}>
                <label style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '12px',
                }}>
                    <span style={{ ...labelStyle, marginBottom: 0 }}>Intensity Level</span>
                    <span style={{
                        color: intensity > 7 ? sanctuary.rose : sanctuary.gold,
                        fontWeight: 800,
                        fontSize: '1.3rem',
                        fontFamily: typography.heading,
                    }}>{intensity}/10</span>
                </label>
                <input
                    type="range" min="1" max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        cursor: 'pointer',
                        background: `linear-gradient(to right, ${sanctuary.gold} 0%, ${intensity > 7 ? sanctuary.rose : sanctuary.gold} ${intensity * 10}%, ${sanctuary.border} ${intensity * 10}%, ${sanctuary.border} 100%)`,
                        outline: 'none',
                    }}
                />
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: '8px',
                }}>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: sanctuary.textMuted,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: typography.body,
                    }}>Mild</span>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: sanctuary.textMuted,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: typography.body,
                    }}>Moderate</span>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700, color: sanctuary.textMuted,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: typography.body,
                    }}>Severe</span>
                </div>
            </div>

            {/* Context Chips */}
            <div>
                <label style={labelStyle}>Context Environment</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CONTEXT_OPTIONS.map(ctx => (
                        <button
                            key={ctx} type="button"
                            onClick={() => toggleContext(ctx)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                fontFamily: typography.body,
                                background: selectedContext.includes(ctx)
                                    ? `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`
                                    : sanctuary.bgCard,
                                border: selectedContext.includes(ctx)
                                    ? 'none'
                                    : `1px solid ${sanctuary.border}`,
                                color: selectedContext.includes(ctx)
                                    ? '#fff'
                                    : sanctuary.textMuted,
                                boxShadow: selectedContext.includes(ctx)
                                    ? '0 2px 8px rgba(107, 76, 154, 0.25)'
                                    : 'none',
                                transform: selectedContext.includes(ctx)
                                    ? 'translateY(-1px)'
                                    : 'none',
                            }}
                        >
                            {ctx}
                        </button>
                    ))}
                </div>
            </div>

            {/* Function Hypothesis */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>
                        Function Hypothesis
                    </label>
                    <span style={{ ...hintStyle, fontSize: '0.78rem' }}>(optional)</span>
                    <button
                        type="button"
                        onClick={() => setShowFunctionInfo(!showFunctionInfo)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: sanctuary.textMuted,
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        aria-label="What is function hypothesis?"
                    >
                        <HelpCircle size={14} />
                    </button>
                </div>

                {showFunctionInfo && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: sanctuary.goldBg,
                        border: `1px solid ${sanctuary.goldBorder}`,
                        marginBottom: '10px',
                        fontSize: '0.82rem',
                        color: sanctuary.textSecondary,
                        fontFamily: typography.body,
                        lineHeight: 1.6,
                    }}>
                        <strong style={{ color: sanctuary.gold }}>What need was the behavior meeting?</strong>{' '}
                        This is what BCBAs (behavior analysts) look for. If you're not sure, skip it — patterns will emerge over time.
                    </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {FUNCTION_OPTIONS.map(fn => (
                        <button
                            key={fn.value}
                            type="button"
                            onClick={() => setFunctionHypothesis(
                                functionHypothesis === fn.value ? null : fn.value
                            )}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                fontFamily: typography.body,
                                background: functionHypothesis === fn.value
                                    ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                    : sanctuary.bgCard,
                                border: functionHypothesis === fn.value
                                    ? 'none'
                                    : `1px solid ${sanctuary.border}`,
                                color: functionHypothesis === fn.value
                                    ? '#1A1A1A'
                                    : sanctuary.textMuted,
                                boxShadow: functionHypothesis === fn.value
                                    ? '0 2px 8px rgba(212, 175, 55, 0.3)'
                                    : 'none',
                                transform: functionHypothesis === fn.value
                                    ? 'translateY(-1px)'
                                    : 'none',
                            }}
                            title={fn.description}
                        >
                            {fn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                {onClose && (
                    <button type="button" onClick={onClose} style={{
                        flex: 1, padding: '14px',
                        borderRadius: '12px',
                        background: 'none',
                        border: `1.5px solid ${sanctuary.border}`,
                        color: sanctuary.textSecondary,
                        fontWeight: 700, fontSize: '0.92rem',
                        cursor: 'pointer', fontFamily: typography.body,
                    }}>Cancel</button>
                )}
                <button type="submit" disabled={isSubmitting} style={{
                    flex: 1, padding: '14px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                    color: '#fff', border: 'none',
                    fontWeight: 700, fontSize: '0.92rem',
                    cursor: isSubmitting ? 'default' : 'pointer',
                    opacity: isSubmitting ? 0.5 : 1,
                    boxShadow: '0 4px 16px rgba(107, 76, 154, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', fontFamily: typography.body,
                }}>
                    {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Entry</>}
                </button>
            </div>
        </form>
    );
}
