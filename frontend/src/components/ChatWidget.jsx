import React, { useState } from 'react';
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
  showSources,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatOpen, setChatOpen] = useState(true); // Control chat visibility

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

  return (
    <div>test</div>
    // <div className="chat-widget" style={{ borderColor: themeColor }}>
    //   {chatOpen ? (
    //     <div className="flex flex-col justify-between p-4 bg-white shadow-lg rounded-lg h-96" style={{ borderColor: themeColor }}>
    //       {/* Chat Header */}
    //       <div className="flex items-center justify-between p-2 rounded-t-md" style={{ backgroundColor: themeColor }}>
    //         <h3 className="text-white font-bold">{headerTitle}</h3>
    //         <button className="text-white hover:text-gray-200" onClick={() => setChatOpen(false)}>×</button>
    //       </div>

    //       {/* Chat Messages */}
    //       <div className="chat-messages flex-grow overflow-y-auto space-y-4 mb-4">
    //         {messages.map((msg, index) => (
    //           <div
    //             key={index}
    //             className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    //           >
    //             <div
    //               className={`p-3 rounded-lg max-w-xs ${
    //                 msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
    //               }`}
    //             >
    //               {msg.text}
    //             </div>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Chat Input */}
    //       <div className="chat-input flex items-center gap-2 border-t pt-2">
    //         <input
    //           type="text"
    //           value={input}
    //           onChange={(e) => setInput(e.target.value)}
    //           placeholder="Type a message..."
    //           className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
    //         />
    //         <button
    //           onClick={sendMessage}
    //           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    //         >
    //           Send
    //         </button>
    //       </div>
    //     </div>
    //   ) : (
    //     <button
    //       className={`fixed bottom-4 right-4 p-3 ${iconColor} ${botIconShape === 'circle' ? 'rounded-full' : 'rounded'} shadow-lg`}
    //       onClick={() => setChatOpen(true)}
    //       style={{
    //         backgroundImage: `url(${botIcon})`,
    //         backgroundSize: 'cover',
    //         width: `${botIconSize}px`,
    //         height: `${botIconSize}px`,
    //       }}
    //     ></button>
    //   )}
    // </div>
  );
};

export default ChatWidget;
