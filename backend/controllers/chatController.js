const NodeCache = require('node-cache');
const { getAIResponse } = require('../services/openaiService');
const supabase = require('../config/db');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

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

// const tokenize = (text) => {
//   if (!text || typeof text !== 'string') {
//     console.log("Invalid input for tokenize:", text);
//     return [];
//   }
//   return text.toLowerCase().split(/\W+/);
// };

// const calculateSimilarity = (inputTokens, questionTokens) => {
//   const commonWords = inputTokens.filter(token => questionTokens.includes(token));
//   return commonWords.length / Math.max(inputTokens.length, questionTokens.length);
// };

// const searchQAPairs = async (text, chatbotId) => {
//   console.log("searchQAPairs text", text);
//   console.log("searchQAPairs chatbotId", chatbotId);

//   const { data, error } = await supabase
//     .from('qa_pairs')
//     .select('id, question, answer')
//     .eq('chatbot_id', chatbotId)
//     .eq('type', 'faq')
//     .not('question', 'is', null);

//   if (error || !data.length) {
//     console.log("No data found in qa_pairs.");
//     return { matchFound: false, message: 'No relevant data found.' };
//   }

//   const inputTokens = tokenize(text);
//   let bestMatch = null;
//   let bestSimilarity = 0;

//   data.forEach(pair => {
//     const questionTokens = tokenize(pair.question);
//     const similarity = calculateSimilarity(inputTokens, questionTokens);

//     if (similarity > bestSimilarity) {
//       bestSimilarity = similarity;
//       bestMatch = pair;
//     }
//   });

//   if (bestMatch && bestSimilarity > 0.49) {
//     console.log("Best match found:", bestMatch, "with similarity:", bestSimilarity);
//     return { matchFound: true, bestMatch };
//   } else {
//     console.log(`No match found with similarity threshold. match ${bestSimilarity}`);
//     return { matchFound: false, message: 'I couldn\'t find an exact match for your query. Could you try rephrasing or ask something else?' };
//   }
// };

// exports.sendMessage = async (req, res) => {
//   const { chatId, text, role_id, sessionUserId } = req.body;

//   console.log("sendMessage chatId", chatId);

//   if (!chatId || !text || !role_id || !sessionUserId) {
//     return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
//   }

//   try {
//     // Retrieve the chatbot_id from the chats table using chatId
//     const { data: chatData, error: chatError } = await supabase
//       .from('chats')
//       .select('id, chatbot_id')
//       .eq('id', chatId)
//       .single();

//     if (chatError || !chatData) {
//       return res.status(400).json({ error: 'Invalid chat ID.' });
//     }

//     const chatbotId = chatData.chatbot_id;
//     const cacheKey = `${chatbotId}_${text}`;  // Unique key for caching based on chatbotId and question

//     // **Save the user's original question first, before looking for an answer**
//     const { data: userMessage, error: userMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (userMessageError) {
//       console.error('Error inserting user message:', userMessageError);
//       return res.status(500).json({ error: 'Failed to send message.' });
//     }

//     // Check if the response is cached
//     if (cache.has(cacheKey)) {
//       console.log(`Using cached response for chatId: ${chatId}`);
//       const cachedResponse = cache.get(cacheKey);

//       // Save the cached response (associated with the user's original question)
//       const { data: aiMessageData, error: aiMessageError } = await supabase
//         .from('messages')
//         .insert([{ chat_id: chatId, text: cachedResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//         .select('*')
//         .single();

//       if (aiMessageError) {
//         console.error('Error inserting cached AI message:', aiMessageError);
//         return res.status(500).json({ error: 'Failed to save cached AI response.' });
//       }

//       return res.status(201).json({ userMessage, aiMessage: aiMessageData });
//     }

//     // Search for relevant data in qa_pairs
//     const searchResult = await searchQAPairs(text, chatbotId);

//     if (searchResult.matchFound) {
//       const { question, answer } = searchResult.bestMatch;

//       // Pass the user's query, the matched question, and the matched answer to the AI
//       const enhancedResponse = await getAIResponse(text, question, answer);

//       // Cache the AI response
//       cache.set(cacheKey, enhancedResponse);
//       console.log(`Cached response for chatbotId: ${chatbotId}, question: "${text}"`);

