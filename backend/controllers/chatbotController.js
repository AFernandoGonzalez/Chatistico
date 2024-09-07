const supabase = require('../config/db');

// Get all chatbots
const getChatbots = async (req, res) => {
  const { userId } = req.query;

  console.log("userId: ", userId);
  

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', userId);

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
// Create a new chatbot and default configuration
const createChatbot = async (req, res) => {
  const { userId, name, description } = req.body;

  if (!userId || !name || !description) {
    return res.status(400).json({ message: 'User ID, Name, and Description are required.' });
  }

  try {
    // Begin a transaction
    const { data: newChatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .insert([{ user_id: userId, name, description }])
      .select('*')
      .single(); // Use single() to get a single object instead of an array

    if (chatbotError) {
      throw chatbotError;
    }

    // Insert default configuration
    const defaultConfig = {
      chatbot_id: newChatbot.id,
      primary_color: '#000000',
      text_color: '#ffffff',
      icon_color: '#000000',
      chat_width: 350,
      widget_position: 'br',
      horizontal_spacing: 0,
      vertical_spacing: 0,
      bot_icon_circular: false,
      chat_icon_circular: false,
      chat_icon_size: 55,
      bot_icon_image: null,
      chat_icon_image: null,
      chatbot_name: name || 'Support Bot',
    };

    const { error: configError } = await supabase
      .from('chatbot_configurations')
      .insert([defaultConfig]);

    if (configError) {
      throw configError;
    }

    res.status(201).json(newChatbot);
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




module.exports = {
  getChatbots, createChatbot, getChatbotById, deleteChatbot,
  renameChatbot
};
