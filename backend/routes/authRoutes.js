const express = require('express');
const { signup, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);



module.exports = router;
