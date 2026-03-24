/**
 * Sanctuary Icons — Phosphor Duotone Navigation Icons for Giovanna
 *
 * Premium two-tone style with active/inactive state support.
 * Uses @phosphor-icons/react duotone weight for rich, editorial feel.
 */

import {
    House,
    UsersThree,
    Path,
    PencilLine,
    ChatCircleDots,
    GraduationCap,
    Chalkboard,
    HandHeart,
    BookOpenText,
    Heartbeat,
    ShieldCheck,
    CalendarDots,
} from '@phosphor-icons/react';

interface IconProps {
    size?: number;
    active?: boolean;
    className?: string;
}

const getColor = (active: boolean) =>
    active ? 'var(--icon-active)' : 'var(--icon-inactive)';

/**
 * Home/Sanctuary — Warm house icon
 */
export function SanctuaryIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <House
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Village/Community — Three connected people
 */
export function VillageIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <UsersThree
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Journey/Dashboard — Winding path with sparkle
 */
export function JourneyIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <Path
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Capture/Log — Elegant pen for documenting
 */
export function CaptureIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <PencilLine
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Oracle/Chat — Chat bubble with dots (wisdom)
 */
export function OracleIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <ChatCircleDots
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Practice/Curriculum — Graduation cap
 */
export function PracticeIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <GraduationCap
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Educator/Training — Chalkboard with pointer
 */
export function EducatorIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <Chalkboard
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Respite/Care — Hands cradling a heart
 */
export function RespiteIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <HandHeart
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Learn/Book — Open book with text
 */
export function LearnIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <BookOpenText
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Wellness/Heart — Heart with pulse
 */
export function WellnessIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <Heartbeat
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Safety/Shield — Protective shield with check
 */
export function SafetyIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <ShieldCheck
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Advocacy/Shield — Protective shield
 */
export function AdvocacyIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <ShieldCheck
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}

/**
 * Calendar — Calendar with dots
 */
export function CalendarIcon({ size = 24, active = false, className = '' }: IconProps) {
    return (
        <CalendarDots
            size={size}
            weight="duotone"
            color={getColor(active)}
            className={className}
            style={{ transition: 'color 0.2s ease' }}
        />
    );
}
