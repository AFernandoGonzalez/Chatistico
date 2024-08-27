import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatbotSidebar from '../components/ChatbotSidebar';
import KnowledgeBase from '../components/KnowledgeBase'; // Import KnowledgeBase component
import Configuration from '../components/Configuration'; // Import Configuration component

const ChatbotDetail = () => {
  const { id } = useParams(); // Get the chatbot ID from the URL
  const [viewMode, setViewMode] = useState('overview'); // Default view mode

  return (
    <div className="flex h-screen">
      {/* Sidebar with chatbot-specific links */}
      <ChatbotSidebar onSelectView={setViewMode} />

      {/* Main content area */}
      <div className="flex-grow p-6 bg-gray-100">
        {viewMode === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Chatbot Overview</h1>
            {/* Overview content goes here */}
          </div>
        )}
        {viewMode === 'knowledge-base' && <KnowledgeBase />}
        {viewMode === 'configuration' && <Configuration />}
      </div>
    </div>
  );
};

export default ChatbotDetail;
