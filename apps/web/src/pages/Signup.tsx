/**
 * Signup Page — Immersive Dark Theme
 *
 * Matches the landing page's Afrofuturist aesthetic.
 * Google Sign-In only (Firebase Auth).
 *
 * ROUTING LOGIC (Fixed 03/22/2026):
 * - If user has a family doc WITH at least one child → /dashboard (returning user)
 * - If user has no family doc OR family doc has zero children → /onboarding (new/incomplete user)
 * - This ensures no parent ever reaches the dashboard without activeChild being set.
 */

import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Sparkles, ArrowRight, Shield } from 'lucide-react';
import { getPostAuthRedirect } from '../lib/launchGuards';
import { useI18n } from '../lib/i18n';

export function Signup() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useI18n();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);

    // ---------------------------------------------------
    // On auth state change: check Firestore before routing
    // ---------------------------------------------------
    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        async function routeAuthenticatedUser() {
            setChecking(true);
            try {
                const familyRef = doc(db, 'families', user!.uid);
                const familySnap = await getDoc(familyRef);

                if (cancelled) return;

                navigate(getPostAuthRedirect(familySnap.exists() ? familySnap.data() : null), { replace: true });
            } catch (err) {
                console.error('Error checking family doc:', err);
                // On error, still send to onboarding — safer than a broken dashboard
                if (!cancelled) {
                    navigate('/onboarding', { replace: true });
                }
            }
        }

        routeAuthenticatedUser();
        return () => { cancelled = true; };
    }, [user, navigate]);

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            // Navigation happens in the useEffect above once `user` is set
        } catch (err) {
            setError(t('auth.failedSignIn'));
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem',
            background: 'linear-gradient(170deg, #1A0A2E 0%, #110820 40%, #0D0D0D 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Aurora glow */}
            <div style={{
                position: 'absolute', top: '30%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px', height: '300px',
                background: 'radial-gradient(ellipse at center, rgba(75, 0, 130, 0.25) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            <div style={{
                maxWidth: '440px', width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px', padding: '48px 36px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                textAlign: 'center',
                position: 'relative', zIndex: 1,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            }}>
                {/* Gold accent line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, #D4AF37, rgba(107, 76, 154, 0.6), #D4AF37, transparent)',
                    borderRadius: '24px 24px 0 0',
                }} />

                {/* Icon */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '20px',
                    background: 'linear-gradient(135deg, #4B0082 0%, #6B4C9A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 4px 20px rgba(75, 0, 130, 0.4)',
                }}>
                    <Sparkles size={28} color="#D4AF37" />
                </div>

                {/* Title */}
                <h1 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '2rem', fontWeight: 700,
                    color: '#F5F0E8', marginBottom: '10px',
                    lineHeight: 1.2,
                }}>
                    {t('auth.welcomeHome')}
                </h1>
                <p style={{
                    color: 'rgba(245, 240, 232, 0.5)',
                    fontSize: '0.95rem', lineHeight: 1.7,
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '32px',
                }}>
                    {t('auth.subtitle')}
                </p>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '12px 18px', borderRadius: '12px',
                        background: 'rgba(184, 84, 80, 0.15)',
                        border: '1px solid rgba(184, 84, 80, 0.3)',
                        color: '#D4837F', fontSize: '0.88rem',
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: '20px',
                    }}>
                        {error}
                    </div>
                )}

                {/* Checking state — brief flash while we verify family doc */}
                {checking && (
                    <div style={{
                        padding: '16px', textAlign: 'center',
                        color: 'rgba(245, 240, 232, 0.5)',
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: '20px',
                    }}>
                        {t('auth.preparing')}
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading || checking}
                    style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '12px', padding: '16px 24px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #D4AF37, #E8C97A)',
                        color: '#1A0A2E', fontWeight: 700, fontSize: '1rem',
                        fontFamily: "'Inter', sans-serif",
                        border: 'none', cursor: (loading || checking) ? 'default' : 'pointer',
                        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.3s ease',
                        opacity: (loading || checking) ? 0.7 : 1,
                    }}
                >
                    {/* Google "G" icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {loading ? t('auth.signingIn') : checking ? t('auth.preparing') : t('auth.continueGoogle')}
                    {!loading && !checking && <ArrowRight size={18} />}
                </button>

                {/* Privacy note */}
                <div style={{
                    marginTop: '24px', display: 'flex', alignItems: 'flex-start',
                    gap: '10px', textAlign: 'left',
                }}>
                    <Shield size={16} style={{
                        color: 'rgba(122, 158, 126, 0.6)', flexShrink: 0, marginTop: '2px',
                    }} />
                    <p style={{
                        color: 'rgba(245, 240, 232, 0.3)',
                        fontSize: '0.78rem', lineHeight: 1.6,
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        {t('auth.privacy')}
                    </p>
                </div>
            </div>
        </div>
    );
}
