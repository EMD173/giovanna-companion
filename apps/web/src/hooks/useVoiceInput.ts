/**
 * Voice Input Hook — Speech-to-Text for ABC Log Forms
 *
 * Lightweight, per-field voice input. NOT tier-gated — voice capture
 * for behavior logging is core functionality ("Don't make me type when I'm crying.").
 *
 * Key differences from useVoiceMode.ts:
 *   - No subscription tier check
 *   - No text-to-speech (one-directional: speech → text)
 *   - Per-field targeting via callback pattern
 *   - Auto-stops after 2s of silence
 */

import { useState, useCallback, useRef } from 'react';

export interface VoiceInputState {
    isSupported: boolean;
    isListening: boolean;
    activeField: string | null;
    error: string | null;
}

export function useVoiceInput() {
    const [isListening, setIsListening] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const stopListening = useCallback(() => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {
                // Already stopped
            }
        }
        setIsListening(false);
        setActiveField(null);
    }, []);

    const startListening = useCallback((
        fieldName: string,
        onResult: (transcript: string) => void
    ) => {
        if (!isSupported) {
            setError('Voice input not supported in this browser');
            return;
        }

        // Stop any existing session
        stopListening();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionConstructor = (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionConstructor) {
            setError('Speech recognition not available');
            return;
        }

        const recognition = new SpeechRecognitionConstructor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalText = '';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            // Reset silence timer on every result
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            let interimText = '';
            finalText = '';

            for (let i = 0; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalText += result[0].transcript;
                } else {
                    interimText += result[0].transcript;
                }
            }

            // Auto-stop after 2s of silence (only if we have final text)
            if (finalText) {
                silenceTimerRef.current = setTimeout(() => {
                    onResult(finalText.trim());
                    stopListening();
                }, 2000);
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            console.error('Voice input error:', event.error);
            if (event.error !== 'aborted') {
                setError(`Voice error: ${event.error}`);
            }
            stopListening();
        };

        recognition.onend = () => {
            // If we have final text and recognition ended naturally, deliver it
            if (finalText) {
                onResult(finalText.trim());
            }
            setIsListening(false);
            setActiveField(null);
        };

        recognitionRef.current = recognition;
        setError(null);
        setActiveField(fieldName);

        try {
            recognition.start();
            setIsListening(true);
        } catch (err) {
            console.error('Failed to start voice input:', err);
            setError('Failed to start voice input');
            setActiveField(null);
        }
    }, [isSupported, stopListening]);

    return {
        isSupported,
        isListening,
        activeField,
        error,
        startListening,
        stopListening,
    };
}
