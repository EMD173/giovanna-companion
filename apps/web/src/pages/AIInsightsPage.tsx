/**
 * AI Pattern Insights — "The Crystal Ball"
 *
 * Phase 4C: Advanced analytics across ABC logs.
 * Pattern recognition, predictive insights, strategy effectiveness,
 * and trend correlation.
 */

import { useMemo } from 'react';
import {
    TrendingUp, TrendingDown, AlertTriangle, Lightbulb,
    BarChart2, Clock, Target, Sparkles, ChevronRight, Minus
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useABCLogs } from '../hooks/useABCLogs';
import { useFamily } from '../contexts/FamilyContext';
import { Link } from 'react-router-dom';

export function AIInsightsPage() {
    const { logs } = useABCLogs();
    const { activeChild } = useFamily();
    const childName = activeChild?.preferredName || activeChild?.firstName || 'Your child';

    const insights = useMemo(() => {
        if (logs.length < 3) return null;

        // Trigger frequency analysis
        const triggerCounts: Record<string, number> = {};
        const behaviorCounts: Record<string, number> = {};
        const contextCounts: Record<string, number> = {};
        const consequenceCounts: Record<string, number> = {};
        const intensities: number[] = [];
        const dailyCounts: Record<string, number> = {};

        logs.forEach((log: any) => {
            if (log.antecedent) triggerCounts[log.antecedent] = (triggerCounts[log.antecedent] || 0) + 1;
            if (log.behavior) behaviorCounts[log.behavior] = (behaviorCounts[log.behavior] || 0) + 1;
            if (log.context) contextCounts[log.context] = (contextCounts[log.context] || 0) + 1;
            if (log.consequence) consequenceCounts[log.consequence] = (consequenceCounts[log.consequence] || 0) + 1;
            if (log.intensity) intensities.push(log.intensity);
            const day = log.date || new Date().toISOString().split('T')[0];
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });

        const sortedTriggers = Object.entries(triggerCounts).sort(([,a], [,b]) => b - a);
        const sortedBehaviors = Object.entries(behaviorCounts).sort(([,a], [,b]) => b - a);
        const sortedContexts = Object.entries(contextCounts).sort(([,a], [,b]) => b - a);
        const sortedConsequences = Object.entries(consequenceCounts).sort(([,a], [,b]) => b - a);

        const avgIntensity = intensities.length > 0
            ? intensities.reduce((s, n) => s + n, 0) / intensities.length
            : 0;

        // Trend analysis — compare recent 7 vs previous 7
        const recent = logs.slice(0, 7);
        const previous = logs.slice(7, 14);
        const recentAvg = recent.length > 0
            ? recent.reduce((s: number, l: any) => s + (l.intensity || 0), 0) / recent.length
            : 0;
        const prevAvg = previous.length > 0
            ? previous.reduce((s: number, l: any) => s + (l.intensity || 0), 0) / previous.length
            : recentAvg;

        const trend = recentAvg < prevAvg ? 'improving' : recentAvg > prevAvg ? 'increasing' : 'stable';

        // Strategy effectiveness — which consequences correlate with lower future intensity?
        const effectiveStrategies: Array<{ strategy: string; avgIntensity: number; count: number }> = [];
        sortedConsequences.slice(0, 5).forEach(([consequence, count]) => {
            const relatedLogs = logs.filter((l: any) => l.consequence === consequence);
            const avg = relatedLogs.reduce((s: number, l: any) => s + (l.intensity || 0), 0) / relatedLogs.length;
            effectiveStrategies.push({ strategy: consequence, avgIntensity: avg, count });
        });
        effectiveStrategies.sort((a, b) => a.avgIntensity - b.avgIntensity);

        // Peak times
        const hourCounts: Record<string, number> = {};
        logs.forEach((l: any) => {
            const time = l.time || 'Unknown';
            hourCounts[time] = (hourCounts[time] || 0) + 1;
        });
        const peakTimes = Object.entries(hourCounts).sort(([,a], [,b]) => b - a).slice(0, 3);

        return {
            totalLogs: logs.length,
            avgIntensity,
            trend,
            recentAvg,
            prevAvg,
            topTrigger: sortedTriggers[0],
            topBehavior: sortedBehaviors[0],
            topContext: sortedContexts[0],
            triggers: sortedTriggers.slice(0, 5),
            behaviors: sortedBehaviors.slice(0, 5),
            contexts: sortedContexts.slice(0, 4),
            effectiveStrategies,
            peakTimes,
        };
    }, [logs]);

    if (!insights) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
                <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={22} color="#E8C97A" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text,
                        }}>AI Insights</h1>
                    </div>
                    <div style={{
                        textAlign: 'center', padding: '48px 24px',
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        <Sparkles size={48} style={{ color: sanctuary.purpleBorder, margin: '0 auto 16px' }} />
                        <h3 style={{ fontFamily: typography.heading, fontWeight: 700, color: sanctuary.text, marginBottom: '8px' }}>
                            Not enough data yet
                        </h3>
                        <p style={{ color: sanctuary.textMuted, fontSize: '0.9rem', fontFamily: typography.body, marginBottom: '20px' }}>
                            Log at least 3 ABC entries to unlock pattern insights.
                        </p>
                        <Link to="/log" style={{
                            padding: '12px 24px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            color: '#fff', border: 'none', fontWeight: 700,
                            fontSize: '0.92rem', fontFamily: typography.body,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                        }}>Start Logging <ChevronRight size={16} /></Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={22} color="#E8C97A" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text,
                        }}>AI Insights</h1>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.92rem',
                        fontFamily: typography.body, marginLeft: '56px',
                    }}>Patterns from {childName}'s {insights.totalLogs} logged entries.</p>
                </div>

                {/* Trend Card */}
                <div style={{
                    background: sanctuary.bgCard, borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`, padding: '20px',
                    marginBottom: '16px', boxShadow: sanctuary.shadowMd,
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: insights.trend === 'improving'
                            ? `linear-gradient(90deg, transparent, ${sanctuary.sage}, transparent)`
                            : insights.trend === 'increasing'
                            ? `linear-gradient(90deg, transparent, ${sanctuary.rose}, transparent)`
                            : `linear-gradient(90deg, transparent, ${sanctuary.gold}, transparent)`,
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                                letterSpacing: '0.1em', color: sanctuary.textMuted, fontFamily: typography.body,
                            }}>7-DAY TREND</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                                <span style={{
                                    fontSize: '2.2rem', fontWeight: 800,
                                    color: insights.trend === 'improving' ? sanctuary.sage : insights.trend === 'increasing' ? sanctuary.rose : sanctuary.gold,
                                    fontFamily: typography.heading,
                                }}>{insights.recentAvg.toFixed(1)}</span>
                                <span style={{
                                    fontSize: '0.85rem', color: sanctuary.textMuted, fontFamily: typography.body,
                                }}>avg intensity</span>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', borderRadius: '100px',
                            background: insights.trend === 'improving' ? sanctuary.sageBg
                                : insights.trend === 'increasing' ? sanctuary.roseBg : sanctuary.goldBg,
                            border: `1px solid ${insights.trend === 'improving' ? sanctuary.sageBorder : insights.trend === 'increasing' ? sanctuary.roseBorder : sanctuary.goldBorder}`,
                            color: insights.trend === 'improving' ? sanctuary.sage : insights.trend === 'increasing' ? sanctuary.rose : sanctuary.gold,
                            fontWeight: 700, fontSize: '0.82rem', fontFamily: typography.body,
                        }}>
                            {insights.trend === 'improving' ? <TrendingDown size={16} /> : insights.trend === 'increasing' ? <TrendingUp size={16} /> : <Minus size={16} />}
                            {insights.trend === 'improving' ? 'Improving' : insights.trend === 'increasing' ? 'Increasing' : 'Stable'}
                        </div>
                    </div>
                </div>

                {/* Key Insights */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px',
                }}>
                    <InsightCard icon={<AlertTriangle size={16} />} label="Top Trigger" value={insights.topTrigger?.[0] || '—'} count={insights.topTrigger?.[1]} color={sanctuary.rose} />
                    <InsightCard icon={<Target size={16} />} label="Top Behavior" value={insights.topBehavior?.[0] || '—'} count={insights.topBehavior?.[1]} color={sanctuary.purple} />
                    <InsightCard icon={<BarChart2 size={16} />} label="Avg Intensity" value={`${insights.avgIntensity.toFixed(1)}/10`} color={sanctuary.gold} />
                    <InsightCard icon={<Clock size={16} />} label="Peak Time" value={insights.peakTimes[0]?.[0] || '—'} count={insights.peakTimes[0]?.[1]} color={sanctuary.sage} />
                </div>

                {/* Strategy Effectiveness */}
                {insights.effectiveStrategies.length > 0 && (
                    <div style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`, padding: '20px',
                        marginBottom: '16px', boxShadow: sanctuary.shadow,
                    }}>
                        <h3 style={{
                            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase',
                            letterSpacing: '0.1em', color: sanctuary.textMuted, marginBottom: '14px',
                            fontFamily: typography.body,
                        }}>Strategy Effectiveness</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {insights.effectiveStrategies.map((s, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '10px 14px', borderRadius: '10px',
                                    background: i === 0 ? sanctuary.sageBg : sanctuary.bgAlt,
                                    border: `1px solid ${i === 0 ? sanctuary.sageBorder : sanctuary.border}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {i === 0 && <Lightbulb size={14} color={sanctuary.sage} />}
                                        <span style={{
                                            fontSize: '0.85rem', fontWeight: i === 0 ? 700 : 500,
                                            color: i === 0 ? sanctuary.sage : sanctuary.text,
                                            fontFamily: typography.body,
                                        }}>{s.strategy}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '0.82rem', fontWeight: 700,
                                            color: s.avgIntensity <= 4 ? sanctuary.sage : s.avgIntensity >= 7 ? sanctuary.rose : sanctuary.gold,
                                            fontFamily: typography.body,
                                        }}>{s.avgIntensity.toFixed(1)}</span>
                                        <span style={{
                                            fontSize: '0.68rem', color: sanctuary.textMuted, marginLeft: '4px',
                                            fontFamily: typography.body,
                                        }}>avg ({s.count}x)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI-Generated Insight */}
                <div style={{
                    background: sanctuary.purpleBg, borderRadius: '20px',
                    border: `1px solid ${sanctuary.purpleBorder}`,
                    padding: '20px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Sparkles size={16} color={sanctuary.purple} />
                        <h3 style={{
                            fontFamily: typography.heading, fontWeight: 700, fontSize: '1rem',
                            color: sanctuary.text,
                        }}>What the Data Tells Us</h3>
                    </div>
                    <p style={{
                        fontSize: '0.88rem', color: sanctuary.textSecondary,
                        fontFamily: typography.body, lineHeight: 1.7,
                    }}>
                        Based on {insights.totalLogs} logged observations, {childName}'s primary trigger is <strong>{insights.topTrigger?.[0] || 'not yet identified'}</strong>,
                        most commonly occurring {insights.topContext?.[0] ? `during ${insights.topContext[0]}` : 'across various contexts'}.
                        {insights.effectiveStrategies.length > 0 && ` The most effective response appears to be "${insights.effectiveStrategies[0].strategy}" (avg intensity ${insights.effectiveStrategies[0].avgIntensity.toFixed(1)}/10).`}
                        {insights.trend === 'improving' && ' The good news: intensity trends are improving over the past week.'}
                        {insights.trend === 'increasing' && ' The intensity trend has increased recently — consider whether environmental changes or schedule disruptions may be contributing.'}
                    </p>
                </div>
            </div>
        </div>
    );
}

function InsightCard({ icon, label, value, count, color }: {
    icon: React.ReactNode; label: string; value: string; count?: number; color: string;
}) {
    return (
        <div style={{
            background: sanctuary.bgCard, borderRadius: '14px',
            border: `1px solid ${sanctuary.border}`, padding: '14px',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: sanctuary.textMuted, fontSize: '0.68rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
                fontFamily: typography.body,
            }}>
                {icon} {label}
            </div>
            <span style={{
                display: 'block', fontWeight: 700, fontSize: '0.92rem',
                color, fontFamily: typography.body,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{value}</span>
            {count !== undefined && (
                <span style={{
                    fontSize: '0.72rem', color: sanctuary.textMuted, fontFamily: typography.body,
                }}>{count}x</span>
            )}
        </div>
    );
}
