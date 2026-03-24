import { format } from 'date-fns';
import { useABCLogs, type ABCEntry } from '../hooks/useABCLogs';
import { Activity, Calendar, MapPin, User } from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';

const TIME_EMOJI: Record<string, string> = {
    morning: '🌅',
    afternoon: '🌤️',
    evening: '🌙',
    night: '🌑',
};

const FUNCTION_LABELS: Record<string, { label: string; color: string }> = {
    escape: { label: 'Escape', color: sanctuary.rose },
    attention: { label: 'Attention', color: sanctuary.purple },
    tangible: { label: 'Tangible', color: sanctuary.gold },
    sensory: { label: 'Sensory', color: sanctuary.sage },
};

export function ABCLogList() {
    const { logs, loading } = useABCLogs();

    if (loading) {
        return (
            <div style={{
                textAlign: 'center', padding: '32px',
                color: sanctuary.textMuted, fontFamily: typography.body,
            }}>Loading history...</div>
        );
    }

    if (logs.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '48px 24px',
                background: sanctuary.bgCard,
                borderRadius: '16px',
                border: `1px dashed ${sanctuary.border}`,
            }}>
                <Activity size={40} style={{ color: sanctuary.borderLight, margin: '0 auto 12px' }} />
                <p style={{
                    color: sanctuary.textMuted, fontFamily: typography.body,
                    fontWeight: 600, marginBottom: '4px',
                }}>No logs yet.</p>
                <p style={{
                    color: sanctuary.textMuted, fontSize: '0.85rem',
                    fontFamily: typography.body,
                }}>Tap "New Entry" to track a behavior.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log, idx) => (
                <LogCard key={log.id} log={log} delay={Math.min(idx, 5)} />
            ))}
        </div>
    );
}

function LogCard({ log, delay }: { log: ABCEntry; delay: number }) {
    const date = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
    const timeEmoji = log.timeOfDay ? TIME_EMOJI[log.timeOfDay] : null;
    const fnInfo = log.functionHypothesis ? FUNCTION_LABELS[log.functionHypothesis] : null;

    return (
        <div className={`sanctuary-card sanctuary-enter sanctuary-enter-${delay}`} style={{
            background: sanctuary.bgCard,
            borderRadius: '16px',
            border: `1px solid ${sanctuary.border}`,
            padding: '16px',
            boxShadow: sanctuary.shadow,
        }}>
            {/* Header Row */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    {/* Timestamp + Time of Day */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        color: sanctuary.textMuted, fontSize: '0.78rem',
                        fontFamily: typography.body,
                    }}>
                        {timeEmoji && <span style={{ fontSize: '0.85rem' }}>{timeEmoji}</span>}
                        <Calendar size={12} />
                        <span style={{ fontWeight: 700, color: sanctuary.textSecondary }}>
                            {format(date, 'MMM d, h:mm a')}
                        </span>
                    </div>

                    {/* Child Name Badge */}
                    {log.childName && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            padding: '2px 8px',
                            borderRadius: '100px',
                            background: sanctuary.sageBg,
                            border: `1px solid ${sanctuary.sageBorder}`,
                            color: sanctuary.sage,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            fontFamily: typography.body,
                        }}>
                            <User size={9} />
                            {log.childName}
                        </span>
                    )}
                </div>

                {/* Intensity Meter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{
                                width: '5px', height: '16px', borderRadius: '2px',
                                background: (i + 1) * 2 <= log.intensity
                                    ? (log.intensity > 7 ? sanctuary.rose : sanctuary.sage)
                                    : sanctuary.border,
                            }} />
                        ))}
                    </div>
                    <span style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        color: sanctuary.textMuted, marginLeft: '4px',
                        fontFamily: typography.body,
                    }}>{log.intensity}/10</span>
                </div>
            </div>

            {/* ABC Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: (log.context && log.context.length > 0) || fnInfo ? '12px' : '0',
            }}>
                <div style={{
                    background: sanctuary.bgAlt, padding: '10px',
                    borderRadius: '10px', border: `1px solid ${sanctuary.border}`,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.6rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: sanctuary.textMuted, marginBottom: '4px',
                        fontFamily: typography.body,
                    }}>Antecedent</span>
                    <p style={{
                        fontSize: '0.8rem', color: sanctuary.text,
                        fontFamily: typography.body, lineHeight: 1.4,
                    }}>{log.antecedent}</p>
                </div>
                <div style={{
                    background: sanctuary.roseBg, padding: '10px',
                    borderRadius: '10px', border: `1px solid ${sanctuary.roseBorder}`,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.6rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: sanctuary.rose, marginBottom: '4px',
                        fontFamily: typography.body,
                    }}>Behavior</span>
                    <p style={{
                        fontSize: '0.8rem', color: sanctuary.text, fontWeight: 600,
                        fontFamily: typography.body, lineHeight: 1.4,
                    }}>{log.behavior}</p>
                </div>
                <div style={{
                    background: sanctuary.purpleBg, padding: '10px',
                    borderRadius: '10px', border: `1px solid ${sanctuary.purpleBorder}`,
                }}>
                    <span style={{
                        display: 'block', fontSize: '0.6rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                        color: sanctuary.purple, marginBottom: '4px',
                        fontFamily: typography.body,
                    }}>Consequence</span>
                    <p style={{
                        fontSize: '0.8rem', color: sanctuary.text,
                        fontFamily: typography.body, lineHeight: 1.4,
                    }}>{log.consequence}</p>
                </div>
            </div>

            {/* Footer: Context Tags + Function Hypothesis */}
            {((log.context && log.context.length > 0) || fnInfo) && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {log.context && log.context.map((ctx, i) => (
                        <span key={i} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: sanctuary.bgAlt,
                            border: `1px solid ${sanctuary.border}`,
                            color: sanctuary.textMuted,
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            fontFamily: typography.body,
                        }}>
                            <MapPin size={8} /> {ctx}
                        </span>
                    ))}

                    {fnInfo && (
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '100px',
                            background: sanctuary.goldBg,
                            border: `1px solid ${sanctuary.goldBorder}`,
                            color: fnInfo.color,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            fontFamily: typography.body,
                        }}>
                            ƒ {fnInfo.label}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
