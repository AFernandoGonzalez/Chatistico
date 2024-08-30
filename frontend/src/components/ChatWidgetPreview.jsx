import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatWidgetPreview = ({
  primaryColor,
  textColor,
  iconColor,
  chatWidth,
  botIconCircular,
  chatIconCircular,
  chatIconSize,
  botIconImage,
  chatIconImage,
  chatbotName
}) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="relative">
      {isChatOpen && (
        <div
          className="chat-widget-preview fixed bottom-[50px] right-0 mb-5 bg-white shadow-lg overflow-hidden"
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
            {chatbotName}
            </h3>
            <button onClick={() => setIsChatOpen(false)} className="" style={{ color: textColor }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Chat Content */}
<div className="chat-content p-4 flex-1 overflow-y-auto bg-gray-50 h-[470px]">
  <div className="chat-message space-y-4">
    
    {/* First Bot Message with Icon */}
    <div className="flex items-start">
      <div
        className={`flex-shrink-0 w-10 h-10 ${botIconCircular ? 'rounded-full' : 'rounded-md'} bg-cover bg-center mr-3`}
        style={{ backgroundImage: `url('${botIconImage}')` }}
      ></div>
      <div className="message bot bg-gray-200 text-gray-800 p-3 rounded-lg">
        Hi, how can I help you today?
      </div>
    </div>

    {/* User Message */}
    <div className="flex items-start justify-end">
      <div
        className="message user p-3 rounded-lg"
        style={{ backgroundColor: primaryColor, color: textColor }}
      >
        How can I track my order?
      </div>
    </div>

    {/* Second Bot Message with Icon */}
    <div className="flex items-start">
      <div
        className={`flex-shrink-0 w-10 h-10 ${botIconCircular ? 'rounded-full' : 'rounded-md'} bg-cover bg-center mr-3`}
        style={{ backgroundImage: `url('${botIconImage}')` }}
      ></div>
      <div className="message bot bg-gray-200 text-gray-800 p-3 rounded-lg">
        To track your order's shipment, go to the Orders page in your account and click on
        the <strong>Track</strong> button next to the order.
      </div>
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
            <button className="ml-2 p-2">
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
          backgroundImage: `url('${chatIconImage}')`, // Use chat icon image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-[10px] right-0 p-3 rounded-full shadow-lg"
      >
        {/* Only show icon if no image is set */}
        {!chatIconImage && <FontAwesomeIcon icon={isChatOpen ? faTimes : faBars} />}
      </button>
    </div>
  );
};

export default ChatWidgetPreview;
