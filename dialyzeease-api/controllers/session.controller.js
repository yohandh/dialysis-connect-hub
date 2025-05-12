const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

// Get all sessions for a center
exports.getSessionsByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    
    console.log(`Fetching sessions for center ID: ${centerId}`);
    
    // Join with users table to get doctor name
    const [sessions] = await pool.query(
      `SELECT s.*, u.first_name, u.last_name, 
       CONCAT(u.first_name, ' ', u.last_name) as doctor_name
       FROM sessions s
       LEFT JOIN users u ON s.doctor_id = u.id
       WHERE s.center_id = ?
       ORDER BY FIELD(s.weekday, 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'), 
       s.start_time ASC`,
      [centerId]
    );
    
    console.log(`Found ${sessions.length} sessions`);
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error in getSessionsByCenter:', error);
    res.status(500).json({ message: 'Failed to fetch sessions', error: error.message });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      center_id, 
      doctor_id, 
      weekday, 
      start_time, 
      end_time, 
      default_capacity,
      recurrence_pattern = 'weekly'
    } = req.body;
    
    console.log('Creating new session with data:', req.body);
    
    // Check if a similar session already exists (same center, weekday, and time)
    const [existingSessions] = await pool.query(
      `SELECT * FROM sessions 
       WHERE center_id = ? AND weekday = ? 
       AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,
      [center_id, weekday, start_time, start_time, end_time, end_time]
    );
    
    if (existingSessions.length > 0) {
      console.log('Found overlapping sessions:', existingSessions);
      return res.status(409).json({ 
        message: 'A session with overlapping time already exists for this center and weekday' 
      });
    }
    
    // Hard-code created_by_id to 1000 for now to avoid authentication issues
    const created_by_id = 1000;
    console.log('Using created_by_id:', created_by_id);
    
    // Insert the new session
    const insertQuery = `INSERT INTO sessions 
       (center_id, doctor_id, weekday, start_time, end_time, default_capacity, 
        recurrence_pattern, status, created_by_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)`;
    const insertParams = [
      center_id, 
      doctor_id || null, 
      weekday, 
      start_time, 
      end_time, 
      default_capacity, 
      recurrence_pattern, 
      created_by_id
    ];
    
    console.log('Executing insert query:', insertQuery);
    console.log('With parameters:', insertParams);
    
    const [result] = await pool.query(insertQuery, insertParams);
    console.log('Insert result:', result);
    
    // Get the newly created session
    const [newSession] = await pool.query(
      `SELECT s.*, u.first_name, u.last_name, 
       CONCAT(u.first_name, ' ', u.last_name) as doctor_name
       FROM sessions s
       LEFT JOIN users u ON s.doctor_id = u.id
       WHERE s.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newSession[0]);
  } catch (error) {
    console.error('Error in createSession:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if it's a database error
    if (error.code && error.errno) {
      console.error('MySQL error code:', error.code);
      console.error('MySQL error number:', error.errno);
      console.error('MySQL error SQL state:', error.sqlState);
      console.error('MySQL error message:', error.sqlMessage);
    }
    
    res.status(500).json({ 
      message: 'Failed to create session', 
      error: error.message,
      details: error.code ? `Database error: ${error.code}` : 'Server error'
    });
  }
};

// Update a session
exports.updateSession = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { 
      doctor_id, 
      weekday, 
      start_time, 
      end_time, 
      default_capacity,
      recurrence_pattern,
      status
    } = req.body;
    
    console.log(`Updating session ID ${id}:`, req.body);
    
    // Check if session exists
    const [existingSession] = await pool.query(
      'SELECT * FROM sessions WHERE id = ?',
      [id]
    );
    
    if (existingSession.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (doctor_id !== undefined) {
      updateFields.push('doctor_id = ?');
      queryParams.push(doctor_id === null ? null : doctor_id);
    }
    
    if (weekday) {
      updateFields.push('weekday = ?');
      queryParams.push(weekday);
    }
    
    if (start_time) {
      updateFields.push('start_time = ?');
      queryParams.push(start_time);
    }
    
    if (end_time) {
      updateFields.push('end_time = ?');
      queryParams.push(end_time);
    }
    
    if (default_capacity) {
      updateFields.push('default_capacity = ?');
      queryParams.push(default_capacity);
    }
    
    if (recurrence_pattern) {
      updateFields.push('recurrence_pattern = ?');
      queryParams.push(recurrence_pattern);
    }
    
    if (status) {
      updateFields.push('status = ?');
      queryParams.push(status);
    }
    
    // Add updated_at timestamp
    updateFields.push('updated_at = NOW()');
    
    // Add ID to query params
    queryParams.push(id);
    
    // Execute update query
    await pool.query(
      `UPDATE sessions SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );
    
    // Get the updated session
    const [updatedSession] = await pool.query(
      `SELECT s.*, u.first_name, u.last_name, 
       CONCAT(u.first_name, ' ', u.last_name) as doctor_name
       FROM sessions s
       LEFT JOIN users u ON s.doctor_id = u.id
       WHERE s.id = ?`,
      [id]
    );
    
    res.status(200).json(updatedSession[0]);
  } catch (error) {
    console.error('Error in updateSession:', error);
    res.status(500).json({ message: 'Failed to update session', error: error.message });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting session ID: ${id}`);
    
    // Check if session exists
    const [existingSession] = await pool.query(
      'SELECT * FROM sessions WHERE id = ?',
      [id]
    );
    
    if (existingSession.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Delete the session
    await pool.query('DELETE FROM sessions WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSession:', error);
    res.status(500).json({ message: 'Failed to delete session', error: error.message });
  }
};
