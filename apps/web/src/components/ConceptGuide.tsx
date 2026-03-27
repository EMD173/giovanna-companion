/**
 * Concept Guide — Ambassador Learning Overlay
 * © 2026 Eli Davis. All Rights Reserved.
 *
 * Floating component that explains heavy EC theoretical terms
 * in plain language. Only visible in ambassador mode.
 * Helps ambassadors learn the framework while navigating the app.
 */

import { useState } from 'react';
import { sanctuary, typography } from '../shared/theme';
import { EC_CONCEPT_GUIDE, searchConcepts, type ConceptEntry } from '../data/ambassadorCodes';

interface ConceptGuideProps {
    ambassadorName: string | null;
}

export default function ConceptGuide({ ambassadorName }: ConceptGuideProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    const results = search.trim() ? searchConcepts(search) : EC_CONCEPT_GUIDE;

    return (
        <>
            {/* ──── Floating Toggle Button ──── */}
            <button
                id="concept-guide-toggle"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: `2px solid ${sanctuary.gold}`,
                    background: `linear-gradient(135deg, ${sanctuary.gold} 0%, ${sanctuary.goldLight} 100%)`,
                    color: '#1A1A1A',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    boxShadow: `0 4px 20px rgba(212, 175, 55, 0.4)`,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}
                title="App Guide"
            >
                {isOpen ? '✕' : '📖'}
            </button>

            {/* ──── Ambassador Badge ──── */}
            {!isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '48px',
                    right: '12px',
                    background: sanctuary.goldBg,
                    border: `1px solid ${sanctuary.goldBorder}`,
                    borderRadius: '100px',
                    padding: '4px 12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: sanctuary.gold,
                    fontFamily: typography.body,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    zIndex: 9998,
                    whiteSpace: 'nowrap',
                }}>
                    🌟 Ambassador
                </div>
            )}

            {/* ──── Concept Guide Panel ──── */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '380px',
                    maxWidth: 'calc(100vw - 40px)',
                    maxHeight: '70vh',
                    background: sanctuary.bgCard,
                    border: `1px solid ${sanctuary.border}`,
                    borderRadius: '20px',
                    boxShadow: '0 12px 40px rgba(45, 42, 38, 0.15)',
                    zIndex: 9998,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px 20px 16px',
                        borderBottom: `1px solid ${sanctuary.borderLight}`,
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                        }}>
                            <h3 style={{
                                fontFamily: typography.heading,
                                color: sanctuary.text,
                                fontSize: '1.1rem',
                                margin: 0,
                            }}>
                                App Guide
                            </h3>
                            <span style={{
                                background: sanctuary.goldBg,
                                border: `1px solid ${sanctuary.goldBorder}`,
                                borderRadius: '100px',
                                padding: '3px 10px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: sanctuary.gold,
                                fontFamily: typography.body,
                            }}>
                                {results.length} terms
                            </span>
                        </div>
                        {ambassadorName && (
                            <p style={{
                                fontFamily: typography.body,
                                color: sanctuary.textMuted,
                                fontSize: '0.8rem',
                                margin: '4px 0 12px',
                            }}>
                                Welcome, {ambassadorName}
                            </p>
                        )}
                        {/* Search */}
                        <input
                            id="concept-guide-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search concepts..."
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: `1.5px solid ${sanctuary.border}`,
                                background: sanctuary.bg,
                                color: sanctuary.text,
                                fontFamily: typography.body,
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                                transition: 'border 0.2s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.border = `1.5px solid ${sanctuary.gold}`;
                            }}
                            onBlur={(e) => {
                                e.target.style.border = `1.5px solid ${sanctuary.border}`;
                            }}
                        />
                    </div>

                    {/* Concept List */}
                    <div style={{
                        overflowY: 'auto',
                        padding: '8px 12px 16px',
                        flex: 1,
                    }}>
                        {results.map((concept: ConceptEntry) => {
                            const isExpanded = expanded === concept.term;
                            return (
                                <button
                                    key={concept.term}
                                    onClick={() => setExpanded(isExpanded ? null : concept.term)}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '14px 16px',
                                        marginBottom: '4px',
                                        borderRadius: '12px',
                                        border: isExpanded
                                            ? `1px solid ${sanctuary.goldBorder}`
                                            : '1px solid transparent',
                                        background: isExpanded ? sanctuary.goldBg : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {/* Term + Module */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: isExpanded ? '8px' : 0,
                                    }}>
                                        <span style={{
                                            fontFamily: typography.heading,
                                            color: sanctuary.text,
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                        }}>
                                            {concept.term}
                                        </span>
                                        {concept.module && (
                                            <span style={{
                                                fontSize: '0.65rem',
                                                color: sanctuary.textMuted,
                                                fontFamily: typography.body,
                                                background: sanctuary.bgAlt,
                                                borderRadius: '100px',
                                                padding: '2px 8px',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {concept.module}
                                            </span>
                                        )}
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div style={{ marginTop: '4px' }}>
                                            <p style={{
                                                fontFamily: typography.body,
                                                color: sanctuary.text,
                                                fontSize: '0.88rem',
                                                lineHeight: 1.6,
                                                marginBottom: '10px',
                                            }}>
                                                {concept.simple}
                                            </p>
                                            <div style={{
                                                background: sanctuary.bgAlt,
                                                borderRadius: '8px',
                                                padding: '10px 12px',
                                                borderLeft: `3px solid ${sanctuary.gold}`,
                                            }}>
                                                <p style={{
                                                    fontFamily: typography.body,
                                                    color: sanctuary.textSecondary,
                                                    fontSize: '0.82rem',
                                                    lineHeight: 1.6,
                                                    margin: 0,
                                                    fontStyle: 'italic',
                                                }}>
                                                    {concept.deeper}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {results.length === 0 && (
                            <p style={{
                                fontFamily: typography.body,
                                color: sanctuary.textMuted,
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                padding: '24px',
                            }}>
                                No concepts match "{search}"
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '12px 20px',
                        borderTop: `1px solid ${sanctuary.borderLight}`,
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: typography.body,
                            color: sanctuary.textMuted,
                            fontSize: '0.7rem',
                            margin: 0,
                        }}>
                            © 2026 Eli Davis — Giovanna Companion
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
