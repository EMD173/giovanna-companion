/**
 * Voice Input Button Component
 * 
 * Microphone button for voice input with visual feedback.
 * Premium feature indicator for free tier users.
 */

import { Mic, MicOff, Volume2, VolumeX, Crown } from 'lucide-react';
import { useVoiceMode } from '../hooks/useVoiceMode';

interface VoiceInputButtonProps {
    onTranscript?: (text: string) => void;
    className?: string;
}

export function VoiceInputButton({ onTranscript, className = '' }: VoiceInputButtonProps) {
    const {
        isSupported,
        isTierAllowed,
        isListening,
        transcript,
        interimTranscript,
        error,
        startListening,
        stopListening,
        clearTranscript
    } = useVoiceMode();

    const handleToggle = () => {
        if (isListening) {
            stopListening();
            if (transcript && onTranscript) {
                onTranscript(transcript.trim());
                clearTranscript();
            }
        } else {
            startListening();
        }
    };

    // Not supported
    if (!isSupported) {
        return null;
    }

    // Free tier - show upgrade prompt
    if (!isTierAllowed) {
        return (
            <button
                className={`relative p-3 bg-slate-100 text-slate-400 rounded-full cursor-not-allowed ${className}`}
                title="Voice mode requires Companion tier"
                disabled
            >
                <Mic size={20} />
                <Crown size={12} className="absolute -top-1 -right-1 text-amber-500" />
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleToggle}
                className={`p-3 rounded-full transition-all ${isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    } ${className}`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Listening indicator */}
            {isListening && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-lg min-w-48 max-w-72">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-slate-600">Listening...</span>
                    </div>
                    <p className="text-sm text-slate-800">
                        {interimTranscript || transcript || 'Speak now...'}
                    </p>
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-600">
                    {error}
                </div>
            )}
        </div>
    );
}

interface SpeakButtonProps {
    text: string;
    className?: string;
}

export function SpeakButton({ text, className = '' }: SpeakButtonProps) {
    const { isSupported, isTierAllowed, isSpeaking, speak, stopSpeaking } = useVoiceMode();

    if (!isSupported) return null;

    // Free tier
    if (!isTierAllowed) {
        return (
            <button
                className={`relative p-2 text-slate-400 cursor-not-allowed ${className}`}
                title="Voice output requires Companion tier"
                disabled
            >
                <Volume2 size={16} />
                <Crown size={10} className="absolute -top-0.5 -right-0.5 text-amber-500" />
            </button>
        );
    }

    return (
        <button
            onClick={() => isSpeaking ? stopSpeaking() : speak(text)}
            className={`p-2 rounded-lg transition-colors ${isSpeaking
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'
                } ${className}`}
            title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
        >
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
    );
}
