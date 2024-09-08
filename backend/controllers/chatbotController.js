const supabase = require('../config/db');

const getChatbots = async (req, res) => {
  const { uid } = req.user; // Assuming you are using the authenticate middleware to populate req.user with firebase_uid

  if (!uid) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // First, get the user_id from the users table based on the firebase_uid
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single(); // Get the user_id based on the firebase_uid

    if (userError || !user) {
      throw new Error('User not found.');
    }

    // Now, get the chatbots for this user_id
    const { data: chatbots, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.id); // Use the user_id to fetch the chatbots

    if (chatbotError) {
      throw chatbotError;
    }

    // Return an empty array if no chatbots are found
    if (!chatbots || chatbots.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(chatbots);
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    res.status(500).json({ message: 'Failed to retrieve chatbots' });
  }
};

const createChatbot = async (req, res) => {
  const { uid } = req.user; // Get firebase_uid from the authenticated user
  const { name, description } = req.body;

  if (!uid || !name || !description) {
    return res.status(400).json({ message: 'User ID, Name, and Description are required.' });
  }

  try {
    // Fetch the user_id from firebase_uid
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create the chatbot
    const { data: newChatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .insert([{ user_id: user.id, name, description }])
      .select('*')
      .single();

    if (chatbotError) {
      return res.status(500).json({ message: 'Error creating chatbot' });
    }

    // Insert default configuration for the chatbot
    const { error: configError } = await supabase
      .from('chatbot_configurations')
      .insert([{ chatbot_id: newChatbot.id }]);

    if (configError) {
      return res.status(500).json({ message: 'Error creating chatbot configuration' });
    }

    res.status(201).json(newChatbot);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create chatbot' });
  }
};

module.exports = {
  createChatbot
};


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
