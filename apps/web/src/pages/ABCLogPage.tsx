import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ABCLogForm } from '../components/ABCLogForm';
import { ABCLogList } from '../components/ABCLogList';

export function ABCLogPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="pb-20 relative min-h-[80vh]">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">ABC Log</h1>
                    <p className="text-slate-600">Track patterns to understand the "why".</p>
                </div>
            </div>

            {isFormOpen ? (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 md:p-6 mb-8 animate-in slide-in-from-bottom-4 fade-in duration-200">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-teal-900">New Entry</h2>
                        <button
                            onClick={() => setIsFormOpen(false)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            Close
                        </button>
                    </div>
                    <ABCLogForm onClose={() => setIsFormOpen(false)} />
                </div>
            ) : (
                <ABCLogList />
            )}

            {/* Floating Action Button (Mobile) */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 hover:scale-105 transition-all z-40 focus:outline-none focus:ring-4 focus:ring-teal-300"
                    aria-label="Add New Log"
                >
                    <Plus size={32} />
                </button>
            )}
        </div>
    );
}
