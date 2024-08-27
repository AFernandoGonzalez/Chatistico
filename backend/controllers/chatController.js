const axios = require('axios');
require('dotenv').config();

const handleChat = async (req, res) => {
  const { message } = req.body;

  try {
    // Call OpenAI API to generate a response
    // const response = await axios.post(
    //   'https://api.openai.com/v1/completions',
    //   {
    //     model: 'text-davinci-003',
    //     prompt: message,
    //     max_tokens: 150,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //     },
    //   }
    // );

    // res.status(200).json({ reply: response.data.choices[0].text.trim() });
    res.status(200)
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to generate a response' });
  }
};

module.exports = { handleChat };
