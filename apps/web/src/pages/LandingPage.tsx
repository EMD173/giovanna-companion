/**
 * Landing Page
 * 
 * Giovanna brand: warm, tactile, handmade aesthetic.
 * Digital homeplace feel.
 */

import { ArrowRight, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotAlonePanel } from '../components/NotAlonePanel';

export function LandingPage() {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section - Warm, inviting */}
            <section className="text-center space-y-6 pt-8 md:pt-16">
                {/* Decorative weave accent */}
                <div className="flex justify-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--giovanna-warmth-200)] border-2 border-dashed border-[var(--giovanna-warmth-400)]">
                        <Sparkles size={16} className="text-[var(--giovanna-golden-dark)]" />
                        <span className="text-sm font-medium text-[var(--giovanna-warmth-700)]">
                            A warm space for your family
                        </span>
                    </div>
                </div>

                <h1
                    className="text-4xl md:text-6xl font-extrabold tracking-tight"
                    style={{ color: 'var(--giovanna-warmth-900)' }}
                >
                    Parenting with{' '}
                    <span
                        className="relative inline-block"
                        style={{ color: 'var(--giovanna-terracotta)' }}
                    >
                        Confidence
                        <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                            <path d="M0,4 Q25,0 50,4 T100,4" fill="none" stroke="var(--giovanna-golden)" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </span>
                    , <br className="hidden md:block" />
                    Not Compliance.
                </h1>

                <p
                    className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    style={{ color: 'var(--giovanna-warmth-700)' }}
                >
                    The ethical, privacy-first companion for parents of neurodivergent children.
                    Understand behaviors, find strategies, and collaborate with schools—without the surveillance.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-white shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            background: 'linear-gradient(135deg, var(--giovanna-terracotta) 0%, #D65A47 100%)',
                            boxShadow: '0 8px 25px rgba(193, 65, 43, 0.35)'
                        }}
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 -mr-1" size={20} />
                    </Link>
                    <Link
                        to="/learn"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-2xl border-2 transition hover:-translate-y-1"
                        style={{
                            borderColor: 'var(--giovanna-warmth-400)',
                            color: 'var(--giovanna-warmth-800)',
                            background: 'var(--giovanna-warmth-50)'
                        }}
                    >
                        Browse Learning Hub
                    </Link>
                </div>
            </section>

            {/* Feature Grid - Card warm style */}
            <section className="grid md:grid-cols-3 gap-6 pt-8">
                {/* Neuro-Affirming */}
                <div
                    className="p-6 rounded-2xl card-warm relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, #F8F4ED 100%)' }}
                >
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, var(--giovanna-terracotta-light) 0%, var(--giovanna-terracotta) 100%)'
                        }}
                    >
                        <Heart size={26} className="text-white" />
                    </div>
                    <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--giovanna-warmth-900)' }}
                    >
                        Neuro-Affirming
                    </h3>
                    <p style={{ color: 'var(--giovanna-warmth-700)' }}>
                        Moved away from "bad behavior" to understanding needs. Built for dignity and respect.
                    </p>
                </div>

                {/* Privacy First */}
                <div
                    className="p-6 rounded-2xl card-warm relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, #F8F4ED 100%)' }}
                >
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, var(--giovanna-forest-light) 0%, var(--giovanna-forest) 100%)'
                        }}
                    >
                        <ShieldCheck size={26} className="text-white" />
                    </div>
                    <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--giovanna-warmth-900)' }}
                    >
                        Privacy First
                    </h3>
                    <p style={{ color: 'var(--giovanna-warmth-700)' }}>
                        You own your data. Share only what you choose with schools via secure, revocable snapshots.
                    </p>
                </div>

                {/* Actionable Tools */}
                <div
                    className="p-6 rounded-2xl card-warm relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, #F8F4ED 100%)' }}
                >
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-sm"
                        style={{
                            background: 'linear-gradient(135deg, var(--giovanna-golden-light) 0%, var(--giovanna-golden) 100%)'
                        }}
                    >
                        <Zap size={26} className="text-[var(--giovanna-warmth-800)]" />
                    </div>
                    <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: 'var(--giovanna-warmth-900)' }}
                    >
                        Actionable Tools
                    </h3>
                    <p style={{ color: 'var(--giovanna-warmth-700)' }}>
                        Quick ABC logging, pattern finding, and strategy cards that actually work in the moment.
                    </p>
                </div>
            </section>

            {/* Woven divider */}
            <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-0.5 gradient-weave rounded-full opacity-30"></div>
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: 'var(--giovanna-golden)' }}
                ></div>
                <div className="flex-1 h-0.5 gradient-weave rounded-full opacity-30"></div>
            </div>

            {/* Not Alone Panel */}
            <NotAlonePanel />
        </div>
    );
}
