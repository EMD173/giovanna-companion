/**
 * Behavior Patterns — Weekly Trend Visualization
 *
 * Transforms raw ABC log data into actionable visual insights:
 * - Daily frequency bar chart (last 7 days)
 * - Top triggers breakdown
 * - Intensity trend line
 * - Context distribution
 */

import { useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus, Flame, MapPin, AlertTriangle } from 'lucide-react';
import { type ABCEntry } from '../hooks/useABCLogs';
import { sanctuary, typography } from '../shared/theme';

interface BehaviorPatternsProps {
    logs: ABCEntry[];
}

export function BehaviorPatterns({ logs }: BehaviorPatternsProps) {
    const analytics = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Filter to last 7 days
        const recentLogs = logs.filter(l => {
            const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date();
            return d >= weekAgo;
        });

        // Previous week for comparison
        const prevWeekLogs = logs.filter(l => {
            const d = l.timestamp?.toDate ? l.timestamp.toDate() : new Date();
            return d >= twoWeeksAgo && d < weekAgo;
        });

        // Daily counts (last 7 days)
        const dailyCounts: { label: string; count: number; date: Date }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            const count = recentLogs.filter(l => {
                const logDate = l.timestamp?.toDate ? l.timestamp.toDate() : new Date();
                return logDate.toDateString() === d.toDateString();
            }).length;
            dailyCounts.push({ label: dayStr, count, date: d });
        }

        // Max for scaling
        const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);

        // Top triggers (antecedents)
        const triggerMap: Record<string, number> = {};
        recentLogs.forEach(l => {
            const key = l.antecedent.slice(0, 40);
            triggerMap[key] = (triggerMap[key] || 0) + 1;
        });
        const topTriggers = Object.entries(triggerMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        // Average intensity
        const avgIntensity = recentLogs.length > 0
            ? recentLogs.reduce((sum, l) => sum + l.intensity, 0) / recentLogs.length
            : 0;
        const prevAvgIntensity = prevWeekLogs.length > 0
            ? prevWeekLogs.reduce((sum, l) => sum + l.intensity, 0) / prevWeekLogs.length
            : 0;

        // Context distribution
        const contextMap: Record<string, number> = {};
        recentLogs.forEach(l => {
            (l.context || []).forEach(ctx => {
                contextMap[ctx] = (contextMap[ctx] || 0) + 1;
            });
        });
        const topContexts = Object.entries(contextMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4);

        // Trend direction
        const trend = recentLogs.length < prevWeekLogs.length ? 'down'
            : recentLogs.length > prevWeekLogs.length ? 'up' : 'stable';

        return {
            recentCount: recentLogs.length,
            prevCount: prevWeekLogs.length,
            dailyCounts, maxCount,
            topTriggers, topContexts,
            avgIntensity, prevAvgIntensity,
            trend,
        };
    }, [logs]);

    if (logs.length === 0) return null;

    const TrendIcon = analytics.trend === 'down' ? TrendingDown
        : analytics.trend === 'up' ? TrendingUp : Minus;
    const trendColor = analytics.trend === 'down' ? sanctuary.sage
        : analytics.trend === 'up' ? sanctuary.rose : sanctuary.textMuted;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Summary Row */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
            }}>
                {/* Weekly Total */}
                <div className="sanctuary-card" style={{
                    background: sanctuary.bgCard, borderRadius: '16px',
                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.65rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: sanctuary.textMuted, marginBottom: '8px',
                        fontFamily: typography.body,
                    }}>This Week</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{
                            fontSize: '1.8rem', fontWeight: 800,
                            color: sanctuary.text, fontFamily: typography.heading,
                        }}>{analytics.recentCount}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <TrendIcon size={14} color={trendColor} />
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 700,
                                color: trendColor, fontFamily: typography.body,
                            }}>
                                {analytics.trend === 'down' ? '↓' : analytics.trend === 'up' ? '↑' : '—'} vs {analytics.prevCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Avg Intensity */}
                <div className="sanctuary-card" style={{
                    background: sanctuary.bgCard, borderRadius: '16px',
                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.65rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: sanctuary.textMuted, marginBottom: '8px',
                        fontFamily: typography.body,
                    }}>Avg Intensity</span>
                    <span style={{
                        fontSize: '1.8rem', fontWeight: 800,
                        color: analytics.avgIntensity > 7 ? sanctuary.rose : sanctuary.gold,
                        fontFamily: typography.heading,
                    }}>
                        {analytics.avgIntensity.toFixed(1)}
                    </span>
                </div>

                {/* Top Trigger */}
                <div className="sanctuary-card" style={{
                    background: sanctuary.bgCard, borderRadius: '16px',
                    border: `1px solid ${sanctuary.border}`, padding: '16px',
                    boxShadow: sanctuary.shadow,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.65rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: sanctuary.textMuted, marginBottom: '8px',
                        fontFamily: typography.body,
                    }}>Top Trigger</span>
                    <span style={{
                        fontSize: '0.85rem', fontWeight: 700,
                        color: sanctuary.text, fontFamily: typography.body,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                        {analytics.topTriggers[0]?.[0] || '—'}
                    </span>
                </div>
            </div>

            {/* Daily Bar Chart */}
            <div className="sanctuary-card" style={{
                background: sanctuary.bgCard, borderRadius: '20px',
                border: `1px solid ${sanctuary.border}`, padding: '20px',
                boxShadow: sanctuary.shadow,
            }}>
                <h3 style={{
                    fontSize: '0.75rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: sanctuary.textMuted, marginBottom: '16px',
                    fontFamily: typography.body, display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                    <Flame size={14} /> 7-Day Frequency
                </h3>
                <div style={{
                    display: 'flex', alignItems: 'flex-end',
                    gap: '8px', height: '100px',
                }}>
                    {analytics.dailyCounts.map((day, i) => {
                        const height = day.count > 0 ? Math.max((day.count / analytics.maxCount) * 80, 12) : 4;
                        const isToday = i === 6;
                        return (
                            <div key={i} style={{
                                flex: 1, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', gap: '6px',
                            }}>
                                {day.count > 0 && (
                                    <span style={{
                                        fontSize: '0.68rem', fontWeight: 800,
                                        color: sanctuary.textMuted, fontFamily: typography.body,
                                    }}>{day.count}</span>
                                )}
                                <div style={{
                                    width: '100%', maxWidth: '36px',
                                    height: `${height}px`,
                                    borderRadius: '6px',
                                    background: isToday
                                        ? `linear-gradient(180deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                        : day.count > 0
                                            ? sanctuary.purpleBg
                                            : sanctuary.border,
                                    border: isToday
                                        ? `1px solid ${sanctuary.goldBorder}`
                                        : day.count > 0
                                            ? `1px solid ${sanctuary.purpleBorder}`
                                            : 'none',
                                    transition: 'height 0.4s ease',
                                }} />
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: isToday ? 800 : 600,
                                    color: isToday ? sanctuary.gold : sanctuary.textMuted,
                                    fontFamily: typography.body,
                                }}>{day.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Triggers + Contexts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Top Triggers */}
                {analytics.topTriggers.length > 0 && (
                    <div className="sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '16px',
                        border: `1px solid ${sanctuary.border}`, padding: '16px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h4 style={{
                            fontSize: '0.68rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: sanctuary.textMuted, marginBottom: '12px',
                            fontFamily: typography.body, display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <AlertTriangle size={12} /> Top Triggers
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {analytics.topTriggers.map(([trigger, count], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.82rem', color: sanctuary.text,
                                        fontFamily: typography.body, fontWeight: 600,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        maxWidth: '120px',
                                    }}>{trigger}</span>
                                    <span style={{
                                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                        color: sanctuary.gold, padding: '2px 8px', borderRadius: '6px',
                                        fontSize: '0.72rem', fontWeight: 800, fontFamily: typography.body,
                                    }}>{count}×</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Context Distribution */}
                {analytics.topContexts.length > 0 && (
                    <div className="sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '16px',
                        border: `1px solid ${sanctuary.border}`, padding: '16px',
                        boxShadow: sanctuary.shadow,
                    }}>
                        <h4 style={{
                            fontSize: '0.68rem', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: sanctuary.textMuted, marginBottom: '12px',
                            fontFamily: typography.body, display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <MapPin size={12} /> Where It Happens
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {analytics.topContexts.map(([ctx, count], i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: '0.82rem', color: sanctuary.text,
                                        fontFamily: typography.body, fontWeight: 600,
                                    }}>{ctx}</span>
                                    <span style={{
                                        background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                        color: sanctuary.purple, padding: '2px 8px', borderRadius: '6px',
                                        fontSize: '0.72rem', fontWeight: 800, fontFamily: typography.body,
                                    }}>{count}×</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
