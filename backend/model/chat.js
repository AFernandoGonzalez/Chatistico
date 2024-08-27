const supabase = require('../config/db');

const saveChatLog = async (userId, message, reply) => {
  const { data, error } = await supabase
    .from('chat_logs')
    .insert([{ user_id: userId, message, reply }]);

  if (error) {
    console.error('Error saving chat log:', error);
  }

  return data;
};

module.exports = { saveChatLog };
