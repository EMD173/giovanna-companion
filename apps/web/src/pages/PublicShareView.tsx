import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { format } from 'date-fns';
import { ShieldCheck, Calendar, User, AlertTriangle, Activity, Layers, Lock, Eye, EyeOff } from 'lucide-react';

// Response types from Cloud Function
interface SharePacketResponse {
    requiresPasscode: boolean;
    recipientName: string;
    generatedAt?: string;
    expiresAt: string;
    content?: {
        summaryMessage: string;
        strategies: Array<{ title: string; procedure: string }>;
        logs: Array<{
            antecedent: string;
            behavior: string;
            consequence: string;
            timestamp: string | null;
        }>;
    };
}

export function PublicShareView() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [packet, setPacket] = useState<SharePacketResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [passcodeRequired, setPasscodeRequired] = useState(false);
    const [passcodeInput, setPasscodeInput] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    const [passcodeError, setPasscodeError] = useState<string | null>(null);

    const functions = getFunctions(getApp());

    const fetchPacket = async (passcode?: string) => {
        if (!token) {
            setError('Invalid or missing access link.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setPasscodeError(null);

            const getPublicSharePacket = httpsCallable<
                { token: string; passcode?: string },
                SharePacketResponse
            >(functions, 'getPublicSharePacket');

            const result = await getPublicSharePacket({ token, passcode });

            if (result.data.requiresPasscode && !result.data.content) {
                // Passcode needed but not yet provided
                setPasscodeRequired(true);
                setPacket(result.data);
                setLoading(false);
                return;
            }

            setPasscodeRequired(false);
            setPacket(result.data);
            setLoading(false);
        } catch (err: unknown) {
            console.error('Error fetching packet:', err);

            // Handle specific error codes
            if (err && typeof err === 'object' && 'code' in err) {
                const fbError = err as { code: string; message: string };
                if (fbError.code === 'functions/not-found') {
                    setError('This share link is no longer available.');
                } else if (fbError.code === 'functions/permission-denied') {
                    if (fbError.message.includes('passcode')) {
                        setPasscodeError('Incorrect passcode. Please try again.');
                        setLoading(false);
                        return;
                    } else if (fbError.message.includes('expired')) {
                        setError('This share link has expired.');
                    } else if (fbError.message.includes('revoked')) {
                        setError('This share link has been revoked by the family.');
                    } else {
                        setError('Access denied.');
                    }
                } else {
                    setError('An error occurred while loading the data.');
                }
            } else {
                setError('An error occurred while loading the data.');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPacket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handlePasscodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcodeInput.trim()) {
            fetchPacket(passcodeInput.trim());
        }
    };

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

    // Passcode entry screen
    if (passcodeRequired) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
                    <div className="text-center mb-6">
                        <Lock className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                        <h1 className="text-xl font-bold text-slate-900 mb-2">Passcode Required</h1>
                        <p className="text-slate-600">
                            This share was created for <strong>{packet?.recipientName}</strong>.
                            <br />
                            Enter the passcode to view.
                        </p>
                    </div>

                    <form onSubmit={handlePasscodeSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPasscode ? 'text' : 'password'}
                                value={passcodeInput}
                                onChange={(e) => setPasscodeInput(e.target.value)}
                                placeholder="Enter passcode"
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-12"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasscode(!showPasscode)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {passcodeError && (
                            <p className="text-red-600 text-sm text-center">{passcodeError}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                        >
                            View Share
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!packet || !packet.content) return null;

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
                            <span>Expires: {format(new Date(packet.expiresAt), 'MMMM d, yyyy')}</span>
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
                            {packet.content.strategies.map((strategy, idx) => (
                                <div key={idx} className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
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
                            {packet.content.logs.map((log, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-lg p-4">
                                    <div className="text-xs text-slate-500 mb-2">
                                        {log.timestamp ? format(new Date(log.timestamp), 'MMM d, h:mm a') : 'Unknown date'}
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
