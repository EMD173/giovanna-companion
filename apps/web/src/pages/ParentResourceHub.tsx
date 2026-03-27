/**
 * Parent Resource Hub - The Sanctuary
 * 
 * A warm, inviting space for caregivers to find support.
 * Premium design with glass morphism, soft shadows, and proper spacing.
 */

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Heart, Users, MessageSquare, ChevronLeft, Copy, Check,
    ExternalLink, AlertCircle, Lightbulb, XCircle, FileText,
    Flame, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import { PARENT_RESOURCES, RESOURCE_CATEGORIES, getResourceBySlug, type ParentResource, type ResourceCategory } from '../data/parentResourceHub';
import { showToast } from '../components/Toast';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

// Warm, soft gradient backgrounds for icons
const ICON_GRADIENTS: Record<string, React.CSSProperties> = {
    rose: {
        background: 'linear-gradient(135deg, #FECDD3 0%, #FCA5A5 100%)',
    },
    blue: {
        background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 100%)',
    },
    amber: {
        background: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
    },
    green: {
        background: 'linear-gradient(135deg, #BBF7D0 0%, #86EFAC 100%)',
    }
};

const ICON_COLORS: Record<string, string> = {
    rose: '#9F1239',
    blue: '#5B21B6',
    amber: '#92400E',
    green: '#166534'
};

// Icon mapping
const ICONS: Record<string, React.ElementType> = {
    Battery: Flame,
    Users: Users,
    MessageSquare: MessageSquare,
    GraduationCap: Shield,
    Heart: Heart
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
    const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');

    const filteredResources = activeCategory === 'all'
        ? PARENT_RESOURCES
        : PARENT_RESOURCES.filter(r => r.category === activeCategory);

    return (
        <div style={{
            padding: '24px 20px 120px 20px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <header style={{ marginBottom: '32px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '8px'
                }}>
                    {/* Icon Container - Properly Aligned */}
                    <div style={{
                        width: '56px',
                        height: '56px',
                        minWidth: '56px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #FECDD3 0%, #FCA5A5 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(159, 18, 57, 0.15)'
                    }}>
                        <Heart size={28} color="#9F1239" />
                    </div>

                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#3D3832',
                            margin: 0,
                            lineHeight: 1.2
                        }}>
                            The Sanctuary
                        </h1>
                    </div>
                </div>

                <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '1rem',
                    color: '#6B6560',
                    margin: 0,
                    lineHeight: 1.6
                }}>
                    Resources for your family, your advocacy, and yourself.
                </p>
            </header>

            <DisclaimerBanner storageKey="resource_hub_disclaimer" />

            {/* Category Filter Pills */}
            <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                padding: '4px 0 16px 0',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}>
                {/* All button */}
                <button
                    onClick={() => setActiveCategory('all')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        border: 'none',
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '0.85rem',
                        fontWeight: activeCategory === 'all' ? 700 : 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.25s ease',
                        background: activeCategory === 'all'
                            ? 'linear-gradient(135deg, #D4A853 0%, #C09840 100%)'
                            : 'rgba(255, 255, 255, 0.8)',
                        color: activeCategory === 'all' ? 'white' : '#6B6560',
                        boxShadow: activeCategory === 'all'
                            ? '0 4px 12px rgba(212, 168, 83, 0.3)'
                            : '0 1px 4px rgba(61, 56, 50, 0.06)',
                    }}
                >
                    ✨ All ({PARENT_RESOURCES.length})
                </button>
                {RESOURCE_CATEGORIES.map(cat => {
                    const count = PARENT_RESOURCES.filter(r => r.category === cat.key).length;
                    const isActive = activeCategory === cat.key;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                border: 'none',
                                fontFamily: "'Nunito', sans-serif",
                                fontSize: '0.85rem',
                                fontWeight: isActive ? 700 : 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.25s ease',
                                background: isActive
                                    ? 'linear-gradient(135deg, #D4A853 0%, #C09840 100%)'
                                    : 'rgba(255, 255, 255, 0.8)',
                                color: isActive ? 'white' : '#6B6560',
                                boxShadow: isActive
                                    ? '0 4px 12px rgba(212, 168, 83, 0.3)'
                                    : '0 1px 4px rgba(61, 56, 50, 0.06)',
                            }}
                        >
                            {cat.emoji} {cat.label} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Divider */}
            <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #D4A853, transparent)',
                margin: '0 0 16px 0'
            }} />

            {/* Resource Cards - Warm Glass Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredResources.map((resource) => {
                    const IconComponent = ICONS[resource.icon] || Heart;
                    const iconGradient = ICON_GRADIENTS[resource.color] || ICON_GRADIENTS.rose;
                    const iconColor = ICON_COLORS[resource.color] || ICON_COLORS.rose;

                    return (
                        <Link
                            key={resource.id}
                            to={`/resources/${resource.slug}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '20px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.7)',
                                borderRadius: '20px',
                                boxShadow: '0 4px 24px rgba(61, 56, 50, 0.06)',
                                textDecoration: 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 8px 40px rgba(61, 56, 50, 0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 24px rgba(61, 56, 50, 0.06)';
                            }}
                        >
                            {/* Icon - Properly Aligned */}
                            <div style={{
                                width: '56px',
                                height: '56px',
                                minWidth: '56px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                ...iconGradient
                            }}>
                                <IconComponent size={26} color={iconColor} />
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 style={{
                                    fontFamily: "'Playfair Display', Georgia, serif",
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    color: '#3D3832',
                                    margin: '0 0 4px 0',
                                    lineHeight: 1.3
                                }}>
                                    {resource.title}
                                </h3>
                                <p style={{
                                    fontFamily: "'Nunito', sans-serif",
                                    fontSize: '0.9rem',
                                    color: '#6B6560',
                                    margin: 0,
                                    lineHeight: 1.5
                                }}>
                                    {resource.subtitle}
                                </p>
                            </div>

                            {/* Arrow - Glass Bubble */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                minWidth: '40px',
                                borderRadius: '100px',
                                background: 'rgba(107, 76, 154, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.3s ease'
                            }}>
                                <ChevronRight size={20} color="#6B4C9A" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Footer Quote */}
            <div style={{
                marginTop: '40px',
                padding: '24px',
                background: 'linear-gradient(135deg, #3D3832 0%, #2D2A26 100%)',
                borderRadius: '20px',
                textAlign: 'center'
            }}>
                <Sparkles size={22} color="#D4A853" style={{ marginBottom: '12px' }} />
                <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.7,
                    margin: 0,
                    maxWidth: '320px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    "You cannot pour from an empty vessel. These resources are here to refill yours."
                </p>
            </div>
        </div>
    );
}

