/**
 * Adulthood Transition Roadmap — "The Horizon"
 *
 * Phase 3B: Age-gated milestone tracker (14→16→18→21)
 * Helps families plan for independence, supported decision-making,
 * and post-school life.
 */

import { useState } from 'react';
import {
    Compass, GraduationCap, Briefcase, Home, FileCheck,
    ChevronDown, ChevronUp, Check
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useFamily } from '../contexts/FamilyContext';

interface Milestone {
    id: string;
    title: string;
    description: string;
    ageGate: number;
    category: 'legal' | 'education' | 'employment' | 'housing' | 'health';
    completed: boolean;
    resources?: string[];
}

const CATEGORY_CONFIG = {
    legal: { label: 'Legal & Rights', icon: FileCheck, color: sanctuary.purple, bg: sanctuary.purpleBg, border: sanctuary.purpleBorder },
    education: { label: 'Education', icon: GraduationCap, color: sanctuary.sage, bg: sanctuary.sageBg, border: sanctuary.sageBorder },
    employment: { label: 'Employment', icon: Briefcase, color: sanctuary.gold, bg: sanctuary.goldBg, border: sanctuary.goldBorder },
    housing: { label: 'Housing & Living', icon: Home, color: sanctuary.rose, bg: sanctuary.roseBg, border: sanctuary.roseBorder },
    health: { label: 'Healthcare', icon: Compass, color: '#5B9BD5', bg: 'rgba(91,155,213,0.08)', border: 'rgba(91,155,213,0.2)' },
};

const MILESTONES: Milestone[] = [
    // Age 14
    { id: 't14-1', title: 'Begin transition planning in IEP', description: 'Federal law requires transition goals starting at age 14-16 depending on state.', ageGate: 14, category: 'legal', completed: false, resources: ['IDEA Transition Requirements'] },
    { id: 't14-2', title: 'Explore interests and strengths inventory', description: 'Document what your child loves and excels at — these become career exploration pathways.', ageGate: 14, category: 'education', completed: false },
    { id: 't14-3', title: 'Introduce self-advocacy skills', description: 'Practice speaking up about needs, preferences, and accommodations.', ageGate: 14, category: 'education', completed: false },
    { id: 't14-4', title: 'Connect with state vocational rehab', description: 'State VR agencies provide free employment services — apply early as waitlists are long.', ageGate: 14, category: 'employment', completed: false },
    // Age 16
    { id: 't16-1', title: 'Student-led IEP participation', description: 'Your child should attend and contribute to their own IEP meetings.', ageGate: 16, category: 'legal', completed: false },
    { id: 't16-2', title: 'Explore community-based work experiences', description: 'Job shadowing, internships, volunteer positions in areas of interest.', ageGate: 16, category: 'employment', completed: false },
    { id: 't16-3', title: 'Learn independent living skills', description: 'Cooking, laundry, budgeting, transportation — build these skills now.', ageGate: 16, category: 'housing', completed: false },
    { id: 't16-4', title: 'Research supported decision-making', description: 'Understand alternatives to full guardianship that preserve rights while providing support.', ageGate: 16, category: 'legal', completed: false, resources: ['Supported Decision-Making Agreement Template'] },
    { id: 't16-5', title: 'Transfer medical knowledge', description: 'Begin teaching your child about their medications, diagnoses, and when to seek help.', ageGate: 16, category: 'health', completed: false },
    // Age 18
    { id: 't18-1', title: 'Apply for SSI/SSDI if eligible', description: 'Apply 3 months before 18th birthday. Documentation from childhood is critical.', ageGate: 18, category: 'legal', completed: false, resources: ['SSI Application Checklist'] },
    { id: 't18-2', title: 'Healthcare power of attorney decision', description: 'At 18, parents lose medical access. Decide on HIPAA release or healthcare POA.', ageGate: 18, category: 'health', completed: false },
    { id: 't18-3', title: 'Register to vote (if applicable)', description: 'Civic participation is a right — explore supported voting if needed.', ageGate: 18, category: 'legal', completed: false },
    { id: 't18-4', title: 'Post-secondary education options', description: 'College disability services, Think College programs, certificate programs.', ageGate: 18, category: 'education', completed: false, resources: ['Think College Directory'] },
    { id: 't18-5', title: 'Housing options exploration', description: 'Independent living, supported living, group homes, host families.', ageGate: 18, category: 'housing', completed: false },
    // Age 21
    { id: 't21-1', title: 'Transition from school to adult services', description: 'Services through the school end at 21. Adult disability services require separate applications.', ageGate: 21, category: 'legal', completed: false },
    { id: 't21-2', title: 'Apply for Medicaid waiver programs', description: 'Waiver services fund supported living, employment supports, and community integration.', ageGate: 21, category: 'health', completed: false, resources: ['State Waiver Finder Tool'] },
    { id: 't21-3', title: 'Establish adult care team', description: 'Find adult-focused providers: psychiatry, therapy, primary care, dental.', ageGate: 21, category: 'health', completed: false },
    { id: 't21-4', title: 'Employment or day program placement', description: 'Competitive integrated employment, supported employment, or meaningful day activities.', ageGate: 21, category: 'employment', completed: false },
];

