/**
 * Demo Banner — Persistent top bar shown during demo mode.
 * 
 * Shows: "You're exploring Giovanna in Demo Mode"
 * with Sign Up Free and Exit Demo actions.
 */

import { Play, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDemoMode } from '../hooks/useDemoMode';

export function DemoBanner() {
    const { isDemoMode, exitDemo } = useDemoMode();

    if (!isDemoMode) return null;

    return (
        <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            background: 'linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 50%, #1A0A2E 100%)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
        }}>
            {/* Demo indicator */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Play size={12} color="#D4AF37" fill="#D4AF37" />
                </div>
                <span style={{
                    color: 'rgba(245, 240, 232, 0.8)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: "'Inter', -apple-system, sans-serif",
                }}>
                    You&apos;re exploring <strong style={{ color: '#E8C97A' }}>Demo Mode</strong> — this is what your family&apos;s data could look like
                </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => {
                    const shareText = `I just found this app that turns voice notes about your kid's behaviors into individualized strategies — for home, school, therapy, everywhere. Try the demo: ${window.location.origin}/demo`;
                    navigator.clipboard.writeText(shareText).then(() => {
                        const btn = document.getElementById('demo-share-btn');
                        if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = '📤 Share'; }, 2000); }
                    });
                }} id="demo-share-btn" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '100px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(245, 240, 232, 0.7)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    whiteSpace: 'nowrap',
                }}>
                    📤 Share
                </button>
                <Link to="/signup" onClick={() => localStorage.removeItem('DEMO_MODE')} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 18px',
                    borderRadius: '100px',
                    background: 'linear-gradient(135deg, #D4AF37, #E8C97A)',
                    color: '#1A0A2E',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    whiteSpace: 'nowrap',
                }}>
                    Sign Up Free <ArrowRight size={14} />
                </Link>
                <button onClick={exitDemo} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(245, 240, 232, 0.5)',
                    cursor: 'pointer',
                }} title="Exit Demo">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
