import React from 'react';

const ChatbotSidebar = ({ onSelectView }) => {
  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4">Chatbot Menu</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectView('overview')}
            className="block w-full text-left p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Overview
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectView('knowledge-base')}
            className="block w-full text-left p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Knowledge Base
          </button>
        </li>
        <li>
          <button
            onClick={() => onSelectView('configuration')}
            className="block w-full text-left p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Configuration
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ChatbotSidebar;
