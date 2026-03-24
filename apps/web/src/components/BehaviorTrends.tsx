/**
 * BehaviorTrends — Data Visualization for ABC Logs
 *
 * Two charts for the "Patterns" tab on ABCLogPage:
 * 1. Frequency Timeline — bar chart (logs/day, last 14 days)
 * 2. Function Distribution — donut chart (Escape/Attention/Tangible/Sensory)
 *
 * Pure SVG — NO chart library dependencies.
 * Data sourced from useABCLogs().
 */

import { useMemo } from 'react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import type { ABCEntry, FunctionHypothesis } from '../hooks/useABCLogs';
import { sanctuary, typography } from '../shared/theme';

const FUNCTION_COLORS: Record<FunctionHypothesis, string> = {
    escape: sanctuary.rose,
    attention: sanctuary.purple,
    tangible: sanctuary.gold,
    sensory: sanctuary.sage,
};

const FUNCTION_LABELS: Record<FunctionHypothesis, string> = {
    escape: 'Escape',
    attention: 'Attention',
    tangible: 'Tangible',
    sensory: 'Sensory',
};

// ============================================
// FREQUENCY TIMELINE (Bar Chart)
// ============================================

function FrequencyTimeline({ logs }: { logs: ABCEntry[] }) {
    const dailyCounts = useMemo(() => {
        const days: { label: string; count: number; date: string }[] = [];
        const now = new Date();

        for (let i = 13; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

            const count = logs.filter(log => {
                const ts = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(0);
                return ts.toISOString().split('T')[0] === dateStr;
            }).length;

            days.push({ label: dayLabel, count, date: dateStr });
        }
        return days;
    }, [logs]);

    const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);
    const chartHeight = 120;
    const barWidth = 16;
    const gap = 4;
    const chartWidth = dailyCounts.length * (barWidth + gap);

    return (
        <div style={{
            background: sanctuary.bgCard,
            borderRadius: '16px',
            border: `1px solid ${sanctuary.border}`,
            padding: '20px',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px',
            }}>
                <TrendingUp size={16} color={sanctuary.gold} />
                <h3 style={{
                    fontFamily: typography.body, fontSize: '0.85rem',
                    fontWeight: 700, color: sanctuary.text,
                }}>
                    Frequency — Last 14 Days
                </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <svg
                    width={chartWidth + 20}
                    height={chartHeight + 30}
                    viewBox={`0 0 ${chartWidth + 20} ${chartHeight + 30}`}
                    style={{ display: 'block' }}
                >
                    {dailyCounts.map((day, i) => {
                        const barHeight = maxCount > 0 ? (day.count / maxCount) * chartHeight : 0;
                        const x = i * (barWidth + gap) + 10;
                        const y = chartHeight - barHeight;

                        return (
                            <g key={day.date}>
                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={Math.max(barHeight, 2)}
                                    rx={4}
                                    fill={day.count > 0 ? sanctuary.gold : sanctuary.border}
                                    opacity={day.count > 0 ? 1 : 0.4}
                                />
                                {/* Count label */}
                                {day.count > 0 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 4}
                                        textAnchor="middle"
                                        fill={sanctuary.textMuted}
                                        fontSize="9"
                                        fontWeight="700"
                                        fontFamily={typography.body}
                                    >
                                        {day.count}
                                    </text>
                                )}
                                {/* Day label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 16}
                                    textAnchor="middle"
                                    fill={sanctuary.textMuted}
                                    fontSize="9"
                                    fontWeight="600"
                                    fontFamily={typography.body}
                                >
                                    {day.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Total summary */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginTop: '12px', paddingTop: '12px',
                borderTop: `1px solid ${sanctuary.border}`,
            }}>
                <span style={{
                    fontFamily: typography.body, fontSize: '0.78rem',
                    color: sanctuary.textMuted, fontWeight: 500,
                }}>
                    Total: <strong style={{ color: sanctuary.text }}>{logs.length}</strong> moments captured
                </span>
            </div>
        </div>
    );
}

// ============================================
// FUNCTION DISTRIBUTION (Donut Chart)
// ============================================

