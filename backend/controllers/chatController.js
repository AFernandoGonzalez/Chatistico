const supabase = require('../config/db');
const { saveChatLog } = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    // Retrieve the knowledge base for the user
    const { data: qaPairs, error } = await supabase.from('knowledge_base').select('*').eq('user_id', userId);

    if (error) throw error;

    // Find a matching answer based on the user's message
    const matchedQA = qaPairs.find(qa => qa.question.toLowerCase() === message.toLowerCase());

    let reply;
    if (matchedQA) {
      reply = matchedQA.answer;
    } else {
      reply = "I am sorry, I don't have an answer to that question.";
    }

    // Save chat log
    await saveChatLog(userId, message, reply);

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate a response' });
  }
};

exports.getChatHistory = async (req, res) => {
  const { userId } = req.query;

  try {
    const { data: chatLogs, error } = await supabase.from('chat_logs').select('*').eq('user_id', userId);

    if (error) throw error;
    
    res.status(200).json({ chatLogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};
