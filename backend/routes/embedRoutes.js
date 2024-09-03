const express = require('express');
const { setupChatbot } = require('../controllers/embedController');

const router = express.Router();

// Define the POST route for widget setup
router.post('/chatbot/setup', setupChatbot);

module.exports = router;
