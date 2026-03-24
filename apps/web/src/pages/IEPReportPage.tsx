/**
 * IEP Report Generator ("The Indispensable Tool")
 * 
 * Aggregates data into a print-optimized format for School/Medical meetings.
 * Turns scattered data into a polished advocacy weapon.
 */

import { useState, useEffect } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useABCLogs } from '../hooks/useABCLogs';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { type SafetyProfile } from '../types/safety';
import { Printer, AlertTriangle, Heart } from 'lucide-react';
import { format } from 'date-fns';

function toDisplayDate(value: unknown): Date {
    if (value instanceof Date) return value;
    if (value && typeof value === 'object' && 'toDate' in value) {
        const toDate = (value as { toDate?: () => Date }).toDate;
        if (typeof toDate === 'function') {
            return toDate();
        }
    }
    return new Date();
}

export function IEPReportPage() {
    const { activeChild } = useFamily();
    const { logs, loading: logsLoading } = useABCLogs();
    const [safetyProfile, setSafetyProfile] = useState<SafetyProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Load Safety Profile
    useEffect(() => {
        async function loadProfile() {
            if (!activeChild) return;
            try {
                const docRef = doc(db, 'children', activeChild.id, 'safetyProfile', 'current');
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setSafetyProfile(snap.data() as SafetyProfile);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [activeChild]);

    const handlePrint = () => {
        window.print();
    };

    if (loading || logsLoading) return <div className="p-8 text-center">Generating Report...</div>;
    if (!activeChild) return <div className="p-8 text-center">Select a child profile first.</div>;

    // Filter logs to last 30 days for relevance
    const recentLogs = logs.slice(0, 30); // MVP: Just take last 30 entries

    return (
        <div className="bg-white min-h-screen">
            {/* Control Bar (Hidden on Print) */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center print:hidden sticky top-0 z-50">
                <div>
                    <h1 className="font-bold text-lg">IEP Advocacy Report</h1>
                    <p className="text-slate-400 text-sm">Preview Mode</p>
                </div>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-[var(--gold-accent)] text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors"
                >
                    <Printer size={18} /> Print to PDF
                </button>
            </div>

            {/* Report Content */}
            <div className="max-w-[8.5in] mx-auto bg-white p-[0.75in] print:p-0 print:mx-0">
                
                {/* Header */}
                <header className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
                            {activeChild.firstName} {activeChild.lastName}
                        </h1>
                        <p className="text-slate-600">DOB: {format(toDisplayDate(activeChild.dateOfBirth), 'MMMM d, yyyy')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Generated On</p>
                        <p className="text-slate-900">{format(new Date(), 'MMMM d, yyyy')}</p>
                    </div>
                </header>

                {/* Section 1: Core Needs (FACES) */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
                        1. Core Needs & Accommodations
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200 print:border print:bg-white">
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                                <AlertTriangle size={16} /> Known Triggers
                            </h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-slate-700">
                                {safetyProfile?.triggers.map(t => (
                                    <li key={t}>{t}</li>
                                )) || <li className="italic text-slate-400">None listed</li>}
                            </ul>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-2">
                                <Heart size={16} /> Successful Supports
                            </h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-slate-700">
                                {safetyProfile?.comforts.map(c => (
                                    <li key={c}>{c}</li>
                                )) || <li className="italic text-slate-400">None listed</li>}
                            </ul>
                        </div>
                    </div>
                    {safetyProfile?.diagnosis && (
                        <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg print:bg-white print:border-slate-200">
                            <span className="font-bold text-blue-900">Diagnosis/Communication: </span>
                            <span className="text-blue-800">{safetyProfile.diagnosis}. {safetyProfile.communicationStyle}.</span>
                        </div>
                    )}
                </section>

                {/* Section 2: Behavioral Log Summary */}
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
                        2. Recent Behavioral Incidents (Last 30 Entries)
                    </h2>
                    
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 print:bg-slate-50 border-b border-slate-300">
                                <th className="p-3 font-bold text-slate-700 w-1/4">Date/Time</th>
                                <th className="p-3 font-bold text-slate-700 w-1/4">Antecedent (Trigger)</th>
                                <th className="p-3 font-bold text-slate-700 w-1/4">Behavior</th>
                                <th className="p-3 font-bold text-slate-700 w-1/4">Consequence/Resolution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {recentLogs.map(log => {
                                const date = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();
                                return (
                                    <tr key={log.id} className="break-inside-avoid">
                                        <td className="p-3 align-top">
                                            <div className="font-bold">{format(date, 'MMM d, yyyy')}</div>
                                            <div className="text-slate-500 text-xs">{format(date, 'h:mm a')}</div>
                                            <div className="mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">
                                                Intensity: {log.intensity}/10
                                            </div>
                                        </td>
                                        <td className="p-3 align-top text-slate-700">{log.antecedent}</td>
                                        <td className="p-3 align-top text-slate-900 font-medium">{log.behavior}</td>
                                        <td className="p-3 align-top text-slate-700">{log.consequence}</td>
                                    </tr>
                                );
                            })}
                            {recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">No incidents recorded in this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* Footer for Print */}
                <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-400 hidden print:block">
                    Generated by Giovanna Household OS • {format(new Date(), 'yyyy')}
                </footer>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { margin: 0.5in; }
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    .print\\:border { border: 1px solid #e2e8f0; }
                    .print\\:bg-white { background-color: white !important; }
                    .print\\:mx-0 { margin: 0 !important; max-width: none !important; }
                    .print\\:p-0 { padding: 0 !important; }
                    /* Hide main layout elements if likely present */
                    nav, aside, .sidebar { display: none !important; }
                }
            `}</style>
        </div>
    );
}
