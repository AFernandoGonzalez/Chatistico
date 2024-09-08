const supabase = require('../config/db');

// Helper function to fetch the user_id based on firebase_uid
const getUserIdFromFirebaseUid = async (firebaseUid) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('firebase_uid', firebaseUid)
    .single();

  if (error || !user) {
    throw new Error('User not found.');
  }

  return user.id;
};

// Upload Q&A Pair
exports.uploadQAPair = async (req, res) => {
  const { uid } = req.user;
  const {
    chatbotId,
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
    const userId = await getUserIdFromFirebaseUid(uid); // Ensure user exists

    let newEntry = {
      chatbot_id: chatbotId,
      type,
      status,
      status_message,
      retrain_initiated_at,
      characters,
      chunks_count,
      created_at: new Date().toISOString(),
    };

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

    const { data, error } = await supabase.from('qa_pairs').insert([newEntry]);

    if (error) throw error;
    res.status(201).json({ message: 'Q&A pair uploaded successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Q&A Pairs
exports.getQAPairs = async (req, res) => {
  let { chatbotId } = req.query;

  console.log("Received chatbotId: ", chatbotId);

  if (!chatbotId) {
    return res.status(400).json({ error: 'Missing chatbotId parameter' });
  }

  // Convert chatbotId to an integer
  chatbotId = parseInt(chatbotId, 10);

  if (isNaN(chatbotId)) {
    return res.status(400).json({ error: 'Invalid chatbotId' });
  }

  try {
    const { data, error } = await supabase.from('qa_pairs').select('*').eq('chatbot_id', chatbotId);
    if (error) throw error;

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
