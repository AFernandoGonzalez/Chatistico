const { getChatHistory, sendMessage, newMessage } = require('./chatController');
const { getConfiguration } = require('./configController');

// Handle GET requests (for fetching data)
exports.handleGetChatActions = async (req, res) => {
    const { action, chatbotId, sessionUserId } = req.query;

    if (!action || !chatbotId) {
        return res.status(400).json({ error: 'Action and Chatbot ID are required.' });
    }

    try {
        switch (action) {
            case 'getChatHistory':
                if (!sessionUserId) {
                    return res.status(400).json({ error: 'Session User ID is required for chat history.' });
                }
                await getChatHistory(req, res);
                break;

            case 'getConfiguration':
                await getConfiguration(req, res);
                break;

            default:
                return res.status(400).json({ error: 'Invalid action specified for GET request.' });
        }
    } catch (error) {
        console.error('Error handling GET chat action:', error);
        res.status(500).json({ error: 'Failed to process GET chat action.' });
    }
};

// Handle POST requests (for creating or modifying data)
exports.handlePostChatActions = async (req, res) => {
    const { action, chatbotId, sessionUserId, text, role_id, chatId } = req.body;

    if (!action || !chatbotId) {
        return res.status(400).json({ error: 'Action and Chatbot ID are required.' });
    }

    try {
        switch (action) {
            case 'sendMessage':
                if (!chatId || !text || !role_id || !sessionUserId) {
                    return res.status(400).json({ error: 'Chat ID, text, role ID, and Session User ID are required.' });
                }
                await sendMessage(req, res);
                break;

            case 'createNewChat':
                if (!sessionUserId) {
                    return res.status(400).json({ error: 'Session User ID is required to create a new chat.' });
                }
                await newMessage(req, res);
                break;

            default:
                return res.status(400).json({ error: 'Invalid action specified for POST request.' });
        }
    } catch (error) {
        console.error('Error handling POST chat action:', error);
        res.status(500).json({ error: 'Failed to process POST chat action.' });
    }
};
