import { useState } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { showToast } from '../Toast';
import { sanctuary, typography } from '../../shared/theme';

/**
 * QuickLogButton - The "Vent" Button
 *
 * "Don't make me type when I'm crying."
 * A one-tap audio log that simulates capturing a voice note.
 */

export function QuickLogButton() {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const startRecording = () => {
        setIsRecording(true);
        showToast("Recording... Speak your truth.", "success");
    };

    const stopRecording = () => {
        setIsRecording(false);
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            showToast("Vent saved. usage: 1 min.", "success");
        }, 1500);
    };

    const buttonStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px',
        borderRadius: '16px',
        cursor: isProcessing ? 'default' : 'pointer',
        border: isRecording ? 'none' : `2px solid ${sanctuary.border}`,
        background: isRecording ? sanctuary.rose : sanctuary.bgCard,
        boxShadow: isRecording
            ? '0 4px 20px rgba(184, 84, 80, 0.3)'
            : sanctuary.shadowMd,
        transform: isRecording ? 'scale(0.98)' : 'scale(1)',
    };

    const iconContainerStyle: React.CSSProperties = {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        background: isRecording ? '#fff' : sanctuary.roseBg,
        color: sanctuary.rose,
    };

    return (
        <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isProcessing}
            style={buttonStyle}
        >
            {/* Animated Background for Recording State */}
            {isRecording && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: sanctuary.rose,
                    opacity: 0.85,
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
            )}

            <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={iconContainerStyle}>
                        {isProcessing ? (
                            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : isRecording ? (
                            <Square size={24} fill="currentColor" />
                        ) : (
                            <Mic size={24} />
                        )}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{
                            fontFamily: typography.heading,
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: isRecording ? '#fff' : sanctuary.text,
                            marginBottom: '2px',
                        }}>
                            {isRecording ? "Listening..." : "Quick Vent"}
                        </h3>
                        <p style={{
                            fontSize: '0.85rem',
                            fontFamily: typography.body,
                            color: isRecording ? 'rgba(255,255,255,0.8)' : sanctuary.textMuted,
                        }}>
                            {isRecording ? "Release it all." : "Hold to record"}
                        </p>
                    </div>
                </div>

                {isRecording && (
                    <span style={{
                        color: '#fff',
                        fontFamily: "'SF Mono', monospace",
                        fontWeight: 700,
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}>REC</span>
                )}
            </div>
        </button>
    );
}
