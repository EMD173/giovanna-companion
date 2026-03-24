import { useState } from 'react';
import {
    Heart, Shield, Users, Sparkles,
    Check, Lock, Hand, ArrowRight, ArrowLeft, Battery
} from 'lucide-react';
import {
    DEFAULT_INTAKE_PROFILE,
    KINSHIP_OPTIONS, VALUES_OPTIONS,
    BIAS_EXPERIENCES, STRENGTH_OPTIONS
} from '../../types/intake';
import type { IntakeProfile } from '../../types/intake';

interface IntakeWizardProps {
    onComplete: (profile: IntakeProfile) => Promise<void>;
    isSubmitting: boolean;
}

/* ===== Shared Style Constants ===== */
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
};

export function IntakeWizard({ onComplete, isSubmitting }: IntakeWizardProps) {
    const [step, setStep] = useState(0);
    const [profile, setProfile] = useState<IntakeProfile>(DEFAULT_INTAKE_PROFILE);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(0, prev - 1));

    const toggleArrayItem = (field: keyof IntakeProfile, value: string) => {
        setProfile(prev => {
            const currentArray = prev[field] as string[];
            if (currentArray.includes(value)) {
                return { ...prev, [field]: currentArray.filter(i => i !== value) };
            } else {
                return { ...prev, [field]: [...currentArray, value] };
            }
        });
    };

    const updateField = (field: keyof IntakeProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const isLastStep = step === 5;
    const handleSubmit = () => onComplete(profile);
    const progress = (step / 5) * 100;

    const stepTitles = ['Pledge', 'Capacity', 'Village', 'Spirit', 'Real Talk', 'Strengths'];

    const renderStep = () => {
        switch (step) {
            case 0: return <DignityPledge onNext={nextStep} />;
            case 1: return <CapacityCheckStep profile={profile} onUpdate={updateField} />;
            case 2: return <TheVillageStep profile={profile} onToggle={(val) => toggleArrayItem('kinshipNetwork', val)} />;
            case 3: return <HeartAndSpiritStep profile={profile} onToggle={(val) => toggleArrayItem('values', val)} onUpdate={updateField} />;
            case 4: return <RealTalkStep profile={profile} onToggle={(val) => toggleArrayItem('experienceWithBias', val)} onUpdate={updateField} />;
            case 5: return <StrengthsStep profile={profile} onToggle={(val) => toggleArrayItem('strengths', val)} />;
            default: return <DignityPledge onNext={nextStep} />;
        }
    };

    return (
        <div style={{ maxWidth: '640px', width: '100%' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: '24px', padding: '0 4px' }}>
                {/* Step Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    {stepTitles.map((title, i) => (
                        <span key={title} style={{
                            fontSize: '0.7rem',
                            fontWeight: i === step ? 700 : 500,
                            color: i <= step ? colors.gold : colors.textDim,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition: 'color 0.3s ease',
                        }}>{title}</span>
                    ))}
                </div>
                {/* Bar */}
                <div style={{
                    height: '3px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '100px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${colors.purple}, ${colors.gold})`,
                        transition: 'width 0.5s ease-out',
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
                {renderStep()}

                {/* Navigation (Skip for Step 0 — it has its own button) */}
                {step > 0 && (
                    <div style={{
                        padding: '20px 32px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: `1px solid ${colors.cardBorder}`,
                    }}>
                        <button
                            onClick={prevStep}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: colors.textMuted,
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <ArrowLeft size={18} /> Back
                        </button>

                        <button
                            onClick={isLastStep ? handleSubmit : nextStep}
                            disabled={isSubmitting}
                            className="landing-cta-primary"
                            style={{ padding: '12px 32px', fontSize: '0.95rem' }}
                        >
                            {isLastStep ? (
                                isSubmitting ? 'Creating Profile...' : 'Complete Profile'
                            ) : (
                                <>Next <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Step Components ---

function DignityPledge({ onNext }: { onNext: () => void }) {
    return (
        <div>
            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${colors.purpleDark} 0%, #0D0D0D 100%)`,
                padding: '48px 32px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Gold accent bar */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${colors.gold}, ${colors.purple}, ${colors.gold}, transparent)`,
                }} />
                {/* Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '400px',
                    height: '150px',
                    background: `radial-gradient(ellipse, rgba(212,175,55,0.1) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                }} />
                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: colors.gold,
                    marginBottom: '12px',
                    position: 'relative',
                }}>The Dignity Pledge</h1>
                <p style={{
                    color: colors.textMuted,
                    fontSize: '1rem',
                    maxWidth: '420px',
                    margin: '0 auto',
                    lineHeight: 1.6,
                    position: 'relative',
                }}>
                    Before we begin, let's align on our purpose.<br />This space is protected.
                </p>
            </div>

            {/* Pledge Items */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <PledgeItem
                    icon={<Heart size={22} />}
                    iconColor="#B85450"
                    iconBg="rgba(184,84,80,0.15)"
                    title="Understanding, Not Compliance"
                    text="We seek to understand the 'why' behind behaviors, not to enforce compliance or extinguish harmless traits."
                />
                <PledgeItem
                    icon={<Lock size={22} />}
                    iconColor="#6B4C9A"
                    iconBg="rgba(107,76,154,0.15)"
                    title="Privacy & Ownership"
                    text="This is YOUR family's data. We are anti-surveillance. You own your story."
                />
                <PledgeItem
                    icon={<Hand size={22} />}
                    iconColor="#D4AF37"
                    iconBg="rgba(212,175,55,0.15)"
                    title="Cultural Safety"
                    text="We honor your village, your values, and your reality. You don't have to code-switch here."
                />

                <button
                    onClick={onNext}
                    className="landing-cta-primary"
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '16px',
                        fontSize: '1.05rem',
                        justifyContent: 'center',
                    }}
                >
                    I Agree & Commit
                </button>
            </div>
        </div>
    );
}

