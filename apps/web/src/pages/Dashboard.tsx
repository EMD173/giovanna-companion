/**
 * Dashboard - The Journey Hub
 * 
 * Ruth E. Carter-inspired command center.
 * Now with premium Afrofuturist custom icons.
 */

import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
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
                            <Sparkles size={16} className="text-[var(--gold-shimmer)]" />
                            {activeChild.firstName}
                        </div>
                    )}
                </div>
            </header>

            {/* Gold Divider */}
            <hr className="divider-gold" />

            {/* MAIN ACTIONS - Premium Icon Cards */}
            <section>
                <div className="grid grid-cols-2 gap-4">
                    {/* Capture Moments */}
                    <Link to="/log" className="card-regal group hover:shadow-xl transition-all p-5 h-52 flex flex-col justify-between relative overflow-hidden">
                        <img
                            src="/icons/capture.png"
                            alt="Capture"
                            className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">Capture</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Document the moments.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--gold-accent)] transition-colors" />
                    </Link>

                    {/* Oracle */}
                    <Link to="/chat" className="card-regal group hover:shadow-xl transition-all p-5 h-52 flex flex-col justify-between relative overflow-hidden">
                        <img
                            src="/icons/oracle.png"
                            alt="The Oracle"
                            className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">The Oracle</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Seek wisdom.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--regal-purple)] transition-colors" />
                    </Link>

                    {/* Sanctuary */}
                    <Link to="/homeplace" className="card-regal group hover:shadow-xl transition-all p-5 h-52 flex flex-col justify-between relative overflow-hidden">
                        <img
                            src="/icons/sanctuary.png"
                            alt="Sanctuary"
                            className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
                        />
                        <div>
                            <h3 className="font-heading font-bold text-xl text-[var(--deep-ebony)]">Sanctuary</h3>
                            <p className="text-sm text-[var(--warm-stone)] mt-1">
                                Safe spaces & tools.
                            </p>
                        </div>
                        <ChevronRight size={20} className="absolute top-4 right-4 text-[var(--soft-stone)] group-hover:text-[var(--earth-orange)] transition-colors" />
                    </Link>

                    {/* Advocacy */}
                    <Link to="/bridge" className="card-regal group hover:shadow-xl transition-all p-5 h-52 flex flex-col justify-between relative overflow-hidden">
                        <img
                            src="/icons/advocacy.png"
                            alt="Advocacy"
                            className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-110 transition-transform"
                        />
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
                                "You are not fighting twice as hard because you are failing. You are fighting twice as hard because the system was not built for you. Your advocacy is ancestral power in action."
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
