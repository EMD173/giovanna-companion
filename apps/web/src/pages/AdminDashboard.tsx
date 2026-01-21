/**
 * Admin Dashboard Page
 * 
 * Tier management and user administration for subscription system.
 * Requires admin role (future: check admin claim from Firebase Auth).
 */

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
    Users, Crown, TrendingUp, Settings, RefreshCw,
    ChevronDown, Search
} from 'lucide-react';
import { TIER_INFO, type SubscriptionTier } from '../data/subscriptionTiers';

interface UserRecord {
    id: string;
    email: string;
    displayName?: string;
    tier: SubscriptionTier;
    usage: {
        aiQueries: number;
        sharePackets: number;
    };
    createdAt: Date;
}

export function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [tierStats, setTierStats] = useState<Record<SubscriptionTier, number>>({
        free: 0, companion: 0, pro: 0, enterprise: 0
    });

    // For now, simple admin check - in production, use Firebase Admin claims
    const isAdmin = user?.email?.endsWith('@giovanna.app') || user?.email === 'admin@example.com';

    useEffect(() => {
        if (!isAdmin) return;
        loadUsers();
    }, [isAdmin]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'subscriptions');
            const q = query(usersRef, orderBy('createdAt', 'desc'), limit(100));
            const snapshot = await getDocs(q);

            const userData: UserRecord[] = [];
            const stats: Record<SubscriptionTier, number> = { free: 0, companion: 0, pro: 0, enterprise: 0 };

            snapshot.forEach(doc => {
                const data = doc.data();
                const tier = (data.tier || 'free') as SubscriptionTier;
                stats[tier]++;
                userData.push({
                    id: doc.id,
                    email: data.email || 'Unknown',
                    displayName: data.displayName,
                    tier,
                    usage: data.usage || { aiQueries: 0, sharePackets: 0 },
                    createdAt: data.createdAt?.toDate() || new Date()
                });
            });

            setUsers(userData);
            setTierStats(stats);
        } catch (error) {
            console.error('Error loading users:', error);
        }
        setLoading(false);
    };

    const updateUserTier = async (userId: string, newTier: SubscriptionTier) => {
        try {
            await updateDoc(doc(db, 'subscriptions', userId), { tier: newTier });
            setUsers(prev => prev.map(u =>
                u.id === userId ? { ...u, tier: newTier } : u
            ));
        } catch (error) {
            console.error('Error updating tier:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <Settings size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Admin Access Required</h2>
                <p className="text-slate-500">You need admin permissions to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Manage users and subscriptions</p>
                </div>
                <button
                    onClick={loadUsers}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    disabled={loading}
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(TIER_INFO) as SubscriptionTier[]).map(tier => (
                    <div key={tier} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown size={16} className="text-amber-500" />
                            <span className="text-sm font-medium text-slate-600">{TIER_INFO[tier].name}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">{tierStats[tier]}</p>
                    </div>
                ))}
            </div>

            {/* Revenue Estimate */}
            <div className="bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-teal-600" />
                    <span className="font-bold text-slate-900">Estimated MRR</span>
                </div>
                <p className="text-3xl font-bold text-teal-700">
                    ${((tierStats.companion * 7.99) + (tierStats.pro * 14.99) + (tierStats.enterprise * 99)).toFixed(2)}
                </p>
            </div>

            {/* User Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 p-4 border-b border-slate-100">
                    <Users size={18} className="text-slate-500" />
                    <span className="font-bold text-slate-900">Users ({users.length})</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No users found</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredUsers.slice(0, 20).map(user => (
                            <div key={user.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {user.displayName || user.email}
                                    </p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right text-xs text-slate-400">
                                        <p>{user.usage.aiQueries} AI queries</p>
                                        <p>{user.usage.sharePackets} packets</p>
                                    </div>
                                    <TierDropdown
                                        currentTier={user.tier}
                                        onChange={(tier) => updateUserTier(user.id, tier)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TierDropdown({ currentTier, onChange }: {
    currentTier: SubscriptionTier;
    onChange: (tier: SubscriptionTier) => void;
}) {
    const [open, setOpen] = useState(false);

    const tiers: SubscriptionTier[] = ['free', 'companion', 'pro', 'enterprise'];
    const colors: Record<SubscriptionTier, string> = {
        free: 'bg-slate-100 text-slate-700',
        companion: 'bg-teal-100 text-teal-700',
        pro: 'bg-amber-100 text-amber-700',
        enterprise: 'bg-purple-100 text-purple-700'
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${colors[currentTier]}`}
            >
                {TIER_INFO[currentTier].name}
                <ChevronDown size={14} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                    {tiers.map(tier => (
                        <button
                            key={tier}
                            onClick={() => { onChange(tier); setOpen(false); }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${tier === currentTier ? 'font-bold' : ''
                                }`}
                        >
                            {TIER_INFO[tier].name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
