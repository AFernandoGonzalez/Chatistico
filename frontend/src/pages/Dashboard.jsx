import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatbotContext } from '../context/ChatbotContext';
import { createChatbot, deleteChatbot, renameChatbot } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { chatbots, setChatbots } = useContext(ChatbotContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation
  const [newChatbotName, setNewChatbotName] = useState('');
  const [newChatbotDescription, setNewChatbotDescription] = useState('');
  const [renameChatbotId, setRenameChatbotId] = useState(null);
  const [chatbotToDelete, setChatbotToDelete] = useState(null); // Store chatbot to delete

  const handleCreateChatbot = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    if (!user) return;
    try {
      setLoading(true);
      const newChatbot = await createChatbot(user.uid, newChatbotName, newChatbotDescription);
      setChatbots([...chatbots, newChatbot]);
      setIsModalOpen(false);
      setNewChatbotName('');
      setNewChatbotDescription('');
      toast.success('Chatbot created successfully!');
    } catch (error) {
      console.error('Error creating chatbot:', error);
      toast.error('Failed to create chatbot.');
    } finally {
      setLoading(false);
    }
  };

  // Handle chatbot deletion with confirmation modal
  const handleDeleteChatbot = async () => {
    if (!chatbotToDelete) return;
    try {
      await deleteChatbot(chatbotToDelete.id);
      setChatbots(chatbots.filter((chatbot) => chatbot.id !== chatbotToDelete.id));
      setIsDeleteModalOpen(false);
      setChatbotToDelete(null);
      toast.success('Chatbot deleted successfully!');
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast.error('Failed to delete chatbot.');
    }
  };

  // Handle chatbot renaming
  const handleRenameChatbot = async (e) => {
    e.preventDefault(); // Prevent form submission refresh
    if (!newChatbotName || !newChatbotDescription) {
      toast.error('Name and description are required.');
      return;
    }
    try {
      await renameChatbot(renameChatbotId, newChatbotName, newChatbotDescription);
      setChatbots(chatbots.map(chatbot => chatbot.id === renameChatbotId ? { ...chatbot, name: newChatbotName, description: newChatbotDescription } : chatbot));
      setIsRenameModalOpen(false);
      toast.success('Chatbot renamed successfully!');
    } catch (error) {
      console.error('Error renaming chatbot:', error);
      toast.error('Failed to rename chatbot.');
    }
  };

  // Open rename modal
  const openRenameModal = (id, name, description) => {
    setRenameChatbotId(id);
    setNewChatbotName(name);
    setNewChatbotDescription(description);
    setIsRenameModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (chatbot) => {
    setChatbotToDelete(chatbot);
    setIsDeleteModalOpen(true);
  };

  const handleViewChatbot = (id) => {
    navigate(`/dashboard/chatbot/${id}/overview`);
  };

  return (
    <div className="flex-grow bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary-dark transition"
        >
          Create Chatbot
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div key={chatbot.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{chatbot.name}</h3>
              <p className="text-gray-600 mb-4">{chatbot.description}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleViewChatbot(chatbot.data_widget_id)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
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
                  onClick={() => openDeleteModal(chatbot)}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create New Chatbot</h2>
            <form onSubmit={handleCreateChatbot}>
              <input
                type="text"
                placeholder="Chatbot Name"
                value={newChatbotName}
                onChange={(e) => setNewChatbotName(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Chatbot Description"
                value={newChatbotDescription}
                onChange={(e) => setNewChatbotDescription(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for renaming a chatbot */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Rename Chatbot</h2>
            <form onSubmit={handleRenameChatbot}>
              <input
                type="text"
                placeholder="Chatbot Name"
                value={newChatbotName}
                onChange={(e) => setNewChatbotName(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <textarea
                placeholder="Chatbot Description"
                value={newChatbotDescription}
                onChange={(e) => setNewChatbotDescription(e.target.value)}
                className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                >
                  Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for confirming deletion */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete the chatbot <strong>{chatbotToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteChatbot}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
