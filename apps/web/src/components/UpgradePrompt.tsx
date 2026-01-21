/**
 * Upgrade Prompt Component
 * 
 * Shows "Coming Soon" when paidEnabled is false.
 * Shows pricing when enabled.
 */

import { useState, useEffect } from 'react';
import { Crown, Sparkles, Zap, Star, Bell } from 'lucide-react';
import { getAppConfig } from '../services/aiService';
import { TIER_INFO, type SubscriptionTier } from '../data/subscriptionTiers';

export function UpgradePrompt() {
    const [paidEnabled, setPaidEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAppConfig()
            .then(config => setPaidEnabled(config.paidEnabled))
            .catch(() => setPaidEnabled(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!paidEnabled) {
        return <ComingSoonPrompt />;
    }

    return <PricingTable />;
}

function ComingSoonPrompt() {
    const [email, setEmail] = useState('');
    const [joined, setJoined] = useState(false);

    const handleJoinWaitlist = () => {
        // TODO: Save to Firestore waitlist collection
        console.log('Joining waitlist:', email);
        setJoined(true);
    };

    return (
        <div className="bg-gradient-to-br from-teal-50 via-white to-amber-50 border border-teal-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown size={32} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Premium Features Coming Soon
            </h2>

            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Voice mode, unlimited AI conversations, priority support, and more.
                Join the waitlist to be first in line!
            </p>

            <div className="space-y-3 mb-6">
                <FeaturePreview icon={<Zap size={16} />} text="Unlimited AI conversations" />
                <FeaturePreview icon={<Sparkles size={16} />} text="Voice input & output" />
                <FeaturePreview icon={<Star size={16} />} text="Custom Personal Support Plans" />
                <FeaturePreview icon={<Bell size={16} />} text="Priority email support" />
            </div>

            {joined ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl">
                    <p className="font-medium">You're on the list!</p>
                    <p className="text-sm">We'll notify you when premium is available.</p>
                </div>
            ) : (
                <div className="flex gap-2 max-w-sm mx-auto">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                    <button
                        onClick={handleJoinWaitlist}
                        disabled={!email}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50"
                    >
                        Join Waitlist
                    </button>
                </div>
            )}
        </div>
    );
}

function FeaturePreview({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 text-slate-600 justify-center">
            <span className="text-teal-500">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function PricingTable() {
    const tiers: SubscriptionTier[] = ['free', 'companion', 'pro', 'enterprise'];

    return (
        <div className="grid md:grid-cols-4 gap-4">
            {tiers.map(tier => (
                <TierCard key={tier} tier={tier} />
            ))}
        </div>
    );
}

function TierCard({ tier }: { tier: SubscriptionTier }) {
    const info = TIER_INFO[tier];
    const isPopular = info.badge === 'POPULAR' || info.badge === 'BEST VALUE';

    return (
        <div className={`relative p-6 rounded-2xl border-2 ${isPopular
                ? 'border-teal-500 bg-gradient-to-b from-teal-50 to-white'
                : 'border-slate-200 bg-white'
            }`}>
            {info.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                    {info.badge}
                </div>
            )}

            <h3 className="font-bold text-lg text-slate-900 mb-2">{info.name}</h3>

            <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">
                    ${info.monthlyPrice}
                </span>
                <span className="text-slate-500">/mo</span>
            </div>

            <p className="text-sm text-slate-600 mb-4">{info.description}</p>

            <button
                className={`w-full py-3 rounded-xl font-bold ${tier === 'free'
                        ? 'bg-slate-100 text-slate-600'
                        : isPopular
                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
            >
                {info.cta}
            </button>
        </div>
    );
}

/**
 * Small inline upgrade prompt for feature limits
 */
export function InlineUpgradePrompt({ feature }: { feature: string }) {
    return (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
                <Crown size={20} className="text-amber-600" />
                <div>
                    <p className="font-medium text-slate-900">
                        {feature} limit reached
                    </p>
                    <p className="text-sm text-slate-600">
                        Premium coming soon with unlimited access!
                    </p>
                </div>
            </div>
        </div>
    );
}
