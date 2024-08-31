import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getChatHistory } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ChatHistory = () => {
  const { id: chatbotId } = useParams();
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  // Get the user from AuthContext
  const { user } = useContext(AuthContext);

  console.log("user: ", user );
  console.log("chatbotid", chatbotId);
  

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user && user.id && chatbotId) {
        try {
          const response = await getChatHistory(user.id, chatbotId);
          setChats(response.chats);
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        }
      }
    };

    fetchChatHistory();
  }, [user, chatbotId]);

  // Handler for selecting a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setChatLogs(chat.messages);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar for User Conversations */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
        </div>
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-2 flex items-center cursor-pointer rounded-md ${selectedChat && selectedChat.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 mr-3 text-2xl" />
              <div className="flex-grow">
                <p className="font-semibold">
                  Chat with {chat.customer?.name || `Customer ID: ${chat.customer_id}`}
                </p>
                <p className="text-sm text-gray-600">
                  Last message: {new Date(chat.last_timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col p-6 bg-gray-50">
        {selectedChat ? (
          <>
            <div className="flex items-center mb-4">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">
                  Chat with {selectedChat.customer?.name || `Customer ID: ${selectedChat.customer_id}`}
                </h2>
              </div>
              <div className="flex space-x-3">
                {/* Action buttons */}
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faStar} />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <FontAwesomeIcon icon={faEnvelope} />
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {chatLogs.map((log, index) => (
                <div key={index} className={`flex items-start mb-4 ${log.role_id === 2 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-4 rounded-lg ${log.role_id === 2 ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                    <p className="text-sm">{log.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
