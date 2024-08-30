import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const ChatHistory = () => {
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock users data
  const users = [
    { id: 1, name: 'Alice Johnson', timestamp: '2h ago' },
    { id: 2, name: 'Bob Smith', timestamp: '4h ago' },
    { id: 3, name: 'Charlie Brown', timestamp: '1d ago' },
  ];

  // Mock chat logs
  const mockChatLogs = {
    1: [
      { sender: 'user', message: 'Hi Alice!', timestamp: '2h ago' },
      { sender: 'bot', message: 'Hello! How can I help you?', timestamp: '2h ago' },
    ],
    2: [
      { sender: 'user', message: 'Hey Bob!', timestamp: '4h ago' },
      { sender: 'bot', message: 'Hi! Need any assistance?', timestamp: '4h ago' },
    ],
    3: [
      { sender: 'user', message: 'Good morning, Charlie!', timestamp: '1d ago' },
      { sender: 'bot', message: 'Good morning! What can I do for you today?', timestamp: '1d ago' },
    ],
  };

  // Handler for selecting a user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setChatLogs(mockChatLogs[user.id]);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar for User Conversations */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          {/* <button className="text-blue-500">Most recent ▼</button> */}
        </div>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className={`p-2 flex items-center cursor-pointer rounded-md ${
                selectedUser && selectedUser.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 mr-3 text-2xl" />
              <div className="flex-grow">
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">Message preview not available</p>
              </div>
              <span className="text-xs text-gray-400">{user.timestamp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col p-6 bg-gray-50">
        {selectedUser ? (
          <>
            <div className="flex items-center mb-4">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                <button className="text-blue-500">View details</button>
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
                <div key={index} className={`flex items-start mb-4 ${log.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-4 rounded-lg ${log.sender === 'user' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{log.timestamp}</p>
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
