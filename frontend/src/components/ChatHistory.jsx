import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatHistory = ({ userId }) => {
  const [chatLogs, setChatLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/chat/history', {
          params: { userId },
        });
        setChatLogs(response.data.chatLogs);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left Sidebar for User Conversations */}
      <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit</h2>
          <button className="text-blue-500">Most recent ▼</button>
        </div>
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-2 flex items-center cursor-pointer rounded-md ${
                selectedUser && selectedUser.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
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
                <button className="p-2 text-gray-500 hover:text-gray-700">☆</button>
                <button className="p-2 text-gray-500 hover:text-gray-700">✉️</button>
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
            <div className="p-4 border-t bg-white">
              <input
                type="text"
                placeholder="Write your message..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
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
