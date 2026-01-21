import { useState } from 'react';
import { useABCLogs } from '../hooks/useABCLogs';
import { useStrategies } from '../hooks/useStrategies';
import { useSharePackets } from '../hooks/useSharePackets';
import { Share2, CheckCircle, Copy, X } from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../components/Toast';

export function SharePage() {
    const { logs } = useABCLogs();
    const { strategies } = useStrategies();
    const { packets, generatePacket, revokePacket } = useSharePackets();

    const [isCreating, setIsCreating] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient) return;

        // For MVP, we auto-share the last 5 logs and all active strategies
        // Full selection UI would be V2
        const shareLogs = logs.slice(0, 5);
        const shareStrategies = strategies.filter(s => s.status === 'active');

        const result = await generatePacket(recipient, shareLogs, shareStrategies, message);

        // Create the shareable link (assuming client-side route /share/:id/:code)
        const link = `${window.location.origin}/share/${result.id}?code=${result.accessCode}`;
        setGeneratedLink(link);
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
    };

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
                                <input required className="w-full p-3 border border-slate-300 rounded-lg" placeholder="e.g. Ms. Johnson" value={recipient} onChange={e => setRecipient(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message (Optional)</label>
                                <textarea className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Notes for the teacher..." value={message} onChange={e => setMessage(e.target.value)} />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 border border-slate-100">
                                <p className="font-bold mb-2">Included Data Preview:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>{logs.slice(0, 5).length} Logs (Most recent)</li>
                                    <li>{strategies.filter(s => s.status === 'active').length} Active Strategies</li>
                                </ul>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">
                                Generate Secure Link
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
                {packets.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No active shared packets.
                    </div>
                ) : (
                    packets.map(packet => (
                        <div key={packet.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">{packet.recipientName}</h4>
                                <p className="text-xs text-slate-500">
                                    Generated: {packet.generatedAt?.toDate ? format(packet.generatedAt.toDate(), 'MMM d') : 'Just now'} •
                                    Expires: {packet.expiresAt?.toDate ? format(packet.expiresAt.toDate(), 'MMM d') : '7 days'}
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
        </div>
    );
}
