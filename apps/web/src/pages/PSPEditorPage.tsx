/**
 * Personal Support Plan (PSP) Editor Page
 * 
 * A family-owned, strength-based alternative to traditional IEPs.
 * Sections: Identity, Goals, Supports, Crisis Plan (optional), Share
 */

import { useState } from 'react';
import { usePSP } from '../hooks/usePSP';
import { useFamily } from '../contexts/FamilyContext';
import {
    FileText, User, Target, Heart, Shield, Share2, Plus, X,
    ChevronRight, Loader2, Star, MessageCircle, Sparkles,
    Check, Trash2, TrendingUp
} from 'lucide-react';
import {
    type PSPGoal, type ProgressEntry,
    GOAL_AREAS, calculateGoalProgress
} from '../data/personalSupportPlan';
import { showToast } from '../components/Toast';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { format } from 'date-fns';

type Section = 'identity' | 'goals' | 'supports' | 'crisis' | 'share';

export function PSPEditorPage() {
    const { activeChild } = useFamily();
    const { psp, loading, saving, updatePsp, addGoal, updateGoal, addProgress, deleteGoal } = usePSP();
    const [activeSection, setActiveSection] = useState<Section>('identity');
    const [showAddGoal, setShowAddGoal] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!activeChild || !psp) {
        return (
            <div className="text-center py-12 text-slate-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Please select a child profile to view their Support Plan.</p>
            </div>
        );
    }

    const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
        { id: 'identity', label: 'Identity', icon: <User size={18} /> },
        { id: 'goals', label: 'Goals', icon: <Target size={18} /> },
        { id: 'supports', label: 'Supports', icon: <Heart size={18} /> },
        { id: 'crisis', label: 'Crisis Plan', icon: <Shield size={18} /> },
        { id: 'share', label: 'Share', icon: <Share2 size={18} /> }
    ];

    return (
        <div className="pb-24">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={24} className="text-indigo-600" />
                    {activeChild.firstName}'s Support Plan
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                    A living document you control — share what you want, when you want.
                </p>
            </div>

            <DisclaimerBanner storageKey="psp_disclaimer" />

            {/* Section Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeSection === section.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        {section.icon}
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Section Content */}
            {activeSection === 'identity' && (
                <IdentitySection psp={psp} onUpdate={updatePsp} saving={saving} />
            )}

            {activeSection === 'goals' && (
                <GoalsSection
                    goals={psp.goals}
                    showAddGoal={showAddGoal}
                    onShowAddGoal={setShowAddGoal}
                    onAddGoal={addGoal}
                    onUpdateGoal={updateGoal}
                    onAddProgress={addProgress}
                    onDeleteGoal={deleteGoal}
                />
            )}

            {activeSection === 'supports' && (
                <SupportsSection psp={psp} onUpdate={updatePsp} saving={saving} />
            )}

            {activeSection === 'crisis' && (
                <CrisisSection psp={psp} onUpdate={updatePsp} saving={saving} />
            )}

            {activeSection === 'share' && (
                <ShareSection psp={psp} />
            )}

            {/* Saving indicator */}
            {saving && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                </div>
            )}
        </div>
    );
}

// ============================================
// IDENTITY SECTION
// ============================================

function IdentitySection({ psp, onUpdate, saving }: {
    psp: any;
    onUpdate: (updates: any) => Promise<void>;
    saving: boolean;
}) {
    const [strengths, setStrengths] = useState(psp.identity.strengths.join(', '));
    const [interests, setInterests] = useState(psp.identity.interests.join(', '));
    const [commDetails, setCommDetails] = useState(psp.identity.communicationStyle.details);

    const handleSave = async () => {
        await onUpdate({
            identity: {
                ...psp.identity,
                strengths: strengths.split(',').map((s: string) => s.trim()).filter(Boolean),
                interests: interests.split(',').map((s: string) => s.trim()).filter(Boolean),
                communicationStyle: {
                    ...psp.identity.communicationStyle,
                    details: commDetails
                }
            }
        });
        showToast('Identity saved!', 'success');
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Star className="text-amber-500" size={20} />
                    <h3 className="font-bold text-slate-900">Strengths</h3>
                </div>
                <textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="What are they good at? (comma separated)"
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                    rows={3}
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-purple-500" size={20} />
                    <h3 className="font-bold text-slate-900">Interests & Motivators</h3>
                </div>
                <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="What do they love? What motivates them? (comma separated)"
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                    rows={3}
                />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="text-blue-500" size={20} />
                    <h3 className="font-bold text-slate-900">Communication Style</h3>
                </div>
                <textarea
                    value={commDetails}
                    onChange={(e) => setCommDetails(e.target.value)}
                    placeholder="How do they communicate best? What should others know?"
                    className="w-full p-3 border border-slate-200 rounded-lg text-sm"
                    rows={4}
                />
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
                Save Identity
            </button>
        </div>
    );
}

