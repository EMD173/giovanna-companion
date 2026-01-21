/**
 * Layout Component - Premium Redesign
 * 
 * Modern, clean navbar with blur effect
 * Inter typography, Ocean/Teal accent colors
 */

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Layers, Menu, X, LogOut, Settings, Share2, Heart, Sparkles } from 'lucide-react';
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
        { name: 'Learning', path: '/learn', icon: <BookOpen size={20} /> },
        { name: 'ABC Log', path: '/log', icon: <PenTool size={20} /> },
        { name: 'Strategies', path: '/strategies', icon: <Layers size={20} /> },
        { name: 'Bridge', path: '/bridge', icon: <Share2 size={20} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation Bar - Modern blur effect */}
            <nav className="nav-blur sticky top-0 z-50 border-b border-slate-200/50">
                <div className="container">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean to-teal flex items-center justify-center shadow-md">
                                <Sparkles size={22} className="text-white" />
                            </div>
                            <span className="font-bold text-2xl text-charcoal tracking-tight">
                                Giovanna
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
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
                                        className="p-2 text-slate hover:text-ocean hover:bg-soft-blue rounded-lg transition"
                                        title="Settings"
                                    >
                                        <Settings size={20} />
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate hover:text-coral hover:bg-red-50 rounded-lg transition"
                                        title="Sign Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <Link to="/signup" className="btn btn-primary">
                                    Get Started
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 rounded-lg text-slate hover:text-charcoal hover:bg-soft-blue transition"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
                        <div className="container py-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive(item.path)
                                            ? 'bg-gradient-to-r from-ocean to-teal text-white'
                                            : 'text-slate hover:bg-soft-blue hover:text-ocean'
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                            <div className="border-t border-slate-200 pt-4 mt-4">
                                {user ? (
                                    <>
                                        <Link
                                            to="/settings"
                                            onClick={closeMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate hover:bg-soft-blue"
                                        >
                                            <Settings size={20} />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => { logout(); closeMenu(); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-coral hover:bg-red-50"
                                        >
                                            <LogOut size={20} />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="block text-center btn btn-primary w-full"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-8 text-center border-t border-slate-200 bg-white/50">
                <p className="text-slate flex items-center justify-center gap-2">
                    Made with <Heart size={16} className="text-coral fill-current" /> by{' '}
                    <span className="font-bold text-ocean">
                        Eli Marshall Davis
                    </span>
                </p>
            </footer>

            <ToastContainer />
        </div>
    );
}
