import { format } from 'date-fns';
import { useABCLogs, type ABCEntry } from '../hooks/useABCLogs';
import { Activity, Calendar, MapPin } from 'lucide-react';

export function ABCLogList() {
    const { logs, loading } = useABCLogs();

    if (loading) {
        return <div className="text-center py-8 text-gray-400">Loading history...</div>;
    }

    if (logs.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Activity className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">No logs yet.</p>
                <p className="text-sm text-slate-400">Tap "New Entry" to track a behavior.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <LogCard key={log.id} log={log} />
            ))}
        </div>
    );
}

function LogCard({ log }: { log: ABCEntry }) {
    // Safe date handling
    const date = log.timestamp?.toDate ? log.timestamp.toDate() : new Date();

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={12} />
                    <span className="font-semibold text-slate-700">
                        {format(date, 'MMM d, h:mm a')}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-4 rounded-sm ${(i + 1) * 2 <= log.intensity
                                    ? (log.intensity > 7 ? 'bg-red-500' : 'bg-teal-500')
                                    : 'bg-slate-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-600 ml-1">{log.intensity}/10</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Antecedent</span>
                    <p className="text-xs text-slate-800 leading-snug">{log.antecedent}</p>
                </div>
                <div className="bg-rose-50 p-2 rounded border border-rose-100">
                    <span className="block text-[10px] uppercase font-bold text-rose-300 mb-0.5">Behavior</span>
                    <p className="text-xs text-rose-900 leading-snug font-medium">{log.behavior}</p>
                </div>
                <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
                    <span className="block text-[10px] uppercase font-bold text-indigo-300 mb-0.5">Consequence</span>
                    <p className="text-xs text-indigo-900 leading-snug">{log.consequence}</p>
                </div>
            </div>

            {log.context && log.context.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                    {log.context.map((ctx, i) => (
                        <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            <MapPin size={8} className="mr-0.5" /> {ctx}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
