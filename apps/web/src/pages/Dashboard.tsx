/**
 * Dashboard — The Journey Hub (Week 6 Simplification)
 *
 * Reduced from 13 Quick Access pills to 4 contextual action cards.
 * Surfaces the most relevant action based on time of day + recent activity.
 * Parent Check-In is the FIRST thing they see — it sets capacity mode.
 *
 * In Survival mode: 2 cards (Sanctuary + Oracle)
 * In Growth mode: 4 cards (Capture + Oracle + Sanctuary + Bridge)
 * Smart suggestions based on recent ABC log patterns
 */

import { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight, Sparkles, Shield, Heart,
    BookOpen, MessageCircle, FileText, Users,
    Bookmark, Home, TrendingUp, Clock, GraduationCap, Presentation, HandHeart,
    Moon, Sun, Sunrise
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import { useABCLogs } from '../hooks/useABCLogs';
import { useI18n } from '../lib/i18n';
import { ParentCheckIn } from '../components/regulation/ParentCheckIn';
import { QuickLogButton } from '../components/dashboard/QuickLogButton';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sanctuary, typography } from '../shared/theme';
import { hasCompletedFamilySetup } from '../lib/launchGuards';

import { getGreeting, getContextualSuggestion } from '../lib/dashboardUtils';
import { ActionCard, QuickPill, DashboardSectionFallback } from '../components/dashboard/DashboardShared';

const OnboardingWalkthrough = lazy(() =>
    import('../components/OnboardingWalkthrough').then((module) => ({
        default: module.OnboardingWalkthrough,
    }))
);

const BehaviorCharts = lazy(() =>
    import('../components/BehaviorCharts').then((module) => ({
        default: module.BehaviorCharts,
    }))
);

// ============================================
// DASHBOARD COMPONENT
// ============================================

