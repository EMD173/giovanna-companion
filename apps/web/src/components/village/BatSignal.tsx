/**
 * The Bat Signal (Village SOS)
 *
 * Frictionless request system for when parents are depleted.
 * Removes the shame friction of asking for help.
 */

import React, { useState } from 'react';
import { Zap, X, MessageCircle, Coffee, Utensils } from 'lucide-react';
import { sanctuary, typography } from '../../shared/theme';

interface RequestTemplate {
    id: string;
    icon: React.ElementType;
    label: string;
    message: string;
}

const TEMPLATES: RequestTemplate[] = [
    {
        id: 'food',
        icon: Utensils,
        label: 'Send Food',
        message: "SOS. I'm running on empty. If you're near a drive-thru or have leftovers, could you drop something off? No contact needed."
    },
    {
        id: 'break',
        icon: Coffee,
        label: '1 Hour Break',
        message: "I need a tap-out. Could you come over for 1 hour so I can just sit in a dark room or take a walk? Just need to reset."
    },
    {
        id: 'checkin',
        icon: MessageCircle,
        label: 'Voice Check-in',
        message: "Feeling overwhelmed. Can you call me for 5 mins just to distract me? Don't need advice, just a human voice."
    }
];

export function BatSignal() {
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = async (template: RequestTemplate) => {
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Village Request', text: template.message });
                setIsOpen(false);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(template.message);
            alert('Message copied to clipboard!');
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Activate Village Signal"
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#1A1A1A',
                    color: sanctuary.gold,
                    border: `2px solid ${sanctuary.gold}`,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 40,
                }}
            >
                <Zap size={24} fill="currentColor" />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
        }}>
            <div style={{
                background: sanctuary.bgCard,
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    background: '#1A1A1A',
                    padding: '24px',
                    color: '#F5F0E8',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <Zap size={80} style={{
                        position: 'absolute', top: '-10px', right: '-10px',
                        opacity: 0.06, color: sanctuary.gold,
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{
                            fontFamily: typography.heading,
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: sanctuary.gold,
                            marginBottom: '4px',
                        }}>Village Signal</h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.88rem',
                            fontFamily: typography.body,
                        }}>
                            Don't overthink it. Just tap. Your village wants to help.
                        </p>
                    </div>
                    <button onClick={() => setIsOpen(false)} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)', border: 'none',
                        color: '#F5F0E8', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Templates */}
                <div style={{
                    padding: '16px',
                    background: sanctuary.bgAlt,
                    display: 'flex', flexDirection: 'column', gap: '10px',
                }}>
                    {TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleShare(t)}
                            style={{
                                width: '100%',
                                background: sanctuary.bgCard,
                                padding: '16px',
                                borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`,
                                boxShadow: sanctuary.shadow,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '14px',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.purple, flexShrink: 0,
                            }}>
                                <t.icon size={20} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontFamily: typography.body, fontWeight: 700,
                                    color: sanctuary.text, fontSize: '0.95rem',
                                    marginBottom: '4px',
                                }}>{t.label}</h3>
                                <p style={{
                                    color: sanctuary.textMuted, fontSize: '0.78rem',
                                    fontFamily: typography.body, fontStyle: 'italic',
                                    lineHeight: 1.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>"{t.message}"</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '14px',
                    textAlign: 'center',
                    borderTop: `1px solid ${sanctuary.border}`,
                    background: sanctuary.bgAlt,
                }}>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.75rem',
                        fontFamily: typography.body,
                    }}>Your dignity is intact. Everyone needs a hand.</p>
                </div>
            </div>
        </div>
    );
}
