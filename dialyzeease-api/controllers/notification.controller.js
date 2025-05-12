const { pool } = require('../config/db');
const emailService = require('../services/email.service');

/**
 * Send an email directly from the API
 * This endpoint is used by the frontend to send emails
 */
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, html, text } = req.body;
    
    // Validate required fields
    if (!to || !subject || !(html || text)) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide to, subject, and either html or text content' 
      });
    }
    
    // Send the email
    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text: text || ''
    });
    
    if (result.success) {
      res.status(200).json({ 
        message: 'Email sent successfully', 
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send email', 
        error: result.error 
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Error sending email', 
      error: error.message 
    });
  }
};

/**
 * Get all notifications with recipient details
 */
exports.getAllNotifications = async (req, res) => {
  try {
    // Get all notifications with recipient details
    const [notifications] = await pool.query(`
      SELECT n.*, 
             u.first_name, u.last_name, u.email
      FROM notifications n
      LEFT JOIN users u ON n.recipient_id = u.id
      ORDER BY n.sent_at DESC
    `);

    // Format the response
    const formattedNotifications = notifications.map(notification => {
      return {
        id: notification.id,
        recipient_id: notification.recipient_id,
        recipient_name: notification.first_name && notification.last_name 
          ? `${notification.first_name} ${notification.last_name}` 
          : 'Unknown User',
        recipient_role: notification.recipient_role,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        sent_at: notification.sent_at
      };
    });

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

/**
 * Get notifications by recipient
 */
exports.getNotificationsByRecipient = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { role } = req.query;

    let query = `
      SELECT n.*, 
             u.first_name, u.last_name, u.email
      FROM notifications n
      LEFT JOIN users u ON n.recipient_id = u.id
      WHERE n.recipient_id = ?
    `;
    
    const queryParams = [recipientId];

    if (role) {
      query += ` AND n.recipient_role = ?`;
      queryParams.push(role);
    }

    query += ` ORDER BY n.sent_at DESC`;

    const [notifications] = await pool.query(query, queryParams);

    // Format the response
    const formattedNotifications = notifications.map(notification => {
      return {
        id: notification.id,
        recipient_id: notification.recipient_id,
        recipient_name: notification.first_name && notification.last_name 
          ? `${notification.first_name} ${notification.last_name}` 
          : 'Unknown User',
        recipient_role: notification.recipient_role,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.status,
        sent_at: notification.sent_at
      };
    });

    res.status(200).json(formattedNotifications);
  } catch (error) {
    console.error('Error fetching notifications by recipient:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications by recipient', 
      error: error.message 
    });
  }
};

/**
 * Update notification status
 */
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'sent', 'failed', 'read'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Status must be one of: pending, sent, failed, read' 
      });
    }

    // Check if notification exists
    const [notificationCheck] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );

    if (notificationCheck.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Update notification status
    await pool.query(
      'UPDATE notifications SET status = ? WHERE id = ?',
      [status, id]
    );

    // Get updated notification
    const [updatedNotification] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );

    res.status(200).json(updatedNotification[0]);
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ 
      message: 'Error updating notification status', 
      error: error.message 
    });
  }
};

/**
 * Create a new notification
 */
exports.createNotification = async (req, res) => {
  try {
    const { 
      recipient_id, 
      recipient_role, 
      title, 
      message, 
      type, 
      status = 'pending' 
    } = req.body;

    // Validate required fields
    if (!recipient_id || !recipient_role || !title || !message || !type) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide recipient_id, recipient_role, title, message, and type' 
      });
    }

    // Validate recipient exists
    const [recipientCheck] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [recipient_id]
    );

    if (recipientCheck.length === 0) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create the notification
    const [result] = await pool.query(
      `INSERT INTO notifications 
       (recipient_id, recipient_role, title, message, type, status, sent_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [recipient_id, recipient_role, title, message, type, status]
    );

    // Get the created notification
    const [newNotification] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [result.insertId]
    );

    const notification = newNotification[0];

    // If it's an email notification, send the email
    if (type === 'email') {
      // Get recipient email
      const recipientEmail = recipientCheck[0].email;
      
      if (recipientEmail) {
        // Send email asynchronously
        const emailResult = await emailService.sendNotificationEmail(notification, recipientEmail);
        
        // Update notification status based on email result
        const newStatus = emailResult.success ? 'sent' : 'failed';
        
        await pool.query(
          'UPDATE notifications SET status = ? WHERE id = ?',
          [newStatus, notification.id]
        );
        
        // Update the notification object with the new status
        notification.status = newStatus;
      } else {
        // No email address found, mark as failed
        await pool.query(
          'UPDATE notifications SET status = ? WHERE id = ?',
          ['failed', notification.id]
        );
        notification.status = 'failed';
      }
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      message: 'Error creating notification', 
      error: error.message 
    });
  }
};

/**
 * Delete a notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification exists
    const [notificationCheck] = await pool.query(
      'SELECT * FROM notifications WHERE id = ?',
      [id]
    );

    if (notificationCheck.length === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Delete the notification
    await pool.query(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    );

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
};
