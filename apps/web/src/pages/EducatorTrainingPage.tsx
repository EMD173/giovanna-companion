/**
 * EducatorTrainingPage — Pillar 2: Educator & Paraprofessional Literacy
 *
 * Two views:
 *   1. Module List — overview with PD credit tracking and role filter
 *   2. Module Detail — scenario-based learning with decision trees
 *
 * Path: src/pages/EducatorTrainingPage.tsx
 * Route: /educator-training and /educator-training/:slug
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Lock, Award, BookOpen,
    Eye, Users, Activity, MessageCircle, Clock, Check,
    AlertTriangle, CheckCircle, XCircle, Sparkles,
    GraduationCap, FileText,
} from 'lucide-react';
import {
    EDUCATOR_MODULES,
    getEducatorModuleBySlug,
    getNextEducatorModule,
    getTotalPDHours,
    type EducatorModule,
    type ClassroomScenario,
} from '../data/educatorModules';
import { useEducatorProgress } from '../hooks/useEducatorProgress';
import { useSubscription } from '../contexts/SubscriptionContext';
import { sanctuary, typography } from '../shared/theme';

// ─────────────────────────────────────────
// Constants
// ─────────────────────────────────────────

const MODULE_ICONS: Record<string, React.ElementType> = {
    MessageCircle, Activity, Users, Eye,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
    gold: { bg: sanctuary.goldBg, border: sanctuary.goldBorder, text: sanctuary.gold },
    sage: { bg: sanctuary.sageBg, border: sanctuary.sageBorder, text: sanctuary.sage },
    purple: { bg: sanctuary.purpleBg, border: sanctuary.purpleBorder, text: sanctuary.purple },
    rose: { bg: sanctuary.roseBg, border: sanctuary.roseBorder, text: sanctuary.rose },
};

const RATING_CONFIG = {
    best: { icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Best Practice' },
    acceptable: { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Acceptable but Limited' },
    harmful: { icon: XCircle, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Harmful — Avoid' },
};

// ============================================
// MAIN COMPONENT
// ============================================

export function EducatorTrainingPage() {
    const { slug } = useParams<{ slug?: string }>();

    if (slug) {
        const module = getEducatorModuleBySlug(slug);
        if (module) return <ModuleDetail module={module} />;
    }

    return <ModuleList />;
}

// ============================================
// MODULE LIST VIEW
// ============================================

function ModuleList() {
    const { tier } = useSubscription();
    const { allProgress, totalModulesCompleted, totalPDHours } = useEducatorProgress();
    const navigate = useNavigate();

    const isEnterprise = tier === 'enterprise' || tier === 'pro'; // Pro gets access too for individual educators
    const totalAvailableHours = getTotalPDHours();

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '28px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px',
                    }}>
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em', color: sanctuary.purple, fontFamily: typography.body,
                            padding: '3px 10px', borderRadius: '100px',
                            background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                        }}>Professional Development</span>
                    </div>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2.2rem', fontWeight: 700,
                        color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '6px',
                    }}>Educator Training</h1>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '1rem',
                        fontFamily: typography.body, lineHeight: 1.6,
                    }}>
                        Scenario-based training for educators and paraprofessionals working with neurodivergent students. Earn PD credits.
                    </p>
                </header>

                {/* PD Credit Summary */}
                <div className="sanctuary-enter sanctuary-enter-1" style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px',
                }}>
                    <StatCard label="Modules Completed" value={`${totalModulesCompleted}/4`} icon={<BookOpen size={16} />} />
                    <StatCard label="PD Hours Earned" value={`${totalPDHours}`} icon={<Clock size={16} />} />
                    <StatCard label="Total Available" value={`${totalAvailableHours}h`} icon={<Award size={16} />} />
                </div>

                {/* Enterprise Gate */}
                {!isEnterprise && (
                    <div className="sanctuary-enter sanctuary-enter-2" style={{
                        background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                        borderRadius: '16px', padding: '20px', marginBottom: '20px',
                        display: 'flex', alignItems: 'flex-start', gap: '14px',
                    }}>
                        <GraduationCap size={24} style={{ color: sanctuary.purple, flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{
                                fontFamily: typography.heading, fontWeight: 700, fontSize: '1rem',
                                color: sanctuary.text, marginBottom: '4px',
                            }}>District & Pro Feature</h3>
                            <p style={{
                                color: sanctuary.textSecondary, fontSize: '0.85rem',
                                fontFamily: typography.body, lineHeight: 1.6, marginBottom: '10px',
                            }}>
                                Educator Training is available on Pro ($14.99/mo) and Enterprise ($99/mo) plans. Enterprise includes district-wide access, PD certificate generation, and admin reporting.
                            </p>
                            <Link to="/upgrade" style={{
                                color: sanctuary.purple, fontWeight: 700, fontSize: '0.82rem',
                                textDecoration: 'none', fontFamily: typography.body,
                            }}>Upgrade →</Link>
                        </div>
                    </div>
                )}

                {/* Module Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {EDUCATOR_MODULES.map((module, idx) => {
                        const moduleProgress = allProgress.find(p => p.moduleId === module.id);
                        const isCompleted = !!moduleProgress?.completedAt;
                        const isStarted = !!moduleProgress;
                        const scenariosCompleted = moduleProgress?.completedScenarios.length || 0;
                        const totalScenarios = module.scenarios.length;
                        const colors = COLOR_MAP[module.color];
                        const IconComponent = MODULE_ICONS[module.icon] || BookOpen;

                        const prereqMet = !module.prerequisite ||
                            allProgress.some(p => {
                                const prereqMod = EDUCATOR_MODULES.find(m => m.slug === module.prerequisite);
                                return prereqMod && p.moduleId === prereqMod.id && p.completedAt;
                            });

                        const isLocked = !isEnterprise || !prereqMet;

                        return (
                            <button
                                key={module.id}
                                className={`sanctuary-card sanctuary-enter sanctuary-enter-${Math.min(idx + 3, 7)}`}
                                onClick={() => !isLocked && navigate(`/educator-training/${module.slug}`)}
                                disabled={isLocked}
                                style={{
                                    width: '100%', textAlign: 'left',
                                    background: isLocked ? sanctuary.bgAlt : sanctuary.bgCard,
                                    borderRadius: '16px',
                                    border: `1px solid ${isCompleted ? colors.border : sanctuary.border}`,
                                    padding: '20px', cursor: isLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLocked ? 0.6 : 1, boxShadow: sanctuary.shadow,
                                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                                    position: 'relative', overflow: 'hidden',
                                }}
                            >
                                {/* Progress bar */}
                                {isStarted && !isCompleted && (
                                    <div style={{
                                        position: 'absolute', top: 0, left: 0,
                                        width: `${(scenariosCompleted / totalScenarios) * 100}%`,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${colors.text}, ${colors.text}80)`,
                                        borderRadius: '0 3px 3px 0',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: isLocked ? sanctuary.bgAlt : colors.bg,
                                    border: `1px solid ${isLocked ? sanctuary.border : colors.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, color: isLocked ? sanctuary.textMuted : colors.text,
                                }}>
                                    {isLocked ? <Lock size={20} /> :
                                        isCompleted ? <Award size={20} /> :
                                            <IconComponent size={20} />}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span style={{
                                            fontFamily: typography.body, fontSize: '0.7rem', fontWeight: 700,
                                            textTransform: 'uppercase', letterSpacing: '0.06em',
                                            color: isLocked ? sanctuary.textMuted : colors.text,
                                        }}>Module {module.order}</span>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 600,
                                            padding: '2px 8px', borderRadius: '100px',
                                            background: sanctuary.goldBg, color: sanctuary.gold,
                                            border: `1px solid ${sanctuary.goldBorder}`,
                                        }}>{module.pdCreditHours} PD Hours</span>
                                        {isCompleted && (
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: 600,
                                                padding: '2px 8px', borderRadius: '100px',
                                                background: sanctuary.sageBg, color: sanctuary.sage,
                                                border: `1px solid ${sanctuary.sageBorder}`,
                                            }}>✓ Complete</span>
                                        )}
                                    </div>
                                    <h3 style={{
                                        fontFamily: typography.heading, fontWeight: 700, fontSize: '1.05rem',
                                        color: isLocked ? sanctuary.textMuted : sanctuary.text, marginBottom: '3px',
                                    }}>{module.title}</h3>
                                    <p style={{
                                        fontFamily: typography.body, fontSize: '0.85rem',
                                        color: sanctuary.textMuted, lineHeight: 1.5,
                                    }}>{module.subtitle}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            fontSize: '0.75rem', color: sanctuary.textMuted, fontFamily: typography.body,
                                        }}>
                                            <FileText size={12} /> {totalScenarios} scenario{totalScenarios !== 1 ? 's' : ''}
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem', color: sanctuary.textMuted, fontFamily: typography.body,
                                        }}>
                                            {module.scholars.slice(0, 2).join(', ')}{module.scholars.length > 2 ? ` +${module.scholars.length - 2}` : ''}
                                        </span>
                                    </div>
                                </div>

                                {!isLocked && (
                                    <div style={{ color: sanctuary.textMuted, flexShrink: 0, marginTop: '14px' }}>
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ============================================
// MODULE DETAIL VIEW
// ============================================

function ModuleDetail({ module }: { module: EducatorModule }) {
    const navigate = useNavigate();
    const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
    const {
        progress, loading, startModule, completeScenario,
        isScenarioCompleted, getChoiceForScenario,
    } = useEducatorProgress(module.id);

    const colors = COLOR_MAP[module.color];
    const nextModule = getNextEducatorModule(module.slug);
    const activeScenario = module.scenarios[activeScenarioIdx];
    const allScenariosComplete = module.scenarios.every(s => isScenarioCompleted(s.id));

    // Auto-start on first visit
    useEffect(() => {
        if (!loading && !progress) {
            startModule(module.id);
        }
    }, [loading, progress, module.id, startModule]);

    if (loading) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 24px' }}>

                {/* Back */}
                <button onClick={() => navigate('/educator-training')} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: sanctuary.textMuted, fontSize: '0.85rem',
                    fontFamily: typography.body, padding: '0', marginBottom: '20px',
                }}>
                    <ChevronLeft size={16} /> Back to Training
                </button>

                {/* Module Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.06em', color: colors.text, fontFamily: typography.body,
                        }}>Module {module.order}</span>
                        <span style={{
                            fontSize: '0.65rem', fontWeight: 600, padding: '2px 10px',
                            borderRadius: '100px', background: sanctuary.goldBg,
                            color: sanctuary.gold, border: `1px solid ${sanctuary.goldBorder}`,
                        }}>{module.pdCreditHours} PD Hours</span>
                    </div>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '1.8rem', fontWeight: 700,
                        color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '6px',
                    }}>{module.title}</h1>
                    <p style={{
                        color: sanctuary.textSecondary, fontSize: '0.95rem',
                        fontFamily: typography.body, lineHeight: 1.6,
                    }}>{module.subtitle}</p>
                </header>

                {/* Why This Matters */}
                <div className="sanctuary-enter sanctuary-enter-1 sanctuary-card" style={{
                    background: colors.bg, border: `1px solid ${colors.border}`,
                    borderRadius: '16px', padding: '20px', marginBottom: '20px',
                }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700, fontSize: '0.95rem',
                        color: colors.text, marginBottom: '8px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <Sparkles size={16} /> Why This Matters
                    </h3>
                    <p style={{
                        color: sanctuary.textSecondary, fontSize: '0.88rem',
                        fontFamily: typography.body, lineHeight: 1.7,
                    }}>{module.whyThisMatters}</p>
                </div>

                {/* Learning Objectives */}
                <div className="sanctuary-enter sanctuary-enter-2 sanctuary-card" style={{
                    background: sanctuary.bgCard, border: `1px solid ${sanctuary.border}`,
                    borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: sanctuary.shadow,
                }}>
                    <h3 style={{
                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.75rem',
                        color: sanctuary.textMuted, textTransform: 'uppercase',
                        letterSpacing: '0.08em', marginBottom: '12px',
                    }}>Learning Objectives</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {module.learningObjectives.map((obj, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <Check size={14} style={{ color: sanctuary.sage, marginTop: '3px', flexShrink: 0 }} />
                                <span style={{
                                    color: sanctuary.textSecondary, fontSize: '0.85rem',
                                    fontFamily: typography.body, lineHeight: 1.5,
                                }}>{obj}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scenario Tabs */}
                <div className="sanctuary-enter sanctuary-enter-3" style={{
                    display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px',
                }}>
                    {module.scenarios.map((scenario, idx) => {
                        const isActive = activeScenarioIdx === idx;
                        const completed = isScenarioCompleted(scenario.id);

                        return (
                            <button
                                key={scenario.id}
                                onClick={() => setActiveScenarioIdx(idx)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 16px', borderRadius: '12px',
                                    border: `1.5px solid ${isActive ? colors.text : sanctuary.border}`,
                                    background: isActive ? colors.bg : sanctuary.bgCard,
                                    cursor: 'pointer', fontFamily: typography.body,
                                    fontWeight: isActive ? 700 : 500, fontSize: '0.82rem',
                                    color: isActive ? colors.text : sanctuary.textMuted,
                                    whiteSpace: 'nowrap', position: 'relative',
                                }}
                            >
                                {completed ? <Check size={14} /> : <span style={{ fontSize: '0.75rem' }}>#{idx + 1}</span>}
                                {scenario.title}
                                {completed && (
                                    <span style={{
                                        position: 'absolute', top: '-3px', right: '-3px',
                                        width: '10px', height: '10px', borderRadius: '50%',
                                        background: sanctuary.sage, border: `2px solid ${sanctuary.bgCard}`,
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Scenario */}
                {activeScenario && (
                        <ScenarioView
                            scenario={activeScenario}
                            isCompleted={isScenarioCompleted(activeScenario.id)}
                            previousChoice={getChoiceForScenario(activeScenario.id)}
                            onComplete={(choiceId) => completeScenario(module.id, activeScenario.id, choiceId)}
                        colors={colors}
                    />
                )}

                {/* Key Takeaways (shown after all scenarios complete) */}
                {allScenariosComplete && (
                    <div className="sanctuary-enter" style={{
                        background: sanctuary.bgCard, border: `1px solid ${sanctuary.sageBorder}`,
                        borderRadius: '16px', padding: '20px', marginTop: '24px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700, fontSize: '1rem',
                            color: sanctuary.sage, marginBottom: '12px',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <Award size={18} /> Key Takeaways
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {module.keyTakeaways.map((takeaway, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <span style={{
                                        width: '22px', height: '22px', borderRadius: '6px',
                                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, fontFamily: typography.body,
                                        fontSize: '0.7rem', fontWeight: 700, color: sanctuary.sage,
                                    }}>{i + 1}</span>
                                    <p style={{
                                        color: sanctuary.textSecondary, fontSize: '0.88rem',
                                        fontFamily: typography.body, lineHeight: 1.6,
                                    }}>{takeaway}</p>
                                </div>
                            ))}
                        </div>

                        {/* Next Module or Certificate */}
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${sanctuary.border}` }}>
                            {nextModule ? (
                                <Link to={`/educator-training/${nextModule.slug}`} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '12px 20px', borderRadius: '12px',
                                    background: colors.text, color: '#FFFFFF',
                                    fontWeight: 700, fontSize: '0.88rem',
                                    fontFamily: typography.body, textDecoration: 'none',
                                }}>
                                    Next: {nextModule.title} <ChevronRight size={16} />
                                </Link>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{
                                        fontFamily: typography.heading, fontWeight: 700,
                                        fontSize: '1.1rem', color: sanctuary.gold, marginBottom: '8px',
                                    }}>🎓 Training Complete — {getTotalPDHours()} PD Hours Earned</p>
                                    <p style={{
                                        color: sanctuary.textMuted, fontSize: '0.85rem',
                                        fontFamily: typography.body,
                                    }}>Certificate generation coming soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// SCENARIO VIEW COMPONENT
// ============================================

function ScenarioView({
    scenario, isCompleted, previousChoice, onComplete, colors,
}: {
    scenario: ClassroomScenario;
    isCompleted: boolean;
    previousChoice?: string;
    onComplete: (choiceId: string) => void;
    colors: { bg: string; border: string; text: string };
}) {
    const [selectedChoice, setSelectedChoice] = useState<string | null>(previousChoice || null);
    const [showAllResults, setShowAllResults] = useState(isCompleted);

    const handleSelect = (choiceId: string) => {
        setSelectedChoice(choiceId);
        if (!isCompleted) {
            onComplete(choiceId);
        }
    };

    // Reset when scenario changes
    useEffect(() => {
        setSelectedChoice(previousChoice || null);
        setShowAllResults(isCompleted);
    }, [scenario.id, previousChoice, isCompleted]);

    return (
        <div>
            {/* Scenario Setup */}
            <div style={{
                background: sanctuary.bgCard, borderRadius: '16px',
                border: `1px solid ${sanctuary.border}`, padding: '20px',
                boxShadow: sanctuary.shadow, marginBottom: '16px',
            }}>
                <h2 style={{
                    fontFamily: typography.heading, fontWeight: 700,
                    fontSize: '1.15rem', color: sanctuary.text, marginBottom: '12px',
                }}>{scenario.title}</h2>

                {/* Situation */}
                <div style={{
                    background: sanctuary.bgAlt, borderRadius: '12px',
                    padding: '16px', marginBottom: '14px',
                    border: `1px solid ${sanctuary.border}`,
                }}>
                    <p style={{
                        color: sanctuary.textSecondary, fontSize: '0.9rem',
                        fontFamily: typography.body, lineHeight: 1.7, fontStyle: 'italic',
                    }}>{scenario.situation}</p>
                </div>

                {/* Student Behavior */}
                <div style={{ marginBottom: '14px' }}>
                    <h4 style={{
                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.75rem',
                        color: sanctuary.textMuted, textTransform: 'uppercase',
                        letterSpacing: '0.06em', marginBottom: '6px',
                    }}>What You Observe</h4>
                    <p style={{
                        color: sanctuary.text, fontSize: '0.88rem',
                        fontFamily: typography.body, lineHeight: 1.6, fontWeight: 500,
                    }}>{scenario.studentBehavior}</p>
                </div>

                {/* Context Clues */}
                <div>
                    <h4 style={{
                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.75rem',
                        color: sanctuary.textMuted, textTransform: 'uppercase',
                        letterSpacing: '0.06em', marginBottom: '8px',
                    }}>Context Clues</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {scenario.contextClues.map((clue, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: colors.text, marginTop: '7px', flexShrink: 0,
                                }} />
                                <span style={{
                                    color: sanctuary.textSecondary, fontSize: '0.85rem',
                                    fontFamily: typography.body, lineHeight: 1.5,
                                }}>{clue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Choices */}
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{
                    fontFamily: typography.body, fontWeight: 700, fontSize: '0.78rem',
                    color: sanctuary.textMuted, textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginBottom: '12px',
                }}>What Do You Do?</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {scenario.choices.map((choice) => {
                        const isSelected = selectedChoice === choice.id;
                        const showResult = isSelected || showAllResults;
                        const ratingConfig = RATING_CONFIG[choice.rating];
                        const RatingIcon = ratingConfig.icon;

                        return (
                            <div key={choice.id} style={{
                                background: sanctuary.bgCard, borderRadius: '14px',
                                border: `1px solid ${isSelected ? colors.border : sanctuary.border}`,
                                overflow: 'hidden', boxShadow: isSelected ? sanctuary.shadowMd : sanctuary.shadow,
                            }}>
                                {/* Choice button */}
                                <button
                                    onClick={() => handleSelect(choice.id)}
                                    disabled={!!selectedChoice && !showAllResults}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '16px 18px',
                                        background: 'none', border: 'none',
                                        cursor: (selectedChoice && !showAllResults) ? 'default' : 'pointer',
                                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                                    }}
                                >
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '8px',
                                        border: `2px solid ${isSelected ? colors.text : sanctuary.border}`,
                                        background: isSelected ? colors.bg : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, color: colors.text,
                                    }}>
                                        {isSelected && <Check size={14} />}
                                    </div>
                                    <div>
                                        <h4 style={{
                                            fontFamily: typography.heading, fontWeight: 600,
                                            fontSize: '0.92rem', color: sanctuary.text, marginBottom: '2px',
                                        }}>{choice.label}</h4>
                                        <p style={{
                                            color: sanctuary.textMuted, fontSize: '0.82rem',
                                            fontFamily: typography.body, fontStyle: 'italic',
                                        }}>"{choice.response}"</p>
                                    </div>
                                </button>

                                {/* Result (shown after selection) */}
                                {showResult && (
                                    <div style={{
                                        padding: '0 18px 18px', borderTop: `1px solid ${sanctuary.border}`,
                                        paddingTop: '14px',
                                    }}>
                                        {/* Rating badge */}
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '4px 12px', borderRadius: '100px',
                                            background: ratingConfig.bg,
                                            border: `1px solid ${ratingConfig.border}`,
                                            marginBottom: '10px',
                                        }}>
                                            <RatingIcon size={13} style={{ color: ratingConfig.color }} />
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700, color: ratingConfig.color,
                                                fontFamily: typography.body, textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}>{ratingConfig.label}</span>
                                        </div>

                                        {/* Consequence */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <h5 style={{
                                                fontFamily: typography.body, fontWeight: 700, fontSize: '0.72rem',
                                                color: sanctuary.textMuted, textTransform: 'uppercase',
                                                letterSpacing: '0.06em', marginBottom: '4px',
                                            }}>What Happens</h5>
                                            <p style={{
                                                color: sanctuary.textSecondary, fontSize: '0.85rem',
                                                fontFamily: typography.body, lineHeight: 1.6,
                                            }}>{choice.consequence}</p>
                                        </div>

                                        {/* Theory */}
                                        <div style={{
                                            background: sanctuary.bgAlt, borderRadius: '10px',
                                            padding: '12px', border: `1px solid ${sanctuary.border}`,
                                        }}>
                                            <h5 style={{
                                                fontFamily: typography.body, fontWeight: 700, fontSize: '0.72rem',
                                                color: colors.text, textTransform: 'uppercase',
                                                letterSpacing: '0.06em', marginBottom: '4px',
                                            }}>The Theory</h5>
                                            <p style={{
                                                color: sanctuary.textSecondary, fontSize: '0.82rem',
                                                fontFamily: typography.body, lineHeight: 1.6, marginBottom: '6px',
                                            }}>{choice.theoryExplanation}</p>
                                            <p style={{
                                                color: sanctuary.textMuted, fontSize: '0.75rem',
                                                fontFamily: typography.body, fontStyle: 'italic',
                                            }}>{choice.citation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Show All button */}
                {selectedChoice && !showAllResults && (
                    <button
                        onClick={() => setShowAllResults(true)}
                        style={{
                            marginTop: '12px', padding: '10px 20px', borderRadius: '10px',
                            background: colors.bg, border: `1px solid ${colors.border}`,
                            color: colors.text, fontWeight: 600, fontSize: '0.82rem',
                            fontFamily: typography.body, cursor: 'pointer',
                        }}
                    >
                        See All Responses & Theory
                    </button>
                )}
            </div>

            {/* Debrief (shown after exploring results) */}
            {showAllResults && (
                <div className="sanctuary-enter" style={{
                    background: colors.bg, border: `1px solid ${colors.border}`,
                    borderRadius: '16px', padding: '20px',
                }}>
                    <h3 style={{
                        fontFamily: typography.heading, fontWeight: 700, fontSize: '0.95rem',
                        color: colors.text, marginBottom: '8px',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <BookOpen size={16} /> Debrief
                    </h3>
                    <p style={{
                        color: sanctuary.textSecondary, fontSize: '0.88rem',
                        fontFamily: typography.body, lineHeight: 1.7,
                    }}>{scenario.debrief}</p>
                </div>
            )}
        </div>
    );
}

// ============================================
// STAT CARD
// ============================================

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div style={{
            background: sanctuary.bgCard, borderRadius: '14px',
            border: `1px solid ${sanctuary.border}`, padding: '16px',
            textAlign: 'center', boxShadow: sanctuary.shadow,
        }}>
            <div style={{ color: sanctuary.purple, marginBottom: '6px' }}>{icon}</div>
            <div style={{
                fontFamily: typography.heading, fontWeight: 700, fontSize: '1.3rem', color: sanctuary.text,
            }}>{value}</div>
            <div style={{
                fontFamily: typography.body, fontSize: '0.72rem', color: sanctuary.textMuted, marginTop: '2px',
            }}>{label}</div>
        </div>
    );
}
