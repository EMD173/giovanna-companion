/**
 * Insurance Appeal Tracker — "The Paper Shield"
 *
 * Phase 2C: Track insurance appeals, denials, and deadlines.
 * Families lose millions in services because they miss appeal windows.
 */

import { useState, useEffect } from 'react';
import {
    Shield, FileText, Clock, AlertTriangle, CheckCircle,
    Plus, X
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    serverTimestamp, Timestamp, updateDoc, doc
} from 'firebase/firestore';

interface Appeal {
    id: string;
    userId: string;
    serviceName: string;      // "ABA Therapy", "Speech Therapy" etc
    insuranceCompany: string;
    claimNumber?: string;
    status: 'pending' | 'denied' | 'appealing' | 'won' | 'lost';
    denialDate?: Timestamp;
    appealDeadline?: Timestamp;
    appealFiledDate?: Timestamp;
    notes: string;
    createdAt: Timestamp;
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: sanctuary.gold, bg: sanctuary.goldBg, border: sanctuary.goldBorder, icon: Clock },
    denied: { label: 'Denied', color: sanctuary.rose, bg: sanctuary.roseBg, border: sanctuary.roseBorder, icon: AlertTriangle },
    appealing: { label: 'Appealing', color: sanctuary.purple, bg: sanctuary.purpleBg, border: sanctuary.purpleBorder, icon: FileText },
    won: { label: 'Won', color: sanctuary.sage, bg: sanctuary.sageBg, border: sanctuary.sageBorder, icon: CheckCircle },
    lost: { label: 'Lost', color: sanctuary.textMuted, bg: sanctuary.bgAlt, border: sanctuary.border, icon: X },
};

const COMMON_SERVICES = [
    'ABA Therapy', 'Speech Therapy', 'Occupational Therapy',
    'Physical Therapy', 'Mental Health', 'Diagnostic Evaluation',
    'Assistive Technology', 'Respite Care',
];

