/**
 * Healthcare Defense Toolkit — "The Shield"
 *
 * Phase 4A: Arm families with tools against medical gaslighting,
 * FII accusations, and healthcare discrimination.
 *
 * Time-stamped medical visit journal, accommodation request generator,
 * and "Know Your Rights" library.
 */

import { useState, useEffect } from 'react';
import {
    Shield, Plus, Calendar, FileText,
    ChevronRight, Check
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, Timestamp
} from 'firebase/firestore';

interface MedicalVisit {
    id: string;
    userId: string;
    date: string;
    provider: string;
    facility?: string;
    purpose: string;
    whatWasSaid: string;
    whatWasDecided: string;
    concerns?: string;
    createdAt: Timestamp;
}

const RIGHTS = [
    { title: 'Right to Refuse Treatment', description: 'You can refuse any treatment for your child and request alternatives.' },
    { title: 'Right to a Second Opinion', description: 'Insurance must cover second opinions. You never need permission to seek one.' },
    { title: 'Right to Medical Records', description: 'HIPAA guarantees access within 30 days. Request in writing.' },
    { title: 'Right to Language Access', description: 'Hospitals must provide interpreters at no cost under Title VI.' },
    { title: 'Right to Informed Consent', description: 'Every procedure and medication must be fully explained before you agree.' },
    { title: 'Right to a Patient Advocate', description: 'Every hospital has a patient advocate. You can request one at any time.' },
    { title: 'Protection from FII Accusations', description: 'Document everything. Bring a witness. Record visits where legal. Keep a paper trail.' },
    { title: 'ADA Accommodations', description: 'Your child has the right to accommodations in any healthcare setting under the ADA.' },
];

const ACCOMMODATION_TEMPLATES = [
    { title: 'Sensory Accommodations', content: 'Dear [Provider],\n\nMy child, [Name], has sensory processing differences. Please accommodate:\n\n• Dim lighting in waiting/exam rooms when possible\n• Advance notice before any physical contact\n• Allow noise-canceling headphones during procedures\n• Minimize wait time (sensory overload increases with time)\n• Allow comfort items (specify: ___)\n\nThank you for supporting an inclusive healthcare experience.' },
    { title: 'Communication Accommodations', content: 'Dear [Provider],\n\nMy child, [Name], communicates via [AAC device/sign language/limited verbal]. Please:\n\n• Allow extra time for responses\n• Address my child directly, not just me\n• Use simple, concrete language\n• Provide visual supports when available\n• Allow their communication device during all interactions\n\nSpeak TO my child, not ABOUT them.' },
    { title: 'Procedure Preparation', content: 'Dear [Provider],\n\nMy child, [Name], requires advance preparation for medical procedures. Please:\n\n• Mail/email a visual social story about the visit beforehand\n• Allow a pre-visit to see the room and equipment\n• Use a countdown for any procedures\n• Allow [calming strategy: ___] during the procedure\n• Schedule first appointment of the day to minimize wait\n\nThese accommodations significantly reduce anxiety and improve cooperation.' },
];

