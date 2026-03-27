import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProviderProfile } from '../../hooks/useRespiteProviders';
import type { Specialty, AgeRange, ServiceType, Credential, DayOfWeek } from '../../data/respiteMarketplace';
import {
    US_STATES, SPECIALTY_LABELS, CREDENTIAL_LABELS,
    AGE_RANGE_LABELS, SERVICE_TYPE_LABELS, DAY_LABELS,
    createBlankProvider
} from '../../data/respiteMarketplace';
import { sanctuary, typography } from '../../shared/theme';
import {
    backBtnStyle, stepTitleStyle, inputStyle,
    FormField, ToggleChip
} from './SharedHomeplaceStyles';

export function ProviderRegistrationForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile, createProfile, loading } = useProviderProfile();

    const [formData, setFormData] = useState(() =>
        createBlankProvider(user?.uid || '', user?.displayName || '', user?.email || '')
    );
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already has a profile
    useEffect(() => {
        if (profile) {
            navigate(`/respite/${profile.id}`);
        }
    }, [profile, navigate]);

    if (!user) {
        return (
            <div style={{ background: sanctuary.bg, minHeight: '100vh', padding: '80px 24px', textAlign: 'center' }}>
                <p style={{ color: sanctuary.textSecondary, fontFamily: typography.body, fontSize: '1.05rem' }}>
                    Please sign in to register as a respite care provider.
                </p>
            </div>
        );
    }

    const updateForm = (updates: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const updateAddress = (updates: Partial<typeof formData.address>) => {
        setFormData(prev => ({ ...prev, address: { ...prev.address, ...updates } }));
    };

    const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] => {
        return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
    };

    const handleSubmit = async () => {
        setError(null);
        // Basic validation
        if (!formData.displayName.trim()) { setError('Display name is required.'); return; }
        if (!formData.bio.trim()) { setError('Please write a short bio.'); return; }
        if (!formData.address.city.trim() || !formData.address.state) { setError('City and state are required.'); return; }
        if (formData.specialties.length === 0) { setError('Select at least one specialty.'); return; }

        try {
            await createProfile({ ...formData, isActive: true });
            navigate('/respite');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create profile.';
            setError(message);
        }
    };

    const totalSteps = 4;

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '140px' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Back Button */}
                <button onClick={() => navigate('/respite')} className="sanctuary-enter" style={backBtnStyle}>
                    <ChevronLeft size={16} /> Back to Marketplace
                </button>

                <header className="sanctuary-enter sanctuary-enter-1" style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontFamily: typography.heading, fontSize: '2rem', fontWeight: 700,
                        color: sanctuary.text, marginBottom: '8px',
                    }}>
                        List Your Services
                    </h1>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.95rem', color: sanctuary.textMuted, lineHeight: 1.6,
                    }}>
                        Join a community of providers supporting neurodivergent families.
                    </p>

                    {/* Progress Bar */}
                    <div style={{
                        display: 'flex', gap: '8px', marginTop: '24px',
                    }}>
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} style={{
                                flex: 1, height: '4px', borderRadius: '2px',
                                background: s <= step ? sanctuary.purple : sanctuary.border,
                                transition: 'background 0.3s ease',
                            }} />
                        ))}
                    </div>
                    <p style={{
                        fontFamily: typography.body, fontSize: '0.78rem', color: sanctuary.textMuted,
                        marginTop: '8px',
                    }}>
                        Step {step} of {totalSteps}
                    </p>
                </header>

                {error && (
                    <div style={{
                        padding: '14px 20px', borderRadius: '14px',
                        background: sanctuary.roseBg, border: `1px solid ${sanctuary.roseBorder}`,
                        color: sanctuary.rose, fontSize: '0.88rem', fontFamily: typography.body,
                        marginBottom: '20px',
                    }}>
                        {error}
                    </div>
                )}

                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    background: sanctuary.bgCard, borderRadius: '24px',
                    border: `1px solid ${sanctuary.border}`, padding: '32px',
                    boxShadow: sanctuary.shadow,
                }}>
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <>
                            <h2 style={stepTitleStyle}>About You</h2>
                            <FormField label="Display Name" required>
                                <input type="text" value={formData.displayName}
                                    onChange={e => updateForm({ displayName: e.target.value })}
                                    placeholder="How families will see your name"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Bio" required>
                                <textarea value={formData.bio}
                                    onChange={e => updateForm({ bio: e.target.value })}
                                    placeholder="Tell families about your experience, approach, and what makes your care special..."
                                    rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
                            </FormField>
                            <FormField label="Phone (optional)">
                                <input type="tel" value={formData.phone || ''}
                                    onChange={e => updateForm({ phone: e.target.value })}
                                    placeholder="(555) 555-5555"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Email">
                                <input type="email" value={formData.email || ''}
                                    onChange={e => updateForm({ email: e.target.value })}
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Website (optional)">
                                <input type="url" value={formData.website || ''}
                                    onChange={e => updateForm({ website: e.target.value })}
                                    placeholder="https://..."
                                    style={inputStyle} />
                            </FormField>
                        </>
                    )}

                    {/* Step 2: Location */}
                    {step === 2 && (
                        <>
                            <h2 style={stepTitleStyle}>Your Location</h2>
                            <FormField label="City" required>
                                <input type="text" value={formData.address.city}
                                    onChange={e => updateAddress({ city: e.target.value })}
                                    placeholder="Birmingham"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="State" required>
                                <select value={formData.address.state}
                                    onChange={e => updateAddress({ state: e.target.value })}
                                    style={inputStyle}>
                                    <option value="">Select state...</option>
                                    {US_STATES.map(s => (
                                        <option key={s.code} value={s.code}>{s.name}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField label="ZIP Code">
                                <input type="text" value={formData.address.zipCode}
                                    onChange={e => updateAddress({ zipCode: e.target.value })}
                                    placeholder="35203"
                                    style={inputStyle} />
                            </FormField>
                            <FormField label="Service Radius (miles)">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input type="range" min={5} max={100} step={5}
                                        value={formData.serviceRadiusMiles}
                                        onChange={e => updateForm({ serviceRadiusMiles: Number(e.target.value) })}
                                        style={{ flex: 1 }} />
                                    <span style={{
                                        fontFamily: typography.body, fontWeight: 700,
                                        color: sanctuary.purple, fontSize: '1rem', minWidth: '60px',
                                    }}>
                                        {formData.serviceRadiusMiles} mi
                                    </span>
                                </div>
                            </FormField>
                            <FormField label="Languages">
                                <input type="text" value={formData.languages.join(', ')}
                                    onChange={e => updateForm({ languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    placeholder="English, Spanish, ASL"
                                    style={inputStyle} />
                            </FormField>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.78rem', color: sanctuary.textMuted,
                                fontStyle: 'italic', marginTop: '8px',
                            }}>
                                Your exact address is never shown. Only your city and state are displayed to families.
                            </p>
                        </>
                    )}

                    {/* Step 3: Specialties & Credentials */}
                    {step === 3 && (
                        <>
                            <h2 style={stepTitleStyle}>Specialties & Credentials</h2>
                            <FormField label="Specialties (select all that apply)" required>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(SPECIALTY_LABELS) as [Specialty, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.specialties.includes(key)}
                                            onClick={() => updateForm({ specialties: toggleArrayItem(formData.specialties, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Credentials">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(CREDENTIAL_LABELS) as [Credential, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.credentials.includes(key)}
                                            onClick={() => updateForm({ credentials: toggleArrayItem(formData.credentials, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Age Ranges Served">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(AGE_RANGE_LABELS) as [AgeRange, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.ageRanges.includes(key)}
                                            onClick={() => updateForm({ ageRanges: toggleArrayItem(formData.ageRanges, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Years of Experience">
                                <input type="number" min={0} max={50}
                                    value={formData.experienceYears}
                                    onChange={e => updateForm({ experienceYears: Number(e.target.value) })}
                                    style={{ ...inputStyle, maxWidth: '120px' }} />
                            </FormField>
                        </>
                    )}

                    {/* Step 4: Services & Availability */}
                    {step === 4 && (
                        <>
                            <h2 style={stepTitleStyle}>Services & Availability</h2>
                            <FormField label="Service Types">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.serviceTypes.includes(key)}
                                            onClick={() => updateForm({ serviceTypes: toggleArrayItem(formData.serviceTypes, key) })} />
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Hourly Rate Range">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>$</span>
                                    <input type="number" min={0} value={formData.hourlyRateMin}
                                        onChange={e => updateForm({ hourlyRateMin: Number(e.target.value) })}
                                        style={{ ...inputStyle, maxWidth: '100px' }} />
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>to $</span>
                                    <input type="number" min={0} value={formData.hourlyRateMax}
                                        onChange={e => updateForm({ hourlyRateMax: Number(e.target.value) })}
                                        style={{ ...inputStyle, maxWidth: '100px' }} />
                                    <span style={{ fontFamily: typography.body, color: sanctuary.textMuted }}>/hr</span>
                                </div>
                            </FormField>
                            <FormField label="Availability">
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {(Object.entries(DAY_LABELS) as [DayOfWeek, string][]).map(([key, label]) => (
                                        <ToggleChip key={key} label={label}
                                            active={formData.availability[key]}
                                            onClick={() => updateForm({
                                                availability: { ...formData.availability, [key]: !formData.availability[key] }
                                            })} />
                                    ))}
                                </div>
                            </FormField>
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', marginTop: '32px',
                        paddingTop: '24px', borderTop: `1px solid ${sanctuary.border}`,
                    }}>
                        {step > 1 ? (
                            <button onClick={() => setStep(step - 1)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '12px 20px', borderRadius: '14px',
                                border: `1px solid ${sanctuary.border}`, background: sanctuary.bgCard,
                                color: sanctuary.textSecondary, fontSize: '0.88rem', fontWeight: 600,
                                fontFamily: typography.body, cursor: 'pointer',
                            }}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        ) : <div />}

                        {step < totalSteps ? (
                            <button onClick={() => setStep(step + 1)} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '12px 24px', borderRadius: '14px', border: 'none',
                                background: sanctuary.purple, color: '#FFFFFF',
                                fontSize: '0.88rem', fontWeight: 700, fontFamily: typography.body,
                                cursor: 'pointer',
                            }}>
                                Next <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={loading} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 28px', borderRadius: '14px', border: 'none',
                                background: loading ? sanctuary.textMuted : sanctuary.sage,
                                color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 700,
                                fontFamily: typography.body, cursor: loading ? 'default' : 'pointer',
                            }}>
                                <CheckCircle size={18} />
                                {loading ? 'Creating...' : 'Publish Profile'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
