const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authMiddleware.protect, authController.getCurrentUser);

module.exports = router;
