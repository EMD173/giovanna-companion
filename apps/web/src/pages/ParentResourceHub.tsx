/**
 * Parent Resource Hub Page
 * 
 * Resources for the emotional load of caregiving.
 * Topics: burnout, isolation, family conflict, school prep
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Heart, Battery, Users, MessageSquare, GraduationCap,
    ChevronLeft, Copy, Check, ExternalLink, AlertCircle,
    Lightbulb, XCircle, FileText
} from 'lucide-react';
import { PARENT_RESOURCES, getResourceBySlug, type ParentResource } from '../data/parentResourceHub';
import { showToast } from '../components/Toast';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

// Icon mapping
const ICONS: Record<string, React.ElementType> = {
    Battery,
    Users,
    MessageSquare,
    GraduationCap,
    Heart
};

// Color classes
const COLORS: Record<string, { bg: string; border: string; text: string; light: string }> = {
    rose: { bg: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-700', light: 'bg-rose-50' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-700', light: 'bg-blue-50' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', light: 'bg-amber-50' },
    green: { bg: 'bg-green-500', border: 'border-green-200', text: 'text-green-700', light: 'bg-green-50' }
};

export function ParentResourceHub() {
    const { slug } = useParams<{ slug?: string }>();

    if (slug) {
        const resource = getResourceBySlug(slug);
        if (resource) {
            return <ResourceDetail resource={resource} />;
        }
    }

    return <ResourceList />;
}

function ResourceList() {
    return (
        <div className="pb-24 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Heart size={24} className="text-rose-500" />
                    Parent Resource Hub
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                    The emotional load of caregiving is real. These resources are for you.
                </p>
            </div>

            <DisclaimerBanner storageKey="resource_hub_disclaimer" />

            <div className="grid gap-4">
                {PARENT_RESOURCES.map(resource => {
                    const IconComponent = ICONS[resource.icon] || Heart;
                    const colors = COLORS[resource.color] || COLORS.rose;

                    return (
                        <Link
                            key={resource.id}
                            to={`/resources/${resource.slug}`}
                            className={`block bg-white border ${colors.border} rounded-xl p-4 hover:shadow-md transition-shadow`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${colors.light}`}>
                                    <IconComponent className={colors.text} size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900">{resource.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">{resource.subtitle}</p>
                                </div>
                                <ChevronLeft className="text-slate-400 rotate-180" size={20} />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function ResourceDetail({ resource }: { resource: ParentResource }) {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const IconComponent = ICONS[resource.icon] || Heart;
    const colors = COLORS[resource.color] || COLORS.rose;

    const handleCopyScript = async () => {
        await navigator.clipboard.writeText(resource.copyReadyScript.script);
        setCopied(true);
        showToast('Script copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pb-24 space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/resources')}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
            >
                <ChevronLeft size={20} />
                Back to Resources
            </button>

            {/* Header */}
            <div className={`${colors.light} ${colors.border} border rounded-2xl p-5`}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${colors.bg} bg-opacity-20`}>
                        <IconComponent className={colors.text} size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">{resource.title}</h1>
                        <p className={`text-sm ${colors.text} mt-1`}>{resource.subtitle}</p>
                    </div>
                </div>
            </div>

            {/* What This Is */}
            <section className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <AlertCircle size={18} className="text-slate-500" />
                    What This Is
                </h2>
                <div className="prose prose-sm prose-slate max-w-none">
                    {resource.whatThisIs.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-slate-700 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* What Helps This Week */}
            <section className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h2 className="font-bold text-green-900 flex items-center gap-2 mb-3">
                    <Lightbulb size={18} className="text-green-600" />
                    What Helps This Week
                </h2>
                <ul className="space-y-2">
                    {resource.whatHelpsThisWeek.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                            <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* What to Avoid */}
            <section className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <h2 className="font-bold text-rose-900 flex items-center gap-2 mb-3">
                    <XCircle size={18} className="text-rose-600" />
                    What to Avoid
                </h2>
                <ul className="space-y-2">
                    {resource.whatToAvoid.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-rose-800">
                            <XCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Copy-Ready Script */}
            <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <h2 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-indigo-600" />
                    Copy-Ready Script
                </h2>
                <p className="text-sm text-indigo-700 mb-3">{resource.copyReadyScript.context}</p>

                <div className="bg-white border border-indigo-200 rounded-lg p-4">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {resource.copyReadyScript.script}
                    </pre>
                </div>

                <button
                    onClick={handleCopyScript}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                    {copied ? (
                        <>
                            <Check size={16} /> Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={16} /> Copy Script
                        </>
                    )}
                </button>
            </section>

            {/* Related Links */}
            {resource.relatedLinks.length > 0 && (
                <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <h2 className="font-bold text-slate-900 mb-3">Learn More</h2>
                    <div className="space-y-2">
                        {resource.relatedLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-teal-700 hover:underline"
                            >
                                <ExternalLink size={14} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
