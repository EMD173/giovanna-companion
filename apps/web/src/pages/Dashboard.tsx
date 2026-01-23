/**
 * Dashboard - The Journey Hub
 * 
 * Ruth E. Carter-inspired command center.
 * Regal, powerful, ancestrally grounded.
 */

import { Link } from 'react-router-dom';
import {
    Zap, MessageCircle, FileText, Heart,
    ChevronRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';

export function Dashboard() {
    const { user } = useAuth();
    const { activeChild } = useFamily();

    const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Honored One';

    return (
        <div className="pb-32 space-y-8 px-4 pt-6">
            {/* Header - Dignified Welcome */}
            <header className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="font-heading text-3xl font-bold text-[var(--deep-ebony)] mb-1">
                            Welcome, {firstName}
                        </h1>
                        <p className="text-[var(--warm-stone)] font-medium">
                            Your journey continues here.
                        </p>
                    </div>
                    {activeChild && (
                        <div className="bg-gradient-to-r from-[var(--regal-purple)] to-[var(--regal-purple-dark)] px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 shadow-md">
                            <Heart size={16} className="text-[var(--gold-shimmer)] fill-current" />
                            {activeChild.firstName}
                        </div>
                    )}
                </div>
            </header>

            {/* Gold Divider */}
            <hr className="divider-gold" />

            {/* MAIN ACTIONS - Regal Cards */}
            <section>
                <div className="grid grid-cols-2 gap-4">
                    {/* Log Moments */}
                    <Link to="/log" className="card-regal group hover:shadow-lg transition-all p-5 h-44 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-shimmer)] flex items-center justify-center shadow-md">
                            <Zap className="text-[var(--deep-ebony)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">Capture</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Document the moments.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--gold-accent)] transition-colors" />
                    </Link>

                    {/* Oracle */}
                    <Link to="/chat" className="card-regal group hover:shadow-lg transition-all p-5 h-44 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--regal-purple)] to-[var(--regal-purple-dark)] flex items-center justify-center shadow-md">
                            <MessageCircle className="text-[var(--gold-shimmer)]" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">The Oracle</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Seek wisdom.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--regal-purple)] transition-colors" />
                    </Link>

                    {/* Supports */}
                    <Link to="/homeplace" className="card-regal group hover:shadow-lg transition-all p-5 h-44 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-lg bg-[var(--earth-orange)] flex items-center justify-center shadow-md">
                            <Heart className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">Sanctuary</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Safe spaces & tools.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--earth-orange)] transition-colors" />
                    </Link>

                    {/* Report */}
                    <Link to="/bridge" className="card-regal group hover:shadow-lg transition-all p-5 h-44 flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-lg bg-[var(--warrior-red)] flex items-center justify-center shadow-md">
                            <FileText className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">Advocacy</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Share with power.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--warrior-red)] transition-colors" />
                    </Link>
                </div>
            </section>

            {/* Insight Card - Ancestral Wisdom */}
            <section>
                <div className="card-regal">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[var(--parchment)] flex items-center justify-center flex-shrink-0">
                            <Sparkles size={24} className="text-[var(--gold-accent)]" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-lg text-[var(--deep-ebony)] mb-2">
                                Today's Wisdom
                            </h3>
                            <p className="text-[var(--warm-stone)] leading-relaxed mb-4">
                                "Behavior is the language of the unspoken need. Listen not with judgment, but with the heart of an ancestor who has seen a thousand struggles become a thousand strengths."
                            </p>
                            <Link to="/log" className="text-sm font-semibold text-[var(--regal-purple)] hover:text-[var(--regal-purple-light)] flex items-center gap-2 transition-colors">
                                Begin Today's Capture <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
