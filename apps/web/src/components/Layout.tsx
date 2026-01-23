/**
 * Layout Component - Ruth E. Carter Inspired
 * 
 * Regal navigation with dignified gold accents.
 * Grounded, powerful, ancestrally rooted.
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, PenTool, MessageCircle, Menu, X, LogOut,
    Settings, Sparkles
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
        { name: 'Journey', path: '/dashboard', icon: <Sparkles size={20} /> },
        { name: 'Capture', path: '/log', icon: <PenTool size={20} /> },
        { name: 'Oracle', path: '/chat', icon: <MessageCircle size={20} /> },
        { name: 'Learn', path: '/learn', icon: <BookOpen size={20} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar - Regal */}
            <nav className="nav-regal sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo - Dignified */}
                        <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--regal-purple)] to-[var(--regal-purple-dark)] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                <Sparkles size={22} className="text-[var(--gold-shimmer)]" />
                            </div>
                            <span className="font-heading font-bold text-2xl text-[var(--deep-ebony)] tracking-wide">
                                Giovanna
                            </span>
                        </Link>

                        {/* Desktop Nav - Clean with Gold Active State */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(item.path)
                                        ? 'bg-[var(--deep-ebony)] text-[var(--gold-shimmer)]'
                                        : 'text-[var(--warm-stone)] hover:text-[var(--deep-ebony)] hover:bg-[var(--parchment)]'
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
                                        className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--warm-stone)] hover:text-[var(--deep-ebony)] hover:bg-[var(--parchment)] transition-colors"
                                        title="Settings"
                                    >
                                        <Settings size={20} />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--warrior-red)] hover:bg-red-50 transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/signup" className="btn-regal btn-gold">
                                    Begin Journey
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg text-[var(--deep-ebony)] hover:bg-[var(--parchment)]"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-[var(--ivory-cream)] pt-24 px-4">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMenu}
                                className={`p-4 rounded-xl font-medium flex items-center gap-4 transition-colors ${isActive(item.path)
                                    ? 'bg-[var(--deep-ebony)] text-[var(--gold-shimmer)]'
                                    : 'bg-white text-[var(--deep-ebony)] border border-[var(--parchment)]'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={() => { logout(); closeMenu(); }}
                                className="p-4 rounded-xl font-medium bg-red-50 text-[var(--warrior-red)] flex items-center gap-4 mt-4"
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
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation - Grounded Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--parchment)] z-50 pb-safe">
                <div className="grid grid-cols-5 h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive(item.path)
                                    ? 'text-[var(--regal-purple)]'
                                    : 'text-[var(--soft-stone)]'
                                }`}
                        >
                            {React.cloneElement(item.icon as React.ReactElement, {
                                size: 22,
                                strokeWidth: isActive(item.path) ? 2.5 : 2
                            })}
                            <span className="text-[10px] font-semibold">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            <ToastContainer />
        </div>
    );
}
