// services/openaiService.js

async function getAIResponse(userQuery) {
    // Define a list of random responses for testing
    const randomResponses = [
        "I'm here to help!",
        "Can you please provide more details?",
        "Thank you for reaching out.",
        "I'm not sure I understand. Could you clarify?",
        "That's interesting! Tell me more.",
        "Let me check that for you.",
        "I'm sorry, I don't have the information you're looking for.",
        "Is there anything else I can assist you with?",
        "Great! How can I assist you further?",
        "Let's solve this together!"
    ];

    // Select a random response from the list
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    const randomResponse = randomResponses[randomIndex];

    // Return the random response
    return randomResponse;
}

module.exports = { getAIResponse };
