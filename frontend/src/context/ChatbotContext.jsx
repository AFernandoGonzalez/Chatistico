import React, { createContext, useState, useEffect, useContext } from 'react';
import { getChatbots } from '../services/api';
import { AuthContext } from './AuthContext';  // Get the current user from AuthContext

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const { user } = useContext(AuthContext);  // Get the user from AuthContext
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      const fetchChatbots = async () => {
        try {
          const data = await getChatbots(user.uid);  // Pass the user's uid to the API
          setChatbots(data);
        } catch (error) {
          console.error('Error fetching chatbots:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchChatbots();
    }
  }, [user]);

  return (
    <ChatbotContext.Provider value={{ chatbots, setChatbots, loading }}>
      {children}
    </ChatbotContext.Provider>
  );
};
