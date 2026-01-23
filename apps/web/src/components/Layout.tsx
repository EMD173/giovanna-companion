/**
 * Layout Component - "Playful Adventure"
 * 
 * Gamified navigation with rounded pill buttons and
 * a floating bottom dock for mobile.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, PenTool, Layers, Menu, X, LogOut,
    Settings, Share2, Heart, Sparkles, Smile
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from './Toast';

export function Layout() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Adventure', path: '/dashboard', icon: <Sparkles size={20} /> },
        { name: 'Capture', path: '/log', icon: <PenTool size={20} /> },
        { name: 'Sidekick', path: '/chat', icon: <Smile size={20} /> },
        { name: 'Map', path: '/learn', icon: <BookOpen size={20} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col font-body bg-[var(--color-cream)]">
            {/* Top Navigation Bar - Playful Glass */}
            <nav className="nav-glass sticky top-0 z-50">
                <div className="container">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo - Sticker Style */}
                        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
                            <div className="w-12 h-12 rounded-full bg-[var(--color-orange)] flex items-center justify-center shadow-[0_4px_0px_#C2410C] group-hover:translate-y-[-2px] transition-transform">
                                <Sparkles size={24} className="text-white fill-white" />
                            </div>
                            <span className="font-heading font-black text-2xl text-[var(--color-navy)] tracking-tight">
                                Giovanna
                            </span>
                        </Link>

                        {/* Desktop Nav - Pill Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-5 py-2.5 rounded-full font-bold transition-all border-2 ${isActive(item.path)
                                        ? 'bg-[var(--color-navy)] border-[var(--color-navy)] text-white shadow-[0_4px_0px_rgba(15,23,42,0.4)] transform -translate-y-1'
                                        : 'border-transparent text-[var(--color-navy-light)] hover:bg-[var(--color-orange-light)] hover:text-[var(--color-orange)]'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link
                                        to="/settings"
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-[var(--color-orange-light)] text-[var(--color-navy)] hover:border-[var(--color-orange)] transition-colors"
                                        title="Settings"
                                    >
                                        <Settings size={20} />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-red-100 text-red-500 hover:border-red-400 hover:bg-red-50 transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/signup" className="btn btn-primary">
                                    Start Adventure
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button - Big & Touchable */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white border-2 border-[var(--color-orange-light)] text-[var(--color-navy)] shadow-sm"
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown (if needed) */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-[var(--color-cream)] pt-24 px-4">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={`p-4 rounded-xl font-bold border-2 flex items-center gap-4 ${isActive(item.path)
                                    ? 'bg-[var(--color-navy)] border-[var(--color-navy)] text-white'
                                    : 'bg-white border-[var(--color-orange-light)] text-[var(--color-navy)]'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={() => { logout(); closeMenu(); }}
                                className="p-4 rounded-xl font-bold border-2 bg-red-50 border-red-100 text-red-500 flex items-center gap-4"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 pb-24 md:pb-0">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation - Floating Dock style */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white rounded-3xl border-2 border-[var(--color-navy-light)] shadow-[0_8px_0px_rgba(15,23,42,0.2)] z-50 p-2">
                <div className="grid grid-cols-5 h-14 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center transition-all ${isActive(item.path)
                                    ? 'text-[var(--color-orange)] -translate-y-2'
                                    : 'text-[var(--color-navy-light)] hover:text-[var(--color-navy)]'
                                }`}
                        >
                            <div className={`p-2 rounded-full ${isActive(item.path) ? 'bg-[var(--color-orange-light)]' : ''}`}>
                                {React.cloneElement(item.icon as React.ReactElement, {
                                    size: isActive(item.path) ? 24 : 22,
                                    strokeWidth: 2.5
                                })}
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>

            <ToastContainer />
        </div>
    );
}
