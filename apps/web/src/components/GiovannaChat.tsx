import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Loader2 } from 'lucide-react';
import { initialContent } from '../data/learningContent';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface GiovannaChatProps {
    isOpen: boolean;
    onClose: () => void;
    initialPrompt?: string;
}

export function GiovannaChat({ isOpen, onClose, initialPrompt }: GiovannaChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState(initialPrompt || '');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: "Hi, I'm Giovanna! 👋 I can help you understand neurodivergent behaviors, draft emails to teachers, or explain concepts in parent-friendly terms. What would you like help with today?"
            }]);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Call Cloud Function
            const response = await callGiovannaAI(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Chat Window */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-indigo-50 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Giovanna AI</h3>
                            <p className="text-xs text-slate-500">Your neuro-affirming assistant</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user'
                                ? 'bg-teal-600 text-white rounded-br-sm'
                                : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t border-slate-100 p-3 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

/**
 * Calls the Giovanna AI Cloud Function
 * For MVP, this uses a local fallback. In production, wire to Firebase Functions.
 */
async function callGiovannaAI(userMessage: string): Promise<string> {
    // Check if Cloud Function URL is configured
    const functionUrl = import.meta.env.VITE_GIOVANNA_AI_URL;

    if (functionUrl) {
        // Production: Call Cloud Function
        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                context: initialContent // Pass learning content as RAG context
            })
        });

        if (!response.ok) throw new Error('AI request failed');
        const data = await response.json();
        return data.response;
    }

    // MVP Fallback: Local keyword-based responses
    return generateLocalResponse(userMessage);
}

/**
 * Local fallback for demo/MVP when Cloud Function is not configured.
 * Uses keyword matching against the Learning Hub content.
 */
function generateLocalResponse(query: string): string {
    const lowerQuery = query.toLowerCase();

    // Find relevant content
    for (const item of initialContent) {
        if (lowerQuery.includes(item.id) ||
            lowerQuery.includes(item.title.toLowerCase()) ||
            item.category.toLowerCase() === lowerQuery) {

            return `Based on our resources about **${item.title}**:\n\n${item.definition}\n\n**Why it happens:** ${item.whyItHappens}\n\n**School Bridge Script:**\n"${item.whatToShare}"`;
        }
    }

    // Check for common patterns
    if (lowerQuery.includes('email') || lowerQuery.includes('teacher') || lowerQuery.includes('iep')) {
        return "I can help you draft an email! Try asking something like:\n\n- \"Help me explain stimming to my child's teacher\"\n- \"How do I request sensory breaks in an IEP meeting?\"\n\nOr just describe what you need.";
    }

    if (lowerQuery.includes('meltdown') || lowerQuery.includes('tantrum')) {
        const item = initialContent.find(i => i.id === 'meltdown-vs-tantrum');
        if (item) {
            return `Great question! Understanding the difference between meltdowns and tantrums is crucial.\n\n${item.definition}\n\n**For your school team:**\n"${item.whatToShare}"`;
        }
    }

    if (lowerQuery.includes('stim') || lowerQuery.includes('flap') || lowerQuery.includes('rock')) {
        const item = initialContent.find(i => i.id === 'stimming');
        if (item) {
            return `Stimming is often misunderstood. Here's what to know:\n\n${item.definition}\n\n**Important:** ${item.whatToAvoid[0]}\n\n**School Bridge Script:**\n"${item.whatToShare}"`;
        }
    }

    // Default helpful response
    return "I'm here to help you navigate ABA concepts with a neuro-affirming lens. You can ask me to:\n\n• Explain behaviors (stimming, meltdowns, communication)\n• Draft emails to teachers\n• Prepare for IEP meetings\n• Translate ABA language into respectful terms\n\nWhat would be most helpful?";
}
