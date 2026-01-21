/**
 * Disclaimer Banner Component
 * 
 * Displays educational support disclaimer per Trust Stack requirements.
 */

import { Info, X } from 'lucide-react';
import { useState } from 'react';

interface DisclaimerBannerProps {
    variant?: 'info' | 'warning';
    dismissible?: boolean;
    storageKey?: string;
}

export function DisclaimerBanner({
    variant = 'info',
    dismissible = true,
    storageKey = 'giovanna_disclaimer_dismissed'
}: DisclaimerBannerProps) {
    const [dismissed, setDismissed] = useState(() => {
        if (!dismissible) return false;
        return localStorage.getItem(storageKey) === 'true';
    });

    if (dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        if (storageKey) {
            localStorage.setItem(storageKey, 'true');
        }
    };

    const bgColor = variant === 'info' ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200';
    const textColor = variant === 'info' ? 'text-blue-800' : 'text-amber-800';
    const iconColor = variant === 'info' ? 'text-blue-500' : 'text-amber-500';

    return (
        <div className={`${bgColor} border rounded-lg p-3 mb-4`}>
            <div className="flex items-start gap-3">
                <Info size={18} className={`${iconColor} flex-shrink-0 mt-0.5`} />
                <div className={`flex-1 text-sm ${textColor}`}>
                    <p>
                        <strong>Educational Support Only.</strong> Giovanna provides information and tools
                        to help you understand and support your child. This is not medical advice, therapy,
                        or a substitute for professional evaluation.
                    </p>
                </div>
                {dismissible && (
                    <button
                        onClick={handleDismiss}
                        className={`${textColor} hover:opacity-70`}
                        aria-label="Dismiss"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Compact disclaimer for chat contexts
 */
export function ChatDisclaimer() {
    return (
        <p className="text-xs text-slate-400 text-center px-4 py-2">
            Giovanna provides educational support, not medical advice.
            Always consult professionals for clinical decisions.
        </p>
    );
}
