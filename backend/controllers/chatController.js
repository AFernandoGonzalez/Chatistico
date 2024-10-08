const DOMPurify = require('dompurify')(new (require('jsdom')).JSDOM().window);
const NodeCache = require('node-cache');
const { getAIResponse } = require('../services/openaiService');
const supabase = require('../config/db');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });
const moment = require('moment-timezone');

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
        id, chatbot_id, important, closed,
        messages (*)
      `)
      .eq('chatbot_id', chatbot.id)
      .eq('session_user_id', sessionUserId);

    if (chatError) {
      return res.status(500).json({ error: chatError.message });
    }

    const INACTIVITY_THRESHOLD_MINUTES = 20;
    let sendInactivityGreeting = false;

    if (chats.length > 0) {
      const lastMessage = chats[0].messages[chats[0].messages.length - 1];
      if (!lastMessage) {
        sendInactivityGreeting = true;
      } else {
        const lastInteractionUTC = moment.utc(lastMessage.timestamp);
        const currentTimeUTC = moment.utc();

        const timeDifference = currentTimeUTC.diff(lastInteractionUTC, 'minutes');

        if (timeDifference > INACTIVITY_THRESHOLD_MINUTES && lastMessage.text !== "It's been a while! How can I assist you today?") {
          sendInactivityGreeting = true;
        }
      }

      if (sendInactivityGreeting) {
        const greetingMessage = "It's been a while! How can I assist you today?";

        const { data: greeting, error: greetingError } = await supabase
          .from('messages')
          .insert([{ chat_id: chats[0].id, text: greetingMessage, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
          .select('*')
          .single();

        if (greetingError) {
          return res.status(500).json({ error: 'Failed to send greeting message.' });
        }

        chats[0].messages.push(greeting);
      }
    }

    res.status(200).json({ chats });
  } catch (error) {
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

const tokenize = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  return text.toLowerCase().split(/\W+/);
};

const calculateSimilarity = (inputTokens, questionTokens) => {
  const commonWords = inputTokens.filter(token => questionTokens.includes(token));
  return commonWords.length / Math.max(inputTokens.length, questionTokens.length);
};

const searchQAPairs = async (text, chatbotId) => {
  const { data, error } = await supabase
    .from('qa_pairs')
    .select('id, question, answer')
    .eq('chatbot_id', chatbotId)
    .eq('type', 'faq')
    .not('question', 'is', null);

  if (error || !data.length) {
    return { matchFound: false, message: 'No relevant data found.' };
  }

  const inputTokens = tokenize(text);
  let bestMatch = null;
  let bestSimilarity = 0;

  data.forEach(pair => {
    const questionTokens = tokenize(pair.question);
    const similarity = calculateSimilarity(inputTokens, questionTokens);

    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = pair;
    }
  });

  if (bestMatch && bestSimilarity > 0.49) {
    return { matchFound: true, bestMatch };
  } else {
    return { matchFound: false, message: 'No relevant data found.' };
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, text, role_id, sessionUserId } = req.body;

  if (!chatId || !text || !role_id || !sessionUserId) {
    return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
  }

  const sanitizedText = DOMPurify.sanitize(text);

  if (sanitizedText.length < 1 || sanitizedText.length > 150) {
    return res.status(400).json({ error: 'Message must be between 1 and 150 characters long.' });
  }


  try {
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('id, chatbot_id')
      .eq('id', chatId)
      .single();

    if (chatError || !chatData) {
      return res.status(400).json({ error: 'Invalid chat ID.' });
    }

    const chatbotId = chatData.chatbot_id;
    const cacheKey = `${chatbotId}_${text}`;
    if (cache.has(cacheKey)) {
      const cachedResponse = cache.get(cacheKey);

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, text: cachedResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
        .select('*')
        .single();

      if (aiMessageError) {
        console.error('Error inserting cached AI message:', aiMessageError);
        return res.status(500).json({ error: 'Failed to save cached AI response.' });
      }

      return res.status(201).json({ userMessage: text, aiMessage: aiMessageData });
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

    const searchResult = await searchQAPairs(text, chatbotId);

    if (searchResult.matchFound) {
      const { question, answer } = searchResult.bestMatch;

      let enhancedResponse = answer;

      if (question !== text) {
        enhancedResponse = await getAIResponse(text, question, answer);
      }
      cache.set(cacheKey, enhancedResponse);

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, text: enhancedResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
        .select('*')
        .single();

      if (aiMessageError) {
        console.error('Error inserting AI message:', aiMessageError);
        return res.status(500).json({ error: 'Failed to save AI response.' });
      }

      return res.status(201).json({ userMessage, aiMessage: aiMessageData });
    } else {
      const fallbackMessage = "I'm sorry, I don't have information on that. Could you clarify or try asking another question?";

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, text: fallbackMessage, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
        .select('*')
        .single();

      if (aiMessageError) {
        console.error('Error inserting fallback message:', aiMessageError);
        return res.status(500).json({ error: 'Failed to save fallback message.' });
      }

      return res.status(201).json({ userMessage, aiMessage: aiMessageData });
    }
  } catch (error) {
    console.error('Failed to process message:', error);
    return res.status(500).json({ error: 'Failed to process message.' });
  }
};
