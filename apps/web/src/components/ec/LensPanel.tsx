/**
 * Lens Panel Component
 * 
 * Side-by-side panel showing all 4 EC Lens Cards
 * or a filtered set based on context.
 */

import { LensCard } from './LensCard';
import { getLensCardsForContext, type LensContext } from '../../data/lensCards';
import { Sparkles } from 'lucide-react';

interface LensPanelProps {
    context: LensContext;
    compact?: boolean;
}

export function LensPanel({ context, compact = false }: LensPanelProps) {
    const cards = getLensCardsForContext(context);

    if (cards.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-amber-100 to-teal-100 rounded-lg">
                    <Sparkles size={18} className="text-slate-700" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Epigenetic Consciousness Lens</h3>
                    <p className="text-xs text-slate-500">Reflect on context beyond the behavior</p>
                </div>
            </div>

            {/* Cards Grid */}
            <div className={`${compact ? 'grid grid-cols-2 gap-2' : 'space-y-3'}`}>
                {cards.map(card => (
                    <LensCard key={card.id} card={card} compact={compact} />
                ))}
            </div>

            {/* Footer */}
            <p className="text-[10px] text-slate-400 mt-4 text-center">
                This lens adds context—it never replaces ABA guidance.
            </p>
        </div>
    );
}

/**
 * Mini Lens Indicator
 * Shows when EC Mode is on but full panel isn't visible
 */
export function ECModeIndicator() {
    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-amber-100 to-teal-100 rounded-full text-xs font-medium text-slate-700">
            <Sparkles size={12} />
            <span>EC Mode</span>
        </div>
    );
}
