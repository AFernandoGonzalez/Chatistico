const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.post('/message', sendMessage);

router.get('/history', getChatHistory);

module.exports = router;
