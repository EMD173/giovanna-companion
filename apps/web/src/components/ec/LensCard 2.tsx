/**
 * Lens Card Component
 * 
 * Displays a single EC Lens Card with:
 * - Reflection prompt
 * - Try this action
 * - Notice this reflection
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Cloud, Activity, Heart, Lightbulb, Eye } from 'lucide-react';
import { type LensCard as LensCardType, LENS_CATEGORIES } from '../../data/lensCards';

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
    Users, Cloud, Activity, Heart
};

interface LensCardProps {
    card: LensCardType;
    compact?: boolean;
}

export function LensCard({ card, compact = false }: LensCardProps) {
    const [expanded, setExpanded] = useState(false);
    const category = LENS_CATEGORIES[card.category];
    const IconComponent = ICONS[category.icon] || Heart;

    const colorClasses = {
        amber: 'bg-amber-50 border-amber-200 text-amber-900',
        sky: 'bg-sky-50 border-sky-200 text-sky-900',
        rose: 'bg-rose-50 border-rose-200 text-rose-900',
        teal: 'bg-teal-50 border-teal-200 text-teal-900'
    };

    const accentClasses = {
        amber: 'bg-amber-100 text-amber-700',
        sky: 'bg-sky-100 text-sky-700',
        rose: 'bg-rose-100 text-rose-700',
        teal: 'bg-teal-100 text-teal-700'
    };

    const baseColor = colorClasses[category.color as keyof typeof colorClasses] || colorClasses.teal;
    const accent = accentClasses[category.color as keyof typeof accentClasses] || accentClasses.teal;

    if (compact) {
        return (
            <div className={`rounded-lg border p-3 ${baseColor}`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                    <IconComponent size={16} />
                    <span>{category.title}</span>
                </div>
                <p className="text-xs mt-1 opacity-80">{card.reflectionPrompt}</p>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border-2 overflow-hidden ${baseColor}`}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${accent}`}>
                        <IconComponent size={20} />
                    </div>
                    <div className="text-left">
                        <span className="text-xs font-bold uppercase tracking-wide opacity-60">
                            {category.title}
                        </span>
                        <h3 className="font-semibold">{card.title}</h3>
                    </div>
                </div>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Content */}
            {expanded && (
                <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Reflection Prompt */}
                    <div className="p-3 bg-white/50 rounded-lg">
                        <p className="text-sm font-medium italic">"{card.reflectionPrompt}"</p>
                    </div>

                    {/* Try This */}
                    <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded ${accent}`}>
                            <Lightbulb size={14} />
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wide">Try This</span>
                            <p className="text-sm mt-0.5">{card.tryThis}</p>
                        </div>
                    </div>

                    {/* Notice This */}
                    <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded ${accent}`}>
                            <Eye size={14} />
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wide">Notice This</span>
                            <p className="text-sm mt-0.5">{card.noticeThis}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
