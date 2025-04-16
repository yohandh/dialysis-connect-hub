const { pool } = require('../config/db');
const auditService = require('../services/auditService');

/**
 * Debug endpoint to check if the audit controller is accessible
 */
exports.debug = async (req, res) => {
  try {
    // Count total records
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM audit_logs');
    const total = countResult[0].total;
    
    res.status(200).json({
      message: 'Audit controller is working',
      totalLogs: total,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get all audit logs with pagination and filtering
 */
exports.getAllAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, table, action, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    // Build the WHERE clause for filtering
    let whereClause = '';
    const params = [];
    
    if (table) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 'al.table_name = ?';
      params.push(table);
    }
    
    if (action) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 'al.action = ?';
      params.push(action);
    }
    
    if (startDate && endDate) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 'al.created_at BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 'al.created_at >= ?';
      params.push(startDate);
    } else if (endDate) {
      whereClause += whereClause ? ' AND ' : ' WHERE ';
      whereClause += 'al.created_at <= ?';
      params.push(endDate);
    }
    
    // Count total records for pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM audit_logs al${whereClause}`,
      params
    );
    const total = countResult[0].total;
    
    // Get the audit logs with user information
    const queryParams = [...params, parseInt(limit), parseInt(offset)];
    const [rows] = await pool.query(
      `SELECT al.*, 
              CONCAT(u.first_name, ' ', u.last_name) as changed_by_name
       FROM audit_logs al
       LEFT JOIN users u ON al.changed_by_id = u.id
       ${whereClause}
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      queryParams
    );
    
    // Format the response
    const formattedLogs = rows.map(log => ({
      id: log.id,
      table: log.table_name,
      recordId: log.record_id,
      action: log.action,
      changedBy: log.changed_by_name || 'System',
      changedById: log.changed_by_id,
      oldData: log.old_data ? JSON.parse(log.old_data) : null,
      newData: log.new_data ? JSON.parse(log.new_data) : null,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      dateTime: log.created_at
    }));
    
    res.status(200).json({
      logs: formattedLogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get distinct table names from audit logs
 */
exports.getAuditTables = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT table_name FROM audit_logs ORDER BY table_name`
    );
    
    const tables = rows.map(row => row.table_name);
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error fetching audit tables:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get audit log details by ID
 */
exports.getAuditLogById = async (req, res) => {
  try {
    const logId = req.params.id;
    
    const [rows] = await pool.query(
      `SELECT al.*, 
              CONCAT(u.first_name, ' ', u.last_name) as changed_by_name,
              u.email as changed_by_email
       FROM audit_logs al
       LEFT JOIN users u ON al.changed_by_id = u.id
       WHERE al.id = ?`,
      [logId]
    );
    
    if (!rows.length) {
      return res.status(404).json({ message: 'Audit log not found' });
    }
    
    const log = rows[0];
    const formattedLog = {
      id: log.id,
      table: log.table_name,
      recordId: log.record_id,
      action: log.action,
      changedBy: {
        id: log.changed_by_id,
        name: log.changed_by_name || 'System',
        email: log.changed_by_email
      },
      oldData: log.old_data ? JSON.parse(log.old_data) : null,
      newData: log.new_data ? JSON.parse(log.new_data) : null,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      dateTime: log.created_at
    };
    
    res.status(200).json(formattedLog);
  } catch (error) {
    console.error('Error fetching audit log details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
