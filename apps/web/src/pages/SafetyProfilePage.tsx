import { useState, useEffect } from 'react';
import { Shield, MessageSquare, Save, Edit2, Copy, Check } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type SafetyProfile, COMMON_TRIGGERS, COMMON_COMFORTS, DEFAULT_SCRIPT } from '../types/safety';
import { showToast } from '../components/Toast';
import { sanctuary, typography } from '../shared/theme';

export function SafetyProfilePage() {
    const { activeChild } = useFamily();
    const [profile, setProfile] = useState<SafetyProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            if (!activeChild) { setLoading(false); return; }
            try {
                const docRef = doc(db, 'children', activeChild.id, 'safetyProfile', 'current');
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setProfile(snap.data() as SafetyProfile);
                } else {
                    setProfile({
                        id: activeChild.id, updatedAt: null, diagnosis: '',
                        communicationStyle: '', triggers: [], comforts: [],
                        emergencyScript: DEFAULT_SCRIPT.replace('[Name]', activeChild.firstName || 'my child'),
                        emergencyContacts: []
                    });
                    setIsEditing(true);
                }
            } catch (err) {
                console.error(err);
                showToast('Error loading profile', 'error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [activeChild]);

    const handleSave = async () => {
        if (!activeChild || !profile) return;
        try {
            await setDoc(doc(db, 'children', activeChild.id, 'safetyProfile', 'current'), {
                ...profile, updatedAt: serverTimestamp()
            });
            setIsEditing(false);
            showToast('Safety Profile Saved', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to save', 'error');
        }
    };

    const toggleArrayItem = (field: 'triggers' | 'comforts', item: string) => {
        if (!profile) return;
        const current = profile[field];
        setProfile({
            ...profile,
            [field]: current.includes(item) ? current.filter(i => i !== item) : [...current, item]
        });
    };

    const copyScript = () => {
        if (!profile) return;
        navigator.clipboard.writeText(profile.emergencyScript);
        showToast('Script copied to clipboard', 'success');
    };

    if (loading) return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>Loading Safety Profile...</p>
        </div>
    );
    if (!activeChild || !profile) return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>Please select a child profile first.</p>
        </div>
    );

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
        color: sanctuary.text, fontSize: '0.92rem', fontFamily: typography.body,
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <header className="sanctuary-enter" style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '28px',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2.2rem',
                            fontWeight: 700, color: sanctuary.text,
                            letterSpacing: '-0.02em', marginBottom: '4px',
                            display: 'flex', alignItems: 'center', gap: '12px',
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '14px',
                                background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.rose,
                            }}><Shield size={22} /></div>
                            Safety Profile
                        </h1>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.95rem',
                            fontFamily: typography.body,
                        }}>F.A.C.E.S Model for First Responders</p>
                    </div>
                    <button
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px', borderRadius: '12px',
                            background: isEditing
                                ? `linear-gradient(135deg, ${sanctuary.sage}, #5C8A60)`
                                : sanctuary.bgCard,
                            color: isEditing ? '#fff' : sanctuary.textSecondary,
                            border: isEditing ? 'none' : `1px solid ${sanctuary.border}`,
                            fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                            fontFamily: typography.body,
                            boxShadow: isEditing ? '0 4px 16px rgba(122, 158, 126, 0.3)' : 'none',
                        }}
                    >
                        {isEditing ? <><Save size={16} /> Save Profile</> : <><Edit2 size={16} /> Edit</>}
                    </button>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Facts (Identity) */}
                    <section className="sanctuary-enter sanctuary-enter-1 sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            fontSize: '1.1rem', color: sanctuary.text,
                            marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: sanctuary.sageBg, color: sanctuary.sage, fontSize: '0.9rem',
                            }}>📋</span>
                            Facts (Identity)
                        </h2>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: sanctuary.textSecondary, marginBottom: '6px', fontFamily: typography.body }}>Diagnosis / Neurotype</label>
                                    <input type="text" value={profile.diagnosis} onChange={e => setProfile({ ...profile, diagnosis: e.target.value })} placeholder="e.g. Autistic, ADHD, Non-Speaking" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: sanctuary.textSecondary, marginBottom: '6px', fontFamily: typography.body }}>Communication Style</label>
                                    <input type="text" value={profile.communicationStyle} onChange={e => setProfile({ ...profile, communicationStyle: e.target.value })} placeholder="e.g. Uses AAC, Gestures, Scripting" style={inputStyle} />
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div style={{ background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`, borderRadius: '12px', padding: '14px' }}>
                                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: sanctuary.sage, marginBottom: '4px', fontFamily: typography.body }}>Diagnosis</span>
                                    <p style={{ fontWeight: 600, color: sanctuary.text, fontFamily: typography.body, fontSize: '0.92rem' }}>{profile.diagnosis || 'Not listed'}</p>
                                </div>
                                <div style={{ background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`, borderRadius: '12px', padding: '14px' }}>
                                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: sanctuary.sage, marginBottom: '4px', fontFamily: typography.body }}>Communication</span>
                                    <p style={{ fontWeight: 600, color: sanctuary.text, fontFamily: typography.body, fontSize: '0.92rem' }}>{profile.communicationStyle || 'Not listed'}</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Anxiety (Triggers) */}
                    <section className="sanctuary-enter sanctuary-enter-2 sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            fontSize: '1.1rem', color: sanctuary.text,
                            marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: sanctuary.goldBg, color: sanctuary.gold, fontSize: '0.9rem',
                            }}>⚠️</span>
                            Anxiety (Triggers)
                        </h2>
                        <p style={{ color: sanctuary.textMuted, fontSize: '0.85rem', fontFamily: typography.body, marginBottom: '16px' }}>
                            What might escalate a situation?
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {isEditing ? COMMON_TRIGGERS.map(t => (
                                <button key={t} onClick={() => toggleArrayItem('triggers', t)} style={{
                                    padding: '8px 14px', borderRadius: '100px',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: typography.body, transition: 'all 0.15s',
                                    background: profile.triggers.includes(t) ? sanctuary.goldBg : sanctuary.bgCard,
                                    border: `1px solid ${profile.triggers.includes(t) ? sanctuary.goldBorder : sanctuary.border}`,
                                    color: profile.triggers.includes(t) ? sanctuary.gold : sanctuary.textMuted,
                                }}>
                                    {profile.triggers.includes(t) && <Check size={12} style={{ marginRight: '4px', display: 'inline' }} />}
                                    {t}
                                </button>
                            )) : (
                                profile.triggers.length > 0 ? profile.triggers.map(t => (
                                    <span key={t} style={{
                                        padding: '6px 12px', borderRadius: '100px',
                                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                        color: sanctuary.gold, fontSize: '0.85rem', fontWeight: 600,
                                        fontFamily: typography.body,
                                    }}>{t}</span>
                                )) : <span style={{ color: sanctuary.textMuted, fontStyle: 'italic', fontFamily: typography.body }}>No triggers listed</span>
                            )}
                        </div>
                    </section>

                    {/* Comfort (Strategies) */}
                    <section className="sanctuary-enter sanctuary-enter-3 sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            fontSize: '1.1rem', color: sanctuary.text,
                            marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                background: sanctuary.sageBg, color: sanctuary.sage, fontSize: '0.9rem',
                            }}>💚</span>
                            Comfort (Strategies)
                        </h2>
                        <p style={{ color: sanctuary.textMuted, fontSize: '0.85rem', fontFamily: typography.body, marginBottom: '16px' }}>
                            What helps calm them down?
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {isEditing ? COMMON_COMFORTS.map(c => (
                                <button key={c} onClick={() => toggleArrayItem('comforts', c)} style={{
                                    padding: '8px 14px', borderRadius: '100px',
                                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: typography.body, transition: 'all 0.15s',
                                    background: profile.comforts.includes(c) ? sanctuary.sageBg : sanctuary.bgCard,
                                    border: `1px solid ${profile.comforts.includes(c) ? sanctuary.sageBorder : sanctuary.border}`,
                                    color: profile.comforts.includes(c) ? sanctuary.sage : sanctuary.textMuted,
                                }}>
                                    {profile.comforts.includes(c) && <Check size={12} style={{ marginRight: '4px', display: 'inline' }} />}
                                    {c}
                                </button>
                            )) : (
                                profile.comforts.length > 0 ? profile.comforts.map(c => (
                                    <span key={c} style={{
                                        padding: '6px 12px', borderRadius: '100px',
                                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                        color: sanctuary.sage, fontSize: '0.85rem', fontWeight: 600,
                                        fontFamily: typography.body,
                                    }}>{c}</span>
                                )) : <span style={{ color: sanctuary.textMuted, fontStyle: 'italic', fontFamily: typography.body }}>No strategies listed</span>
                            )}
                        </div>
                    </section>

                    {/* Emergency Script */}
                    <section className="sanctuary-enter sanctuary-enter-4 sanctuary-card" style={{
                        background: '#1A1A1A', borderRadius: '20px',
                        padding: '24px', color: '#F5F0E8',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.gold}50, transparent)`,
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <h2 style={{
                                fontFamily: typography.heading, fontWeight: 700,
                                fontSize: '1.1rem', color: '#F5F0E8',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}>
                                <MessageSquare size={18} /> Emergency Script
                            </h2>
                            <button onClick={copyScript} style={{
                                padding: '8px 12px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.1)', border: 'none',
                                cursor: 'pointer', color: '#F5F0E8',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.78rem', fontWeight: 600, fontFamily: typography.body,
                            }}>
                                <Copy size={14} /> Copy
                            </button>
                        </div>
                        {isEditing ? (
                            <textarea
                                value={profile.emergencyScript}
                                onChange={e => setProfile({ ...profile, emergencyScript: e.target.value })}
                                style={{
                                    width: '100%', minHeight: '160px',
                                    background: 'rgba(255,255,255,0.08)', color: '#F5F0E8',
                                    padding: '16px', borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    fontFamily: 'monospace', fontSize: '0.88rem',
                                    lineHeight: 1.7, resize: 'vertical',
                                    outline: 'none', boxSizing: 'border-box',
                                }}
                            />
                        ) : (
                            <div style={{
                                background: 'rgba(255,255,255,0.06)', padding: '16px',
                                borderRadius: '12px', fontFamily: 'monospace',
                                fontSize: '0.88rem', lineHeight: 1.7,
                                whiteSpace: 'pre-wrap',
                                borderLeft: `3px solid ${sanctuary.gold}`,
                            }}>
                                {profile.emergencyScript}
                            </div>
                        )}
                        <p style={{
                            color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem',
                            fontFamily: typography.body, marginTop: '16px',
                        }}>
                            * Show this screen or read aloud to First Responders.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
