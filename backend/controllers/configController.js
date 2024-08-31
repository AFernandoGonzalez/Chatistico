const supabase = require('../config/db');

// Function to get configuration for a specific chatbot
exports.getConfiguration = async (req, res) => {
  const { chatbotId } = req.query;

  if (!chatbotId) {
    return res.status(400).json({ error: 'Missing chatbotId parameter' });
  }

  try {
    const { data, error } = await supabase.from('chatbot_configurations').select('*').eq('chatbot_id', chatbotId).single();
    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.saveConfiguration = async (req, res) => {
    const { chatbotId } = req.query;  // Extract chatbotId from query parameters
    const config = req.body;
  
    if (!chatbotId) {
      return res.status(400).json({ error: 'Missing chatbotId parameter' });
    }
  
    // Ensure chatbotId exists in chatbots table
    try {
      const { data: chatbotExists, error: chatbotError } = await supabase
        .from('chatbots')
        .select('id')
        .eq('id', chatbotId)
        .single();
  
      if (chatbotError) {
        return res.status(400).json({ error: 'Chatbot not found or does not exist.' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Error checking chatbot existence.' });
    }
  
    // Check for required configuration fields
    if (!config.primary_color || !config.text_color || !config.icon_color || config.chat_width === undefined) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }
  
    try {
      // Check if configuration exists
      const { data: existingConfig, error: fetchError } = await supabase
        .from('chatbot_configurations')
        .select('id')
        .eq('chatbot_id', chatbotId)
        .single();
  
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError; // Ignore not found error
  
      if (existingConfig) {
        // Update existing configuration
        const { data, error } = await supabase
          .from('chatbot_configurations')
          .update(config)
          .eq('chatbot_id', chatbotId);
        if (error) throw error;
        res.status(200).json({ message: 'Configuration updated successfully', data });
      } else {
        // Insert new configuration
        const { data, error } = await supabase
          .from('chatbot_configurations')
          .insert([{ chatbot_id: chatbotId, ...config }]);
        if (error) throw error;
        res.status(201).json({ message: 'Configuration saved successfully', data });
      }
    } catch (error) {
      console.error('Error in saveConfiguration:', error);
      res.status(400).json({ error: error.message });
    }
  };
  