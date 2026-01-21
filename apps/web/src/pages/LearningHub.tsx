import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, ChevronDown, Share2, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { initialContent, type ContentItem } from '../data/learningContent';
import { cn } from '../lib/utils';
import { GiovannaChat } from '../components/GiovannaChat';
import { useECMode } from '../contexts/ECModeContext';
import { LensPanel } from '../components/ec/LensPanel';
import { ECModeIndicator } from '../components/ec/LensPanel';

export function LearningHub() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { enabled: ecModeEnabled } = useECMode();

    // Configure Fuse search
    const fuse = useMemo(() => new Fuse(initialContent, {
        keys: ['title', 'summary', 'definition', 'category'],
        threshold: 0.3,
    }), []);

    const filteredContent = useMemo(() => {
        if (!searchTerm) return initialContent;
        return fuse.search(searchTerm).map(result => result.item);
    }, [searchTerm, fuse]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header & Search */}
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Learning Hub</h1>
                <p className="text-slate-600">Trusted, neuro-affirming resources for you and your school team.</p>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm shadow-sm transition-shadow"
                        placeholder="Search topics (e.g., 'stimming', 'meltdown')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* AI Helper */}
            <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
                <div className="p-2 bg-teal-100 rounded-lg text-teal-700">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-teal-900">Ask Giovanna AI</h3>
                    <p className="text-sm text-teal-700 mt-1">
                        Need help explaining this to a teacher? Try: <br />
                        <span className="italic">"How do I explain that my child needs sensory breaks, not punishment?"</span>
                    </p>
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="mt-2 text-xs font-bold text-teal-700 uppercase tracking-wide hover:underline"
                    >
                        Start Chat →
                    </button>
                </div>
            </div>

            {/* EC Mode Lens Panel */}
            {ecModeEnabled && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <ECModeIndicator />
                        <span className="text-xs text-slate-500">Reflection prompts enabled</span>
                    </div>
                    <LensPanel context="learning" compact />
                </div>
            )}

            {/* Content Grid */}
            <div className="space-y-4">
                {filteredContent.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <p>No topics found for "{searchTerm}".</p>
                    </div>
                )}

                {filteredContent.map((item) => (
                    <TopicCard
                        key={item.id}
                        item={item}
                        isExpanded={expandedId === item.id}
                        onToggle={() => toggleExpand(item.id)}
                    />
                ))}
            </div>

            {/* Giovanna AI Chat */}
            <GiovannaChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
}

function TopicCard({ item, isExpanded, onToggle }: { item: ContentItem; isExpanded: boolean; onToggle: () => void }) {
    return (
        <div className={cn(
            "bg-white rounded-xl border transition-all duration-200 overflow-hidden",
            isExpanded ? "border-teal-200 shadow-md ring-1 ring-teal-100" : "border-slate-200 shadow-sm hover:border-teal-200"
        )}>
            {/* Card Header (Always Visible) */}
            <button
                onClick={onToggle}
                className="w-full text-left px-5 py-4 focus:outline-none"
            >
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full",
                                item.category === 'Regulation' && "bg-blue-100 text-blue-700",
                                item.category === 'Behavior' && "bg-rose-100 text-rose-700",
                                item.category === 'Communication' && "bg-amber-100 text-amber-700",
                            )}>
                                {item.category}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{item.summary}</p>
                    </div>
                    <div className={cn("mt-1 text-gray-400 transition-transform", isExpanded && "rotate-180")}>
                        <ChevronDown size={20} />
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 space-y-6 border-t border-slate-100 pt-4 bg-slate-50/50">

                    {/* Definition */}
                    <section>
                        <h4 className="flex items-center gap-2 font-bold text-teal-900 mb-2 text-sm uppercase tracking-wide">
                            <BookOpen size={16} /> What is it?
                        </h4>
                        <p className="text-slate-700 text-sm leading-relaxed">{item.definition}</p>
                        <p className="text-slate-600 text-sm mt-2 italic border-l-2 border-teal-200 pl-3">"{item.whyItHappens}"</p>
                    </section>

                    {/* Strategies Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                            <h4 className="font-bold text-green-800 mb-2 text-sm">✅ What to Try</h4>
                            <ul className="space-y-2">
                                {item.whatToTry.map((tip, i) => (
                                    <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                            <h4 className="font-bold text-red-800 mb-2 text-sm">🛑 What to Avoid</h4>
                            <ul className="space-y-2">
                                {item.whatToAvoid.map((tip, i) => (
                                    <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                        <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* School Bridge Card */}
                    <div className="bg-white border-2 border-indigo-100 rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-5">
                            <Share2 size={80} />
                        </div>
                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <Share2 size={16} /> School Bridge Script
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">Copy this language for your IEP meeting or teacher email:</p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm italic">
                            "{item.whatToShare}"
                        </div>
                        <button className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-800">
                            Generate Share Packet <Search size={12} className="opacity-0" /> {/* Spacer */}
                        </button>
                    </div>

                    {/* Citations */}
                    <div className="pt-2 border-t border-slate-200">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Research & Evidence</h5>
                        <ul className="space-y-1">
                            {item.citations.map((cite, idx) => (
                                <li key={idx} className="text-xs text-slate-400 flex items-start gap-1">
                                    • {cite.text}
                                    {cite.link && (
                                        <a href={cite.link} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline inline-flex items-center ml-1">
                                            Link <ExternalLink size={10} className="ml-0.5" />
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
}
