/**
 * Homeplace Supports Page
 * 
 * User-defined supports for regulation, comfort, and identity.
 * EC Mode context for understanding the child's support ecosystem.
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import {
    Plus, X, Save, Loader2, Home, User, Music,
    TreePine, Activity, Coffee, Sparkles, Check
} from 'lucide-react';
import {
    type HomeplaceSupports,
    type TrustedPerson,
    HOMEPLACE_SUGGESTIONS,
    createEmptyHomeplaceSupports
} from '../data/homeplaceSupports';
import { showToast } from '../components/Toast';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export function HomeplacePage() {
    const { user } = useAuth();
    const { activeChild: selectedChild } = useFamily();
    const [supports, setSupports] = useState<HomeplaceSupports>(createEmptyHomeplaceSupports());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Load existing supports
    useEffect(() => {
        async function load() {
            if (!user || !selectedChild) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'children', selectedChild.id, 'homeplaceSupports', 'current');
                const snap = await getDoc(docRef);

                if (snap.exists()) {
                    setSupports(snap.data() as HomeplaceSupports);
                }
            } catch (error) {
                console.error('Error loading homeplace supports:', error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user, selectedChild]);

    const handleSave = async () => {
        if (!user || !selectedChild) return;

        setSaving(true);
        try {
            const docRef = doc(db, 'children', selectedChild.id, 'homeplaceSupports', 'current');
            await setDoc(docRef, {
                ...supports,
                updatedAt: serverTimestamp()
            });
            setHasChanges(false);
            showToast('Homeplace supports saved!', 'success');
        } catch (error) {
            console.error('Error saving:', error);
            showToast('Failed to save. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateArray = (field: keyof HomeplaceSupports, value: string[]) => {
        setSupports(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const addTrustedPerson = () => {
        setSupports(prev => ({
            ...prev,
            trustedPeople: [...prev.trustedPeople, { name: '', relationship: '', howTheyHelp: '' }]
        }));
        setHasChanges(true);
    };

    const updateTrustedPerson = (index: number, updates: Partial<TrustedPerson>) => {
        setSupports(prev => ({
            ...prev,
            trustedPeople: prev.trustedPeople.map((p, i) =>
                i === index ? { ...p, ...updates } : p
            )
        }));
        setHasChanges(true);
    };

    const removeTrustedPerson = (index: number) => {
        setSupports(prev => ({
            ...prev,
            trustedPeople: prev.trustedPeople.filter((_, i) => i !== index)
        }));
        setHasChanges(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    if (!selectedChild) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Home size={48} className="mx-auto mb-4 opacity-50" />
                <p>Please select a child profile first.</p>
            </div>
        );
    }

    return (
        <div className="pb-24 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Home size={24} className="text-amber-600" />
                        Homeplace Supports
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        What helps {selectedChild.firstName || 'your child'} feel safe and regulated?
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>

            <DisclaimerBanner storageKey="homeplace_disclaimer" />

            {/* Calming Practices */}
            <SupportSection
                icon={<Sparkles />}
                title="Calming Practices"
                description="What helps them calm down when upset?"
                items={supports.calmingPractices}
                suggestions={HOMEPLACE_SUGGESTIONS.calmingPractices}
                onChange={(items) => updateArray('calmingPractices', items)}
                color="amber"
            />

            {/* Sensory Tools */}
            <SupportSection
                icon={<Activity />}
                title="Sensory Tools"
                description="Objects that provide comfort or regulation"
                items={supports.sensoryTools}
                suggestions={HOMEPLACE_SUGGESTIONS.sensoryTools}
                onChange={(items) => updateArray('sensoryTools', items)}
                color="blue"
            />

            {/* Movement */}
            <SupportSection
                icon={<Activity />}
                title="Movement"
                description="Physical activities that help regulation"
                items={supports.movement}
                suggestions={HOMEPLACE_SUGGESTIONS.movement}
                onChange={(items) => updateArray('movement', items)}
                color="green"
            />

            {/* Trusted People */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <User className="text-rose-600" size={20} />
                    <h3 className="font-bold text-slate-900">Trusted People</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">Who can they turn to for co-regulation?</p>

                <div className="space-y-3">
                    {supports.trustedPeople.map((person, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                            <input
                                type="text"
                                placeholder="Name"
                                value={person.name}
                                onChange={(e) => updateTrustedPerson(idx, { name: e.target.value })}
                                className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                            />
                            <select
                                value={person.relationship}
                                onChange={(e) => updateTrustedPerson(idx, { relationship: e.target.value })}
                                className="p-2 border border-slate-200 rounded-lg text-sm bg-white"
                            >
                                <option value="">Relationship</option>
                                {HOMEPLACE_SUGGESTIONS.relationships.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => removeTrustedPerson(idx)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addTrustedPerson}
                    className="mt-3 flex items-center gap-1 text-sm text-rose-600 font-medium hover:text-rose-700"
                >
                    <Plus size={16} /> Add Person
                </button>
            </div>

            {/* Community Spaces */}
            <SupportSection
                icon={<TreePine />}
                title="Safe Spaces"
                description="Places where they feel comfortable"
                items={supports.communitySpaces}
                suggestions={HOMEPLACE_SUGGESTIONS.communitySpaces}
                onChange={(items) => updateArray('communitySpaces', items)}
                color="teal"
            />

            {/* Music & Sounds */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Music className="text-purple-600" size={20} />
                    <h3 className="font-bold text-slate-900">Music & Sounds</h3>
                </div>
                <p className="text-sm text-slate-500 mb-3">Specific songs, artists, or sounds that help</p>
                <TagInput
                    items={supports.musicSounds}
                    onChange={(items) => updateArray('musicSounds', items)}
                    placeholder="Add a song or artist..."
                    color="purple"
                />
            </div>

            {/* Comfort Foods */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Coffee className="text-orange-600" size={20} />
                    <h3 className="font-bold text-slate-900">Comfort Foods</h3>
                </div>
                <p className="text-sm text-slate-500 mb-3">Foods that bring comfort (no judgment)</p>
                <TagInput
                    items={supports.comfortFoods}
                    onChange={(items) => updateArray('comfortFoods', items)}
                    placeholder="Add a food..."
                    color="orange"
                />
            </div>

            {/* Floating Save Button */}
            {hasChanges && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur border-t border-slate-200">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
}

// Reusable Support Section Component
interface SupportSectionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    items: string[];
    suggestions: string[];
    onChange: (items: string[]) => void;
    color: 'amber' | 'blue' | 'green' | 'teal' | 'purple' | 'orange' | 'rose';
}

function SupportSection({ icon, title, description, items, suggestions, onChange, color }: SupportSectionProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const colorClasses = {
        amber: 'text-amber-600 bg-amber-50 border-amber-200',
        blue: 'text-blue-600 bg-blue-50 border-blue-200',
        green: 'text-green-600 bg-green-50 border-green-200',
        teal: 'text-teal-600 bg-teal-50 border-teal-200',
        purple: 'text-purple-600 bg-purple-50 border-purple-200',
        orange: 'text-orange-600 bg-orange-50 border-orange-200',
        rose: 'text-rose-600 bg-rose-50 border-rose-200'
    };

    const toggleItem = (item: string) => {
        if (items.includes(item)) {
            onChange(items.filter(i => i !== item));
        } else {
            onChange([...items, item]);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
                <span className={colorClasses[color].split(' ')[0]}>{icon}</span>
                <h3 className="font-bold text-slate-900">{title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-3">{description}</p>

            {/* Selected Items */}
            <div className="flex flex-wrap gap-2 mb-3">
                {items.map(item => (
                    <span
                        key={item}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${colorClasses[color]}`}
                    >
                        {item}
                        <button onClick={() => toggleItem(item)} className="hover:opacity-70">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>

            {/* Suggestions Toggle */}
            <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`text-sm font-medium ${colorClasses[color].split(' ')[0]} hover:underline`}
            >
                {showSuggestions ? 'Hide suggestions' : '+ Add from suggestions'}
            </button>

            {showSuggestions && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.filter(s => !items.includes(s)).map(suggestion => (
                        <button
                            key={suggestion}
                            onClick={() => toggleItem(suggestion)}
                            className="px-2 py-1 text-sm border border-slate-200 rounded-full hover:bg-slate-50"
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Tag Input for free-form items
interface TagInputProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder: string;
    color: string;
}

function TagInput({ items, onChange, placeholder, color }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim() && !items.includes(input.trim())) {
            onChange([...items, input.trim()]);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const remove = (item: string) => {
        onChange(items.filter(i => i !== item));
    };

    const colorClasses: Record<string, string> = {
        purple: 'bg-purple-50 text-purple-700 border-purple-200',
        orange: 'bg-orange-50 text-orange-700 border-orange-200'
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {items.map(item => (
                    <span
                        key={item}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm border ${colorClasses[color] || 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                        {item}
                        <button onClick={() => remove(item)} className="hover:opacity-70">
                            <X size={14} />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                />
                <button
                    onClick={handleAdd}
                    disabled={!input.trim()}
                    className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 disabled:opacity-50"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
