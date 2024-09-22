const supabase = require('../config/db');
const { processFileUploads } = require('../middlewares/fileUploadService');

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
      return res.status(404).json({ error: 'Chatbot not found.' });
    }

    if (!config.primary_color || !config.text_color || !config.icon_color || config.chat_width === undefined) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Check if there is an existing configuration
    const { data: existingConfig, error: fetchError } = await supabase
      .from('chatbot_configurations')
      .select('id, bot_icon_image, chat_icon_image') // Select existing image URLs too
      .eq('chatbot_id', chatbot.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // Process file uploads and get file URLs
    const fileUrls = await processFileUploads(req.files);

    // Construct the updated configuration object
    const updatedConfig = {
      primary_color: config.primary_color,
      text_color: config.text_color,
      icon_color: config.icon_color,
      chat_width: config.chat_width,
      widget_position: config.widget_position,
      horizontal_spacing: config.horizontal_spacing,
      vertical_spacing: config.vertical_spacing,
      bot_icon_circular: config.bot_icon_circular,
      chat_icon_circular: config.chat_icon_circular,
      chat_icon_size: config.chat_icon_size,
      chatbot_name: config.chatbot_name,
      bot_icon_image: fileUrls.bot_icon_image || existingConfig.bot_icon_image, // Keep existing if no new upload
      chat_icon_image: fileUrls.chat_icon_image || existingConfig.chat_icon_image // Keep existing if no new upload
    };

    // Update or insert configuration
    if (existingConfig) {
      const { data, error: updateError } = await supabase
        .from('chatbot_configurations')
        .update(updatedConfig)
        .eq('chatbot_id', chatbot.id);

      if (updateError) throw updateError;

      res.status(200).json({ message: 'Configuration updated successfully', data });
    } else {
      const { data, error: insertError } = await supabase
        .from('chatbot_configurations')
        .insert([{ chatbot_id: chatbot.id, ...updatedConfig }]);

      if (insertError) throw insertError;

      res.status(201).json({ message: 'Configuration saved successfully', data });
    }
  } catch (error) {
    console.error('Error in saveConfiguration:', error);
    res.status(400).json({ error: error.message });
  }
};