function PledgeItem({ icon, iconColor, iconBg, title, text }: {
    icon: React.ReactNode; iconColor: string; iconBg: string; title: string; text: string;
}) {
    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iconColor,
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: colors.text,
                    marginBottom: '4px',
                }}>{title}</h3>
                <p style={{
                    color: colors.textMuted,
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                }}>{text}</p>
            </div>
        </div>
    );
}

/* ===== Capacity Check ===== */
function CapacityCheckStep({ profile, onUpdate }: { profile: IntakeProfile; onUpdate: (field: keyof IntakeProfile, value: any) => void }) {
    return (
        <div style={{ padding: '32px' }}>
            <StepHeader icon={<Battery size={24} />} iconColor={colors.gold} title="Capacity Check" />
            <p style={{ color: colors.textMuted, marginBottom: '24px', lineHeight: 1.7 }}>
                How are you feeling today? Your honest answer helps us meet you where you are — no judgment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {([
                    { value: 'growth', label: '🌱 Growth Mode — I have capacity to explore and learn' },
                    { value: 'survival', label: '🕯️ Survival Mode — Keep things gentle and essential' },
                ] as const).map(option => (
                    <OptionButton
                        key={option.value}
                        label={option.label}
                        selected={profile.caregiverCapacity === option.value}
                        onClick={() => onUpdate('caregiverCapacity', option.value)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ===== The Village ===== */
function TheVillageStep({ profile, onToggle }: { profile: IntakeProfile; onToggle: (val: string) => void }) {
    return (
        <div style={{ padding: '32px' }}>
            <StepHeader icon={<Users size={24} />} iconColor={colors.gold} title="The Village" />
            <p style={{ color: colors.textMuted, marginBottom: '24px', lineHeight: 1.7 }}>
                Who stands with you? Caregiving is often communal. Identify your circle of strength.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {KINSHIP_OPTIONS.map(kin => (
                    <SelectionCard key={kin} label={kin} selected={profile.kinshipNetwork.includes(kin)} onClick={() => onToggle(kin)} />
                ))}
            </div>
        </div>
    );
}

/* ===== Heart & Spirit ===== */
function HeartAndSpiritStep({ profile, onToggle, onUpdate }: { profile: IntakeProfile; onToggle: (val: string) => void; onUpdate: any }) {
    return (
        <div style={{ padding: '32px' }}>
            <StepHeader icon={<Sparkles size={24} />} iconColor="#6B4C9A" title="Heart & Spirit" />
            <p style={{ color: colors.textMuted, marginBottom: '24px', lineHeight: 1.7 }}>
                What guides your family? Understanding your values helps us provide support that feels like home.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                        How important is Faith or Spirituality in your coping?
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['high', 'medium', 'low', 'none'].map(level => (
                            <OptionPill
                                key={level}
                                label={level}
                                selected={profile.faithImportance === level}
                                onClick={() => onUpdate('faithImportance', level)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                        Family Values (Select all that apply)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {VALUES_OPTIONS.map(val => (
                            <SelectionCard key={val} label={val} selected={profile.values.includes(val)} onClick={() => onToggle(val)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Real Talk ===== */
function RealTalkStep({ profile, onToggle, onUpdate }: { profile: IntakeProfile; onToggle: (val: string) => void; onUpdate: any }) {
    return (
        <div style={{ padding: '32px' }}>
            <StepHeader icon={<Shield size={24} />} iconColor={colors.rose} title="Real Talk" />
            <p style={{ color: colors.textMuted, marginBottom: '24px', lineHeight: 1.7 }}>
                We know the world isn't always safe for our children. Sharing helps us tailor our safety and advocacy tools.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                    background: 'rgba(184,84,80,0.08)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(184,84,80,0.15)',
                }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                        Anxiety about Police/Security Encounters
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {['high', 'medium', 'low'].map(level => (
                            <OptionPill
                                key={level}
                                label={level}
                                selected={profile.policeAnxietyLevel === level}
                                onClick={() => onUpdate('policeAnxietyLevel', level)}
                                accentColor={colors.rose}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: colors.text, marginBottom: '12px' }}>
                        Have you experienced any of the following?
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {BIAS_EXPERIENCES.map(exp => (
                            <SelectionCard key={exp} label={exp} selected={profile.experienceWithBias.includes(exp)} onClick={() => onToggle(exp)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ===== Strengths ===== */
function StrengthsStep({ profile, onToggle }: { profile: IntakeProfile; onToggle: (val: string) => void }) {
    return (
        <div style={{ padding: '32px' }}>
            <StepHeader icon={<Sparkles size={24} />} iconColor={colors.gold} title="Our Strengths" />
            <p style={{ color: colors.textMuted, marginBottom: '24px', lineHeight: 1.7 }}>
                Finally, let's celebrate joy. What lights up your child? We build on strengths, not deficits.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {STRENGTH_OPTIONS.map(strength => (
                    <SelectionCard key={strength} label={strength} selected={profile.strengths.includes(strength)} onClick={() => onToggle(strength)} />
                ))}
            </div>
        </div>
    );
}

/* ===== Shared UI Components ===== */

function StepHeader({ icon, iconColor, title }: { icon: React.ReactNode; iconColor: string; title: string }) {
    return (
        <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: colors.text,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        }}>
            <span style={{ color: iconColor }}>{icon}</span>
            {title}
        </h2>
    );
}

function SelectionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '14px 16px',
                borderRadius: '14px',
                border: `2px solid ${selected ? colors.gold : 'rgba(255,255,255,0.08)'}`,
                background: selected ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                color: selected ? colors.gold : colors.textMuted,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                position: 'relative',
            }}
        >
            {label}
            {selected && (
                <span style={{ position: 'absolute', top: '8px', right: '10px', color: colors.gold }}>
                    <Check size={14} />
                </span>
            )}
        </button>
    );
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '16px 20px',
                borderRadius: '14px',
                border: `2px solid ${selected ? colors.gold : 'rgba(255,255,255,0.08)'}`,
                background: selected ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                color: selected ? colors.text : colors.textMuted,
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 500,
                transition: 'all 0.2s ease',
            }}
        >
            {label}
        </button>
    );
}

function OptionPill({ label, selected, onClick, accentColor }: {
    label: string; selected: boolean; onClick: () => void; accentColor?: string;
}) {
    const accent = accentColor || colors.purple;
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1.5px solid ${selected ? accent : 'rgba(255,255,255,0.1)'}`,
                background: selected ? `${accent}33` : 'rgba(255,255,255,0.03)',
                color: selected ? colors.text : colors.textMuted,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
            }}
        >
            {label}
        </button>
    );
}
