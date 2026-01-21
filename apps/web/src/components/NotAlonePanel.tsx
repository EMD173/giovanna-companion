/**
 * Not Alone Panel Component
 * 
 * Home screen panel showing parents they're not alone with stats and resources.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart, ExternalLink, Copy, Check, ChevronRight,
    Info, Users, BookOpen
} from 'lucide-react';
import { NOT_ALONE_CARDS, type NotAloneCard } from '../data/notAloneCards';
import { showToast } from './Toast';

export function NotAlonePanel() {
    const navigate = useNavigate();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Show first two cards (prevalence and mental health)
    const featuredCards = NOT_ALONE_CARDS.slice(0, 2);

    const handleAction = async (card: NotAloneCard) => {
        if (card.supportiveAction.type === 'link') {
            window.open(card.supportiveAction.content, '_blank');
        } else if (card.supportiveAction.type === 'navigate') {
            navigate(card.supportiveAction.content);
        } else if (card.supportiveAction.type === 'copy') {
            await navigator.clipboard.writeText(card.supportiveAction.content);
            setCopiedId(card.id);
            showToast('Copied to clipboard!', 'success');
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    return (
        <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border border-rose-200 rounded-2xl p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                    <Heart className="text-rose-600" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">You Are Not Alone</h2>
                    <p className="text-sm text-slate-600">Millions of families are on this journey with you.</p>
                </div>
            </div>

            {/* Featured Stats */}
            <div className="space-y-3">
                {featuredCards.map(card => (
                    <div
                        key={card.id}
                        className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white"
                    >
                        <p className="text-slate-800 font-medium leading-relaxed">
                            {card.statText}
                        </p>

                        {/* Source & Caveat */}
                        <div className="mt-3 space-y-2">
                            <a
                                href={card.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-teal-700 hover:underline"
                            >
                                <BookOpen size={12} />
                                {card.sourceName}
                                <ExternalLink size={10} />
                            </a>

                            <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                                <Info size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
                                <span>{card.caveat}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => handleAction(card)}
                            className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-700 hover:text-rose-800"
                        >
                            {card.supportiveAction.type === 'copy' ? (
                                copiedId === card.id ? (
                                    <>
                                        <Check size={16} /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} /> {card.supportiveAction.label}
                                    </>
                                )
                            ) : (
                                <>
                                    <ChevronRight size={16} /> {card.supportiveAction.label}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => navigate('/resources')}
                    className="flex items-center justify-center gap-2 p-3 bg-white border border-rose-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-rose-50"
                >
                    <Users size={18} className="text-rose-500" />
                    Find Support
                </button>
                <button
                    onClick={() => {
                        const script = `Dear [Teacher/Family Member],

I wanted to share some context about [child's name]. They experience the world in a unique way, and I'm learning how to best support them.

What helps:
• Extra processing time for instructions
• Sensory breaks when overwhelmed
• Celebrating their interests and strengths

I'd appreciate your partnership in understanding rather than changing who they are.

Thank you for being part of our village.`;
                        navigator.clipboard.writeText(script);
                        showToast('Script copied to clipboard!', 'success');
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-white border border-rose-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-rose-50"
                >
                    <Copy size={18} className="text-amber-500" />
                    Copy Script
                </button>
            </div>
        </div>
    );
}
