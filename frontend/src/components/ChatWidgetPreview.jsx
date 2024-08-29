import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatWidgetPreview = ({ primaryColor, textColor, iconColor, chatWidth }) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="relative">
      {isChatOpen && (
        <div
          className="chat-widget-preview fixed bottom-0 right-0 mb-5 mr-5 bg-white shadow-lg rounded-lg overflow-hidden"
          style={{
            width: `${chatWidth}px`,
            maxWidth: '600px',
            minWidth: '350px',
            height: '600px',
            maxHeight: '600px',
          }}
        >
          {/* Chat Header */}
          <div
            className="flex items-center justify-between p-3 rounded-t-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <h3 className="font-bold text-xl" style={{ color: textColor }}>
              Support Bot
            </h3>
            <button onClick={() => setIsChatOpen(false)} className="" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="chat-content p-4 flex-1 overflow-y-auto bg-gray-50">
            <div className="chat-message space-y-4">
              <div className="message bot bg-gray-200 text-gray-800 p-3 rounded-lg">
                Hi, how can I help you today?
              </div>
              <div
                className="message user p-3 rounded-lg"
                style={{ backgroundColor: primaryColor, color: textColor }}
              >
                How can I track my order?
              </div>
              <div className="message bot bg-gray-200 text-gray-800 p-3 rounded-lg">
                To track your order's shipment, go to the Orders page in your account and click on
                the <strong>Track</strong> button next to the order.
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="chat-input border-t p-3 bg-white flex items-center">
            <input
              type="text"
              placeholder="Type your message here"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              style={{ color: textColor }}
            />
            <button className="ml-2 p-2 rounded-full" style={{ backgroundColor: primaryColor, color: textColor }}>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button for Chat */}
      <button
        style={{ backgroundColor: iconColor, color: textColor }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-5 right-5 p-3 rounded-full shadow-lg"
      >
        <FontAwesomeIcon icon={isChatOpen ? faTimes : faBars} />
      </button>
    </div>
  );
};

export default ChatWidgetPreview;
