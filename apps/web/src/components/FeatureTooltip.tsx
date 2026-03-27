/**
 * FeatureTooltip — Contextual Explanation Overlay
 *
 * Wraps any element and shows a tooltip with an explanation from the App Guide.
 * Works on hover (desktop) and tap (mobile).
 * Pulls descriptions from the centralized EC_CONCEPT_GUIDE data.
 *
 * Usage:
 *   <FeatureTooltip term="Capture (Behavior Logging)">
 *     <span>Capture</span>
 *   </FeatureTooltip>
 */

import React, { useState, useRef, useEffect } from 'react';
import { EC_CONCEPT_GUIDE, type ConceptEntry } from '../data/ambassadorCodes';
import { sanctuary, typography } from '../shared/theme';

interface FeatureTooltipProps {
    /** Must match a `term` in EC_CONCEPT_GUIDE exactly, OR use fuzzy match */
    term?: string;
    /** Or pass a custom tooltip directly */
    customTip?: string;
    /** Children to wrap */
    children: React.ReactNode;
    /** Placement preference */
    position?: 'top' | 'bottom';
}

/**
 * Look up a concept by fuzzy matching the term name
 * (e.g. "Insight" will match "Oracle AI (Chat)")
 */
const TERM_MAP: Record<string, string> = {
    // Nav item names → App Guide terms
    'Home': 'Dashboard (Home)',
    'Journey': 'Dashboard (Home)',
    'Capture': 'Capture (Behavior Logging)',
    'Insight': 'Oracle AI (Chat)',
    'Chat': 'Oracle AI (Chat)',
    'Practice': 'Behavior Is Communication',
    'Educator': 'Educator Training',
    'Learn': 'Educator Training',
    'Respite': 'The Sanctuary (Resources)',
    'Village': 'Professional Referral (/refer)',
    'Settings': 'Therapy Approach Selector',
    'Resources': 'The Sanctuary (Resources)',
    'Self-Assessment': 'Self-Assessment',
    'Bridge': 'Bridge (Share Reports)',
};

function findConcept(term: string): ConceptEntry | null {
    // Direct match first
    const direct = EC_CONCEPT_GUIDE.find(c => c.term === term);
    if (direct) return direct;

    // Try mapped match
    const mapped = TERM_MAP[term];
    if (mapped) {
        return EC_CONCEPT_GUIDE.find(c => c.term === mapped) || null;
    }

    // Fuzzy: find first concept whose term contains the search term
    const lower = term.toLowerCase();
    return EC_CONCEPT_GUIDE.find(c => c.term.toLowerCase().includes(lower)) || null;
}

export function FeatureTooltip({
    term,
    customTip,
    children,
    position = 'bottom',
}: FeatureTooltipProps) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const concept = term ? findConcept(term) : null;
    const tipText = customTip || concept?.simple;

    // Close on outside click (mobile)
    useEffect(() => {
        if (!visible) return;
        const handleClick = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, [visible]);

    // Don't render tooltip wrapper if no tip available
    if (!tipText) {
        return <>{children}</>;
    }

    const show = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(true);
    };

    const hide = () => {
        timeoutRef.current = setTimeout(() => setVisible(false), 200);
    };

    const handleTap = (e: React.TouchEvent) => {
        e.preventDefault();
        setVisible(v => !v);
    };

    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        [position === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '280px',
        maxWidth: '90vw',
        padding: '14px 16px',
        borderRadius: '14px',
        background: sanctuary.bgCard,
        border: `1px solid ${sanctuary.goldBorder}`,
        boxShadow: '0 8px 32px rgba(45, 42, 38, 0.15)',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        transformOrigin: position === 'top' ? 'bottom center' : 'top center',
    };

    return (
        <div
            ref={tooltipRef}
            style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={show}
            onMouseLeave={hide}
            onTouchStart={handleTap}
        >
            {children}

            {/* Tooltip */}
            <div style={tooltipStyle} role="tooltip">
                {concept && (
                    <p style={{
                        fontFamily: typography.heading, fontWeight: 700,
                        color: sanctuary.gold, fontSize: '0.78rem',
                        margin: '0 0 6px', letterSpacing: '0.02em',
                    }}>
                        {concept.module || 'Feature'}
                    </p>
                )}
                <p style={{
                    fontFamily: typography.body, fontSize: '0.84rem',
                    color: sanctuary.text, lineHeight: 1.6,
                    margin: 0,
                }}>
                    {tipText}
                </p>
                {concept?.deeper && (
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.76rem',
                        color: sanctuary.textMuted, lineHeight: 1.5,
                        margin: '8px 0 0', fontStyle: 'italic',
                        borderTop: `1px solid ${sanctuary.borderLight}`,
                        paddingTop: '8px',
                    }}>
                        {concept.deeper}
                    </p>
                )}
                {/* Small arrow */}
                <div style={{
                    position: 'absolute',
                    [position === 'top' ? 'bottom' : 'top']: '-6px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${position === 'top' ? '180deg' : '0deg'})`,
                    width: 0, height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: `6px solid ${sanctuary.goldBorder}`,
                }} />
            </div>
        </div>
    );
}
