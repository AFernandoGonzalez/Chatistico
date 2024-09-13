const supabase = require('../config/db');

exports.getConfiguration = async (req, res) => {
  const { chatbotId } = req.query;

  if (!chatbotId) {
    return res.status(400).json({ error: 'Missing chatbotId parameter' });
  }

  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select('id')
      .eq('data_widget_id', chatbotId)
      .single();

    if (error) throw error;

    const chatbotConfig = await supabase
      .from('chatbot_configurations')
      .select('*')
      .eq('chatbot_id', data.id)
      .single();

    res.status(200).json(chatbotConfig);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.saveConfiguration = async (req, res) => {
  const { chatbotId } = req.query;
  const config = req.body;
  
  if (!chatbotId) {
    return res.status(400).json({ error: 'Missing chatbotId parameter' });
  }

  try {
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('id')
      .eq('data_widget_id', chatbotId)
      .single();

    if (chatbotError || !chatbot) {
      return res.status(404).json({ error: 'Chatbot not found or does not exist.' });
    }

    if (!config.primary_color || !config.text_color || !config.icon_color || config.chat_width === undefined) {
      return res.status(400).json({ error: 'Missing required configuration fields' });
    }
    const { data: existingConfig, error: fetchError } = await supabase
      .from('chatbot_configurations')
      .select('id')
      .eq('chatbot_id', chatbot.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingConfig) {
      const { data, error: updateError } = await supabase
        .from('chatbot_configurations')
        .update(config)
        .eq('chatbot_id', chatbot.id);

      if (updateError) throw updateError;

      res.status(200).json({ message: 'Configuration updated successfully', data });
    } else {
      const { data, error: insertError } = await supabase
        .from('chatbot_configurations')
        .insert([{ chatbot_id: chatbot.id, ...config }]);

      if (insertError) throw insertError;

      res.status(201).json({ message: 'Configuration saved successfully', data });
    }
  } catch (error) {
    console.error('Error in saveConfiguration:', error);
    res.status(400).json({ error: error.message });
  }
};
