/**
 * BehaviorCharts — Data Visualization for ABC Logs
 *
 * Transforms raw behavior logging data into visual insights:
 * 1. Frequency Over Time — line chart showing log count per day (last 30 days)
 * 2. Function Distribution — pie chart of behavior function hypotheses
 * 3. Time-of-Day Pattern — bar chart of when behaviors occur
 * 4. Intensity Trend — area chart showing average intensity over time
 *
 * Uses Recharts (already available in the project).
 * Follows sanctuary theme — no Tailwind.
 *
 * File: src/components/BehaviorCharts.tsx
 */

import { useMemo, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
    AreaChart, Area,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { type ABCEntry, type TimeOfDay } from '../hooks/useABCLogs';
import { sanctuary, typography, cardStyle } from '../shared/theme';
import { Timestamp } from 'firebase/firestore';

// ============================================
// TYPES
// ============================================

interface BehaviorChartsProps {
    logs: ABCEntry[];
    childName?: string;
}

interface DailyCount {
    date: string;
    count: number;
    avgIntensity: number;
}

interface FunctionCount {
    name: string;
    value: number;
    color: string;
}

interface TimeOfDayCount {
    timeOfDay: string;
    label: string;
    count: number;
    color: string;
}

// ============================================
// COLOR PALETTE (from sanctuary theme)
// ============================================

const FUNCTION_COLORS: Record<string, string> = {
    escape: sanctuary.purple,
    attention: sanctuary.gold,
    tangible: sanctuary.sage,
    sensory: sanctuary.rose,
    unknown: sanctuary.textMuted,
};

const FUNCTION_LABELS: Record<string, string> = {
    escape: 'Escape / Avoidance',
    attention: 'Attention',
    tangible: 'Tangible / Access',
    sensory: 'Sensory',
    unknown: 'Not Yet Identified',
};

const TIME_COLORS: Record<string, string> = {
    morning: '#E8C97A',     // Gold light
    afternoon: '#D4AF37',   // Gold
    evening: '#6B4C9A',     // Purple
    night: '#2D2A26',       // Dark
};

const TIME_LABELS: Record<string, string> = {
    morning: 'Morning (5am–12pm)',
    afternoon: 'Afternoon (12–5pm)',
    evening: 'Evening (5–9pm)',
    night: 'Night (9pm–5am)',
};

// ============================================
// DATA PROCESSING
// ============================================

function toDate(ts: Timestamp | Date | any): Date {
    if (ts instanceof Timestamp) return ts.toDate();
    if (ts instanceof Date) return ts;
    if (ts?.toDate) return ts.toDate();
    if (ts?.seconds) return new Date(ts.seconds * 1000);
    return new Date(ts);
}

function processFrequencyData(logs: ABCEntry[], days: number = 30): DailyCount[] {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // Initialize all days with 0
    const dateMap = new Map<string, { count: number; intensities: number[] }>();
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        dateMap.set(key, { count: 0, intensities: [] });
    }

    // Fill in actual log data
    for (const log of logs) {
        const date = toDate(log.timestamp);
        if (date < startDate) continue;
        const key = date.toISOString().split('T')[0];
        const entry = dateMap.get(key);
        if (entry) {
            entry.count++;
            if (log.intensity) entry.intensities.push(log.intensity);
        }
    }

    return Array.from(dateMap.entries()).map(([date, data]) => ({
        date: formatDateLabel(date),
        count: data.count,
        avgIntensity: data.intensities.length > 0
            ? Math.round((data.intensities.reduce((a, b) => a + b, 0) / data.intensities.length) * 10) / 10
            : 0,
    }));
}

function processFunctionData(logs: ABCEntry[]): FunctionCount[] {
    const counts: Record<string, number> = {};

    for (const log of logs) {
        const fn = log.functionHypothesis || 'unknown';
        counts[fn] = (counts[fn] || 0) + 1;
    }

    return Object.entries(counts)
        .map(([name, value]) => ({
            name: FUNCTION_LABELS[name] || name,
            value,
            color: FUNCTION_COLORS[name] || sanctuary.textMuted,
        }))
        .sort((a, b) => b.value - a.value);
}

