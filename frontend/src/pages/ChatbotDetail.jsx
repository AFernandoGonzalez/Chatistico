import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatbotSidebar from '../components/ChatbotSidebar';
import KnowledgeBase from './KnowledgeBase';
import Configuration from './Configuration';

const ChatbotDetail = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('overview');

  return (
    <div className="flex h-screen">
      <ChatbotSidebar onSelectView={setViewMode} />
      <div className="flex-grow p-6 bg-gray-100">
        {viewMode === 'overview' && <div><h1 className="text-2xl font-bold mb-4">Chatbot Overview</h1></div>}
        {viewMode === 'knowledge-base' && <KnowledgeBase />}
        {viewMode === 'configuration' && <Configuration />}
      </div>
    </div>
  );
};

export default ChatbotDetail;
