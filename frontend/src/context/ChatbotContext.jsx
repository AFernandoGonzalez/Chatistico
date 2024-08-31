import React, { createContext, useState, useEffect } from 'react';
import { getChatbots, getChatHistory, sendMessage, uploadQAPair, getQAPairs, updateQAPair, deleteQAPair } from '../services/api';

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [chatbots, setChatbots] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [qaPairs, setQAPairs] = useState([]);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const data = await getChatbots();
        setChatbots(data);
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      }
    };

    fetchChatbots();
  }, []);

  return (
    <ChatbotContext.Provider value={{ 
      chatbots, 
      setChatbots, 
      chatHistory, 
      qaPairs, 
      // fetchChatHistory, 
      // handleSendMessage, 
      // fetchQAPairs, 
      // handleUploadQAPair, 
      // handleUpdateQAPair, 
      // handleDeleteQAPair 
    }}>
      {children}
    </ChatbotContext.Provider>
  );
};
