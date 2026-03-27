/**
 * Onboarding Page — Two-Phase Flow
 *
 * Phase 1: IntakeWizard (existing 6-step parent intake)
 * Phase 2: MeetYourChild (new — collects minimum viable child profile)
 *
 * CRITICAL RULE (03/22/2026):
 * The family doc and at least ONE child profile must exist in Firestore
 * BEFORE the parent reaches /dashboard. This ensures activeChild !== null
 * from the first moment they interact with the app.
 *
 * Data written:
 *   users/{uid}        → intakeProfile, pledgeAccepted, etc.
 *   families/{uid}     → adminId, members, children[0], plan, etc.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import { IntakeWizard } from '../components/onboarding/IntakeWizard';
import type { IntakeProfile } from '../types/intake';
import { hasCompletedFamilySetup } from '../lib/launchGuards';
import { Heart, User, Smile, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useI18n } from '../lib/i18n';

// ============================================
// SHARED STYLE TOKENS (match IntakeWizard)
// ============================================

const colors = {
    bg: '#0D0D0D',
    card: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#F5F0E8',
    textMuted: 'rgba(245,240,232,0.55)',
    textDim: 'rgba(245,240,232,0.4)',
    gold: '#D4AF37',
    goldLight: '#E8C97A',
    purple: '#4B0082',
    purpleDark: '#1A0A2E',
    rose: '#B85450',
    error: 'rgba(184,84,80,0.9)',
    errorBg: 'rgba(184,84,80,0.1)',
    errorBorder: 'rgba(184,84,80,0.25)',
};

// ============================================
// CHILD FORM STATE (minimum viable profile)
// ============================================

interface ChildFormData {
    firstName: string;
    preferredName: string;
    pronouns: string;
    dateOfBirth: string;     // ISO string from date input
}

const PRONOUN_OPTIONS = [
    'he/him',
    'she/her',
    'they/them',
    'ze/zir',
    'any pronouns',
];

// ============================================
// MAIN ONBOARDING COMPONENT
// ============================================

export function Onboarding() {
    const { user } = useAuth();
    const { family, loading: familyLoading } = useFamily();
    const navigate = useNavigate();
    const { t } = useI18n();

    // Phase tracking
    const [phase, setPhase] = useState<'intake' | 'child'>('intake');
    const [intakeData, setIntakeData] = useState<IntakeProfile | null>(null);

    // Child form state
    const [child, setChild] = useState<ChildFormData>({
        firstName: '',
        preferredName: '',
        pronouns: '',
        dateOfBirth: '',
    });
    const [childError, setChildError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hasCompletedSetup = hasCompletedFamilySetup(family);

    useEffect(() => {
        // Ambassador mode: skip onboarding entirely — demo data is loaded
        if (localStorage.getItem('AMBASSADOR_MODE') === 'true') {
            navigate('/dashboard', { replace: true });
            return;
        }

        if (!user) {
            navigate('/signup', { replace: true });
            return;
        }

        if (!familyLoading && hasCompletedSetup) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, familyLoading, hasCompletedSetup, navigate]);

    // ---------------------------------------------------
    // Phase 1 complete → store intake data, move to Phase 2
    // ---------------------------------------------------
    const handleIntakeComplete = async (profile: IntakeProfile) => {
        setIntakeData(profile);
        setPhase('child');
        // Scroll to top for the new phase
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ---------------------------------------------------
    // Phase 2 complete → write everything to Firestore
    // ---------------------------------------------------
    const handleFinalSubmit = async () => {
        if (!user) return;

        // Validate child form
        const trimmedName = child.firstName.trim();
        if (!trimmedName) {
            setChildError(t('onboarding.errorName'));
            return;
        }
        if (!child.pronouns) {
            setChildError(t('onboarding.errorPronouns'));
            return;
        }
        if (!child.dateOfBirth) {
            setChildError('Date of birth helps us tailor age-appropriate guidance.');
            return;
        }

        setChildError('');
        setIsSubmitting(true);

        try {
            // Build a clean ChildProfile — Firestore rejects `undefined` values,
            // so we use empty strings/arrays instead. Only include fields we have data for.
            const childId = `child_${Date.now()}`;
            const trimmedPreferred = child.preferredName.trim();
            const childProfile: Record<string, unknown> = {
                id: childId,
                firstName: trimmedName,
                ...(trimmedPreferred ? { preferredName: trimmedPreferred } : {}),
                pronouns: child.pronouns,
                dateOfBirth: new Date(child.dateOfBirth),
                lastName: '',
                interests: [],
                strengths: [],
                diagnoses: [],
                currentGrade: '',
                schoolHistory: [],
                homeplaceSupports: {
                    calmingPractices: [],
                    sensoryTools: [],
                    movement: [],
                    routines: [],
                    trustedPeople: [],
                    communitySpaces: [],
                    musicSounds: [],
                    comfortFoods: [],
                    textures: [],
                    customSupports: []
                },
                therapyServices: [],
                communicationStyle: {
                    primaryMode: 'verbal',
                    expressiveLevel: '',
                    receptiveLevel: '',
                    triggers: [],
                    calmingStrategies: []
                },
                milestones: [],
                narrative: {
                    whoTheyAre: '',
                    whatTheyLove: '',
                    howTheyShow: '',
                    whatHelps: '',
                    dreams: '',
                    updatedAt: new Date()
                }
            };

            // Write user doc (intake profile + pledge)
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                intakeProfile: intakeData,
                pledgeAccepted: true,
                pledgeAcceptedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                onboardingVersion: '2.0'
            }, { merge: true });

            // Write family doc WITH the first child
            await setDoc(doc(db, 'families', user.uid), {
                id: user.uid,
                adminId: user.uid,
                userId: user.uid,
                members: [{
                    userId: user.uid,
                    role: 'admin',
                    name: user.displayName || 'Parent',
                    email: user.email || ''
                }],
                children: [childProfile],
                plan: 'free',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Navigate to dashboard — activeChild will be set by FamilyContext
            navigate('/dashboard', { replace: true });
        } catch (error) {
            console.error('Error completing onboarding:', error);
            setChildError(t('onboarding.errorSave'));
            setIsSubmitting(false);
        }
    };

    // ---------------------------------------------------
    // RENDER
    // ---------------------------------------------------
    if (!user || familyLoading || hasCompletedSetup) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(170deg, #1A0A2E 0%, #110820 40%, #0D0D0D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
            }}>
                <div style={{
                    color: colors.textMuted,
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    {t('onboarding.preparing')}
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(170deg, #1A0A2E 0%, #110820 40%, #0D0D0D 100%)',
            padding: '3rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
        }}>
            {phase === 'intake' ? (
                <IntakeWizard
                    onComplete={handleIntakeComplete}
                    isSubmitting={false}
                />
            ) : (
                <MeetYourChild
                    child={child}
                    onChange={setChild}
                    error={childError}
                    isSubmitting={isSubmitting}
                    onSubmit={handleFinalSubmit}
                    onBack={() => setPhase('intake')}
                />
            )}
        </div>
    );
}

// ============================================
// PHASE 2: MEET YOUR CHILD
// ============================================

interface MeetYourChildProps {
    child: ChildFormData;
    onChange: (data: ChildFormData) => void;
    error: string;
    isSubmitting: boolean;
    onSubmit: () => void;
    onBack: () => void;
}

function MeetYourChild({ child, onChange, error, isSubmitting, onSubmit, onBack }: MeetYourChildProps) {
    const { t } = useI18n();

    const updateField = (field: keyof ChildFormData, value: string) => {
        onChange({ ...child, [field]: value });
    };

    return (
        <div style={{ maxWidth: '640px', width: '100%' }}>
            {/* Progress indicator — shows we're past intake */}
            <div style={{ marginBottom: '24px', padding: '0 4px' }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '10px',
                }}>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 500,
                        color: colors.gold, letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}>{ t('onboarding.intakeComplete')}</span>
                    <span style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        color: colors.gold, letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}>{t('onboarding.meetYourChild')}</span>
                </div>
                <div style={{
                    height: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '100px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', width: '100%',
                        background: `linear-gradient(90deg, ${colors.purple}, ${colors.gold})`,
                        borderRadius: '100px',
                    }} />
                </div>
            </div>

            {/* Card */}
            <div style={{
                background: colors.card,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: '20px',
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
            }}>
                {/* Header */}
                <div style={{
                    background: `linear-gradient(135deg, ${colors.purpleDark} 0%, #0D0D0D 100%)`,
                    padding: '40px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: `linear-gradient(90deg, transparent, ${colors.gold}, ${colors.purple}, ${colors.gold}, transparent)`,
                    }} />
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'rgba(212,175,55,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                    }}>
                        <Heart size={26} color={colors.gold} />
                    </div>
                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.6rem', fontWeight: 700,
                        color: colors.text, marginBottom: '8px',
                    }}>
                        {t('onboarding.childTitle')}
                    </h2>
                    <p style={{
                        color: colors.textMuted, fontSize: '0.95rem',
                        maxWidth: '400px', margin: '0 auto', lineHeight: 1.6,
                    }}>
                        {t('onboarding.childSubtitle')}
                    </p>
                </div>

                {/* Form Fields */}
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* First Name */}
                    <div>
                        <label style={labelStyle}>
                            <User size={16} style={{ color: colors.gold }} />
                            {t('onboarding.firstName')} <span style={{ color: colors.rose }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={child.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            placeholder={t('onboarding.firstNamePlaceholder')}
                            style={inputStyle}
                            autoFocus
                        />
                    </div>

                    {/* Preferred Name */}
                    <div>
                        <label style={labelStyle}>
                            <Smile size={16} style={{ color: colors.gold }} />
                            {t('onboarding.preferredName')} <span style={{ color: colors.textDim, fontWeight: 400, fontSize: '0.8rem' }}>{t('onboarding.preferredNameOptional')}</span>
                        </label>
                        <input
                            type="text"
                            value={child.preferredName}
                            onChange={(e) => updateField('preferredName', e.target.value)}
                            placeholder={t('onboarding.preferredNamePlaceholder')}
                            style={inputStyle}
                        />
                    </div>

                    {/* Pronouns */}
                    <div>
                        <label style={labelStyle}>
                            {t('onboarding.pronouns')} <span style={{ color: colors.rose }}>*</span>
                        </label>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '10px',
                        }}>
                            {PRONOUN_OPTIONS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => updateField('pronouns', p)}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        border: `2px solid ${child.pronouns === p ? colors.gold : 'rgba(255,255,255,0.08)'}`,
                                        background: child.pronouns === p ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                                        color: child.pronouns === p ? colors.gold : colors.textMuted,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label style={labelStyle}>
                            <Calendar size={16} style={{ color: colors.gold }} />
                            Date of Birth <span style={{ color: colors.rose }}>*</span>
                        </label>
                        <input
                            type="date"
                            value={child.dateOfBirth}
                            onChange={(e) => updateField('dateOfBirth', e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            style={{
                                ...inputStyle,
                                colorScheme: 'dark',
                            }}
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div style={{
                            padding: '14px 18px', borderRadius: '12px',
                            background: colors.errorBg,
                            border: `1px solid ${colors.errorBorder}`,
                            color: colors.error, fontSize: '0.88rem',
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.5,
                        }}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div style={{
                    padding: '20px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `1px solid ${colors.cardBorder}`,
                }}>
                    <button
                        onClick={onBack}
                        disabled={isSubmitting}
                        style={{
                            background: 'none', border: 'none',
                            color: colors.textMuted, fontWeight: 600,
                            fontSize: '0.95rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            opacity: isSubmitting ? 0.5 : 1,
                        }}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="landing-cta-primary"
                        style={{
                            padding: '14px 36px', fontSize: '1rem',
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}
                    >
                        {isSubmitting ? 'Creating Profile...' : (
                            <>Enter the Sanctuary <ArrowRight size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SHARED STYLES
// ============================================

const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#F5F0E8',
    marginBottom: '10px',
    fontFamily: "'Inter', sans-serif",
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '14px',
    border: '2px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#F5F0E8',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box' as const,
};
