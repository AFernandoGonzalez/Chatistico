import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/Dashboard';
import ChatbotDetail from './pages/ChatbotDetail';
import KnowledgeBase from './pages/KnowledgeBase';
import Configuration from './pages/Configuration';
import Profile from './pages/Profile';
import { Overview } from './pages/Overview';
import ChatHistory from './components/ChatHistory';
import Integrations from './pages/Integrations';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();

  const publicPaths = ['/', '/signup', '/login'];
  const isPublicRoute = publicPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      {isPublicRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chatbot/:id" element={<ChatbotDetail />}>
            <Route path="overview" element={<Overview />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="chat" element={<ChatHistory />} />
            <Route path="integration" element={<Integrations />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