function ResourceDetail({ resource }: { resource: ParentResource }) {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const IconComponent = ICONS[resource.icon] || Heart;

    const handleCopyScript = async () => {
        await navigator.clipboard.writeText(resource.copyReadyScript.script);
        setCopied(true);
        showToast('Script copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            padding: '24px 20px 120px 20px',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            {/* Back Button - Glass Bubble */}
            <button
                onClick={() => navigate('/resources')}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '100px',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: '#6B6560',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    transition: 'all 0.2s ease'
                }}
            >
                <ChevronLeft size={18} />
                Back to Sanctuary
            </button>

            {/* Header Card */}
            <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #6B4C9A 0%, #4A3570 100%)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(107, 76, 154, 0.25)'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        minWidth: '56px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <IconComponent size={28} color="white" />
                    </div>
                    <div>
                        <h1 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            color: 'white',
                            margin: '0 0 4px 0',
                            lineHeight: 1.2
                        }}>
                            {resource.title}
                        </h1>
                        <p style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: '0.95rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: 0
                        }}>
                            {resource.subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* What This Is */}
            <section style={{
                padding: '24px',
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #E8E2DA',
                boxShadow: '0 2px 8px rgba(61, 56, 50, 0.04)'
            }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#3D3832',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <AlertCircle size={20} color="#6B6560" />
                    What This Is
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resource.whatThisIs.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontSize: '1rem',
                            color: '#6B6560',
                            lineHeight: 1.7,
                            margin: 0
                        }}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* What Helps - Soft Green */}
            <section style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                borderRadius: '20px',
                border: '1px solid #BBF7D0'
            }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#166534',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <Lightbulb size={20} color="#22C55E" />
                    What Helps This Week
                </h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resource.whatHelpsThisWeek.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                minWidth: '24px',
                                borderRadius: '100px',
                                background: '#22C55E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px'
                            }}>
                                <Check size={14} color="white" />
                            </div>
                            <span style={{
                                fontFamily: "'Nunito', sans-serif",
                                fontSize: '0.95rem',
                                color: '#166534',
                                lineHeight: 1.6
                            }}>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* What to Avoid - Soft Rose */}
            <section style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
                borderRadius: '20px',
                border: '1px solid #FECDD3'
            }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#9F1239',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <XCircle size={20} color="#F43F5E" />
                    What to Avoid
                </h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {resource.whatToAvoid.map((item, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                minWidth: '24px',
                                borderRadius: '100px',
                                background: '#F43F5E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '2px'
                            }}>
                                <XCircle size={14} color="white" />
                            </div>
                            <span style={{
                                fontFamily: "'Nunito', sans-serif",
                                fontSize: '0.95rem',
                                color: '#9F1239',
                                lineHeight: 1.6
                            }}>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Copy-Ready Script - Soft Purple */}
            <section style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
                borderRadius: '20px',
                border: '1px solid #C4B5FD'
            }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#5B21B6',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <FileText size={20} color="#8B5CF6" />
                    Copy-Ready Script
                </h2>
                <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: '0.9rem',
                    color: '#6B21A8',
                    margin: '0 0 16px 0',
                    opacity: 0.8
                }}>
                    {resource.copyReadyScript.context}
                </p>

                <div style={{
                    padding: '16px',
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E9D5FF'
                }}>
                    <pre style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: '0.9rem',
                        color: '#3D3832',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        margin: 0
                    }}>
                        {resource.copyReadyScript.script}
                    </pre>
                </div>

                <button
                    onClick={handleCopyScript}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '16px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #6B4C9A 0%, #8B6BB8 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '100px',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(107, 76, 154, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {copied ? (
                        <><Check size={18} /> Copied!</>
                    ) : (
                        <><Copy size={18} /> Copy Script</>
                    )}
                </button>
            </section>

            {/* Related Links */}
            {resource.relatedLinks.length > 0 && (
                <section style={{
                    padding: '24px',
                    background: 'white',
                    borderRadius: '20px',
                    border: '1px solid #E8E2DA',
                    boxShadow: '0 2px 8px rgba(61, 56, 50, 0.04)'
                }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#3D3832',
                        margin: '0 0 16px 0'
                    }}>
                        Learn More
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {resource.relatedLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontFamily: "'Nunito', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: '#6B4C9A',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s ease'
                                }}
                            >
                                <ExternalLink size={16} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
