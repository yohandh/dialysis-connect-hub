const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get notifications by recipient
router.get('/recipient/:recipientId', notificationController.getNotificationsByRecipient);

// Update notification status
router.patch('/:id/status', notificationController.updateNotificationStatus);

// Create a new notification
router.post('/', notificationController.createNotification);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
