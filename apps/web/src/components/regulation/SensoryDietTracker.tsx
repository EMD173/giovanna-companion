import { useState } from 'react';
import { Sparkles, Save } from 'lucide-react';
import { SENSORY_INPUTS } from '../../types/regulation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useFamily } from '../../contexts/FamilyContext';

export function SensoryDietTracker() {
    const { user } = useAuth();
    const { activeChild } = useFamily();
    const [input, setInput] = useState('');
    const [isWin, setIsWin] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleLog = async () => {
        if (!user || !activeChild || !input) return;
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'families', user.uid, 'sensoryLogs'), {
                childId: activeChild.id,
                childName: activeChild.firstName,
                timestamp: serverTimestamp(),
                sensoryInput: input,
                outcome: isWin ? 'regulated' : 'no_change',
                isWin: isWin,
                loggedBy: user.uid
            });
            setInput('');
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            setSubmitting(false);
        }
    };

    if (!activeChild) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-[var(--deep-ebony)]">Sensory Diet</h3>
                    <p className="text-xs text-slate-500">Track what helps {activeChild.firstName} regulate.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {SENSORY_INPUTS.slice(0, 6).map(item => (
                        <button
                            key={item}
                            onClick={() => setInput(item)}
                            className={`p-2 text-xs font-medium rounded-lg border text-left transition-all ${input === item
                                    ? 'border-[var(--gold-accent)] bg-amber-50 text-amber-900 ring-1 ring-[var(--gold-accent)]'
                                    : 'border-slate-100 text-slate-600 hover:border-[var(--gold-accent)]'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-sm text-[var(--deep-ebony)] cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isWin}
                            onChange={(e) => setIsWin(e.target.checked)}
                            className="w-4 h-4 text-[var(--regal-purple)] rounded focus:ring-[var(--regal-purple)]"
                        />
                        <span>This was a "Sensory Win" (It helped!)</span>
                    </label>

                    <button
                        onClick={handleLog}
                        disabled={!input || submitting}
                        className="ml-auto btn-regal btn-gold py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting ? 'Saving...' : <><Save size={16} /> Log Entry</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