function FunctionDistribution({ logs }: { logs: ABCEntry[] }) {
    const distribution = useMemo(() => {
        const counts: Record<FunctionHypothesis, number> = {
            escape: 0, attention: 0, tangible: 0, sensory: 0,
        };
        let total = 0;

        for (const log of logs) {
            if (log.functionHypothesis && log.functionHypothesis in counts) {
                counts[log.functionHypothesis as FunctionHypothesis]++;
                total++;
            }
        }

        return { counts, total };
    }, [logs]);

    // Don't render if fewer than 3 logs have function hypothesis
    if (distribution.total < 3) {
        return (
            <div style={{
                background: sanctuary.bgCard,
                borderRadius: '16px',
                border: `1px dashed ${sanctuary.border}`,
                padding: '32px 20px',
                textAlign: 'center',
            }}>
                <PieChartIcon size={28} color={sanctuary.borderLight} style={{ marginBottom: '8px' }} />
                <p style={{
                    fontFamily: typography.body, fontSize: '0.82rem',
                    color: sanctuary.textMuted, fontWeight: 500,
                }}>
                    Log {3 - distribution.total} more moments with a function hypothesis to see patterns here.
                </p>
            </div>
        );
    }

    // Donut chart math
    const size = 140;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const segments: { key: FunctionHypothesis; percentage: number; offset: number }[] = [];
    let cumulativeOffset = 0;

    const functions: FunctionHypothesis[] = ['escape', 'attention', 'tangible', 'sensory'];
    for (const fn of functions) {
        const percentage = distribution.counts[fn] / distribution.total;
        if (percentage > 0) {
            segments.push({
                key: fn,
                percentage,
                offset: cumulativeOffset,
            });
            cumulativeOffset += percentage;
        }
    }

    return (
        <div style={{
            background: sanctuary.bgCard,
            borderRadius: '16px',
            border: `1px solid ${sanctuary.border}`,
            padding: '20px',
            boxShadow: sanctuary.shadow,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '16px',
            }}>
                <PieChartIcon size={16} color={sanctuary.purple} />
                <h3 style={{
                    fontFamily: typography.body, fontSize: '0.85rem',
                    fontWeight: 700, color: sanctuary.text,
                }}>
                    Function Distribution
                </h3>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {/* Donut */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background circle */}
                    <circle
                        cx={center} cy={center} r={radius}
                        fill="none"
                        stroke={sanctuary.border}
                        strokeWidth={strokeWidth}
                    />
                    {/* Segments */}
                    {segments.map(seg => (
                        <circle
                            key={seg.key}
                            cx={center} cy={center} r={radius}
                            fill="none"
                            stroke={FUNCTION_COLORS[seg.key]}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${seg.percentage * circumference} ${circumference}`}
                            strokeDashoffset={-seg.offset * circumference}
                            strokeLinecap="round"
                            transform={`rotate(-90 ${center} ${center})`}
                            style={{ transition: 'all 0.6s ease' }}
                        />
                    ))}
                    {/* Center text */}
                    <text
                        x={center} y={center - 6}
                        textAnchor="middle"
                        fill={sanctuary.text}
                        fontSize="20"
                        fontWeight="800"
                        fontFamily={typography.heading}
                    >
                        {distribution.total}
                    </text>
                    <text
                        x={center} y={center + 12}
                        textAnchor="middle"
                        fill={sanctuary.textMuted}
                        fontSize="9"
                        fontWeight="600"
                        fontFamily={typography.body}
                    >
                        TAGGED
                    </text>
                </svg>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {segments.map(seg => (
                        <div key={seg.key} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <div style={{
                                width: '12px', height: '12px', borderRadius: '3px',
                                background: FUNCTION_COLORS[seg.key],
                            }} />
                            <span style={{
                                fontFamily: typography.body, fontSize: '0.82rem',
                                color: sanctuary.text, fontWeight: 600,
                            }}>
                                {FUNCTION_LABELS[seg.key]}
                            </span>
                            <span style={{
                                fontFamily: typography.body, fontSize: '0.78rem',
                                color: sanctuary.textMuted, fontWeight: 500,
                            }}>
                                {Math.round(seg.percentage * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN EXPORT
// ============================================

export function BehaviorTrends({ logs }: { logs: ABCEntry[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FrequencyTimeline logs={logs} />
            <FunctionDistribution logs={logs} />
        </div>
    );
}
