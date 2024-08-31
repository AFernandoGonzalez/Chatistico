const supabase = require('../config/db');

// Get all chatbots
const getChatbots = async (req, res) => {
  try {
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*');

    if (error) {
      throw error;
    }

    res.status(200).json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ message: 'Failed to retrieve chatbots' });
  }
};

// Create a new chatbot
const createChatbot = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const { data: newChatbot, error } = await supabase
      .from('chatbots')
      .insert([{ name, description }])
      .select('*'); // Ensure the new chatbot data is returned

    if (error) {
      throw error;
    }

    if (!newChatbot || newChatbot.length === 0) {
      return res.status(400).json({ message: 'Failed to create chatbot. No data returned.' });
    }

    res.status(201).json(newChatbot[0]);
  } catch (error) {
    console.error('Error creating chatbot:', error);
    res.status(500).json({ message: 'Failed to create chatbot' });
  }
};

// Get a chatbot by ID
const getChatbotById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    res.status(200).json(chatbot);
  } catch (error) {
    console.error('Error fetching chatbot:', error);
    res.status(500).json({ message: 'Failed to retrieve chatbot' });
  }
};

// Delete a chatbot
const deleteChatbot = async (req, res) => {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Chatbot deleted successfully' });
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      res.status(500).json({ message: 'Failed to delete chatbot' });
    }
  };
  
  // Rename a chatbot
const renameChatbot = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
  
    try {
      const { error } = await supabase
        .from('chatbots')
        .update({ name, description })
        .eq('id', id);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Chatbot renamed successfully' });
    } catch (error) {
      console.error('Error renaming chatbot:', error);
      res.status(500).json({ message: 'Failed to rename chatbot' });
    }
  };

module.exports = { getChatbots, createChatbot, getChatbotById, deleteChatbot,
    renameChatbot };
