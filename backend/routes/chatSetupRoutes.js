
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatSetupController');


router.get('/', chatController.handleGetChatActions);


router.post('/', chatController.handlePostChatActions);

module.exports = router;
