/**
 * Landing Page - Ruth E. Carter Inspired
 * 
 * Regal, powerful, ancestrally grounded.
 * Now with premium Afrofuturist custom icons.
 */

import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 text-center px-4">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--regal-purple)]/5 to-transparent -z-10"></div>

                <div className="max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--parchment)] mb-8 shadow-sm">
                        <Star size={16} className="text-[var(--gold-accent)] fill-current" />
                        <span className="font-semibold text-[var(--deep-ebony)] text-sm tracking-wide">
                            Trusted by 5,000+ Families
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-heading text-5xl md:text-6xl font-bold text-[var(--deep-ebony)] mb-6 leading-tight">
                        Parenting with
                        <br />
                        <span className="text-[var(--regal-purple)]">Wisdom</span>, Not Worry.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl text-[var(--warm-stone)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        A neuro-affirming companion that understands your journey.
                        Culturally-responsive strategies, advocacy tools, and a community that truly gets it.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/signup" className="btn-regal btn-purple text-lg px-8 py-4">
                            Begin Your Journey
                            <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link
                            to="/learn"
                            className="btn-regal text-lg px-8 py-4 bg-white border-2 border-[var(--deep-ebony)] text-[var(--deep-ebony)] hover:bg-[var(--parchment)]"
                        >
                            Explore the Path
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gold Divider */}
            <hr className="divider-gold max-w-xl mx-auto" />

            {/* Feature Cards with Premium Icons */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl font-bold text-[var(--deep-ebony)] mb-4">
                            Tools for the Journey
                        </h2>
                        <p className="text-lg text-[var(--warm-stone)]">
                            Powerful, dignified, designed for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 - Capture */}
                        <div className="card-regal group text-center">
                            <img
                                src="/icons/capture.png"
                                alt="Capture Moments"
                                className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all"
                            />
                            <h3 className="font-heading text-2xl font-bold mb-3 text-[var(--deep-ebony)]">Capture Moments</h3>
                            <p className="text-[var(--warm-stone)] leading-relaxed mb-6">
                                Document behaviors with intention. Our ABC framework transforms scattered notes into revealing patterns.
                            </p>
                            <Link to="/log" className="font-semibold text-[var(--regal-purple)] flex items-center gap-2 justify-center hover:gap-3 transition-all">
                                Start Capturing <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Card 2 - Oracle */}
                        <div className="card-regal group text-center">
                            <img
                                src="/icons/oracle.png"
                                alt="The Oracle"
                                className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all"
                            />
                            <h3 className="font-heading text-2xl font-bold mb-3 text-[var(--deep-ebony)]">Consult The Oracle</h3>
                            <p className="text-[var(--warm-stone)] leading-relaxed mb-6">
                                Receive neuro-affirming strategies in the moment. AI wisdom grounded in research and respect.
                            </p>
                            <Link to="/chat" className="font-semibold text-[var(--regal-purple)] flex items-center gap-2 justify-center hover:gap-3 transition-all">
                                Seek Wisdom <ArrowRight size={18} />
                            </Link>
                        </div>

                        {/* Card 3 - Advocacy */}
                        <div className="card-regal group text-center">
                            <img
                                src="/icons/advocacy.png"
                                alt="Advocacy"
                                className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all"
                            />
                            <h3 className="font-heading text-2xl font-bold mb-3 text-[var(--deep-ebony)]">Advocate with Power</h3>
                            <p className="text-[var(--warm-stone)] leading-relaxed mb-6">
                                Generate professional reports for schools and providers. Your data becomes your shield.
                            </p>
                            <Link to="/bridge" className="font-semibold text-[var(--regal-purple)] flex items-center gap-2 justify-center hover:gap-3 transition-all">
                                Create Report <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-br from-[var(--deep-ebony)] to-[var(--charcoal)] rounded-2xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        {/* Decorative accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--regal-purple)] via-[var(--gold-accent)] to-[var(--warrior-red)]"></div>

                        <Sparkles size={40} className="text-[var(--gold-shimmer)] mx-auto mb-6" />

                        <h2 className="font-heading text-white text-3xl md:text-4xl font-bold mb-6">
                            Your Journey Awaits
                        </h2>
                        <p className="text-[var(--soft-stone)] text-lg mb-10 leading-relaxed">
                            Join thousands of families finding strength in understanding.
                        </p>
                        <Link
                            to="/signup"
                            className="btn-regal btn-gold text-lg px-12 py-5"
                        >
                            Begin Free
                        </Link>
                        <p className="mt-6 text-[var(--soft-stone)] text-sm font-medium">
                            No credit card required.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
