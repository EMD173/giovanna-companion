/**
 * Main Dashboard - "Command Center"
 * 
 * The central hub of the application.
 * Designed to feel like an App, not a webpage.
 * Focus: Quick Action Inputs + AI Process/Output Loop.
 */

import { Link } from 'react-router-dom';
import {
    Zap, MessageCircle, FileText, Heart,
    ChevronRight, Sparkles, Activity, Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';

export function Dashboard() {
    const { user } = useAuth();
    const { activeChild } = useFamily();

    const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Parent';

    return (
        <div className="pb-24 space-y-8">
            {/* Header / Welcome */}
            <header className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--giovanna-warmth-900)]">
                        Hi, {firstName}
                    </h1>
                    <p className="text-[var(--giovanna-warmth-700)]">
                        Command Center
                    </p>
                </div>
                {activeChild && (
                    <div className="bg-[var(--giovanna-warmth-200)] px-3 py-1 rounded-full text-sm font-bold text-[var(--giovanna-warmth-800)] flex items-center gap-2">
                        <Heart size={14} className="text-[var(--giovanna-terracotta)] fill-current" />
                        {activeChild.firstName}
                    </div>
                )}
            </header>

            {/* QUICK ACTIONS GRID - The "Click this to do that" input center */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="font-bold text-xl text-[var(--giovanna-warmth-900)]">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Log ABC */}
                    <Link to="/log" className="card-warm relative group hover:scale-[1.02] active:scale-95 transition-all p-5 h-40 flex flex-col justify-between border-l-4 border-l-[var(--giovanna-golden)]">
                        <div className="bg-white/50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Zap className="text-[var(--giovanna-golden-dark)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--giovanna-warmth-900)]">Log Behavior</h3>
                            <p className="text-xs text-[var(--giovanna-warmth-700)] leading-tight mt-1">
                                Track what you see.
                            </p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={20} />
                        </div>
                    </Link>

                    {/* Ask AI */}
                    <Link to="/chat" className="card-warm relative group hover:scale-[1.02] active:scale-95 transition-all p-5 h-40 flex flex-col justify-between border-l-4 border-l-[var(--giovanna-terracotta)]">
                        <div className="bg-white/50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <MessageCircle className="text-[var(--giovanna-terracotta)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--giovanna-warmth-900)]">Ask AI</h3>
                            <p className="text-xs text-[var(--giovanna-warmth-700)] leading-tight mt-1">
                                Get strategies now.
                            </p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={20} />
                        </div>
                    </Link>

                    {/* Homeplace Supports */}
                    <Link to="/homeplace" className="card-warm relative group hover:scale-[1.02] active:scale-95 transition-all p-5 h-40 flex flex-col justify-between border-l-4 border-l-[var(--giovanna-forest)]">
                        <div className="bg-white/50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <Activity className="text-[var(--giovanna-forest)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--giovanna-warmth-900)]">Supports</h3>
                            <p className="text-xs text-[var(--giovanna-warmth-700)] leading-tight mt-1">
                                Calming tools & safe spaces.
                            </p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={20} />
                        </div>
                    </Link>

                    {/* Share Packet */}
                    <Link to="/bridge" className="card-warm relative group hover:scale-[1.02] active:scale-95 transition-all p-5 h-40 flex flex-col justify-between border-l-4 border-l-[var(--giovanna-ocean)]">
                        <div className="bg-white/50 w-10 h-10 rounded-xl flex items-center justify-center">
                            <FileText className="text-[var(--giovanna-ocean)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-[var(--giovanna-warmth-900)]">PDF Report</h3>
                            <p className="text-xs text-[var(--giovanna-warmth-700)] leading-tight mt-1">
                                Share with schools.
                            </p>
                        </div>
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={20} />
                        </div>
                    </Link>
                </div>
            </section>

            {/* "Process & Receive" - Recent Activity or Suggestions */}
            <section>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h2 className="font-bold text-xl text-[var(--giovanna-warmth-900)] flex items-center gap-2">
                        <Sparkles size={18} className="text-[var(--giovanna-golden-dark)]" />
                        Insights for You
                    </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--giovanna-warmth-200)]">
                    <div className="flex items-start gap-4">
                        <div className="bg-[var(--giovanna-warmth-100)] p-3 rounded-full">
                            <Calendar className="text-[var(--giovanna-warmth-500)]" size={20} />
                        </div>
                        <div>
                            <p className="text-[var(--giovanna-warmth-900)] font-medium mb-1">
                                No logs today yet.
                            </p>
                            <p className="text-sm text-[var(--giovanna-warmth-600)] mb-4">
                                Tracking small moments helps us find big patterns. Did anything notable happen at breakfast?
                            </p>
                            <Link to="/log" className="text-sm font-bold text-[var(--giovanna-terracotta)] hover:underline">
                                + Add Quick Log
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Personal Support Plan Card */}
            <section>
                <div className="bg-gradient-to-br from-[var(--giovanna-ocean)] to-[var(--giovanna-ocean-dark)] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">Personal Support Plan</h3>
                        <p className="text-blue-100 text-sm mb-4 max-w-[80%]">
                            Build a strength-based profile to advocate for your child's needs.
                        </p>
                        <Link to="/profile" className="inline-block bg-white text-[var(--giovanna-ocean-dark)] px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">
                            Manage Profile
                        </Link>
                    </div>
                    {/* Decorative Background Icon */}
                    <FileText className="absolute -bottom-4 -right-4 text-white opacity-10" size={120} />
                </div>
            </section>
        </div>
    );
}
