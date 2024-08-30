import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatbotContext } from '../context/ChatbotContext'; // Import ChatbotContext
import { getChatbots, createChatbot } from '../services/api'; // Import API functions

const Dashboard = () => {
  const { chatbots, setChatbots } = useContext(ChatbotContext); // Use context for chatbots
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch chatbots from the server when component mounts
  useEffect(() => {
    const fetchChatbots = async () => {
      setLoading(true);
      try {
        const data = await getChatbots();
        setChatbots(data); // Update chatbots in context
      } catch (error) {
        console.error('Error fetching chatbots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, [setChatbots]);

  // Handle chatbot creation
  const handleCreateChatbot = async () => {
    const name = prompt('Enter chatbot name:');
    const description = prompt('Enter chatbot description:');
    if (name && description) {
      try {
        const newChatbot = await createChatbot(name, description);
        setChatbots([...chatbots, newChatbot]); // Add new chatbot to context
        alert('Chatbot created successfully!');
      } catch (error) {
        console.error('Error creating chatbot:', error);
        alert('Failed to create chatbot. Please try again.');
      }
    }
  };

  // Handle view chatbot details
  const handleViewChatbot = (id) => {
    navigate(`/dashboard/chatbot/${id}/overview`); // Navigate to chatbot details page
  };

  return (
    <div className="flex-grow bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleCreateChatbot}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Create Chatbot
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div key={chatbot.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{chatbot.name}</h3>
              <p className="text-gray-600">{chatbot.description}</p>
              <button
                onClick={() => handleViewChatbot(chatbot.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
