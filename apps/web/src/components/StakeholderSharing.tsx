/**
 * Stakeholder Sharing Component
 * 
 * Manage who has access to child's profile data.
 * Doctors, therapists, teachers, social workers, etc.
 */

import { useState } from 'react';
import { useFamily, useActiveChild } from '../contexts/FamilyContext';
import {
    Users, Plus, Mail, Trash2, Shield, ChevronDown,
    Check, X, User
} from 'lucide-react';
import { type ShareAccess, type StakeholderRole, type ShareableSection } from '../data/familyProfile';

export function StakeholderSharing() {
    const { family, updateFamily } = useFamily();
    const { child } = useActiveChild();
    const [showInvite, setShowInvite] = useState(false);

    if (!child || !family) return null;

    const sharedWith = family.sharedWith || [];

    const removeAccess = async (accessId: string) => {
        const updated = sharedWith.filter(s => s.id !== accessId);
        await updateFamily({ sharedWith: updated });
    };

    const addAccess = async (access: ShareAccess) => {
        await updateFamily({ sharedWith: [...sharedWith, access] });
        setShowInvite(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users size={18} className="text-slate-500" />
                    <h3 className="font-bold text-slate-900">Shared With</h3>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                    <Plus size={18} />
                </button>
            </div>

            {sharedWith.length === 0 ? (
                <EmptySharing onAdd={() => setShowInvite(true)} />
            ) : (
                <div className="space-y-2">
                    {sharedWith.map((access) => (
                        <ShareCard
                            key={access.id}
                            access={access}
                            onRemove={() => removeAccess(access.id)}
                        />
                    ))}
                </div>
            )}

            {showInvite && (
                <InviteModal
                    onClose={() => setShowInvite(false)}
                    onInvite={addAccess}
                />
            )}
        </div>
    );
}

function ShareCard({ access, onRemove }: { access: ShareAccess; onRemove: () => void }) {
    const [expanded, setExpanded] = useState(false);

    const roleLabels: Record<StakeholderRole, string> = {
        parent: 'Parent',
        therapist: 'Therapist',
        teacher: 'Teacher',
        doctor: 'Doctor',
        social_worker: 'Social Worker',
        family_member: 'Family',
        emergency_contact: 'Emergency'
    };

    const accessColors: Record<ShareAccess['accessLevel'], string> = {
        full: 'bg-green-100 text-green-700',
        summary: 'bg-blue-100 text-blue-700',
        emergency: 'bg-red-100 text-red-700'
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-3 flex items-center justify-between hover:bg-slate-50"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-slate-500" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-slate-900">{access.name}</p>
                        <p className="text-xs text-slate-500">{roleLabels[access.role]}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${accessColors[access.accessLevel]}`}>
                        {access.accessLevel}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {expanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Mail size={14} />
                        <span>{access.email}</span>
                    </div>

                    <div className="text-xs text-slate-500 mb-3">
                        <span className="font-medium">Sections:</span>{' '}
                        {access.sections.join(', ')}
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                            {access.acceptedAt ? (
                                <span className="text-green-600 flex items-center gap-1">
                                    <Check size={12} /> Accepted
                                </span>
                            ) : (
                                <span className="text-amber-600">Pending</span>
                            )}
                        </span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function EmptySharing({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <Shield size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm mb-1">No one has access yet</p>
            <p className="text-xs text-slate-400 mb-3">Invite your child's team to collaborate</p>
            <button
                onClick={onAdd}
                className="px-3 py-1.5 bg-teal-500 text-white text-sm font-bold rounded-lg"
            >
                Invite Someone
            </button>
        </div>
    );
}

function InviteModal({ onClose, onInvite }: {
    onClose: () => void;
    onInvite: (access: ShareAccess) => void;
}) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<StakeholderRole>('therapist');
    const [accessLevel, setAccessLevel] = useState<ShareAccess['accessLevel']>('summary');
    const [sections, setSections] = useState<ShareableSection[]>(['basic_info', 'communication', 'supports']);

    const roles: Array<{ value: StakeholderRole; label: string }> = [
        { value: 'therapist', label: 'Therapist' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'doctor', label: 'Doctor' },
        { value: 'social_worker', label: 'Social Worker' },
        { value: 'family_member', label: 'Family Member' },
        { value: 'emergency_contact', label: 'Emergency Contact' }
    ];

    const allSections: Array<{ value: ShareableSection; label: string }> = [
        { value: 'basic_info', label: 'Basic Info' },
        { value: 'diagnoses', label: 'Diagnoses' },
        { value: 'school', label: 'School' },
        { value: 'medical', label: 'Medical' },
        { value: 'communication', label: 'Communication' },
        { value: 'supports', label: 'Supports' },
        { value: 'narrative', label: 'Narrative' },
        { value: 'timeline', label: 'Timeline' },
        { value: 'abc_logs', label: 'ABC Logs' },
        { value: 'strategies', label: 'Strategies' }
    ];

    const toggleSection = (section: ShareableSection) => {
        setSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handleSubmit = () => {
        if (!email || !name) return;

        onInvite({
            id: Date.now().toString(),
            email,
            name,
            role,
            accessLevel,
            canEdit: false,
            invitedAt: new Date() as any,
            sections
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Invite Team Member</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dr. Sarah Chen"
                            className="w-full mt-1 p-3 border border-slate-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sarah@clinic.com"
                            className="w-full mt-1 p-3 border border-slate-200 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {roles.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setRole(value)}
                                    className={`p-2 text-sm rounded-lg border ${role === value
                                            ? 'border-teal-500 bg-teal-50'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Access Level</label>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {(['summary', 'full', 'emergency'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setAccessLevel(level)}
                                    className={`p-2 text-sm rounded-lg border capitalize ${accessLevel === level
                                            ? 'border-teal-500 bg-teal-50'
                                            : 'border-slate-200'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">Sections to Share</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {allSections.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => toggleSection(value)}
                                    className={`px-2 py-1 text-xs rounded border ${sections.includes(value)
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-slate-200 text-slate-500'
                                        }`}
                                >
                                    {sections.includes(value) && <Check size={10} className="inline mr-1" />}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 p-3 border border-slate-200 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!email || !name}
                        className="flex-1 p-3 bg-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
                    >
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
}
