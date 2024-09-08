const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const authenticate = require('../middlewares/authMiddleware')

// Get configuration
router.get('/', configController.getConfiguration);

// Save configuration
router.post('/',authenticate, configController.saveConfiguration);

module.exports = router;
