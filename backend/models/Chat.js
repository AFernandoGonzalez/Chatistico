const supabase = require('../config/db');

const saveChatLog = async (userId, question, answer) => {
  const { data, error } = await supabase
    .from('chat_logs')
    .insert([{ user_id: userId, question, answer }]);

  if (error) {
    console.error('Error saving chat log:', error);
  }

  return data;
};

module.exports = { saveChatLog };
