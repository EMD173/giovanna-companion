/**
 * Crisis Mode — Full Crisis UI
 *
 * When crisis is detected:
 *   - Dark UI with calming visual design
 *   - Personalized calming scripts from child profile
 *   - Animated breathing timer (breathe in / hold / breathe out)
 *   - One-tap Village alert to emergency contacts
 *   - "What Just Happened" post-crisis debrief → auto-creates ABC log
 *
 * Crisis detection is LOCAL (no API call). Zero latency.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Shield, Heart, Phone, Clock, Wind,
    Check
} from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { useABCLogs, type FunctionHypothesis } from '../hooks/useABCLogs';
import { typography } from '../shared/theme';

// ============================================
// TYPES
// ============================================

type CrisisPhase = 'active' | 'breathing' | 'debrief' | 'logged';

interface BreathState {
    phase: 'inhale' | 'hold' | 'exhale' | 'rest';
    label: string;
    duration: number;
    cycle: number;
}

// ============================================
// BREATHING TIMER
// ============================================

const BREATH_CYCLE = [
    { phase: 'inhale' as const, label: 'Breathe in...', duration: 4000 },
    { phase: 'hold' as const, label: 'Hold...', duration: 4000 },
    { phase: 'exhale' as const, label: 'Breathe out...', duration: 6000 },
    { phase: 'rest' as const, label: 'Rest...', duration: 2000 },
];

function useBreathingTimer(active: boolean) {
    const [breathState, setBreathState] = useState<BreathState>({
        phase: 'inhale', label: 'Breathe in...', duration: 4000, cycle: 0
    });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!active) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        let stepIndex = 0;
        let cycleCount = 0;

        function nextStep() {
            const step = BREATH_CYCLE[stepIndex % BREATH_CYCLE.length];
            if (stepIndex > 0 && stepIndex % BREATH_CYCLE.length === 0) cycleCount++;

            setBreathState({
                phase: step.phase,
                label: step.label,
                duration: step.duration,
                cycle: cycleCount
            });

            stepIndex++;
            timerRef.current = setTimeout(nextStep, step.duration);
        }

        nextStep();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [active]);

    return breathState;
}

// ============================================
// CRISIS MODE COMPONENT
// ============================================

interface CrisisModeProps {
    onExit: () => void;
    initialMessage?: string;
}

export function CrisisMode({ onExit, initialMessage }: CrisisModeProps) {
    const { activeChild, family } = useFamily();
    const { addLog } = useABCLogs();
    const [phase, setPhase] = useState<CrisisPhase>('active');
    const [breathingActive, setBreathingActive] = useState(false);
    const breathState = useBreathingTimer(breathingActive);
    const [villageAlerted, setVillageAlerted] = useState(false);

    // Debrief form state
    const [debriefAntecedent, setDebriefAntecedent] = useState('');
    const [debriefBehavior, setDebriefBehavior] = useState('');
    const [debriefConsequence, setDebriefConsequence] = useState('');
    const [debriefIntensity, setDebriefIntensity] = useState(7);
    const [debriefFunction, setDebriefFunction] = useState<FunctionHypothesis | null>(null);
    const [savingLog, setSavingLog] = useState(false);

    const childName = activeChild?.preferredName || activeChild?.firstName || 'your child';
    const calmingStrategies = activeChild?.communicationStyle?.calmingStrategies || [];
    const sensoryTools = activeChild?.homeplaceSupports?.sensoryTools || [];
    const trustedPeople = activeChild?.homeplaceSupports?.trustedPeople || [];

    // Village contacts from family profile
    const emergencyContacts = family?.sharedWith?.filter(
        s => s.role === 'responder' || s.role === 'emergency_contact' || s.role === 'village'
    ) || [];

    // ============================================
    // VILLAGE ALERT
    // ============================================

    const sendVillageAlert = useCallback(() => {
        // In V1, this opens the SMS/email compose with pre-filled message
        // In V2, this would send push notifications via Cloud Functions
        const alertMessage = `I need support right now with ${childName}. Can you help?`;

        if (emergencyContacts.length > 0) {
            // Try SMS first (most mobile-friendly)
            const firstContact = emergencyContacts[0];
            if (firstContact.email) {
                window.open(`mailto:${firstContact.email}?subject=Need%20Support&body=${encodeURIComponent(alertMessage)}`);
            }
        } else if (trustedPeople.length > 0) {
            // Fallback: generic share
            if (navigator.share) {
                navigator.share({ title: 'Need Support', text: alertMessage }).catch(() => { });
            }
        }

        setVillageAlerted(true);
    }, [childName, emergencyContacts, trustedPeople]);

    // ============================================
    // SAVE DEBRIEF LOG
    // ============================================

    const saveDebriefLog = async () => {
        setSavingLog(true);
        try {
            await addLog({
                antecedent: debriefAntecedent || 'Crisis moment — logged from post-crisis debrief',
                behavior: debriefBehavior || 'See crisis debrief notes',
                consequence: debriefConsequence || 'Crisis mode activated in Giovanna',
                intensity: debriefIntensity,
                context: ['Crisis'],
                notes: `[Post-crisis debrief] ${initialMessage || ''}`,
                childId: activeChild?.id,
                childName: childName,
                functionHypothesis: debriefFunction,
                timestamp: new Date()
            });
            setPhase('logged');
        } catch (err) {
            console.error('Failed to save debrief log:', err);
        } finally {
            setSavingLog(false);
        }
    };

    // ============================================
    // BREATHING CIRCLE ANIMATION
    // ============================================

    const breathScale = breathState.phase === 'inhale' ? 1.4
        : breathState.phase === 'hold' ? 1.4
        : breathState.phase === 'exhale' ? 1.0
        : 1.0;

    const breathColor = breathState.phase === 'inhale' ? 'rgba(122, 158, 126, 0.4)'
        : breathState.phase === 'hold' ? 'rgba(212, 175, 55, 0.3)'
        : breathState.phase === 'exhale' ? 'rgba(107, 76, 154, 0.3)'
        : 'rgba(122, 158, 126, 0.2)';

    // ============================================
    // RENDER
    // ============================================

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
            display: 'flex', flexDirection: 'column',
            overflow: 'auto',
        }}>
            {/* Top Bar */}
            <div style={{
                padding: '16px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={20} color="#B85450" />
                    <span style={{
                        fontFamily: typography.heading, fontSize: '1.1rem',
                        fontWeight: 700, color: '#F5F0E8',
                    }}>
                        Crisis Support
                    </span>
                </div>
                <button onClick={onExit} style={{
                    padding: '8px 16px', borderRadius: '100px',
                    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(245,240,232,0.6)', fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: typography.body,
                }}>
                    {phase === 'logged' ? 'Done' : 'Exit'}
                </button>
            </div>

            {/* ============================================
                PHASE: ACTIVE CRISIS
            ============================================ */}
            {phase === 'active' && (
                <div style={{ flex: 1, padding: '32px 24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    {/* Opening message */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{
                            fontFamily: typography.heading, fontSize: '1.8rem',
                            fontWeight: 700, color: '#F5F0E8', marginBottom: '12px',
                            lineHeight: 1.2,
                        }}>
                            I hear you.<br />You are safe.
                        </h2>
                        <p style={{
                            fontFamily: typography.body, fontSize: '1rem',
                            color: 'rgba(245,240,232,0.6)', lineHeight: 1.6,
                        }}>
                            Let's take this one breath at a time.
                        </p>
                    </div>

                    {/* Calming strategies for child */}
                    <div style={{
                        background: 'rgba(184, 84, 80, 0.08)',
                        border: '1px solid rgba(184, 84, 80, 0.15)',
                        borderRadius: '20px', padding: '24px', marginBottom: '20px',
                    }}>
                        <h3 style={{
                            fontFamily: typography.body, fontSize: '0.82rem',
                            fontWeight: 700, color: '#B85450', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            Right now, for {childName}
                        </h3>
                        {calmingStrategies.length > 0 || sensoryTools.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {calmingStrategies.map((s: string, i: number) => (
                                    <div key={`calm-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Heart size={14} color="rgba(245,240,232,0.4)" />
                                        <span style={{ fontFamily: typography.body, fontSize: '0.95rem', color: '#F5F0E8', lineHeight: 1.5 }}>
                                            {s}
                                        </span>
                                    </div>
                                ))}
                                {sensoryTools.slice(0, 3).map((s: string, i: number) => (
                                    <div key={`tool-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Heart size={14} color="rgba(245,240,232,0.4)" />
                                        <span style={{ fontFamily: typography.body, fontSize: '0.95rem', color: '#F5F0E8', lineHeight: 1.5 }}>
                                            Offer: {s}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {['Deep pressure (tight hug if they accept)', 'Remove from overwhelming environment',
                                  'Lower your voice, slow your movements', 'Offer their favorite sensory tool'].map((s, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Heart size={14} color="rgba(245,240,232,0.4)" />
                                        <span style={{ fontFamily: typography.body, fontSize: '0.95rem', color: '#F5F0E8', lineHeight: 1.5 }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* For the parent */}
                    <div style={{
                        background: 'rgba(107, 76, 154, 0.08)',
                        border: '1px solid rgba(107, 76, 154, 0.15)',
                        borderRadius: '20px', padding: '24px', marginBottom: '20px',
                    }}>
                        <h3 style={{
                            fontFamily: typography.body, fontSize: '0.82rem',
                            fontWeight: 700, color: '#8B6CB8', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: '16px',
                        }}>
                            For you
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {['You are not failing. This is the hardest job in the world.',
                              'If you need to step away for 60 seconds, that\'s okay.',
                              'Your child is not giving you a hard time. They are having a hard time.'].map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Shield size={14} color="rgba(245,240,232,0.4)" style={{ marginTop: '3px' }} />
                                    <span style={{ fontFamily: typography.body, fontSize: '0.95rem', color: '#F5F0E8', lineHeight: 1.5 }}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
                        <button
                            onClick={() => { setBreathingActive(true); setPhase('breathing'); }}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px',
                                background: 'rgba(122, 158, 126, 0.15)',
                                border: '1px solid rgba(122, 158, 126, 0.25)',
                                color: '#A3C4A7', fontFamily: typography.body,
                                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            }}
                        >
                            <Wind size={20} /> Breathing Timer
                        </button>

                        <button
                            onClick={sendVillageAlert}
                            disabled={villageAlerted}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '16px',
                                background: villageAlerted ? 'rgba(122, 158, 126, 0.1)' : 'rgba(212, 175, 55, 0.12)',
                                border: `1px solid ${villageAlerted ? 'rgba(122, 158, 126, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`,
                                color: villageAlerted ? '#A3C4A7' : '#E8C97A', fontFamily: typography.body,
                                fontSize: '1rem', fontWeight: 700, cursor: villageAlerted ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            }}
                        >
                            {villageAlerted ? <><Check size={20} /> Village Alerted</> : <><Phone size={20} /> Alert My Village</>}
                        </button>

                        <button
                            onClick={() => setPhase('debrief')}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(245,240,232,0.5)', fontFamily: typography.body,
                                fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                        >
                            <Clock size={18} /> When you're ready: What Just Happened
                        </button>
                    </div>
                </div>
            )}

            {/* ============================================
                PHASE: BREATHING TIMER
            ============================================ */}
            {phase === 'breathing' && (
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
                }}>
                    {/* Breathing circle */}
                    <div style={{
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: breathColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: `scale(${breathScale})`,
                        transition: `all ${breathState.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        marginBottom: '40px',
                    }}>
                        <div style={{
                            width: '120px', height: '120px', borderRadius: '50%',
                            background: 'rgba(245,240,232,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Wind size={36} color="rgba(245,240,232,0.5)" />
                        </div>
                    </div>

                    {/* Breath label */}
                    <h2 style={{
                        fontFamily: typography.heading, fontSize: '1.6rem',
                        fontWeight: 700, color: '#F5F0E8', textAlign: 'center',
                        marginBottom: '8px',
                    }}>
                        {breathState.label}
                    </h2>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.88rem',
                        color: 'rgba(245,240,232,0.4)', marginBottom: '48px',
                    }}>
                        Cycle {breathState.cycle + 1}
                    </p>

                    {/* Exit breathing */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => { setBreathingActive(false); setPhase('active'); }} style={{
                            padding: '14px 28px', borderRadius: '100px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(245,240,232,0.6)', fontFamily: typography.body,
                            fontSize: '0.92rem', fontWeight: 600, cursor: 'pointer',
                        }}>
                            Back
                        </button>
                        <button onClick={() => { setBreathingActive(false); setPhase('debrief'); }} style={{
                            padding: '14px 28px', borderRadius: '100px',
                            background: 'rgba(212, 175, 55, 0.12)',
                            border: '1px solid rgba(212, 175, 55, 0.2)',
                            color: '#E8C97A', fontFamily: typography.body,
                            fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer',
                        }}>
                            I'm ready to debrief
                        </button>
                    </div>
                </div>
            )}

            {/* ============================================
                PHASE: POST-CRISIS DEBRIEF
            ============================================ */}
            {phase === 'debrief' && (
                <div style={{ flex: 1, padding: '32px 24px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <h2 style={{
                        fontFamily: typography.heading, fontSize: '1.5rem',
                        fontWeight: 700, color: '#F5F0E8', marginBottom: '8px',
                    }}>
                        What Just Happened
                    </h2>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.92rem',
                        color: 'rgba(245,240,232,0.5)', marginBottom: '32px', lineHeight: 1.6,
                    }}>
                        This creates an ABC log entry so Insight can learn from this moment.
                        Take your time — no rush.
                    </p>

                    {/* Antecedent */}
                    <label style={{ ...labelStyle }}>What was happening before?</label>
                    <textarea
                        value={debriefAntecedent}
                        onChange={(e) => setDebriefAntecedent(e.target.value)}
                        placeholder="e.g., We were trying to leave the park..."
                        rows={2}
                        style={{ ...inputStyle }}
                    />

                    {/* Behavior */}
                    <label style={{ ...labelStyle }}>What did {childName} do?</label>
                    <textarea
                        value={debriefBehavior}
                        onChange={(e) => setDebriefBehavior(e.target.value)}
                        placeholder="e.g., Started screaming, dropped to the ground..."
                        rows={2}
                        style={{ ...inputStyle }}
                    />

                    {/* Consequence */}
                    <label style={{ ...labelStyle }}>What happened next?</label>
                    <textarea
                        value={debriefConsequence}
                        onChange={(e) => setDebriefConsequence(e.target.value)}
                        placeholder="e.g., I gave them 5 more minutes, then carried them to the car..."
                        rows={2}
                        style={{ ...inputStyle }}
                    />

                    {/* Intensity */}
                    <label style={{ ...labelStyle }}>Intensity: {debriefIntensity}/10</label>
                    <input
                        type="range" min={1} max={10} value={debriefIntensity}
                        onChange={(e) => setDebriefIntensity(parseInt(e.target.value))}
                        style={{
                            width: '100%', marginBottom: '24px',
                            accentColor: '#B85450',
                        }}
                    />

                    {/* Function hypothesis */}
                    <label style={{ ...labelStyle }}>What do you think the behavior was communicating?</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
                        {([
                            { key: 'escape', label: 'Avoidance', emoji: '🚪' },
                            { key: 'attention', label: 'Connection', emoji: '🤝' },
                            { key: 'tangible', label: 'Access', emoji: '🎯' },
                            { key: 'sensory', label: 'Sensory', emoji: '✨' },
                        ] as { key: FunctionHypothesis; label: string; emoji: string }[]).map(f => (
                            <button
                                key={f.key}
                                onClick={() => setDebriefFunction(debriefFunction === f.key ? null : f.key)}
                                style={{
                                    padding: '10px 18px', borderRadius: '100px',
                                    background: debriefFunction === f.key ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${debriefFunction === f.key ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    color: debriefFunction === f.key ? '#E8C97A' : 'rgba(245,240,232,0.6)',
                                    fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: typography.body,
                                }}
                            >
                                {f.emoji} {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Save */}
                    <button
                        onClick={saveDebriefLog}
                        disabled={savingLog}
                        style={{
                            width: '100%', padding: '18px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #E8C97A 100%)',
                            border: 'none', color: '#1A1A1A', fontFamily: typography.body,
                            fontSize: '1rem', fontWeight: 700, cursor: savingLog ? 'default' : 'pointer',
                            opacity: savingLog ? 0.6 : 1,
                        }}
                    >
                        {savingLog ? 'Saving...' : 'Save to Capture Log'}
                    </button>
                </div>
            )}

            {/* ============================================
                PHASE: LOGGED CONFIRMATION
            ============================================ */}
            {phase === 'logged' && (
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(122, 158, 126, 0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '24px',
                    }}>
                        <Check size={36} color="#A3C4A7" />
                    </div>
                    <h2 style={{
                        fontFamily: typography.heading, fontSize: '1.5rem',
                        fontWeight: 700, color: '#F5F0E8', marginBottom: '12px',
                    }}>
                        Logged
                    </h2>
                    <p style={{
                        fontFamily: typography.body, fontSize: '1rem',
                        color: 'rgba(245,240,232,0.5)', lineHeight: 1.6,
                        maxWidth: '400px', marginBottom: '40px',
                    }}>
                        This moment is now part of {childName}'s story. Insight will use it to
                        find patterns and help you prepare for next time.
                    </p>
                    <button onClick={onExit} style={{
                        padding: '16px 36px', borderRadius: '100px',
                        background: 'rgba(107, 76, 154, 0.15)',
                        border: '1px solid rgba(107, 76, 154, 0.25)',
                        color: '#8B6CB8', fontFamily: typography.body,
                        fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    }}>
                        Return to Insight
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================
// SHARED STYLES
// ============================================

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(245,240,232,0.7)',
    marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#F5F0E8',
    fontSize: '0.92rem',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.5,
    resize: 'none',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box' as const,
};
