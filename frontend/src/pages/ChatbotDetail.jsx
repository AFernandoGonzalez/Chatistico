import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import KnowledgeBase from './KnowledgeBase';
import Configuration from './Configuration';
import ChatHistory from '../components/ChatHistory';
import { Overview } from './Overview';

const ChatbotDetail = () => {
  const { id } = useParams();
  // Load viewMode from localStorage or default to 'overview'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('viewMode') || 'overview';
  });

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  return (
    <div className="flex flex-col h-screen">
      {/* Tabbed Navigation */}
      <div className="bg-white shadow-md">
        <div className="flex justify-around p-4">
          <TabButton label="Overview" isActive={viewMode === 'overview'} onClick={() => setViewMode('overview')} />
          <TabButton label="Knowledge Base" isActive={viewMode === 'knowledge-base'} onClick={() => setViewMode('knowledge-base')} />
          <TabButton label="Configuration" isActive={viewMode === 'configuration'} onClick={() => setViewMode('configuration')} />
          <TabButton label="Chat" isActive={viewMode === 'chat'} onClick={() => setViewMode('chat')} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow  bg-gray-100">
        {viewMode === 'overview' && <Overview />}
        {viewMode === 'knowledge-base' && <KnowledgeBase />}
        {viewMode === 'configuration' && <Configuration />}
        {viewMode === 'chat' && <ChatHistory />}
      </div>
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-lg font-semibold ${isActive ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-700'} transition-colors duration-300`}
    >
      {label}
    </button>
  );
};

export default ChatbotDetail;
