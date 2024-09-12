import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatbotContext } from '../context/ChatbotContext';
import { createChatbot, deleteChatbot, renameChatbot } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Loading = ({ message = "Processing..." }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
        <p className="text-gray-700 text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">{title}</h2>

        <form onSubmit={onSubmit}>
          {children}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"

            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"

            >
              Submit
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

const Dashboard = () => {
  const { chatbots, setChatbots } = useContext(ChatbotContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newChatbotName, setNewChatbotName] = useState('');
  const [newChatbotDescription, setNewChatbotDescription] = useState('');
  const [selectedChatbot, setSelectedChatbot] = useState(null);

  const handleCreateChatbot = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true); 
      const newChatbot = await createChatbot(user.uid, newChatbotName, newChatbotDescription);
      setChatbots([...chatbots, newChatbot]);
      toast.success('Chatbot created successfully!');
    } catch (error) {
      toast.error('Failed to create chatbot.');
    } finally {
      setLoading(false); 
      setIsModalOpen(false);
    }
  };

  const handleRenameChatbot = async (e) => {
    e.preventDefault();
    if (!newChatbotName || !newChatbotDescription) {
      toast.error('Name and description are required.');
      return;
    }
    try {
      setLoading(true); 
      await renameChatbot(selectedChatbot.id, newChatbotName, newChatbotDescription);
      setChatbots(chatbots.map(chatbot => chatbot.id === selectedChatbot.id ? { ...chatbot, name: newChatbotName, description: newChatbotDescription } : chatbot));
      toast.success('Chatbot renamed successfully!');
    } catch (error) {
      toast.error('Failed to rename chatbot.');
    } finally {
      setLoading(false);  
      setIsModalOpen(false); 
    }
  };

  const handleDeleteChatbot = async () => {
    if (!selectedChatbot) return;
    try {
      setLoading(true); 
      await deleteChatbot(selectedChatbot.id);
      setChatbots(chatbots.filter((chatbot) => chatbot.id !== selectedChatbot.id));
      toast.success('Chatbot deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete chatbot.');
    } finally {
      setLoading(false); 
      setIsModalOpen(false);
    }
  };


  const openModal = (type, chatbot = null) => {
    setModalType(type);
    setSelectedChatbot(chatbot);
    setNewChatbotName(chatbot?.name || '');
    setNewChatbotDescription(chatbot?.description || '');
    setIsModalOpen(true);
  };

  const handleViewChatbot = (id) => {
    navigate(`/dashboard/chatbot/${id}/overview`);
  };

  return (
    <div className="flex-grow bg-gray-100 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-xl md:text-xl font-bold text-primary">My Chatbots</h1>
        <button
          onClick={() => openModal('create')}
          className="px-4 md:px-6 py-2 md:py-3 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary-dark transition"
        >
          <span className="hidden sm:inline">Create Chatbot</span>
          <span className="sm:hidden"><i className="fa fa-plus" /></span>
        </button>
      </div>

      {loading ? (
        <Loading message="Loading Chatbots..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              className="h-[250px] bg-white p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-bold text-gray-800">{chatbot.name}</h3>
                <p className="text-gray-600 mt-4">{chatbot.description}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => handleViewChatbot(chatbot.data_widget_id)}
                  className="px-2 py-2 bg-blue-200 text-blue-600 rounded-full text-xs"
                >
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal('rename', chatbot)}
                    className="p-2 "
                  >
                    <i className="fa fa-pen text-yellow-500 hover:text-yellow-800 transition" />
                  </button>
                  <button
                    onClick={() => openModal('delete', chatbot)}
                    className="p-2"
                  >
                    <i className="fa fa-trash text-red-500 rounded-md hover:text-red-800 transition" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'create' ? 'Create New Chatbot' : modalType === 'rename' ? 'Rename Chatbot' : 'Delete Chatbot'}
        onSubmit={modalType === 'create' ? handleCreateChatbot : modalType === 'rename' ? handleRenameChatbot : handleDeleteChatbot}
        loading={loading}
      >
        {modalType !== 'delete' ? (
          <>
            <input
              type="text"
              placeholder="Chatbot Name"
              value={newChatbotName}
              onChange={(e) => setNewChatbotName(e.target.value)}
              className="w-full p-3 md:p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
              maxLength={25}
            />
            <textarea
              placeholder="Chatbot Description"
              value={newChatbotDescription}
              onChange={(e) => setNewChatbotDescription(e.target.value)}
              className="w-full p-3 md:p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
              maxLength={100}
            />
          </>
        ) : (
          <p>Are you sure you want to delete the chatbot <strong>{selectedChatbot?.name}</strong>? This action cannot be undone.</p>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;

