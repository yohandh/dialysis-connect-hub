const pool = require('../config/database');

/**
 * Create a notification record in the database
 * @param {number} recipientId - The ID of the recipient
 * @param {string} recipientRole - The role of the recipient (admin, staff, patient, doctor)
 * @param {string} title - The title of the notification
 * @param {string} message - The message content
 * @param {string} type - The notification type (email, sms, app)
 * @param {string} status - The status of the notification (pending, sent, failed, read)
 * @returns {Promise<number>} - The ID of the created notification
 */
const createNotification = async (
  recipientId,
  recipientRole,
  title,
  message,
  type,
  status = 'pending'
) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO notifications 
       (recipient_id, recipient_role, title, message, type, status, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [recipientId, recipientRole, title, message, type, status]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Update the status of a notification
 * @param {number} notificationId - The ID of the notification
 * @param {string} status - The new status (pending, sent, failed, read)
 * @returns {Promise<boolean>} - Success status
 */
const updateNotificationStatus = async (notificationId, status) => {
  try {
    const [result] = await pool.query(
      `UPDATE notifications 
       SET status = ?, 
           sent_at = CASE WHEN ? = 'sent' THEN NOW() ELSE sent_at END
       WHERE id = ?`,
      [status, status, notificationId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

/**
 * Get notifications for a specific user
 * @param {number} userId - The ID of the user
 * @param {string} role - The role of the user
 * @param {string} status - Optional filter by status
 * @returns {Promise<Array>} - Array of notifications
 */
const getUserNotifications = async (userId, role, status = null) => {
  try {
    let query = `
      SELECT * FROM notifications 
      WHERE recipient_id = ? AND recipient_role = ?
    `;
    
    const params = [userId, role];
    
    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY sent_at DESC`;
    
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The ID of the notification
 * @returns {Promise<boolean>} - Success status
 */
const markNotificationAsRead = async (notificationId) => {
  return updateNotificationStatus(notificationId, 'read');
};

/**
 * Track an email notification
 * @param {number} recipientId - The ID of the recipient
 * @param {string} recipientRole - The role of the recipient
 * @param {string} title - The email subject
 * @param {string} message - The email content (can be HTML)
 * @param {string} status - The initial status
 * @returns {Promise<number>} - The ID of the created notification
 */
const trackEmailNotification = async (
  recipientId,
  recipientRole,
  title,
  message,
  status = 'sent'
) => {
  return createNotification(recipientId, recipientRole, title, message, 'email', status);
};

module.exports = {
  createNotification,
  updateNotificationStatus,
  getUserNotifications,
  markNotificationAsRead,
  trackEmailNotification
};
