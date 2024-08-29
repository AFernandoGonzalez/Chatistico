import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatbotSidebar from '../components/ChatbotSidebar';

const ChatbotDetail = () => {
  return (
    <div className="flex">
      <ChatbotSidebar />
      <div className="flex-grow bg-gray-100">
        <Outlet /> 
      </div>
    </div>
  );
};

export default ChatbotDetail;
