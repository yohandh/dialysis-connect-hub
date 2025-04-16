const pool = require('../config/database');

/**
 * Log an action to the audit_logs table
 * @param {string} tableName - The name of the table being modified
 * @param {number} recordId - The ID of the record being modified
 * @param {string} action - The action being performed (create, update, delete)
 * @param {number} changedById - The ID of the user performing the action
 * @param {object} oldData - The data before the change (for updates and deletes)
 * @param {object} newData - The data after the change (for creates and updates)
 * @param {string} ipAddress - The IP address of the user
 * @param {string} userAgent - The user agent of the user
 * @returns {Promise<number>} - The ID of the created audit log
 */
const logAction = async (
  tableName,
  recordId,
  action,
  changedById,
  oldData = null,
  newData = null,
  ipAddress = null,
  userAgent = null
) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO audit_logs 
       (table_name, record_id, action, changed_by_id, old_data, new_data, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        tableName,
        recordId,
        action,
        changedById,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
        ipAddress,
        userAgent
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error logging audit action:', error);
    // Don't throw the error - we don't want audit logging failures to break the application
    return null;
  }
};

/**
 * Get audit logs for a specific record
 * @param {string} tableName - The name of the table
 * @param {number} recordId - The ID of the record
 * @returns {Promise<Array>} - Array of audit logs
 */
const getAuditLogsForRecord = async (tableName, recordId) => {
  try {
    const [rows] = await pool.query(
      `SELECT al.*, u.first_name, u.last_name, u.email
       FROM audit_logs al
       LEFT JOIN users u ON al.changed_by_id = u.id
       WHERE al.table_name = ? AND al.record_id = ?
       ORDER BY al.created_at DESC`,
      [tableName, recordId]
    );

    return rows;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

/**
 * Get audit logs for a specific user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>} - Array of audit logs
 */
const getAuditLogsByUser = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT al.*, u.first_name, u.last_name, u.email
       FROM audit_logs al
       LEFT JOIN users u ON al.changed_by_id = u.id
       WHERE al.changed_by_id = ?
       ORDER BY al.created_at DESC`,
      [userId]
    );

    return rows;
  } catch (error) {
    console.error('Error fetching audit logs by user:', error);
    throw error;
  }
};

module.exports = {
  logAction,
  getAuditLogsForRecord,
  getAuditLogsByUser
};
