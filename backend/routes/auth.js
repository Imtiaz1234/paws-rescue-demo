const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register user or rescue
router.post('/register', authController.register);

// Login user/rescue/admin
router.post('/login', authController.login);

module.exports = router;
