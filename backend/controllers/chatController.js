const supabase = require('../config/db');

// Updated getChatHistory controller
exports.getChatHistory = async (req, res) => {
  try {
    const { userId, chatbotId } = req.query;

    if (!userId || !chatbotId) {
      return res.status(400).json({ error: 'User ID and Chatbot ID are required' });
    }

    // Fetch all chats associated with the user and chatbot
    let chatQuery = supabase
      .from('chats')
      .select(`
        id, last_timestamp, chatbot_version, customer_id, important, closed,
        messages (*)
      `)
      .eq('user_id', userId)
      .eq('chatbot_id', chatbotId);

    const { data: chats, error } = await chatQuery;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};




// Send a message and add it to the chat history
exports.sendMessage = async (req, res) => {
  const { chatId, text, role_id } = req.body;

  if (!chatId || !text || !role_id) {
    return res.status(400).json({ error: 'Chat ID, text, and role ID are required.' });
  }

  try {
    // Insert a new message into the messages table
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text, role_id, timestamp: new Date().toISOString() }])
      .single();

    if (messageError) throw messageError;

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
