import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatHistory = ({ userId }) => {
  const [chatLogs, setChatLogs] = useState([]);

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

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Chat History</h2>
      <ul className="space-y-2">
        {chatLogs.map((log) => (
          <li key={log.id} className="p-2 border border-gray-200 rounded-md">
            <strong>User:</strong> {log.question}
            <br />
            <strong>Chatbot:</strong> {log.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
