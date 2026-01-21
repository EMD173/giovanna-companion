/**
 * Voice Mode Hook
 * 
 * Speech-to-text input and text-to-speech output for AI conversations.
 * Premium feature for Companion, Pro, and Enterprise tiers.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

// ============================================
// TYPES
// ============================================

export interface VoiceModeState {
    isSupported: boolean;
    isTierAllowed: boolean;
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    isSpeaking: boolean;
    error: string | null;
}

export interface VoiceModeActions {
    startListening: () => void;
    stopListening: () => void;
    speak: (text: string) => void;
    stopSpeaking: () => void;
    clearTranscript: () => void;
}

// ============================================
// VOICE MODE HOOK
// ============================================

export function useVoiceMode(): VoiceModeState & VoiceModeActions {
    const { tier } = useSubscription();

    // Check if voice is allowed for this tier (Companion and above)
    const isTierAllowed = tier !== 'free';

    // Check browser support
    const isSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
        'speechSynthesis' in window;

    // State
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for API instances - use any for cross-browser compatibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (!isSupported || !isTierAllowed) return;

        // Get constructor (cross-browser)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognitionConstructor = (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionConstructor) return;

        const recognition = new SpeechRecognitionConstructor();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimText += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript(prev => prev + ' ' + finalTranscript);
            }
            setInterimTranscript(interimText);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setError(`Voice error: ${event.error}`);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [isSupported, isTierAllowed]);

    // Start listening
    const startListening = useCallback(() => {
        if (!isTierAllowed) {
            setError('Voice mode requires Companion tier or higher');
            return;
        }
        if (!isSupported) {
            setError('Voice not supported in this browser');
            return;
        }
        if (!recognitionRef.current) return;

        setError(null);
        setTranscript('');
        setInterimTranscript('');

        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (err) {
            console.error('Failed to start listening:', err);
            setError('Failed to start voice input');
        }
    }, [isSupported, isTierAllowed]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    // Clear transcript
    const clearTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
    }, []);

    // Text-to-speech
    const speak = useCallback((text: string) => {
        if (!isTierAllowed) {
            setError('Voice mode requires Companion tier or higher');
            return;
        }
        if (!isSupported) {
            setError('Voice not supported in this browser');
            return;
        }

        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Samantha') ||
            v.name.includes('Google') ||
            v.lang === 'en-US'
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            setError('Failed to speak');
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isSupported, isTierAllowed]);

    // Stop speaking
    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    return {
        // State
        isSupported,
        isTierAllowed,
        isListening,
        transcript,
        interimTranscript,
        isSpeaking,
        error,

        // Actions
        startListening,
        stopListening,
        speak,
        stopSpeaking,
        clearTranscript
    };
}
