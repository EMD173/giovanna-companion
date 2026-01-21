/**
 * Media Library Page
 * 
 * Browsable library of curated videos, guides, and resources
 * for the Epigenetic Consciousness layer.
 */

import { useState, useMemo } from 'react';
import {
    Video, FileText, Palette, Filter, Search,
    ExternalLink, BookOpen, Heart
} from 'lucide-react';
import { useECMode } from '../contexts/ECModeContext';
import { initialMediaItems, getMediaByType, type MediaItem, type MediaType } from '../data/mediaItems';

export function MediaLibraryPage() {
    const { enabled: ecMode } = useECMode();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Get approved items only
    const approvedItems = useMemo(() =>
        initialMediaItems.filter((item: MediaItem) => item.approvalStatus === 'approved'),
        []
    );

    // Filter items
    const filteredItems = useMemo(() => {
        let items = selectedType === 'all'
            ? approvedItems
            : getMediaByType(selectedType).filter(i => i.approvalStatus === 'approved');

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.tags.some(t => t.toLowerCase().includes(query))
            );
        }

        if (selectedTags.length > 0) {
            items = items.filter(item =>
                selectedTags.some(tag => item.tags.includes(tag))
            );
        }

        return items;
    }, [approvedItems, selectedType, searchQuery, selectedTags]);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        approvedItems.forEach(item => item.tags.forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [approvedItems]);

    const typeFilters: Array<{ value: MediaType | 'all'; label: string; icon: React.ReactNode }> = [
        { value: 'all', label: 'All', icon: <BookOpen size={16} /> },
        { value: 'video', label: 'Videos', icon: <Video size={16} /> },
        { value: 'infographic', label: 'Guides', icon: <FileText size={16} /> },
        { value: 'art-prompt', label: 'Art', icon: <Palette size={16} /> }
    ];

    if (!ecMode) {
        return (
            <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700 mb-2">Media Library</h2>
                <p className="text-slate-500 mb-4">Enable EC Mode in Settings to access curated resources.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
                <p className="text-slate-500">Curated resources for understanding and support</p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl"
                />
            </div>

            {/* Type Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {typeFilters.map(({ value, label, icon }) => (
                    <button
                        key={value}
                        onClick={() => setSelectedType(value)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedType === value
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                    <Filter size={14} />
                    Tags:
                </span>
                {allTags.slice(0, 8).map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTags(prev =>
                            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        )}
                        className={`px-3 py-1 text-xs rounded-full ${selectedTags.includes(tag)
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-slate-100 text-slate-600'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-3">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <p className="text-slate-500">No resources match your search</p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <MediaCard key={item.id} item={item} />
                    ))
                )}
            </div>
        </div>
    );
}

function MediaCard({ item }: { item: MediaItem }) {
    const typeIcons = {
        video: <Video size={16} />,
        infographic: <FileText size={16} />,
        guide: <BookOpen size={16} />,
        'art-prompt': <Palette size={16} />
    };

    const typeColors = {
        video: 'bg-red-100 text-red-700',
        infographic: 'bg-blue-100 text-blue-700',
        guide: 'bg-green-100 text-green-700',
        'art-prompt': 'bg-purple-100 text-purple-700'
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColors[item.type]}`}>
                    {typeIcons[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-teal-500 shrink-0"
                            >
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