const AGE_GATES = [14, 16, 18, 21];

export function TransitionRoadmapPage() {
    const { activeChild } = useFamily();
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
    const [expandedGate, setExpandedGate] = useState<number>(14);

    const childName = activeChild?.preferredName || activeChild?.firstName || 'Your child';

    const toggleComplete = (id: string) => {
        const next = new Set(completedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setCompletedIds(next);
    };

    const getProgress = (age: number) => {
        const items = MILESTONES.filter(m => m.ageGate === age);
        const done = items.filter(m => completedIds.has(m.id)).length;
        return { done, total: items.length, percent: items.length > 0 ? Math.round((done / items.length) * 100) : 0 };
    };

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
                            background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Compass size={22} color="#1A1A1A" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em',
                        }}>The Horizon</h1>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.92rem',
                        fontFamily: typography.body, marginLeft: '56px',
                    }}>{childName}'s path to independence.</p>
                </div>

                {/* Overall Progress */}
                <div style={{
                    background: sanctuary.bgCard, borderRadius: '16px',
                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                    marginBottom: '20px', boxShadow: sanctuary.shadow,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{
                            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: sanctuary.textMuted, fontFamily: typography.body,
                        }}>Overall Progress</span>
                        <span style={{
                            fontSize: '0.85rem', fontWeight: 700, color: sanctuary.gold,
                            fontFamily: typography.body,
                        }}>{completedIds.size} / {MILESTONES.length}</span>
                    </div>
                    <div style={{
                        height: '6px', borderRadius: '3px', background: sanctuary.bgAlt, overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', borderRadius: '3px',
                            background: `linear-gradient(90deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            width: `${(completedIds.size / MILESTONES.length) * 100}%`,
                            transition: 'width 0.3s ease',
                        }} />
                    </div>
                </div>

                {/* Age Gates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {AGE_GATES.map(age => {
                        const progress = getProgress(age);
                        const isExpanded = expandedGate === age;
                        const milestones = MILESTONES.filter(m => m.ageGate === age);

                        return (
                            <div key={age} style={{
                                background: sanctuary.bgCard, borderRadius: '20px',
                                border: `1px solid ${sanctuary.border}`,
                                boxShadow: sanctuary.shadow, overflow: 'hidden',
                            }}>
                                {/* Gate Header */}
                                <button onClick={() => setExpandedGate(isExpanded ? -1 : age)} style={{
                                    width: '100%', padding: '18px 20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: progress.percent === 100 ? sanctuary.sageBg : sanctuary.goldBg,
                                            border: `1px solid ${progress.percent === 100 ? sanctuary.sageBorder : sanctuary.goldBorder}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: progress.percent === 100 ? sanctuary.sage : sanctuary.gold,
                                            fontFamily: typography.heading, fontWeight: 800, fontSize: '1rem',
                                        }}>
                                            {progress.percent === 100 ? <Check size={18} /> : age}
                                        </div>
                                        <div style={{ textAlign: 'left' }}>
                                            <span style={{
                                                fontFamily: typography.heading, fontWeight: 700,
                                                fontSize: '1.05rem', color: sanctuary.text,
                                                display: 'block',
                                            }}>Age {age}</span>
                                            <span style={{
                                                fontSize: '0.78rem', color: sanctuary.textMuted,
                                                fontFamily: typography.body,
                                            }}>{progress.done}/{progress.total} complete</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Mini progress bar */}
                                        <div style={{
                                            width: '48px', height: '4px', borderRadius: '2px',
                                            background: sanctuary.bgAlt,
                                        }}>
                                            <div style={{
                                                height: '100%', borderRadius: '2px',
                                                background: progress.percent === 100 ? sanctuary.sage : sanctuary.gold,
                                                width: `${progress.percent}%`,
                                            }} />
                                        </div>
                                        {isExpanded ? <ChevronUp size={18} color={sanctuary.textMuted} /> : <ChevronDown size={18} color={sanctuary.textMuted} />}
                                    </div>
                                </button>

                                {/* Milestone List */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '0 20px 20px',
                                        display: 'flex', flexDirection: 'column', gap: '8px',
                                    }}>
                                        {milestones.map(milestone => {
                                            const cat = CATEGORY_CONFIG[milestone.category];
                                            const CatIcon = cat.icon;
                                            const done = completedIds.has(milestone.id);

                                            return (
                                                <div key={milestone.id} style={{
                                                    padding: '14px', borderRadius: '14px',
                                                    background: done ? sanctuary.sageBg : sanctuary.bgAlt,
                                                    border: `1px solid ${done ? sanctuary.sageBorder : sanctuary.border}`,
                                                    transition: 'all 0.2s ease',
                                                }}>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                                                    }}>
                                                        <button onClick={() => toggleComplete(milestone.id)} style={{
                                                            width: '24px', height: '24px', borderRadius: '6px',
                                                            border: done ? 'none' : `2px solid ${sanctuary.border}`,
                                                            background: done ? sanctuary.sage : 'transparent',
                                                            cursor: 'pointer', flexShrink: 0, marginTop: '2px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            {done && <Check size={14} color="#fff" />}
                                                        </button>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{
                                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                                marginBottom: '4px',
                                                            }}>
                                                                <span style={{
                                                                    fontWeight: 700, fontSize: '0.9rem',
                                                                    color: done ? sanctuary.sage : sanctuary.text,
                                                                    fontFamily: typography.body,
                                                                    textDecoration: done ? 'line-through' : 'none',
                                                                }}>{milestone.title}</span>
                                                            </div>
                                                            <p style={{
                                                                fontSize: '0.82rem', color: sanctuary.textMuted,
                                                                fontFamily: typography.body, lineHeight: 1.5,
                                                                marginBottom: '6px',
                                                            }}>{milestone.description}</p>
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                padding: '2px 8px', borderRadius: '100px',
                                                                background: cat.bg, border: `1px solid ${cat.border}`,
                                                                color: cat.color, fontSize: '0.68rem', fontWeight: 700,
                                                                fontFamily: typography.body,
                                                            }}>
                                                                <CatIcon size={10} /> {cat.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Guardianship Comparison */}
                <div style={{
                    background: sanctuary.purpleBg, borderRadius: '20px',
                    border: `1px solid ${sanctuary.purpleBorder}`,
                    padding: '20px', marginTop: '24px',
                }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700, fontSize: '1rem',
                        color: sanctuary.text, marginBottom: '12px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}><FileCheck size={16} color={sanctuary.purple} /> Guardianship vs. Supported Decision-Making</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{
                            padding: '14px', borderRadius: '12px',
                            background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                        }}>
                            <h4 style={{
                                fontFamily: typography.body, fontWeight: 700, fontSize: '0.82rem',
                                color: sanctuary.rose, marginBottom: '6px',
                            }}>Full Guardianship</h4>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: sanctuary.textMuted, fontSize: '0.78rem', fontFamily: typography.body, lineHeight: 1.6 }}>
                                <li>Removes legal rights</li>
                                <li>Court-appointed guardian</li>
                                <li>Difficult to reverse</li>
                                <li>Controls all decisions</li>
                            </ul>
                        </div>
                        <div style={{
                            padding: '14px', borderRadius: '12px',
                            background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                        }}>
                            <h4 style={{
                                fontFamily: typography.body, fontWeight: 700, fontSize: '0.82rem',
                                color: sanctuary.sage, marginBottom: '6px',
                            }}>Supported Decision-Making</h4>
                            <ul style={{ margin: 0, paddingLeft: '16px', color: sanctuary.textMuted, fontSize: '0.78rem', fontFamily: typography.body, lineHeight: 1.6 }}>
                                <li>Preserves legal rights</li>
                                <li>Choose your supporters</li>
                                <li>Flexible and changeable</li>
                                <li>Builds independence</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
