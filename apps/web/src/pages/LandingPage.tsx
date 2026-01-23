/**
 * Landing Page - Warm Redesign
 * 
 * Tactile, "Homeplace" feel with clear app functionality.
 * Warm terracotta, gold, and forest green accents.
 */

import { ArrowRight, Shield, Heart, Sparkles, Star, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-12 md:py-20 text-center">
                <div className="container max-w-4xl">
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--giovanna-warmth-200)] border border-[var(--giovanna-warmth-300)] mb-8 shadow-sm">
                        <Sparkles size={16} className="text-[var(--giovanna-golden-dark)]" />
                        <span className="text-sm font-bold text-[var(--giovanna-warmth-800)]">
                            Trusted by 5,000+ families
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[var(--giovanna-warmth-900)]">
                        Parenting with{' '}
                        <span className="gradient-text">Confidence</span>,
                        <br />
                        Not Compliance.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-[var(--giovanna-warmth-700)] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Your daily command center for neurodivergent parenting.
                        <br className="hidden md:block" />
                        Log behaviors, get AI strategies, and advocate with data.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                            Start Your Dashboard
                            <ArrowRight size={20} className="ml-2" />
                        </Link>
                        <Link
                            to="/learn"
                            className="btn btn-secondary text-lg px-10 py-4"
                        >
                            Explore Strategies
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} className="fill-[var(--giovanna-golden)] text-[var(--giovanna-golden)]" />
                        ))}
                        <span className="ml-2 text-sm text-[var(--giovanna-warmth-800)] font-bold">
                            4.9/5 from 500+ reviews
                        </span>
                    </div>
                </div>
            </section>

            {/* Application Features Grid - "Dashboard Preview" */}
            <section className="py-16 md:py-24 bg-white border-y border-[var(--giovanna-warmth-200)]">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        What you can do <span className="text-[var(--giovanna-terracotta)]">right now</span>
                    </h2>
                    <p className="text-lg text-[var(--giovanna-warmth-700)] text-center max-w-2xl mx-auto mb-12">
                        Powerful tools wrapped in a warm, supportive interface.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--giovanna-warmth-100)] border border-[var(--giovanna-warmth-200)] flex items-center justify-center mb-6">
                                <Zap size={28} className="text-[var(--giovanna-golden-dark)]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Quick Log Behaviors
                            </h3>
                            <p className="text-[var(--giovanna-warmth-700)] mb-4">
                                Spot patterns instantly. Log Antecedents, Behaviors, and Consequences (ABC) in seconds.
                            </p>
                            <Link to="/log" className="text-[var(--giovanna-terracotta)] font-bold text-sm hover:underline">Try Logging →</Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--giovanna-warmth-100)] border border-[var(--giovanna-warmth-200)] flex items-center justify-center mb-6">
                                <MessageCircle size={28} className="text-[var(--giovanna-terracotta)]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Ask Giovanna AI
                            </h3>
                            <p className="text-[var(--giovanna-warmth-700)] mb-4">
                                "My child is screaming at bath time. What do I do?" Get instant, neuro-affirming advice.
                            </p>
                            <Link to="/chat" className="text-[var(--giovanna-terracotta)] font-bold text-sm hover:underline">Start Chat →</Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--giovanna-warmth-100)] border border-[var(--giovanna-warmth-200)] flex items-center justify-center mb-6">
                                <Shield size={28} className="text-[var(--giovanna-forest)]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Share Securely
                            </h3>
                            <p className="text-[var(--giovanna-warmth-700)] mb-4">
                                Generate professional PDF reports for IEP meetings. You control who sees what.
                            </p>
                            <Link to="/bridge" className="text-[var(--giovanna-terracotta)] font-bold text-sm hover:underline">Create Report →</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Step-by-Step */}
            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="card-warm p-8 md:p-12 rounded-[2rem] text-center max-w-5xl mx-auto shadow-lg border border-[var(--giovanna-warmth-300)]">
                        <h2 className="text-3xl md:text-4xl font-bold mb-8">
                            Your Daily Flow
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--giovanna-terracotta)] text-white flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Input</h4>
                                    <p className="text-[var(--giovanna-warmth-800)] text-sm">Tap to log what you see. "Child is overwhelmed by loud noises."</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--giovanna-golden)] text-white flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Process</h4>
                                    <p className="text-[var(--giovanna-warmth-800)] text-sm">AI analyzes the input against neuro-affirming strategies.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--giovanna-forest)] text-white flex items-center justify-center font-bold">3</div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Receive</h4>
                                    <p className="text-[var(--giovanna-warmth-800)] text-sm">Get immediate, actionable suggestions: "Try noise-canceling headphones."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pb-24">
                <div className="container text-center">
                    <p className="text-xl font-bold text-[var(--giovanna-warmth-700)] mb-6">
                        Ready to support your child with confidence?
                    </p>
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center gap-2 px-12 py-5 text-xl font-bold rounded-xl bg-[var(--giovanna-terracotta)] text-white hover:bg-[#D65A47] transition shadow-xl"
                    >
                        Create Free Account
                        <ArrowRight size={24} />
                    </Link>
                    <p className="mt-4 text-sm text-[var(--giovanna-warmth-600)]">
                        No credit card required • Private & Secure
                    </p>
                </div>
            </section>
        </div>
    );
}
