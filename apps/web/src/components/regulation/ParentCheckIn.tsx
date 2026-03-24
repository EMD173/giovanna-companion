import { useState, useEffect } from 'react';
import { Wind, HeartPulse, Check } from 'lucide-react';
import { MOOD_OPTIONS } from '../../types/regulation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { sanctuary, typography } from '../../shared/theme';

export function ParentCheckIn() {
    const { user } = useAuth();
    const [step, setStep] = useState<'start' | 'breathing' | 'logging' | 'complete'>('start');
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    useEffect(() => {
        let interval: any;
        if (step === 'breathing' && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (step === 'breathing' && timeLeft === 0) {
            setStep('logging');
        }
        return () => clearInterval(interval);
    }, [step, timeLeft]);

    const handleStart = () => {
        setStep('breathing');
        setTimeLeft(10);
    };

    const handleLog = async () => {
        if (!user || !selectedMood) return;
        try {
            await addDoc(collection(db, 'users', user.uid, 'regulationLogs'), {
                timestamp: serverTimestamp(),
                mood: selectedMood,
                actionTaken: '10s Breathing Check-in'
            });
            setStep('complete');
            setTimeout(() => { setStep('start'); setSelectedMood(null); }, 3000);
        } catch (error) {
            console.error("Error logging check-in:", error);
        }
    };

    if (step === 'start') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
            }}>
                <div>
                    <h3 style={{
                        fontFamily: typography.heading,
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: sanctuary.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                    }}>
                        <HeartPulse size={18} color={sanctuary.rose} /> Check Yourself
                    </h3>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '0.88rem',
                        fontFamily: typography.body,
                        maxWidth: '320px',
                    }}>
                        Your calm is their calm. Take 10 seconds before you engage.
                    </p>
                </div>
                <button
                    onClick={handleStart}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        borderRadius: '100px',
                        border: 'none',
                        background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(107, 76, 154, 0.25)',
                        fontFamily: typography.body,
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Wind size={16} /> Breathe (10s)
                </button>
            </div>
        );
    }

    if (step === 'breathing') {
        return (
            <div style={{
                background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                borderRadius: '16px',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120px', height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    animation: 'gentlePulse 2s ease-in-out infinite',
                }} />
                <h3 style={{
                    fontSize: '2.5rem', fontWeight: 700,
                    position: 'relative', zIndex: 1,
                    fontFamily: typography.heading,
                }}>{timeLeft}</h3>
                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    position: 'relative', zIndex: 1,
                    marginTop: '8px',
                    fontFamily: typography.body,
                }}>Inhale... Exhale...</p>
            </div>
        );
    }

    if (step === 'logging') {
        return (
            <div>
                <h3 style={{
                    fontFamily: typography.heading,
                    fontWeight: 700,
                    textAlign: 'center',
                    color: sanctuary.text,
                    marginBottom: '16px',
                }}>How are you feeling right now?</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    marginBottom: '16px',
                }}>
                    {MOOD_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedMood(option.value)}
                            style={{
                                padding: '10px 8px',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontFamily: typography.body,
                                border: selectedMood === option.value
                                    ? `2px solid ${sanctuary.purple}`
                                    : `1px solid ${sanctuary.border}`,
                                background: selectedMood === option.value
                                    ? sanctuary.purpleBg
                                    : sanctuary.bgAlt,
                                color: selectedMood === option.value
                                    ? sanctuary.purple
                                    : sanctuary.textSecondary,
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleLog}
                    disabled={!selectedMood}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: selectedMood
                            ? `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`
                            : '#D1CCC5',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: selectedMood ? 'pointer' : 'default',
                        opacity: selectedMood ? 1 : 0.5,
                        fontFamily: typography.body,
                    }}
                >Log & Continue</button>
            </div>
        );
    }

    return (
        <div style={{
            background: sanctuary.sageBg,
            borderRadius: '16px',
            border: `1px solid ${sanctuary.sageBorder}`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
        }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: sanctuary.sage + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '8px',
            }}>
                <Check size={24} color={sanctuary.sage} />
            </div>
            <p style={{
                fontFamily: typography.heading, fontWeight: 700,
                color: sanctuary.sage,
            }}>You are grounded.</p>
        </div>
    );
}
