/**
 * Professional Integration Layer — "The Bridge"
 *
 * Phase 4B: Export child data for providers.
 * BCBA data export, therapist summary, physician summary,
 * and IEP meeting prep packet.
 */

import { useState } from 'react';
import {
    FileText, Download, Users, Stethoscope,
    GraduationCap, BarChart2, Copy, Check, Sparkles
} from 'lucide-react';
import { sanctuary, typography } from '../shared/theme';
import { useFamily } from '../contexts/FamilyContext';
import { useABCLogs } from '../hooks/useABCLogs';

type ExportType = 'bcba' | 'therapist' | 'physician' | 'iep';

const EXPORT_OPTIONS: Array<{
    key: ExportType; title: string; subtitle: string;
    icon: typeof FileText; color: string; bg: string; border: string;
}> = [
    { key: 'bcba', title: 'BCBA Data Export', subtitle: 'ABC log data in behavioral analysis format', icon: BarChart2, color: sanctuary.purple, bg: sanctuary.purpleBg, border: sanctuary.purpleBorder },
    { key: 'therapist', title: 'Therapist Summary', subtitle: 'Read-only progress overview for therapy team', icon: Users, color: sanctuary.sage, bg: sanctuary.sageBg, border: sanctuary.sageBorder },
    { key: 'physician', title: 'Physician Summary', subtitle: 'Medical history + current medications report', icon: Stethoscope, color: sanctuary.rose, bg: sanctuary.roseBg, border: sanctuary.roseBorder },
    { key: 'iep', title: 'IEP Meeting Prep', subtitle: 'Structured data packet for school meetings', icon: GraduationCap, color: sanctuary.gold, bg: sanctuary.goldBg, border: sanctuary.goldBorder },
];

