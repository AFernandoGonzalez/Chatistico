

async function getAIResponse(userQuery) {
    
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

    
    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    const randomResponse = randomResponses[randomIndex];

    
    return randomResponse;
}

module.exports = { getAIResponse };
