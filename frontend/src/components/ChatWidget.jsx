import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatWidget = ({
  userId,
  themeColor,
  textColor,
  iconColor,
  headerTitle,
  botIcon,
  botIconShape,
  botIconSize,
  hoverMessageDesktop,
  hoverMessageMobile,
  showSources
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, sender: 'user' }]);

    try {
      const response = await axios.post('https://your-backend-url.com/api/chat/message', {
        userId,
        message: input,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.reply, sender: 'bot' },
      ]);

      setInput('');
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Error sending message. Please try again.', sender: 'bot' },
      ]);
    }
  };

  useEffect(() => {
    const handleHoverMessage = (event) => {
      if ((hoverMessageDesktop && window.innerWidth > 768) || (hoverMessageMobile && window.innerWidth <= 768)) {
        // Show hover message or perform any action
      }
    };

    document.addEventListener('mouseover', handleHoverMessage);

    return () => {
      document.removeEventListener('mouseover', handleHoverMessage);
    };
  }, [hoverMessageDesktop, hoverMessageMobile]);

  return (
    <div
      className={`chat-widget flex flex-col justify-between p-4 bg-white shadow-lg rounded-lg h-96`}
      style={{ borderColor: themeColor, color: textColor }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-2 rounded-t-md"
        style={{ backgroundColor: themeColor, color: textColor }}
      >
        {botIcon && (
          <img
            src={botIcon}
            alt="Bot Icon"
            style={{
              width: botIconSize,
              height: botIconSize,
              borderRadius: botIconShape === 'circle' ? '50%' : '0%'
            }}
          />
        )}
        <h3 className="font-bold">{headerTitle}</h3>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="text-white hover:text-gray-200">
          {isChatOpen ? '×' : '≡'}
        </button>
      </div>

      {isChatOpen && (
        <>
          {/* Chat Messages */}
          <div className="chat-messages flex-grow overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                  {showSources && msg.sender === 'bot' && (
                    <div className="text-xs text-gray-500">Source: AI Knowledge Base</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-input flex items-center gap-2 border-t pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2"
              style={{ backgroundColor: iconColor, color: textColor }}
            >
              Send
            </button>
          </div>
        </>
      )}

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-0 right-0 m-4"
          style={{
            backgroundColor: iconColor,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            color: textColor
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
