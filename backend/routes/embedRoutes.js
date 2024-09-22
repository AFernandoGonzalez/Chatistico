const express = require('express');
const { setupChatbot } = require('../controllers/embedController');

const router = express.Router();
router.post('/setup', setupChatbot);
module.exports = router;