export function ProfessionalIntegrationPage() {
    const { activeChild } = useFamily();
    const { logs } = useABCLogs();
    const [selectedExport, setSelectedExport] = useState<ExportType | null>(null);
    const [copied, setCopied] = useState(false);

    const childName = activeChild?.preferredName || activeChild?.firstName || 'Child';

    const generateExport = (type: ExportType): string => {
        const now = new Date().toLocaleDateString();

        switch (type) {
            case 'bcba':
                return generateBCBAExport(childName, logs, now);
            case 'therapist':
                return generateTherapistSummary(childName, activeChild, logs, now);
            case 'physician':
                return generatePhysicianSummary(childName, activeChild, now);
            case 'iep':
                return generateIEPPrep(childName, activeChild, logs, now);
        }
    };

    const handleExport = (type: ExportType) => {
        const content = generateExport(type);
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${childName}_${type}_${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = (type: ExportType) => {
        const content = generateExport(type).replace(/<[^>]+>/g, '');
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: `linear-gradient(135deg, ${sanctuary.purple}, #4B0082)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={22} color="#E8C97A" />
                        </div>
                        <h1 style={{
                            fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                            color: sanctuary.text, letterSpacing: '-0.02em',
                        }}>Share with Professionals</h1>
                    </div>
                    <p style={{
                        color: sanctuary.textMuted, fontSize: '0.92rem',
                        fontFamily: typography.body, marginLeft: '56px',
                    }}>Export {childName}'s data for their care team.</p>
                </div>

                {/* Export Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {EXPORT_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        const isSelected = selectedExport === opt.key;

                        return (
                            <div key={opt.key} style={{
                                background: sanctuary.bgCard, borderRadius: '20px',
                                border: `1px solid ${isSelected ? opt.border : sanctuary.border}`,
                                overflow: 'hidden', boxShadow: sanctuary.shadow,
                            }}>
                                <button onClick={() => setSelectedExport(isSelected ? null : opt.key)} style={{
                                    width: '100%', padding: '18px 20px',
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '12px',
                                        background: opt.bg, border: `1px solid ${opt.border}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: opt.color, flexShrink: 0,
                                    }}>
                                        <Icon size={20} />
                                    </div>
                                    <div style={{ textAlign: 'left', flex: 1 }}>
                                        <span style={{
                                            display: 'block', fontFamily: typography.body, fontWeight: 700,
                                            fontSize: '0.95rem', color: sanctuary.text,
                                        }}>{opt.title}</span>
                                        <span style={{
                                            display: 'block', fontSize: '0.78rem', color: sanctuary.textMuted,
                                            fontFamily: typography.body,
                                        }}>{opt.subtitle}</span>
                                    </div>
                                </button>

                                {isSelected && (
                                    <div style={{
                                        padding: '0 20px 20px',
                                        display: 'flex', gap: '8px',
                                    }}>
                                        <button onClick={() => handleExport(opt.key)} style={{
                                            flex: 1, padding: '12px', borderRadius: '10px',
                                            background: `linear-gradient(135deg, ${opt.color}, ${opt.color}CC)`,
                                            color: '#fff', border: 'none', fontWeight: 700,
                                            fontSize: '0.88rem', cursor: 'pointer', fontFamily: typography.body,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        }}>
                                            <Download size={16} /> Download
                                        </button>
                                        <button onClick={() => handleCopy(opt.key)} style={{
                                            padding: '12px 16px', borderRadius: '10px',
                                            background: copied ? sanctuary.sageBg : sanctuary.bgAlt,
                                            border: `1px solid ${copied ? sanctuary.sageBorder : sanctuary.border}`,
                                            color: copied ? sanctuary.sage : sanctuary.textMuted,
                                            fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                                            fontFamily: typography.body,
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                        }}>
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Data Coverage Info */}
                <div style={{
                    background: sanctuary.purpleBg, borderRadius: '16px',
                    border: `1px solid ${sanctuary.purpleBorder}`,
                    padding: '16px', marginTop: '24px',
                }}>
                    <h4 style={{
                        fontFamily: typography.body, fontWeight: 700, fontSize: '0.85rem',
                        color: sanctuary.purple, marginBottom: '8px',
                    }}>What's included in exports</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {[
                            `${logs.length} ABC log entries`,
                            `${activeChild?.diagnoses?.length || 0} diagnoses`,
                            `${activeChild?.strengths?.length || 0} documented strengths`,
                            `${activeChild?.communicationStyle?.calmingStrategies?.length || 0} calming strategies`,
                        ].map((item, i) => (
                            <span key={i} style={{
                                fontSize: '0.78rem', color: sanctuary.textSecondary,
                                fontFamily: typography.body, display: 'flex', alignItems: 'center', gap: '4px',
                            }}><Check size={12} color={sanctuary.sage} /> {item}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============ Export Generators ============

function htmlWrapper(title: string, body: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;color:#2D2A26;background:#F8F5EF;padding:40px;max-width:800px;margin:0 auto}
h1{font-size:1.5rem;margin-bottom:4px}h2{font-size:1.1rem;color:#6B4C9A;margin:24px 0 12px;border-bottom:1px solid #E8E2D6;padding-bottom:8px}
.card{background:white;border:1px solid #E8E2D6;border-radius:12px;padding:16px;margin-bottom:12px}
.pill{display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.78rem;font-weight:600;margin:2px}
table{width:100%;border-collapse:collapse;margin:12px 0}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #E8E2D6;font-size:0.85rem}
th{font-weight:700;color:#6B6560;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em}
.footer{text-align:center;margin-top:32px;color:#9B9590;font-size:0.78rem}</style></head><body>${body}
<div class="footer"><p>Generated from Giovanna App • ${new Date().toLocaleDateString()}</p></div></body></html>`;
}

function generateBCBAExport(name: string, logs: any[], date: string): string {
    const rows = logs.slice(0, 50).map((l: any) => `<tr><td>${l.date || ''}</td><td>${l.antecedent || ''}</td><td>${l.behavior || ''}</td><td>${l.consequence || ''}</td><td>${l.intensity || ''}/10</td><td>${l.context || ''}</td></tr>`).join('');
    return htmlWrapper(`${name} — BCBA Data Export`, `
        <h1>${name} — Behavioral Data Export</h1>
        <p style="color:#9B9590">Exported ${date} • ${logs.length} total entries</p>
        <h2>ABC Log Data</h2>
        <table><thead><tr><th>Date</th><th>Antecedent</th><th>Behavior</th><th>Consequence</th><th>Intensity</th><th>Context</th></tr></thead><tbody>${rows}</tbody></table>
        <h2>Summary Statistics</h2>
        <div class="card"><p>Total entries: ${logs.length}</p><p>Average intensity: ${logs.length > 0 ? (logs.reduce((s: number, l: any) => s + (l.intensity || 0), 0) / logs.length).toFixed(1) : 'N/A'}/10</p></div>
    `);
}

function generateTherapistSummary(name: string, child: any, logs: any[], date: string): string {
    return htmlWrapper(`${name} — Therapist Summary`, `
        <h1>${name} — Progress Summary for Therapy Team</h1>
        <p style="color:#9B9590">Exported ${date}</p>
        <h2>Current Profile</h2>
        <div class="card"><p><strong>Communication:</strong> ${child?.communicationStyle?.primaryMode || 'Verbal'}</p>
        <p><strong>Strengths:</strong> ${(child?.strengths || []).join(', ') || 'Not documented'}</p>
        <p><strong>Interests:</strong> ${(child?.interests || []).join(', ') || 'Not documented'}</p></div>
        <h2>Calming Strategies (What Works)</h2>
        <div class="card">${(child?.communicationStyle?.calmingStrategies || ['None documented']).map((s: string) => `<span class="pill" style="background:#E8F5E9;color:#7A9E7E;border:1px solid #C5E1A5">${s}</span>`).join('')}</div>
        <h2>Known Triggers</h2>
        <div class="card">${(child?.communicationStyle?.triggers || ['None documented']).map((t: string) => `<span class="pill" style="background:#FFF3E0;color:#E88C68;border:1px solid #FFE0B2">${t}</span>`).join('')}</div>
        <h2>Recent Behavioral Data</h2>
        <div class="card"><p>${logs.length} ABC log entries captured</p><p>Most recent: ${logs[0]?.date || 'N/A'}</p></div>
    `);
}

function generatePhysicianSummary(name: string, child: any, date: string): string {
    const diagnoses = (child?.diagnoses || []).map((d: any) => `<tr><td>${d.name}</td><td>${d.diagnosedDate ? new Date(d.diagnosedDate).getFullYear() : ''}</td><td>${d.diagnosedBy || ''}</td></tr>`).join('');
    return htmlWrapper(`${name} — Physician Summary`, `
        <h1>${name} — Medical Summary</h1>
        <p style="color:#9B9590">Exported ${date}</p>
        <h2>Diagnoses</h2>
        <table><thead><tr><th>Diagnosis</th><th>Year</th><th>Diagnosed By</th></tr></thead><tbody>${diagnoses || '<tr><td colspan="3">No diagnoses documented</td></tr>'}</tbody></table>
        <h2>Communication Profile</h2>
        <div class="card"><p><strong>Mode:</strong> ${child?.communicationStyle?.primaryMode || 'Verbal'}</p>
        <p><strong>Calming Strategies:</strong> ${(child?.communicationStyle?.calmingStrategies || []).join(', ') || 'Not documented'}</p></div>
        <h2>Current Supports</h2>
        <div class="card">${(child?.therapyServices || []).filter((t: any) => t.isActive).map((t: any) => `<p>${t.type}: ${t.providerName} (${t.frequency})</p>`).join('') || '<p>No active therapy services documented</p>'}</div>
    `);
}

function generateIEPPrep(name: string, child: any, logs: any[], date: string): string {
    return htmlWrapper(`${name} — IEP Meeting Prep`, `
        <h1>${name} — IEP Meeting Preparation Packet</h1>
        <p style="color:#9B9590">Prepared ${date}</p>
        <h2>Parent Strengths Statement</h2>
        <div class="card"><p>${child?.narrative?.whoTheyAre || `${name} is a unique individual with many gifts.`}</p>
        <p><strong>Strengths:</strong> ${(child?.strengths || []).join(', ') || 'To be discussed'}</p>
        <p><strong>Interests:</strong> ${(child?.interests || []).join(', ') || 'To be discussed'}</p></div>
        <h2>Communication Needs</h2>
        <div class="card"><p><strong>Primary Mode:</strong> ${child?.communicationStyle?.primaryMode || 'Verbal'}</p>
        <p><strong>Triggers to Accommodate:</strong> ${(child?.communicationStyle?.triggers || []).join(', ') || 'None documented'}</p>
        <p><strong>Effective Strategies:</strong> ${(child?.communicationStyle?.calmingStrategies || []).join(', ') || 'None documented'}</p></div>
        <h2>Behavioral Data Summary</h2>
        <div class="card"><p>${logs.length} behavioral observations logged</p>
        <p>Average intensity: ${logs.length > 0 ? (logs.reduce((s: number, l: any) => s + (l.intensity || 0), 0) / logs.length).toFixed(1) : 'N/A'}/10</p></div>
        <h2>Parent Concerns & Requests</h2>
        <div class="card" style="min-height:100px"><p><em>[Add your concerns here before the meeting]</em></p></div>
        <h2>Parent Rights Reminder</h2>
        <div class="card"><p>✓ You are an equal member of the IEP team</p><p>✓ You can request a break at any time</p><p>✓ You can bring an advocate</p><p>✓ Nothing is final until you sign</p><p>✓ You can request an Independent Educational Evaluation (IEE)</p></div>
    `);
}
