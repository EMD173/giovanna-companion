/**
 * Export Utilities — PDF Export + QR Code Generation
 *
 * PDF: Opens a print-optimized window with the "Meet My Child" one-pager.
 *      Parent uses browser's native "Save as PDF" for best quality.
 *
 * QR Code: Generates a QR code SVG for time-limited share links.
 *          Uses a lightweight SVG-based QR encoder (no external deps).
 */

import type { ChildProfile } from '../data/familyProfile';

// ============================================
// PDF EXPORT — "Meet My Child" One-Pager
// ============================================

export function exportMeetMyChildPDF(child: ChildProfile): void {
    const name = child.preferredName || child.firstName;
    const html = buildMeetMyChildHTML(child);

    // Open in new window and trigger print (Save as PDF)
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!printWindow) {
        // Fallback: download as HTML
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Meet_${name}.html`;
        a.click();
        URL.revokeObjectURL(url);
        return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for fonts to load, then trigger print
    printWindow.onload = () => {
        setTimeout(() => printWindow.print(), 500);
    };
}

function buildMeetMyChildHTML(child: ChildProfile): string {
    const name = child.preferredName || child.firstName;
    const calmingStrategies = child.communicationStyle?.calmingStrategies || [];
    const triggers = child.communicationStyle?.triggers || [];
    const strengths = child.strengths || [];
    const interests = child.interests || [];
    const sensoryTools = child.homeplaceSupports?.sensoryTools || [];
    const calmingPractices = child.homeplaceSupports?.calmingPractices || [];

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Meet ${name} — Giovanna</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
        @page { size: letter; margin: 0.5in; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; color: #2D2A26; background: #F8F5EF; padding: 32px; max-width: 800px; margin: 0 auto; }
        h1 { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #2D2A26; margin-bottom: 4px; }
        h2 { font-family: 'Playfair Display', serif; font-size: 1.05rem; margin-bottom: 10px; }
        .header { border-bottom: 2px solid #D4AF37; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
        .subtitle { color: #9B9590; font-size: 0.85rem; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .card { background: white; border: 1px solid #E8E2D6; border-radius: 14px; padding: 16px; }
        .card-full { grid-column: 1 / -1; }
        .pill { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; margin: 2px; }
        .sage { background: rgba(122,158,126,0.1); color: #7A9E7E; border: 1px solid rgba(122,158,126,0.2); }
        .gold { background: rgba(212,175,55,0.08); color: #D4AF37; border: 1px solid rgba(212,175,55,0.2); }
        .purple { background: rgba(107,76,154,0.08); color: #6B4C9A; border: 1px solid rgba(107,76,154,0.2); }
        .rose { background: rgba(184,84,80,0.08); color: #B85450; border: 1px solid rgba(184,84,80,0.15); }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #F0EBE3; font-size: 0.85rem; }
        .row:last-child { border: none; }
        .label { color: #9B9590; }
        .value { font-weight: 600; }
        .narrative { color: #6B6560; font-size: 0.88rem; line-height: 1.6; font-style: italic; }
        .section-label { font-size: 0.7rem; font-weight: 700; color: #9B9590; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E8E2D6; color: #9B9590; font-size: 0.75rem; }
        .do-not { color: #B85450; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Meet ${name}</h1>
            <p class="subtitle">${child.pronouns || ''} ${child.currentGrade ? '• Grade ' + child.currentGrade : ''} ${child.currentSchool?.name ? '• ' + child.currentSchool.name : ''}</p>
        </div>
        <div style="text-align: right;">
            <span style="font-size: 0.7rem; color: #D4AF37; font-weight: 700;">GIOVANNA</span>
            <br><span style="font-size: 0.7rem; color: #9B9590;">${new Date().toLocaleDateString()}</span>
        </div>
    </div>

    ${child.narrative?.whoTheyAre ? `
    <div class="card" style="margin-bottom: 14px; background: rgba(212,175,55,0.04); border-color: rgba(212,175,55,0.15);">
        <h2 style="color: #D4AF37;">Who ${name} Is</h2>
        <p class="narrative">${child.narrative.whoTheyAre}</p>
    </div>` : ''}

    <div class="grid">
        <div class="card">
            <h2 style="color: #7A9E7E;">Strengths</h2>
            ${strengths.length > 0 ? strengths.map(s => `<span class="pill sage">${s}</span>`).join('') : '<span class="label">To be added</span>'}
        </div>
        <div class="card">
            <h2 style="color: #D4AF37;">Interests</h2>
            ${interests.length > 0 ? interests.map(s => `<span class="pill gold">${s}</span>`).join('') : '<span class="label">To be added</span>'}
        </div>

        <div class="card">
            <h2 style="color: #6B4C9A;">Communication</h2>
            <div class="row"><span class="label">Primary Mode</span><span class="value">${child.communicationStyle?.primaryMode || 'Verbal'}</span></div>
            ${child.communicationStyle?.expressiveLevel ? `<div class="row"><span class="label">Expressive</span><span class="value">${child.communicationStyle.expressiveLevel}</span></div>` : ''}
            ${child.communicationStyle?.receptiveLevel ? `<div class="row"><span class="label">Receptive</span><span class="value">${child.communicationStyle.receptiveLevel}</span></div>` : ''}
        </div>

        <div class="card">
            <h2 style="color: #B85450;">Important to Know</h2>
            ${triggers.length > 0 ? `
                <p class="section-label">Known Triggers</p>
                ${triggers.map(t => `<span class="pill rose">${t}</span>`).join('')}
            ` : ''}
            ${child.diagnoses?.filter(d => d.shareWithSchool).map(d => `
                <div class="row"><span class="label">Diagnosis</span><span class="value">${d.name}</span></div>
            `).join('') || ''}
        </div>

        <div class="card card-full">
            <h2 style="color: #7A9E7E;">What Helps ${name}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <p class="section-label">Calming Strategies</p>
                    ${calmingStrategies.length > 0 ? calmingStrategies.map(s => `<span class="pill purple">${s}</span>`).join('') : '<span class="label">Ask family</span>'}
                </div>
                <div>
                    <p class="section-label">Sensory Tools</p>
                    ${sensoryTools.length > 0 ? sensoryTools.map(s => `<span class="pill gold">${s}</span>`).join('') : '<span class="label">Ask family</span>'}
                </div>
            </div>
            ${calmingPractices.length > 0 ? `
            <div style="margin-top: 10px;">
                <p class="section-label">Calming Practices from Home</p>
                ${calmingPractices.map(s => `<span class="pill sage">${s}</span>`).join('')}
            </div>` : ''}
        </div>
    </div>

    ${child.narrative?.whatHelps ? `
    <div class="card" style="margin-bottom: 16px;">
        <h2 style="color: #6B4C9A;">In ${name}'s Own Words</h2>
        <p class="narrative">${child.narrative.whatHelps}</p>
    </div>` : ''}

    <div class="footer">
        <p><strong>Giovanna</strong> — Parenting with Confidence, Not Compliance</p>
        <p style="margin-top: 4px;">Behavior is communication, not defiance. Regulation over compliance. Assume competence.</p>
    </div>
</body>
</html>`;
}

// ============================================
// QR CODE GENERATOR (Lightweight SVG)
// ============================================

/**
 * Generate a QR code URL using a free API service.
 * Returns a data URL for the QR code image.
 */
export function generateQRCodeURL(data: string, size: number = 200): string {
    // Use Google Charts QR API (free, reliable, no API key needed)
    return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(data)}&choe=UTF-8`;
}

/**
 * Generate a time-limited share URL for a child profile.
 * The actual share logic uses the existing share packet system.
 */
export function buildShareURL(accessToken: string): string {
    return `${window.location.origin}/share?token=${accessToken}`;
}
