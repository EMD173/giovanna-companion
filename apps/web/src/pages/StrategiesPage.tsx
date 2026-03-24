import { useState } from 'react';
import { useStrategies, type Strategy } from '../hooks/useStrategies';
import { Plus, CheckCircle, Trash2, Layers } from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';

export function StrategiesPage() {
    const { strategies, loading, addStrategy, updateStatus, deleteStrategy } = useStrategies();
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [procedure, setProcedure] = useState('');
    const [category, setCategory] = useState<Strategy['category']>('Behavior');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addStrategy({ title, procedure, category });
        setIsAdding(false);
        setTitle('');
        setProcedure('');
    };

    const catColors: Record<string, { bg: string; text: string; border: string }> = {
        Sensory: { bg: sanctuary.sageBg, text: sanctuary.sage, border: sanctuary.sageBorder },
        Behavior: { bg: sanctuary.roseBg, text: sanctuary.rose, border: sanctuary.roseBorder },
        Communication: { bg: sanctuary.goldBg, text: sanctuary.gold, border: sanctuary.goldBorder },
        Routine: { bg: sanctuary.purpleBg, text: sanctuary.purple, border: sanctuary.purpleBorder },
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <div className="sanctuary-enter" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '28px',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading,
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: sanctuary.text,
                            letterSpacing: '-0.02em',
                            marginBottom: '4px',
                        }}>My Strategy Deck</h1>
                        <p style={{
                            color: sanctuary.textMuted,
                            fontSize: '0.95rem',
                            fontFamily: typography.body,
                        }}>What works for your child.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="sanctuary-pill"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(107, 76, 154, 0.25)',
                            fontFamily: typography.body,
                        }}
                    >
                        <Plus size={18} /> New Card
                    </button>
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="sanctuary-enter sanctuary-card" style={{
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px solid ${sanctuary.purpleBorder}`,
                        padding: '24px',
                        marginBottom: '24px',
                        boxShadow: sanctuary.shadowMd,
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.purple}40, transparent)`,
                        }} />
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>Strategy Name</label>
                                <input
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., Deep Pressure Squeeze"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>How do you do it?</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={procedure}
                                    onChange={e => setProcedure(e.target.value)}
                                    placeholder="Step 1... Step 2..."
                                    style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '80px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as Strategy['category'])}
                                    style={inputStyle}
                                >
                                    <option value="Behavior">Behavior</option>
                                    <option value="Sensory">Sensory</option>
                                    <option value="Communication">Communication</option>
                                    <option value="Routine">Routine</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{
                                    flex: 1, padding: '12px',
                                    borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                                    color: '#fff', border: 'none', fontWeight: 700,
                                    fontSize: '0.92rem', cursor: 'pointer',
                                    fontFamily: typography.body,
                                }}>Save Card</button>
                                <button type="button" onClick={() => setIsAdding(false)} style={{
                                    padding: '12px 20px', borderRadius: '12px',
                                    background: 'none', color: sanctuary.textMuted,
                                    border: `1px solid ${sanctuary.border}`,
                                    fontWeight: 600, cursor: 'pointer',
                                    fontFamily: typography.body,
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div style={{
                        textAlign: 'center', padding: '48px',
                        color: sanctuary.textMuted, fontFamily: typography.body,
                    }}>Loading deck...</div>
                ) : strategies.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '48px 32px',
                        background: sanctuary.bgCard,
                        borderRadius: '20px',
                        border: `1px dashed ${sanctuary.border}`,
                    }}>
                        <Layers size={48} style={{ color: sanctuary.borderLight, margin: '0 auto 12px' }} />
                        <p style={{ color: sanctuary.textMuted, fontFamily: typography.body, marginBottom: '4px' }}>
                            Your deck is empty.
                        </p>
                        <p style={{ color: sanctuary.textMuted, fontSize: '0.88rem', fontFamily: typography.body }}>
                            Add strategies that help your child so you don't forget.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {strategies.map((card, idx) => {
                            const cc = catColors[card.category] || catColors.Behavior;
                            return (
                                <div key={card.id} className={`sanctuary-card sanctuary-enter sanctuary-enter-${Math.min(idx, 5)}`} style={{
                                    background: sanctuary.bgCard,
                                    borderRadius: '20px',
                                    border: `1px solid ${sanctuary.border}`,
                                    padding: '20px',
                                    boxShadow: sanctuary.shadow,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px',
                                        background: `linear-gradient(90deg, transparent, ${cc.text}30, transparent)`,
                                    }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '3px 10px', borderRadius: '100px',
                                            background: cc.bg, color: cc.text, border: `1px solid ${cc.border}`,
                                            fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                                            letterSpacing: '0.06em', fontFamily: typography.body,
                                        }}>{card.category}</span>
                                        {card.status === 'successful' && (
                                            <span style={{ color: sanctuary.sage, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                <CheckCircle size={14} /> Works!
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{
                                        fontFamily: typography.heading,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        color: sanctuary.text,
                                        marginBottom: '6px',
                                    }}>{card.title}</h3>
                                    <p style={{
                                        color: sanctuary.textMuted,
                                        fontSize: '0.85rem',
                                        fontFamily: typography.body,
                                        lineHeight: 1.6,
                                        marginBottom: '16px',
                                    }}>{card.procedure}</p>
                                    <div style={{
                                        display: 'flex', gap: '8px',
                                        borderTop: `1px solid ${sanctuary.border}`,
                                        paddingTop: '12px',
                                    }}>
                                        <button
                                            onClick={() => updateStatus(card.id, 'successful')}
                                            style={{
                                                flex: 1, padding: '8px', borderRadius: '8px',
                                                background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                                color: sanctuary.sage, fontWeight: 700, fontSize: '0.78rem',
                                                cursor: 'pointer', fontFamily: typography.body,
                                            }}
                                        >It Worked</button>
                                        <button
                                            onClick={() => deleteStrategy(card.id)}
                                            style={{
                                                padding: '8px 12px', borderRadius: '8px',
                                                background: 'none', border: `1px solid ${sanctuary.border}`,
                                                color: sanctuary.textMuted, cursor: 'pointer',
                                            }}
                                        ><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: sanctuary.textSecondary,
    marginBottom: '6px',
    fontFamily: typography.body,
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${sanctuary.border}`,
    background: sanctuary.bg,
    color: sanctuary.text,
    fontSize: '0.92rem',
    fontFamily: typography.body,
    outline: 'none',
    boxSizing: 'border-box',
};