export function Dashboard() {
    const { user } = useAuth();
    const { activeChild, family, loading: familyLoading } = useFamily();
    const { logs } = useABCLogs();
    const { t } = useI18n();
    const [capacityMode, setCapacityMode] = useState<'survival' | 'growth'>('growth');
    const navigate = useNavigate();
    const greeting = getGreeting();

    // Onboarding skip guard: if user is logged in and family data has loaded,
    // but no children have been added, redirect to onboarding to complete intake.
    // Without this, family-dependent features (ABC logs, child profiles, share
    // packets) will error because they assume at least one child exists.
    useEffect(() => {
        const isAmbassador = localStorage.getItem('AMBASSADOR_MODE') === 'true';
        if (!isAmbassador && !familyLoading && family && !hasCompletedFamilySetup(family)) {
            navigate('/onboarding', { replace: true });
        }
    }, [familyLoading, family, navigate]);

    const contextSuggestion = useMemo(
        () => getContextualSuggestion(logs, greeting.timeBlock, capacityMode),
        [logs, greeting.timeBlock, capacityMode]
    );

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.intakeProfile?.caregiverCapacity) {
                        setCapacityMode(data.intakeProfile.caregiverCapacity);
                    }
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        }
        fetchProfile();
    }, [user]);

    const toggleMode = async () => {
        const newMode = capacityMode === 'survival' ? 'growth' : 'survival';
        setCapacityMode(newMode);
        if (user) {
            await setDoc(doc(db, 'users', user.uid), {
                intakeProfile: { caregiverCapacity: newMode }
            }, { merge: true });
        }
    };

    const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Honored One';
    const childName = activeChild?.preferredName || activeChild?.firstName;

    // Quick stats — lazy-init a snapshot of "now" to avoid calling
    // Date.now() repeatedly during render (React strict mode flags it as impure).
    // The useState initializer runs once per mount and is permitted.
    const [mountTime] = useState(() => Date.now());
    const recentLogCount = useMemo(() => logs.filter(l => {
        const ts = l.timestamp?.toDate?.() || new Date(0);
        return (mountTime - ts.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length, [logs, mountTime]);

    return (
        <div style={{
            background: sanctuary.bg,
            minHeight: '100vh',
            paddingBottom: '140px',
        }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

                {/* ===== Hero Header ===== */}
                <header className="sanctuary-enter" style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                marginBottom: '8px', color: sanctuary.gold,
                            }}>
                                {greeting.iconName === 'moon' && <Moon size={20} />}
                                {greeting.iconName === 'sun' && <Sun size={20} />}
                                {greeting.iconName === 'sunrise' && <Sunrise size={20} />}
                                <span style={{
                                    fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em',
                                    textTransform: 'uppercase', fontFamily: typography.body,
                                }}>
                                    {t(`dashboard.greeting.${greeting.timeBlock}`)}
                                </span>
                            </div>
                            <h1 style={{
                                fontFamily: typography.heading, fontSize: '2.4rem', fontWeight: 700,
                                color: sanctuary.text, marginBottom: '6px', lineHeight: 1.15,
                                letterSpacing: '-0.02em',
                            }}>
                                {firstName}
                            </h1>
                            <p style={{
                                color: sanctuary.textMuted, fontSize: '1.05rem',
                                fontFamily: typography.body, fontWeight: 400,
                            }}>
                                {capacityMode === 'survival'
                                    ? t('dashboard.survivalMode')
                                    : t('dashboard.growthMode')}
                            </p>
                        </div>

                        {/* Mode Toggle */}
                        <button onClick={toggleMode} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 18px', borderRadius: '100px',
                            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                            border: 'none', letterSpacing: '0.02em',
                            transition: 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
                            background: capacityMode === 'survival' ? sanctuary.roseBg : sanctuary.purpleBg,
                            color: capacityMode === 'survival' ? sanctuary.rose : sanctuary.purple,
                            boxShadow: capacityMode === 'survival'
                                ? '0 2px 8px rgba(184, 84, 80, 0.1)'
                                : '0 2px 8px rgba(107, 76, 154, 0.1)',
                        }}>
                            {capacityMode === 'survival' ? <Shield size={14} /> : <Sparkles size={14} />}
                            {capacityMode === 'survival' ? t('dashboard.mode.survival') : t('dashboard.mode.growth')}
                        </button>
                    </div>
                </header>

                {/* ===== Parent Check-In (FIRST) ===== */}
                <section className="sanctuary-enter sanctuary-enter-1" style={{ marginBottom: '24px' }}>
                    <ParentCheckIn />
                </section>

                {/* Quick Vent (Survival Only) */}
                {capacityMode === 'survival' && (
                    <section className="sanctuary-enter sanctuary-enter-2" style={{ marginBottom: '24px' }}>
                        <QuickLogButton />
                    </section>
                )}

                {/* ===== Context Suggestion Banner ===== */}
                {contextSuggestion && (
                    <Link to={contextSuggestion.link} className="sanctuary-enter sanctuary-enter-2" style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '16px 20px', borderRadius: '16px',
                        background: sanctuary.sageBg, border: `1px solid ${sanctuary.sageBorder}`,
                        textDecoration: 'none', marginBottom: '24px',
                        transition: 'all 0.2s ease',
                    }}>
                        <TrendingUp size={18} color={sanctuary.sage} />
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontFamily: typography.body, fontSize: '0.88rem',
                                color: sanctuary.text, fontWeight: 500, lineHeight: 1.5, margin: 0,
                            }}>
                                {t(contextSuggestion.textKey)}
                            </p>
                        </div>
                        <span style={{
                            fontFamily: typography.body, fontSize: '0.82rem',
                            fontWeight: 700, color: sanctuary.sage, whiteSpace: 'nowrap',
                        }}>
                            {t(contextSuggestion.actionKey)} <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                        </span>
                    </Link>
                )}

                {/* ===== Gold Divider ===== */}
                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    height: '1px',
                    background: `linear-gradient(90deg, transparent 0%, ${sanctuary.gold}30 30%, ${sanctuary.gold}30 70%, transparent 100%)`,
                    margin: '8px 0 28px',
                }} />

                {/* ===== Activity Summary ===== */}
                {capacityMode === 'growth' && recentLogCount > 0 && (
                    <div className="sanctuary-enter sanctuary-enter-2" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: '20px',
                    }}>
                        <Clock size={14} color={sanctuary.textMuted} />
                        <span style={{
                            fontFamily: typography.body, fontSize: '0.82rem',
                            color: sanctuary.textMuted, fontWeight: 500,
                        }}>
                            {recentLogCount} {t('dashboard.activity.captured')}
                            {childName ? ` for ${childName}` : ''}
                        </span>
                    </div>
                )}

                {/* ===== Section Label ===== */}
                <div className="sanctuary-enter sanctuary-enter-2" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '20px',
                }}>
                    <h2 style={{
                        fontFamily: typography.body, fontSize: '0.75rem', fontWeight: 700,
                        color: sanctuary.textMuted, letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                    }}>
                        {capacityMode === 'survival' ? t('dashboard.section.essentials') : t('dashboard.section.toolkit')}
                    </h2>
                </div>

                {/* ===== Main Action Grid — 4 CONTEXTUAL CARDS ===== */}
                <section>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {capacityMode === 'survival' ? (
                            <>
                                <ActionCard i={3} to="/homeplace" icon={<Heart size={22} />}
                                    iconColor={sanctuary.rose} iconBg={sanctuary.roseBg}
                                    title={t('nav.sanctuary')} subtitle={t('nav.sanctuarySurvivalSub')} />
                                <ActionCard i={4} to="/chat" icon={<MessageCircle size={22} />}
                                    iconColor={sanctuary.purple} iconBg={sanctuary.purpleBg}
                                    title={t('nav.insight')} subtitle={t('nav.insightSurvivalSub')} />
                            </>
                        ) : (
                            <>
                                <ActionCard i={3} to="/log" icon={<Bookmark size={22} />}
                                    iconColor={sanctuary.gold} iconBg={sanctuary.goldBg}
                                    title={t('nav.capture')} subtitle={t('nav.captureSub')} accent="gold" />
                                <ActionCard i={4} to="/chat" icon={<MessageCircle size={22} />}
                                    iconColor={sanctuary.purple} iconBg={sanctuary.purpleBg}
                                    title={t('nav.insight')} subtitle={t('nav.insightSub')} accent="purple" />
                                <ActionCard i={5} to="/homeplace" icon={<Home size={22} />}
                                    iconColor={sanctuary.sage} iconBg={sanctuary.sageBg}
                                    title={t('nav.sanctuary')} subtitle={t('nav.sanctuarySub')} accent="sage" />
                                <ActionCard i={6} to="/bridge" icon={<FileText size={22} />}
                                    iconColor={sanctuary.rose} iconBg={sanctuary.roseBg}
                                    title={t('nav.bridge')} subtitle={t('nav.bridgeSub')} accent="rose" />
                            </>
                        )}
                    </div>
                </section>

                {/* ===== Quick Navigation (Growth only — condensed to 4 key links) ===== */}
                {capacityMode === 'growth' && (
                    <section className="sanctuary-enter sanctuary-enter-5" style={{ marginTop: '28px' }}>
                        <h2 style={{
                            fontFamily: typography.body, fontSize: '0.75rem', fontWeight: 700,
                            color: sanctuary.textMuted, letterSpacing: '0.12em',
                            textTransform: 'uppercase', marginBottom: '14px',
                        }}>
                            {t('dashboard.section.quickAccess')}
                        </h2>
                        <div style={{
                            display: 'flex', gap: '10px',
                            overflowX: 'auto', paddingBottom: '4px',
                        }}>
                            <QuickPill to="/practice" icon={<GraduationCap size={15} />} label={t('dashboard.quick.practice')} />
                            <QuickPill to="/educator-training" icon={<Presentation size={15} />} label={t('dashboard.quick.educator')} />
                            <QuickPill to="/respite" icon={<HandHeart size={15} />} label={t('dashboard.quick.respite')} />
                            <QuickPill to="/learn" icon={<BookOpen size={15} />} label={t('dashboard.quick.learn')} />
                            <QuickPill to="/profile" icon={<Heart size={15} />} label={t('dashboard.quick.profile')} />
                            <QuickPill to="/strategies" icon={<Sparkles size={15} />} label={t('dashboard.quick.strategies')} />
                            <QuickPill to="/village" icon={<Users size={15} />} label={t('dashboard.quick.village')} />
                            <QuickPill to="/insights" icon={<TrendingUp size={15} />} label={t('dashboard.quick.insights')} />
                            <QuickPill to="/settings" icon={<Shield size={15} />} label={t('dashboard.quick.settings')} />
                        </div>
                    </section>
                )}

                {/* ===== Behavior Charts (Growth only) ===== */}
                {capacityMode === 'growth' && logs.length > 0 && (
                    <section className="sanctuary-enter sanctuary-enter-5" style={{ marginTop: '28px' }}>
                        <Suspense fallback={<DashboardSectionFallback label="Loading behavior insights..." minHeight={320} />}>
                            <BehaviorCharts logs={logs} childName={childName} />
                        </Suspense>
                    </section>
                )}

                {/* ===== Wisdom Card ===== */}
                {capacityMode === 'growth' && (
                    <section className="sanctuary-enter sanctuary-enter-6" style={{ marginTop: '32px' }}>
                        <div className="sanctuary-card" style={{
                            background: sanctuary.bgCard,
                            border: `1px solid ${sanctuary.border}`,
                            borderRadius: '20px', padding: '28px',
                            boxShadow: sanctuary.shadow,
                            position: 'relative', overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                background: `linear-gradient(90deg, transparent, ${sanctuary.gold}40, ${sanctuary.purple}30, transparent)`,
                                borderRadius: '20px 20px 0 0',
                            }} />
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '16px',
                                    background: `linear-gradient(135deg, ${sanctuary.goldBg}, ${sanctuary.purpleBg})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, color: sanctuary.gold,
                                }}>
                                    <Sparkles size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontFamily: typography.heading, fontWeight: 600,
                                        fontSize: '1.1rem', color: sanctuary.text, marginBottom: '10px',
                                    }}>
                                        {t('dashboard.wisdom.title')}
                                    </h3>
                                    <p style={{
                                        color: sanctuary.textSecondary, lineHeight: 1.75,
                                        fontSize: '0.95rem', fontFamily: typography.body, marginBottom: '6px',
                                        fontStyle: 'italic',
                                    }}>
                                        {t(`dashboard.quote.${Math.floor(new Date().setHours(0,0,0,0) / 86400000) % 6}`)}
                                    </p>
                                    <p style={{
                                        color: sanctuary.textMuted, fontSize: '0.78rem',
                                        fontFamily: typography.body, marginBottom: '18px',
                                    }}>
                                        — Jill Scott, "Ode to Nikki"
                                    </p>
                                    <Link to="/log" style={{
                                        color: sanctuary.purple, fontWeight: 600, fontSize: '0.88rem',
                                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                                        gap: '6px', padding: '8px 16px', borderRadius: '10px',
                                        background: sanctuary.purpleBg, border: `1px solid ${sanctuary.purpleBorder}`,
                                        transition: 'all 0.2s ease',
                                    }}>
                                        {t('dashboard.wisdom.action')} <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
            <Suspense fallback={null}>
                <OnboardingWalkthrough />
            </Suspense>
        </div>
    );
}
