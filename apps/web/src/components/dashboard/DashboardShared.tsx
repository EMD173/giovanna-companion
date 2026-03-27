import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { sanctuary, typography } from '../../shared/theme';

export function ActionCard({ to, icon, iconColor, iconBg, title, subtitle, accent, i }: {
    to: string; icon: React.ReactNode; iconColor: string; iconBg: string;
    title: string; subtitle: string; accent?: string; i: number;
}) {
    const accentBorder = accent === 'gold' ? sanctuary.goldBorder
        : accent === 'sage' ? sanctuary.sageBorder
        : accent === 'purple' ? sanctuary.purpleBorder
        : accent === 'rose' ? sanctuary.roseBorder
        : sanctuary.border;

    return (
        <Link
            to={to}
            className={`sanctuary-card sanctuary-enter sanctuary-enter-${i}`}
            style={{
                background: sanctuary.bgCard,
                border: `1px solid ${sanctuary.border}`,
                borderRadius: '20px', padding: '24px', height: '190px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                boxShadow: sanctuary.shadow,
            }}
        >
            <div style={{
                position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px',
                background: `linear-gradient(90deg, transparent, ${iconColor}30, transparent)`,
            }} />
            <div style={{
                width: '50px', height: '50px', borderRadius: '16px',
                background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: iconColor, border: `1px solid ${accentBorder}`,
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{
                    fontFamily: typography.heading, fontWeight: 700, fontSize: '1.2rem',
                    color: sanctuary.text, marginBottom: '4px', letterSpacing: '-0.01em',
                }}>{title}</h3>
                <p style={{
                    color: sanctuary.textMuted, fontSize: '0.82rem',
                    fontFamily: typography.body, fontWeight: 400,
                }}>{subtitle}</p>
            </div>
            <ChevronRight size={16} style={{
                position: 'absolute', top: '20px', right: '20px',
                color: sanctuary.borderLight, transition: 'color 0.2s ease',
            }} />
        </Link>
    );
}

export function QuickPill({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
    return (
        <Link to={to} className="sanctuary-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '100px',
            background: sanctuary.bgCard, border: `1px solid ${sanctuary.border}`,
            color: sanctuary.textSecondary, fontSize: '0.82rem', fontWeight: 600,
            fontFamily: typography.body, textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(45, 42, 38, 0.04)',
        }}>
            {icon}
            {label}
        </Link>
    );
}

export function DashboardSectionFallback({ label, minHeight = 120 }: { label: string; minHeight?: number }) {
    return (
        <div
            style={{
                minHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '20px',
                background: sanctuary.bgCard,
                border: `1px solid ${sanctuary.border}`,
                boxShadow: sanctuary.shadow,
            }}
        >
            <span
                style={{
                    color: sanctuary.textMuted,
                    fontFamily: typography.body,
                    fontSize: '0.9rem',
                }}
            >
                {label}
            </span>
        </div>
    );
}
