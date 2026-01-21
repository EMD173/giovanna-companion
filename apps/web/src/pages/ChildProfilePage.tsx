/**
 * Child Profile Page
 * 
 * Comprehensive child profile with socio-cultural context,
 * timeline, supports, and narrative.
 */

import { useState } from 'react';
import { useFamily, useActiveChild } from '../contexts/FamilyContext';
import {
    User, Heart, School, Activity, Users, Clock,
    Plus, Edit2, Save, ChevronRight, Sparkles
} from 'lucide-react';
import { useECMode } from '../contexts/ECModeContext';
import { type ChildProfile as ChildProfileType, createEmptyChildProfile } from '../data/familyProfile';

export function ChildProfilePage() {
    const { family, loading, addChild } = useFamily();
    const { child, update } = useActiveChild();
    const { enabled: ecMode } = useECMode();
    const [isEditing, setIsEditing] = useState(false);
    const [showAddChild, setShowAddChild] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
            </div>
        );
    }

    if (!family || family.children.length === 0) {
        return (
            <div className="space-y-6 pb-20">
                <h1 className="text-2xl font-bold text-slate-900">Child Profile</h1>
                <EmptyState onAdd={() => setShowAddChild(true)} />
                {showAddChild && (
                    <AddChildModal
                        onClose={() => setShowAddChild(false)}
                        onAdd={async (name) => {
                            const newChild = createEmptyChildProfile(Date.now().toString());
                            newChild.firstName = name;
                            await addChild(newChild);
                            setShowAddChild(false);
                        }}
                    />
                )}
            </div>
        );
    }

    if (!child) return null;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {child.preferredName || child.firstName}'s Profile
                    </h1>
                    <p className="text-slate-500">{child.pronouns}</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                    {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                </button>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard
                    icon={<School size={18} />}
                    label="School"
                    value={child.currentSchool?.name || 'Not set'}
                />
                <InfoCard
                    icon={<Activity size={18} />}
                    label="Grade"
                    value={child.currentGrade || 'Not set'}
                />
            </div>

            {/* Narrative Section */}
            <section className="bg-gradient-to-br from-amber-50 to-teal-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Heart size={18} className="text-amber-600" />
                    <h2 className="font-bold text-slate-900">Who They Are</h2>
                </div>
                {isEditing ? (
                    <textarea
                        className="w-full p-3 border border-amber-200 rounded-lg bg-white/80 text-sm"
                        rows={3}
                        placeholder="Tell us about your child in your own words..."
                        value={child.narrative?.whoTheyAre || ''}
                        onChange={(e) => update({
                            narrative: { ...child.narrative, whoTheyAre: e.target.value, updatedAt: new Date() as any }
                        })}
                    />
                ) : (
                    <p className="text-slate-700 text-sm italic">
                        {child.narrative?.whoTheyAre || 'Add a description of your child...'}
                    </p>
                )}
            </section>

            {/* Strengths & Interests */}
            <section className="bg-white border border-slate-200 rounded-xl p-4">
                <h2 className="font-bold text-slate-900 mb-3">Strengths & Interests</h2>
                <div className="flex flex-wrap gap-2">
                    {child.strengths.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 text-sm rounded-full">
                            {s}
                        </span>
                    ))}
                    {child.interests.map((s, i) => (
                        <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                            {s}
                        </span>
                    ))}
                    {isEditing && (
                        <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-500 text-sm rounded-full hover:border-teal-500">
                            + Add
                        </button>
                    )}
                </div>
            </section>

            {/* EC Mode: Homeplace Supports */}
            {ecMode && (
                <section className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={18} className="text-teal-600" />
                        <h2 className="font-bold text-slate-900">Homeplace Supports</h2>
                    </div>
                    <HomeplaceGrid supports={child.homeplaceSupports} isEditing={isEditing} onUpdate={(s) => update({ homeplaceSupports: s })} />
                </section>
            )}

            {/* Communication Profile */}
            <section className="bg-white border border-slate-200 rounded-xl p-4">
                <h2 className="font-bold text-slate-900 mb-3">Communication</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Primary Mode</span>
                        <span className="font-medium">{child.communicationStyle?.primaryMode || 'Verbal'}</span>
                    </div>
                    {child.communicationStyle?.calmingStrategies.length > 0 && (
                        <div>
                            <span className="text-slate-500">What helps calm down:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {child.communicationStyle.calmingStrategies.map((s, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Navigation Links */}
            <div className="space-y-2">
                <NavLink icon={<Clock size={18} />} label="View Timeline" href="#timeline" />
                <NavLink icon={<Users size={18} />} label="Manage Sharing" href="#sharing" />
            </div>
        </div>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                {icon}
                <span>{label}</span>
            </div>
            <p className="font-semibold text-slate-900 truncate">{value}</p>
        </div>
    );
}

function NavLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
    return (
        <a href={href} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
            <div className="flex items-center gap-3">
                <span className="text-slate-500">{icon}</span>
                <span className="font-medium text-slate-800">{label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
        </a>
    );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <User size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No child profiles yet</h3>
            <p className="text-slate-500 text-sm mb-4">Add your child to start building their profile.</p>
            <button
                onClick={onAdd}
                className="px-4 py-2 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600"
            >
                <Plus size={18} className="inline mr-1" />
                Add Child
            </button>
        </div>
    );
}

function AddChildModal({ onClose, onAdd }: { onClose: () => void; onAdd: (name: string) => void }) {
    const [name, setName] = useState('');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <h3 className="font-bold text-lg mb-4">Add Child</h3>
                <input
                    type="text"
                    className="w-full p-3 border border-slate-200 rounded-lg mb-4"
                    placeholder="Child's first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 p-3 border border-slate-200 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={() => name && onAdd(name)}
                        className="flex-1 p-3 bg-teal-500 text-white font-bold rounded-lg"
                        disabled={!name}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

function HomeplaceGrid({ supports, isEditing, onUpdate: _onUpdate }: {
    supports: ChildProfileType['homeplaceSupports'];
    isEditing: boolean;
    onUpdate: (s: ChildProfileType['homeplaceSupports']) => void;
}) {
    const categories = [
        { key: 'calmingPractices', label: 'Calming Practices', color: 'teal' },
        { key: 'sensoryTools', label: 'Sensory Tools', color: 'amber' },
        { key: 'trustedPeople', label: 'Trusted People', color: 'rose' },
    ] as const;

    return (
        <div className="space-y-3">
            {categories.map(({ key, label, color }) => (
                <div key={key}>
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {(supports[key] as string[]).map((item, i) => (
                            <span key={i} className={`px-2 py-0.5 bg-${color}-50 text-${color}-700 text-xs rounded`}>
                                {item}
                            </span>
                        ))}
                        {isEditing && (
                            <button className="px-2 py-0.5 border border-dashed border-slate-300 text-slate-400 text-xs rounded">
                                +
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
