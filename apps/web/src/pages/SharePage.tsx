/**
 * The Bridge — Home-School Share Packet System (Week 7)
 *
 * Structured two-way communication protocol:
 *   - Likes, Needs, Do-Nots, What We've Learned, Strategies That Work
 *   - EC context section (regulation context, sensory needs, communication)
 *   - Guardrails validation before generation
 *   - Recent ABC log patterns auto-summarized
 *   - Privacy-first: passcode protection, 7-day expiry, revokable
 */

import { useState, useMemo } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useABCLogs, type ABCEntry } from '../hooks/useABCLogs';
import { useStrategies } from '../hooks/useStrategies';
import { useSharePackets } from '../hooks/useSharePackets';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
    Share2, CheckCircle, Copy, X, Lock, Eye, EyeOff,
    AlertCircle, FileText, Shield, BookOpen,
    ChevronDown, ChevronUp, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { showToast } from '../components/Toast';
import { validateContent, generateECContextSection } from '../lib/guardrails';
import { sanctuary, typography } from '../shared/theme';

// ============================================
// COMMUNICATION PROTOCOL BUILDER
// ============================================

interface CommunicationProtocol {
    likes: string[];
    needs: string[];
    doNots: string[];
    currentlyWorkingOn: string[];
    strategiesThatWork: string[];
    whatWeVeLearned: string[];
}

function buildProtocolFromProfile(child: any, logs: ABCEntry[]): CommunicationProtocol {
    const protocol: CommunicationProtocol = {
        likes: [],
        needs: [],
        doNots: [],
        currentlyWorkingOn: [],
        strategiesThatWork: [],
        whatWeVeLearned: []
    };

    if (!child) return protocol;

    // Likes — from interests and strengths
    protocol.likes = [
        ...(child.interests || []),
        ...(child.strengths || []).map((s: string) => `Strength: ${s}`)
    ];

    // Needs — from sensory needs + communication
    if (child.communicationStyle) {
        protocol.needs.push(`Communication: ${child.communicationStyle.primaryMode || 'verbal'}`);
        if (child.communicationStyle.bestTimeToTalk) {
            protocol.needs.push(`Best time to communicate: ${child.communicationStyle.bestTimeToTalk}`);
        }
    }
    if (child.medicalInfo?.sensoryNeeds?.length > 0) {
        protocol.needs.push(...child.medicalInfo.sensoryNeeds.map((n: string) => `Sensory: ${n}`));
    }
    if (child.homeplaceSupports?.sensoryTools?.length > 0) {
        protocol.needs.push(...child.homeplaceSupports.sensoryTools.slice(0, 3).map((t: string) => `Needs access to: ${t}`));
    }

    // Do-Nots — from triggers
    if (child.communicationStyle?.triggers?.length > 0) {
        protocol.doNots.push(...child.communicationStyle.triggers.map((t: string) => `Avoid: ${t}`));
    }

    // Strategies that work — from calming strategies + homeplace
    if (child.communicationStyle?.calmingStrategies?.length > 0) {
        protocol.strategiesThatWork.push(...child.communicationStyle.calmingStrategies);
    }
    if (child.homeplaceSupports?.calmingPractices?.length > 0) {
        protocol.strategiesThatWork.push(...child.homeplaceSupports.calmingPractices.slice(0, 3));
    }

    // What We've Learned — from recent logs
    if (logs.length >= 3) {
        const recent = logs.slice(0, 10);

        // Function hypothesis pattern
        const funcCounts: Record<string, number> = {};
        recent.forEach(l => {
            if (l.functionHypothesis) funcCounts[l.functionHypothesis] = (funcCounts[l.functionHypothesis] || 0) + 1;
        });
        const topFunc = Object.entries(funcCounts).sort((a, b) => b[1] - a[1])[0];
        if (topFunc && topFunc[1] >= 2) {
            const labels: Record<string, string> = {
                escape: 'avoidance/escape', attention: 'connection-seeking',
                tangible: 'access to items', sensory: 'sensory regulation'
            };
            protocol.whatWeVeLearned.push(`Most behaviors serve a ${labels[topFunc[0]] || topFunc[0]} function`);
        }

        // Time pattern
        const timeCounts: Record<string, number> = {};
        recent.forEach(l => { if (l.timeOfDay) timeCounts[l.timeOfDay] = (timeCounts[l.timeOfDay] || 0) + 1; });
        const peakTime = Object.entries(timeCounts).sort((a, b) => b[1] - a[1])[0];
        if (peakTime && peakTime[1] >= 3) {
            protocol.whatWeVeLearned.push(`Behaviors cluster in the ${peakTime[0]} — extra support may help during this time`);
        }

        // Average intensity
        const avgIntensity = recent.reduce((s, l) => s + l.intensity, 0) / recent.length;
        protocol.whatWeVeLearned.push(`Average behavior intensity: ${avgIntensity.toFixed(1)}/10 across ${recent.length} recent observations`);
    }

    return protocol;
}

