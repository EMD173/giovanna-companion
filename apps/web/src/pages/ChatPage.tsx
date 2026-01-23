/**
 * The Oracle - Chat Interface
 * 
 * Ruth E. Carter-inspired design.
 * Regal, grounded, Afrofuturist wisdom.
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, MessageCircle } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';

export function ChatPage() {
    const { activeChild } = useFamily();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
        { role: 'assistant', content: `Welcome, honored one. I am here to share wisdom about ${activeChild?.firstName || 'your child'}. What challenge weighs on your heart today?` }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        // Simulate AI response for visual demo
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "In the language of our ancestors: behavior is communication. Your child's refusal speaks of an unmet need—perhaps sensory, perhaps emotional. Consider creating a 'transition ritual' before dinner: dim lights, soft music, a moment of connection. Would you like me to craft specific words for this moment?"
            }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-3xl mx-auto px-4">
            {/* Header - Dignified */}
            <div className="py-6 border-b border-[var(--parchment)]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--regal-purple)] to-[var(--regal-purple-dark)] flex items-center justify-center shadow-lg">
                        <Sparkles size={24} className="text-[var(--gold-shimmer)]" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-[var(--deep-ebony)] tracking-wide">
                            The Oracle
                        </h1>
                        <p className="text-sm text-[var(--warm-stone)] font-medium">
                            Ancestral Wisdom for Modern Parenting
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area - Layered Wisdom */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                                ? 'bg-[var(--deep-ebony)] text-[var(--gold-accent)]'
                                : 'bg-gradient-to-br from-[var(--regal-purple)] to-[var(--regal-purple-dark)] text-[var(--gold-shimmer)]'
                            }`}>
                            {msg.role === 'user' ? <User size={18} /> : <MessageCircle size={18} />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'bubble-user' : 'bubble-oracle'}`}>
                            <p className="text-[15px] leading-relaxed font-medium">
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Loading State - Ancestral Pulse */}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--regal-purple)] to-[var(--regal-purple-dark)] flex items-center justify-center text-[var(--gold-shimmer)]">
                            <MessageCircle size={18} />
                        </div>
                        <div className="bubble-oracle">
                            <div className="loading-oracle flex gap-2">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Gold-Bordered Oracle's Voice */}
            <div className="py-4 border-t border-[var(--parchment)]">
                <div className="flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Speak your challenge..."
                            className="input-oracle resize-none pr-4"
                            rows={1}
                            style={{ minHeight: '52px', maxHeight: '120px' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="btn-regal btn-gold w-12 h-12 p-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <Send size={20} className="translate-x-[-1px]" />
                    </button>
                </div>
                <p className="text-center text-xs uppercase font-semibold text-[var(--soft-stone)] mt-3 tracking-widest">
                    Wisdom Rooted in Research
                </p>
            </div>
        </div>
    );
}
