const supabase = require('../config/db');
const { getAIResponse } = require('../services/openaiService');

// Updated getChatHistory controller
exports.getChatHistory = async (req, res) => {
  try {
    const { chatbotId, sessionUserId } = req.query;

    if (!chatbotId) {
      return res.status(400).json({ error: 'Chatbot ID is required' });
    }

    // Fetch all chats associated with the user and chatbot
    let chatQuery = supabase
      .from('chats')
      .select(`
        id, last_timestamp, chatbot_version, customer_id, important, closed,
        messages (*)
      `)
      .eq('chatbot_id', chatbotId) 
      .eq('session_user_id', sessionUserId); 

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

exports.sendMessage = async (req, res) => {
  const { chatId, text, role_id, sessionUserId } = req.body;
  
  console.log("sendMessage sessionUserId", sessionUserId);
  
  if (!chatId || !text || !role_id || !sessionUserId) {
    return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
  }

  try {
    // Check if the chatId exists in the chats table
    const { data: chatExists, error: chatError } = await supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .single();

    if (chatError || !chatExists) {
      return res.status(400).json({ error: 'Invalid chat ID.' });
    }

    // Insert the user message into the messages table
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (userMessageError) {
      console.error('Error inserting user message:', userMessageError);
      return res.status(500).json({ error: 'Failed to send message.' });
    }

    // Generate a random AI response
    const aiResponse = await getAIResponse(text);

    // Insert the AI response into the messages table
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, text: aiResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
      .select('*')
      .single();

    if (aiMessageError) {
      console.error('Error inserting AI message:', aiMessageError);
      return res.status(500).json({ error: 'Failed to save AI response.' });
    }

    // Respond with the AI message
    res.status(201).json({ userMessage, aiMessage });
  } catch (error) {
    console.error('Failed to process message:', error);
    res.status(500).json({ error: 'Failed to process message.' });
  }
};

exports.newMessage = async (req, res) => {
  const { chatbotId, sessionUserId } = req.body;
  
  if (!chatbotId || !sessionUserId) {
      return res.status(400).json({ error: 'Chatbot ID and Session User ID are required.' });
  }

  try {
      // Insert a new chat into the chats table
      const { data: newChat, error: newChatError } = await supabase
          .from('chats')
          .insert([{ chatbot_id: chatbotId, session_user_id: sessionUserId, last_timestamp: new Date().toISOString() }])
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

// const supabase = require('../config/db');
// const { getAIResponse } = require('../services/openaiService');

// // Updated getChatHistory controller
// exports.getChatHistory = async (req, res) => {
//   try {
//     // const { userId, chatbotId } = req.query;
//     const { chatbotId, sessionUserId } = req.query;

//     // console.log("sessionUserId: ",sessionUserId);
    
//     // console.log("userId: ", userId);
//     // console.log("chatbotId: ", chatbotId);

//     if (!chatbotId) {
//       return res.status(400).json({ error: 'Chatbot ID are required' });
//     }

//     // Fetch all chats associated with the user and chatbot
//     let chatQuery = supabase
//       .from('chats')
//       .select(`
//         id, last_timestamp, chatbot_version, customer_id, important, closed,
//         messages (*)
//       `)
//       // .eq('user_id', userId)
//       // .eq('id', chatbotId);
//       .eq('chatbot_id', chatbotId) // Use the correct column names
//       .eq('session_user_id', sessionUserId); // Ensure this correctly references the user s

//     const { data: chats, error } = await chatQuery;

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     res.status(200).json({ chats });
//   } catch (error) {
//     console.error('Failed to fetch chat history:', error);
//     res.status(500).json({ error: 'Failed to fetch chat history' });
//   }
// };



// exports.sendMessage = async (req, res) => {
//   const { chatId, text, role_id, sessionUserId} = req.body;
//   console.log("sendMessage sessionUserId", sessionUserId);
  

//   if (!chatId || !text || !role_id || !sessionUserId) {
//     return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
//   }

//   try {
//     // Check if the chatId exists in the chats table
//     const { data: chatExists, error: chatError } = await supabase
//       .from('chats')
//       .select('id')
//       .eq('id', chatId)
//       .single();

//     if (chatError || !chatExists) {
//       return res.status(400).json({ error: 'Invalid chat ID.' });
//     }

//     // Insert the user message into the messages table
//     const { data: userMessage, error: userMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text, role_id, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (userMessageError) {
//       console.error('Error inserting user message:', userMessageError);
//       return res.status(500).json({ error: 'Failed to send message.' });
//     }

//     // Generate a random AI response
//     const aiResponse = await getAIResponse(text);

//     // Insert the AI response into the messages table
//     const { data: aiMessage, error: aiMessageError } = await supabase
//       .from('messages')
//       .insert([{ chat_id: chatId, text: aiResponse, role_id: 1, session_user_id: sessionUserId, timestamp: new Date().toISOString() }])
//       .select('*')
//       .single();

//     if (aiMessageError) {
//       console.error('Error inserting AI message:', aiMessageError);
//       return res.status(500).json({ error: 'Failed to save AI response.' });
//     }

//     // Respond with the AI message
//     res.status(201).json({ userMessage, aiMessage });
//   } catch (error) {
//     console.error('Failed to process message:', error);
//     res.status(500).json({ error: 'Failed to process message.' });
//   }
// };


// exports.newMessage = async (req, res) => {
//   const { chatbotId, sessionUserId} = req.body;

//   // console.log("chatbotId, sessionUserId", chatbotId, sessionUserId);
  

//   if (!chatbotId || !sessionUserId) {
//       return res.status(400).json({ error: 'Chatbot ID and User ID are required.' });
//   }

//   try {
//       // Insert a new chat into the chats table
//       const { data: newChat, error: newChatError } = await supabase
//           .from('chats')
//           .insert([{ chatbot_id: chatbotId, session_user_id: sessionUserId, last_timestamp: new Date().toISOString() }])
//           .select('id')
//           .single();

//       if (newChatError) {
//           console.error('Error creating new chat:', newChatError);
//           return res.status(500).json({ error: 'Failed to create new chat.' });
//       }

//       res.status(201).json({ chatId: newChat.id });
//   } catch (error) {
//       console.error('Failed to create new chat:', error);
//       res.status(500).json({ error: 'Failed to create new chat.' });
//   }
// };


// // Send a message and add it to the chat history
// // exports.sendMessage = async (req, res) => {
// //   const { chatId, text, role_id } = req.body;

// //   console.log("Received data - chatId:", chatId, "text:", text, "role_id:", role_id);

// //   if (!chatId || !text || !role_id) {
// //     return res.status(400).json({ error: 'Chat ID, text, and role ID are required.' });
// //   }

// //   try {
// //     // Check if the chatId exists in the chats table
// //     const { data: chatExists, error: chatError } = await supabase
// //       .from('chats')
// //       .select('id')
// //       .eq('id', chatId)
// //       .single();

// //     if (chatError) {
// //       console.error('Error checking chat existence:', chatError);
// //       return res.status(500).json({ error: 'Error checking chat existence.' });
// //     }

// //     if (!chatExists) {
// //       console.error('Chat ID does not exist:', chatId);
// //       return res.status(400).json({ error: 'Invalid chat ID.' });
// //     }

// //     // Insert a new message into the messages table
// //     const { data: message, error: messageError } = await supabase
// //       .from('messages')
// //       .insert([{ chat_id: chatId, text, role_id, timestamp: new Date().toISOString() }])
// //       .select('*')  // Fetch the inserted row
// //       .single();

// //     if (messageError) {
// //       console.error('Error inserting message:', messageError);  // Log error details
// //       return res.status(500).json({ error: 'Failed to send message.' });
// //     }

// //     if (!message) {
// //       console.error('Message insertion returned null.');
// //       return res.status(500).json({ error: 'Failed to send message.' });
// //     }

// //     console.log('Message inserted successfully:', message);
// //     res.status(201).json({ message });
// //   } catch (error) {
// //     console.error('Failed to send message:', error);
// //     res.status(500).json({ error: 'Failed to send message.' });
// //   }
// // };
