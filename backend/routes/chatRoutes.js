const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

router.get('/history', getChatHistory);
router.post('/message', sendMessage);

module.exports = router;
