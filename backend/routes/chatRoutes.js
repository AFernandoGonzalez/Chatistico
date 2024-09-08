const express = require('express');
const { sendMessage, getChatHistory, newMessage } = require('../controllers/chatController');
const router = express.Router();

router.get('/history', getChatHistory);
router.post('/message', sendMessage);
router.post('/new', newMessage);

module.exports = router;
