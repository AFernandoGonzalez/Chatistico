// src/context/ChatbotContext.js

import React, { createContext, useState, useEffect } from 'react';
import { getChatbots, getChatHistory, sendMessage, uploadQAPair, getQAPairs, updateQAPair, deleteQAPair } from '../services/api';

// Create the context
export const ChatbotContext = createContext();

// Create a provider component
export const ChatbotProvider = ({ children }) => {
  const [chatbots, setChatbots] = useState([]);
  const [chatHistory, setChatHistory] = useState({});
  const [qaPairs, setQAPairs] = useState([]);

  // Fetch all chatbots
  useEffect(() => {
    getChatbots().then(setChatbots);
  }, []);

  // Function to fetch chat history for a specific chatbot
  const fetchChatHistory = async (chatbotId) => {
    const history = await getChatHistory(chatbotId);
    setChatHistory((prev) => ({ ...prev, [chatbotId]: history }));
  };

  // Function to send a message to a chatbot
  const handleSendMessage = async (userId, message) => {
    const response = await sendMessage(userId, message);
    return response;
  };

  // Function to fetch Q&A pairs for a chatbot
  const fetchQAPairs = async (userId) => {
    const pairs = await getQAPairs(userId);
    setQAPairs(pairs);
  };

  // Function to upload a new Q&A pair
  const handleUploadQAPair = async (userId, question, answer) => {
    const newPair = await uploadQAPair(userId, question, answer);
    setQAPairs((prev) => [...prev, newPair]);
  };

  // Function to update a Q&A pair
  const handleUpdateQAPair = async (id, question, answer) => {
    const updatedPair = await updateQAPair(id, question, answer);
    setQAPairs((prev) =>
      prev.map((pair) => (pair.id === id ? updatedPair : pair))
    );
  };

  // Function to delete a Q&A pair
  const handleDeleteQAPair = async (id) => {
    await deleteQAPair(id);
    setQAPairs((prev) => prev.filter((pair) => pair.id !== id));
  };

  return (
    <ChatbotContext.Provider value={{ chatbots, chatHistory, qaPairs, fetchChatHistory, handleSendMessage, fetchQAPairs, handleUploadQAPair, handleUpdateQAPair, handleDeleteQAPair }}>
      {children}
    </ChatbotContext.Provider>
  );
};
