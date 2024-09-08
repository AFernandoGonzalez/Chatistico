const express = require('express');
const { getChatbots, createChatbot, getChatbotById, deleteChatbot, renameChatbot } = require('../controllers/chatbotController');
const authenticate = require('../middlewares/authMiddleware')
const router = express.Router();

router.get('/', authenticate, getChatbots);
router.post('/', authenticate, createChatbot);
router.get('/:id', authenticate, getChatbotById);
router.delete('/:id', authenticate, deleteChatbot);
router.put('/:id', authenticate, renameChatbot);

module.exports = router;
