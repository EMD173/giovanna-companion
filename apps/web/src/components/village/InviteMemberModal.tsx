/**
 * Invite Member Modal — Sanctuary Theme
 */

import React, { useState } from 'react';
import { X, Mail, Heart, Shield, Users, Lock, UserCheck, Siren } from 'lucide-react';
import { ROLE_PERMISSIONS, type FamilyRole } from '../../types/family';
import { sanctuary, typography } from '../../shared/theme';

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string, role: FamilyRole, name: string) => Promise<void>;
}

export function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<FamilyRole>('village');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onInvite(email, role, name);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const INVITE_OPTIONS: FamilyRole[] = ['co-captain', 'legal-guardian', 'village'];

    const getIcon = (role: FamilyRole) => {
        switch (role) {
            case 'co-captain': return Heart;
            case 'legal-guardian': return Shield;
            case 'village': return Users;
            case 'responder': return Siren;
            default: return UserCheck;
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: `1.5px solid ${sanctuary.border}`, background: sanctuary.bg,
        color: sanctuary.text, fontSize: '0.92rem', fontFamily: typography.body,
        outline: 'none', boxSizing: 'border-box',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
        }}>
            <div style={{
                background: sanctuary.bgCard,
                borderRadius: '24px',
                width: '100%',
                maxWidth: '440px',
                boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 24px',
                    borderBottom: `1px solid ${sanctuary.border}`,
                }}>
                    <div>
                        <h2 style={{
                            fontFamily: typography.heading, fontSize: '1.2rem',
                            fontWeight: 700, color: sanctuary.text,
                            display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <Users size={20} color={sanctuary.purple} /> Invite to Village
                        </h2>
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.85rem',
                            fontFamily: typography.body,
                        }}>Expand your circle of care.</p>
                    </div>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: sanctuary.bgAlt, border: 'none',
                        cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: sanctuary.textMuted,
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Roles */}
                    <div>
                        <label style={{
                            display: 'block', fontSize: '0.82rem', fontWeight: 700,
                            color: sanctuary.textSecondary, marginBottom: '10px',
                            fontFamily: typography.body,
                        }}>Select their role:</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {INVITE_OPTIONS.map(r => {
                                const Icon = getIcon(r);
                                const perm = ROLE_PERMISSIONS[r];
                                const isSelected = role === r;
                                return (
                                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                                        padding: '14px',
                                        borderRadius: '14px',
                                        background: isSelected ? sanctuary.purpleBg : sanctuary.bgCard,
                                        border: `1.5px solid ${isSelected ? sanctuary.purpleBorder : sanctuary.border}`,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        transition: 'all 0.15s ease',
                                    }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            background: isSelected ? sanctuary.purpleBg : sanctuary.bgAlt,
                                            border: `1px solid ${isSelected ? sanctuary.purpleBorder : sanctuary.border}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: isSelected ? sanctuary.purple : sanctuary.textMuted,
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div style={{
                                                fontWeight: 700, fontSize: '0.92rem',
                                                color: isSelected ? sanctuary.purple : sanctuary.text,
                                                fontFamily: typography.body,
                                            }}>{perm.label}</div>
                                            <div style={{
                                                fontSize: '0.78rem', color: sanctuary.textMuted,
                                                marginTop: '2px', fontFamily: typography.body,
                                            }}>{perm.description}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.82rem', fontWeight: 700,
                                color: sanctuary.textSecondary, marginBottom: '6px',
                                fontFamily: typography.body,
                            }}>Their Name</label>
                            <input required type="text" placeholder="e.g. Auntie Sarah"
                                value={name} onChange={e => setName(e.target.value)}
                                style={inputStyle} />
                        </div>
                        <div>
                            <label style={{
                                display: 'block', fontSize: '0.82rem', fontWeight: 700,
                                color: sanctuary.textSecondary, marginBottom: '6px',
                                fontFamily: typography.body,
                            }}>Email Address</label>
                            <input required type="email" placeholder="sarah@example.com"
                                value={email} onChange={e => setEmail(e.target.value)}
                                style={inputStyle} />
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div style={{
                        background: sanctuary.bgAlt, padding: '12px',
                        borderRadius: '10px', display: 'flex', gap: '8px',
                        border: `1px solid ${sanctuary.border}`,
                    }}>
                        <Lock size={12} style={{ color: sanctuary.textMuted, flexShrink: 0, marginTop: '2px' }} />
                        <p style={{
                            color: sanctuary.textMuted, fontSize: '0.78rem',
                            fontFamily: typography.body, lineHeight: 1.5,
                        }}>
                            They will need to sign the <strong>Dignity Pledge</strong> before accessing any family data.
                        </p>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isSubmitting} style={{
                        width: '100%', padding: '14px',
                        borderRadius: '12px',
                        background: '#1A1A1A',
                        color: sanctuary.gold,
                        border: 'none',
                        fontWeight: 700, fontSize: '0.92rem',
                        cursor: isSubmitting ? 'default' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', fontFamily: typography.body,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}>
                        <Mail size={16} />
                        {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
}
