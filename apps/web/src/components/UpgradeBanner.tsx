/**
 * Upgrade Banner Component
 * 
 * Shows when user is approaching tier limits.
 * Designed to be helpful, not pushy.
 */

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { TIER_INFO } from '../data/subscriptionTiers';

export function UpgradeBanner() {
    const { shouldShowUpgrade, tier, getRemainingAIQueries } = useSubscription();
    const [dismissed, setDismissed] = useState(false);

    if (!shouldShowUpgrade() || dismissed || tier !== 'free') return null;

    const remaining = getRemainingAIQueries();
    const proInfo = TIER_INFO.pro;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-200 rounded-xl p-4 relative">
            <button
                onClick={() => setDismissed(true)}
                className="absolute top-2 right-2 p-1 text-amber-600 hover:text-amber-800"
            >
                <X size={16} />
            </button>

            <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-teal-100 rounded-lg">
                    <Sparkles size={20} className="text-amber-700" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Running Low on AI Queries</h3>
                    <p className="text-sm text-slate-600 mt-1">
                        You have <strong>{remaining}</strong> AI queries left this month.
                        Upgrade to {proInfo.name} for 10x more.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all">
                        Upgrade to Pro — {proInfo.price}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Usage Indicator (for Settings/Dashboard)
 */
export function UsageIndicator() {
    const { subscription, tier, getRemainingAIQueries } = useSubscription();

    if (!subscription) return null;

    const remaining = getRemainingAIQueries();
    const used = subscription.usage.aiQueriesUsed;
    const isUnlimited = remaining === 'unlimited';

    // Calculate percentage for progress bar
    const limit = isUnlimited ? 100 : (used + (remaining as number));
    const percentage = isUnlimited ? 0 : Math.round((used / limit) * 100);

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">AI Queries This Month</span>
                <span className="text-sm text-slate-500">
                    {isUnlimited ? 'Unlimited' : `${used} / ${limit}`}
                </span>
            </div>

            {!isUnlimited && (
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percentage > 80 ? 'bg-red-500' :
                                percentage > 50 ? 'bg-amber-500' : 'bg-teal-500'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            )}

            <p className="text-xs text-slate-400 mt-2">
                {tier === 'free' ? 'Free tier resets monthly' : `${TIER_INFO[tier].name} tier`}
            </p>
        </div>
    );
}

/**
 * Tier Badge (for display in UI)
 */
export function TierBadge() {
    const { tier } = useSubscription();
    const info = TIER_INFO[tier];

    const colors = {
        free: 'bg-slate-100 text-slate-600',
        pro: 'bg-gradient-to-r from-amber-100 to-teal-100 text-amber-700',
        enterprise: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
    };

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors[tier]}`}>
            {info.name}
        </span>
    );
}
