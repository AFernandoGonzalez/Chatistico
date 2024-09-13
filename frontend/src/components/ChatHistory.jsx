import React, { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { getAllChatsByChatbot } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const ChatHistory = () => {
  const { id: chatbotId } = useParams();
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const chatEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllChats = async () => {
      if (chatbotId) {
        try {
          const response = await getAllChatsByChatbot(chatbotId);
          const sortedChats = response.chats.sort(
            (a, b) => new Date(b.last_timestamp) - new Date(a.last_timestamp)
          );
          setChats(sortedChats);
          if (sortedChats && sortedChats.length > 0) {
            setSelectedChat(sortedChats[0]);
            setChatLogs(sortedChats[0].messages);
          }
        } catch (error) {
          console.error('Failed to fetch all chats for chatbot:', error);
        }
      }
    };

    fetchAllChats();
  }, [chatbotId]);

  useEffect(() => {
    if (chatLogs.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLogs]);
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setChatLogs(chat.messages);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="min-w-[200px] md:max-w-[400px] bg-white border-r p-2 overflow-y-auto">
        <div className="flex justify-between items-center my-6">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
        </div>
        <ul className="">
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 flex items-center cursor-pointer rounded-lg ${
                selectedChat && selectedChat.id === chat.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 mr-3 text-2xl" />
              <div className="flex-grow">
                <p className="font-semibold">
                  Chat with {chat.customer?.name || `Customer ID: ${chat.customer_id}`}
                </p>
                <p className="text-sm">
                  Last message: {new Date(chat.last_timestamp).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-grow flex flex-col p-6 bg-gray-100">
        {selectedChat ? (
          <>
            <div className="flex items-center mb-4">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Chat with {selectedChat.customer?.name || `Customer ID: ${selectedChat.customer_id}`}
                </h2>
              </div>
              <div className="flex space-x-3">
                {/* Action buttons */}
                {/* <button className="p-2 text-gray-600 hover:text-primary-dark">
                  <FontAwesomeIcon icon={faStar} />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-dark">
                  <FontAwesomeIcon icon={faEnvelope} />
                </button> */}
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              {chatLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start mb-4 ${log.role_id === 2 ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-4 rounded-lg ${
                      log.role_id === 2 ? 'bg-gray-200 text-gray-800' : 'bg-primary text-white'
                    }`}
                  >
                    <p className="text-sm">{log.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
               <div ref={chatEndRef} />
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
