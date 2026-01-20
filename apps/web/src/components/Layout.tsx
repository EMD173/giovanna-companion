import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PenTool, Layers, Menu, X } from 'lucide-react';

export function Layout() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Simple active link helper
    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: <Home size={20} /> },
        { name: 'Learning Hub', path: '/learn', icon: <BookOpen size={20} /> },
        { name: 'ABC Log', path: '/log', icon: <PenTool size={20} /> },
        { name: 'Strategies', path: '/strategies', icon: <Layers size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Top Navigation Bar (Mobile & Desktop) */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center gap-2" onClick={closeMenu}>
                                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    G
                                </div>
                                <span className="font-bold text-xl text-teal-900 tracking-tight">Giovanna</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(item.path)
                                            ? 'border-teal-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full left-0 z-40">
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(item.path)
                                            ? 'bg-teal-50 border-teal-500 text-teal-700'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        {item.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
}
