/**
 * Landing Page - "Playful Adventure"
 * 
 * Gamified, supportive, and energetic.
 * Navy basics + Orange actions + "Blob" decorations.
 */

import { ArrowRight, Shield, Heart, Sparkles, Star, Zap, MessageCircle, Smile } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* Background Decor - Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-orange-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse blob-shape translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-sky)] rounded-full mix-blend-multiply filter blur-3xl opacity-50 blob-shape -translate-x-1/2 translate-y-1/2"></div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 text-center z-10">
                <div className="container max-w-4xl px-4">
                    {/* Achievement Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[var(--color-orange-light)] mb-8 shadow-sm transform hover:scale-105 transition-transform cursor-default">
                        <Star size={20} className="text-[var(--color-orange)] fill-current" />
                        <span className="font-bold text-[var(--color-navy)] tracking-wide uppercase text-xs">
                            Trusted by 5,000+ Super Parents
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Turn Struggles into
                        <br />
                        <span className="text-[var(--color-orange)] inline-block transform -rotate-2 decoration-wavy underline decoration-[var(--color-sky)]">Strengths!</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Your neuro-affirming partner for the parenting adventure.
                        Log moments, unlock strategies, and level up your advocacy.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/signup" className="btn btn-primary text-xl px-12 py-5 shadow-xl">
                            Start Your Adventure
                            <ArrowRight size={24} className="ml-2" />
                        </Link>
                        <Link
                            to="/learn"
                            className="btn btn-secondary text-lg px-8 py-4"
                        >
                            View the Map
                        </Link>
                    </div>

                    {/* Social Proof with Friendly Avatars */}
                    <div className="flex items-center justify-center gap-3 mt-10 p-4 bg-white/60 backdrop-blur rounded-2xl inline-flex border border-[var(--color-navy-light)]/10">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                                    <Smile size={20} />
                                </div>
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="flex text-[var(--color-orange)]">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-xs font-bold text-[var(--color-navy)]">
                                4.9/5 Rating
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards - "Power Ups" */}
            <section className="py-20 bg-white relative">
                {/* Wavy Top Border via SVG or CSS could go here, keeping it simple for now */}
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black mb-4">Choose Your Power Up</h2>
                        <p className="text-xl text-[var(--text-muted)]">Tools designed to make every day easier.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="card group">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-orange-light)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={32} className="text-[var(--color-orange)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Quick Capture</h3>
                            <p className="text-[var(--text-muted)] font-medium leading-relaxed mb-6">
                                Spot patterns like a detective. Log "moments" (ABCs) in seconds to understand the 'why' behind behaviors.
                            </p>
                            <Link to="/log" className="font-bold text-[var(--color-navy)] flex items-center gap-2 hover:gap-3 transition-all">
                                Try Logging <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Card 2 */}
                        <div className="card group">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-lavender)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MessageCircle size={32} className="text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Sidekick AI</h3>
                            <p className="text-[var(--text-muted)] font-medium leading-relaxed mb-6">
                                Stuck? Ask Giovanna. Get instant, neuro-affirming scripts and strategies for any situation.
                            </p>
                            <Link to="/chat" className="font-bold text-[var(--color-navy)] flex items-center gap-2 hover:gap-3 transition-all">
                                Chat Now <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Card 3 */}
                        <div className="card group">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-mint)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Advocacy Shield</h3>
                            <p className="text-[var(--text-muted)] font-medium leading-relaxed mb-6">
                                Create professional PDF reports to share with schools. Advocate with data, not just feelings.
                            </p>
                            <Link to="/bridge" className="font-bold text-[var(--color-navy)] flex items-center gap-2 hover:gap-3 transition-all">
                                Create Report <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 text-center">
                <div className="container max-w-3xl">
                    <div className="bg-[var(--color-navy)] rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-orange)] rounded-full filter blur-[80px] opacity-30"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px] opacity-30"></div>

                        <div className="relative z-10">
                            <h2 className="text-white text-3xl md:text-5xl font-black mb-6">
                                Ready to Level Up?
                            </h2>
                            <p className="text-blue-100 text-xl font-medium mb-10">
                                Join 5,000+ families turning daily challenges into wins.
                            </p>
                            <Link
                                to="/signup"
                                className="btn btn-primary text-xl px-16 py-6 border-4 border-white/10"
                            >
                                Get Started Free!
                            </Link>
                            <p className="mt-6 text-blue-200 text-sm font-bold opacity-80">
                                NO CREDIT CARD REQUIRED
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
