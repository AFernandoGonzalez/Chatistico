const supabase = require('../config/db');
const { getAIResponse } = require('../services/openaiService');

exports.getAllChatsByChatbot = async (req, res) => {
  try {
    const { chatbotId } = req.query;

    if (!chatbotId) {
      return res.status(400).json({ error: 'Chatbot ID is required.' });
    }

    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('data_widget_id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(400).json({ error: 'Chatbot not found.' });
    }

    const { data: chats, error: chatError } = await supabase
      .from('chats')
      .select(`
        id, last_timestamp, chatbot_version, customer_id, important, closed,
        messages (*)
      `)
      .eq('chatbot_id', chatbot.id);

    if (chatError) {
      return res.status(500).json({ error: 'Failed to fetch chats.' });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Failed to fetch chats for chatbot:', error);
    res.status(500).json({ error: 'Failed to fetch chats for chatbot.' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { chatbotId, sessionUserId } = req.query;

    if (!chatbotId || !sessionUserId) {
      return res.status(400).json({ error: 'Chatbot ID and Session User ID are required.' });
    }

    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('data_widget_id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(400).json({ error: 'Chatbot not found' });
    }

    const { data: chats, error: chatError } = await supabase
      .from('chats')
      .select(`
        id, last_timestamp, chatbot_version, customer_id, important, closed,
        messages (*)
      `)
      .eq('chatbot_id', chatbot.id)
      .eq('session_user_id', sessionUserId);

    if (chatError) {
      return res.status(500).json({ error: chatError.message });
    }

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

exports.newMessage = async (req, res) => {
  const { chatbotId, sessionUserId } = req.body;

  if (!chatbotId || !sessionUserId) {
    return res.status(400).json({ error: 'Chatbot ID and Session User ID are required.' });
  }

  try {
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('data_widget_id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(400).json({ error: 'Chatbot not found' });
    }

    const { data: newChat, error: newChatError } = await supabase
      .from('chats')
      .insert([{ chatbot_id: chatbot.id, session_user_id: sessionUserId, last_timestamp: new Date().toISOString() }])
      .select('id')
      .single();

    if (newChatError) {
      console.error('Error creating new chat:', newChatError);
      return res.status(500).json({ error: 'Failed to create new chat.' });
    }

    res.status(201).json({ chatId: newChat.id });
  } catch (error) {
    console.error('Failed to create new chat:', error);
    res.status(500).json({ error: 'Failed to create new chat.' });
  }
};


exports.sendMessage = async (req, res) => {
  const { chatId, text, role_id, sessionUserId } = req.body;

  if (!chatId || !text || !role_id || !sessionUserId) {
    return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
  }

  try {
    const { data: chatExists, error: chatError } = await supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .single();

    if (chatError || !chatExists) {
      return res.status(400).json({ error: 'Invalid chat ID.' });
    }

    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (userMessageError) {
      console.error('Error inserting user message:', userMessageError);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    const aiResponse = await getAIResponse(text);

    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text: aiResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (aiMessageError) {
      console.error('Error inserting AI message:', aiMessageError);
      return res.status(500).json({ error: 'Failed to save AI response.' });
    }

    res.status(201).json({ userMessage, aiMessage });
  } catch (error) {
    console.error('Failed to process message:', error);
    res.status(500).json({ error: 'Failed to process message.' });
  }
};
