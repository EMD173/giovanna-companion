/**
 * Child Profile Page — Sanctuary Theme + Meet My Child Export
 *
 * Phase 1D: Comprehensive child profile with export capability.
 * Generates a "Meet My Child" one-pager for new teachers/providers.
 */

import { useState } from 'react';
import { useFamily, useActiveChild } from '../contexts/FamilyContext';
import {
    User, Heart, School, Activity, Users, Clock,
    Plus, Edit2, Save, ChevronRight, Sparkles,
    Download, QrCode, Share2, Star, Puzzle
} from 'lucide-react';
import { useECMode } from '../contexts/ECModeContext';
import { type ChildProfile as ChildProfileType, createEmptyChildProfile } from '../data/familyProfile';
import { sanctuary, typography } from '../shared/theme';

export function ChildProfilePage() {
    const { family, loading, addChild } = useFamily();
    const { child, update } = useActiveChild();
    const { enabled: ecMode } = useECMode();
    const [isEditing, setIsEditing] = useState(false);
    const [showAddChild, setShowAddChild] = useState(false);
    const [, setShowExport] = useState(false);

    if (loading) {
        return (
            <div style={{
                background: sanctuary.bg, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '80px 24px',
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: `3px solid ${sanctuary.border}`,
                    borderTopColor: sanctuary.purple,
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        );
    }

    if (!family || family.children.length === 0) {
        return (
            <div style={{
                background: sanctuary.bg, minHeight: '100vh', padding: '32px 24px',
            }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '24px',
                    }}>Child Profile</h1>
                    <EmptyState onAdd={() => setShowAddChild(true)} />
                    {showAddChild && (
                        <AddChildModal
                            onClose={() => setShowAddChild(false)}
                            onAdd={async (name) => {
                                const newChild = createEmptyChildProfile(Date.now().toString());
                                newChild.firstName = name;
                                await addChild(newChild);
                                setShowAddChild(false);
                            }}
                        />
                    )}
                </div>
            </div>
        );
    }

    if (!child) return null;

    const handleExport = () => {
        const doc = generateMeetMyChild(child);
        const blob = new Blob([doc], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Meet_${child.preferredName || child.firstName}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{
            background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px',
        }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '24px',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2.2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '4px',
                        }}>
                            {child.preferredName || child.firstName}'s Profile
                        </h1>
                        <p style={{
                            color: sanctuary.textMuted, fontFamily: typography.body,
                            fontSize: '0.92rem',
                        }}>{child.pronouns}</p>
                    </div>
                    <button onClick={() => setIsEditing(!isEditing)} style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: isEditing ? sanctuary.sageBg : sanctuary.bgCard,
                        border: `1px solid ${isEditing ? sanctuary.sageBorder : sanctuary.border}`,
                        color: isEditing ? sanctuary.sage : sanctuary.textMuted,
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    </button>
                </div>

                {/* Quick Info Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <InfoCard icon={<School size={16} />} label="School" value={child.currentSchool?.name || 'Not set'} />
                    <InfoCard icon={<Activity size={16} />} label="Grade" value={child.currentGrade || 'Not set'} />
                </div>

                {/* Export Actions */}
                <div style={{
                    display: 'flex', gap: '8px', marginBottom: '24px',
                    overflowX: 'auto', paddingBottom: '2px',
                }}>
                    <button onClick={handleExport} style={exportButtonStyle}>
                        <Download size={14} /> Meet My Child
                    </button>
                    <button onClick={() => setShowExport(true)} style={exportButtonStyle}>
                        <Share2 size={14} /> Share Profile
                    </button>
                    <button onClick={() => {/* QR Code generation */}} style={exportButtonStyle}>
                        <QrCode size={14} /> Emergency QR
                    </button>
                </div>

                {/* Narrative — Who They Are */}
                <section style={{
                    background: sanctuary.goldBg, borderRadius: '20px',
                    border: `1px solid ${sanctuary.goldBorder}`,
                    padding: '20px', marginBottom: '16px',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: sanctuary.bgCard, border: `1px solid ${sanctuary.goldBorder}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: sanctuary.gold,
                        }}>
                            <Heart size={16} />
                        </div>
                        <h2 style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            fontSize: '1.1rem', color: sanctuary.text,
                        }}>Who They Are</h2>
                    </div>
                    {isEditing ? (
                        <textarea
                            rows={3}
                            placeholder="Tell us about your child in your own words..."
                            value={child.narrative?.whoTheyAre || ''}
                            onChange={(e) => update({
                                narrative: { ...child.narrative, whoTheyAre: e.target.value, updatedAt: new Date() as any }
                            })}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: `1px solid ${sanctuary.goldBorder}`,
                                background: sanctuary.bgCard, fontFamily: typography.body,
                                fontSize: '0.9rem', color: sanctuary.text, resize: 'vertical',
                                outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    ) : (
                        <p style={{
                            color: sanctuary.textSecondary, fontSize: '0.9rem',
                            fontStyle: 'italic', fontFamily: typography.body, lineHeight: 1.6,
                        }}>
                            {child.narrative?.whoTheyAre || 'Add a description of your child...'}
                        </p>
                    )}
                </section>

                {/* Strengths & Interests */}
                <section style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    padding: '20px', marginBottom: '16px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <h2 style={{
                        fontFamily: typography.heading, fontWeight: 700,
                        fontSize: '1.1rem', color: sanctuary.text, marginBottom: '12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}><Star size={16} color={sanctuary.gold} /> Strengths & Interests</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {child.strengths.map((s, i) => (
                            <span key={`s-${i}`} style={pillStyle(sanctuary.sageBg, sanctuary.sage, sanctuary.sageBorder)}>
                                {s}
                            </span>
                        ))}
                        {child.interests.map((s, i) => (
                            <span key={`i-${i}`} style={pillStyle(sanctuary.goldBg, sanctuary.gold, sanctuary.goldBorder)}>
                                {s}
                            </span>
                        ))}
                        {isEditing && (
                            <button style={{
                                ...pillStyle(sanctuary.bgAlt, sanctuary.textMuted, sanctuary.border),
                                cursor: 'pointer', borderStyle: 'dashed',
                            }}>+ Add</button>
                        )}
                    </div>
                </section>

                {/* EC Mode: Homeplace Supports */}
                {ecMode && (
                    <section style={{
                        background: sanctuary.purpleBg, borderRadius: '20px',
                        border: `1px solid ${sanctuary.purpleBorder}`,
                        padding: '20px', marginBottom: '16px',
                    }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
                        }}>
                            <Sparkles size={16} color={sanctuary.purple} />
                            <h2 style={{
                                fontFamily: typography.heading, fontWeight: 700,
                                fontSize: '1.1rem', color: sanctuary.text,
                            }}>Homeplace Supports</h2>
                        </div>
                        <HomeplaceGrid supports={child.homeplaceSupports} isEditing={isEditing} onUpdate={(s) => update({ homeplaceSupports: s })} />
                    </section>
                )}

                {/* Communication */}
                <section style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    padding: '20px', marginBottom: '16px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <h2 style={{
                        fontFamily: typography.heading, fontWeight: 700,
                        fontSize: '1.1rem', color: sanctuary.text, marginBottom: '12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}><Puzzle size={16} color={sanctuary.purple} /> Communication</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: sanctuary.textMuted, fontSize: '0.88rem', fontFamily: typography.body }}>Primary Mode</span>
                            <span style={{ fontWeight: 600, color: sanctuary.text, fontSize: '0.88rem', fontFamily: typography.body }}>
                                {child.communicationStyle?.primaryMode || 'Verbal'}
                            </span>
                        </div>
                        {child.communicationStyle?.calmingStrategies?.length > 0 && (
                            <div>
                                <span style={{ color: sanctuary.textMuted, fontSize: '0.82rem', fontFamily: typography.body }}>
                                    What helps calm down:
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                    {child.communicationStyle.calmingStrategies.map((s, i) => (
                                        <span key={i} style={pillStyle(sanctuary.sageBg, sanctuary.sage, sanctuary.sageBorder)}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Navigation Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NavLink icon={<Clock size={16} />} label="View Timeline" href="#timeline" />
                    <NavLink icon={<Users size={16} />} label="Manage Sharing" href="#sharing" />
                </div>
            </div>
        </div>
    );
}

// ============ Styles ============

const exportButtonStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '10px 16px', borderRadius: '100px',
    background: sanctuary.bgCard, border: `1px solid ${sanctuary.border}`,
    color: sanctuary.textSecondary, fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: typography.body,
    boxShadow: sanctuary.shadow,
};

function pillStyle(bg: string, color: string, border: string): React.CSSProperties {
    return {
        padding: '4px 12px', borderRadius: '100px', fontSize: '0.82rem',
        fontWeight: 600, background: bg, color, border: `1px solid ${border}`,
        fontFamily: typography.body,
    };
}

// ============ Sub-Components ============

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div style={{
            background: sanctuary.bgCard, borderRadius: '14px',
            border: `1px solid ${sanctuary.border}`, padding: '14px',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: sanctuary.textMuted, fontSize: '0.72rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '6px', fontFamily: typography.body,
            }}>
                {icon}
                <span>{label}</span>
            </div>
            <p style={{
                fontWeight: 700, color: sanctuary.text, fontSize: '0.92rem',
                fontFamily: typography.body, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{value}</p>
        </div>
    );
}

function NavLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <a href={href} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: sanctuary.bgCard,
            border: `1px solid ${sanctuary.border}`, borderRadius: '14px',
            textDecoration: 'none', boxShadow: sanctuary.shadow,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: sanctuary.textMuted }}>{icon}</span>
                <span style={{
                    fontWeight: 600, color: sanctuary.text, fontSize: '0.92rem',
                    fontFamily: typography.body,
                }}>{label}</span>
            </div>
            <ChevronRight size={16} color={sanctuary.textMuted} />
        </a>
    );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div style={{
            textAlign: 'center', padding: '48px 24px',
            background: sanctuary.bgCard, borderRadius: '20px',
            border: `1px solid ${sanctuary.border}`,
        }}>
            <User size={48} style={{ color: sanctuary.border, margin: '0 auto 16px' }} />
            <h3 style={{
                fontFamily: typography.heading, fontWeight: 700,
                color: sanctuary.text, marginBottom: '8px',
            }}>No child profiles yet</h3>
            <p style={{
                color: sanctuary.textMuted, fontSize: '0.9rem',
                fontFamily: typography.body, marginBottom: '20px',
            }}>Add your child to start building their profile.</p>
            <button onClick={onAdd} style={{
                padding: '12px 24px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                color: '#fff', border: 'none', fontWeight: 700,
                fontSize: '0.92rem', cursor: 'pointer', fontFamily: typography.body,
                display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
                <Plus size={18} /> Add Child
            </button>
        </div>
    );
}

function AddChildModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
    const [name, setName] = useState('');

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
            <div style={{
                background: sanctuary.bgCard, borderRadius: '24px',
                padding: '24px', width: '100%', maxWidth: '340px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
            }}>
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700, fontSize: '1.2rem',
                    color: sanctuary.text, marginBottom: '16px',
                }}>Add Child</h3>
                <input
                    type="text" autoFocus
                    placeholder="Child's first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                        width: '100%', padding: '12px 14px', borderRadius: '10px',
                        border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
                        fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.text,
                        outline: 'none', boxSizing: 'border-box', marginBottom: '16px',
                    }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={onClose} style={{
                        flex: 1, padding: '12px', borderRadius: '10px',
                        background: 'none', border: `1px solid ${sanctuary.border}`,
                        color: sanctuary.textMuted, fontWeight: 600, cursor: 'pointer',
                        fontFamily: typography.body,
                    }}>Cancel</button>
                    <button onClick={() => name && onAdd(name)} disabled={!name} style={{
                        flex: 1, padding: '12px', borderRadius: '10px',
                        background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        color: '#fff', border: 'none', fontWeight: 700, cursor: name ? 'pointer' : 'default',
                        opacity: name ? 1 : 0.5, fontFamily: typography.body,
                    }}>Add</button>
                </div>
            </div>
        </div>
    );
}

function HomeplaceGrid({ supports, isEditing, onUpdate: _onUpdate }: {
    supports: ChildProfileType['homeplaceSupports'];
    isEditing: boolean;
    onUpdate: (s: ChildProfileType['homeplaceSupports']) => void;
}) {
    const categories = [
        { key: 'calmingPractices', label: 'Calming Practices', bg: sanctuary.sageBg, color: sanctuary.sage, border: sanctuary.sageBorder },
        { key: 'sensoryTools', label: 'Sensory Tools', bg: sanctuary.goldBg, color: sanctuary.gold, border: sanctuary.goldBorder },
        { key: 'trustedPeople', label: 'Trusted People', bg: sanctuary.roseBg, color: sanctuary.rose, border: sanctuary.roseBorder },
    ] as const;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map(({ key, label, bg, color, border }) => (
                <div key={key}>
                    <span style={{
                        fontSize: '0.72rem', fontWeight: 700, color: sanctuary.textMuted,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        fontFamily: typography.body,
                    }}>{label}</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                        {(supports[key] as string[]).map((item, i) => (
                            <span key={i} style={pillStyle(bg, color, border)}>{item}</span>
                        ))}
                        {isEditing && (
                            <button style={{
                                ...pillStyle(sanctuary.bgAlt, sanctuary.textMuted, sanctuary.border),
                                cursor: 'pointer', borderStyle: 'dashed',
                            }}>+</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============ Meet My Child Export ============

function generateMeetMyChild(child: ChildProfileType): string {
    const name = child.preferredName || child.firstName;
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meet ${name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; color: #2D2A26; background: #F8F5EF; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 4px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin-bottom: 12px; color: #6B4C9A; }
        .card { background: white; border: 1px solid #E8E2D6; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .pill { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 0.82rem; font-weight: 600; margin: 2px; }
        .sage { background: #E8F5E9; color: #7A9E7E; border: 1px solid #C5E1A5; }
        .gold { background: #FFF8E1; color: #D4AF37; border: 1px solid #FFE082; }
        .purple { background: #F3E5F5; color: #6B4C9A; border: 1px solid #CE93D8; }
        .header { border-bottom: 2px solid #D4AF37; padding-bottom: 16px; margin-bottom: 24px; }
        .subtitle { color: #8A8580; font-size: 0.9rem; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F0EBE3; }
        .row:last-child { border: none; }
        .label { color: #8A8580; }
        .value { font-weight: 600; }
        .footer { text-align: center; margin-top: 32px; color: #8A8580; font-size: 0.8rem; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Meet ${name}</h1>
        <p class="subtitle">${child.pronouns || ''} • Grade ${child.currentGrade || 'N/A'} • ${child.currentSchool?.name || 'School not specified'}</p>
    </div>

    ${child.narrative?.whoTheyAre ? `<div class="card"><h2>Who ${name} Is</h2><p>${child.narrative.whoTheyAre}</p></div>` : ''}

    <div class="card">
        <h2>Strengths & Interests</h2>
        ${child.strengths.map(s => `<span class="pill sage">${s}</span>`).join('')}
        ${child.interests.map(s => `<span class="pill gold">${s}</span>`).join('')}
    </div>

    <div class="card">
        <h2>Communication</h2>
        <div class="row"><span class="label">Primary Mode</span><span class="value">${child.communicationStyle?.primaryMode || 'Verbal'}</span></div>
        ${child.communicationStyle?.triggers?.length > 0 ? `<div class="row"><span class="label">Known Triggers</span><span class="value">${child.communicationStyle.triggers.join(', ')}</span></div>` : ''}
        ${child.communicationStyle?.calmingStrategies?.length > 0 ? `
        <div style="margin-top: 12px;">
            <span class="label">What Helps:</span><br>
            ${child.communicationStyle.calmingStrategies.map(s => `<span class="pill purple">${s}</span>`).join('')}
        </div>` : ''}
    </div>

    ${child.diagnoses?.length > 0 ? `
    <div class="card">
        <h2>Diagnoses</h2>
        ${child.diagnoses.filter(d => d.shareWithSchool).map(d => `<div class="row"><span class="value">${d.name}</span><span class="label">${d.diagnosedDate ? new Date(d.diagnosedDate as any).getFullYear() : ''}</span></div>`).join('')}
    </div>` : ''}

    <div class="footer">
        <p>Generated from Giovanna — Parenting with Confidence, Not Compliance</p>
        <p>Created on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>`;
}
