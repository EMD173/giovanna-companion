/**
 * Crisis Resources Component
 * 
 * Provides immediate access to crisis support resources.
 * Visible in Settings and accessible throughout the app.
 */

import { Phone, ExternalLink, AlertTriangle, Heart, MessageCircle } from 'lucide-react';

interface CrisisResource {
    name: string;
    description: string;
    phone?: string;
    text?: string;
    url?: string;
    icon: React.ReactNode;
}

const CRISIS_RESOURCES: CrisisResource[] = [
    {
        name: '988 Suicide & Crisis Lifeline',
        description: '24/7 support for mental health crises',
        phone: '988',
        text: '988',
        url: 'https://988lifeline.org',
        icon: <Phone size={20} />
    },
    {
        name: 'Crisis Text Line',
        description: 'Text HOME to 741741 for free crisis counseling',
        text: 'HOME to 741741',
        url: 'https://www.crisistextline.org',
        icon: <MessageCircle size={20} />
    },
    {
        name: 'Autism Society Crisis Resources',
        description: 'Resources specifically for autism families',
        url: 'https://autismsociety.org/resources/',
        icon: <Heart size={20} />
    },
    {
        name: 'SAMHSA National Helpline',
        description: 'Substance abuse and mental health services',
        phone: '1-800-662-4357',
        url: 'https://www.samhsa.gov/find-help/national-helpline',
        icon: <Phone size={20} />
    }
];

export function CrisisResources() {
    return (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-4">
            <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-rose-600 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-rose-900">Crisis Support</h3>
                    <p className="text-sm text-rose-700">
                        If you or your child are in crisis, please reach out to these resources.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {CRISIS_RESOURCES.map((resource) => (
                    <div
                        key={resource.name}
                        className="bg-white rounded-lg p-3 border border-rose-100"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-rose-600">{resource.icon}</span>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{resource.name}</h4>
                                <p className="text-xs text-slate-600">{resource.description}</p>

                                <div className="flex flex-wrap gap-2 mt-2">
                                    {resource.phone && (
                                        <a
                                            href={`tel:${resource.phone}`}
                                            className="inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded hover:bg-rose-200"
                                        >
                                            <Phone size={12} />
                                            Call {resource.phone}
                                        </a>
                                    )}
                                    {resource.text && !resource.phone?.includes(resource.text) && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            <MessageCircle size={12} />
                                            Text {resource.text}
                                        </span>
                                    )}
                                    {resource.url && (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded hover:bg-slate-200"
                                        >
                                            <ExternalLink size={12} />
                                            Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-rose-600 text-center">
                This list is not exhaustive. For emergencies, call 911.
            </p>
        </div>
    );
}

/**
 * Compact crisis link for headers/footers
 */
export function CrisisLink() {
    return (
        <a
            href="tel:988"
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700"
        >
            <Phone size={12} />
            <span>Crisis: 988</span>
        </a>
    );
}