export function HealthcareDefensePage() {
    const { user } = useAuth();
    const [visits, setVisits] = useState<MedicalVisit[]>([]);
    const [activeTab, setActiveTab] = useState<'journal' | 'rights' | 'templates'>('journal');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        provider: '', facility: '', purpose: '',
        whatWasSaid: '', whatWasDecided: '', concerns: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'medicalJournal'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, snap => {
            setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() })) as MedicalVisit[]);
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user || !formData.provider) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'medicalJournal'), {
                userId: user.uid, ...formData,
                createdAt: serverTimestamp(),
            });
            setShowForm(false);
            setFormData({ date: new Date().toISOString().split('T')[0], provider: '', facility: '', purpose: '', whatWasSaid: '', whatWasDecided: '', concerns: '' });
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const TABS = [
        { key: 'journal' as const, label: 'Visit Journal' },
        { key: 'rights' as const, label: 'Your Rights' },
        { key: 'templates' as const, label: 'Templates' },
    ];

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.rose}, #8B2020)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Shield size={22} color="#fff" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em',
                        }}>Healthcare Defense</h1>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.92rem',
                        fontFamily: typography.body, marginLeft: '56px',
                    }}>Document. Know your rights. Protect your family.</p>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', gap: '4px', marginBottom: '20px',
                    background: sanctuary.bgAlt, borderRadius: '12px', padding: '4px',
                }}>
                    {TABS.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            flex: 1, padding: '10px', borderRadius: '10px',
                            background: activeTab === tab.key ? sanctuary.bgCard : 'transparent',
                            border: activeTab === tab.key ? `1px solid ${sanctuary.border}` : '1px solid transparent',
                            color: activeTab === tab.key ? sanctuary.text : sanctuary.textMuted,
                            fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                            fontFamily: typography.body,
                            boxShadow: activeTab === tab.key ? sanctuary.shadow : 'none',
                        }}>{tab.label}</button>
                    ))}
                </div>

                {/* Journal Tab */}
                {activeTab === 'journal' && (
                    <>
                        {!showForm ? (
                            <button onClick={() => setShowForm(true)} style={{
                                width: '100%', padding: '16px', borderRadius: '14px',
                                background: sanctuary.bgCard, border: `2px dashed ${sanctuary.border}`,
                                color: sanctuary.textMuted, fontWeight: 700, fontSize: '0.92rem',
                                cursor: 'pointer', fontFamily: typography.body, marginBottom: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                <Plus size={18} /> Log Medical Visit
                            </button>
                        ) : (
                            <div style={{
                                background: sanctuary.bgCard, borderRadius: '20px',
                                border: `1px solid ${sanctuary.border}`, padding: '24px',
                                marginBottom: '16px', boxShadow: sanctuary.shadowMd,
                            }}>
                                <h3 style={{
                                    fontFamily: typography.heading, fontWeight: 700, fontSize: '1.1rem',
                                    color: sanctuary.text, marginBottom: '16px',
                                }}>Medical Visit Record</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <div>
                                        <label style={labelStyle}>Date</label>
                                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Provider</label>
                                        <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} placeholder="Dr. Name" style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>Facility</label>
                                    <input type="text" value={formData.facility} onChange={e => setFormData({...formData, facility: e.target.value})} placeholder="Hospital / Clinic name" style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>Purpose of Visit</label>
                                    <input type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} placeholder="What was this visit for?" style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>What Was Said (document exactly)</label>
                                    <textarea value={formData.whatWasSaid} onChange={e => setFormData({...formData, whatWasSaid: e.target.value})} placeholder="Record what providers told you..." rows={3} style={{...inputStyle, resize: 'vertical'}} />
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={labelStyle}>What Was Decided</label>
                                    <textarea value={formData.whatWasDecided} onChange={e => setFormData({...formData, whatWasDecided: e.target.value})} placeholder="Treatment plan, next steps..." rows={2} style={{...inputStyle, resize: 'vertical'}} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Concerns (private — for your records only)</label>
                                    <textarea value={formData.concerns} onChange={e => setFormData({...formData, concerns: e.target.value})} placeholder="Any concerns about the visit..." rows={2} style={{...inputStyle, resize: 'vertical'}} />
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setShowForm(false)} style={{
                                        flex: 1, padding: '12px', borderRadius: '10px',
                                        background: 'none', border: `1px solid ${sanctuary.border}`,
                                        color: sanctuary.textMuted, fontWeight: 600, cursor: 'pointer', fontFamily: typography.body,
                                    }}>Cancel</button>
                                    <button onClick={handleSave} disabled={saving || !formData.provider} style={{
                                        flex: 1, padding: '12px', borderRadius: '10px',
                                        background: `linear-gradient(135deg, ${sanctuary.rose}, #8B2020)`,
                                        color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
                                        fontFamily: typography.body, opacity: (saving || !formData.provider) ? 0.5 : 1,
                                    }}>Save Record</button>
                                </div>
                            </div>
                        )}

                        {/* Visit History */}
                        {visits.map(visit => (
                            <div key={visit.id} style={{
                                background: sanctuary.bgCard, borderRadius: '16px',
                                border: `1px solid ${sanctuary.border}`, padding: '16px',
                                marginBottom: '10px', boxShadow: sanctuary.shadow,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{
                                            fontFamily: typography.body, fontWeight: 700, fontSize: '0.95rem',
                                            color: sanctuary.text, marginBottom: '2px',
                                        }}>{visit.provider}</h4>
                                        <span style={{ color: sanctuary.textMuted, fontSize: '0.78rem', fontFamily: typography.body }}>
                                            {visit.facility}
                                        </span>
                                    </div>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '4px',
                                        color: sanctuary.textMuted, fontSize: '0.78rem', fontFamily: typography.body,
                                    }}>
                                        <Calendar size={12} /> {visit.date}
                                    </span>
                                </div>
                                {visit.purpose && <p style={{ fontSize: '0.82rem', color: sanctuary.textSecondary, fontFamily: typography.body, marginBottom: '6px' }}><strong>Purpose:</strong> {visit.purpose}</p>}
                                {visit.whatWasSaid && <p style={{ fontSize: '0.82rem', color: sanctuary.textSecondary, fontFamily: typography.body, marginBottom: '6px', lineHeight: 1.5 }}><strong>Said:</strong> {visit.whatWasSaid}</p>}
                                {visit.whatWasDecided && <p style={{ fontSize: '0.82rem', color: sanctuary.textSecondary, fontFamily: typography.body, lineHeight: 1.5 }}><strong>Decided:</strong> {visit.whatWasDecided}</p>}
                            </div>
                        ))}
                    </>
                )}

                {/* Rights Tab */}
                {activeTab === 'rights' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {RIGHTS.map((right, i) => (
                            <div key={i} style={{
                                background: sanctuary.bgCard, borderRadius: '16px',
                                border: `1px solid ${sanctuary.border}`, padding: '16px',
                                boxShadow: sanctuary.shadow,
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px',
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: sanctuary.sage,
                                    }}>
                                        <Check size={14} />
                                    </div>
                                    <h4 style={{
                                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.92rem',
                                        color: sanctuary.text,
                                    }}>{right.title}</h4>
                                </div>
                                <p style={{
                                    fontSize: '0.82rem', color: sanctuary.textSecondary,
                                    fontFamily: typography.body, lineHeight: 1.5, paddingLeft: '38px',
                                }}>{right.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Templates Tab */}
                {activeTab === 'templates' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {ACCOMMODATION_TEMPLATES.map((tmpl, i) => (
                            <TemplateCard key={i} title={tmpl.title} content={tmpl.content} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TemplateCard({ title, content }: { title: string; content: string }) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            background: sanctuary.bgCard, borderRadius: '16px',
            border: `1px solid ${sanctuary.border}`, overflow: 'hidden',
            boxShadow: sanctuary.shadow,
        }}>
            <button onClick={() => setExpanded(!expanded)} style={{
                width: '100%', padding: '16px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between',
                background: 'none', border: 'none', cursor: 'pointer',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={18} color={sanctuary.purple} />
                    <span style={{
                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.92rem',
                        color: sanctuary.text,
                    }}>{title}</span>
                </div>
                <ChevronRight size={16} color={sanctuary.textMuted} style={{
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                }} />
            </button>
            {expanded && (
                <div style={{ padding: '0 16px 16px' }}>
                    <pre style={{
                        fontSize: '0.82rem', color: sanctuary.textSecondary,
                        fontFamily: typography.body, lineHeight: 1.6,
                        whiteSpace: 'pre-wrap', background: sanctuary.bgAlt,
                        padding: '14px', borderRadius: '10px',
                        border: `1px solid ${sanctuary.border}`,
                        marginBottom: '10px',
                    }}>{content}</pre>
                    <button onClick={handleCopy} style={{
                        padding: '8px 16px', borderRadius: '8px',
                        background: copied ? sanctuary.sageBg : sanctuary.purpleBg,
                        border: `1px solid ${copied ? sanctuary.sageBorder : sanctuary.purpleBorder}`,
                        color: copied ? sanctuary.sage : sanctuary.purple,
                        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                        fontFamily: typography.body,
                    }}>{copied ? 'Copied ✓' : 'Copy to Clipboard'}</button>
                </div>
            )}
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: sanctuary.textMuted, marginBottom: '6px',
    fontFamily: typography.body,
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
    fontFamily: typography.body, fontSize: '0.88rem',
    color: sanctuary.text, outline: 'none', boxSizing: 'border-box',
};
