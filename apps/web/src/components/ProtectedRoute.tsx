/**
 * ProtectedRoute — Route guard for authenticated pages.
 *
 * Wraps any route that requires authentication. If the user
 * is not logged in, they are redirected to the signup page.
 * While auth state is loading, shows a minimal branded loader.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import { hasCompletedFamilySetup } from '../lib/launchGuards';
import { sanctuary, typography } from '../shared/theme';

export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const { family, loading: familyLoading } = useFamily();
    const location = useLocation();

    // Dev bypass or Demo mode: skip auth/family checks
    const isDemoOrBypass = localStorage.getItem('DEMO_MODE') === 'true'
        || (!import.meta.env.PROD && localStorage.getItem('DEV_BYPASS') === 'true');
    if (isDemoOrBypass) {
        return <Outlet />;
    }

    if (loading || familyLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: sanctuary.bg,
                flexDirection: 'column',
                gap: '16px',
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'gentlePulse 1.5s ease-in-out infinite',
                }}>
                    <span style={{ color: sanctuary.gold, fontSize: '1.2rem' }}>✦</span>
                </div>
                <p style={{
                    fontFamily: typography.body,
                    color: sanctuary.textMuted,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                }}>
                    Preparing your sanctuary...
                </p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/signup" replace />;
    }

    if (!hasCompletedFamilySetup(family)) {
        return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