// ============================================
// GOALS SECTION
// ============================================

function GoalsSection({ goals, showAddGoal, onShowAddGoal, onAddGoal, onUpdateGoal, onAddProgress, onDeleteGoal }: {
    goals: PSPGoal[];
    showAddGoal: boolean;
    onShowAddGoal: (show: boolean) => void;
    onAddGoal: (goal: any) => Promise<string | undefined>;
    onUpdateGoal: (id: string, updates: Partial<PSPGoal>) => Promise<void>;
    onAddProgress: (goalId: string, entry: Omit<ProgressEntry, 'id' | 'date'>) => Promise<void>;
    onDeleteGoal: (id: string) => Promise<void>;
}) {
    const activeGoals = goals.filter(g => g.status === 'active');
    const achievedGoals = goals.filter(g => g.status === 'achieved');

    return (
        <div className="space-y-6">
            {/* Add Goal Button */}
            {!showAddGoal && (
                <button
                    onClick={() => onShowAddGoal(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-600 font-medium hover:bg-indigo-50"
                >
                    <Plus size={20} />
                    Add New Goal
                </button>
            )}

            {/* Add Goal Form */}
            {showAddGoal && (
                <AddGoalForm
                    onAdd={onAddGoal}
                    onCancel={() => onShowAddGoal(false)}
                />
            )}

            {/* Active Goals */}
            {activeGoals.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Goals</h3>
                    {activeGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onUpdate={onUpdateGoal}
                            onAddProgress={onAddProgress}
                            onDelete={onDeleteGoal}
                        />
                    ))}
                </div>
            )}

            {/* Achieved Goals */}
            {achievedGoals.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-green-600 uppercase tracking-wide flex items-center gap-2">
                        <Check size={16} /> Achieved
                    </h3>
                    {achievedGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onUpdate={onUpdateGoal}
                            onAddProgress={onAddProgress}
                            onDelete={onDeleteGoal}
                            compact
                        />
                    ))}
                </div>
            )}

            {goals.length === 0 && !showAddGoal && (
                <div className="text-center py-8 text-slate-400">
                    <Target size={40} className="mx-auto mb-2 opacity-50" />
                    <p>No goals yet. Add your first goal above.</p>
                </div>
            )}
        </div>
    );
}

