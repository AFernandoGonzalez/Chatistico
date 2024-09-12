const supabase = require('../config/db');

// Helper function to fetch chatbot_id based on data_widget_id
const getChatbotIdFromDataWidgetId = async (dataWidgetId) => {
  console.log("Fetching chatbot for dataWidgetId: ", dataWidgetId);

  const { data: chatbot, error } = await supabase
    .from('chatbots')
    .select('id')
    .eq('data_widget_id', dataWidgetId)
    .single();

  if (error || !chatbot) {
    throw new Error('Chatbot not found.');
  }

  return chatbot.id;
};


exports.uploadQAPair = async (req, res) => {
  const { uid } = req.user; // assuming user is authenticated
  const {
    chatbotId, // this is the data_widget_id
    type,
    url,
    title,
    html,
    question,
    answer,
    filename_original,
    file_ext,
    file_name,
    file_size,
    file_mime,
    status = 'pending',
    status_message = null,
    retrain_initiated_at = null,
    characters = null,
    chunks_count = 0,
  } = req.body;

  try {
    // Fetch the chatbot ID using data_widget_id
    const chatbot_id = await getChatbotIdFromDataWidgetId(chatbotId);

    let newEntry = {
      chatbot_id, // This is the ID from the chatbot table
      type,
      status,
      status_message,
      retrain_initiated_at,
      characters,
      chunks_count,
      created_at: new Date().toISOString(),
    };

    // Handle the specific fields based on the type
    switch (type) {
      case 'link':
        newEntry = { ...newEntry, url, title };
        break;
      case 'text':
        newEntry = { ...newEntry, html };
        break;
      case 'faq':
        newEntry = { ...newEntry, question, answer };
        break;
      case 'document':
        newEntry = {
          ...newEntry,
          filename_original,
          file_ext,
          file_name,
          file_size,
          file_mime,
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    // Insert the new Q&A pair
    const { data, error } = await supabase.from('qa_pairs').insert([newEntry]);

    if (error) throw error;
    res.status(201).json({ message: 'Q&A pair uploaded successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getQAPairs = async (req, res) => {
  const { chatbotId } = req.query; 

  if (!chatbotId) {
    return res.status(400).json({ error: 'Missing chatbotId parameter' });
  }

  try {
    // Fetch chatbot_id using data_widget_id
    const chatbot_id = await getChatbotIdFromDataWidgetId(chatbotId);

    // Fetch Q&A pairs based on the chatbot_id
    const { data, error } = await supabase
      .from('qa_pairs')
      .select('*')
      .eq('chatbot_id', chatbot_id);

    if (error) throw error;

    // Structure the data
    const structuredData = {
      link: { total: 0, items: [] },
      text: { total: 0, items: [] },
      faq: { total: 0, items: [] },
      document: { total: 0, items: [] },
    };

    data.forEach((item) => {
      if (item.type && structuredData[item.type]) {
        structuredData[item.type].items.push(item);
        structuredData[item.type].total += 1;
      }
    });

    res.status(200).json(structuredData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Q&A Pair
exports.updateQAPair = async (req, res) => {
  const { id } = req.params;
  const {
    type,
    url,
    title,
    html,
    question,
    answer,
    filename_original,
    file_ext,
    file_name,
    file_size,
    file_mime,
    status = 'pending',
    status_message = null,
    retrain_initiated_at = null,
    characters = null,
    chunks_count = 0,
  } = req.body;

  try {
    let updateFields = {
      type,
      status,
      status_message,
      retrain_initiated_at,
      characters,
      chunks_count,
    };

    switch (type) {
      case 'link':
        updateFields = { ...updateFields, url, title };
        break;
      case 'text':
        updateFields = { ...updateFields, html };
        break;
      case 'faq':
        updateFields = { ...updateFields, question, answer };
        break;
      case 'document':
        updateFields = {
          ...updateFields,
          filename_original,
          file_ext,
          file_name,
          file_size,
          file_mime,
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    const { data, error } = await supabase
      .from('qa_pairs')
      .update(updateFields)
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Q&A pair updated successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Q&A Pair
exports.deleteQAPair = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('qa_pairs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Q&A pair deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
