/**
 * useReadAloud — Text-to-Speech Accessibility Hook
 *
 * Uses the Web Speech API (speechSynthesis) to read content aloud.
 * Language-aware: selects voice matching the current i18n locale.
 *
 * Features:
 *   - speak(text) — reads any text aloud
 *   - speakPage() — reads all [data-readable] elements on the page
 *   - stop() — cancels speech immediately
 *   - isReading — current state
 *   - isEnabled / setEnabled — persisted user preference
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useI18n } from '../lib/i18n';

// Speech synthesis language codes per locale
const LANG_CODES: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
};

export function useReadAloud() {
    const { locale } = useI18n();
    const [isReading, setIsReading] = useState(false);
    const [isEnabled, setEnabledState] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('giovanna_read_aloud') === 'true';
    });
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    const setEnabled = useCallback((enabled: boolean) => {
        setEnabledState(enabled);
        localStorage.setItem('giovanna_read_aloud', String(enabled));
        if (!enabled) {
            window.speechSynthesis?.cancel();
            setIsReading(false);
        }
    }, []);

    // Cancel speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis?.cancel();
        setIsReading(false);
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported || !text.trim()) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = LANG_CODES[locale] || 'en-US';
        utterance.rate = 0.95;  // Slightly slower — calming
        utterance.pitch = 1;

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        const langCode = LANG_CODES[locale] || 'en-US';
        const matchingVoice = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }

        utterance.onstart = () => setIsReading(true);
        utterance.onend = () => setIsReading(false);
        utterance.onerror = () => setIsReading(false);

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [isSupported, locale]);

    const speakPage = useCallback(() => {
        if (!isSupported) return;

        // Collect all readable content on the page
        const readableElements = document.querySelectorAll('[data-readable]');
        const textParts: string[] = [];

        readableElements.forEach((el) => {
            const text = el.textContent?.trim();
            if (text) textParts.push(text);
        });

        // Fallback: if no [data-readable] elements, read main content
        if (textParts.length === 0) {
            const main = document.querySelector('main') || document.querySelector('#main-content');
            if (main) {
                const text = main.textContent?.trim();
                if (text) textParts.push(text);
            }
        }

        if (textParts.length > 0) {
            speak(textParts.join('. '));
        }
    }, [isSupported, speak]);

    return {
        isSupported,
        isReading,
        isEnabled,
        setEnabled,
        speak,
        speakPage,
        stop,
    };
}
