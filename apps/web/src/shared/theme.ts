/**
 * Giovanna Design System — Shared Theme Constants
 * 
 * Dual-theme approach:
 *   - DARK:  Landing page + Onboarding (cinematic first impression)
 *   - LIGHT: All interior pages (calming daily-use sanctuary)
 * 
 * Based on research into successful neurodivergent family apps:
 *   - Soft, desaturated colors prevent sensory overload
 *   - Warm earth tones + sage greens are universally calming
 *   - Avoid pure black/white contrast
 *   - The "Mama's Gun" warmth is preserved via gold + warm parchment
 */

/* ===== Interior (Light / Sanctuary) Theme ===== */
export const sanctuary = {
    // Backgrounds
    bg: '#F8F5EF',              // Warm parchment — not sterile white
    bgAlt: '#F0EBE1',           // Slightly deeper parchment for sections
    bgCard: '#FFFFFF',           // Clean white cards
    bgCardHover: '#FDFCF9',     // Subtle hover lift

    // Borders & Dividers
    border: '#E8E2D6',          // Warm border
    borderLight: '#F0EBE1',     // Very subtle separator
    borderAccent: 'rgba(122, 158, 126, 0.3)',  // Sage accent border

    // Text
    text: '#2D2A26',            // Warm dark — not harsh black
    textSecondary: '#6B6560',   // Muted body text
    textMuted: '#9B9590',       // Hints, timestamps
    textOnAccent: '#FFFFFF',    // Text on colored backgrounds

    // Brand Colors
    gold: '#D4AF37',            // Healing Gold — primary accent
    goldLight: '#E8C97A',       // Gold hover/light variant
    goldBg: 'rgba(212, 175, 55, 0.08)', // Gold tinted background
    goldBorder: 'rgba(212, 175, 55, 0.2)',

    sage: '#7A9E7E',            // Sage green — calming secondary
    sageLight: '#A3C4A7',       // Sage hover
    sageBg: 'rgba(122, 158, 126, 0.08)', // Sage tinted background
    sageBorder: 'rgba(122, 158, 126, 0.2)',

    purple: '#6B4C9A',          // Regal purple — tertiary accent  
    purpleLight: '#8B6CB8',
    purpleBg: 'rgba(107, 76, 154, 0.08)',
    purpleBorder: 'rgba(107, 76, 154, 0.2)',

    rose: '#B85450',            // Warrior rose — alerts/safety
    roseBg: 'rgba(184, 84, 80, 0.08)',
    roseBorder: 'rgba(184, 84, 80, 0.15)',

    // Shadows
    shadow: '0 1px 3px rgba(45, 42, 38, 0.06)',
    shadowMd: '0 4px 12px rgba(45, 42, 38, 0.08)',
    shadowLg: '0 8px 30px rgba(45, 42, 38, 0.1)',

    // Nav
    navBg: '#FFFFFF',
    navBorder: '#E8E2D6',
    navText: '#6B6560',
    navTextActive: '#2D2A26',
    navAccent: '#D4AF37',
};

/* ===== Landing / Immersive (Dark) Theme ===== */
export const immersive = {
    bg: '#0D0D0D',
    bgGradient: 'linear-gradient(170deg, #1A0A2E 0%, #110820 40%, #0D0D0D 100%)',
    card: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#F5F0E8',
    textMuted: 'rgba(245,240,232,0.55)',
    textDim: 'rgba(245,240,232,0.4)',
    gold: '#D4AF37',
    goldLight: '#E8C97A',
    purple: '#4B0082',
    purpleDark: '#1A0A2E',
    rose: '#B85450',
};

/* ===== Shared Utilities ===== */
export const typography = {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ===== Inline Style Helpers ===== */
export const cardStyle = (hover = false): React.CSSProperties => ({
    background: hover ? sanctuary.bgCardHover : sanctuary.bgCard,
    border: `1px solid ${sanctuary.border}`,
    borderRadius: '16px',
    padding: '24px',
    boxShadow: sanctuary.shadow,
    transition: 'all 0.2s ease',
});

export const pageStyle: React.CSSProperties = {
    background: sanctuary.bg,
    minHeight: '100vh',
    padding: '24px',
};

export const headingStyle: React.CSSProperties = {
    fontFamily: typography.heading,
    color: sanctuary.text,
    fontWeight: 700,
};

export const bodyTextStyle: React.CSSProperties = {
    fontFamily: typography.body,
    color: sanctuary.textSecondary,
    lineHeight: 1.7,
    fontSize: '0.95rem',
};

export const accentBadgeStyle = (color: 'gold' | 'sage' | 'purple' | 'rose' = 'gold'): React.CSSProperties => {
    const colors = {
        gold: { bg: sanctuary.goldBg, border: sanctuary.goldBorder, text: sanctuary.gold },
        sage: { bg: sanctuary.sageBg, border: sanctuary.sageBorder, text: sanctuary.sage },
        purple: { bg: sanctuary.purpleBg, border: sanctuary.purpleBorder, text: sanctuary.purple },
        rose: { bg: sanctuary.roseBg, border: sanctuary.roseBorder, text: sanctuary.rose },
    };
    const c = colors[color];
    return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '100px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: '0.8rem',
        fontWeight: 600,
    };
};

export const buttonStyle = (variant: 'primary' | 'secondary' | 'ghost' = 'primary'): React.CSSProperties => {
    if (variant === 'primary') {
        return {
            background: `linear-gradient(135deg, ${sanctuary.gold} 0%, ${sanctuary.goldLight} 100%)`,
            color: '#1A1A1A',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 28px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
        };
    }
    if (variant === 'secondary') {
        return {
            background: sanctuary.sageBg,
            color: sanctuary.sage,
            border: `1.5px solid ${sanctuary.sageBorder}`,
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        };
    }
    return {
        background: 'transparent',
        color: sanctuary.textSecondary,
        border: `1.5px solid ${sanctuary.border}`,
        borderRadius: '12px',
        padding: '12px 24px',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    };
};
