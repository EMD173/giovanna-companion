/**
 * Caregiver Wellness Page — "The Oxygen Mask"
 *
 * Phase 2B: Protect the parent, not just the child.
 * Weekly burnout check-in, trend visualization, proactive nudges,
 * and self-care suggestions calibrated to capacity.
 */

import { useState, useEffect } from 'react';
import {
    Heart, Battery, BatteryWarning, BatteryFull, Sun,
    Moon, TrendingDown, TrendingUp, Minus, Smile, Frown,
    Meh, Sparkles, Phone, Coffee, BookOpen
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, Timestamp
} from 'firebase/firestore';

interface WellnessCheckin {
    id: string;
    userId: string;
    emotional: number;   // 1-5
    physical: number;    // 1-5
    social: number;      // 1-5
    highlight?: string;
    createdAt: Timestamp;
}

const MOODS = [
    { score: 1, icon: Frown, label: 'Struggling', color: sanctuary.rose },
    { score: 2, icon: Frown, label: 'Tough', color: '#E88C68' },
    { score: 3, icon: Meh, label: 'Managing', color: sanctuary.gold },
    { score: 4, icon: Smile, label: 'Good', color: '#88C98A' },
    { score: 5, icon: Smile, label: 'Thriving', color: sanctuary.sage },
];

const SELF_CARE = {
    low: [
        { icon: Phone, text: 'Text a friend — even "hey" counts' },
        { icon: Coffee, text: 'Make yourself a warm drink' },
        { icon: Moon, text: '10-minute rest with eyes closed' },
    ],
    mid: [
        { icon: BookOpen, text: 'Read something not about parenting' },
        { icon: Sun, text: '15-minute walk outside' },
        { icon: Heart, text: 'Name 3 things that went right today' },
    ],
    high: [
        { icon: Sparkles, text: 'You\'re doing amazing. Notice that.' },
        { icon: Heart, text: 'Do something purely for joy today' },
        { icon: Sun, text: 'Share a win with your village' },
    ],
};

