import { ArrowRight, ShieldCheck, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-8 md:pt-16">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                    Parenting with <span className="text-teal-600">Confidence</span>, <br className="hidden md:block" />
                    Not Compliance.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    The ethical, privacy-first companion for parents of neurodivergent children.
                    Understand behaviors, find strategies, and collaborate with schools—without the surveillance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        to="/signup"
                        className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 shadow-md transform transition hover:-translate-y-0.5"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 -mr-1" size={20} />
                    </Link>
                    <Link
                        to="/learn"
                        className="inline-flex items-center justify-center px-8 py-3 border border-slate-300 text-base font-medium rounded-full text-slate-700 bg-white hover:bg-slate-50 shadow-sm"
                    >
                        Browse Learning Hub
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="grid md:grid-cols-3 gap-8 pt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                        <Heart size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Neuro-Affirming</h3>
                    <p className="text-slate-600">
                        Moved away from "bad behavior" to understanding needs. Built for dignity and respect.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Privacy First</h3>
                    <p className="text-slate-600">
                        You own your data. Share only what you choose with schools via secure, revocable snapshots.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Actionable Tools</h3>
                    <p className="text-slate-600">
                        Quick ABC logging, pattern finding, and strategy cards that actually work in the moment.
                    </p>
                </div>
            </section>
        </div>
    );
}
