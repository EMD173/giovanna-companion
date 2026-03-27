/**
 * Accessibility FAB — Floating Action Button
 *
 * Non-intrusive floating button with:
 *   🔊 Read Page Aloud — TTS via Web Speech API
 *   🌐 Language Toggle — EN / ES
 *
 * Positioned bottom-right, above the mobile bottom nav.
 * Matches the sanctuary aesthetic. Available on all authenticated pages.
 */

import { useState } from 'react';
import { Volume2, VolumeX, Globe, X } from 'lucide-react';
import { useI18n, SUPPORTED_LOCALES, LOCALE_LABELS, type Locale } from '../lib/i18n';
import { useReadAloud } from '../hooks/useReadAloud';
import { sanctuary, typography } from '../shared/theme';

export function AccessibilityFab({ showTooltip = false }: { showTooltip?: boolean }) {
    const { locale, setLocale, t } = useI18n();
    const { isSupported: ttsSupported, isReading, speakPage, stop } = useReadAloud();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const togglePanel = () => setIsOpen(!isOpen);

    const handleReadAloud = () => {
        if (isReading) {
            stop();
        } else {
            speakPage();
        }
    };

    const handleLanguageChange = (newLocale: Locale) => {
        setLocale(newLocale);
        // If reading, restart with new language
        if (isReading) {
            stop();
        }
    };

    return (
        <>
            {/* Panel */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-label={t('a11y.accessibility')}
                    style={{
                        position: 'fixed',
                        bottom: '210px',
                        right: '20px',
                        width: '260px',
                        background: sanctuary.bgCard,
                        border: `1px solid ${sanctuary.border}`,
                        borderRadius: '20px',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                        zIndex: 10000,
                        overflow: 'hidden',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: `1px solid ${sanctuary.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: sanctuary.text,
                        }}>
                            {t('a11y.accessibility')}
                        </span>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: sanctuary.textMuted,
                                cursor: 'pointer',
                                padding: '4px',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Read Aloud */}
                    {ttsSupported && (
                        <button
                            onClick={handleReadAloud}
                            data-readable
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 20px',
                                background: isReading ? sanctuary.goldBg : 'transparent',
                                border: 'none',
                                borderBottom: `1px solid ${sanctuary.border}`,
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: isReading
                                    ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                    : sanctuary.bgAlt,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                {isReading
                                    ? <VolumeX size={18} color="#1A0A2E" />
                                    : <Volume2 size={18} color={sanctuary.gold} />
                                }
                            </div>
                            <span style={{
                                fontFamily: typography.body,
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: isReading ? sanctuary.gold : sanctuary.text,
                            }}>
                                {isReading ? t('a11y.stopReading') : t('a11y.readPage')}
                            </span>
                        </button>
                    )}

                    {/* Language Selector */}
                    <div style={{ padding: '14px 20px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '10px',
                        }}>
                            <Globe size={16} color={sanctuary.textMuted} />
                            <span style={{
                                fontFamily: typography.body,
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                color: sanctuary.textMuted,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                            }}>
                                {t('a11y.language')}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {SUPPORTED_LOCALES.map((loc) => (
                                <button
                                    key={loc}
                                    onClick={() => handleLanguageChange(loc)}
                                    aria-pressed={locale === loc}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '10px',
                                        border: `2px solid ${locale === loc
                                            ? sanctuary.gold
                                            : sanctuary.border}`,
                                        background: locale === loc
                                            ? sanctuary.goldBg
                                            : 'transparent',
                                        color: locale === loc
                                            ? sanctuary.gold
                                            : sanctuary.text,
                                        fontWeight: 700,
                                        fontSize: '0.88rem',
                                        fontFamily: typography.body,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {LOCALE_LABELS[loc]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Hover tooltip — landing page only */}
            {showTooltip && isHovered && !isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '170px',
                    right: '80px',
                    background: 'rgba(26, 10, 46, 0.92)',
                    border: `1px solid ${sanctuary.border}`,
                    borderRadius: '12px',
                    padding: '8px 14px',
                    zIndex: 998,
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                }}>
                    <span style={{
                        fontFamily: typography.body,
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: sanctuary.text,
                    }}>
                        🌐 English / Español
                    </span>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={togglePanel}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label={t('a11y.accessibility')}
                aria-expanded={isOpen}
                style={{
                    position: 'fixed',
                    bottom: '155px',
                    right: '20px',
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: isOpen
                        ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                        : `linear-gradient(135deg, ${sanctuary.purple}, #6B4C9A)`,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(75, 0, 130, 0.4)',
                    zIndex: 9999,
                    transition: 'all 0.3s ease',
                }}
            >
                {isOpen
                    ? <X size={22} color="#1A0A2E" />
                    : <Globe size={22} color="#F5F0E8" />
                }
            </button>
        </>
    );
}
