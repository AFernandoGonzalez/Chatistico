const express = require('express');
const { getChatbots, createChatbot, getChatbotById, deleteChatbot, renameChatbot } = require('../controllers/chatbotController');

const router = express.Router();

router.get('/', getChatbots);
router.post('/', createChatbot);
router.get('/:id', getChatbotById);
router.delete('/:id', deleteChatbot); 
router.put('/:id', renameChatbot); 

module.exports = router;
