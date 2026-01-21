/**
 * Admin Settings Page
 * 
 * Shows API status, feature flags, and tier statistics.
 * NEVER exposes API keys - only shows status and aliases.
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { checkApiStatus } from '../services/aiService';
import {
    Settings, Shield, Key, ToggleLeft, ToggleRight,
    CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react';

// Hard-coded admin UIDs (also checked server-side)
const ADMIN_UIDS = ['REPLACE_WITH_YOUR_UID'];

interface ApiStatus {
    provider: string;
    keyConfigured: boolean;
    testResult: 'working' | 'error' | 'unknown';
    lastChecked: string;
}

interface AppConfig {
    paidEnabled: boolean;
    maintenanceMode: boolean;
    keyAlias: string;
    lastRotated: string;
}

export function AdminSettings() {
    const { user } = useAuth();
    const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [testing, setTesting] = useState(false);

    const isAdmin = user && ADMIN_UIDS.includes(user.uid);

    useEffect(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        loadConfig();
    }, [isAdmin]);

    const loadConfig = async () => {
        try {
            const configDoc = await getDoc(doc(db, 'config', 'admin'));
            if (configDoc.exists()) {
                setConfig(configDoc.data() as AppConfig);
            } else {
                // Default config
                setConfig({
                    paidEnabled: false,
                    maintenanceMode: false,
                    keyAlias: 'Production Key v1',
                    lastRotated: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Failed to load config:', error);
        }
        setLoading(false);
    };

    const testApi = async () => {
        setTesting(true);
        try {
            const status = await checkApiStatus();
            setApiStatus(status as ApiStatus);
        } catch (error) {
            console.error('API test failed:', error);
            setApiStatus({
                provider: 'unknown',
                keyConfigured: false,
                testResult: 'error',
                lastChecked: new Date().toISOString()
            });
        }
        setTesting(false);
    };

    const togglePaidEnabled = async () => {
        if (!config) return;
        const newConfig = { ...config, paidEnabled: !config.paidEnabled };
        await setDoc(doc(db, 'config', 'admin'), newConfig, { merge: true });
        setConfig(newConfig);
    };

    const toggleMaintenance = async () => {
        if (!config) return;
        const newConfig = { ...config, maintenanceMode: !config.maintenanceMode };
        await setDoc(doc(db, 'config', 'admin'), newConfig, { merge: true });
        setConfig(newConfig);
    };

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <Shield size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Admin Access Required</h2>
                <p className="text-slate-500">This page is for administrators only.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings size={24} />
                    Admin Settings
                </h1>
                <p className="text-slate-500">API configuration and feature flags</p>
            </div>

            {/* API Status */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <Key size={18} />
                        API Configuration
                    </h2>
                    <button
                        onClick={testApi}
                        disabled={testing}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-200 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={testing ? 'animate-spin' : ''} />
                        Test Connection
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Provider</p>
                        <p className="font-bold text-slate-900">
                            {apiStatus?.provider || 'Gemini'}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Key Alias</p>
                        <p className="font-bold text-slate-900">
                            {config?.keyAlias || 'Not set'}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            {apiStatus?.testResult === 'working' ? (
                                <>
                                    <CheckCircle size={16} className="text-green-600" />
                                    <span className="text-green-600 font-medium">Working</span>
                                </>
                            ) : apiStatus?.testResult === 'error' ? (
                                <>
                                    <XCircle size={16} className="text-red-600" />
                                    <span className="text-red-600 font-medium">Error</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={16} className="text-amber-600" />
                                    <span className="text-amber-600 font-medium">Not tested</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Last Rotated</p>
                        <p className="font-medium text-slate-700">
                            {config?.lastRotated
                                ? new Date(config.lastRotated).toLocaleDateString()
                                : 'Unknown'}
                        </p>
                    </div>
                </div>

                <p className="text-xs text-slate-400 mt-4">
                    API keys are stored securely in Firebase Secrets.
                    To rotate: <code>firebase functions:secrets:set GEMINI_API_KEY</code>
                </p>
            </div>

            {/* Feature Flags */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="font-bold text-slate-900 mb-4">Feature Flags</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Paid Tiers Enabled</p>
                            <p className="text-xs text-slate-500">
                                Enable upgrade prompts and payment flows
                            </p>
                        </div>
                        <button
                            onClick={togglePaidEnabled}
                            className="text-2xl"
                        >
                            {config?.paidEnabled ? (
                                <ToggleRight className="text-teal-500" size={32} />
                            ) : (
                                <ToggleLeft className="text-slate-400" size={32} />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Maintenance Mode</p>
                            <p className="text-xs text-slate-500">
                                Show maintenance message to users
                            </p>
                        </div>
                        <button
                            onClick={toggleMaintenance}
                            className="text-2xl"
                        >
                            {config?.maintenanceMode ? (
                                <ToggleRight className="text-amber-500" size={32} />
                            ) : (
                                <ToggleLeft className="text-slate-400" size={32} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Documentation */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
                <h2 className="font-bold text-slate-900 mb-2">Quick Reference</h2>
                <div className="text-sm text-slate-600 space-y-2">
                    <p>
                        <strong>Rotate API Key:</strong> <code className="bg-slate-200 px-1 rounded">firebase functions:secrets:set GEMINI_API_KEY</code>
                    </p>
                    <p>
                        <strong>Deploy Functions:</strong> <code className="bg-slate-200 px-1 rounded">firebase deploy --only functions</code>
                    </p>
                    <p>
                        <strong>View Logs:</strong> <code className="bg-slate-200 px-1 rounded">firebase functions:log</code>
                    </p>
                </div>
            </div>
        </div>
    );
}
