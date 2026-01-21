import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ECModeProvider } from './contexts/ECModeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { FamilyProvider } from './contexts/FamilyContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Signup } from './pages/Signup';
import { Onboarding } from './pages/Onboarding';

import { LearningHub } from './pages/LearningHub';
import { ABCLogPage } from './pages/ABCLogPage';
import { StrategiesPage } from './pages/StrategiesPage';
import { SharePage } from './pages/SharePage';
import { PublicShareView } from './pages/PublicShareView';
import { Settings } from './pages/Settings';
import { ChildProfilePage } from './pages/ChildProfilePage';
import { MediaLibraryPage } from './pages/MediaLibraryPage';
import { HomeplacePage } from './pages/HomeplacePage';
import { PSPEditorPage } from './pages/PSPEditorPage';
import { ParentResourceHub } from './pages/ParentResourceHub';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminSettings } from './pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <FamilyProvider>
          <ECModeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public route for teachers (no Layout/Auth required) */}
                <Route path="/share" element={<PublicShareView />} />

                {/* App routes with Layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<LandingPage />} />
                  <Route path="learn" element={<LearningHub />} />
                  <Route path="log" element={<ABCLogPage />} />
                  <Route path="strategies" element={<StrategiesPage />} />
                  <Route path="bridge" element={<SharePage />} />
                  <Route path="profile" element={<ChildProfilePage />} />
                  <Route path="homeplace" element={<HomeplacePage />} />
                  <Route path="psp" element={<PSPEditorPage />} />
                  <Route path="resources" element={<ParentResourceHub />} />
                  <Route path="resources/:slug" element={<ParentResourceHub />} />
                  <Route path="media" element={<MediaLibraryPage />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/settings" element={<AdminSettings />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="onboarding" element={<Onboarding />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ECModeProvider>
        </FamilyProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
