import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/Dashboard';
import ChatbotDetail from './pages/ChatbotDetail';
import KnowledgeBase from './pages/KnowledgeBase';
import Configuration from './pages/Configuration';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="chatbot/:id" element={<ChatbotDetail />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
