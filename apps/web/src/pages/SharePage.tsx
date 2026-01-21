import { useState } from 'react';
import { useABCLogs } from '../hooks/useABCLogs';
import { useStrategies } from '../hooks/useStrategies';
import { useSharePackets } from '../hooks/useSharePackets';
import { Share2, CheckCircle, Copy, X, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../components/Toast';

export function SharePage() {
    const { logs } = useABCLogs();
    const { strategies } = useStrategies();
    const { packets, generatePacket, revokePacket } = useSharePackets();

    const [isCreating, setIsCreating] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [passcode, setPasscode] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    const [usePasscode, setUsePasscode] = useState(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient) return;

        setIsSubmitting(true);

        try {
            // For MVP, we auto-share the last 5 logs and all active strategies
            const shareLogs = logs.slice(0, 5);
            const shareStrategies = strategies.filter(s => s.status === 'active');

            const result = await generatePacket(
                recipient,
                shareLogs,
                shareStrategies,
                message,
                usePasscode ? passcode : undefined
            );

            // Create the shareable link (token-based, not document ID)
            const link = `${window.location.origin}/share?token=${result.accessToken}`;
            setGeneratedLink(link);
        } catch (error) {
            console.error('Error generating packet:', error);
            showToast('Failed to generate share link', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    const closeGenerator = () => {
        setIsCreating(false);
        setGeneratedLink(null);
        setRecipient('');
        setMessage('');
        setPasscode('');
        setUsePasscode(false);
    };

    // Filter out revoked packets from display
    const activePackets = packets.filter(p => !p.revoked);

    return (
        <div className="pb-20">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Home-School Bridge</h1>
                    <p className="text-slate-600">Share safely. You control the access.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <Share2 size={20} /> New Packet
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white border border-indigo-100 rounded-2xl shadow-xl p-6 mb-8 relative animate-in zoom-in-95">
                    <button onClick={closeGenerator} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>

                    {!generatedLink ? (
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold text-indigo-900 mb-2">Create Share Packet</h2>
                                <p className="text-sm text-slate-500">
                                    This will create a <strong>read-only snapshot</strong> of your last 5 ABC logs and active strategies.
                                    The link will expire in 7 days.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Recipient Name</label>
                                <input
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-lg"
                                    placeholder="e.g. Ms. Johnson"
                                    value={recipient}
                                    onChange={e => setRecipient(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message (Optional)</label>
                                <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg"
                                    placeholder="Notes for the teacher..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>

                            {/* Passcode Option */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="use-passcode"
                                        checked={usePasscode}
                                        onChange={(e) => setUsePasscode(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="use-passcode" className="flex items-center gap-2 cursor-pointer">
                                        <Lock size={16} className="text-slate-500" />
                                        <span className="font-bold text-slate-800">Add Passcode Protection</span>
                                    </label>
                                </div>

                                {usePasscode && (
                                    <div className="ml-8 relative">
                                        <input
                                            type={showPasscode ? 'text' : 'password'}
                                            value={passcode}
                                            onChange={(e) => setPasscode(e.target.value)}
                                            placeholder="Enter a passcode"
                                            className="w-full p-3 border border-slate-300 rounded-lg pr-12"
                                            minLength={4}
                                            required={usePasscode}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasscode(!showPasscode)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPasscode ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Share this passcode separately with the recipient.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* EC Context Toggle */}
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="ec-context"
                                    className="w-5 h-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                                />
                                <div className="flex-1">
                                    <label htmlFor="ec-context" className="font-bold text-slate-800 cursor-pointer">
                                        Include EC Context
                                    </label>
                                    <p className="text-xs text-slate-500">
                                        Add nervous system context, calming strategies, and sensory needs to help teachers understand regulation.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-100">
                                <p className="font-bold mb-2">Included Data Preview:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>{logs.slice(0, 5).length} Logs (Most recent)</li>
                                    <li>{strategies.filter(s => s.status === 'active').length} Active Strategies</li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Generating...' : 'Generate Secure Link'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                <CheckCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Packet Ready!</h3>
                                <p className="text-slate-600">Share this link with {recipient}.</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <input readOnly value={generatedLink} className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-600" />
                                <button onClick={copyToClipboard} className="p-3 bg-slate-200 rounded-lg hover:bg-slate-300">
                                    <Copy size={20} />
                                </button>
                            </div>

                            {usePasscode && (
                                <div className="flex items-center gap-2 justify-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                                    <Lock size={16} />
                                    <span className="text-sm">Remember to share the passcode separately!</span>
                                </div>
                            )}

                            <div className="text-xs text-slate-400">
                                This link expires in 7 days. You can revoke it anytime below.
                            </div>

                            <button onClick={closeGenerator} className="text-indigo-600 font-bold hover:underline">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Active Packets List */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Links</h3>
                {activePackets.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No active shared packets.
                    </div>
                ) : (
                    activePackets.map(packet => (
                        <div key={packet.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-800">{packet.recipientName}</h4>
                                    {packet.hasPasscode && (
                                        <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                            <Lock size={12} /> Protected
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Generated: {packet.generatedAt?.toDate ? format(packet.generatedAt.toDate(), 'MMM d') : 'Just now'} •
                                    Expires: {packet.expiresAt?.toDate ? format(packet.expiresAt.toDate(), 'MMM d') : '7 days'} •
                                    Views: {packet.views || 0}
                                </p>
                            </div>
                            <button
                                onClick={() => { if (confirm('Revoke access? The link will stop working immediately.')) revokePacket(packet.id); }}
                                className="text-xs font-bold text-red-600 border border-red-100 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                            >
                                Revoke Access
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Revoked packets indicator */}
            {packets.filter(p => p.revoked).length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <AlertCircle size={14} />
                    {packets.filter(p => p.revoked).length} revoked packet(s) hidden
                </div>
            )}
        </div>
    );
}
