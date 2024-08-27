const supabase = require('../config/db');

exports.uploadQAPair = async (req, res) => {
  const { userId, question, answer } = req.body;

  try {
    const { data, error } = await supabase.from('knowledge_base').insert([{ user_id: userId, question, answer }]);

    if (error) throw error;
    res.status(201).json({ message: 'Q&A pair uploaded successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQAPairs = async (req, res) => {
  const { userId } = req.query;

  try {
    const { data, error } = await supabase.from('knowledge_base').select('*').eq('user_id', userId);
    if (error) throw error;
    res.status(200).json({ qaPairs: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateQAPair = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  try {
    const { data, error } = await supabase.from('knowledge_base').update({ question, answer }).eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Q&A pair updated successfully', data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteQAPair = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('knowledge_base').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Q&A pair deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
