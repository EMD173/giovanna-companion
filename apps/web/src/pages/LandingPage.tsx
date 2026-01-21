/**
 * Landing Page - Premium Redesign
 * 
 * Inspired by Finch + Notion: clean, modern, calming
 * Ocean/Teal palette with generous spacing
 */

import { ArrowRight, Shield, Heart, Sparkles, Star, Users, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="section text-center">
                <div className="container max-w-4xl">
                    {/* Trust Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-blue mb-8">
                        <Sparkles size={16} className="text-ocean" />
                        <span className="text-sm font-medium text-ocean-dark">
                            Trusted by 5,000+ families
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-charcoal">
                        Parenting with{' '}
                        <span className="gradient-text">Confidence</span>
                        <br />
                        Not Compliance.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ethical, privacy-first AI companion for parents of neurodivergent children.
                        Understand behaviors, find strategies, and advocate with schools.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup" className="btn btn-primary text-lg px-10 py-4">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            to="/learn"
                            className="btn btn-secondary text-lg px-10 py-4"
                        >
                            Browse Learning Hub
                        </Link>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-2 text-sm text-slate font-medium">
                            4.9/5 from 500+ reviews
                        </span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                        Built for <span className="gradient-text">real families</span>
                    </h2>
                    <p className="text-lg text-slate text-center max-w-2xl mx-auto mb-12">
                        Tools designed by parents, for parents. No surveillance, no judgment.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-soft-teal flex items-center justify-center mb-6">
                                <Heart size={28} className="text-teal" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                Neuro-Affirming
                            </h3>
                            <p className="text-slate leading-relaxed">
                                Move beyond "bad behavior" to understanding needs.
                                Built on respect, dignity, and presumed competence.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-soft-lavender flex items-center justify-center mb-6">
                                <Shield size={28} className="text-lavender" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                Privacy First
                            </h3>
                            <p className="text-slate leading-relaxed">
                                Your data stays yours. Share only what you choose
                                with schools via secure, revocable snapshots.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card">
                            <div className="w-14 h-14 rounded-2xl bg-soft-blue flex items-center justify-center mb-6">
                                <MessageCircle size={28} className="text-ocean" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                AI-Powered Support
                            </h3>
                            <p className="text-slate leading-relaxed">
                                Get instant help translating behaviors, drafting emails,
                                and preparing for IEP meetings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="section">
                <div className="container">
                    <div className="card-lavender text-center py-12 px-8">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Users size={32} className="text-lavender" />
                            <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
                                You're Not Alone
                            </h2>
                        </div>
                        <p className="text-lg text-slate max-w-2xl mx-auto mb-8">
                            Join thousands of parents who've found a better way to support
                            their neurodivergent children—without losing themselves in the process.
                        </p>
                        <Link to="/signup" className="btn btn-primary">
                            Join Our Community
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section bg-white">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        How Giovanna Helps
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-soft-teal flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-teal">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                Log Behaviors
                            </h3>
                            <p className="text-slate">
                                Quick ABC logging helps you spot patterns without the overwhelm.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-soft-lavender flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-lavender">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                Get Strategies
                            </h3>
                            <p className="text-slate">
                                AI-powered suggestions based on your child's unique needs.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-soft-blue flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-ocean">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-charcoal">
                                Share with Schools
                            </h3>
                            <p className="text-slate">
                                Create professional share packets for teachers and IEP teams.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section">
                <div className="container">
                    <div className="card text-center py-16 px-8" style={{
                        background: 'linear-gradient(135deg, var(--color-ocean) 0%, var(--color-teal) 100%)',
                    }}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to parent with confidence?
                        </h2>
                        <p className="text-xl text-white/90 max-w-xl mx-auto mb-8">
                            Start free. No credit card required.
                        </p>
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center gap-2 px-10 py-4 text-lg font-bold rounded-xl bg-white text-ocean hover:bg-cream transition"
                        >
                            Get Started Now
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
