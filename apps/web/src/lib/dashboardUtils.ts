import type { ABCEntry } from '../hooks/useABCLogs';

export const WISDOM_QUOTES = [
    'She is not trapped in a perpetual loop. She is a living, alive celestine prophecy.',
    'He can actually taste his own vibrancy. Self-motivating, self-satisfactioning.',
    'No more dumbing down \u2014 for what? For who? Exquisite views, intentional luxury.',
    'Wonder-filled curiosity, exciting, cages crumbled. Much pride, much humble.',
    'Redefining shining, vibrating sonically. Beautiful beings touched by the sun.',
    'They remember themselves, the costumes are hilarious. We are lifting.',
] as const;

export function getGreeting(): { text: string; subtext: string; iconName: 'moon' | 'sun' | 'sunrise'; timeBlock: string } {
    const hour = new Date().getHours();
    if (hour < 6) return { text: 'Rest well', subtext: "It's late — take only what you need.", iconName: 'moon', timeBlock: 'night' };
    if (hour < 12) return { text: 'Good morning', subtext: 'A new day. A fresh start.', iconName: 'sunrise', timeBlock: 'morning' };
    if (hour < 17) return { text: 'Good afternoon', subtext: 'Your journey continues here.', iconName: 'sun', timeBlock: 'afternoon' };
    if (hour < 21) return { text: 'Good evening', subtext: "Breathe. You've done enough today.", iconName: 'sun', timeBlock: 'evening' };
    return { text: 'Rest well', subtext: 'Tomorrow is another opportunity.', iconName: 'moon', timeBlock: 'night' };
}

export function getContextualSuggestion(logs: ABCEntry[], timeBlock: string, mode: 'survival' | 'growth'): { textKey: string; actionKey: string; link: string; contextValue?: number } | null {
    if (mode === 'survival') return null;

    // No logs yet — encourage first capture
    if (logs.length === 0) {
        return {
            textKey: 'dashboard.suggest.firstLog.text',
            actionKey: 'dashboard.suggest.firstLog.action',
            link: '/log'
        };
    }

    // Recent high-intensity logs — suggest Oracle
    const recentHigh = logs.slice(0, 3).filter(l => l.intensity >= 7);
    if (recentHigh.length >= 2) {
        return {
            textKey: 'dashboard.suggest.highIntensity.text',
            actionKey: 'dashboard.suggest.highIntensity.action',
            link: '/chat'
        };
    }

    // Morning — check-in first, then suggest capture
    if (timeBlock === 'morning') {
        return {
            textKey: 'dashboard.suggest.morning.text',
            actionKey: 'dashboard.suggest.morning.action',
            link: '/log'
        };
    }

    // Evening — reflect
    if (timeBlock === 'evening' || timeBlock === 'night') {
        return {
            textKey: 'dashboard.suggest.evening.text',
            actionKey: 'dashboard.suggest.evening.action',
            link: '/chat'
        };
    }

    // Enough logs for a share packet
    if (logs.length >= 5) {
        return {
            textKey: 'dashboard.suggest.share.text',
            actionKey: 'dashboard.suggest.share.action',
            link: '/bridge',
            contextValue: logs.length
        };
    }

    return null;
}
