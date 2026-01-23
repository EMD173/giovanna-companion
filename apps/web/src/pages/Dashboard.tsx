/**
 * Adventure Hub Dashboard
 * 
 * The central player base. 
 * Gamified "Power Up" cards for quick actions.
 */

import { Link } from 'react-router-dom';
import {
    Zap, MessageCircle, FileText, Heart,
    ChevronRight, Sparkles, Map, Smile
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';

export function Dashboard() {
    const { user } = useAuth();
    const { activeChild } = useFamily();

    const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Captain';

    return (
        <div className="pb-32 space-y-8 px-4 pt-4">
            {/* Adventure Header */}
            <header className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-black text-[var(--color-navy)] mb-1">
                        Hi, {firstName}!
                    </h1>
                    <p className="text-[var(--text-muted)] font-bold text-lg">
                        Ready for today's adventure?
                    </p>
                </div>
                {activeChild && (
                    <div className="bg-white border-2 border-[var(--color-orange-light)] px-4 py-2 rounded-full font-bold text-[var(--color-navy)] flex items-center gap-2 shadow-sm">
                        <Smile size={20} className="text-[var(--color-orange)]" />
                        {activeChild.firstName}
                    </div>
                )}
            </header>

            {/* MAIN ACTIONS - "The Mission Types" */}
            <section>
                <div className="grid grid-cols-2 gap-4">
                    {/* Log = Capture Moment */}
                    <Link to="/log" className="card group p-5 h-44 flex flex-col justify-between border-b-8 border-b-[var(--color-orange)] hover:border-[var(--color-orange)] active:scale-95 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-orange-light)] flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Zap className="text-[var(--color-orange)] fill-current" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[var(--color-navy)]">Capture Moment</h3>
                            <p className="text-sm font-bold text-[var(--text-muted)] mt-1">
                                Log ABCs
                            </p>
                        </div>
                    </Link>

                    {/* Chat = Ask Sidekick */}
                    <Link to="/chat" className="card group p-5 h-44 flex flex-col justify-between border-b-8 border-b-purple-500 border-2 border-purple-100 hover:border-purple-500 active:scale-95 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:-rotate-12 transition-transform">
                            <MessageCircle className="text-purple-600 fill-current" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[var(--color-navy)]">Ask Sidekick</h3>
                            <p className="text-sm font-bold text-[var(--text-muted)] mt-1">
                                AI Strategies
                            </p>
                        </div>
                    </Link>

                    {/* Supports = Safe House */}
                    <Link to="/homeplace" className="card group p-5 h-44 flex flex-col justify-between border-b-8 border-b-green-500 border-2 border-green-100 hover:border-green-500 active:scale-95 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Heart className="text-green-600 fill-current" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[var(--color-navy)]">Safe House</h3>
                            <p className="text-sm font-bold text-[var(--text-muted)] mt-1">
                                Tools & Spaces
                            </p>
                        </div>
                    </Link>

                    {/* Report = Advocacy Map */}
                    <Link to="/bridge" className="card group p-5 h-44 flex flex-col justify-between border-b-8 border-b-blue-500 border-2 border-blue-100 hover:border-blue-500 active:scale-95 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                            <FileText className="text-blue-600 fill-current" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-black text-xl text-[var(--color-navy)]">Team Report</h3>
                            <p className="text-sm font-bold text-[var(--text-muted)] mt-1">
                                Share PDF
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Daily Quest / Insights */}
            <section>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Sparkles size={20} className="text-[var(--color-orange)]" />
                    <h2 className="font-black text-xl text-[var(--color-navy)]">
                        Daily Discovery
                    </h2>
                </div>

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border-2 border-[var(--color-orange-light)] relative overflow-hidden">
                    {/* Blob Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-orange-light)] rounded-full filter blur-2xl opacity-40 -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10">
                        <p className="text-[var(--color-navy)] font-bold text-lg mb-2">
                            The Adventure Begins!
                        </p>
                        <p className="text-[var(--text-muted)] font-medium mb-4 leading-relaxed">
                            Every behavior communicates a need. Try logging one small thing today to start your map.
                        </p>
                        <Link to="/log" className="inline-flex items-center gap-2 text-[var(--color-orange)] font-black uppercase tracking-wide text-sm hover:underline">
                            Start Tracking <ChevronRight size={16} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
