/**
 * Demo Entry — Direct /demo URL for sharing.
 * 
 * Sets DEMO_MODE in localStorage and immediately redirects to /dashboard.
 * This allows parents to share a single link: giovanna.app/demo
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function DemoEntry() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('DEMO_MODE', 'true');
        navigate('/dashboard', { replace: true });
    }, [navigate]);

    return null;
}
