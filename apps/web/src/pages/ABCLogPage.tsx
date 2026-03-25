import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X, Printer, Zap, BarChart3, List } from 'lucide-react';
import { ABCLogForm } from '../components/ABCLogForm';
import { ABCLogList } from '../components/ABCLogList';
import { QuickLogMode } from '../components/QuickLogMode';
import { BehaviorPatterns } from '../components/BehaviorPatterns';
import { BehaviorTrends } from '../components/BehaviorTrends';
import { PostLogInsight } from '../components/PostLogInsight';
import { CapturePreview } from '../components/CapturePreview';
import { useABCLogs, type FunctionHypothesis } from '../hooks/useABCLogs';
import { sanctuary, typography } from '../shared/theme';

type ViewMode = 'history' | 'patterns' | 'form' | 'quick';

export function ABCLogPage() {
    const [view, setView] = useState<ViewMode>('history');
    const [lastSavedFunction, setLastSavedFunction] = useState<FunctionHypothesis | null>(null);
    const { logs } = useABCLogs();

    const handleLogSaved = (fn: FunctionHypothesis | null) => {
        setLastSavedFunction(fn);
    };

    return (
        <div style={{
            background: sanctuary.bg,
            minHeight: '100vh',
            paddingBottom: '128px',
        }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div className="sanctuary-enter" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '20px',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '2rem',
                            color: sanctuary.text,
                            letterSpacing: '-0.02em',
                            marginBottom: '4px',
                        }}>
                            Capture Moment
                        </h1>
                        <p style={{
                            color: sanctuary.textMuted,
                            fontSize: '0.95rem',
                            fontFamily: typography.body,
                        }}>
                            Track patterns to find the "why."
                        </p>
                    </div>
                    <Link
                        to="/report"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: sanctuary.bgCard,
                            border: `1px solid ${sanctuary.border}`,
                            color: sanctuary.textSecondary,
                            padding: '10px 18px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            boxShadow: sanctuary.shadow,
                        }}
                    >
                        <Printer size={16} />
                        <span>Report</span>
                    </Link>
                </div>

                {/* Tab Switcher — History / Patterns */}
                {(view === 'history' || view === 'patterns') && (
                    <div className="sanctuary-enter sanctuary-enter-1" style={{
                        display: 'flex',
                        background: sanctuary.bgCard,
                        border: `1px solid ${sanctuary.border}`,
                        borderRadius: '100px',
                        padding: '4px',
                        gap: '4px',
                        marginBottom: '20px',
                    }}>
                        <button onClick={() => setView('history')} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px',
                            padding: '10px', borderRadius: '100px', border: 'none',
                            background: view === 'history' ? sanctuary.text : 'transparent',
                            color: view === 'history' ? '#fff' : sanctuary.textMuted,
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                            fontFamily: typography.body,
                        }}>
                            <List size={16} /> History
                        </button>
                        <button onClick={() => setView('patterns')} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px',
                            padding: '10px', borderRadius: '100px', border: 'none',
                            background: view === 'patterns' ? sanctuary.purple : 'transparent',
                            color: view === 'patterns' ? '#fff' : sanctuary.textMuted,
                            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                            fontFamily: typography.body,
                        }}>
                            <BarChart3 size={16} /> Patterns
                        </button>
                    </div>
                )}

                {/* Content */}
                {view === 'form' && (
                    <div className="sanctuary-enter sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: sanctuary.shadowMd,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.gold}40, transparent)`,
                        }} />
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '20px',
                        }}>
                            <h2 style={{
                                fontFamily: typography.heading, fontWeight: 700,
                                fontSize: '1.2rem', color: sanctuary.text,
                            }}>New Log Entry</h2>
                            <button onClick={() => setView('history')} style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: sanctuary.bgAlt, border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.textMuted, cursor: 'pointer',
                            }}>
                                <X size={18} />
                            </button>
                        </div>
                        <ABCLogForm onClose={() => setView('history')} onSave={handleLogSaved} />
                    </div>
                )}

                {view === 'quick' && (
                    <div className="sanctuary-enter sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.border}`,
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: sanctuary.shadowMd,
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.rose}40, transparent)`,
                        }} />
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '16px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: sanctuary.rose,
                                }}>
                                    <Zap size={18} />
                                </div>
                                <h2 style={{
                                    fontFamily: typography.heading, fontWeight: 700,
                                    fontSize: '1.2rem', color: sanctuary.text,
                                }}>Quick Capture</h2>
                            </div>
                            <button onClick={() => setView('history')} style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: sanctuary.bgAlt, border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.textMuted, cursor: 'pointer',
                            }}>
                                <X size={18} />
                            </button>
                        </div>
                        <QuickLogMode
                            onClose={() => setView('history')}
                            onComplete={() => setView('history')}
                        />
                    </div>
                )}

                {view === 'history' && (
                    <>
                        {lastSavedFunction && (
                            <PostLogInsight
                                behaviorFunction={lastSavedFunction}
                                visible={!!lastSavedFunction}
                                onDismiss={() => setLastSavedFunction(null)}
                            />
                        )}
                        {logs.length === 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <CapturePreview onStartLogging={() => setView('form')} />
                            </div>
                        )}
                        <ABCLogList />
                    </>
                )}
                {view === 'patterns' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <BehaviorTrends logs={logs} />
                        <BehaviorPatterns logs={logs} />
                    </div>
                )}

                {/* Floating Action Buttons */}
                {(view === 'history' || view === 'patterns') && (
                    <div style={{
                        position: 'fixed', bottom: '100px', right: '24px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                        zIndex: 40,
                    }}>
                        {/* Quick Log (Emergency) */}
                        <button
                            onClick={() => setView('quick')}
                            style={{
                                width: '52px', height: '52px', borderRadius: '16px',
                                background: '#1A1A1A',
                                color: sanctuary.rose,
                                border: `2px solid ${sanctuary.rose}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 16px rgba(184, 84, 80, 0.3)',
                            }}
                            aria-label="Quick Log"
                        >
                            <Zap size={22} />
                        </button>

                        {/* Full Log */}
                        <button
                            onClick={() => setView('form')}
                            style={{
                                width: '60px', height: '60px', borderRadius: '18px',
                                background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                color: '#1A1A1A',
                                border: 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
                            }}
                            aria-label="Full Log Entry"
                        >
                            <Plus size={28} strokeWidth={2.5} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
