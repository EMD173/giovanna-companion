/**
 * Settings Page
 * 
 * User preferences including EC Mode toggle.
 */

import { useAuth } from '../contexts/AuthContext';
import { useECMode } from '../contexts/ECModeContext';
import { Sparkles, Shield, Bell, LogOut, ChevronRight, Loader2 } from 'lucide-react';

export function Settings() {
    const { user, logout } = useAuth();
    const { enabled, loading, toggle } = useECMode();

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Please sign in to access settings.</p>
            </div>
        );
    }

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
                            {user.displayName?.[0] || 'U'}
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
                <SettingRow icon={<Shield size={20} />} label="Privacy & Data" />
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
