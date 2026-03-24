/**
 * FeedbackModal — In-App Feedback Collection
 *
 * Accessible from Settings page. Saves to Firestore `feedback` collection.
 * 5-step emoji rating + two textareas.
 * Simple, warm, non-invasive.
 */

import { useState } from 'react';
import { X, Send, Check } from 'lucide-react';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { sanctuary, typography } from '../shared/theme';

const RATINGS = [
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😕', label: 'Confused' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '🙂', label: 'Happy' },
    { emoji: '🥰', label: 'Love it' },
];

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const { user } = useAuth();
    const { trackEvent } = useAnalytics();
    const [rating, setRating] = useState<number | null>(null);
    const [working, setWorking] = useState('');
    const [notWorking, setNotWorking] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === null) return;
        setIsSubmitting(true);

        try {
            const feedbackRef = doc(collection(db, 'feedback'));
            await setDoc(feedbackRef, {
                userId: user?.uid || 'anonymous',
                rating: rating + 1, // 1-5
                ratingLabel: RATINGS[rating].label,
                working,
                notWorking,
                createdAt: serverTimestamp(),
                userAgent: navigator.userAgent,
            });

            trackEvent('feedback_submitted', { rating: rating + 1 });
            setIsSubmitted(true);

            setTimeout(() => {
                onClose();
                // Reset for next open
                setRating(null);
                setWorking('');
                setNotWorking('');
                setIsSubmitted(false);
            }, 1500);
        } catch (err) {
            console.error('Error submitting feedback:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '12px',
        border: `1.5px solid ${sanctuary.border}`,
        background: sanctuary.bg,
        color: sanctuary.text,
        fontSize: '0.88rem',
        fontFamily: typography.body,
        outline: 'none',
        resize: 'vertical',
        boxSizing: 'border-box',
        lineHeight: 1.6,
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(26, 10, 46, 0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                background: sanctuary.bgCard,
                borderRadius: '20px',
                border: `1px solid ${sanctuary.border}`,
                boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                padding: '28px',
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: sanctuary.bgAlt,
                        color: sanctuary.textMuted,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    aria-label="Close feedback"
                >
                    <X size={14} />
                </button>

                {isSubmitted ? (
                    /* Success State */
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: sanctuary.sageBg, border: `2px solid ${sanctuary.sageBorder}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <Check size={28} color={sanctuary.sage} />
                        </div>
                        <h3 style={{
                            fontFamily: typography.heading, fontSize: '1.2rem',
                            fontWeight: 700, color: sanctuary.sage, marginBottom: '4px',
                        }}>Thank you.</h3>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.88rem',
                            color: sanctuary.textMuted,
                        }}>Your voice shapes Giovanna's future.</p>
                    </div>
                ) : (
                    /* Form */
                    <>
                        <h2 style={{
                            fontFamily: typography.heading, fontSize: '1.3rem',
                            fontWeight: 700, color: sanctuary.text, marginBottom: '4px',
                        }}>How's Giovanna working for you?</h2>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.85rem',
                            color: sanctuary.textMuted, marginBottom: '24px',
                        }}>Your honest feedback makes this better for every family.</p>

                        {/* Emoji Rating */}
                        <div style={{
                            display: 'flex', justifyContent: 'center', gap: '8px',
                            marginBottom: '24px',
                        }}>
                            {RATINGS.map((r, i) => (
                                <button
                                    key={i}
                                    onClick={() => setRating(i)}
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '14px',
                                        border: rating === i
                                            ? `2px solid ${sanctuary.gold}`
                                            : `1px solid ${sanctuary.border}`,
                                        background: rating === i ? sanctuary.goldBg : sanctuary.bgAlt,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '2px',
                                        fontSize: '1.4rem',
                                        transition: 'all 0.15s ease',
                                        transform: rating === i ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                    aria-label={r.label}
                                >
                                    <span>{r.emoji}</span>
                                </button>
                            ))}
                        </div>

                        {rating !== null && (
                            <p style={{
                                textAlign: 'center', fontSize: '0.78rem',
                                color: sanctuary.gold, fontWeight: 700,
                                fontFamily: typography.body, marginBottom: '16px',
                                marginTop: '-12px',
                            }}>
                                {RATINGS[rating].label}
                            </p>
                        )}

                        {/* Text inputs */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{
                                display: 'block', fontSize: '0.82rem', fontWeight: 700,
                                color: sanctuary.text, marginBottom: '6px',
                                fontFamily: typography.body,
                            }}>What's working?</label>
                            <textarea
                                rows={2}
                                value={working}
                                onChange={(e) => setWorking(e.target.value)}
                                placeholder="What features do you find most helpful?"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', fontSize: '0.82rem', fontWeight: 700,
                                color: sanctuary.text, marginBottom: '6px',
                                fontFamily: typography.body,
                            }}>What's not?</label>
                            <textarea
                                rows={2}
                                value={notWorking}
                                onChange={(e) => setNotWorking(e.target.value)}
                                placeholder="What feels confusing or missing?"
                                style={inputStyle}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={rating === null || isSubmitting}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                background: rating !== null
                                    ? `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`
                                    : sanctuary.bgAlt,
                                color: rating !== null ? '#1A1A1A' : sanctuary.textMuted,
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.92rem',
                                cursor: rating !== null ? 'pointer' : 'default',
                                fontFamily: typography.body,
                                boxShadow: rating !== null
                                    ? '0 4px 16px rgba(212, 175, 55, 0.3)'
                                    : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: isSubmitting ? 0.5 : 1,
                            }}
                        >
                            <Send size={16} />
                            {isSubmitting ? 'Sending...' : 'Send Feedback'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
