// In routes/chatSetupRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatSetupController');

// GET route for fetching chat history and configuration
router.get('/', chatController.handleGetChatActions);

// POST route for sending messages, creating new chat sessions, etc.
router.post('/', chatController.handlePostChatActions);

module.exports = router;