export function WellnessPage() {
    const { user } = useAuth();
    const [checkins, setCheckins] = useState<WellnessCheckin[]>([]);
    const [showCheckin, setShowCheckin] = useState(false);
    const [emotional, setEmotional] = useState(3);
    const [physical, setPhysical] = useState(3);
    const [social, setSocial] = useState(3);
    const [highlight, setHighlight] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Fetch checkin history
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'wellnessCheckins'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, (snap) => {
            const entries = snap.docs.map(d => ({ id: d.id, ...d.data() })) as WellnessCheckin[];
            setCheckins(entries);
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'wellnessCheckins'), {
                userId: user.uid,
                emotional, physical, social,
                highlight: highlight || null,
                createdAt: serverTimestamp(),
            });
            setSaved(true);
            setTimeout(() => { setSaved(false); setShowCheckin(false); }, 2000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Analytics
    const lastWeek = checkins.slice(0, 7);
    const avgScore = lastWeek.length > 0
        ? lastWeek.reduce((s, c) => s + (c.emotional + c.physical + c.social) / 3, 0) / lastWeek.length
        : 0;
    const batteryPercent = Math.round((avgScore / 5) * 100);
    const prevWeek = checkins.slice(7, 14);
    const prevAvg = prevWeek.length > 0
        ? prevWeek.reduce((s, c) => s + (c.emotional + c.physical + c.social) / 3, 0) / prevWeek.length
        : avgScore;
    const trend = avgScore > prevAvg ? 'up' : avgScore < prevAvg ? 'down' : 'stable';

    const selfCareLevel = avgScore <= 2 ? 'low' : avgScore <= 3.5 ? 'mid' : 'high';
    const suggestions = SELF_CARE[selfCareLevel];

    const BatteryIcon = batteryPercent < 30 ? BatteryWarning : batteryPercent > 70 ? BatteryFull : Battery;
    const batteryColor = batteryPercent < 30 ? sanctuary.rose : batteryPercent > 70 ? sanctuary.sage : sanctuary.gold;

    return (
        <div style={{
            background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px',
        }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2.2rem', fontWeight: 700,
                        color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '4px',
                    }}>Your Wellness</h1>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.95rem',
                        fontFamily: typography.body,
                    }}>You can't pour from an empty cup.</p>
                </div>

                {/* Battery Card */}
                <div style={{
                    background: sanctuary.bgCard, borderRadius: '24px',
                    border: `1px solid ${sanctuary.border}`, padding: '24px',
                    marginBottom: '16px', boxShadow: sanctuary.shadowMd,
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: `linear-gradient(90deg, ${batteryColor}, transparent)`,
                    }} />
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 700,
                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                color: sanctuary.textMuted, fontFamily: typography.body,
                            }}>YOUR BATTERY</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                                <span style={{
                                    fontSize: '3rem', fontWeight: 800,
                                    color: batteryColor, fontFamily: typography.heading,
                                }}>{lastWeek.length > 0 ? batteryPercent : '—'}%</span>
                                {lastWeek.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {trend === 'up' && <TrendingUp size={16} color={sanctuary.sage} />}
                                        {trend === 'down' && <TrendingDown size={16} color={sanctuary.rose} />}
                                        {trend === 'stable' && <Minus size={16} color={sanctuary.textMuted} />}
                                    </div>
                                )}
                            </div>
                        </div>
                        <BatteryIcon size={48} color={batteryColor} strokeWidth={1.5} />
                    </div>

                    {/* Battery Bar */}
                    <div style={{
                        height: '8px', borderRadius: '4px',
                        background: sanctuary.bgAlt, marginTop: '16px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', borderRadius: '4px',
                            background: `linear-gradient(90deg, ${batteryColor}, ${batteryColor}88)`,
                            width: `${lastWeek.length > 0 ? batteryPercent : 0}%`,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>

                {/* Check-In Button or Form */}
                {!showCheckin ? (
                    <button onClick={() => setShowCheckin(true)} style={{
                        width: '100%', padding: '18px',
                        borderRadius: '16px', marginBottom: '24px',
                        background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        color: '#fff', border: 'none', fontWeight: 700,
                        fontSize: '1rem', cursor: 'pointer', fontFamily: typography.body,
                        boxShadow: '0 4px 16px rgba(107, 76, 154, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        <Heart size={20} /> How are you today?
                    </button>
                ) : saved ? (
                    <div style={{
                        background: sanctuary.sageBg, borderRadius: '20px',
                        border: `1px solid ${sanctuary.sageBorder}`,
                        padding: '32px', textAlign: 'center', marginBottom: '24px',
                    }}>
                        <Sparkles size={32} color={sanctuary.sage} style={{ margin: '0 auto 12px' }} />
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.sage, marginBottom: '4px',
                        }}>Checked In ✓</h3>
                        <p style={{
                            color: sanctuary.textMuted, fontFamily: typography.body, fontSize: '0.88rem',
                        }}>Your wellness matters. Thank you for showing up for yourself.</p>
                    </div>
                ) : (
                    <div style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px', marginBottom: '24px',
                        boxShadow: sanctuary.shadowMd,
                    }}>
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.text, marginBottom: '20px', textAlign: 'center',
                        }}>Quick Check-In</h3>

                        {/* Emotional */}
                        <MoodSlider
                            label="Emotional Energy"
                            value={emotional}
                            onChange={setEmotional}
                        />

                        {/* Physical */}
                        <MoodSlider
                            label="Physical Energy"
                            value={physical}
                            onChange={setPhysical}
                        />

                        {/* Social */}
                        <MoodSlider
                            label="Connection Level"
                            value={social}
                            onChange={setSocial}
                        />

                        {/* Highlight */}
                        <div style={{ marginTop: '16px' }}>
                            <label style={{
                                display: 'block', fontSize: '0.82rem', fontWeight: 700,
                                color: sanctuary.textMuted, marginBottom: '6px', fontFamily: typography.body,
                            }}>One good thing today (optional)</label>
                            <input
                                type="text" value={highlight}
                                onChange={e => setHighlight(e.target.value)}
                                placeholder="Even something small..."
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: '10px',
                                    border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
                                    fontFamily: typography.body, fontSize: '0.9rem',
                                    color: sanctuary.text, outline: 'none', boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <button onClick={handleSave} disabled={saving} style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.sage}, #5A8A5E)`,
                            color: '#fff', border: 'none', fontWeight: 700,
                            fontSize: '0.95rem', cursor: saving ? 'default' : 'pointer',
                            marginTop: '20px', fontFamily: typography.body,
                            opacity: saving ? 0.5 : 1,
                        }}>
                            {saving ? 'Saving...' : 'Save Check-In'}
                        </button>
                    </div>
                )}

                {/* Self-Care Suggestions */}
                <div style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`, padding: '20px',
                    marginBottom: '16px', boxShadow: sanctuary.shadow,
                }}>
                    <h3 style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: sanctuary.textMuted, marginBottom: '14px', fontFamily: typography.body,
                    }}>Suggestions for You</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {suggestions.map(({ icon: Icon, text }, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px 14px', borderRadius: '12px',
                                background: sanctuary.bgAlt, border: `1px solid ${sanctuary.border}`,
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: sanctuary.purple, flexShrink: 0,
                                }}>
                                    <Icon size={16} />
                                </div>
                                <span style={{
                                    fontSize: '0.88rem', color: sanctuary.text,
                                    fontFamily: typography.body, fontWeight: 500,
                                }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* History */}
                {checkins.length > 0 && (
                    <div style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '20px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h3 style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: sanctuary.textMuted, marginBottom: '14px', fontFamily: typography.body,
                        }}>Recent Check-Ins</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {checkins.slice(0, 7).map((c, i) => {
                                const avg = (c.emotional + c.physical + c.social) / 3;
                                const mood = MOODS.find(m => m.score === Math.round(avg)) || MOODS[2];
                                const MoodIcon = mood.icon;
                                return (
                                    <div key={c.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 14px', borderRadius: '10px',
                                        background: i === 0 ? sanctuary.bgAlt : 'transparent',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <MoodIcon size={18} color={mood.color} />
                                            <span style={{
                                                fontSize: '0.85rem', fontWeight: 600,
                                                color: sanctuary.text, fontFamily: typography.body,
                                            }}>{mood.label}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem', color: sanctuary.textMuted,
                                            fontFamily: typography.body,
                                        }}>
                                            {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MoodSlider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '8px',
            }}>
                <span style={{
                    fontSize: '0.85rem', fontWeight: 700,
                    color: sanctuary.text, fontFamily: typography.body,
                }}>{label}</span>
                <span style={{
                    fontSize: '0.82rem', fontWeight: 700,
                    color: MOODS[value - 1].color, fontFamily: typography.body,
                }}>{MOODS[value - 1].label}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
                {MOODS.map(m => {
                    const Icon = m.icon;
                    return (
                        <button key={m.score} onClick={() => onChange(m.score)} style={{
                            flex: 1, padding: '10px 0', borderRadius: '10px',
                            border: value === m.score ? `2px solid ${m.color}` : `1px solid ${sanctuary.border}`,
                            background: value === m.score ? `${m.color}12` : sanctuary.bgCard,
                            cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            transition: 'all 0.15s ease',
                        }}>
                            <Icon size={20} color={value === m.score ? m.color : sanctuary.textMuted} />
                            <span style={{
                                fontSize: '0.55rem', fontWeight: 700,
                                color: value === m.score ? m.color : sanctuary.textMuted,
                                fontFamily: typography.body,
                            }}>{m.score}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
