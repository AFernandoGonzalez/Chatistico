import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [chatbots, setChatbots] = useState([
    { id: 1, name: 'Customer Support Bot', description: 'Handles customer support queries.' },
    { id: 2, name: 'Sales Inquiry Bot', description: 'Answers sales-related questions.' },
  ]);

  const navigate = useNavigate();

  const handleCreateChatbot = () => {
    alert('Create Chatbot logic here');
  };

  const handleViewChatbot = (id) => {
    navigate(`/dashboard/chatbot/${id}`);
  };

  return (
    <div className="flex-grow bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleCreateChatbot} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Create Chatbot
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((chatbot) => (
          <div key={chatbot.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">{chatbot.name}</h3>
            <p className="text-gray-600">{chatbot.description}</p>
            <button onClick={() => handleViewChatbot(chatbot.id)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
