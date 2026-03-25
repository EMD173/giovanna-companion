/**
 * Demo Mode Hook
 * 
 * Provides a unified check for whether the app is in public demo mode.
 * Demo mode is triggered from the landing page "Try the Demo" button
 * and seeds all pages with realistic mock data.
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const DEMO_KEY = 'DEMO_MODE';
const DEV_KEY = 'DEV_BYPASS';

export function useDemoMode() {
    const navigate = useNavigate();

    const isDemoMode = localStorage.getItem(DEMO_KEY) === 'true';
    const isDevBypass = !import.meta.env.PROD && localStorage.getItem(DEV_KEY) === 'true';

    // True if either demo or dev bypass is active
    const isMockDataActive = isDemoMode || isDevBypass;

    const enterDemo = useCallback(() => {
        localStorage.setItem(DEMO_KEY, 'true');
        navigate('/dashboard');
    }, [navigate]);

    const exitDemo = useCallback(() => {
        localStorage.removeItem(DEMO_KEY);
        navigate('/');
    }, [navigate]);

    return {
        isDemoMode,
        isDevBypass,
        isMockDataActive,
        enterDemo,
        exitDemo,
    };
}

/**
 * Static check — for use outside React components (e.g., in useEffect guards)
 */
export function isDemoOrBypass(): boolean {
    const demo = localStorage.getItem(DEMO_KEY) === 'true';
    const dev = !import.meta.env.PROD && localStorage.getItem(DEV_KEY) === 'true';
    return demo || dev;
}
