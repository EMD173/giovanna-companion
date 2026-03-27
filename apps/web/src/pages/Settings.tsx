/**
 * Settings — Premium Sanctuary Theme
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useECMode } from '../contexts/ECModeContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import {
    Sparkles, Shield, Bell, LogOut, ChevronRight, Loader2,
    Download, Trash2, AlertTriangle, MessageSquare, Compass, Play
} from 'lucide-react';
import { showToast } from '../components/Toast';
import { CrisisResources } from '../components/CrisisResources';
import { FeedbackModal } from '../components/FeedbackModal';
import { sanctuary, typography } from '../shared/theme';
import {
    THERAPY_APPROACHES,
    getSelectedApproach,
    setSelectedApproach,
} from '../data/therapyApproaches';

export function Settings() {
    const { user, logout } = useAuth();
    const { enabled, loading, toggle } = useECMode();

    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTherapy, setShowTherapy] = useState(false);
    const [selectedTherapy, setSelectedTherapy] = useState(getSelectedApproach());
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);

    const handleTherapySelect = (id: string) => {
        setSelectedApproach(id);
        setSelectedTherapy(id);
        showToast(`Therapy approach updated to ${THERAPY_APPROACHES.find(a => a.id === id)?.shortName}`, 'success');
    };

    const handleReplayTour = () => {
        localStorage.removeItem('giovanna_walkthrough_completed');
        window.location.href = '/dashboard';
    };

    const functions = getFunctions(getApp());

    if (!user) {
        return (
            <div style={{
                background: sanctuary.bg, minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <p style={{ color: sanctuary.textMuted, fontFamily: typography.body }}>
                    Please sign in to access settings.
                </p>
            </div>
        );
    }

    const handleExportData = async () => {
        setExporting(true);
        try {
            const exportUserData = httpsCallable(functions, 'exportUserData');
            const result = await exportUserData({});
            const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `giovanna-data-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('Failed to export data. Please try again.', 'error');
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm !== 'DELETE') {
            showToast('Please type DELETE to confirm', 'error');
            return;
        }
        setDeleting(true);
        try {
            const deleteAccount = httpsCallable(functions, 'deleteAccount');
            await deleteAccount({});
            showToast('Account deleted. Goodbye.', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete account. Please contact support.', 'error');
            setDeleting(false);
        }
    };

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
            <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>

                <h1 className="sanctuary-enter" style={{
                    fontFamily: typography.heading,
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    color: sanctuary.text,
                    letterSpacing: '-0.02em',
                    marginBottom: '28px',
                }}>Settings</h1>

                {/* User Card */}
                <div className="sanctuary-enter sanctuary-enter-1 sanctuary-card" style={{
                    background: sanctuary.bgCard,
                    borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    padding: '20px',
                    boxShadow: sanctuary.shadow,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}>
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="" style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            border: `2px solid ${sanctuary.gold}30`,
                        }} />
                    ) : (
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: sanctuary.gold, fontWeight: 700, fontSize: '1.1rem',
                            fontFamily: typography.heading,
                        }}>
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                        </div>
                    )}
                    <div>
                        <p style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.text, fontSize: '1.05rem',
                        }}>{user.displayName || 'User'}</p>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.85rem',
                            fontFamily: typography.body,
                        }}>{user.email}</p>
                    </div>
                </div>

                {/* EC Mode Toggle */}
                <div className="sanctuary-enter sanctuary-enter-2 sanctuary-card" style={{
                    background: sanctuary.bgCard,
                    borderRadius: '20px',
                    border: `1px solid ${sanctuary.goldBorder}`,
                    padding: '20px',
                    boxShadow: sanctuary.shadow,
                    marginBottom: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: '20px', right: '20px', height: '2px',
                        background: `linear-gradient(90deg, transparent, ${sanctuary.gold}40, transparent)`,
                    }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: sanctuary.gold, flexShrink: 0,
                            }}><Sparkles size={18} /></div>
                            <div>
                                <h3 style={{
                                    fontFamily: typography.heading, fontWeight: 700,
                                    color: sanctuary.text, fontSize: '1rem', marginBottom: '4px',
                                }}>Epigenetic Consciousness Mode</h3>
                                <p style={{
                                    color: sanctuary.textMuted, fontSize: '0.85rem',
                                    fontFamily: typography.body, lineHeight: 1.6,
                                }}>
                                    Adds reflection prompts that consider environment, history, and nervous system alongside ABA guidance.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggle}
                            disabled={loading}
                            style={{
                                position: 'relative',
                                width: '52px', height: '32px',
                                borderRadius: '100px',
                                border: 'none',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'background 0.2s ease',
                                background: enabled ? sanctuary.sage : '#D1CCC5',
                            }}
                        >
                            {loading ? (
                                <Loader2 size={16} style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    color: '#fff',
                                    animation: 'spin 1s linear infinite',
                                }} />
                            ) : (
                                <div style={{
                                    position: 'absolute', top: '3px',
                                    width: '26px', height: '26px',
                                    borderRadius: '50%', background: '#fff',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.2s ease',
                                    transform: enabled ? 'translateX(23px)' : 'translateX(3px)',
                                }} />
                            )}
                        </button>
                    </div>

                    {enabled && (
                        <div style={{
                            marginTop: '16px', padding: '12px',
                            background: sanctuary.sageBg, borderRadius: '10px',
                            border: `1px solid ${sanctuary.sageBorder}`,
                            color: sanctuary.sage, fontSize: '0.85rem',
                            fontFamily: typography.body,
                        }}>
                            <strong>Active:</strong> You'll see EC Lens Cards in the Learning Hub, ABC Logger, and Share Packets.
                        </div>
                    )}
                </div>

                {/* Therapy Approach Selector */}
                <div className="sanctuary-enter sanctuary-enter-3" style={{
                    background: sanctuary.bgCard,
                    borderRadius: '20px',
                    border: `1px solid ${showTherapy ? sanctuary.goldBorder : sanctuary.border}`,
                    boxShadow: sanctuary.shadow,
                    marginBottom: '16px',
                    overflow: 'hidden',
                    transition: 'border-color 0.3s ease',
                }}>
                    <button
                        onClick={() => setShowTherapy(!showTherapy)}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', padding: '16px 20px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: sanctuary.goldBg, border: `1px solid ${sanctuary.goldBorder}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Compass size={18} color={sanctuary.gold} />
                            </div>
                            <div>
                                <h3 style={{
                                    fontFamily: typography.heading, fontWeight: 700,
                                    color: sanctuary.text, fontSize: '1rem', marginBottom: '2px',
                                }}>Therapy Approach</h3>
                                <p style={{
                                    fontFamily: typography.body, fontSize: '0.82rem',
                                    color: sanctuary.textMuted,
                                }}>
                                    {THERAPY_APPROACHES.find(a => a.id === selectedTherapy)?.icon}{' '}
                                    {THERAPY_APPROACHES.find(a => a.id === selectedTherapy)?.shortName || 'Blended'}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={18} style={{
                            color: sanctuary.textMuted,
                            transition: 'transform 0.2s',
                            transform: showTherapy ? 'rotate(90deg)' : 'none',
                        }} />
                    </button>

                    {showTherapy && (
                        <div style={{
                            padding: '4px 20px 20px',
                            borderTop: `1px solid ${sanctuary.border}`,
                            display: 'flex', flexDirection: 'column', gap: '8px',
                        }}>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.85rem',
                                color: sanctuary.textSecondary, lineHeight: 1.6,
                                margin: '12px 0 8px',
                            }}>
                                Choose the approach that resonates with your family. Giovanna adapts
                                its strategies and language to match.
                            </p>
                            {THERAPY_APPROACHES.map(approach => {
                                const isSelected = selectedTherapy === approach.id;
                                return (
                                    <button
                                        key={approach.id}
                                        onClick={() => handleTherapySelect(approach.id)}
                                        style={{
                                            width: '100%', padding: '14px 16px',
                                            borderRadius: '14px', border: 'none',
                                            background: isSelected
                                                ? `linear-gradient(135deg, ${sanctuary.gold}12, ${sanctuary.goldLight}12)`
                                                : sanctuary.bgAlt,
                                            outline: isSelected ? `2px solid ${sanctuary.gold}50` : 'none',
                                            cursor: 'pointer', textAlign: 'left',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            marginBottom: '4px',
                                        }}>
                                            <span style={{ fontSize: '1.2rem' }}>{approach.icon}</span>
                                            <span style={{
                                                fontFamily: typography.heading, fontWeight: 700,
                                                color: isSelected ? sanctuary.gold : sanctuary.text,
                                                fontSize: '0.92rem',
                                            }}>
                                                {approach.shortName}
                                            </span>
                                            {isSelected && (
                                                <span style={{
                                                    marginLeft: 'auto', fontSize: '0.72rem',
                                                    padding: '2px 8px', borderRadius: '100px',
                                                    background: sanctuary.goldBg, color: sanctuary.gold,
                                                    fontWeight: 700, fontFamily: typography.body,
                                                }}>Active</span>
                                            )}
                                        </div>
                                        <p style={{
                                            fontFamily: typography.body, fontSize: '0.8rem',
                                            color: sanctuary.textMuted, lineHeight: 1.5,
                                            paddingLeft: '30px',
                                        }}>
                                            {approach.tagline}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Replay Tour */}
                <button
                    onClick={handleReplayTour}
                    className="sanctuary-enter sanctuary-enter-3 sanctuary-card"
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: '12px', padding: '16px 20px', marginBottom: '16px',
                        background: sanctuary.bgCard, borderRadius: '16px',
                        border: `1px solid ${sanctuary.border}`,
                        boxShadow: sanctuary.shadow, cursor: 'pointer',
                        fontFamily: typography.body,
                    }}
                >
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Play size={18} color={sanctuary.sage} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{
                            fontFamily: typography.heading, fontWeight: 700,
                            color: sanctuary.text, fontSize: '0.95rem',
                        }}>Replay Guided Tour</p>
                        <p style={{
                            fontFamily: typography.body, fontSize: '0.8rem',
                            color: sanctuary.textMuted,
                        }}>Walk through how the app works</p>
                    </div>
                    <ChevronRight size={18} style={{ color: sanctuary.textMuted, marginLeft: 'auto' }} />
                </button>

                {/* Settings List */}
                <div className="sanctuary-enter sanctuary-enter-3" style={{
                    background: sanctuary.bgCard,
                    borderRadius: '20px',
                    border: `1px solid ${sanctuary.border}`,
                    boxShadow: sanctuary.shadow,
                    marginBottom: '16px',
                    overflow: 'hidden',
                }}>
                    <SettingRow
                        icon={<Shield size={18} />}
                        label="Privacy & Data"
                        isOpen={showPrivacy}
                        onClick={() => setShowPrivacy(!showPrivacy)}
                    />
                    {showPrivacy && (
                        <div style={{
                            padding: '20px',
                            background: sanctuary.bgAlt,
                            borderTop: `1px solid ${sanctuary.border}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}>
                            <p style={{
                                color: sanctuary.textSecondary, fontSize: '0.88rem',
                                fontFamily: typography.body, lineHeight: 1.6,
                            }}>
                                Your data is stored securely and never shared without your explicit consent.
                            </p>
                            <CrisisResources />
                            <button
                                onClick={handleExportData}
                                disabled={exporting}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '8px', padding: '12px',
                                    background: sanctuary.bgCard, border: `1px solid ${sanctuary.border}`,
                                    borderRadius: '12px', cursor: 'pointer',
                                    fontWeight: 600, fontFamily: typography.body,
                                    color: sanctuary.textSecondary, fontSize: '0.88rem',
                                    opacity: exporting ? 0.5 : 1,
                                }}
                            >
                                {exporting ? <Loader2 size={16} /> : <Download size={16} />}
                                {exporting ? 'Exporting...' : 'Export All My Data (JSON)'}
                            </button>

                            {/* Delete Account */}
                            <div style={{
                                padding: '16px', borderRadius: '12px',
                                background: sanctuary.roseBg,
                                border: `1px solid ${sanctuary.roseBorder}`,
                                display: 'flex', flexDirection: 'column', gap: '12px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <AlertTriangle size={18} style={{ color: sanctuary.rose, flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontWeight: 700, color: sanctuary.rose, fontSize: '0.92rem' }}>Delete Account</p>
                                        <p style={{
                                            color: sanctuary.textSecondary, fontSize: '0.82rem',
                                            fontFamily: typography.body, lineHeight: 1.5,
                                        }}>
                                            This permanently deletes your account and ALL data. This cannot be undone.
                                        </p>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Type DELETE to confirm"
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 12px',
                                        borderRadius: '8px', border: `1px solid ${sanctuary.roseBorder}`,
                                        background: sanctuary.bgCard, fontSize: '0.85rem',
                                        fontFamily: typography.body, outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting || deleteConfirm !== 'DELETE'}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        background: sanctuary.rose,
                                        color: '#fff', border: 'none',
                                        fontWeight: 700, fontSize: '0.88rem',
                                        cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'default',
                                        opacity: deleteConfirm === 'DELETE' ? 1 : 0.4,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        fontFamily: typography.body,
                                    }}
                                >
                                    {deleting ? <Loader2 size={16} /> : <Trash2 size={16} />}
                                    {deleting ? 'Deleting...' : 'Permanently Delete Account'}
                                </button>
                            </div>
                        </div>
                    )}
                    <SettingRow icon={<Bell size={18} />} label="Notifications" onClick={() => {}} />
                    <SettingRow icon={<MessageSquare size={18} />} label="Send Feedback" onClick={() => setShowFeedback(true)} />
                </div>

                <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

                {/* Sign Out */}
                <button
                    onClick={logout}
                    className="sanctuary-enter sanctuary-enter-4 sanctuary-card"
                    style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '10px', padding: '16px',
                        background: sanctuary.bgCard,
                        borderRadius: '16px',
                        border: `1px solid ${sanctuary.roseBorder}`,
                        color: sanctuary.rose,
                        fontWeight: 700, fontSize: '0.92rem',
                        cursor: 'pointer',
                        fontFamily: typography.body,
                    }}
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>
        </div>
    );
}

function SettingRow({ icon, label, onClick, isOpen }: {
    icon: React.ReactNode; label: string; onClick?: () => void; isOpen?: boolean;
}) {
    return (
        <button onClick={onClick} style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: `1px solid ${sanctuary.border}`,
            textAlign: 'left',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: sanctuary.textMuted }}>{icon}</span>
                <span style={{
                    fontFamily: typography.body, fontWeight: 600,
                    color: sanctuary.text, fontSize: '0.95rem',
                }}>{label}</span>
            </div>
            <ChevronRight size={18} style={{
                color: sanctuary.textMuted,
                transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(90deg)' : 'none',
            }} />
        </button>
    );
}