function processTimeOfDayData(logs: ABCEntry[]): TimeOfDayCount[] {
    const order: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
    const counts: Record<string, number> = {
        morning: 0, afternoon: 0, evening: 0, night: 0,
    };

    for (const log of logs) {
        const tod = log.timeOfDay || getTimeOfDayFromTimestamp(log.timestamp);
        if (tod) counts[tod] = (counts[tod] || 0) + 1;
    }

    return order.map(tod => ({
        timeOfDay: tod,
        label: TIME_LABELS[tod],
        count: counts[tod],
        color: TIME_COLORS[tod],
    }));
}

function getTimeOfDayFromTimestamp(ts: Timestamp | Date | any): TimeOfDay {
    const date = toDate(ts);
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

function formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// CUSTOM TOOLTIP
// ============================================

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{
            background: sanctuary.bgCard,
            border: `1px solid ${sanctuary.border}`,
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: sanctuary.shadowMd,
        }}>
            <p style={{
                fontFamily: typography.body,
                fontSize: '0.78rem',
                fontWeight: 700,
                color: sanctuary.text,
                marginBottom: '4px',
            }}>{label}</p>
            {payload.map((entry: any, i: number) => (
                <p key={i} style={{
                    fontFamily: typography.body,
                    fontSize: '0.75rem',
                    color: entry.color || sanctuary.textSecondary,
                    margin: '2px 0',
                }}>
                    {entry.name}: <strong>{entry.value}</strong>
                </p>
            ))}
        </div>
    );
}

// ============================================
// CHART SECTION WRAPPER
// ============================================

