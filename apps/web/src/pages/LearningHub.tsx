import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, ChevronDown, ChevronUp, Share2, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { initialContent, type ContentItem } from '../data/learningContent';
import { GiovannaChat } from '../components/GiovannaChat';
import { useECMode } from '../contexts/ECModeContext';
import { LensPanel } from '../components/ec/LensPanel';
import { ECModeIndicator } from '../components/ec/LensPanel';
import { sanctuary, typography } from '../shared/theme';

export function LearningHub() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { enabled: ecModeEnabled } = useECMode();

    const fuse = useMemo(() => new Fuse(initialContent, {
        keys: ['title', 'summary', 'definition', 'category'],
        threshold: 0.3,
    }), []);

    const filteredContent = useMemo(() => {
        if (!searchTerm) return initialContent;
        return fuse.search(searchTerm).map(result => result.item);
    }, [searchTerm, fuse]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <header className="sanctuary-enter" style={{ marginBottom: '24px' }}>
                    <h1 style={{
                        fontFamily: typography.heading,
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: sanctuary.text,
                        letterSpacing: '-0.02em',
                        marginBottom: '6px',
                    }}>Learning Hub</h1>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '1rem',
                        fontFamily: typography.body,
                    }}>
                        Trusted, neuro-affirming resources for you and your school team.
                    </p>
                </header>

                {/* Search */}
                <div className="sanctuary-enter sanctuary-enter-1" style={{
                    position: 'relative',
                    marginBottom: '20px',
                }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: sanctuary.textMuted,
                    }} />
                    <input
                        type="text"
                        placeholder="Search topics (e.g., 'stimming', 'meltdown')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '14px 16px 14px 44px',
                            borderRadius: '14px',
                            border: `1.5px solid ${sanctuary.border}`,
                            background: sanctuary.bgCard,
                            color: sanctuary.text,
                            fontSize: '0.92rem',
                            fontFamily: typography.body,
                            outline: 'none',
                            boxShadow: sanctuary.shadow,
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* AI Helper Card */}
                <div className="sanctuary-enter sanctuary-enter-2 sanctuary-card" style={{
                    background: sanctuary.purpleBg,
                    border: `1px solid ${sanctuary.purpleBorder}`,
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, color: '#E8C97A',
                    }}><Sparkles size={18} /></div>
                    <div>
                        <h3 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: sanctuary.text,
                            marginBottom: '4px',
                        }}>Ask The Oracle</h3>
                        <p style={{
                            color: sanctuary.textSecondary,
                            fontSize: '0.85rem',
                            fontFamily: typography.body,
                            lineHeight: 1.6,
                            marginBottom: '10px',
                        }}>
                            Need help explaining this to a teacher? Try: <em>"How do I explain that my child needs sensory breaks, not punishment?"</em>
                        </p>
                        <button
                            onClick={() => setIsChatOpen(true)}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: sanctuary.purple,
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                fontFamily: typography.body,
                                padding: 0,
                            }}
                        >Start Chat →</button>
                    </div>
                </div>

                {/* EC Mode */}
                {ecModeEnabled && (
                    <div className="sanctuary-enter sanctuary-enter-2" style={{ marginBottom: '20px' }}>
                        <ECModeIndicator />
                        <LensPanel context="learning" compact />
                    </div>
                )}

                {/* Content Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredContent.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 24px',
                            color: sanctuary.textMuted,
                            fontFamily: typography.body,
                        }}>
                            No topics found for "{searchTerm}".
                        </div>
                    )}

                    {filteredContent.map((item, idx) => (
                        <TopicCard
                            key={item.id}
                            item={item}
                            isExpanded={expandedId === item.id}
                            onToggle={() => toggleExpand(item.id)}
                            delay={Math.min(idx, 5)}
                        />
                    ))}
                </div>

                <GiovannaChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </div>
        </div>
    );
}

function TopicCard({ item, isExpanded, onToggle, delay }: {
    item: ContentItem; isExpanded: boolean; onToggle: () => void; delay: number;
}) {
    const catColor = item.category === 'Regulation' ? { bg: sanctuary.sageBg, text: sanctuary.sage, border: sanctuary.sageBorder }
        : item.category === 'Behavior' ? { bg: sanctuary.roseBg, text: sanctuary.rose, border: sanctuary.roseBorder }
        : { bg: sanctuary.goldBg, text: sanctuary.gold, border: sanctuary.goldBorder };

    return (
        <div className={`sanctuary-card sanctuary-enter sanctuary-enter-${delay}`} style={{
            background: sanctuary.bgCard,
            borderRadius: '16px',
            border: `1px solid ${isExpanded ? catColor.border : sanctuary.border}`,
            overflow: 'hidden',
            boxShadow: isExpanded ? sanctuary.shadowMd : sanctuary.shadow,
        }}>
            {/* Header */}
            <button onClick={onToggle} style={{
                width: '100%',
                textAlign: 'left',
                padding: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
            }}>
                <div>
                    <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '100px',
                        background: catColor.bg,
                        color: catColor.text,
                        border: `1px solid ${catColor.border}`,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '8px',
                        fontFamily: typography.body,
                    }}>{item.category}</span>
                    <h3 style={{
                        fontFamily: typography.heading,
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: sanctuary.text,
                        marginBottom: '4px',
                    }}>{item.title}</h3>
                    <p style={{
                        color: sanctuary.textMuted,
                        fontSize: '0.88rem',
                        fontFamily: typography.body,
                        lineHeight: 1.5,
                    }}>{item.summary}</p>
                </div>
                <div style={{ color: sanctuary.textMuted, marginTop: '4px', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{
                    padding: '0 20px 20px',
                    borderTop: `1px solid ${sanctuary.border}`,
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    {/* Definition */}
                    <div>
                        <h4 style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontFamily: typography.body,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            color: sanctuary.textMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '8px',
                        }}>
                            <BookOpen size={14} /> What is it?
                        </h4>
                        <p style={{ color: sanctuary.textSecondary, fontSize: '0.9rem', lineHeight: 1.7, fontFamily: typography.body }}>
                            {item.definition}
                        </p>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.88rem', marginTop: '8px',
                            fontStyle: 'italic', borderLeft: `3px solid ${sanctuary.gold}40`,
                            paddingLeft: '12px', fontFamily: typography.body,
                        }}>"{item.whyItHappens}"</p>
                    </div>

                    {/* Tips Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{
                            background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                            borderRadius: '12px', padding: '16px',
                        }}>
                            <h4 style={{ fontWeight: 700, color: sanctuary.sage, fontSize: '0.85rem', marginBottom: '8px' }}>
                                ✅ What to Try
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {item.whatToTry.map((tip, i) => (
                                    <li key={i} style={{ color: sanctuary.textSecondary, fontSize: '0.82rem', fontFamily: typography.body, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sanctuary.sage, marginTop: '6px', flexShrink: 0 }} />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                            borderRadius: '12px', padding: '16px',
                        }}>
                            <h4 style={{ fontWeight: 700, color: sanctuary.rose, fontSize: '0.85rem', marginBottom: '8px' }}>
                                🛑 What to Avoid
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {item.whatToAvoid.map((tip, i) => (
                                    <li key={i} style={{ color: sanctuary.textSecondary, fontSize: '0.82rem', fontFamily: typography.body, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sanctuary.rose, marginTop: '6px', flexShrink: 0 }} />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bridge Script */}
                    <div style={{
                        background: sanctuary.bgCard, border: `1px solid ${sanctuary.purpleBorder}`,
                        borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                            background: `linear-gradient(90deg, ${sanctuary.purple}40, ${sanctuary.gold}40)`,
                        }} />
                        <h4 style={{
                            fontWeight: 700, color: sanctuary.purple, fontSize: '0.85rem', marginBottom: '8px',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <Share2 size={14} /> School Bridge Script
                        </h4>
                        <p style={{ color: sanctuary.textMuted, fontSize: '0.82rem', marginBottom: '8px', fontFamily: typography.body }}>
                            Copy this language for your IEP meeting or teacher email:
                        </p>
                        <div style={{
                            background: sanctuary.bgAlt, padding: '12px', borderRadius: '8px',
                            border: `1px solid ${sanctuary.border}`,
                            color: sanctuary.textSecondary, fontWeight: 500, fontSize: '0.85rem',
                            fontStyle: 'italic', fontFamily: typography.body, lineHeight: 1.6,
                        }}>
                            "{item.whatToShare}"
                        </div>
                    </div>

                    {/* Citations */}
                    <div style={{ borderTop: `1px solid ${sanctuary.border}`, paddingTop: '12px' }}>
                        <h5 style={{
                            fontFamily: typography.body, fontWeight: 700, fontSize: '0.7rem',
                            color: sanctuary.textMuted, textTransform: 'uppercase',
                            letterSpacing: '0.08em', marginBottom: '8px',
                        }}>Research & Evidence</h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {item.citations.map((cite, idx) => (
                                <li key={idx} style={{
                                    color: sanctuary.textMuted, fontSize: '0.75rem',
                                    fontFamily: typography.body, display: 'flex', alignItems: 'flex-start', gap: '4px',
                                }}>
                                    • {cite.text}
                                    {cite.link && (
                                        <a href={cite.link} target="_blank" rel="noreferrer" style={{
                                            color: sanctuary.purple, textDecoration: 'none',
                                            display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '4px',
                                        }}>
                                            Link <ExternalLink size={10} />
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