//       // Save the enhanced AI response (associated with the user's original question)
//       const { data: aiMessageData, error: aiMessageError } = await supabase
//         .from('messages')
//         .insert([{ chat_id: chatId, text: enhancedResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//         .select('*')
//         .single();

//       if (aiMessageError) {
//         console.error('Error inserting AI message:', aiMessageError);
//         return res.status(500).json({ error: 'Failed to save AI response.' });
//       }

//       return res.status(201).json({ userMessage, aiMessage: aiMessageData });
//     } else {
//       // Handle fallback when no relevant data is found
//       const fallbackMessage = "I couldn't find an exact match for your query. Could you try rephrasing or ask something else?";

//       // Save the fallback response (associated with the user's original question)
//       const { data: aiMessageData, error: aiMessageError } = await supabase
//         .from('messages')
//         .insert([{ chat_id: chatId, text: fallbackMessage, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//         .select('*')
//         .single();

//       if (aiMessageError) {
//         console.error('Error inserting fallback message:', aiMessageError);
//         return res.status(500).json({ error: 'Failed to save fallback message.' });
//       }

//       return res.status(201).json({ userMessage, aiMessage: aiMessageData });
//     }
//   } catch (error) {
//     console.error('Failed to process message:', error);
//     return res.status(500).json({ error: 'Failed to process message.' });
//   }
// };



const tokenize = (text) => {
  if (!text || typeof text !== 'string') {
    console.log("Invalid input for tokenize:", text);
    return [];
  }
  return text.toLowerCase().split(/\W+/);
};

const calculateSimilarity = (inputTokens, questionTokens) => {
  const commonWords = inputTokens.filter(token => questionTokens.includes(token));
  return commonWords.length / Math.max(inputTokens.length, questionTokens.length);
};

const searchQAPairs = async (text, chatbotId) => {
  console.log("searchQAPairs text", text);
  console.log("searchQAPairs chatbotId", chatbotId);

  // Search for FAQ-type questions in the database
  const { data, error } = await supabase
    .from('qa_pairs')
    .select('id, question, answer')  // Select both question and answer
    .eq('chatbot_id', chatbotId)
    .eq('type', 'faq')
    .not('question', 'is', null);  // Ensure question is not null

  if (error || !data.length) {
    console.log("No data found in qa_pairs.");
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
      bestMatch = pair;  // Store the best match (both question and answer)
    }
  });

  if (bestMatch && bestSimilarity > 0.49) {
    console.log("Best match found:", bestMatch, "with similarity:", bestSimilarity);
    return { matchFound: true, bestMatch };  // Return both question and answer
  } else {
    console.log("No match found with similarity threshold.");
    return { matchFound: false, message: 'No relevant data found.' };
  }
};

exports.sendMessage = async (req, res) => {
  const { chatId, text, role_id, sessionUserId } = req.body;

  console.log("sendMessage chatId", chatId);

  if (!chatId || !text || !role_id || !sessionUserId) {
    return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
  }

  try {
    // Retrieve the chatbot_id from the chats table using chatId
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select('id, chatbot_id')
      .eq('id', chatId)
      .single();

    if (chatError || !chatData) {
      return res.status(400).json({ error: 'Invalid chat ID.' });
    }

    const chatbotId = chatData.chatbot_id;
    const cacheKey = `${chatbotId}_${text}`;  // Unique key for caching based on chatbotId and question

    // Check if the response is cached
    if (cache.has(cacheKey)) {
      console.log(`Using cached response for chatId: ${chatId}`);
      const cachedResponse = cache.get(cacheKey);
      
      // Save the cached response
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

    // Save the user's message first
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (userMessageError) {
      console.error('Error inserting user message:', userMessageError);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    // Search for relevant data in qa_pairs
    const searchResult = await searchQAPairs(text, chatbotId);

    if (searchResult.matchFound) {
      const { question, answer } = searchResult.bestMatch;

      // Check if the answer is already good, else pass it to AI
      let enhancedResponse = answer;
      
      if (question !== text) {
        enhancedResponse = await getAIResponse(text, question, answer);
      }

      // Cache the AI response
      cache.set(cacheKey, enhancedResponse);
      console.log(`Cached response for chatbotId: ${chatbotId}, question: "${text}"`);

      // Save the enhanced AI response
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
      // Handle fallback when no relevant data is found
      const fallbackMessage = "I'm sorry, I don't have information on that. Could you clarify or try asking another question?";

      // Save the fallback response
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
