/**
 * DevNav — Floating dev navigation pill
 * Only renders in development mode.
 * Click the ⚡ button to expand route list.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const routes = [
    { path: '/', label: '🏠 Landing' },
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/onboarding', label: '🤝 Onboarding' },
    { path: '/signup', label: '🔑 Signup' },
    { path: '/log', label: '📝 ABC Log' },
    { path: '/chat', label: '💬 Oracle Chat' },
    { path: '/learn', label: '📚 Learning Hub' },
    { path: '/strategies', label: '🧠 Strategies' },
    { path: '/bridge', label: '🌉 Bridge/Share' },
    { path: '/report', label: '📄 IEP Report' },
    { path: '/profile', label: '👶 Child Profile' },
    { path: '/homeplace', label: '🏡 Homeplace' },
    { path: '/village', label: '👥 Village Calendar' },
    { path: '/safety', label: '🛡️ Safety Profile' },
    { path: '/psp', label: '📋 PSP Editor' },
    { path: '/resources', label: '📖 Resources' },
    { path: '/media', label: '🖼️ Media Library' },
    { path: '/practice', label: '🎓 Practice Modules' },
    { path: '/educator-training', label: '📋 Educator Training' },
    { path: '/respite', label: '🤲 Respite Care' },
    { path: '/wellness', label: '💖 Wellness' },
    { path: '/wins', label: '🎉 Joy & Wins' },
    { path: '/appeals', label: '📑 Insurance Appeals' },
    { path: '/transition', label: '🛤️ Transition Roadmap' },
    { path: '/healthcare-defense', label: '🏥 Healthcare Defense' },
    { path: '/providers', label: '👨‍⚕️ Professional Integration' },
    { path: '/insights', label: '📈 AI Insights' },
    { path: '/upgrade', label: '⬆️ Upgrade' },
    { path: '/settings', label: '⚙️ Settings' },
    { path: '/admin', label: '🔧 Admin' },
];

export function DevNav() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Only show in development
    if (import.meta.env.PROD) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
            {/* Route List */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '56px',
                    right: 0,
                    width: '220px',
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    background: 'rgba(13, 13, 13, 0.95)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '16px',
                    padding: '8px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}>
                    <div style={{
                        padding: '8px 12px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#D4AF37',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: '4px',
                    }}>
                        Dev Navigation
                    </div>
                    {routes.map(route => {
                        const isActive = location.pathname === route.path;
                        return (
                            <button
                                key={route.path}
                                onClick={() => { navigate(route.path); setIsOpen(false); }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    borderRadius: '10px',
                                    background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                    color: isActive ? '#D4AF37' : 'rgba(245, 240, 232, 0.6)',
                                    fontSize: '0.8rem',
                                    fontWeight: isActive ? 700 : 500,
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    marginBottom: '2px',
                                    transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) (e.target as HTMLElement).style.background = 'transparent';
                                }}
                            >
                                {route.label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    background: isOpen ? 'rgba(212, 175, 55, 0.2)' : 'rgba(13, 13, 13, 0.9)',
                    color: '#D4AF37',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'all 0.2s ease',
                }}
            >
                {isOpen ? '✕' : '⚡'}
            </button>
        </div>
    );
}
