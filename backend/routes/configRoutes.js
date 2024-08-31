const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Get configuration
router.get('/', configController.getConfiguration);

// Save configuration
router.post('/save', configController.saveConfiguration);

module.exports = router;
