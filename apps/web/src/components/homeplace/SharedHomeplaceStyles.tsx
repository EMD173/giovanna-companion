import React from 'react';
import { sanctuary, typography } from '../../shared/theme';

export const filterLabelStyle: React.CSSProperties = {
    display: 'block', fontFamily: typography.body, fontWeight: 700,
    fontSize: '0.78rem', color: sanctuary.textMuted, marginBottom: '8px',
    letterSpacing: '0.06em', textTransform: 'uppercase',
};

export const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '12px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
    fontFamily: typography.body, fontSize: '0.88rem', color: sanctuary.text,
    cursor: 'pointer',
};

export const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '14px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bg,
    fontFamily: typography.body, fontSize: '0.92rem', color: sanctuary.text,
    boxSizing: 'border-box',
};

export const backBtnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '10px 16px', borderRadius: '12px',
    border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
    color: sanctuary.textSecondary, fontSize: '0.85rem', fontWeight: 600,
    fontFamily: typography.body, cursor: 'pointer', marginBottom: '24px',
    textDecoration: 'none',
};

export const stepTitleStyle: React.CSSProperties = {
    fontFamily: typography.heading, fontWeight: 700, fontSize: '1.3rem',
    color: sanctuary.text, marginBottom: '24px',
};

export function tagStyle(bg: string, color: string): React.CSSProperties {
    return {
        padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem',
        fontWeight: 700, fontFamily: typography.body,
        background: bg, color: color,
    };
}

export function contactBtnStyle(bg: string, color: string): React.CSSProperties {
    return {
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        padding: '10px 18px', borderRadius: '12px',
        background: bg, color: color,
        fontSize: '0.85rem', fontWeight: 700, fontFamily: typography.body,
        textDecoration: 'none', border: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease',
    };
}

export function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: '7px 14px', borderRadius: '10px',
            border: `1px solid ${active ? sanctuary.purpleBorder : sanctuary.border}`,
            background: active ? sanctuary.purpleBg : sanctuary.bgCard,
            color: active ? sanctuary.purple : sanctuary.textSecondary,
            fontSize: '0.78rem', fontWeight: active ? 700 : 500,
            fontFamily: typography.body, cursor: 'pointer',
            transition: 'all 0.15s ease',
        }}>
            {label}
        </button>
    );
}

export function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{
                display: 'block', fontFamily: typography.body, fontWeight: 700,
                fontSize: '0.85rem', color: sanctuary.text, marginBottom: '8px',
            }}>
                {label} {required && <span style={{ color: sanctuary.rose }}>*</span>}
            </label>
            {children}
        </div>
    );
}
