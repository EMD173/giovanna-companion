import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';

// Placeholder pages for V1 structure
const LearningHub = () => <div className="p-4">Learning Hub (Coming Soon)</div>;
const ABCLog = () => <div className="p-4">ABC Log (Coming Soon)</div>;
const Strategies = () => <div className="p-4">Strategies (Coming Soon)</div>;
const Signup = () => <div className="p-4">Sign Up / Login (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="learn" element={<LearningHub />} />
          <Route path="log" element={<ABCLog />} />
          <Route path="strategies" element={<Strategies />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
