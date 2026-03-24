/**
 * PracticeModulesPage — Theory-to-Practice Curriculum
 *
 * Pillar 1: Parent as Practitioner
 *
 * Two views:
 *   1. Module List — overview of all 6 modules with progress indicators
 *   2. Module Detail — phase-by-phase learning with activity cards
 *
 * Path: src/pages/PracticeModulesPage.tsx
 * Route: /practice and /practice/:slug
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Lock,
    Award,
    BookOpen,
    Eye,
    Zap,
    Heart,
    Check,
    Clock,
    MessageCircle,
    Activity,
    Volume2,
    Star,
    Users,
    Sparkles,
} from 'lucide-react';
import {
    PRACTICE_MODULES,
    getModuleBySlug,
    getNextModule,
    getModulesForTier,
    getModuleDuration,
    type PracticeModule,
    type PhaseActivity,
    type ModulePhase,
} from '../data/practiceModules';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useSubscription } from '../contexts/SubscriptionContext';
import { sanctuary, typography } from '../shared/theme';

// ─────────────────────────────────────────
// Icon Mapping
// ─────────────────────────────────────────
const MODULE_ICONS: Record<string, React.ElementType> = {
    MessageCircle,
    Activity,
    Volume2,
    Star,
    Users,
    Eye,
};

const PHASE_ICONS: Record<ModulePhase, React.ElementType> = {
    learn: BookOpen,
    observe: Eye,
    practice: Zap,
    reflect: Heart,
};

const PHASE_LABELS: Record<ModulePhase, string> = {
    learn: 'Learn',
    observe: 'Observe',
    practice: 'Practice',
    reflect: 'Reflect',
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
    gold: { bg: sanctuary.goldBg, border: sanctuary.goldBorder, text: sanctuary.gold },
    sage: { bg: sanctuary.sageBg, border: sanctuary.sageBorder, text: sanctuary.sage },
    purple: { bg: sanctuary.purpleBg, border: sanctuary.purpleBorder, text: sanctuary.purple },
    rose: { bg: sanctuary.roseBg, border: sanctuary.roseBorder, text: sanctuary.rose },
};

// ============================================
// MAIN COMPONENT
// ============================================

export function PracticeModulesPage() {
    const { slug } = useParams<{ slug?: string }>();

    if (slug) {
        const module = getModuleBySlug(slug);
        if (module) return <ModuleDetail module={module} />;
    }

    return <ModuleList />;
}

// ============================================
// MODULE LIST VIEW
// ============================================

function ModuleList() {
    const { tier } = useSubscription();
    const { allProgress, totalModulesCompleted, badgesEarned } = useModuleProgress();
    const availableModules = getModulesForTier(tier);
    const navigate = useNavigate();

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '28px' }}>
                    <h1 style={{
                        fontFamily: typography.heading,
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        letterSpacing: '-0.02em',
                        marginBottom: '6px',
                    }}>Theory to Practice</h1>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '1rem',
                        fontFamily: typography.body,
                        lineHeight: 1.6,
                    }}>
                        Six modules that teach you to see what clinicians see — and respond with the love only a parent can give.
                    </p>
                </header>

                {/* Progress Summary */}
                <div className="sanctuary-enter sanctuary-enter-1" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                    marginBottom: '24px',
                }}>
                    <StatCard label="Modules Completed" value={`${totalModulesCompleted}/6`} icon={<BookOpen size={16} />} />
                    <StatCard label="Badges Earned" value={`${badgesEarned}`} icon={<Award size={16} />} />
                    <StatCard label="Practice Hours" value={formatHours(allProgress)} icon={<Clock size={16} />} />
                </div>

                {/* Module Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {PRACTICE_MODULES.map((module, idx) => {
                        const isAvailable = availableModules.some(m => m.id === module.id);
                        const moduleProgress = allProgress.find(p => p.moduleId === module.id);
                        const isCompleted = !!moduleProgress?.completedAt;
                        const isStarted = !!moduleProgress;
                        const phasesCompleted = moduleProgress?.completedPhases.length || 0;
                        const colors = COLOR_MAP[module.color];
                        const IconComponent = MODULE_ICONS[module.icon] || BookOpen;

                        // Check prerequisite
                        const prereqMet = !module.prerequisite ||
                            allProgress.some(p => {
                                const prereqModule = PRACTICE_MODULES.find(m => m.slug === module.prerequisite);
                                return prereqModule && p.moduleId === prereqModule.id && p.completedAt;
                            });

                        const isLocked = !isAvailable || !prereqMet;

                        return (
                            <button
                                key={module.id}
                                className={`sanctuary-card sanctuary-enter sanctuary-enter-${Math.min(idx + 2, 6)}`}
                                onClick={() => !isLocked && navigate(`/practice/${module.slug}`)}
                                disabled={isLocked}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    background: isLocked ? sanctuary.bgAlt : sanctuary.bgCard,
                                    borderRadius: '16px',
                                    border: `1px solid ${isCompleted ? colors.border : sanctuary.border}`,
                                    padding: '20px',
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLocked ? 0.6 : 1,
                                    boxShadow: sanctuary.shadow,
                                    display: 'flex',
                                    gap: '16px',
                                    alignItems: 'flex-start',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Completion bar at top */}
                                {isStarted && !isCompleted && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: `${(phasesCompleted / 4) * 100}%`,
                                        height: '3px',
                                        background: `linear-gradient(90deg, ${colors.text}, ${colors.text}80)`,
                                        borderRadius: '0 3px 3px 0',
                                        transition: 'width 0.4s ease',
                                    }} />
                                )}

                                {/* Icon */}
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: isLocked ? sanctuary.bgAlt : colors.bg,
                                    border: `1px solid ${isLocked ? sanctuary.border : colors.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    color: isLocked ? sanctuary.textMuted : colors.text,
                                }}>
                                    {isLocked ? <Lock size={20} /> :
                                        isCompleted ? <Award size={20} /> :
                                            <IconComponent size={20} />}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px',
                                    }}>
                                        <span style={{
                                            fontFamily: typography.body,
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.06em',
                                            color: isLocked ? sanctuary.textMuted : colors.text,
                                        }}>Module {module.order}</span>
                                        {module.tier !== 'free' && (
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: 600,
                                                padding: '2px 8px',
                                                borderRadius: '100px',
                                                background: sanctuary.purpleBg,
                                                color: sanctuary.purple,
                                                border: `1px solid ${sanctuary.purpleBorder}`,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}>{module.tier}</span>
                                        )}
                                        {isCompleted && (
                                            <span style={{
                                                fontSize: '0.65rem',
                                                fontWeight: 600,
                                                padding: '2px 8px',
                                                borderRadius: '100px',
                                                background: sanctuary.sageBg,
                                                color: sanctuary.sage,
                                                border: `1px solid ${sanctuary.sageBorder}`,
                                            }}>✓ Complete</span>
                                        )}
                                    </div>
                                    <h3 style={{
                                        fontFamily: typography.heading,
                                        fontWeight: 700,
                                        fontSize: '1.05rem',
                                        color: isLocked ? sanctuary.textMuted : sanctuary.text,
                                        marginBottom: '3px',
                                    }}>{module.title}</h3>
                                    <p style={{
                                        fontFamily: typography.body,
                                        fontSize: '0.85rem',
                                        color: sanctuary.textMuted,
                                        lineHeight: 1.5,
                                    }}>{module.subtitle}</p>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginTop: '8px',
                                    }}>
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.75rem',
                                            color: sanctuary.textMuted,
                                            fontFamily: typography.body,
                                        }}>
                                            <Clock size={12} /> {getModuleDuration(module)} min
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: sanctuary.textMuted,
                                            fontFamily: typography.body,
                                        }}>
                                            {module.scholars.join(', ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                {!isLocked && (
                                    <div style={{
                                        color: sanctuary.textMuted,
                                        flexShrink: 0,
                                        marginTop: '14px',
                                    }}>
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

function ModuleDetail({ module }: { module: PracticeModule }) {
    const navigate = useNavigate();
    const [activePhase, setActivePhase] = useState<ModulePhase>('learn');
    const {
        progress,
        loading,
        startModule,
        completePhase,
        completeActivity,
        saveJournalEntry,
        isPhaseCompleted,
        isActivityCompleted,
        completionPercent,
    } = useModuleProgress(module.id);

    const colors = COLOR_MAP[module.color];
    const currentPhase = module.phases.find(p => p.phase === activePhase)!;
    const nextModule = getNextModule(module.slug);

    // Auto-start module on first visit
    useEffect(() => {
        if (!loading && !progress) {
            startModule(module.id);
        }
    }, [loading, progress, module.id, startModule]);

    const handleCompleteActivity = async (activityId: string) => {
        await completeActivity(module.id, activityId);

        // Check if all activities in current phase are completed
        const phaseActivities = currentPhase.activities;
        const completedCount = phaseActivities.filter(
            a => isActivityCompleted(a.id) || a.id === activityId
        ).length;

        if (completedCount >= phaseActivities.length) {
            await completePhase(module.id, activePhase);
        }
    };

    if (loading) {
        return (
            <div style={{
                background: sanctuary.bg,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 24px' }}>

                {/* Back button */}
                <button
                    onClick={() => navigate('/practice')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: sanctuary.textMuted,
                        fontSize: '0.85rem',
                        fontFamily: typography.body,
                        padding: '0',
                        marginBottom: '20px',
                    }}
                >
                    <ChevronLeft size={16} /> Back to Modules
                </button>

                {/* Module Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                    }}>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: colors.text,
                            fontFamily: typography.body,
                        }}>Module {module.order}</span>
                        {progress?.badgeEarned && (
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '2px 10px',
                                borderRadius: '100px',
                                background: sanctuary.sageBg,
                                color: sanctuary.sage,
                                border: `1px solid ${sanctuary.sageBorder}`,
                            }}>
                                <Award size={12} /> Badge Earned
                            </span>
                        )}
                    </div>
                    <h1 style={{
                        fontFamily: typography.heading,
                        fontSize: '1.8rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        letterSpacing: '-0.02em',
                        marginBottom: '6px',
                    }}>{module.title}</h1>
                    <p style={{
                        color: sanctuary.textSecondary,
                        fontSize: '0.95rem',
                        fontFamily: typography.body,
                        lineHeight: 1.6,
                    }}>{module.subtitle}</p>

                    {/* Progress Bar */}
                    <div style={{
                        marginTop: '16px',
                        background: sanctuary.bgAlt,
                        borderRadius: '100px',
                        height: '6px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            width: `${completionPercent}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${colors.text}, ${colors.text}90)`,
                            borderRadius: '100px',
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                    <p style={{
                        fontSize: '0.75rem',
                        color: sanctuary.textMuted,
                        fontFamily: typography.body,
                        marginTop: '6px',
                    }}>{completionPercent}% complete</p>
                </header>

                {/* Why This Matters */}
                <div className="sanctuary-enter sanctuary-enter-1 sanctuary-card" style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                }}>
                    <h3 style={{
                        fontFamily: typography.heading,
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: colors.text,
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <Sparkles size={16} /> Why This Matters
                    </h3>
                    <p style={{
                        color: sanctuary.textSecondary,
                        fontSize: '0.88rem',
                        fontFamily: typography.body,
                        lineHeight: 1.7,
                    }}>{module.whyThisMatters}</p>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '0.78rem',
                        fontFamily: typography.body,
                        fontStyle: 'italic',
                        marginTop: '12px',
                    }}>
                        Based on: {module.citation}
                    </p>
                </div>

                {/* Phase Tabs */}
                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '20px',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                }}>
                    {(['learn', 'observe', 'practice', 'reflect'] as ModulePhase[]).map((phase) => {
                        const isActive = activePhase === phase;
                        const completed = isPhaseCompleted(phase);
                        const PhaseIcon = PHASE_ICONS[phase];

                        return (
                            <button
                                key={phase}
                                onClick={() => setActivePhase(phase)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    border: `1.5px solid ${isActive ? colors.text : sanctuary.border}`,
                                    background: isActive ? colors.bg : sanctuary.bgCard,
                                    cursor: 'pointer',
                                    fontFamily: typography.body,
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.82rem',
                                    color: isActive ? colors.text : sanctuary.textMuted,
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                }}
                            >
                                {completed ? <Check size={14} /> : <PhaseIcon size={14} />}
                                {PHASE_LABELS[phase]}
                                {completed && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-3px',
                                        right: '-3px',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: sanctuary.sage,
                                        border: `2px solid ${sanctuary.bgCard}`,
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Phase Content */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '6px',
                    }}>
                        <h2 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: sanctuary.text,
                        }}>{currentPhase.title}</h2>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            color: sanctuary.textMuted,
                            fontFamily: typography.body,
                        }}>
                            <Clock size={11} /> {currentPhase.estimatedMinutes} min
                        </span>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '0.88rem',
                        fontFamily: typography.body,
                        marginBottom: '16px',
                    }}>{currentPhase.description}</p>

                    {/* Activity Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {currentPhase.activities.map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                isCompleted={isActivityCompleted(activity.id)}
                                onComplete={() => handleCompleteActivity(activity.id)}
                                onSaveJournal={(response) => saveJournalEntry(module.id, activity.id, response)}
                                existingJournal={progress?.journalEntries.find(e => e.activityId === activity.id)?.response}
                                colors={colors}
                            />
                        ))}
                    </div>
                </div>

                {/* Phase Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: `1px solid ${sanctuary.border}`,
                }}>
                    {activePhase !== 'learn' ? (
                        <button
                            onClick={() => {
                                const phases: ModulePhase[] = ['learn', 'observe', 'practice', 'reflect'];
                                const idx = phases.indexOf(activePhase);
                                if (idx > 0) setActivePhase(phases[idx - 1]);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'none',
                                border: `1px solid ${sanctuary.border}`,
                                borderRadius: '10px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontFamily: typography.body,
                                fontSize: '0.82rem',
                                color: sanctuary.textSecondary,
                            }}
                        >
                            <ChevronLeft size={14} /> Previous
                        </button>
                    ) : <div />}

                    {activePhase !== 'reflect' ? (
                        <button
                            onClick={() => {
                                const phases: ModulePhase[] = ['learn', 'observe', 'practice', 'reflect'];
                                const idx = phases.indexOf(activePhase);
                                if (idx < 3) setActivePhase(phases[idx + 1]);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '10px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontFamily: typography.body,
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                color: colors.text,
                            }}
                        >
                            Next Phase <ChevronRight size={14} />
                        </button>
                    ) : nextModule ? (
                        <Link
                            to={`/practice/${nextModule.slug}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: colors.bg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '10px',
                                padding: '10px 16px',
                                textDecoration: 'none',
                                fontFamily: typography.body,
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                color: colors.text,
                            }}
                        >
                            Next Module <ChevronRight size={14} />
                        </Link>
                    ) : (
                        <span style={{
                            fontFamily: typography.body,
                            fontSize: '0.82rem',
                            color: sanctuary.sage,
                            fontWeight: 600,
                        }}>
                            🎓 Curriculum Complete
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// ACTIVITY CARD COMPONENT
// ============================================

function ActivityCard({
    activity,
    isCompleted,
    onComplete,
    onSaveJournal,
    existingJournal,
    colors,
}: {
    activity: PhaseActivity;
    isCompleted: boolean;
    onComplete: () => void;
    onSaveJournal: (response: string) => void;
    existingJournal?: string;
    colors: { bg: string; border: string; text: string };
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [journalText, setJournalText] = useState(existingJournal || '');
    const [saved, setSaved] = useState(false);

    const typeLabels: Record<string, string> = {
        read: 'Read',
        prompt: 'Reflect',
        exercise: 'Exercise',
        journal: 'Journal',
        observe: 'Observe',
    };

    const handleSaveJournal = async () => {
        if (!journalText.trim()) return;
        await onSaveJournal(journalText);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (!isCompleted) {
            onComplete();
        }
    };

    return (
        <div style={{
            background: sanctuary.bgCard,
            borderRadius: '14px',
            border: `1px solid ${isCompleted ? sanctuary.sageBorder : sanctuary.border}`,
            overflow: 'hidden',
            boxShadow: sanctuary.shadow,
        }}>
            {/* Activity Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 18px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}
            >
                {/* Completion indicator */}
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: `2px solid ${isCompleted ? sanctuary.sage : sanctuary.border}`,
                    background: isCompleted ? sanctuary.sageBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: sanctuary.sage,
                }}>
                    {isCompleted && <Check size={14} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '2px',
                    }}>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            color: colors.text,
                            fontFamily: typography.body,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: colors.bg,
                        }}>{typeLabels[activity.type]}</span>
                    </div>
                    <h4 style={{
                        fontFamily: typography.heading,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: sanctuary.text,
                    }}>{activity.title}</h4>
                </div>

                <ChevronRight
                    size={16}
                    style={{
                        color: sanctuary.textMuted,
                        flexShrink: 0,
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{
                    padding: '0 18px 18px',
                    borderTop: `1px solid ${sanctuary.border}`,
                    paddingTop: '16px',
                }}>
                    {/* Content text */}
                    <div style={{
                        color: sanctuary.textSecondary,
                        fontSize: '0.88rem',
                        fontFamily: typography.body,
                        lineHeight: 1.8,
                        whiteSpace: 'pre-line',
                        marginBottom: activity.journalPrompt ? '16px' : '12px',
                    }}>
                        {activity.content}
                    </div>

                    {/* Journal prompt (if applicable) */}
                    {activity.journalPrompt && (
                        <div style={{
                            background: sanctuary.bgAlt,
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${sanctuary.border}`,
                        }}>
                            <p style={{
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: colors.text,
                                fontFamily: typography.body,
                                marginBottom: '10px',
                            }}>
                                ✍️ {activity.journalPrompt}
                            </p>
                            <textarea
                                value={journalText}
                                onChange={(e) => setJournalText(e.target.value)}
                                placeholder="Write your reflection here..."
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    border: `1px solid ${sanctuary.border}`,
                                    background: sanctuary.bgCard,
                                    color: sanctuary.text,
                                    fontSize: '0.88rem',
                                    fontFamily: typography.body,
                                    lineHeight: 1.6,
                                    resize: 'vertical',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '8px',
                            }}>
                                <button
                                    onClick={handleSaveJournal}
                                    disabled={!journalText.trim()}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: journalText.trim() ? colors.text : sanctuary.border,
                                        color: '#FFFFFF',
                                        fontWeight: 600,
                                        fontSize: '0.82rem',
                                        fontFamily: typography.body,
                                        cursor: journalText.trim() ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {saved ? '✓ Saved' : 'Save Reflection'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mark complete button (for non-journal activities) */}
                    {!activity.journalPrompt && !isCompleted && (
                        <button
                            onClick={onComplete}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                background: colors.bg,
                                color: colors.text,
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                fontFamily: typography.body,
                                cursor: 'pointer',
                            }}
                        >
                            <Check size={14} /> Mark as Read
                        </button>
                    )}
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
            background: sanctuary.bgCard,
            borderRadius: '14px',
            border: `1px solid ${sanctuary.border}`,
            padding: '16px',
            textAlign: 'center',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{ color: sanctuary.gold, marginBottom: '6px' }}>{icon}</div>
            <div style={{
                fontFamily: typography.heading,
                fontWeight: 700,
                fontSize: '1.3rem',
                color: sanctuary.text,
            }}>{value}</div>
            <div style={{
                fontFamily: typography.body,
                fontSize: '0.72rem',
                color: sanctuary.textMuted,
                marginTop: '2px',
            }}>{label}</div>
        </div>
    );
}

// ============================================
// HELPERS
// ============================================

function formatHours(allProgress: { completedPhases: string[] }[]): string {
    // Rough estimate: each completed phase ≈ 12 min average
    const totalMinutes = allProgress.reduce(
        (sum, p) => sum + (p.completedPhases?.length || 0) * 12,
        0
    );
    if (totalMinutes < 60) return `${totalMinutes}m`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
