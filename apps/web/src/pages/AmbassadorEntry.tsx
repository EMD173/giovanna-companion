/**
 * Ambassador Entry Page
 * © 2026 Eli Davis. All Rights Reserved.
 *
 * Route: /ambassador
 * Allows product ambassadors to enter their access code
 * and unlock full app access for product familiarization.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { immersive, typography } from '../shared/theme';
import { validateAmbassadorCode } from '../data/ambassadorCodes';

export default function AmbassadorEntry() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const profile = validateAmbassadorCode(code);
        if (!profile) {
            setError('Invalid ambassador code. Please check your code and try again.');
            return;
        }

        // Activate ambassador mode
        localStorage.setItem('AMBASSADOR_MODE', 'true');
        localStorage.setItem('AMBASSADOR_NAME', profile.name);
        localStorage.setItem('AMBASSADOR_CODE', profile.code);

        setSuccess(profile.name);

        // Redirect to dashboard after brief welcome
        setTimeout(() => {
            navigate('/dashboard');
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: immersive.bgGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
            }}>
                {/* Giovanna wordmark */}
                <h1 style={{
                    fontFamily: typography.heading,
                    fontSize: '2.5rem',
                    color: immersive.gold,
                    marginBottom: '8px',
                    letterSpacing: '-0.5px',
                }}>
                    Giovanna
                </h1>
                <p style={{
                    fontFamily: typography.body,
                    color: immersive.textMuted,
                    fontSize: '0.9rem',
                    marginBottom: '48px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                }}>
                    Ambassador Access
                </p>

                {success ? (
                    /* ──── Success State ──── */
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.08)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        borderRadius: '20px',
                        padding: '48px 32px',
                        animation: 'fadeIn 0.5s ease',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
                        <h2 style={{
                            fontFamily: typography.heading,
                            color: immersive.gold,
                            fontSize: '1.5rem',
                            marginBottom: '12px',
                        }}>
                            Welcome, {success}
                        </h2>
                        <p style={{
                            fontFamily: typography.body,
                            color: immersive.text,
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginBottom: '8px',
                        }}>
                            Ambassador mode activated. Full access unlocked.
                        </p>
                        <p style={{
                            fontFamily: typography.body,
                            color: immersive.textMuted,
                            fontSize: '0.85rem',
                        }}>
                            Redirecting to your dashboard...
                        </p>
                    </div>
                ) : (
                    /* ──── Code Entry Form ──── */
                    <form onSubmit={handleSubmit} style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '40px 32px',
                        backdropFilter: 'blur(20px)',
                    }}>
                        <p style={{
                            fontFamily: typography.body,
                            color: immersive.text,
                            fontSize: '1rem',
                            lineHeight: 1.7,
                            marginBottom: '32px',
                        }}>
                            Enter your ambassador code to unlock full access to Giovanna.
                            Explore every feature, learn the framework, and prepare to share.
                        </p>

                        <div style={{ marginBottom: '16px' }}>
                            <input
                                id="ambassador-code-input"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter your ambassador code"
                                autoComplete="off"
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: error
                                        ? '1.5px solid rgba(184, 84, 80, 0.6)'
                                        : '1.5px solid rgba(255, 255, 255, 0.12)',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    color: immersive.text,
                                    fontFamily: typography.body,
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border 0.2s ease',
                                    letterSpacing: '1px',
                                    textAlign: 'center',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => {
                                    e.target.style.border = `1.5px solid ${immersive.gold}`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.border = error
                                        ? '1.5px solid rgba(184, 84, 80, 0.6)'
                                        : '1.5px solid rgba(255, 255, 255, 0.12)';
                                }}
                            />
                        </div>

                        {error && (
                            <p style={{
                                fontFamily: typography.body,
                                color: immersive.rose,
                                fontSize: '0.85rem',
                                marginBottom: '16px',
                            }}>
                                {error}
                            </p>
                        )}

                        <button
                            id="ambassador-submit-btn"
                            type="submit"
                            disabled={!code.trim()}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: code.trim()
                                    ? `linear-gradient(135deg, ${immersive.gold} 0%, #E8C97A 100%)`
                                    : 'rgba(255, 255, 255, 0.06)',
                                color: code.trim() ? '#1A1A1A' : 'rgba(255,255,255,0.3)',
                                fontFamily: typography.body,
                                fontSize: '1rem',
                                fontWeight: 700,
                                cursor: code.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.3s ease',
                                boxShadow: code.trim() ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                            }}
                        >
                            Activate Ambassador Access
                        </button>

                        <p style={{
                            fontFamily: typography.body,
                            color: immersive.textDim,
                            fontSize: '0.8rem',
                            marginTop: '24px',
                            lineHeight: 1.5,
                        }}>
                            Ambassador codes are issued by Eli Davis.
                            <br />
                            © 2026 Eli Davis. All Rights Reserved.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
