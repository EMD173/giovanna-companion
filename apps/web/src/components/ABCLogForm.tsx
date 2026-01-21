import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useABCLogs } from '../hooks/useABCLogs';

export function ABCLogForm({ onClose }: { onClose?: () => void }) {
    const { addLog } = useABCLogs();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [antecedent, setAntecedent] = useState('');
    const [behavior, setBehavior] = useState('');
    const [consequence, setConsequence] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [notes, setNotes] = useState('');

    // Context Chips
    const CONTEXT_OPTIONS = ['Home', 'School', 'Public', 'Transition', 'Mealtime', 'Bedtime', 'Loud Noise'];
    const [selectedContext, setSelectedContext] = useState<string[]>([]);

    const toggleContext = (ctx: string) => {
        if (selectedContext.includes(ctx)) {
            setSelectedContext(selectedContext.filter(c => c !== ctx));
        } else {
            setSelectedContext([...selectedContext, ctx]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addLog({
                timestamp: new Date(), // Defaults to "now", could add date picker
                antecedent,
                behavior,
                consequence,
                intensity,
                context: selectedContext,
                notes
            });
            if (onClose) onClose();
            else navigate('/log');
        } catch (error) {
            console.error("Error saving log", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* A-B-C Section */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-teal-900 mb-1">
                        Antecedent <span className="font-normal text-slate-500">(What happened before?)</span>
                    </label>
                    <textarea
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        rows={2}
                        placeholder="e.g., Asked to turn off iPad, loud siren passed by..."
                        value={antecedent}
                        onChange={(e) => setAntecedent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-rose-900 mb-1">
                        Behavior <span className="font-normal text-slate-500">(What did they do?)</span>
                    </label>
                    <textarea
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        rows={2}
                        placeholder="e.g., Covered ears, dropped to floor, hit self..."
                        value={behavior}
                        onChange={(e) => setBehavior(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-indigo-900 mb-1">
                        Consequence <span className="font-normal text-slate-500">(What happened after?)</span>
                    </label>
                    <textarea
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={2}
                        placeholder="e.g., Gave deep pressure, offered quiet space, ignored..."
                        value={consequence}
                        onChange={(e) => setConsequence(e.target.value)}
                    />
                </div>
            </div>

            {/* Intensity Slider */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Intensity</span>
                    <span className="text-teal-600 font-mono">{intensity}/10</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                </div>
            </div>

            {/* Context Chips */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Context</label>
                <div className="flex flex-wrap gap-2">
                    {CONTEXT_OPTIONS.map(ctx => (
                        <button
                            key={ctx}
                            type="button"
                            onClick={() => toggleContext(ctx)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedContext.includes(ctx)
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {ctx}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Additional Notes</label>
                <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Duration, specific triggers, etc."
                />
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-teal-600 text-white rounded-lg font-bold shadow-md hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? 'Saving...' : <><Save size={18} /> Save Entry</>}
                </button>
            </div>

        </form>
    );
}
