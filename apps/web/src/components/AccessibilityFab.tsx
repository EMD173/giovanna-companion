import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { useReadAloud } from '../hooks/useReadAloud';
import { sanctuary, typography } from '../shared/theme';

export function AccessibilityFab({ showTooltip = false }: { showTooltip?: boolean }) {
    const { t } = useI18n();
    const { isSupported: ttsSupported, isReading, speakPage, stop } = useReadAloud();
    const [isHovered, setIsHovered] = useState(false);

    if (!ttsSupported) return null;

    const handleReadAloud = () => {
        if (isReading) {
            stop();
        } else {
            speakPage();
        }
    };

    return (
        <>
            {/* Hover tooltip */}
            {showTooltip && isHovered && (
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
                        {isReading ? t('a11y.stopReading') : t('a11y.readPage')}
                    </span>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={handleReadAloud}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label={t('a11y.readPage')}
                style={{
                    position: 'fixed',
                    bottom: '155px',
                    right: '20px',
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    background: isReading
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
                {isReading
                    ? <VolumeX size={22} color="#1A0A2E" />
                    : <Volume2 size={22} color="#F5F0E8" />
                }
            </button>
        </>
    );
}
