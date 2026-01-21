/**
 * Child Timeline Component
 * 
 * Longitudinal view of child's journey with milestones,
 * school history, therapy changes, and wins.
 */

import { useState } from 'react';
import { useActiveChild } from '../contexts/FamilyContext';
import {
    Clock, Plus, Star, School, Activity, Heart,
    ChevronDown, ChevronUp, Calendar
} from 'lucide-react';
import { type Milestone } from '../data/familyProfile';

interface TimelineProps {
    limit?: number;
    showAdd?: boolean;
}

export function ChildTimeline({ limit, showAdd = true }: TimelineProps) {
    const { child, update } = useActiveChild();
    const [showAll, setShowAll] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    if (!child) return null;

    const milestones = [...(child.milestones || [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const displayMilestones = limit && !showAll
        ? milestones.slice(0, limit)
        : milestones;

    const addMilestone = async (milestone: Milestone) => {
        await update({
            milestones: [...(child.milestones || []), milestone]
        });
        setShowAddForm(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-slate-500" />
                    <h3 className="font-bold text-slate-900">Journey Timeline</h3>
                </div>
                {showAdd && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {milestones.length === 0 ? (
                <EmptyTimeline onAdd={() => setShowAddForm(true)} />
            ) : (
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-slate-200" />

                    {/* Milestones */}
                    <div className="space-y-4">
                        {displayMilestones.map((m) => (
                            <MilestoneCard key={m.id} milestone={m} />
                        ))}
                    </div>

                    {/* Show More */}
                    {limit && milestones.length > limit && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-teal-600 flex items-center justify-center gap-1"
                        >
                            {showAll ? (
                                <>Show Less <ChevronUp size={16} /></>
                            ) : (
                                <>Show {milestones.length - limit} More <ChevronDown size={16} /></>
                            )}
                        </button>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {showAddForm && (
                <AddMilestoneModal
                    onClose={() => setShowAddForm(false)}
                    onAdd={addMilestone}
                />
            )}
        </div>
    );
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
    const icons = {
        development: Star,
        school: School,
        therapy: Activity,
        medical: Heart,
        personal: Star,
        win: Star
    };
    const Icon = icons[milestone.category] || Star;

    const colors = {
        development: 'bg-purple-100 text-purple-700',
        school: 'bg-blue-100 text-blue-700',
        therapy: 'bg-teal-100 text-teal-700',
        medical: 'bg-red-100 text-red-700',
        personal: 'bg-amber-100 text-amber-700',
        win: 'bg-green-100 text-green-700'
    };
    const color = colors[milestone.category] || 'bg-slate-100 text-slate-700';

    return (
        <div className="flex gap-3 relative">
            {/* Icon */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 ${color}`}>
                <Icon size={16} />
            </div>

            {/* Content */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${color}`}>
                        {milestone.category}
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(milestone.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <h4 className="font-semibold text-slate-900">{milestone.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
            </div>
        </div>
    );
}

function EmptyTimeline({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm mb-3">No milestones recorded yet</p>
            <button
                onClick={onAdd}
                className="px-3 py-1.5 bg-teal-500 text-white text-sm font-bold rounded-lg"
            >
                Add First Milestone
            </button>
        </div>
    );
}

function AddMilestoneModal({ onClose, onAdd }: {
    onClose: () => void;
    onAdd: (m: Milestone) => void;
}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Milestone['category']>('win');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = () => {
        if (!title) return;

        onAdd({
            id: Date.now().toString(),
            date: new Date(date),
            category,
            title,
            description,
            isPositive: category === 'win'
        });
    };

    const categories: Array<{ value: Milestone['category']; label: string }> = [
        { value: 'win', label: '🎉 Win' },
        { value: 'development', label: '⭐ Development' },
        { value: 'school', label: '🏫 School' },
        { value: 'therapy', label: '💪 Therapy' },
        { value: 'medical', label: '❤️ Medical' },
        { value: 'personal', label: '✨ Personal' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Add Milestone</h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full mt-1 p-3 border border-slate-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Category</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {categories.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setCategory(value)}
                                    className={`p-2 text-sm rounded-lg border ${category === value
                                            ? 'border-teal-500 bg-teal-50'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., First day at new school"
                            className="w-full mt-1 p-3 border border-slate-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What happened? How did they feel?"
                            rows={3}
                            className="w-full mt-1 p-3 border border-slate-200 rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 p-3 border border-slate-200 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title}
                        className="flex-1 p-3 bg-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
