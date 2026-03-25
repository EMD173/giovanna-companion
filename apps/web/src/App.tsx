import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ECModeProvider } from './contexts/ECModeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary, PageLoadingFallback } from './components/ErrorBoundary';
import { DevNav } from './components/DevNav';

// ============================================
// LAZY-LOADED PAGES (~60% initial bundle reduction)
// ============================================

const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const LearningHub = lazy(() => import('./pages/LearningHub').then(m => ({ default: m.LearningHub })));
const ABCLogPage = lazy(() => import('./pages/ABCLogPage').then(m => ({ default: m.ABCLogPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const IEPReportPage = lazy(() => import('./pages/IEPReportPage').then(m => ({ default: m.IEPReportPage })));
const StrategiesPage = lazy(() => import('./pages/StrategiesPage').then(m => ({ default: m.StrategiesPage })));
const SharePage = lazy(() => import('./pages/SharePage').then(m => ({ default: m.SharePage })));
const PublicShareView = lazy(() => import('./pages/PublicShareView').then(m => ({ default: m.PublicShareView })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const ChildProfilePage = lazy(() => import('./pages/ChildProfilePage').then(m => ({ default: m.ChildProfilePage })));
const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage').then(m => ({ default: m.MediaLibraryPage })));
const HomeplacePage = lazy(() => import('./pages/HomeplacePage').then(m => ({ default: m.HomeplacePage })));
const PSPEditorPage = lazy(() => import('./pages/PSPEditorPage').then(m => ({ default: m.PSPEditorPage })));
const ParentResourceHub = lazy(() => import('./pages/ParentResourceHub').then(m => ({ default: m.ParentResourceHub })));
const VillageCalendarPage = lazy(() => import('./pages/VillageCalendarPage').then(m => ({ default: m.VillageCalendarPage })));
const SafetyProfilePage = lazy(() => import('./pages/SafetyProfilePage').then(m => ({ default: m.SafetyProfilePage })));
const WellnessPage = lazy(() => import('./pages/WellnessPage').then(m => ({ default: m.WellnessPage })));
const InsuranceAppealPage = lazy(() => import('./pages/InsuranceAppealPage').then(m => ({ default: m.InsuranceAppealPage })));
const JoyWinsPage = lazy(() => import('./pages/JoyWinsPage').then(m => ({ default: m.JoyWinsPage })));
const TransitionRoadmapPage = lazy(() => import('./pages/TransitionRoadmapPage').then(m => ({ default: m.TransitionRoadmapPage })));
const HealthcareDefensePage = lazy(() => import('./pages/HealthcareDefensePage').then(m => ({ default: m.HealthcareDefensePage })));
const ProfessionalIntegrationPage = lazy(() => import('./pages/ProfessionalIntegrationPage').then(m => ({ default: m.ProfessionalIntegrationPage })));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage').then(m => ({ default: m.AIInsightsPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminSettings = lazy(() => import('./pages/AdminSettings').then(m => ({ default: m.AdminSettings })));
const UpgradePage = lazy(() => import('./pages/UpgradePage').then(m => ({ default: m.UpgradePage })));
const PracticeModulesPage = lazy(() => import('./pages/PracticeModulesPage').then(m => ({ default: m.PracticeModulesPage })));
const EducatorTrainingPage = lazy(() => import('./pages/EducatorTrainingPage').then(m => ({ default: m.EducatorTrainingPage })));
const RespiteMarketplacePage = lazy(() => import('./pages/RespiteMarketplacePage').then(m => ({ default: m.RespiteMarketplacePage })));
const DemoEntry = lazy(() => import('./pages/DemoEntry').then(m => ({ default: m.DemoEntry })));

/** Scrolls to top on every route change */
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <FamilyProvider>
          <ECModeProvider>
            <BrowserRouter>
              <ScrollToTop />
              <ErrorBoundary fallbackTitle="Giovanna needs a moment">
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    {/* ====== PUBLIC ROUTES ====== */}
                    {/* Teacher/provider share view — no auth required */}
                    <Route path="/share" element={<PublicShareView />} />
                    {/* Direct demo link — shareable URL */}
                    <Route path="/demo" element={<DemoEntry />} />

                    {/* Public routes with Layout (Landing, Signup, Learn) */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<LandingPage />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="onboarding" element={<Onboarding />} />
                      <Route path="learn" element={<LearningHub />} />

                      {/* ====== PROTECTED ROUTES ====== */}
                      {/* All routes below require authentication */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                        <Route path="log" element={<ErrorBoundary><ABCLogPage /></ErrorBoundary>} />
                        <Route path="chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
                        <Route path="strategies" element={<ErrorBoundary><StrategiesPage /></ErrorBoundary>} />
                        <Route path="bridge" element={<ErrorBoundary><SharePage /></ErrorBoundary>} />
                        <Route path="report" element={<ErrorBoundary><IEPReportPage /></ErrorBoundary>} />
                        <Route path="profile" element={<ErrorBoundary><ChildProfilePage /></ErrorBoundary>} />
                        <Route path="homeplace" element={<ErrorBoundary><HomeplacePage /></ErrorBoundary>} />
                        <Route path="village" element={<ErrorBoundary><VillageCalendarPage /></ErrorBoundary>} />
                        <Route path="safety" element={<ErrorBoundary><SafetyProfilePage /></ErrorBoundary>} />
                        <Route path="wellness" element={<ErrorBoundary><WellnessPage /></ErrorBoundary>} />
                        <Route path="appeals" element={<ErrorBoundary><InsuranceAppealPage /></ErrorBoundary>} />
                        <Route path="wins" element={<ErrorBoundary><JoyWinsPage /></ErrorBoundary>} />
                        <Route path="transition" element={<ErrorBoundary><TransitionRoadmapPage /></ErrorBoundary>} />
                        <Route path="healthcare-defense" element={<ErrorBoundary><HealthcareDefensePage /></ErrorBoundary>} />
                        <Route path="providers" element={<ErrorBoundary><ProfessionalIntegrationPage /></ErrorBoundary>} />
                        <Route path="insights" element={<ErrorBoundary><AIInsightsPage /></ErrorBoundary>} />
                        <Route path="psp" element={<ErrorBoundary><PSPEditorPage /></ErrorBoundary>} />
                        <Route path="resources" element={<ErrorBoundary><ParentResourceHub /></ErrorBoundary>} />
                        <Route path="resources/:slug" element={<ErrorBoundary><ParentResourceHub /></ErrorBoundary>} />
                        <Route path="media" element={<ErrorBoundary><MediaLibraryPage /></ErrorBoundary>} />
                        <Route path="practice" element={<ErrorBoundary><PracticeModulesPage /></ErrorBoundary>} />
                        <Route path="practice/:slug" element={<ErrorBoundary><PracticeModulesPage /></ErrorBoundary>} />
                        <Route path="educator-training" element={<ErrorBoundary><EducatorTrainingPage /></ErrorBoundary>} />
                        <Route path="educator-training/:slug" element={<ErrorBoundary><EducatorTrainingPage /></ErrorBoundary>} />
                        <Route path="respite" element={<ErrorBoundary><RespiteMarketplacePage /></ErrorBoundary>} />
                        <Route path="respite/:slug" element={<ErrorBoundary><RespiteMarketplacePage /></ErrorBoundary>} />
                        <Route path="upgrade" element={<ErrorBoundary><UpgradePage /></ErrorBoundary>} />
                        <Route path="admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                        <Route path="admin/settings" element={<ErrorBoundary><AdminSettings /></ErrorBoundary>} />
                        <Route path="settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </ErrorBoundary>
              <DevNav />
            </BrowserRouter>
          </ECModeProvider>
        </FamilyProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
