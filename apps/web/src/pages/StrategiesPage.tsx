import { useState } from 'react';
import { useStrategies, type Strategy } from '../hooks/useStrategies';
import { Plus, CheckCircle, Trash2, Layers } from 'lucide-react';

export function StrategiesPage() {
    const { strategies, loading, addStrategy, updateStatus, deleteStrategy } = useStrategies();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [procedure, setProcedure] = useState('');
    const [category, setCategory] = useState<Strategy['category']>('Behavior');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addStrategy({ title, procedure, category });
        setIsAdding(false);
        setTitle('');
        setProcedure('');
    };

    return (
        <div className="pb-20">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Strategy Deck</h1>
                    <p className="text-slate-600">What works for your child.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus size={20} /> New Card
                </button>
            </div>

            {isAdding && (
                <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl mb-8 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-indigo-900 mb-1">Strategy Name</label>
                            <input
                                required
                                className="w-full p-2 border border-indigo-200 rounded-lg"
                                placeholder="e.g., Deep Pressure Squeeze"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-indigo-900 mb-1">How do you do it?</label>
                            <textarea
                                required
                                className="w-full p-2 border border-indigo-200 rounded-lg"
                                rows={2}
                                placeholder="Step 1... Step 2..."
                                value={procedure}
                                onChange={e => setProcedure(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-indigo-900 mb-1">Category</label>
                            <select
                                className="w-full p-2 border border-indigo-200 rounded-lg bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Strategy['category'])}
                            >
                                <option value="Behavior">Behavior</option>
                                <option value="Sensory">Sensory</option>
                                <option value="Communication">Communication</option>
                                <option value="Routine">Routine</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Save Card</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-indigo-600">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading deck...</div>
            ) : strategies.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Layers className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-500">Your deck is empty.</p>
                    <p className="text-sm text-slate-400">Add strategies that help your child so you don't forget.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {strategies.map((card) => (
                        <div key={card.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-colors">

                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${card.category === 'Sensory' ? 'bg-blue-100 text-blue-700' :
                                    card.category === 'Behavior' ? 'bg-rose-100 text-rose-700' :
                                        'bg-indigo-100 text-indigo-700'
                                    }`}>
                                    {card.category}
                                </span>
                                {card.status === 'successful' && (
                                    <span className="text-green-600 flex items-center gap-1 text-xs font-bold">
                                        <CheckCircle size={14} /> Works!
                                    </span>
                                )}
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-2">{card.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{card.procedure}</p>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => updateStatus(card.id, 'successful')}
                                    className="flex-1 text-xs font-bold text-green-600 bg-green-50 py-2 rounded hover:bg-green-100"
                                    title="Mark as Effective"
                                >
                                    It Worked
                                </button>
                                <button
                                    onClick={() => deleteStrategy(card.id)}
                                    className="px-3 text-slate-400 hover:text-red-500"
                                    title="Delete Card"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
