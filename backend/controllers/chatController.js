const supabase = require('../config/db');
const { getAIResponse } = require('../services/openaiService');
const natural = require('natural');  // Dependency for basic NLP
const tokenizer = new natural.WordTokenizer();
const stringSimilarity = require('string-similarity');

// Initialize a classifier to detect intents
const classifier = new natural.BayesClassifier();
classifier.addDocument('hi', 'greeting');
classifier.addDocument('hello', 'greeting');
classifier.addDocument('hey', 'greeting');
classifier.addDocument('help me', 'help');
classifier.addDocument('i need assistance', 'help');
classifier.addDocument('faq', 'faq');
classifier.addDocument('support', 'support');
classifier.addDocument('document', 'document');
classifier.train();

// Function to check if the user's question is related to available knowledge
function isQuestionRelated(userQuery, keywords) {
  const tokens = tokenizer.tokenize(userQuery.toLowerCase());
  return keywords.some((keyword) => tokens.includes(keyword));
}

// Function to classify user intent
function getIntent(userQuery) {
  return classifier.classify(userQuery);
}
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
    // Check if chat exists
    const { data: chatExists, error: chatError } = await supabase
      .from('chats')
      .select('id, chatbot_id')
      .eq('id', chatId)
      .single();

    if (chatError || !chatExists) {
      return res.status(400).json({ error: 'Invalid chat ID.' });
    }

    // Insert the user's message
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (userMessageError) {
      console.error('Error inserting user message:', userMessageError);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    // Fetch Q&A pairs from knowledge base related to the chatbot
    const { data: knowledge, error: knowledgeError } = await supabase
      .from('qa_pairs')
      .select('question, answer')
      .eq('chatbot_id', chatExists.chatbot_id);

    if (knowledgeError) {
      console.error('Error fetching knowledge:', knowledgeError);
      return res.status(500).json({ error: 'Failed to fetch knowledge.' });
    }

    // Process the user's question and find the best matching Q&A pair
    let bestMatch = '';
    let highestSimilarity = 0;

    knowledge.forEach((qaPair) => {
      // Ensure question and answer exist
      if (qaPair.question && qaPair.answer) {
        const similarity = stringSimilarity.compareTwoStrings(text.toLowerCase(), qaPair.question.toLowerCase());
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = qaPair.answer;
        }
      }
    });

    // If a match with a high enough similarity is found, use it
    if (highestSimilarity > 0.6) {  // You can adjust this threshold for better matching
      // Insert the AI's response (answer from the knowledge base) into the database
      const { data: aiMessage, error: aiMessageError } = await supabase
        .from('messages')
        .insert([{ chat_id: chatId, text: bestMatch, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
        .select('*')
        .single();

      if (aiMessageError) {
        console.error('Error inserting AI message:', aiMessageError);
        return res.status(500).json({ error: 'Failed to save AI response.' });
      }

      return res.status(201).json({ userMessage, aiMessage });
    }

    // If no relevant answer is found, fallback to a default response
    const fallbackResponse = "Sorry, I don't have the information you're looking for.";

    // Insert the fallback response into the database
    const { data: fallbackMessage, error: fallbackMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text: fallbackResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (fallbackMessageError) {
      console.error('Error inserting fallback message:', fallbackMessageError);
      return res.status(500).json({ error: 'Failed to save fallback response.' });
    }

    res.status(201).json({ userMessage, fallbackMessage });
  } catch (error) {
    console.error('Failed to process message:', error);
    res.status(500).json({ error: 'Failed to process message.' });
  }
};


// exports.sendMessage = async (req, res) => {
//   const { chatId, text, role_id, sessionUserId } = req.body;

//   if (!chatId || !text || !role_id || !sessionUserId) {
//     return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
//   }

//   try {
//     // Check if chat exists and fetch chatbot_id
//     const { data: chatExists, error: chatError } = await supabase
//       .from('chats')
//       .select('id, chatbot_id')  // Also select chatbot_id here
//       .eq('id', chatId)
//       .single();

//     if (chatError || !chatExists) {
//       return res.status(400).json({ error: 'Invalid chat ID.' });
//     }

//     // Insert the user's message
//     const { data: userMessage, error: userMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (userMessageError) {
//       console.error('Error inserting user message:', userMessageError);
//       return res.status(500).json({ error: 'Failed to send message.' });
//     }

//     // Fetch knowledge related to the chatbot (FAQs, documents, etc.)
//     const { data: knowledge, error: knowledgeError } = await supabase
//       .from('qa_pairs')
//       .select('type, question, answer, html, url, filename_original')
//       .eq('chatbot_id', chatExists.chatbot_id);  // Use chatbot_id fetched earlier

//     if (knowledgeError) {
//       console.error('Error fetching knowledge:', knowledgeError);
//       return res.status(500).json({ error: 'Failed to fetch knowledge.' });
//     }

//     // Create a context for OpenAI by compiling the relevant knowledge
//     let knowledgeContext = '';
//     knowledge.forEach((item) => {
//       if (item.type === 'faq') {
//         knowledgeContext += `Q: ${item.question}\nA: ${item.answer}\n\n`;
//       } else if (item.type === 'text') {
//         knowledgeContext += `${item.html}\n\n`;
//       } else if (item.type === 'document') {
//         knowledgeContext += `${item.filename_original}\n\n`;  // You may need to extract content from documents.
//       }
//     });

//     // Send the user's message and the compiled knowledge to OpenAI
//     const aiResponse = await getAIResponse(text, knowledgeContext);

//     // Insert the AI's response into the database
//     const { data: aiMessage, error: aiMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text: aiResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (aiMessageError) {
//       console.error('Error inserting AI message:', aiMessageError);
//       return res.status(500).json({ error: 'Failed to save AI response.' });
//     }

//     res.status(201).json({ userMessage, aiMessage });
//   } catch (error) {
//     console.error('Failed to process message:', error);
//     res.status(500).json({ error: 'Failed to process message.' });
//   }
// };


// exports.sendMessage = async (req, res) => {
//   const { chatId, text, role_id, sessionUserId } = req.body;

//   if (!chatId || !text || !role_id || !sessionUserId) {
//     return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
//   }

//   try {
//     const { data: chatExists, error: chatError } = await supabase
//       .from('chats')
//       .select('id')
//       .eq('id', chatId)
//       .single();

//     if (chatError || !chatExists) {
//       return res.status(400).json({ error: 'Invalid chat ID.' });
//     }

//     const { data: userMessage, error: userMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (userMessageError) {
//       console.error('Error inserting user message:', userMessageError);
//       return res.status(500).json({ error: 'Failed to send message.' });
//     }

//     const aiResponse = await getAIResponse(text);

//     const { data: aiMessage, error: aiMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text: aiResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (aiMessageError) {
//       console.error('Error inserting AI message:', aiMessageError);
//       return res.status(500).json({ error: 'Failed to save AI response.' });
//     }

//     res.status(201).json({ userMessage, aiMessage });
//   } catch (error) {
//     console.error('Failed to process message:', error);
//     res.status(500).json({ error: 'Failed to process message.' });
//   }
// };
