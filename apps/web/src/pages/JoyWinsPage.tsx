/**
 * Joy & Wins Stream — "The Light"
 *
 * Phase 3B: Counter deficit-focused narratives.
 * A social-media-style feed of positive moments, breakthroughs, and joys.
 * Parents spend so much time tracking problems — this celebrates progress.
 */

import { useState, useEffect } from 'react';
import {
    Sparkles, Heart, Star, Trophy, Sun,
    PartyPopper, X
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import { db } from '../lib/firebase';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, Timestamp
} from 'firebase/firestore';

interface WinEntry {
    id: string;
    userId: string;
    childName: string;
    content: string;
    category: 'milestone' | 'breakthrough' | 'joy' | 'gratitude' | 'first';
    createdAt: Timestamp;
}

const CATEGORIES = [
    { key: 'milestone', label: 'Milestone', icon: Trophy, color: sanctuary.gold, bg: sanctuary.goldBg, border: sanctuary.goldBorder },
    { key: 'breakthrough', label: 'Breakthrough', icon: Star, color: sanctuary.purple, bg: sanctuary.purpleBg, border: sanctuary.purpleBorder },
    { key: 'joy', label: 'Joy Moment', icon: Sun, color: sanctuary.sage, bg: sanctuary.sageBg, border: sanctuary.sageBorder },
    { key: 'gratitude', label: 'Gratitude', icon: Heart, color: sanctuary.rose, bg: sanctuary.roseBg, border: sanctuary.roseBorder },
    { key: 'first', label: 'First time!', icon: PartyPopper, color: '#E88C68', bg: '#FFF3E0', border: '#FFE0B2' },
] as const;

