import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatbotContext } from '../context/ChatbotContext';
import { createChatbot, deleteChatbot, renameChatbot } from '../services/api';
import { AuthContext } from '../context/AuthContext'; 

const Dashboard = () => {
  const { chatbots, setChatbots } = useContext(ChatbotContext);
  const { user } = useContext(AuthContext);

  console.log("user: ", user);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newChatbotName, setNewChatbotName] = useState('');
  const [newChatbotDescription, setNewChatbotDescription] = useState('');
  const [renameChatbotId, setRenameChatbotId] = useState(null);
  const [error, setError] = useState('');

  // Handle chatbot creation
  const handleCreateChatbot = async () => {
    if (!newChatbotName || !newChatbotDescription) {
      setError('handleCreateChatbot: Name and description are required.');
      return;
    }

    if (!user) {
      setError('User must be logged in to create a chatbot.');
      return;
    }

    try {
      // Pass userId to the createChatbot API function
      const newChatbot = await createChatbot(user.id, newChatbotName, newChatbotDescription);
      setChatbots([...chatbots, newChatbot]);
      setIsModalOpen(false);
      setNewChatbotName('');
      setNewChatbotDescription('');
      setError('');
    } catch (error) {
      console.error('Error creating chatbot:', error);
      setError('Failed to create chatbot. Please try again.');
    }
  };


  // Handle chatbot deletion
  const handleDeleteChatbot = async (id) => {
    if (window.confirm('Are you sure you want to delete this chatbot?')) {
      try {
        await deleteChatbot(id);
        setChatbots(chatbots.filter((chatbot) => chatbot.id !== id));
      } catch (error) {
        console.error('Error deleting chatbot:', error);
        alert('Failed to delete chatbot. Please try again.');
      }
    }
  };

  // Handle chatbot renaming
  const handleRenameChatbot = async () => {
    if (!newChatbotName || !newChatbotDescription) {
      setError('handleRenameChatbot : Name and description are required.');
      return;
    }

    try {
      await renameChatbot(renameChatbotId, newChatbotName, newChatbotDescription);
      setChatbots(chatbots.map(chatbot => chatbot.id === renameChatbotId ? { ...chatbot, name: newChatbotName, description: newChatbotDescription } : chatbot));
      setIsRenameModalOpen(false);
      setRenameChatbotId(null);
      setNewChatbotName('');
      setNewChatbotDescription('');
      setError('');
    } catch (error) {
      console.error('Error renaming chatbot:', error);
      alert('Failed to rename chatbot. Please try again.');
    }
  };

  // Open rename modal and set current chatbot details
  const openRenameModal = (id, name, description) => {
    setRenameChatbotId(id);
    setNewChatbotName(name);
    setNewChatbotDescription(description);
    setIsRenameModalOpen(true);
  };

  // Handle view chatbot details
  const handleViewChatbot = (id) => {
    navigate(`/dashboard/chatbot/${id}/overview`);
  };

  return (
    <div className="flex-grow bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleViewChatbot(chatbot.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => openRenameModal(chatbot.id, chatbot.name, chatbot.description)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDeleteChatbot(chatbot.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating a new chatbot */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Chatbot</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="text"
              placeholder="Chatbot Name"
              value={newChatbotName}
              onChange={(e) => setNewChatbotName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Chatbot Description"
              value={newChatbotDescription}
              onChange={(e) => setNewChatbotDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChatbot}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for renaming a chatbot */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Rename Chatbot</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="text"
              placeholder="Chatbot Name"
              value={newChatbotName}
              onChange={(e) => setNewChatbotName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Chatbot Description"
              value={newChatbotDescription}
              onChange={(e) => setNewChatbotDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameChatbot}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