function AddGoalForm({ onAdd, onCancel }: {
    onAdd: (goal: any) => Promise<string | undefined>;
    onCancel: () => void;
}) {
    const [area, setArea] = useState<string>('communication');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [whyImportant, setWhyImportant] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setSubmitting(true);
        await onAdd({
            area,
            title: title.trim(),
            description: description.trim(),
            whyImportant: whyImportant.trim(),
            currentLevel: '',
            targetLevel: '',
            strategies: [],
            status: 'active'
        });
        setSubmitting(false);
        showToast('Goal added!', 'success');
        onCancel();
    };

    return (
        <div className="bg-white border border-indigo-200 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900">New Goal</h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Area</label>
                <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                    {Object.entries(GOAL_AREAS).map(([key, meta]) => (
                        <option key={key} value={key}>{meta.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Ask for help when frustrated"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What does success look like?"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    rows={2}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Why It Matters</label>
                <textarea
                    value={whyImportant}
                    onChange={(e) => setWhyImportant(e.target.value)}
                    placeholder="Why is this goal important to your family?"
                    className="w-full p-2 border border-slate-200 rounded-lg"
                    rows={2}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!title.trim() || submitting}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
                {submitting ? 'Adding...' : 'Add Goal'}
            </button>
        </div>
    );
}

function GoalCard({ goal, onUpdate, onAddProgress, onDelete, compact = false }: {
    goal: PSPGoal;
    onUpdate: (id: string, updates: Partial<PSPGoal>) => Promise<void>;
    onAddProgress: (goalId: string, entry: Omit<ProgressEntry, 'id' | 'date'>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    compact?: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [progressNotes, setProgressNotes] = useState('');
    const [progressRating, setProgressRating] = useState<1 | 2 | 3 | 4 | 5>(3);

    const areaMeta = GOAL_AREAS[goal.area] || GOAL_AREAS.custom;
    const progress = calculateGoalProgress(goal);

    const handleAddProgress = async () => {
        if (!progressNotes.trim()) return;
        await onAddProgress(goal.id, { notes: progressNotes, rating: progressRating });
        setProgressNotes('');
        setShowProgress(false);
        showToast('Progress logged!', 'success');
    };

    const markAchieved = async () => {
        await onUpdate(goal.id, { status: 'achieved' });
        showToast('Goal achieved! 🎉', 'success');
    };

    if (compact) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                    <span className="text-xs text-green-600 font-medium">{areaMeta.label}</span>
                    <p className="font-medium text-slate-800">{goal.title}</p>
                </div>
                <Check className="text-green-600" size={20} />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 text-left flex items-start justify-between"
            >
                <div className="flex-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${areaMeta.color}-100 text-${areaMeta.color}-700`}>
                        {areaMeta.label}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">{goal.title}</h4>
                    {goal.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{goal.description}</p>
                    )}

                    {/* Progress bar */}
                    {goal.progress.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-500">{progress}%</span>
                        </div>
                    )}
                </div>
                <ChevronRight className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} size={20} />
            </button>

            {expanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
                    {goal.whyImportant && (
                        <div className="bg-amber-50 p-3 rounded-lg">
                            <p className="text-sm text-amber-800">
                                <strong>Why it matters:</strong> {goal.whyImportant}
                            </p>
                        </div>
                    )}

                    {/* Recent Progress */}
                    {goal.progress.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-xs font-bold text-slate-500 uppercase">Recent Progress</h5>
                            {goal.progress.slice(-3).reverse().map(entry => (
                                <div key={entry.id} className="flex items-start gap-2 text-sm">
                                    <TrendingUp size={14} className="text-indigo-500 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500">
                                            {entry.date?.toDate ? format(entry.date.toDate(), 'MMM d') : 'Recently'}:
                                        </span>{' '}
                                        {entry.notes}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Progress */}
                    {!showProgress ? (
                        <button
                            onClick={() => setShowProgress(true)}
                            className="flex items-center gap-2 text-sm text-indigo-600 font-medium"
                        >
                            <Plus size={16} /> Log Progress
                        </button>
                    ) : (
                        <div className="bg-slate-50 p-3 rounded-lg space-y-3">
                            <textarea
                                value={progressNotes}
                                onChange={(e) => setProgressNotes(e.target.value)}
                                placeholder="What happened? What did you observe?"
                                className="w-full p-2 border border-slate-200 rounded text-sm"
                                rows={2}
                            />
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">Rating:</span>
                                {[1, 2, 3, 4, 5].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setProgressRating(r as any)}
                                        className={`w-8 h-8 rounded-full text-sm font-bold ${progressRating === r
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-200 text-slate-600'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddProgress}
                                    disabled={!progressNotes.trim()}
                                    className="flex-1 py-2 bg-indigo-600 text-white rounded font-medium disabled:opacity-50"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setShowProgress(false)}
                                    className="px-4 py-2 text-slate-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <button
                            onClick={markAchieved}
                            className="flex items-center gap-1 text-sm text-green-600 font-medium"
                        >
                            <Check size={16} /> Mark Achieved
                        </button>
                        <button
                            onClick={() => onDelete(goal.id)}
                            className="flex items-center gap-1 text-sm text-red-500 font-medium ml-auto"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================
// SUPPORTS SECTION (Placeholder)
// ============================================

function SupportsSection(_props: { psp: any; onUpdate: any; saving: boolean }) {
    return (
        <div className="text-center py-12 text-slate-400">
            <Heart size={40} className="mx-auto mb-2 opacity-50" />
            <p>Supports section coming soon.</p>
            <p className="text-sm mt-2">Use the Homeplace Supports page for now.</p>
        </div>
    );
}

// ============================================
// CRISIS SECTION (Placeholder)
// ============================================

function CrisisSection(_props: { psp: any; onUpdate: any; saving: boolean }) {
    return (
        <div className="text-center py-12 text-slate-400">
            <Shield size={40} className="mx-auto mb-2 opacity-50" />
            <p>Crisis Plan section coming soon.</p>
        </div>
    );
}

// ============================================
// SHARE SECTION (Placeholder)
// ============================================

function ShareSection(_props: { psp: any }) {
    return (
        <div className="text-center py-12 text-slate-400">
            <Share2 size={40} className="mx-auto mb-2 opacity-50" />
            <p>Share settings coming soon.</p>
            <p className="text-sm mt-2">Use Share Packets for now to share with teachers.</p>
        </div>
    );
}