function ChartSection({
    title,
    icon,
    insight,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    insight?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            ...cardStyle(),
            marginBottom: '20px',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: sanctuary.goldBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sanctuary.gold,
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{
                        fontFamily: typography.heading,
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        margin: 0,
                    }}>{title}</h3>
                    {insight && (
                        <p style={{
                            fontFamily: typography.body,
                            fontSize: '0.78rem',
                            color: sanctuary.textMuted,
                            margin: '2px 0 0',
                        }}>{insight}</p>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

// ============================================
// INSIGHT GENERATOR
// ============================================

function generateInsights(logs: ABCEntry[]): {
    frequency: string;
    function: string;
    timeOfDay: string;
    intensity: string;
} {
    if (logs.length === 0) {
        return {
            frequency: 'Start logging to see patterns emerge.',
            function: 'Function hypotheses appear after your first logs.',
            timeOfDay: 'Time patterns need data to reveal themselves.',
            intensity: 'Intensity trends show over time.',
        };
    }

    // Frequency insight
    const last7 = logs.filter(l => {
        const d = toDate(l.timestamp);
        return d > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;
    const prev7 = logs.filter(l => {
        const d = toDate(l.timestamp);
        return d > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) &&
               d <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;

    let freqInsight: string;
    if (prev7 === 0 && last7 > 0) {
        freqInsight = `${last7} moments captured this week. Keep logging — patterns emerge around 10 entries.`;
    } else if (last7 > prev7) {
        freqInsight = `${last7} moments this week (up from ${prev7} last week). More data means better Insight analysis.`;
    } else if (last7 < prev7) {
        freqInsight = `${last7} moments this week (down from ${prev7}). Fewer logs can mean things are calmer — that's worth celebrating.`;
    } else {
        freqInsight = `${last7} moments this week, same as last. Consistency helps Insight see deeper patterns.`;
    }

    // Function insight
    const functionCounts = processFunctionData(logs);
    const topFunction = functionCounts[0];
    const funcInsight = topFunction && topFunction.name !== 'Not Yet Identified'
        ? `"${topFunction.name}" is the most common function (${topFunction.value} times). This is valuable IEP evidence.`
        : 'Add function hypotheses to your logs to unlock the most powerful pattern detection.';

    // Time insight
    const timeCounts = processTimeOfDayData(logs);
    const peakTime = timeCounts.reduce((a, b) => a.count > b.count ? a : b);
    const timeInsight = peakTime.count > 0
        ? `${peakTime.label.split(' (')[0]} is the most active time (${peakTime.count} moments). Insight can suggest preparation strategies for this window.`
        : 'Time-of-day patterns will emerge as you log more.';

    // Intensity insight
    const recentIntensities = logs.slice(0, 10).filter(l => l.intensity).map(l => l.intensity);
    const avgRecent = recentIntensities.length > 0
        ? (recentIntensities.reduce((a, b) => a + b, 0) / recentIntensities.length)
        : 0;
    const intensityInsight = avgRecent > 0
        ? `Recent average intensity: ${avgRecent.toFixed(1)}/10. ${avgRecent > 6 ? 'High intensity periods are common early in the journey. You are not failing.' : 'Moderate intensity suggests growing regulation. The work is working.'}`
        : 'Intensity data appears after a few logs.';

    return {
        frequency: freqInsight,
        function: funcInsight,
        timeOfDay: timeInsight,
        intensity: intensityInsight,
    };
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BehaviorCharts({ logs, childName }: BehaviorChartsProps) {
    const [expanded, setExpanded] = useState(true);

    const frequencyData = useMemo(() => processFrequencyData(logs, 30), [logs]);
    const functionData = useMemo(() => processFunctionData(logs), [logs]);
    const timeData = useMemo(() => processTimeOfDayData(logs), [logs]);
    const insights = useMemo(() => generateInsights(logs), [logs]);

    const hasData = logs.length > 0;

    return (
        <section
            aria-label={`Behavior patterns${childName ? ` for ${childName}` : ''}`}
            style={{ marginBottom: '32px' }}
        >
            {/* Section Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: sanctuary.bgCard,
                    border: `1px solid ${sanctuary.border}`,
                    borderRadius: expanded ? '16px 16px 0 0' : '16px',
                    cursor: 'pointer',
                    transition: 'border-radius 0.2s ease',
                }}
                aria-expanded={expanded}
                aria-controls="behavior-charts-content"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Activity size={20} color={sanctuary.gold} />
                    <div style={{ textAlign: 'left' }}>
                        <h2 style={{
                            fontFamily: typography.heading,
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: sanctuary.text,
                            margin: 0,
                        }}>
                            Patterns & Insights
                        </h2>
                        <p style={{
                            fontFamily: typography.body,
                            fontSize: '0.78rem',
                            color: sanctuary.textMuted,
                            margin: '2px 0 0',
                        }}>
                            {hasData
                                ? `${logs.length} moment${logs.length !== 1 ? 's' : ''} captured — your data is telling a story`
                                : 'Start logging to reveal your child\'s patterns'
                            }
                        </p>
                    </div>
                </div>
                {expanded ? <ChevronUp size={18} color={sanctuary.textMuted} /> : <ChevronDown size={18} color={sanctuary.textMuted} />}
            </button>

            {/* Charts Content */}
            {expanded && (
                <div
                    id="behavior-charts-content"
                    role="region"
                    aria-label="Behavior pattern charts"
                    style={{
                        padding: '20px',
                        background: sanctuary.bg,
                        border: `1px solid ${sanctuary.border}`,
                        borderTop: 'none',
                        borderRadius: '0 0 16px 16px',
                    }}
                >
                    {!hasData ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                marginBottom: '12px',
                            }}>📊</div>
                            <h3 style={{
                                fontFamily: typography.heading,
                                fontSize: '1.1rem',
                                color: sanctuary.text,
                                marginBottom: '8px',
                            }}>Your story starts with the first log</h3>
                            <p style={{
                                fontFamily: typography.body,
                                fontSize: '0.88rem',
                                color: sanctuary.textMuted,
                                lineHeight: 1.6,
                                maxWidth: '400px',
                                margin: '0 auto',
                            }}>
                                After a few Capture entries, these charts will reveal patterns
                                in your child's behavior — timing, function, intensity, and trends.
                                Insight uses this same data to give you deeper guidance.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* 1. Frequency Over Time */}
                            <ChartSection
                                title="Frequency Over Time"
                                icon={<TrendingUp size={18} />}
                                insight={insights.frequency}
                            >
                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <AreaChart data={frequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={sanctuary.gold} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={sanctuary.gold} stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={sanctuary.borderLight} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                tickLine={false}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                tickLine={false}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="count"
                                                name="Moments"
                                                stroke={sanctuary.gold}
                                                strokeWidth={2}
                                                fill="url(#goldGradient)"
                                                dot={false}
                                                activeDot={{ r: 5, fill: sanctuary.gold, stroke: sanctuary.bgCard, strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartSection>

                            {/* 2. Function Distribution + Time of Day (side by side on desktop) */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '20px',
                            }}>
                                {/* Function Distribution Pie */}
                                <ChartSection
                                    title="Behavior Functions"
                                    icon={<PieIcon size={18} />}
                                    insight={insights.function}
                                >
                                    <div style={{ width: '100%', height: 280, overflow: 'visible' }}>
                                        <ResponsiveContainer>
                                            <PieChart margin={{ top: 10, right: 60, bottom: 10, left: 60 }}>
                                                <Pie
                                                    data={functionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={35}
                                                    outerRadius={55}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                    label={({ name, percent }: { name?: string; percent?: number }) =>
                                                        `${(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`
                                                    }
                                                    labelLine={true}
                                                >
                                                    {functionData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Legend */}
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        justifyContent: 'center',
                                        marginTop: '8px',
                                    }}>
                                        {functionData.map((entry, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.72rem',
                                                fontFamily: typography.body,
                                                color: sanctuary.textSecondary,
                                            }}>
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    background: entry.color,
                                                }} />
                                                {entry.name}
                                            </div>
                                        ))}
                                    </div>
                                </ChartSection>

                                {/* Time of Day Bar Chart */}
                                <ChartSection
                                    title="Time of Day"
                                    icon={<Clock size={18} />}
                                    insight={insights.timeOfDay}
                                >
                                    <div style={{ width: '100%', height: 220 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={timeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={sanctuary.borderLight} />
                                                <XAxis
                                                    dataKey="timeOfDay"
                                                    tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                    tickLine={false}
                                                    tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                                                />
                                                <YAxis
                                                    allowDecimals={false}
                                                    tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                    tickLine={false}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="count"
                                                    name="Moments"
                                                    radius={[6, 6, 0, 0]}
                                                >
                                                    {timeData.map((entry, i) => (
                                                        <Cell key={i} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </ChartSection>
                            </div>

                            {/* 3. Intensity Trend */}
                            <ChartSection
                                title="Intensity Trend"
                                icon={<Activity size={18} />}
                                insight={insights.intensity}
                            >
                                <div style={{ width: '100%', height: 200 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={frequencyData.filter(d => d.avgIntensity > 0)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={sanctuary.rose} stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor={sanctuary.rose} stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={sanctuary.borderLight} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                tickLine={false}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                domain={[0, 10]}
                                                tick={{ fontSize: 10, fill: sanctuary.textMuted, fontFamily: typography.body }}
                                                tickLine={false}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="avgIntensity"
                                                name="Avg Intensity"
                                                stroke={sanctuary.rose}
                                                strokeWidth={2}
                                                dot={{ r: 3, fill: sanctuary.rose, stroke: sanctuary.bgCard, strokeWidth: 2 }}
                                                activeDot={{ r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartSection>
                        </>
                    )}
                </div>
            )}
        </section>
    );
}
