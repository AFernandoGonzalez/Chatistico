import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatWidgetPreview = ({
  primaryColor,
  textColor,
  iconColor,
  chatWidth,
  widgetPosition,
  horizontalSpacing,
  verticalSpacing,
  botIconCircular,
  chatIconCircular,
  chatIconSize,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  // Calculate dynamic positioning based on widget position and spacing
  const widgetPositionStyle = widgetPosition === 'br' 
    ? { right: `${horizontalSpacing}px`, bottom: `${verticalSpacing}px` }
    : { left: `${horizontalSpacing}px`, bottom: `${verticalSpacing}px` };

  return (
    <div className="relative">
      {isChatOpen && (
        <div
          className="chat-widget-preview fixed bg-white shadow-lg overflow-hidden"
          style={{
            ...widgetPositionStyle,
            width: `${chatWidth}px`,
            maxWidth: '600px',
            minWidth: '350px',
            height: '600px',
            maxHeight: '600px',
            borderRadius: botIconCircular ? '50%' : '8px',
          }}
        >
          {/* Chat Header */}
          <div
            className="flex items-center justify-between p-3"
            style={{ backgroundColor: primaryColor, borderRadius: botIconCircular ? '50%' : '8px 8px 0 0' }}
          >
            <h3 className="font-bold text-xl" style={{ color: textColor }}>
              Support Bot
            </h3>
            <button onClick={() => setIsChatOpen(false)} style={{ color: textColor }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Chat Content */}
          <div className="chat-content p-4 flex-1 overflow-y-auto bg-gray-50 h-[470px]">
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
                To track your order's shipment, go to the Orders page in your account and click on the <strong>Track</strong> button next to the order.
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="chat-input border-t p-3 bg-white flex items-center">
            <input
              type="text"
              placeholder="Type your message here"
              className="w-full p-3 rounded-md focus:outline-none text-black"
            />
            <button className="ml-2 p-2" style={{ width: `${chatIconSize}px`, height: `${chatIconSize}px`, borderRadius: chatIconCircular ? '50%' : '8px', backgroundColor: primaryColor }}>
              <FontAwesomeIcon icon={faPaperPlane} style={{ color: iconColor }} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button for Chat */}
      <button
        style={{
          backgroundColor: iconColor,
          color: textColor,
          width: `${chatIconSize}px`,
          height: `${chatIconSize}px`,
          borderRadius: chatIconCircular ? '50%' : '8px',
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed p-3 shadow-lg"
        style={{
          ...widgetPositionStyle,
          right: widgetPosition === 'br' ? `${horizontalSpacing}px` : 'auto',
          left: widgetPosition === 'bl' ? `${horizontalSpacing}px` : 'auto',
          bottom: `${verticalSpacing}px`,
        }}
      >
        <FontAwesomeIcon icon={isChatOpen ? faTimes : faBars} />
      </button>
    </div>
  );
};

export default ChatWidgetPreview;
