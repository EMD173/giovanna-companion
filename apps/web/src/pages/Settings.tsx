/**
 * Settings Page
 * 
 * User preferences including EC Mode toggle, privacy actions (delete/export).
 */

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useECMode } from '../contexts/ECModeContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import {
    Sparkles, Shield, Bell, LogOut, ChevronRight, Loader2,
    Download, Trash2, AlertTriangle
} from 'lucide-react';
import { showToast } from '../components/Toast';
import { CrisisResources } from '../components/CrisisResources';

export function Settings() {
    const { user, logout } = useAuth();
    const { enabled, loading, toggle } = useECMode();

    const [showPrivacy, setShowPrivacy] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const functions = getFunctions(getApp());

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Please sign in to access settings.</p>
            </div>
        );
    }

    const handleExportData = async () => {
        setExporting(true);
        try {
            const exportUserData = httpsCallable(functions, 'exportUserData');
            const result = await exportUserData({});

            // Download as JSON file
            const blob = new Blob([JSON.stringify(result.data, null, 2)], {
                type: 'application/json'
            });
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
            // Auth state will automatically update and redirect
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Failed to delete account. Please contact support.', 'error');
            setDeleting(false);
        }
    };

    return (
        <div className="pb-20 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

            {/* User Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
                    ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-slate-900">{user.displayName || 'User'}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* EC Mode Toggle */}
            <div className="bg-gradient-to-br from-amber-50 to-teal-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-100 to-teal-100 rounded-lg">
                            <Sparkles size={20} className="text-amber-700" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900">Epigenetic Consciousness Mode</h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Adds reflection prompts that consider environment, history, and nervous system
                                alongside ABA guidance. Never replaces—only adds context.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggle}
                        disabled={loading}
                        className={`relative w-14 h-8 rounded-full transition-colors ${enabled ? 'bg-teal-500' : 'bg-slate-300'
                            }`}
                    >
                        {loading ? (
                            <Loader2 className="absolute inset-0 m-auto w-5 h-5 animate-spin text-white" />
                        ) : (
                            <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        )}
                    </button>
                </div>

                {enabled && (
                    <div className="mt-4 p-3 bg-white/60 rounded-lg text-sm text-amber-800">
                        <strong>Active:</strong> You'll see EC Lens Cards in the Learning Hub, ABC Logger,
                        and Share Packets.
                    </div>
                )}
            </div>

            {/* Other Settings */}
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                <button
                    onClick={() => setShowPrivacy(!showPrivacy)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500"><Shield size={20} /></span>
                        <span className="font-medium text-slate-800">Privacy & Data</span>
                    </div>
                    <ChevronRight size={20} className={`text-slate-400 transition-transform ${showPrivacy ? 'rotate-90' : ''}`} />
                </button>

                {showPrivacy && (
                    <div className="p-4 bg-slate-50 space-y-4">
                        <p className="text-sm text-slate-600">
                            Your data is stored securely and never shared without your explicit consent.
                            Diagnoses and behavior logs are considered sensitive health information.
                        </p>

                        {/* Crisis Resources */}
                        <CrisisResources />

                        {/* Export Data */}
                        <button
                            onClick={handleExportData}
                            disabled={exporting}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                        >
                            {exporting ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Download size={18} />
                            )}
                            <span className="font-medium">
                                {exporting ? 'Exporting...' : 'Export All My Data (JSON)'}
                            </span>
                        </button>

                        {/* Delete Account */}
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                            <div className="flex items-start gap-2 text-red-800">
                                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Delete Account</p>
                                    <p className="text-sm">
                                        This permanently deletes your account and ALL data:
                                        families, children, logs, strategies, and share packets.
                                        This cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Type DELETE to confirm"
                                value={deleteConfirm}
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                className="w-full p-2 border border-red-300 rounded text-sm"
                            />

                            <button
                                onClick={handleDeleteAccount}
                                disabled={deleting || deleteConfirm !== 'DELETE'}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                <span className="font-medium">
                                    {deleting ? 'Deleting...' : 'Permanently Delete Account'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                <SettingRow icon={<Bell size={20} />} label="Notifications" />
            </div>

            {/* Sign Out */}
            <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
            >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
            </button>
        </div>
    );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 text-left">
            <div className="flex items-center gap-3">
                <span className="text-slate-500">{icon}</span>
                <span className="font-medium text-slate-800">{label}</span>
            </div>
            <ChevronRight size={20} className="text-slate-400" />
        </button>
    );
}
