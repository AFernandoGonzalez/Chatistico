import React, { useState } from 'react';
import ChatWidgetPreview from './ChatWidgetPreview';

const ChatbotConfig = ({ selectedChatbot, onBack }) => {
  const [themeColor, setThemeColor] = useState('#000'); 

  return (
    <div className="flex-grow p-4">
      <button
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        onClick={onBack}
      >
        Back to Conversations
      </button>
      <div className="bg-white shadow-md p-4 rounded-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Configure {selectedChatbot.name}
        </h2>
        {/* Configuration options */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">
            Theme Color:
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="ml-2"
            />
          </label>
        </div>

        {/* Chatbot Preview */}
        <ChatWidgetPreview userId={selectedChatbot.id} themeColor={themeColor} />
      </div>
    </div>
  );
};

export default ChatbotConfig;
