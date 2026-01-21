import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';
import { ShieldCheck, Calendar, User, AlertTriangle, Activity, Layers } from 'lucide-react';
import { type SharePacket } from '../hooks/useSharePackets';

export function PublicShareView() {
    const { packetId } = useParams<{ packetId: string }>();
    const [searchParams] = useSearchParams();
    const accessCode = searchParams.get('code');

    const [packet, setPacket] = useState<SharePacket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPacket() {
            if (!packetId || !accessCode) {
                setError('Invalid or missing access link.');
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'sharePackets', packetId);
                const docSnap = await getDoc(docRef);

                if (!docSnap.exists()) {
                    setError('This share link is no longer available.');
                    setLoading(false);
                    return;
                }

                const data = docSnap.data() as Omit<SharePacket, 'id'>;

                // Verify access code
                if (data.accessCode !== accessCode) {
                    setError('Invalid access code.');
                    setLoading(false);
                    return;
                }

                // Check expiration
                if (data.expiresAt.toDate() < new Date()) {
                    setError('This share link has expired.');
                    setLoading(false);
                    return;
                }

                // Increment view count (fire-and-forget)
                updateDoc(docRef, { views: increment(1) }).catch(console.error);

                setPacket({ id: docSnap.id, ...data });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching packet:', err);
                setError('An error occurred while loading the data.');
                setLoading(false);
            }
        }

        fetchPacket();
    }, [packetId, accessCode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading shared data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                    <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!packet) return null;

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Shared Support Packet</h1>
                            <p className="text-sm text-slate-500">Powered by Giovanna</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                            <User size={16} />
                            <span>Prepared for: <strong>{packet.recipientName}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={16} />
                            <span>Expires: {format(packet.expiresAt.toDate(), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>

                    {packet.content.summaryMessage && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-sm text-slate-700 italic">"{packet.content.summaryMessage}"</p>
                        </div>
                    )}
                </div>

                {/* Strategies Section */}
                {packet.content.strategies.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                            <Layers size={20} className="text-indigo-600" />
                            What Works for This Child
                        </h2>
                        <div className="space-y-3">
                            {packet.content.strategies.map((strategy) => (
                                <div key={strategy.id} className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                    <h3 className="font-bold text-indigo-900">{strategy.title}</h3>
                                    <p className="text-sm text-indigo-700 mt-1">{strategy.procedure}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ABC Logs Section */}
                {packet.content.logs.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                            <Activity size={20} className="text-rose-600" />
                            Recent Behavior Observations
                        </h2>
                        <div className="space-y-4">
                            {packet.content.logs.map((log) => (
                                <div key={log.id} className="border border-slate-200 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 mb-2">
                                        {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'MMM d, h:mm a') : 'Unknown date'}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-[10px] font-bold uppercase text-slate-400">Before</span>
                                            <p className="text-slate-700">{log.antecedent}</p>
                                        </div>
                                        <div className="bg-rose-50 p-2 rounded">
                                            <span className="block text-[10px] font-bold uppercase text-rose-400">Behavior</span>
                                            <p className="text-rose-800 font-medium">{log.behavior}</p>
                                        </div>
                                        <div className="bg-indigo-50 p-2 rounded">
                                            <span className="block text-[10px] font-bold uppercase text-indigo-400">Response</span>
                                            <p className="text-indigo-700">{log.consequence}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-slate-400 py-4">
                    This data was shared securely via Giovanna. <br />
                    The parent retains full control and can revoke access at any time.
                </div>
            </div>
        </div>
    );
}