export function JoyWinsPage() {
    const { user } = useAuth();
    const { activeChild } = useFamily();
    const [wins, setWins] = useState<WinEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<WinEntry['category']>('joy');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'joyWins'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, snap => {
            setWins(snap.docs.map(d => ({ id: d.id, ...d.data() })) as WinEntry[]);
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user || !content.trim()) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'joyWins'), {
                userId: user.uid,
                childName: activeChild?.preferredName || activeChild?.firstName || 'My child',
                content: content.trim(),
                category,
                createdAt: serverTimestamp(),
            });
            setShowForm(false);
            setContent('');
            setCategory('joy');
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const streak = calculateStreak(wins);

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
                    }}>Joy & Wins ✨</h1>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.95rem', fontFamily: typography.body,
                    }}>Because progress isn't always in the data.</p>
                </div>

                {/* Streak + Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div style={{
                        background: sanctuary.goldBg, borderRadius: '16px',
                        border: `1px solid ${sanctuary.goldBorder}`, padding: '16px',
                        textAlign: 'center',
                    }}>
                        <span style={{
                            fontSize: '2rem', fontWeight: 800, color: sanctuary.gold,
                            fontFamily: typography.heading,
                        }}>{streak}</span>
                        <span style={{
                            display: 'block', fontSize: '0.68rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: sanctuary.gold, fontFamily: typography.body, opacity: 0.7,
                        }}>Day Streak</span>
                    </div>
                    <div style={{
                        background: sanctuary.purpleBg, borderRadius: '16px',
                        border: `1px solid ${sanctuary.purpleBorder}`, padding: '16px',
                        textAlign: 'center',
                    }}>
                        <span style={{
                            fontSize: '2rem', fontWeight: 800, color: sanctuary.purple,
                            fontFamily: typography.heading,
                        }}>{wins.length}</span>
                        <span style={{
                            display: 'block', fontSize: '0.68rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: sanctuary.purple, fontFamily: typography.body, opacity: 0.7,
                        }}>Total Wins</span>
                    </div>
                </div>

                {/* Add Win */}
                {!showForm ? (
                    <button onClick={() => setShowForm(true)} style={{
                        width: '100%', padding: '18px', borderRadius: '16px',
                        background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                        color: '#1A1A1A', border: 'none', fontWeight: 700, fontSize: '1rem',
                        cursor: 'pointer', fontFamily: typography.body,
                        boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginBottom: '24px',
                    }}>
                        <Sparkles size={20} /> Capture a Win
                    </button>
                ) : (
                    <div style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '24px',
                        marginBottom: '24px', boxShadow: sanctuary.shadowMd,
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            marginBottom: '16px',
                        }}>
                            <h3 style={{
                                fontFamily: typography.heading, fontWeight: 700,
                                color: sanctuary.text, fontSize: '1.1rem',
                            }}>What happened? ✨</h3>
                            <button onClick={() => setShowForm(false)} style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: sanctuary.bgAlt, border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.textMuted, cursor: 'pointer',
                            }}><X size={16} /></button>
                        </div>

                        {/* Category Chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                return (
                                    <button key={cat.key} onClick={() => setCategory(cat.key)} style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px', borderRadius: '100px',
                                        background: category === cat.key ? cat.bg : sanctuary.bgAlt,
                                        border: `1px solid ${category === cat.key ? cat.border : sanctuary.border}`,
                                        color: category === cat.key ? cat.color : sanctuary.textMuted,
                                        fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                        fontFamily: typography.body,
                                    }}>
                                        <Icon size={14} /> {cat.label}
                                    </button>
                                );
                            })}
                        </div>

                        <textarea
                            value={content} onChange={e => setContent(e.target.value)}
                            placeholder="Today was special because..."
                            rows={3}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
                                fontFamily: typography.body, fontSize: '0.92rem',
                                color: sanctuary.text, outline: 'none', boxSizing: 'border-box',
                                resize: 'vertical',
                            }}
                        />

                        <button onClick={handleSave} disabled={saving || !content.trim()} style={{
                            width: '100%', padding: '14px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            color: '#1A1A1A', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                            cursor: (saving || !content.trim()) ? 'default' : 'pointer',
                            marginTop: '12px', fontFamily: typography.body,
                            opacity: (saving || !content.trim()) ? 0.5 : 1,
                        }}>{saving ? 'Saving...' : '✨ Save This Win'}</button>
                    </div>
                )}

                {/* Wins Feed */}
                {wins.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {wins.map(win => {
                            const cat = CATEGORIES.find(c => c.key === win.category) || CATEGORIES[2];
                            const Icon = cat.icon;
                            const date = win.createdAt?.toDate?.()
                                ? win.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : '';
                            return (
                                <div key={win.id} style={{
                                    background: sanctuary.bgCard, borderRadius: '16px',
                                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                                    boxShadow: sanctuary.shadow,
                                    position: 'relative', overflow: 'hidden',
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                        background: `linear-gradient(90deg, transparent, ${cat.color}40, transparent)`,
                                    }} />
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
                                    }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '10px',
                                            background: cat.bg, border: `1px solid ${cat.border}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: cat.color,
                                        }}>
                                            <Icon size={16} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{
                                                fontWeight: 700, color: cat.color, fontSize: '0.78rem',
                                                fontFamily: typography.body,
                                            }}>{cat.label}</span>
                                            <span style={{
                                                float: 'right', fontSize: '0.75rem',
                                                color: sanctuary.textMuted, fontFamily: typography.body,
                                            }}>{date}</span>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '0.92rem', color: sanctuary.text, lineHeight: 1.6,
                                        fontFamily: typography.body,
                                    }}>{win.content}</p>
                                    <span style={{
                                        display: 'block', textAlign: 'right', fontSize: '0.78rem',
                                        color: sanctuary.textMuted, fontFamily: typography.body,
                                        fontStyle: 'italic', marginTop: '8px',
                                    }}>— about {win.childName}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : !showForm && (
                    <div style={{
                        textAlign: 'center', padding: '48px 24px',
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        <Sparkles size={48} style={{ color: sanctuary.goldBorder, margin: '0 auto 16px' }} />
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.text, marginBottom: '8px',
                        }}>Start your Joy Journal</h3>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.9rem',
                            fontFamily: typography.body,
                        }}>Capture the moments that light up your world.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function calculateStreak(wins: WinEntry[]): number {
    if (wins.length === 0) return 0;
    let streak = 0;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < 365; i++) {
        const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const hasEntry = wins.some(w => {
            if (!w.createdAt?.toDate) return false;
            const d = w.createdAt.toDate();
            return d.toDateString() === day.toDateString();
        });
        if (hasEntry) streak++;
        else if (i > 0) break; // Allow missing today
    }
    return streak;
}
