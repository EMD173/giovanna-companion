/**
 * Layout Component — Sanctuary Navigation
 * 
 * Warm, calming navigation using the sanctuary theme.
 * Hidden on landing page and onboarding (those are immersive dark pages).
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { List as Menu, X, SignOut as LogOut, GearSix as Settings } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from './Toast';
import { DemoBanner } from './DemoBanner';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { sanctuary, typography } from '../shared/theme';
import {
    SanctuaryIcon,
    VillageIcon,
    JourneyIcon,
    CaptureIcon,
    OracleIcon,
    LearnIcon,
    PracticeIcon,
    EducatorIcon,
    RespiteIcon
} from './icons/SanctuaryIcons';

export function Layout() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();
    const isDesktop = useIsDesktop();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;
    const isLanding = location.pathname === '/' || location.pathname === '/onboarding';

    const navItems = [
        { name: 'Home', path: '/', Icon: SanctuaryIcon },
        { name: 'Village', path: '/village', Icon: VillageIcon },
        { name: 'Journey', path: '/dashboard', Icon: JourneyIcon },
        { name: 'Capture', path: '/log', Icon: CaptureIcon },
        { name: 'Insight', path: '/chat', Icon: OracleIcon },
        { name: 'Practice', path: '/practice', Icon: PracticeIcon },
        { name: 'Educator', path: '/educator-training', Icon: EducatorIcon },
        { name: 'Respite', path: '/respite', Icon: RespiteIcon },
        { name: 'Learn', path: '/learn', Icon: LearnIcon },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Demo Mode Banner — sticky top when DEMO_MODE active */}
            <DemoBanner />

            {/* Skip-to-content link — visible on Tab for keyboard users */}
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* Top Navigation Bar — Hidden on landing/onboarding */}
            {!isLanding && (
                <nav aria-label="Main navigation" style={{
                    background: sanctuary.navBg,
                    borderBottom: `1px solid ${sanctuary.navBorder}`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            height: '72px',
                            alignItems: 'center',
                            position: 'relative',
                        }}>
                            {/* Logo */}
                            <Link to="/" onClick={closeMenu} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                            }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${sanctuary.purple} 0%, #4B0082 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: sanctuary.shadowMd,
                                }}>
                                    <JourneyIcon size={20} active />
                                </div>
                                <span style={{
                                    fontFamily: typography.heading,
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    color: sanctuary.text,
                                    letterSpacing: '0.02em',
                                }}>
                                    Giovanna
                                </span>
                            </Link>

                            {/* Desktop Nav Links */}
                            {isDesktop && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            style={{
                                                padding: '8px 18px',
                                                borderRadius: '10px',
                                                fontWeight: 600,
                                                fontSize: '0.9rem',
                                                fontFamily: typography.body,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s ease',
                                                background: isActive(item.path) ? sanctuary.goldBg : 'transparent',
                                                color: isActive(item.path) ? sanctuary.gold : sanctuary.navText,
                                                border: isActive(item.path) ? `1px solid ${sanctuary.goldBorder}` : '1px solid transparent',
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Desktop Auth */}
                            {isDesktop && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {user ? (
                                        <>
                                            <Link to="/settings" title="Settings" style={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                                color: sanctuary.navText,
                                                textDecoration: 'none',
                                            }}>
                                                <Settings size={20} />
                                            </Link>
                                            <button onClick={logout} title="Sign Out" style={{
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '10px',
                                                color: sanctuary.rose,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}>
                                                <LogOut size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/signup" style={{
                                            padding: '10px 24px',
                                            borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${sanctuary.gold}, ${sanctuary.goldLight})`,
                                            color: '#1A1A1A',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            textDecoration: 'none',
                                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                                        }}>
                                            Begin Journey
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            {!isDesktop && (
                                <button
                                    onClick={toggleMenu}
                                    aria-expanded={isMenuOpen}
                                    aria-controls="mobile-menu"
                                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '10px',
                                        background: 'none',
                                        border: 'none',
                                        color: sanctuary.text,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile Menu Dropdown */}
            {!isLanding && !isDesktop && isMenuOpen && (
                <div id="mobile-menu" role="dialog" aria-label="Navigation menu" style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                    background: sanctuary.bg,
                    paddingTop: '96px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {navItems.map((item) => {
                            const IconComponent = item.Icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '14px',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        textDecoration: 'none',
                                        background: active ? sanctuary.goldBg : sanctuary.bgCard,
                                        color: active ? sanctuary.gold : sanctuary.text,
                                        border: `1px solid ${active ? sanctuary.goldBorder : sanctuary.border}`,
                                    }}
                                >
                                    <IconComponent size={24} active={active} />
                                    {item.name}
                                </Link>
                            );
                        })}
                        {user && (
                            <button
                                onClick={() => { logout(); closeMenu(); }}
                                style={{
                                    padding: '16px',
                                    borderRadius: '14px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    background: sanctuary.roseBg,
                                    color: sanctuary.rose,
                                    border: `1px solid ${sanctuary.roseBorder}`,
                                    marginTop: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main id="main-content" role="main" style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            {!isLanding && !isDesktop && (
                <nav aria-label="Quick navigation" style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: sanctuary.navBg,
                    borderTop: `1px solid ${sanctuary.navBorder}`,
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}>
                    <div style={{
                        height: '72px',
                        padding: '0 8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '4px',
                    }}>
                        {navItems.slice(0, 5).map((item) => {
                            const IconComponent = item.Icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        minWidth: '44px',
                                        minHeight: '44px',
                                        padding: '8px 0',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <IconComponent size={24} active={active} />
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: active ? sanctuary.gold : sanctuary.navText,
                                    }}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}

            <ToastContainer />
        </div>
    );
}
