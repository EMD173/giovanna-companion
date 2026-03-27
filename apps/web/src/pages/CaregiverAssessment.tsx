/**
 * CaregiverAssessment — Self-Screening Wizard
 *
 * "If the child is going to be evaluated, the caregiver has to be evaluated too."
 * — Shannon Mattox, Founding Ambassador
 *
 * A trauma-informed, multi-step self-reflection tool that connects
 * caregivers with personalized resources for their OWN needs.
 *
 * NOT a diagnostic tool. A mirror that says: "Your needs matter too."
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ArrowRight, Sparkles, Heart,
    ChevronRight, RotateCcw, CheckCircle2
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import {
    ASSESSMENT_DOMAINS,
    calculateResults,
    STORAGE_KEY,
    type AssessmentResult,
} from '../data/caregiverAssessmentData';

type Phase = 'intro' | 'questions' | 'results';

export function CaregiverAssessment() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>('intro');
    const [currentDomain, setCurrentDomain] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [results, setResults] = useState<AssessmentResult[] | null>(null);

    const domain = ASSESSMENT_DOMAINS[currentDomain];
    const totalDomains = ASSESSMENT_DOMAINS.length;
    const progress = ((currentDomain) / totalDomains) * 100;

    const allCurrentAnswered = useMemo(() => {
        if (!domain) return false;
        return domain.questions.every(q => answers[q.id] !== undefined);
    }, [domain, answers]);

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentDomain < totalDomains - 1) {
            setCurrentDomain(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Calculate and show results
            const r = calculateResults(answers);
            setResults(r);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, results: r, timestamp: Date.now() }));
            setPhase('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentDomain > 0) {
            setCurrentDomain(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setPhase('intro');
        }
    };

    const handleRestart = () => {
        setAnswers({});
        setResults(null);
        setCurrentDomain(0);
        setPhase('intro');
    };

    // ──────────── INTRO SCREEN ────────────
    if (phase === 'intro') {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

                    {/* Header */}
                    <div className="sanctuary-enter" style={{ marginBottom: '32px' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '20px',
                            background: 'linear-gradient(135deg, #E8D5F5, #F5E6D0)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '20px',
                        }}>
                            <Heart size={28} color="#6B4C9A" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '8px',
                        }}>
                            Your Self-Check
                        </h1>
                        <p style={{
                            fontFamily: typography.body, fontSize: '1rem', color: sanctuary.textSecondary,
                            lineHeight: 1.7,
                        }}>
                            Resources for your family, your advocacy, and <strong>yourself</strong>.
                        </p>
                    </div>

                    <DisclaimerBanner storageKey="assessment_disclaimer" />

                    {/* Why This Matters */}
                    <div className="sanctuary-enter sanctuary-enter-1" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.goldBorder}`,
                        padding: '24px', marginBottom: '16px',
                        boxShadow: sanctuary.shadow, position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.gold}40, transparent)`,
                        }} />
                        <h3 style={{
                            fontFamily: typography.heading, fontSize: '1.1rem', fontWeight: 700,
                            color: sanctuary.text, marginBottom: '12px',
                        }}>
                            Why This Matters
                        </h3>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.92rem',
                            color: sanctuary.textSecondary, lineHeight: 1.7, marginBottom: '12px',
                        }}>
                            Research shows that a significant percentage of parents raising neurodivergent children
                            are neurodivergent themselves. ADHD, autism, sensory differences, anxiety — these run in families.
                        </p>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.92rem',
                            color: sanctuary.textSecondary, lineHeight: 1.7,
                        }}>
                            This isn't about putting a label on you. It's about making sure <strong>your
                            needs</strong> aren't invisible while you advocate for everyone else.
                        </p>
                    </div>

                    {/* What We'll Cover */}
                    <div className="sanctuary-enter sanctuary-enter-2" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px', marginBottom: '28px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h3 style={{
                            fontFamily: typography.heading, fontSize: '1rem', fontWeight: 700,
                            color: sanctuary.text, marginBottom: '16px',
                        }}>
                            6 Areas We'll Explore
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {ASSESSMENT_DOMAINS.map(d => (
                                <div key={d.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '10px 12px', borderRadius: '12px',
                                    background: sanctuary.bgAlt,
                                }}>
                                    <span style={{ fontSize: '1.3rem' }}>{d.emoji}</span>
                                    <div>
                                        <p style={{
                                            fontFamily: typography.heading, fontWeight: 700,
                                            color: sanctuary.text, fontSize: '0.9rem',
                                        }}>{d.title}</p>
                                        <p style={{
                                            fontFamily: typography.body, fontSize: '0.8rem',
                                            color: sanctuary.textMuted,
                                        }}>{d.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Time Estimate */}
                    <div className="sanctuary-enter sanctuary-enter-3" style={{
                        padding: '14px 18px', borderRadius: '14px',
                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                        marginBottom: '28px', textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.88rem',
                            color: sanctuary.sage, fontWeight: 600,
                        }}>
                            ⏱ Takes about 5 minutes · 24 questions · All private to your device
                        </p>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={() => setPhase('questions')}
                        className="sanctuary-enter sanctuary-enter-4"
                        style={{
                            width: '100%', padding: '16px', borderRadius: '16px',
                            background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            color: '#1A1A1A', border: 'none', fontWeight: 700,
                            fontSize: '1rem', cursor: 'pointer', fontFamily: typography.body,
                            boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        }}
                    >
                        <Sparkles size={18} /> Begin Self-Check
                    </button>
                </div>
            </div>
        );
    }

    // ──────────── RESULTS SCREEN ────────────
    if (phase === 'results' && results) {
        const highAreas = results.filter(r => r.level === 'high');

        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

                    {/* Header */}
                    <div className="sanctuary-enter" style={{ marginBottom: '28px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '18px',
                            background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                        }}>
                            <CheckCircle2 size={28} color={sanctuary.sage} />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '1.8rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em', marginBottom: '8px',
                        }}>
                            Your Reflection
                        </h1>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.95rem',
                            color: sanctuary.textSecondary, lineHeight: 1.6,
                        }}>
                            These aren't diagnoses — they're mirrors. What you see here can guide you
                            toward support that <strong>actually fits</strong>.
                        </p>
                    </div>

                    {/* Summary Banner */}
                    {highAreas.length > 0 && (
                        <div className="sanctuary-enter sanctuary-enter-1" style={{
                            padding: '18px', borderRadius: '16px',
                            background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                            marginBottom: '20px',
                        }}>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.9rem',
                                color: sanctuary.rose, fontWeight: 600, lineHeight: 1.6,
                            }}>
                                💛 You flagged high in {highAreas.length} area{highAreas.length > 1 ? 's' : ''}.
                                This doesn't mean something is "wrong" — it means your needs are real and resources exist.
                                Scroll down for personalized recommendations.
                            </p>
                        </div>
                    )}

                    {/* Domain Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {results.map((result, idx) => {
                            const domainData = ASSESSMENT_DOMAINS.find(d => d.id === result.domainId)!;
                            const percentage = Math.round((result.score / result.maxScore) * 100);
                            const barColor = result.level === 'high' ? '#D35F5F'
                                : result.level === 'moderate' ? '#D4AF37' : '#7A9E7E';

                            return (
                                <div
                                    key={result.domainId}
                                    className={`sanctuary-enter sanctuary-enter-${idx + 1}`}
                                    style={{
                                        background: sanctuary.bgCard, borderRadius: '18px',
                                        border: `1px solid ${sanctuary.border}`,
                                        padding: '20px', boxShadow: sanctuary.shadow,
                                    }}
                                >
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        marginBottom: '12px',
                                    }}>
                                        <span style={{ fontSize: '1.3rem' }}>{domainData.emoji}</span>
                                        <h3 style={{
                                            fontFamily: typography.heading, fontWeight: 700,
                                            color: sanctuary.text, fontSize: '1rem', flex: 1,
                                        }}>{domainData.title}</h3>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '100px',
                                            fontSize: '0.75rem', fontWeight: 700,
                                            fontFamily: typography.body,
                                            background: result.level === 'high' ? sanctuary.roseBg
                                                : result.level === 'moderate' ? sanctuary.goldBg : sanctuary.sageBg,
                                            color: result.level === 'high' ? sanctuary.rose
                                                : result.level === 'moderate' ? sanctuary.gold : sanctuary.sage,
                                        }}>
                                            {result.level === 'high' ? 'High' : result.level === 'moderate' ? 'Moderate' : 'Low'}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div style={{
                                        height: '8px', borderRadius: '4px', background: sanctuary.bgAlt,
                                        marginBottom: '12px', overflow: 'hidden',
                                    }}>
                                        <div style={{
                                            height: '100%', borderRadius: '4px',
                                            background: barColor,
                                            width: `${percentage}%`,
                                            transition: 'width 0.8s ease',
                                        }} />
                                    </div>

                                    <p style={{
                                        fontFamily: typography.body, fontSize: '0.85rem',
                                        color: sanctuary.textSecondary, lineHeight: 1.6,
                                        marginBottom: result.level !== 'low' ? '12px' : 0,
                                    }}>
                                        {result.insight}
                                    </p>

                                    {/* Resource links for moderate/high */}
                                    {result.level !== 'low' && domainData.resourceSlugs.length > 0 && (
                                        <div style={{
                                            display: 'flex', flexWrap: 'wrap', gap: '6px',
                                        }}>
                                            {domainData.resourceSlugs.map(slug => (
                                                <button
                                                    key={slug}
                                                    onClick={() => navigate(`/resources/${slug}`)}
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '6px 12px', borderRadius: '100px',
                                                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                                        color: sanctuary.gold, fontSize: '0.78rem', fontWeight: 600,
                                                        cursor: 'pointer', fontFamily: typography.body,
                                                    }}
                                                >
                                                    <ChevronRight size={12} /> View Resource
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px',
                    }}>
                        <button
                            onClick={() => navigate('/resources')}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px',
                                background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                color: '#1A1A1A', border: 'none', fontWeight: 700,
                                fontSize: '0.95rem', cursor: 'pointer', fontFamily: typography.body,
                                boxShadow: '0 6px 20px rgba(212, 175, 55, 0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            }}
                        >
                            <Heart size={18} /> Explore The Sanctuary
                        </button>
                        <button
                            onClick={handleRestart}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '14px',
                                background: 'none', border: `1.5px solid ${sanctuary.border}`,
                                color: sanctuary.textSecondary, fontWeight: 600,
                                fontSize: '0.88rem', cursor: 'pointer', fontFamily: typography.body,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                        >
                            <RotateCcw size={16} /> Retake Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ──────────── QUESTIONS SCREEN ────────────
    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: '8px',
                    }}>
                        <span style={{
                            fontFamily: typography.body, fontSize: '0.78rem', fontWeight: 600,
                            color: sanctuary.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                            {domain.emoji} {domain.title}
                        </span>
                        <span style={{
                            fontFamily: typography.body, fontSize: '0.78rem', fontWeight: 700,
                            color: sanctuary.gold,
                        }}>
                            {currentDomain + 1} / {totalDomains}
                        </span>
                    </div>
                    <div style={{
                        height: '6px', borderRadius: '3px', background: sanctuary.bgAlt,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', borderRadius: '3px',
                            background: `linear-gradient(90deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                            width: `${progress}%`,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>

                {/* Domain Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontFamily: typography.heading, fontSize: '1.5rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '6px',
                    }}>
                        {domain.emoji} {domain.title}
                    </h2>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.88rem',
                        color: sanctuary.textSecondary, lineHeight: 1.5,
                    }}>
                        {domain.description}
                    </p>
                </div>

                {/* Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                    {domain.questions.map((q, qi) => (
                        <div
                            key={q.id}
                            className={`sanctuary-enter sanctuary-enter-${qi}`}
                            style={{
                                background: sanctuary.bgCard, borderRadius: '18px',
                                border: `1px solid ${answers[q.id] !== undefined ? sanctuary.goldBorder : sanctuary.border}`,
                                padding: '20px', boxShadow: sanctuary.shadow,
                                transition: 'border-color 0.3s ease',
                            }}
                        >
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.92rem',
                                color: sanctuary.text, fontWeight: 600,
                                lineHeight: 1.6, marginBottom: q.subtext ? '4px' : '14px',
                            }}>
                                {q.text}
                            </p>
                            {q.subtext && (
                                <p style={{
                                    fontFamily: typography.body, fontSize: '0.8rem',
                                    color: sanctuary.textMuted, fontStyle: 'italic',
                                    marginBottom: '14px',
                                }}>
                                    {q.subtext}
                                </p>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {q.options.map(opt => {
                                    const selected = answers[q.id] === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleAnswer(q.id, opt.value)}
                                            style={{
                                                width: '100%', padding: '10px 14px',
                                                borderRadius: '12px', border: 'none',
                                                background: selected
                                                    ? `linear-gradient(135deg, ${sanctuary.gold}18, ${sanctuary.goldLight}18)`
                                                    : sanctuary.bgAlt,
                                                color: selected ? sanctuary.gold : sanctuary.textSecondary,
                                                fontWeight: selected ? 700 : 500,
                                                fontSize: '0.85rem', cursor: 'pointer',
                                                fontFamily: typography.body, textAlign: 'left',
                                                outline: selected ? `2px solid ${sanctuary.gold}40` : 'none',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {selected ? '● ' : '○ '}{opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleBack}
                        style={{
                            padding: '14px 20px', borderRadius: '14px',
                            background: 'none', border: `1.5px solid ${sanctuary.border}`,
                            color: sanctuary.textSecondary, fontWeight: 700,
                            fontSize: '0.9rem', cursor: 'pointer', fontFamily: typography.body,
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!allCurrentAnswered}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '14px',
                            background: allCurrentAnswered
                                ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                : sanctuary.bgAlt,
                            color: allCurrentAnswered ? '#1A1A1A' : sanctuary.textMuted,
                            border: 'none', fontWeight: 700, fontSize: '0.95rem',
                            cursor: allCurrentAnswered ? 'pointer' : 'default',
                            fontFamily: typography.body,
                            boxShadow: allCurrentAnswered ? '0 4px 16px rgba(212, 175, 55, 0.3)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {currentDomain === totalDomains - 1 ? (
                            <>See My Reflection <Sparkles size={16} /></>
                        ) : (
                            <>Next <ArrowRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
