const OpenAI = require("openai");

// Initialize the OpenAI API with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(userQuery, matchedQuestion, matchedAnswer) {
    try {
        console.log("userQuery", userQuery);
        console.log("matchedQuestion", matchedQuestion);
        console.log("matchedAnswer", matchedAnswer);

        // Create a chat completion using the GPT-4 model
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant that provides answers strictly based on the provided information. You must use the answer from the database unless it doesn't address the user's exact query.`
                },
                {
                    role: "user",
                    // content: `User asked: "${userQuery}".\nThe best matching question from the database is: "${matchedQuestion}".\nAnswer to be provided is: "${matchedAnswer}".\nRespond strictly based on this answer. If the question is ambiguous, try to clarify the query with the user.`
                    content: `User asked: "${userQuery}".\nThe best matching question from the database is: "${matchedQuestion}".\nThe exact answer is: "${matchedAnswer}".\nPlease improve this answer slightly for clarity, but keep it concise and do not make the response too long.`
                }
            ],
            max_tokens: 50,
            temperature: 0.1,  // Lower temperature to make responses more deterministic
        });

        const enhancedResponse = response.choices[0].message.content.trim();
        return enhancedResponse;
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Sorry, I couldn't process your request at the moment.";
    }
}

module.exports = { getAIResponse };

// async function getAIResponse(userQuery) {

//     const randomResponses = [
//         "I'm here to help!",
//         "Can you please provide more details?",
//         "Thank you for reaching out.",
//         "I'm not sure I understand. Could you clarify?",
//         "That's interesting! Tell me more.",
//         "Let me check that for you.",
//         "I'm sorry, I don't have the information you're looking for.",
//         "Is there anything else I can assist you with?",
//         "Great! How can I assist you further?",
//         "Let's solve this together!"
//     ];

//     const randomIndex = Math.floor(Math.random() * randomResponses.length);
//     const randomResponse = randomResponses[randomIndex];

//     return randomResponse;
// }

// module.exports = { getAIResponse };
