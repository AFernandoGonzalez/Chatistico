const OpenAI = require('openai');

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getAIResponse(userQuery, knowledgeContext) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Use the appropriate model like "gpt-4" if needed
      messages: [
        { role: "system", content: `You are a helpful assistant with knowledge based on the following:\n${knowledgeContext}` },
        { role: "user", content: userQuery }
      ],
      max_tokens: 150,  // Adjust token limit as needed
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content.trim();
    console.log("aiResponse: ",aiResponse);
    
    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error.message);
    return "Sorry, I couldn't process your request at the moment.";
  }
}

module.exports = { getAIResponse };