export function InsuranceAppealPage() {
    const { user } = useAuth();
    const [appeals, setAppeals] = useState<Appeal[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [service, setService] = useState('');
    const [insurer, setInsurer] = useState('');
    const [claimNum, setClaimNum] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'insuranceAppeals'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );
        const unsub = onSnapshot(q, snap => {
            setAppeals(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Appeal[]);
        });
        return () => unsub();
    }, [user]);

    const handleSave = async () => {
        if (!user || !service) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'insuranceAppeals'), {
                userId: user.uid,
                serviceName: service,
                insuranceCompany: insurer,
                claimNumber: claimNum || null,
                status: 'pending',
                notes: notes || '',
                createdAt: serverTimestamp(),
            });
            setShowForm(false);
            setService(''); setInsurer(''); setClaimNum(''); setNotes('');
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    const updateStatus = async (id: string, status: Appeal['status']) => {
        await updateDoc(doc(db, 'insuranceAppeals', id), { status });
    };

    // Count by status
    const counts = appeals.reduce((acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Urgently expiring appeals
    const urgent = appeals.filter(a => {
        if (a.status !== 'denied' || !a.appealDeadline) return false;
        const deadline = a.appealDeadline.toDate();
        const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 14 && daysLeft > 0;
    });

    return (
        <div style={{
            background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px',
        }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.sage}, #5A8A5E)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Shield size={22} color="#fff" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em',
                        }}>Insurance Appeals</h1>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.92rem',
                        fontFamily: typography.body, marginLeft: '56px',
                    }}>Your Paper Shield — Track every claim.</p>
                </div>

                {/* Urgent Banner */}
                {urgent.length > 0 && (
                    <div style={{
                        background: sanctuary.roseBg, borderRadius: '14px',
                        border: `1px solid ${sanctuary.roseBorder}`,
                        padding: '14px 16px', marginBottom: '16px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <AlertTriangle size={20} color={sanctuary.rose} />
                        <span style={{
                            fontSize: '0.88rem', fontWeight: 700, color: sanctuary.rose,
                            fontFamily: typography.body,
                        }}>
                            {urgent.length} appeal{urgent.length > 1 ? 's' : ''} expiring soon!
                        </span>
                    </div>
                )}

                {/* Status Summary */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
                    marginBottom: '20px',
                }}>
                    {(['pending', 'denied', 'appealing', 'won'] as const).map(status => {
                        const config = STATUS_CONFIG[status];
                        const Icon = config.icon;
                        return (
                            <div key={status} style={{
                                background: sanctuary.bgCard, borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`, padding: '12px',
                                textAlign: 'center', boxShadow: sanctuary.shadow,
                            }}>
                                <Icon size={18} color={config.color} style={{ margin: '0 auto 6px' }} />
                                <span style={{
                                    display: 'block', fontSize: '1.4rem', fontWeight: 800,
                                    color: config.color, fontFamily: typography.heading,
                                }}>{counts[status] || 0}</span>
                                <span style={{
                                    display: 'block', fontSize: '0.6rem', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                    color: sanctuary.textMuted, fontFamily: typography.body,
                                }}>{config.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Add Appeal */}
                {!showForm ? (
                    <button onClick={() => setShowForm(true)} style={{
                        width: '100%', padding: '16px', borderRadius: '14px',
                        background: sanctuary.bgCard, border: `2px dashed ${sanctuary.border}`,
                        color: sanctuary.textMuted, fontWeight: 700, fontSize: '0.92rem',
                        cursor: 'pointer', fontFamily: typography.body,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        marginBottom: '24px',
                    }}>
                        <Plus size={18} /> Track New Claim
                    </button>
                ) : (
                    <div style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '24px',
                        marginBottom: '24px', boxShadow: sanctuary.shadowMd,
                    }}>
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700, fontSize: '1.1rem',
                            color: sanctuary.text, marginBottom: '16px',
                        }}>New Claim</h3>

                        {/* Service Chips */}
                        <label style={{
                            display: 'block', fontSize: '0.82rem', fontWeight: 700,
                            color: sanctuary.textMuted, marginBottom: '8px', fontFamily: typography.body,
                        }}>Service Type</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {COMMON_SERVICES.map(s => (
                                <button key={s} onClick={() => setService(s)} style={{
                                    padding: '8px 14px', borderRadius: '100px',
                                    background: service === s ? sanctuary.purpleBg : sanctuary.bgAlt,
                                    border: `1px solid ${service === s ? sanctuary.purpleBorder : sanctuary.border}`,
                                    color: service === s ? sanctuary.purple : sanctuary.textMuted,
                                    fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                                    fontFamily: typography.body,
                                }}>{s}</button>
                            ))}
                        </div>

                        {/* Insurance Company */}
                        <input type="text" value={insurer} onChange={e => setInsurer(e.target.value)}
                            placeholder="Insurance company name"
                            style={inputStyle} />
                        <input type="text" value={claimNum} onChange={e => setClaimNum(e.target.value)}
                            placeholder="Claim/reference number (optional)"
                            style={{ ...inputStyle, marginTop: '10px' }} />
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="Notes..."
                            rows={2}
                            style={{ ...inputStyle, marginTop: '10px', resize: 'vertical', minHeight: '60px' }} />

                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            <button onClick={() => setShowForm(false)} style={{
                                flex: 1, padding: '12px', borderRadius: '10px',
                                background: 'none', border: `1px solid ${sanctuary.border}`,
                                color: sanctuary.textMuted, fontWeight: 600, cursor: 'pointer',
                                fontFamily: typography.body,
                            }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving || !service} style={{
                                flex: 1, padding: '12px', borderRadius: '10px',
                                background: `linear-gradient(135deg, ${sanctuary.sage}, #5A8A5E)`,
                                color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
                                fontFamily: typography.body, opacity: (saving || !service) ? 0.5 : 1,
                            }}>{saving ? 'Saving...' : 'Track Claim'}</button>
                        </div>
                    </div>
                )}

                {/* Appeals List */}
                {appeals.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {appeals.map(appeal => {
                            const config = STATUS_CONFIG[appeal.status];
                            const Icon = config.icon;
                            return (
                                <div key={appeal.id} style={{
                                    background: sanctuary.bgCard, borderRadius: '16px',
                                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                                    boxShadow: sanctuary.shadow,
                                }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'flex-start', marginBottom: '8px',
                                    }}>
                                        <div>
                                            <h4 style={{
                                                fontFamily: typography.body, fontWeight: 700,
                                                color: sanctuary.text, fontSize: '0.95rem', marginBottom: '2px',
                                            }}>{appeal.serviceName}</h4>
                                            <span style={{
                                                color: sanctuary.textMuted, fontSize: '0.8rem',
                                                fontFamily: typography.body,
                                            }}>{appeal.insuranceCompany}</span>
                                        </div>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            padding: '4px 10px', borderRadius: '100px',
                                            background: config.bg, border: `1px solid ${config.border}`,
                                            color: config.color, fontWeight: 700, fontSize: '0.72rem',
                                            fontFamily: typography.body,
                                        }}>
                                            <Icon size={12} /> {config.label}
                                        </span>
                                    </div>
                                    {appeal.notes && (
                                        <p style={{
                                            fontSize: '0.82rem', color: sanctuary.textSecondary,
                                            fontFamily: typography.body, marginBottom: '10px',
                                            lineHeight: 1.5,
                                        }}>{appeal.notes}</p>
                                    )}
                                    {/* Status Actions */}
                                    <div style={{
                                        display: 'flex', gap: '6px', flexWrap: 'wrap',
                                    }}>
                                        {appeal.status === 'pending' && (
                                            <>
                                                <StatusButton label="Denied" color={sanctuary.rose} onClick={() => updateStatus(appeal.id, 'denied')} />
                                                <StatusButton label="Approved ✓" color={sanctuary.sage} onClick={() => updateStatus(appeal.id, 'won')} />
                                            </>
                                        )}
                                        {appeal.status === 'denied' && (
                                            <StatusButton label="Filed Appeal →" color={sanctuary.purple} onClick={() => updateStatus(appeal.id, 'appealing')} />
                                        )}
                                        {appeal.status === 'appealing' && (
                                            <>
                                                <StatusButton label="Won ✓" color={sanctuary.sage} onClick={() => updateStatus(appeal.id, 'won')} />
                                                <StatusButton label="Lost ✗" color={sanctuary.textMuted} onClick={() => updateStatus(appeal.id, 'lost')} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {appeals.length === 0 && !showForm && (
                    <div style={{
                        textAlign: 'center', padding: '48px 24px',
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        <Shield size={48} style={{ color: sanctuary.border, margin: '0 auto 16px' }} />
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.text, marginBottom: '8px',
                        }}>No claims tracked yet</h3>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.9rem',
                            fontFamily: typography.body,
                        }}>Start tracking your insurance claims and appeals here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatusButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: '6px 12px', borderRadius: '100px',
            background: 'none', border: `1px solid ${color}`,
            color, fontWeight: 700, fontSize: '0.75rem',
            cursor: 'pointer', fontFamily: typography.body,
        }}>
            {label}
        </button>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
    fontFamily: typography.body, fontSize: '0.9rem',
    color: sanctuary.text, outline: 'none', boxSizing: 'border-box',
};
