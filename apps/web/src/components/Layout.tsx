/**
 * Layout Component
 * 
 * Main app layout with warm, tactile Giovanna brand aesthetic.
 * Digital homeplace feel: handmade, protective, joyful.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Layers, Menu, X, LogOut, User, Share2, Settings, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from './Toast';

export function Layout() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Simple active link helper
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Learning', path: '/learn', icon: <BookOpen size={20} /> },
        { name: 'ABC Log', path: '/log', icon: <PenTool size={20} /> },
        { name: 'Strategies', path: '/strategies', icon: <Layers size={20} /> },
        { name: 'Bridge', path: '/bridge', icon: <Share2 size={20} /> },
        { name: 'Resources', path: '/resources', icon: <Heart size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="min-h-screen text-[var(--giovanna-warmth-900)]">
            {/* Top Navigation Bar - Warm, tactile feel */}
            <nav className="bg-gradient-to-r from-[var(--giovanna-warmth-50)] to-[var(--giovanna-warmth-100)] border-b-2 border-[var(--giovanna-warmth-300)] sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* Logo with handmade feel */}
                            <Link to="/" className="flex-shrink-0 flex items-center gap-3" onClick={closeMenu}>
                                {/* Woven patch-inspired logo */}
                                <div className="w-10 h-10 rounded-xl gradient-weave flex items-center justify-center shadow-md transform hover:scale-105 transition-transform">
                                    <span className="text-white font-bold text-lg drop-shadow-sm">G</span>
                                </div>
                                <span
                                    className="font-bold text-2xl tracking-tight"
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        color: 'var(--giovanna-terracotta)'
                                    }}
                                >
                                    Giovanna
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:ml-6 md:flex md:space-x-1">
                            {navItems.slice(0, 6).map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                        ? 'bg-[var(--giovanna-terracotta)] text-white shadow-md'
                                        : 'text-[var(--giovanna-warmth-700)] hover:bg-[var(--giovanna-warmth-200)] hover:text-[var(--giovanna-warmth-900)]'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center ml-4 gap-2">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/settings"
                                        className="p-2 text-[var(--giovanna-warmth-600)] hover:text-[var(--giovanna-warmth-900)] hover:bg-[var(--giovanna-warmth-200)] rounded-lg transition-colors"
                                        title="Settings"
                                    >
                                        <Settings size={20} />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-[var(--giovanna-warmth-600)] hover:text-[var(--giovanna-terracotta)] hover:bg-red-50 rounded-lg transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/signup"
                                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--giovanna-terracotta)] to-[#D65A47] text-white text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-xl text-[var(--giovanna-warmth-600)] hover:text-[var(--giovanna-warmth-900)] hover:bg-[var(--giovanna-warmth-200)] focus:outline-none focus:ring-2 focus:ring-[var(--giovanna-golden)]"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Warm, inviting */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[var(--giovanna-warmth-50)] border-b-2 border-[var(--giovanna-warmth-300)] shadow-lg absolute w-full left-0 z-40">
                        <div className="pt-2 pb-3 space-y-1 px-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-[var(--giovanna-terracotta)] to-[#D65A47] text-white shadow-md'
                                        : 'text-[var(--giovanna-warmth-700)] hover:bg-[var(--giovanna-warmth-200)]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                </Link>
                            ))}
                            <div className="border-t border-[var(--giovanna-warmth-300)] mt-2 pt-2">
                                {user ? (
                                    <button
                                        onClick={() => { logout(); closeMenu(); }}
                                        className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-[var(--giovanna-terracotta)] hover:bg-red-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LogOut size={20} />
                                            Sign Out
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="block px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-[var(--giovanna-terracotta)] to-[#D65A47] text-white text-center shadow-md"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area - Warm paper texture */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            {/* Attribution Footer - Warm, handmade feel */}
            <footer className="py-8 text-center border-t border-[var(--giovanna-warmth-300)] mt-auto bg-[var(--giovanna-warmth-50)]/50">
                <p
                    className="text-[var(--giovanna-warmth-700)] flex items-center justify-center gap-2"
                    style={{ fontFamily: 'var(--font-accent)' }}
                >
                    Made with <Heart size={16} className="text-[var(--giovanna-terracotta)] fill-current" /> by{' '}
                    <span
                        className="font-bold text-[var(--giovanna-terracotta)]"
                        style={{ fontFamily: 'var(--font-display)', fontSize: '1.2em' }}
                    >
                        Eli Marshall Davis
                    </span>
                </p>
            </footer>

            <ToastContainer />
        </div>
    );
}