// ============================================
// SHARE PAGE COMPONENT
// ============================================

export function SharePage() {
    const { activeChild } = useFamily();
    const { logs } = useABCLogs();
    const { strategies } = useStrategies();
    const { packets, generatePacket, revokePacket } = useSharePackets();
    const { canCreateSharePacket, incrementShareUsage } = useSubscription();

    const [isCreating, setIsCreating] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [recipientRole, setRecipientRole] = useState<'teacher' | 'therapist' | 'doctor' | 'other'>('teacher');
    const [message, setMessage] = useState('');
    const [passcode, setPasscode] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    const [usePasscode, setUsePasscode] = useState(false);
    const [includeECContext, setIncludeECContext] = useState(true);
    const [includeLogs, setIncludeLogs] = useState(true);
    const [includeProtocol, setIncludeProtocol] = useState(true);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [guardrailWarnings, setGuardrailWarnings] = useState<string[]>([]);
    const [showProtocolPreview, setShowProtocolPreview] = useState(false);

    // Auto-build the communication protocol from child profile + logs
    const protocol = useMemo(
        () => buildProtocolFromProfile(activeChild, logs),
        [activeChild, logs]
    );

    // Custom protocol edits
    const [customLikes, setCustomLikes] = useState('');
    const [customNeeds, setCustomNeeds] = useState('');
    const [customDoNots, setCustomDoNots] = useState('');
    const [customStrategies, setCustomStrategies] = useState('');
    const [customWorkingOn, setCustomWorkingOn] = useState('');

    const childName = activeChild?.preferredName || activeChild?.firstName || 'your child';

    // ============================================
    // GENERATE WITH GUARDRAILS
    // ============================================

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient) return;

        // Validate message through guardrails
        const allText = [message, customLikes, customNeeds, customDoNots, customStrategies, customWorkingOn].join(' ');
        const validation = validateContent(allText);
        if (!validation.isValid) {
            setGuardrailWarnings(validation.violations.map(v => `"${v.flaggedText}" → ${v.suggestion}`));
            return;
        }
        if (validation.violations.length > 0) {
            setGuardrailWarnings(validation.violations.map(v => `Warning: "${v.flaggedText}" → consider "${v.suggestion}"`));
            // Warnings don't block, just inform
        }

        if (!canCreateSharePacket()) {
            showToast('Monthly share packet limit reached. Upgrade for more.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Build enhanced content
            const shareLogs = includeLogs ? logs.slice(0, 5) : [];
            const shareStrategies = strategies.filter(s => s.status === 'active');

            // Build EC context section
            let ecSection = '';
            if (includeECContext && activeChild) {
                const ec = generateECContextSection(
                    childName,
                    activeChild.communicationStyle || { primaryMode: 'verbal', calmingStrategies: [] },
                    activeChild.homeplaceSupports || { calmingPractices: [], sensoryTools: [] }
                );
                ecSection = `\n\n--- REGULATION CONTEXT ---\n${ec.regulationContext}\nSensory needs: ${ec.sensoryNeeds.join(', ')}\n${ec.communicationNotes}\n${ec.homeplaceDetails}`;
            }

            // Build protocol section
            let protocolSection = '';
            if (includeProtocol) {
                const allLikes = [...protocol.likes, ...customLikes.split('\n').filter(Boolean)];
                const allNeeds = [...protocol.needs, ...customNeeds.split('\n').filter(Boolean)];
                const allDoNots = [...protocol.doNots, ...customDoNots.split('\n').filter(Boolean)];
                const allStrategies = [...protocol.strategiesThatWork, ...customStrategies.split('\n').filter(Boolean)];
                const allWorkingOn = [...protocol.currentlyWorkingOn, ...customWorkingOn.split('\n').filter(Boolean)];
                const allLearned = protocol.whatWeVeLearned;

                protocolSection = `\n\n--- COMMUNICATION PROTOCOL FOR ${childName.toUpperCase()} ---`;
                if (allLikes.length > 0) protocolSection += `\n\nLIKES & STRENGTHS:\n${allLikes.map(l => `• ${l}`).join('\n')}`;
                if (allNeeds.length > 0) protocolSection += `\n\nNEEDS:\n${allNeeds.map(n => `• ${n}`).join('\n')}`;
                if (allDoNots.length > 0) protocolSection += `\n\nDO NOTS (Please avoid):\n${allDoNots.map(d => `• ${d}`).join('\n')}`;
                if (allStrategies.length > 0) protocolSection += `\n\nSTRATEGIES THAT WORK:\n${allStrategies.map(s => `• ${s}`).join('\n')}`;
                if (allWorkingOn.length > 0) protocolSection += `\n\nCURRENTLY WORKING ON:\n${allWorkingOn.map(w => `• ${w}`).join('\n')}`;
                if (allLearned.length > 0) protocolSection += `\n\nWHAT WE'VE LEARNED:\n${allLearned.map(l => `• ${l}`).join('\n')}`;
            }

            const fullMessage = `${message}${ecSection}${protocolSection}`;

            const result = await generatePacket(
                recipient, shareLogs, shareStrategies,
                fullMessage,
                usePasscode ? passcode : undefined
            );

            await incrementShareUsage();
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
        setGuardrailWarnings([]);
        setCustomLikes('');
        setCustomNeeds('');
        setCustomDoNots('');
        setCustomStrategies('');
        setCustomWorkingOn('');
    };

    const activePackets = packets.filter(p => !p.revoked);

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
        color: sanctuary.text, fontSize: '0.92rem', fontFamily: typography.body,
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

                {/* Header */}
                <div className="sanctuary-enter" style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-end', marginBottom: '28px',
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2.2rem',
                            fontWeight: 700, color: sanctuary.text,
                            letterSpacing: '-0.02em', marginBottom: '4px',
                        }}>The Bridge</h1>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.95rem',
                            fontFamily: typography.body,
                        }}>Structured communication for {childName}'s team. You control every word.</p>
                    </div>
                    {!isCreating && (
                        <button onClick={() => setIsCreating(true)} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 20px', borderRadius: '100px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            color: '#fff', border: 'none', fontWeight: 700,
                            fontSize: '0.88rem', cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(107, 76, 154, 0.25)',
                            fontFamily: typography.body,
                        }}>
                            <Share2 size={18} /> New Bridge Packet
                        </button>
                    )}
                </div>

                {/* ============================================
                    CREATE FORM — ENHANCED
                ============================================ */}
                {isCreating && (
                    <div className="sanctuary-enter sanctuary-card" style={{
                        background: sanctuary.bgCard, borderRadius: '20px',
                        border: `1px solid ${sanctuary.purpleBorder}`,
                        padding: '24px', marginBottom: '24px',
                        boxShadow: sanctuary.shadowMd, position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                            background: `linear-gradient(90deg, transparent, ${sanctuary.purple}40, transparent)`,
                        }} />
                        <button onClick={closeGenerator} style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: sanctuary.textMuted,
                        }}><X size={20} /></button>

                        {!generatedLink ? (
                            <form onSubmit={handleGenerate}>
                                <h2 style={{
                                    fontFamily: typography.heading, fontWeight: 700,
                                    fontSize: '1.3rem', color: sanctuary.text, marginBottom: '6px',
                                }}>Build a Bridge Packet</h2>
                                <p style={{
                                    color: sanctuary.textMuted, fontSize: '0.88rem',
                                    fontFamily: typography.body, marginBottom: '20px',
                                }}>
                                    This creates a structured, guardrails-validated communication packet.
                                    Expires in 7 days. You control access.
                                </p>

                                {/* Guardrail warnings */}
                                {guardrailWarnings.length > 0 && (
                                    <div style={{
                                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                        borderRadius: '12px', padding: '14px', marginBottom: '16px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <AlertTriangle size={16} color={sanctuary.rose} />
                                            <span style={{ fontWeight: 700, color: sanctuary.rose, fontSize: '0.85rem', fontFamily: typography.body }}>
                                                Language Review
                                            </span>
                                        </div>
                                        {guardrailWarnings.map((w, i) => (
                                            <p key={i} style={{ fontSize: '0.82rem', color: sanctuary.text, fontFamily: typography.body, margin: '4px 0' }}>
                                                {w}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Recipient */}
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Recipient Name</label>
                                        <input required value={recipient} onChange={e => setRecipient(e.target.value)}
                                            placeholder="e.g. Ms. Johnson" style={inputStyle} />
                                    </div>
                                    <div style={{ width: '140px' }}>
                                        <label style={labelStyle}>Role</label>
                                        <select value={recipientRole} onChange={e => setRecipientRole(e.target.value as any)} style={{ ...inputStyle, cursor: 'pointer' }}>
                                            <option value="teacher">Teacher</option>
                                            <option value="therapist">Therapist</option>
                                            <option value="doctor">Doctor</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Personal message */}
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={labelStyle}>Personal Note (Optional)</label>
                                    <textarea value={message} onChange={e => setMessage(e.target.value)}
                                        placeholder={`What you want ${recipient || 'the recipient'} to know...`}
                                        style={{ ...inputStyle, resize: 'vertical' as const, minHeight: '80px' }} />
                                </div>

                                {/* ===== COMMUNICATION PROTOCOL SECTION ===== */}
                                <div style={{
                                    background: sanctuary.bgAlt, borderRadius: '14px',
                                    border: `1px solid ${sanctuary.border}`, padding: '18px',
                                    marginBottom: '16px',
                                }}>
                                    <button type="button" onClick={() => setShowProtocolPreview(!showProtocolPreview)} style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <BookOpen size={18} color={sanctuary.sage} />
                                            <span style={{ fontWeight: 700, color: sanctuary.text, fontSize: '0.95rem', fontFamily: typography.body }}>
                                                Communication Protocol
                                            </span>
                                        </div>
                                        {showProtocolPreview ? <ChevronUp size={18} color={sanctuary.textMuted} /> : <ChevronDown size={18} color={sanctuary.textMuted} />}
                                    </button>

                                    <p style={{ fontSize: '0.82rem', color: sanctuary.textMuted, fontFamily: typography.body, margin: '8px 0 0' }}>
                                        Auto-built from {childName}'s profile. You can add or edit below.
                                    </p>

                                    {showProtocolPreview && (
                                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                            {/* Auto-populated items shown as badges */}
                                            {protocol.likes.length > 0 && (
                                                <div>
                                                    <label style={{ ...labelStyle, color: sanctuary.sage }}>Likes & Strengths (from profile)</label>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                        {protocol.likes.map((l, i) => (
                                                            <span key={i} style={{
                                                                padding: '4px 12px', borderRadius: '100px',
                                                                background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                                                fontSize: '0.78rem', color: sanctuary.sage, fontFamily: typography.body,
                                                            }}>{l}</span>
                                                        ))}
                                                    </div>
                                                    <textarea value={customLikes} onChange={e => setCustomLikes(e.target.value)}
                                                        placeholder="Add more (one per line)..."
                                                        style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }} />
                                                </div>
                                            )}

                                            {/* Needs */}
                                            <div>
                                                <label style={{ ...labelStyle, color: sanctuary.purple }}>Needs</label>
                                                {protocol.needs.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                        {protocol.needs.map((n, i) => (
                                                            <span key={i} style={{
                                                                padding: '4px 12px', borderRadius: '100px',
                                                                background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                                                fontSize: '0.78rem', color: sanctuary.purple, fontFamily: typography.body,
                                                            }}>{n}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <textarea value={customNeeds} onChange={e => setCustomNeeds(e.target.value)}
                                                    placeholder="Add needs (one per line)..."
                                                    style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }} />
                                            </div>

                                            {/* Do Nots */}
                                            <div>
                                                <label style={{ ...labelStyle, color: sanctuary.rose }}>Do Nots (Please Avoid)</label>
                                                {protocol.doNots.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                        {protocol.doNots.map((d, i) => (
                                                            <span key={i} style={{
                                                                padding: '4px 12px', borderRadius: '100px',
                                                                background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                                                fontSize: '0.78rem', color: sanctuary.rose, fontFamily: typography.body,
                                                            }}>{d}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <textarea value={customDoNots} onChange={e => setCustomDoNots(e.target.value)}
                                                    placeholder="Add do-nots (one per line)..."
                                                    style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }} />
                                            </div>

                                            {/* Strategies */}
                                            <div>
                                                <label style={{ ...labelStyle, color: sanctuary.gold }}>Strategies That Work</label>
                                                {protocol.strategiesThatWork.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                        {protocol.strategiesThatWork.map((s, i) => (
                                                            <span key={i} style={{
                                                                padding: '4px 12px', borderRadius: '100px',
                                                                background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                                                fontSize: '0.78rem', color: sanctuary.gold, fontFamily: typography.body,
                                                            }}>{s}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <textarea value={customStrategies} onChange={e => setCustomStrategies(e.target.value)}
                                                    placeholder="Add strategies (one per line)..."
                                                    style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }} />
                                            </div>

                                            {/* Currently Working On */}
                                            <div>
                                                <label style={labelStyle}>Currently Working On</label>
                                                <textarea value={customWorkingOn} onChange={e => setCustomWorkingOn(e.target.value)}
                                                    placeholder="Current goals or focus areas (one per line)..."
                                                    style={{ ...inputStyle, minHeight: '40px', fontSize: '0.85rem' }} />
                                            </div>

                                            {/* What We've Learned (read-only, from data) */}
                                            {protocol.whatWeVeLearned.length > 0 && (
                                                <div>
                                                    <label style={labelStyle}>What We've Learned (from data)</label>
                                                    {protocol.whatWeVeLearned.map((l, i) => (
                                                        <p key={i} style={{ fontSize: '0.82rem', color: sanctuary.textSecondary, fontFamily: typography.body, margin: '4px 0' }}>
                                                            • {l}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Include toggles */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={includeProtocol} onChange={e => setIncludeProtocol(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: sanctuary.sage }} />
                                        <span style={{ fontWeight: 600, color: sanctuary.text, fontSize: '0.88rem', fontFamily: typography.body }}>
                                            <BookOpen size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Include Communication Protocol
                                        </span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={includeECContext} onChange={e => setIncludeECContext(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: sanctuary.purple }} />
                                        <span style={{ fontWeight: 600, color: sanctuary.text, fontSize: '0.88rem', fontFamily: typography.body }}>
                                            <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Include Regulation Context (EC)
                                        </span>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={includeLogs} onChange={e => setIncludeLogs(e.target.checked)}
                                            style={{ width: '18px', height: '18px', accentColor: sanctuary.gold }} />
                                        <span style={{ fontWeight: 600, color: sanctuary.text, fontSize: '0.88rem', fontFamily: typography.body }}>
                                            <FileText size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Include Recent ABC Logs ({Math.min(logs.length, 5)})
                                        </span>
                                    </label>
                                </div>

                                {/* Passcode */}
                                <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input type="checkbox" id="use-passcode" checked={usePasscode}
                                        onChange={(e) => setUsePasscode(e.target.checked)}
                                        style={{ width: '18px', height: '18px', accentColor: sanctuary.purple }} />
                                    <label htmlFor="use-passcode" style={{
                                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                        fontWeight: 700, color: sanctuary.text, fontSize: '0.92rem',
                                        fontFamily: typography.body,
                                    }}>
                                        <Lock size={14} color={sanctuary.textMuted} /> Add Passcode Protection
                                    </label>
                                </div>
                                {usePasscode && (
                                    <div style={{ marginBottom: '14px', marginLeft: '28px', position: 'relative' }}>
                                        <input type={showPasscode ? 'text' : 'password'} value={passcode}
                                            onChange={(e) => setPasscode(e.target.value)}
                                            placeholder="Enter a passcode" minLength={4} required={usePasscode}
                                            style={{ ...inputStyle, paddingRight: '44px' }} />
                                        <button type="button" onClick={() => setShowPasscode(!showPasscode)} style={{
                                            position: 'absolute', right: '12px', top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: sanctuary.textMuted,
                                        }}>
                                            {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                )}

                                {/* Submit */}
                                <button type="submit" disabled={isSubmitting} style={{
                                    width: '100%', padding: '14px', borderRadius: '12px',
                                    background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                                    color: '#fff', border: 'none', fontWeight: 700,
                                    fontSize: '0.92rem', cursor: isSubmitting ? 'default' : 'pointer',
                                    opacity: isSubmitting ? 0.5 : 1,
                                    fontFamily: typography.body,
                                }}>
                                    {isSubmitting ? 'Generating...' : 'Generate Secure Bridge Packet'}
                                </button>
                            </form>
                        ) : (
                            /* Success state */
                            <div style={{ textAlign: 'center', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <CheckCircle size={28} color={sanctuary.sage} />
                                </div>
                                <div>
                                    <h3 style={{
                                        fontFamily: typography.heading, fontWeight: 700,
                                        fontSize: '1.2rem', color: sanctuary.text, marginBottom: '4px',
                                    }}>Bridge Packet Ready!</h3>
                                    <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>
                                        Share this link with {recipient}.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                                    <input readOnly value={generatedLink || ''} style={{
                                        ...inputStyle, flex: 1, fontSize: '0.82rem',
                                        fontFamily: 'monospace', background: sanctuary.bgAlt,
                                    }} />
                                    <button onClick={copyToClipboard} style={{
                                        padding: '12px', borderRadius: '10px',
                                        background: sanctuary.bgAlt, border: `1px solid ${sanctuary.border}`,
                                        cursor: 'pointer', color: sanctuary.textSecondary,
                                    }}><Copy size={18} /></button>
                                </div>
                                {usePasscode && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                        borderRadius: '10px', padding: '10px 14px',
                                        color: sanctuary.gold, fontSize: '0.85rem', fontFamily: typography.body,
                                    }}>
                                        <Lock size={14} /> Remember to share the passcode separately!
                                    </div>
                                )}
                                <button onClick={closeGenerator} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: sanctuary.purple, fontWeight: 700, fontFamily: typography.body,
                                }}>Done</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Active Packets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{
                        fontSize: '0.75rem', fontWeight: 700,
                        color: sanctuary.textMuted, textTransform: 'uppercase',
                        letterSpacing: '0.1em', fontFamily: typography.body,
                    }}>Active Bridge Links</h3>

                    {activePackets.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '32px',
                            background: sanctuary.bgCard, borderRadius: '16px',
                            border: `1px dashed ${sanctuary.border}`,
                            color: sanctuary.textMuted, fontFamily: typography.body,
                        }}>No active bridge packets. Create one to share with {childName}'s team.</div>
                    ) : (
                        activePackets.map(packet => (
                            <div key={packet.id} className="sanctuary-card" style={{
                                background: sanctuary.bgCard, borderRadius: '16px',
                                border: `1px solid ${sanctuary.border}`,
                                padding: '16px', boxShadow: sanctuary.shadow,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{
                                            fontFamily: typography.heading, fontWeight: 700,
                                            color: sanctuary.text, fontSize: '1rem',
                                        }}>{packet.recipientName}</h4>
                                        {packet.hasPasscode && (
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '2px 8px', borderRadius: '6px',
                                                background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                                color: sanctuary.gold, fontSize: '0.68rem', fontWeight: 700,
                                            }}>
                                                <Lock size={10} /> Protected
                                            </span>
                                        )}
                                    </div>
                                    <p style={{
                                        color: sanctuary.textMuted, fontSize: '0.78rem', fontFamily: typography.body,
                                    }}>
                                        Generated: {packet.generatedAt?.toDate ? format(packet.generatedAt.toDate(), 'MMM d') : 'Just now'} · Views: {packet.views || 0}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { if (confirm('Revoke access?')) revokePacket(packet.id); }}
                                    style={{
                                        padding: '8px 14px', borderRadius: '8px',
                                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                                        color: sanctuary.rose, fontSize: '0.78rem', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: typography.body,
                                    }}>Revoke</button>
                            </div>
                        ))
                    )}
                </div>

                {packets.filter(p => p.revoked).length > 0 && (
                    <div style={{
                        marginTop: '16px', display: 'flex', alignItems: 'center',
                        gap: '6px', color: sanctuary.textMuted, fontSize: '0.78rem',
                        fontFamily: typography.body,
                    }}>
                        <AlertCircle size={14} />
                        {packets.filter(p => p.revoked).length} revoked packet(s) hidden
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================
// SHARED STYLES
// ============================================

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#6B6560',
    marginBottom: '6px',
    fontFamily: "'Inter', sans-serif",
};
