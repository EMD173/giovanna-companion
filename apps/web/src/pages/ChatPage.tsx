/**
 * The Oracle — Context-Aware AI Chat (Week 4 Upgrade)
 *
 * Full context intelligence:
 *   - Injects child profile + last 10 ABC logs + detected patterns
 *   - Conversation persistence via Firestore (survives navigation)
 *   - Adaptive suggested questions based on recent log patterns
 *   - Crisis detection triggers instant local response (no API latency)
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Sparkles, User, ArrowUp, Mic, MicOff, AlertTriangle, RotateCcw, TrendingUp } from 'lucide-react';
import { useFamily } from '../contexts/FamilyContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useABCLogs, type ABCEntry } from '../hooks/useABCLogs';
import { useConversations, type ChatMessage } from '../hooks/useConversations';
import { sendMessage } from '../services/aiService';
import { sanctuary, typography } from '../shared/theme';

// ============================================
// PATTERN DETECTION ENGINE
// ============================================

interface DetectedPattern {
    type: 'trigger' | 'time' | 'function' | 'escalation' | 'context';
    label: string;
    detail: string;
    suggestedQuestion: string;
}

function detectPatterns(logs: ABCEntry[]): DetectedPattern[] {
    if (logs.length < 3) return [];
    const patterns: DetectedPattern[] = [];
    const recent = logs.slice(0, 10);

    // 1. Recurring antecedent triggers
    const antecedentCounts: Record<string, number> = {};
    recent.forEach(log => {
        const words = log.antecedent?.toLowerCase().split(/\s+/) || [];
        const keywords = ['transition', 'demand', 'denied', 'noise', 'change', 'wait',
            'homework', 'school', 'morning', 'bedtime', 'food', 'sibling', 'screen',
            'leaving', 'new', 'unexpected', 'routine', 'sensory'];
        keywords.forEach(kw => {
            if (words.some(w => w.includes(kw))) {
                antecedentCounts[kw] = (antecedentCounts[kw] || 0) + 1;
            }
        });
    });
    const topTrigger = Object.entries(antecedentCounts).sort((a, b) => b[1] - a[1])[0];
    if (topTrigger && topTrigger[1] >= 2) {
        patterns.push({
            type: 'trigger',
            label: `"${topTrigger[0]}" appears in ${topTrigger[1]} of ${recent.length} recent logs`,
            detail: `The word "${topTrigger[0]}" shows up frequently in antecedents.`,
            suggestedQuestion: `I'm seeing "${topTrigger[0]}" come up a lot as a trigger. Can you help me with strategies for ${topTrigger[0]}-related situations?`
        });
    }

    // 2. Time-of-day clustering
    const timeCounts: Record<string, number> = {};
    recent.forEach(log => {
        if (log.timeOfDay) timeCounts[log.timeOfDay] = (timeCounts[log.timeOfDay] || 0) + 1;
    });
    const peakTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];
    if (peakTime && peakTime[1] >= 3) {
        patterns.push({
            type: 'time',
            label: `${peakTime[1]} of ${recent.length} logs happen in the ${peakTime[0]}`,
            detail: `Most behaviors cluster in the ${peakTime[0]}.`,
            suggestedQuestion: `Most of our challenges happen in the ${peakTime[0]}. What does that pattern mean, and how can we prepare?`
        });
    }

    // 3. Function hypothesis clustering
    const funcCounts: Record<string, number> = {};
    recent.forEach(log => {
        if (log.functionHypothesis) funcCounts[log.functionHypothesis] = (funcCounts[log.functionHypothesis] || 0) + 1;
    });
    const topFunc = Object.entries(funcCounts).sort((a, b) => b[1] - a[1])[0];
    if (topFunc && topFunc[1] >= 2) {
        const funcLabels: Record<string, string> = {
            escape: 'avoidance/escape',
            attention: 'connection-seeking',
            tangible: 'access to preferred items',
            sensory: 'sensory regulation'
        };
        patterns.push({
            type: 'function',
            label: `Primary function: ${funcLabels[topFunc[0]] || topFunc[0]}`,
            detail: `${topFunc[1]} recent logs suggest ${funcLabels[topFunc[0]] || topFunc[0]} as the primary function.`,
            suggestedQuestion: `The data suggests many of these behaviors serve a ${funcLabels[topFunc[0]] || topFunc[0]} function. What are evidence-based strategies for this?`
        });
    }

    // 4. Intensity escalation trend
    if (recent.length >= 5) {
        const recentAvg = recent.slice(0, 3).reduce((s, l) => s + l.intensity, 0) / 3;
        const olderAvg = recent.slice(-3).reduce((s, l) => s + l.intensity, 0) / 3;
        if (recentAvg > olderAvg + 1.5) {
            patterns.push({
                type: 'escalation',
                label: `Intensity trending up (${olderAvg.toFixed(1)} → ${recentAvg.toFixed(1)})`,
                detail: 'Recent logs show higher intensity than earlier ones.',
                suggestedQuestion: `I'm noticing the intensity of behaviors has been increasing lately. What should I be watching for, and when should I seek additional support?`
            });
        }
    }

    // 5. Context clustering
    const contextCounts: Record<string, number> = {};
    recent.forEach(log => {
        (log.context || []).forEach(ctx => {
            contextCounts[ctx] = (contextCounts[ctx] || 0) + 1;
        });
    });
    const topContext = Object.entries(contextCounts).sort((a, b) => b[1] - a[1])[0];
    if (topContext && topContext[1] >= 3) {
        patterns.push({
            type: 'context',
            label: `"${topContext[0]}" environment in ${topContext[1]} of ${recent.length} logs`,
            detail: `The ${topContext[0]} environment appears most frequently.`,
            suggestedQuestion: `A lot of behaviors happen in the "${topContext[0]}" environment. How can I modify this setting to better support regulation?`
        });
    }

    return patterns;
}

// ============================================
// FULL CONTEXT BUILDER (Last 10 Logs)
// ============================================

function buildFullContext(child: any, logs: ABCEntry[], patterns: DetectedPattern[]): string {
    if (!child) return '';
    const parts: string[] = [];

    // Child identity
    parts.push(`=== CHILD PROFILE ===`);
    parts.push(`Name: ${child.preferredName || child.firstName}, pronouns: ${child.pronouns || 'they/them'}`);
    if (child.diagnoses?.length > 0) {
        parts.push(`Diagnoses: ${child.diagnoses.map((d: any) => d.name).join(', ')}`);
    }

    // Communication
    if (child.communicationStyle) {
        parts.push(`\nCommunication: ${child.communicationStyle.primaryMode || 'verbal'}`);
        if (child.communicationStyle.expressiveLevel) parts.push(`Expressive level: ${child.communicationStyle.expressiveLevel}`);
        if (child.communicationStyle.receptiveLevel) parts.push(`Receptive level: ${child.communicationStyle.receptiveLevel}`);
        if (child.communicationStyle.triggers?.length > 0) parts.push(`Known triggers: ${child.communicationStyle.triggers.join(', ')}`);
        if (child.communicationStyle.calmingStrategies?.length > 0) parts.push(`Calming strategies: ${child.communicationStyle.calmingStrategies.join(', ')}`);
    }

    // Strengths & Interests
    if (child.strengths?.length > 0) parts.push(`Strengths: ${child.strengths.join(', ')}`);
    if (child.interests?.length > 0) parts.push(`Interests: ${child.interests.join(', ')}`);

    // School context
    if (child.currentSchool) {
        parts.push(`\nSchool: ${child.currentSchool.name || 'Not specified'}`);
        if (child.currentSchool.hasIEP) parts.push('Has an IEP');
        if (child.currentSchool.has504) parts.push('Has a 504 Plan');
    }
    if (child.currentGrade) parts.push(`Grade: ${child.currentGrade}`);

    // Sensory needs
    if (child.medicalInfo?.sensoryNeeds?.length > 0) {
        parts.push(`\nSensory needs: ${child.medicalInfo.sensoryNeeds.join(', ')}`);
    }

    // Homeplace supports
    if (child.homeplaceSupports) {
        const hp = child.homeplaceSupports;
        const supports = [
            ...(hp.calmingPractices || []),
            ...(hp.sensoryTools || []),
            ...(hp.movement || [])
        ].slice(0, 8);
        if (supports.length > 0) parts.push(`\nRegulation supports: ${supports.join(', ')}`);
    }

    // Narrative
    if (child.narrative) {
        if (child.narrative.whoTheyAre) parts.push(`\nWho they are: ${child.narrative.whoTheyAre}`);
        if (child.narrative.whatHelps) parts.push(`What helps: ${child.narrative.whatHelps}`);
    }

    // Last 10 ABC logs
    if (logs.length > 0) {
        parts.push(`\n=== RECENT BEHAVIOR LOGS (${Math.min(logs.length, 10)} of ${logs.length} total) ===`);
        const recentLogs = logs.slice(0, 10);
        const avgIntensity = recentLogs.reduce((s, l) => s + l.intensity, 0) / recentLogs.length;
        parts.push(`Average intensity: ${avgIntensity.toFixed(1)}/10`);

        recentLogs.forEach((log, i) => {
            const timeStr = log.timeOfDay || '';
            const funcStr = log.functionHypothesis ? ` [${log.functionHypothesis}]` : '';
            parts.push(`\nLog ${i + 1} (${timeStr}${funcStr}, intensity ${log.intensity}/10):`);
            parts.push(`  A: ${log.antecedent}`);
            parts.push(`  B: ${log.behavior}`);
            parts.push(`  C: ${log.consequence}`);
            if (log.context?.length > 0) parts.push(`  Context: ${log.context.join(', ')}`);
            if (log.notes) parts.push(`  Notes: ${log.notes}`);
        });
    }

    // Detected patterns
    if (patterns.length > 0) {
        parts.push(`\n=== DETECTED PATTERNS ===`);
        patterns.forEach(p => {
            parts.push(`• ${p.label}: ${p.detail}`);
        });
    }

    return parts.join('\n');
}

// ============================================
// CRISIS DETECTION
// ============================================

const CRISIS_KEYWORDS = [
    'meltdown', "can't handle", "won't stop", 'hitting', 'hurting',
    'self-harm', 'emergency', 'scared', 'help me', "can't do this", 'overwhelmed',
    'breaking down', 'losing it', 'running away', 'violent', 'dangerous',
    'eloping', 'bolting', 'head banging', 'biting', 'screaming non-stop',
    'i want to give up', 'i can\'t breathe', 'panic'
];

function detectCrisis(text: string): boolean {
    const lower = text.toLowerCase();
    return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

function buildCrisisResponse(child: any): string {
    const childName = child?.preferredName || child?.firstName || 'your child';
    const calmingStrategies = child?.communicationStyle?.calmingStrategies || [];
    const sensoryTools = child?.homeplaceSupports?.sensoryTools || [];
    const movement = child?.homeplaceSupports?.movement || [];

    // Personalized calming strategies from child profile
    const allStrategies = [
        ...calmingStrategies.map((s: string) => `• ${s}`),
        ...sensoryTools.slice(0, 2).map((s: string) => `• Offer: ${s}`),
        ...movement.slice(0, 1).map((s: string) => `• Try: ${s}`)
    ];

    const calmingList = allStrategies.length > 0
        ? allStrategies.join('\n')
        : '• Deep pressure (tight hug if they accept)\n• Remove from overwhelming environment\n• Lower your voice, slow your movements\n• Offer their favorite sensory tool';

    return `🛡️ **I hear you. You are safe. Let's take this one breath at a time.**

**Right now, for ${childName}:**
${calmingList}

**For YOU:**
• You are not failing. This is the hardest job in the world.
• If you need to step away for 60 seconds, that's okay.
• Text your Village contact if you need backup.

*When you're ready, I can help you log what happened so we can find the pattern together.*`;
}

// ============================================
// ADAPTIVE SUGGESTED QUESTIONS
// ============================================

function getAdaptiveQuestions(patterns: DetectedPattern[], child: any): string[] {
    const questions: string[] = [];

    // Pattern-driven questions (highest priority)
    patterns.slice(0, 2).forEach(p => {
        questions.push(p.suggestedQuestion);
    });

    // Child-context questions
    if (child?.currentSchool?.hasIEP) {
        questions.push('Help me prepare for our next IEP meeting');
    }

    // Fill remaining slots with defaults
    const defaults = [
        'Help with de-escalation strategies',
        'Draft a teacher email about what we\'re seeing',
        'Explain what this behavior might be communicating',
        'What questions should I ask at our next therapy session?',
        'Help me understand sensory seeking vs. sensory avoiding'
    ];

    defaults.forEach(d => {
        if (questions.length < 5 && !questions.some(q => q.toLowerCase().includes(d.split(' ')[2]?.toLowerCase() || ''))) {
            questions.push(d);
        }
    });

    return questions.slice(0, 5);
}

// ============================================
// CHAT PAGE COMPONENT
// ============================================

export function ChatPage() {
    const { activeChild } = useFamily();
    const { canUseAI, getRemainingAIQueries, shouldShowUpgrade } = useSubscription();
    const { logs } = useABCLogs();
    const {
        messages: persistedMessages,
        loading: convoLoading,
        addMessage,
        archiveAndStartNew
    } = useConversations(activeChild?.id || null);

    const [input, setInput] = useState('');
    const [isCrisisMode, setIsCrisisMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);
    const [showPatterns, setShowPatterns] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasInitialized = useRef(false);

    // Detect patterns from logs
    const patterns = useMemo(() => detectPatterns(logs), [logs]);
    const suggestedQuestions = useMemo(
        () => getAdaptiveQuestions(patterns, activeChild),
        [patterns, activeChild]
    );

    // DEMO MODE: Pre-scripted conversation showing how the Oracle works
    const isDemoMode = localStorage.getItem('DEMO_MODE') === 'true';

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(scrollToBottom, [messages, scrollToBottom]);

    // Load persisted messages OR show initial greeting (runs once)
    useEffect(() => {
        if (convoLoading) return;
        if (hasInitialized.current) return;

        hasInitialized.current = true;

        if (isDemoMode) {
            // In demo mode, show a pre-scripted conversation that demonstrates the Oracle's capabilities
            const childName = activeChild?.preferredName || activeChild?.firstName || 'Amara';
            setMessages([
                {
                    role: 'assistant',
                    content: `Welcome, honored one. I am here to walk alongside you on this journey with ${childName}. I understand you may carry the weight of navigating systems that weren't built for you — but you are not alone.\n\nI've been reviewing ${childName}'s recent behavioral data and I see some important patterns we should talk about.`,
                    timestamp: new Date(Date.now() - 300000)
                },
                {
                    role: 'user',
                    content: `I've been logging ${childName}'s behaviors for a couple weeks. What are you seeing?`,
                    timestamp: new Date(Date.now() - 240000)
                },
                {
                    role: 'assistant',
                    content: `Based on ${childName}'s 5 recent entries, here's what I'm seeing — and this applies everywhere, not just school:\n\n📊 **Top Triggers:**\n• **Routine/schedule changes** appear in 3 of 5 logs (60%) — this is ${childName}'s most consistent trigger\n• **Sensory overload** (noise, crowded spaces) appears in 2 of 5 logs\n\n⏰ **Time Patterns:**\n• Most incidents cluster in the **afternoon** — right after transitions\n\n🧠 **Function Analysis:**\n• 3 of 5 behaviors serve an **escape** function — ${childName} is trying to get away from overwhelming situations\n• 2 serve a **sensory** function — seeking regulation\n\n💡 **What's Working:**\nWhen ${childName} receives **noise-canceling headphones + a quiet space**, she consistently self-regulates within 3-5 minutes.\n\n**This means:** ${childName}'s nervous system needs **predictability and sensory safety** — at home, at school, at the grocery store, at church. These aren't "behaviors" — they're communication. And now you have the data to prove it.`,
                    timestamp: new Date(Date.now() - 180000)
                },
                {
                    role: 'user',
                    content: `So what do I actually DO with this? How does this help me?`,
                    timestamp: new Date(Date.now() - 120000)
                },
                {
                    role: 'assistant',
                    content: `This is what makes this approach different — you're not just getting school accommodations. You're getting **individualized strategies for every setting:**\n\n🏠 **At Home:**\n• Post a visual schedule in the kitchen — update it each morning together\n• Give 5-minute warnings before ANY routine change\n• Keep noise-canceling headphones accessible in every room\n\n🏫 **At School:**\n• Share your Behavioral Intelligence Report with her teacher and request these as accommodations\n• "I have 5 documented entries showing that when ${childName} receives advance transition warnings, she self-regulates within 3-5 minutes"\n\n🏥 **At Therapy / Doctor:**\n• Share the same data with OT, speech, or behavioral providers — they can build on YOUR patterns, not start from scratch\n\n🛒 **In the Community:**\n• Grocery store? Bring the headphones. Plan for a calm-down space before you go\n• Predict the triggers, prepare the supports\n\n💪 **The bottom line:** You now have what used to require a $5,000 behavioral assessment — documented, data-driven understanding of YOUR child. And it came from 10-second voice notes on your phone.\n\n*This is behavioral intelligence. It's never been available like this before.*`,
                    timestamp: new Date(Date.now() - 60000)
                },
            ]);
            return;
        }

        if (persistedMessages.length > 0) {
            setMessages(persistedMessages);
        } else {
            const childName = activeChild?.preferredName || activeChild?.firstName || 'your child';
            const patternHint = patterns.length > 0
                ? `\n\nI've been reviewing ${childName}'s recent patterns — I see some insights we can explore when you're ready.`
                : '';
            setMessages([{
                role: 'assistant',
                content: `Welcome, honored one. I am here to walk alongside you on this journey with ${childName}. I understand you may carry the weight of navigating systems that weren't built for you — but you are not alone.\n\nI know ${childName}'s profile and recent patterns. What's on your heart today?${patternHint}`,
                timestamp: new Date()
            }]);
        }
    }, [convoLoading, persistedMessages, activeChild, patterns.length, isDemoMode]);

    // Voice-to-text
    const toggleVoice = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;

        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + ' ' + transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    // ============================================
    // SEND MESSAGE — REAL AI WITH FULL CONTEXT
    // ============================================

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setAiError(null);
        if (textareaRef.current) textareaRef.current.style.height = '52px';

        // Crisis detection — immediate local response (no AI latency)
        const crisis = detectCrisis(userMsg);
        if (crisis && !isCrisisMode) setIsCrisisMode(true);

        const userMessage: ChatMessage = { role: 'user', content: userMsg, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // DEMO MODE: keyword-based responder — no API needed
        if (isDemoMode) {
            const childName = activeChild?.preferredName || activeChild?.firstName || 'your child';
            const lower = userMsg.toLowerCase();
            let demoResponse = '';

            if (lower.includes('strategy') || lower.includes('help') || lower.includes('calm') || lower.includes('what do i do')) {
                demoResponse = `Based on ${childName}'s patterns, here are strategies tailored to her specific triggers:\n\n🏠 **At Home:**\n• Before any routine change, give a 5-minute verbal + visual countdown\n• Keep noise-canceling headphones in every room she uses\n• Create a "calm corner" with her weighted blanket and fidget tools\n\n🏫 **At School:**\n• Request a visual schedule at her desk, updated each morning\n• Ask for a designated quiet space she can access independently\n\n🛒 **In the Community:**\n• Bring headphones to the grocery store. Plan for sensory breaks.\n• Preview new environments with photos before visiting\n\n*In your real account, these strategies would update automatically as you log more moments. **[Sign up free](/)** to get strategies built from YOUR child's data.*`;
            } else if (lower.includes('trigger') || lower.includes('pattern') || lower.includes('why')) {
                demoResponse = `Great question. From ${childName}'s 5 logged moments, the data shows:\n\n📊 **Primary trigger:** Routine/schedule changes (60% of incidents)\n📊 **Secondary trigger:** Sensory overload — noise and crowds (40%)\n⏰ **Peak time:** Afternoons, especially during transitions\n🧠 **Function:** Mostly escape-driven — ${childName} is trying to get away from overwhelming input\n\nThis pattern is consistent with sensory processing differences. The good news? Once you know the pattern, you can **predict and prevent** instead of just react.\n\n*With a full account, Insight analyzes YOUR child's unique patterns in real-time. **[Sign up free](/)** to start.*`;
            } else if (lower.includes('school') || lower.includes('teacher') || lower.includes('iep')) {
                demoResponse = `Here's how to present your behavioral intelligence to ${childName}'s school:\n\n📋 **What to say:**\n"I've been documenting ${childName}'s behaviors using a structured framework. I have data showing that 60% of incidents are triggered by unexpected routine changes, and that advance warnings reduce incidents significantly."\n\n✅ **What to request:**\n1. Visual schedule at her desk\n2. 5-minute transition warnings\n3. Quiet space access\n4. Noise-canceling headphones in class\n\n*Your Behavioral Intelligence Report is printable and shareable — ready for any meeting. **[Sign up free](/)** to generate yours.*`;
            } else if (lower.includes('doctor') || lower.includes('therapy') || lower.includes('therapist')) {
                demoResponse = `When sharing with ${childName}'s providers:\n\n🏥 **For the pediatrician/specialist:**\nShare your Behavioral Intelligence Report — it shows documented triggers, function analysis, and what calming strategies are already working. This saves them from starting assessments from scratch.\n\n💆 **For OT/Speech/Behavioral therapists:**\nYour data shows ${childName} responds best to sensory regulation tools (headphones, weighted blanket). Therapists can build on YOUR documented patterns instead of guessing.\n\n*In your full account, you can generate separate share packets for each provider. **[Sign up free](/)** to start.*`;
            } else {
                demoResponse = `That's a great question! In your full account, Insight would analyze ${childName}'s specific behavioral data to give you a personalized answer.\n\nHere's what Insight can do with YOUR data:\n• 🔍 Identify triggers you might not see yourself\n• 📊 Track patterns over time — weekly, monthly trends\n• 🧠 Analyze the function behind every behavior\n• 💡 Suggest individualized strategies for home, school, therapy, and community\n• 📄 Generate shareable reports for teachers, doctors, and therapists\n\n*This kind of behavioral intelligence has never been available to parents before. **[Sign up free](/)** to try it with your own child's data.*`;
            }

            setTimeout(() => {
                const assistantMsg: ChatMessage = {
                    role: 'assistant',
                    content: demoResponse,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMsg]);
                setIsLoading(false);
            }, 1200); // Small delay to feel natural
            return;
        }

        // Persist user message
        try { await addMessage(userMessage); } catch (e) { console.error('Failed to persist message:', e); }

        if (crisis) {
            const crisisMsg: ChatMessage = {
                role: 'crisis',
                content: buildCrisisResponse(activeChild),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, crisisMsg]);
            try { await addMessage(crisisMsg); } catch (e) { /* non-blocking */ }
            setIsLoading(false);
            return;
        }

        // Check usage limits
        if (!canUseAI()) {
            const limitMsg: ChatMessage = {
                role: 'assistant',
                content: `You've reached your monthly AI queries. Your wisdom and your data are still here — the ABC logs, strategies, and share packets all work without AI. If you'd like more Oracle access, you can upgrade from Settings.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, limitMsg]);
            try { await addMessage(limitMsg); } catch (e) { /* non-blocking */ }
            setIsLoading(false);
            return;
        }

        // Build FULL context-enriched message
        const fullContext = buildFullContext(activeChild, logs, patterns);
        const contextBlock = fullContext ? `[CHILD CONTEXT & BEHAVIORAL DATA:\n${fullContext}]\n\n` : '';

        // Conversation history (last 8 messages for continuity)
        const recentHistory = messages
            .filter(m => m.role !== 'crisis')
            .slice(-8)
            .map(m => `${m.role === 'user' ? 'Parent' : 'Giovanna'}: ${m.content}`)
            .join('\n\n');

        const fullMessage = `${contextBlock}${recentHistory ? `[CONVERSATION HISTORY:\n${recentHistory}]\n\n` : ''}Parent: ${userMsg}`;

        try {
            const result = await sendMessage(fullMessage);

            const responseMsg: ChatMessage = {
                role: 'assistant',
                content: result.error
                    ? (result.response || "I'm having trouble connecting right now. Your data and tools are still here — try again in a moment.")
                    : result.response,
                timestamp: new Date()
            };

            if (result.error) setAiError(result.error);

            setMessages(prev => [...prev, responseMsg]);
            try { await addMessage(responseMsg); } catch (e) { /* non-blocking */ }

        } catch (error) {
            console.error('Oracle AI error:', error);
            const errorMsg: ChatMessage = {
                role: 'assistant',
                content: "I'm having trouble connecting right now. Your data and tools are still here — try again in a moment.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            try { await addMessage(errorMsg); } catch (e) { /* non-blocking */ }
        } finally {
            setIsLoading(false);
        }
    };

    // ============================================
    // NEW CONVERSATION
    // ============================================

    const handleNewConversation = async () => {
        await archiveAndStartNew();
        const childName = activeChild?.preferredName || activeChild?.firstName || 'your child';
        setMessages([{
            role: 'assistant',
            content: `Fresh start, honored one. I'm still here with everything I know about ${childName}. What's on your mind?`,
            timestamp: new Date()
        }]);
    };

    // ============================================
    // RENDER
    // ============================================

    const remaining = getRemainingAIQueries();
    const showUpgrade = shouldShowUpgrade();

    return (
        <div style={{
            background: isCrisisMode ? '#1A1A1A' : sanctuary.bg,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 72px)',
            maxWidth: '860px',
            margin: '0 auto',
            transition: 'background 0.5s ease',
        }}>
            {/* Header */}
            <div className="sanctuary-enter" style={{
                padding: '24px 24px 16px',
                borderBottom: `1px solid ${isCrisisMode ? '#333' : sanctuary.border}`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '16px',
                        background: isCrisisMode
                            ? `linear-gradient(135deg, ${sanctuary.rose}, #8B0000)`
                            : `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isCrisisMode
                            ? '0 4px 16px rgba(184, 84, 80, 0.4)'
                            : '0 4px 16px rgba(107, 76, 154, 0.25)',
                    }}>
                        {isCrisisMode ? <AlertTriangle size={24} color="#FFD700" /> : <Sparkles size={24} color="#E8C97A" />}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '1.5rem', fontWeight: 700,
                            color: isCrisisMode ? '#F5F0E8' : sanctuary.text,
                            letterSpacing: '-0.01em', marginBottom: '2px',
                        }}>
                            {isCrisisMode ? 'Crisis Support' : 'Insight'}
                        </h1>
                        <p style={{
                            fontSize: '0.85rem',
                            color: isCrisisMode ? 'rgba(255,255,255,0.5)' : sanctuary.textMuted,
                            fontFamily: typography.body, fontWeight: 500,
                        }}>
                            {isCrisisMode ? 'You are not alone. I\'m right here.' : 'AI-Powered Behavioral Intelligence'}
                        </p>
                        {!isCrisisMode && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 10px',
                                borderRadius: '100px',
                                background: sanctuary.goldBg,
                                border: `1px solid ${sanctuary.goldBorder}`,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: sanctuary.gold,
                                fontFamily: typography.body,
                                letterSpacing: '0.02em',
                            }}>
                                🧠 Remembers your child's story
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                        {isCrisisMode ? (
                            <button onClick={() => setIsCrisisMode(false)} style={{
                                padding: '8px 14px', borderRadius: '100px',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                color: '#F5F0E8', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                fontFamily: typography.body,
                            }}>Exit Crisis Mode</button>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={handleNewConversation} title="New conversation" style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: sanctuary.textMuted,
                                }}>
                                    <RotateCcw size={15} />
                                </button>
                            </div>
                        )}
                        {!isCrisisMode && remaining !== 'unlimited' && (
                            <span style={{
                                fontSize: '0.72rem', fontWeight: 600,
                                color: showUpgrade ? sanctuary.rose : sanctuary.textMuted,
                                fontFamily: typography.body,
                            }}>
                                {remaining} queries left
                            </span>
                        )}
                    </div>
                </div>

                {/* Pattern Insights Banner */}
                {!isCrisisMode && patterns.length > 0 && (
                    <button
                        onClick={() => setShowPatterns(!showPatterns)}
                        style={{
                            width: '100%', marginTop: '12px', padding: '10px 16px',
                            borderRadius: '12px', border: `1px solid ${sanctuary.sageBorder}`,
                            background: sanctuary.sageBg, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            textAlign: 'left',
                        }}
                    >
                        <TrendingUp size={16} color={sanctuary.sage} />
                        <span style={{
                            fontSize: '0.82rem', fontWeight: 600,
                            color: sanctuary.sage, fontFamily: typography.body, flex: 1,
                        }}>
                            {patterns.length} pattern{patterns.length > 1 ? 's' : ''} detected in recent logs
                        </span>
                        <span style={{ fontSize: '0.75rem', color: sanctuary.textMuted }}>
                            {showPatterns ? 'Hide' : 'View'}
                        </span>
                    </button>
                )}

                {/* Pattern Details */}
                {showPatterns && patterns.length > 0 && (
                    <div style={{
                        marginTop: '8px', padding: '14px',
                        borderRadius: '12px', background: sanctuary.bgCard,
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        {patterns.map((p, i) => (
                            <div key={i} style={{
                                padding: '8px 0',
                                borderBottom: i < patterns.length - 1 ? `1px solid ${sanctuary.borderLight}` : 'none',
                            }}>
                                <p style={{
                                    fontSize: '0.82rem', fontWeight: 600,
                                    color: sanctuary.text, fontFamily: typography.body, marginBottom: '2px',
                                }}>
                                    {p.label}
                                </p>
                                <p style={{ fontSize: '0.78rem', color: sanctuary.textMuted, fontFamily: typography.body }}>
                                    {p.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Adaptive Suggested Questions */}
                {!isCrisisMode && (
                    <div style={{
                        display: 'flex', gap: '8px', marginTop: '12px',
                        overflowX: 'auto', paddingBottom: '2px',
                    }}>
                        {suggestedQuestions.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setInput(prompt); textareaRef.current?.focus(); }}
                                style={{
                                    padding: '8px 14px', borderRadius: '100px',
                                    background: sanctuary.bgCard,
                                    border: `1px solid ${idx < patterns.length ? sanctuary.sageBorder : sanctuary.border}`,
                                    color: idx < patterns.length ? sanctuary.sage : sanctuary.textSecondary,
                                    fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                                    fontFamily: typography.body,
                                }}
                            >
                                {prompt.length > 50 ? prompt.slice(0, 47) + '...' : prompt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '24px',
                display: 'flex', flexDirection: 'column', gap: '20px',
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        display: 'flex', gap: '12px',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: msg.role === 'user' ? sanctuary.goldBg
                                : msg.role === 'crisis' ? `linear-gradient(135deg, ${sanctuary.rose}, #8B0000)`
                                : `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            color: msg.role === 'user' ? sanctuary.gold : '#E8C97A',
                            border: msg.role === 'user' ? `1px solid ${sanctuary.goldBorder}` : 'none',
                        }}>
                            {msg.role === 'user' ? <User size={16} /> : msg.role === 'crisis' ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div style={{
                            maxWidth: '75%', padding: '16px 20px',
                            borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                            background: msg.role === 'user' ? (isCrisisMode ? 'rgba(255,255,255,0.08)' : sanctuary.bgCard)
                                : msg.role === 'crisis' ? 'rgba(184, 84, 80, 0.12)'
                                : (isCrisisMode ? 'rgba(107, 76, 154, 0.15)' : sanctuary.purpleBg),
                            border: msg.role === 'crisis'
                                ? `1px solid ${sanctuary.roseBorder}`
                                : `1px solid ${msg.role === 'user' ? (isCrisisMode ? 'rgba(255,255,255,0.1)' : sanctuary.border) : sanctuary.purpleBorder}`,
                        }}>
                            <p style={{
                                fontSize: '0.92rem', lineHeight: 1.7,
                                color: isCrisisMode ? '#F5F0E8' : sanctuary.text,
                                fontFamily: typography.body, whiteSpace: 'pre-line', margin: 0,
                            }}>
                                {msg.content}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={16} color="#E8C97A" />
                        </div>
                        <div style={{
                            padding: '16px 24px', borderRadius: '20px 20px 20px 6px',
                            background: isCrisisMode ? 'rgba(107, 76, 154, 0.15)' : sanctuary.purpleBg,
                            border: `1px solid ${sanctuary.purpleBorder}`,
                            display: 'flex', gap: '6px', alignItems: 'center',
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: sanctuary.purple, opacity: 0.4,
                                    animation: `gentlePulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }} />
                            ))}
                        </div>
                    </div>
                )}

                {aiError && !isLoading && (
                    <div style={{
                        padding: '12px 16px', borderRadius: '12px',
                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                        fontSize: '0.82rem', color: sanctuary.rose,
                        fontFamily: typography.body, textAlign: 'center',
                    }}>
                        {aiError}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '16px 24px 24px',
                borderTop: `1px solid ${isCrisisMode ? '#333' : sanctuary.border}`,
                background: isCrisisMode ? '#111' : sanctuary.bgCard,
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    <button onClick={toggleVoice} style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        border: isListening ? `2px solid ${sanctuary.rose}` : `1px solid ${isCrisisMode ? '#333' : sanctuary.border}`,
                        background: isListening ? sanctuary.roseBg : (isCrisisMode ? '#1A1A1A' : sanctuary.bg),
                        color: isListening ? sanctuary.rose : sanctuary.textMuted,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    <div style={{ flex: 1 }}>
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isCrisisMode ? "Tell me what's happening..." : "Share what's on your heart..."}
                            rows={1}
                            style={{
                                width: '100%', minHeight: '44px', maxHeight: '120px',
                                padding: '12px 16px', borderRadius: '14px',
                                border: `1.5px solid ${isCrisisMode ? '#333' : sanctuary.border}`,
                                background: isCrisisMode ? '#1A1A1A' : sanctuary.bg,
                                color: isCrisisMode ? '#F5F0E8' : sanctuary.text,
                                fontSize: '0.92rem', fontFamily: typography.body,
                                lineHeight: 1.5, resize: 'none', outline: 'none',
                                boxSizing: 'border-box',
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                            }}
                        />
                    </div>

                    <button onClick={handleSend} disabled={!input.trim() || isLoading} style={{
                        width: '44px', height: '44px', borderRadius: '12px', border: 'none',
                        cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        background: input.trim()
                            ? (isCrisisMode ? sanctuary.rose : `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`)
                            : (isCrisisMode ? '#222' : sanctuary.bgAlt),
                        color: input.trim() ? '#FFFFFF' : sanctuary.textMuted,
                        opacity: input.trim() && !isLoading ? 1 : 0.6,
                    }}>
                        <ArrowUp size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
