const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

// Get all scheduled sessions for a center
exports.getScheduledSessionsByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT ss.*, s.weekday, s.recurrence_pattern,
      CONCAT(u.first_name, ' ', u.last_name) as doctor_name
      FROM schedule_sessions ss
      LEFT JOIN sessions s ON ss.session_id = s.id
      LEFT JOIN users u ON s.doctor_id = u.id
      WHERE ss.center_id = ?
    `;
    
    const queryParams = [centerId];
    
    if (startDate && endDate) {
      query += ` AND ss.session_date BETWEEN ? AND ?`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND ss.session_date >= ?`;
      queryParams.push(startDate);
    } else if (endDate) {
      query += ` AND ss.session_date <= ?`;
      queryParams.push(endDate);
    }
    
    query += ` ORDER BY ss.session_date ASC, ss.start_time ASC`;
    
    const [scheduledSessions] = await pool.query(query, queryParams);
    
    res.status(200).json(scheduledSessions);
  } catch (error) {
    console.error('Error in getScheduledSessionsByCenter:', error);
    res.status(500).json({ message: 'Failed to fetch scheduled sessions', error: error.message });
  }
};

// Create a new scheduled session
exports.createScheduledSession = async (req, res) => {
  try {
    console.log('Received create scheduled session request:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { 
      center_id, 
      session_id, 
      session_date, 
      start_time, 
      end_time, 
      available_beds,
      notes
    } = req.body;
    
    console.log('Extracted data:', { center_id, session_id, session_date, start_time, end_time, available_beds, notes });
    
    // Hard-code created_by_id to 1000 for now
    const created_by_id = 1000;
    
    console.log('Executing insert query with params:', [center_id, session_id || null, session_date, start_time, end_time, available_beds, notes || null, created_by_id]);
    
    // Use a transaction to ensure both the session and beds are created
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Insert the scheduled session
      const [result] = await connection.query(
        `INSERT INTO schedule_sessions 
         (center_id, session_id, session_date, start_time, end_time, available_beds, notes, status, created_by_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
        [center_id, session_id || null, session_date, start_time, end_time, available_beds, notes || null, created_by_id]
      );
      
      const scheduleSessionId = result.insertId;
      console.log('Created scheduled session with ID:', scheduleSessionId);
      
      // Get all active beds for this center
      const [beds] = await connection.query(
        `SELECT id FROM beds WHERE center_id = ? AND status = 'active'`,
        [center_id]
      );
      
      console.log(`Found ${beds.length} active beds for center ${center_id}`);
      
      // Create session_beds entries for each bed
      if (beds.length > 0) {
        // Prepare values for bulk insert
        const sessionBedValues = beds.map(bed => [scheduleSessionId, bed.id, 'available']);
        
        // Insert all session_beds records
        await connection.query(
          `INSERT INTO session_beds (schedule_session_id, bed_id, status) VALUES ?`,
          [sessionBedValues]
        );
        
        console.log(`Created ${sessionBedValues.length} session_beds records`);
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the newly created session with all details
      const [newSession] = await connection.query(
        `SELECT ss.*, s.weekday, s.recurrence_pattern,
         CONCAT(u.first_name, ' ', u.last_name) as doctor_name
         FROM schedule_sessions ss
         LEFT JOIN sessions s ON ss.session_id = s.id
         LEFT JOIN users u ON s.doctor_id = u.id
         WHERE ss.id = ?`,
        [scheduleSessionId]
      );
      
      console.log('Returning new session:', newSession[0]);
      
      res.status(201).json(newSession[0]);
    } catch (error) {
      // Rollback in case of error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error('Error in createScheduledSession:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check if it's a database error
    if (error.code && error.errno) {
      console.error('MySQL error code:', error.code);
      console.error('MySQL error number:', error.errno);
      console.error('MySQL error SQL state:', error.sqlState);
      console.error('MySQL error message:', error.sqlMessage);
    }
    
    res.status(500).json({ message: 'Failed to create scheduled session', error: error.message });
  }
};

// Update a scheduled session
exports.updateScheduledSession = async (req, res) => {
  try {
    console.log('Received update scheduled session request:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { 
      session_id, 
      session_date, 
      start_time, 
      end_time, 
      available_beds,
      notes,
      status
    } = req.body;
    
    console.log('Extracted data:', { id, session_id, session_date, start_time, end_time, available_beds, notes, status });
    
    // Validate session_date format if provided
    if (session_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(session_date)) {
        return res.status(400).json({ 
          errors: [{ 
            type: "field", 
            value: session_date, 
            msg: "Session date must be a valid date", 
            path: "session_date", 
            location: "body" 
          }] 
        });
      }
    }
    
    // Use a transaction to ensure all updates are atomic
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // First, get the current session to check if available_beds has changed
      const [currentSession] = await connection.query(
        `SELECT * FROM schedule_sessions WHERE id = ?`,
        [id]
      );
      
      if (currentSession.length === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Scheduled session not found' });
      }
      
      // Build update query dynamically
      let updateQuery = 'UPDATE schedule_sessions SET ';
      const updateValues = [];
      const updateFields = [];
      
      if (session_id !== undefined) {
        updateFields.push('session_id = ?');
        updateValues.push(session_id === null ? null : session_id);
      }
      
      if (session_date) {
        updateFields.push('session_date = ?');
        updateValues.push(session_date);
      }
      
      if (start_time) {
        updateFields.push('start_time = ?');
        updateValues.push(start_time);
      }
      
      if (end_time) {
        updateFields.push('end_time = ?');
        updateValues.push(end_time);
      }
      
      if (available_beds !== undefined) {
        updateFields.push('available_beds = ?');
        updateValues.push(available_beds);
      }
      
      if (notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(notes);
      }
      
      if (status) {
        updateFields.push('status = ?');
        updateValues.push(status);
      }
      
      // If no fields to update, return error
      if (updateFields.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: 'No fields to update' });
      }
      
      updateQuery += updateFields.join(', ');
      updateQuery += ' WHERE id = ?';
      updateValues.push(id);
      
      console.log('Update query:', updateQuery);
      console.log('Update values:', updateValues);
      
      // Update the scheduled session
      const [result] = await connection.query(updateQuery, updateValues);
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: 'Scheduled session not found' });
      }
      
      // Handle changes to available_beds
      if (available_beds !== undefined && available_beds !== currentSession[0].available_beds) {
        console.log(`Available beds changed from ${currentSession[0].available_beds} to ${available_beds}`);
        
        // Get current session_beds
        const [currentBeds] = await connection.query(
          `SELECT * FROM session_beds WHERE schedule_session_id = ? ORDER BY bed_id`,
          [id]
        );
        
        console.log(`Current session has ${currentBeds.length} bed records`);
        
        // Get center_id from the session
        const center_id = currentSession[0].center_id;
        
        // Get all beds for this center
        const [allCenterBeds] = await connection.query(
          `SELECT * FROM beds WHERE center_id = ? AND status = 'active' ORDER BY id`,
          [center_id]
        );
        
        console.log(`Center has ${allCenterBeds.length} active beds`);
        
        // If we need to reduce the number of beds
        if (available_beds < currentBeds.length) {
          console.log(`Reducing beds from ${currentBeds.length} to ${available_beds}`);
          
          // Check if any of the beds to be removed are already assigned
          const [assignedBeds] = await connection.query(
            `SELECT * FROM session_beds 
             WHERE schedule_session_id = ? 
             AND status != 'available' 
             ORDER BY bed_id DESC 
             LIMIT ?`,
            [id, currentBeds.length - available_beds]
          );
          
          if (assignedBeds.length > 0) {
            // Cannot reduce beds that are already assigned
            await connection.rollback();
            return res.status(400).json({ 
              message: 'Cannot reduce available beds because some beds are already assigned to patients' 
            });
          }
          
          // Delete excess beds (starting from the highest bed_id)
          await connection.query(
            `DELETE FROM session_beds 
             WHERE schedule_session_id = ? 
             ORDER BY bed_id DESC 
             LIMIT ?`,
            [id, currentBeds.length - available_beds]
          );
          
          console.log(`Deleted ${currentBeds.length - available_beds} excess bed records`);
        }
        // If we need to add more beds
        else if (available_beds > currentBeds.length) {
          console.log(`Increasing beds from ${currentBeds.length} to ${available_beds}`);
          
          // Calculate how many more beds we need
          const bedsToAdd = available_beds - currentBeds.length;
          
          // Make sure we have enough beds in the center
          if (allCenterBeds.length < available_beds) {
            await connection.rollback();
            return res.status(400).json({ 
              message: `Cannot add more beds than the center has (center has ${allCenterBeds.length} beds)` 
            });
          }
          
          // Get the bed IDs that are already assigned to this session
          const existingBedIds = currentBeds.map(bed => bed.bed_id);
          
          // Find beds that aren't already assigned to this session
          const availableBeds = allCenterBeds
            .filter(bed => !existingBedIds.includes(bed.id))
            .slice(0, bedsToAdd);
          
          if (availableBeds.length < bedsToAdd) {
            await connection.rollback();
            return res.status(400).json({ 
              message: 'Not enough available beds in the center' 
            });
          }
          
          // Prepare values for bulk insert
          const sessionBedValues = availableBeds.map(bed => [id, bed.id, 'available']);
          
          // Insert new session_beds records
          if (sessionBedValues.length > 0) {
            await connection.query(
              `INSERT INTO session_beds (schedule_session_id, bed_id, status) VALUES ?`,
              [sessionBedValues]
            );
            
            console.log(`Added ${sessionBedValues.length} new bed records`);
          }
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the updated session
      const [updatedSession] = await connection.query(
        `SELECT ss.*, s.weekday, s.recurrence_pattern,
         CONCAT(u.first_name, ' ', u.last_name) as doctor_name
         FROM schedule_sessions ss
         LEFT JOIN sessions s ON ss.session_id = s.id
         LEFT JOIN users u ON s.doctor_id = u.id
         WHERE ss.id = ?`,
        [id]
      );
      
      res.status(200).json(updatedSession[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in updateScheduledSession:', error);
    res.status(500).json({ message: 'Failed to update scheduled session', error: error.message });
  }
};

// Delete a scheduled session
exports.deleteScheduledSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if session exists
    const [existingSession] = await pool.query(
      'SELECT * FROM schedule_sessions WHERE id = ?',
      [id]
    );
    
    if (existingSession.length === 0) {
      return res.status(404).json({ message: 'Scheduled session not found' });
    }
    
    // Delete the session
    await pool.query('DELETE FROM schedule_sessions WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Scheduled session deleted successfully' });
  } catch (error) {
    console.error('Error in deleteScheduledSession:', error);
    res.status(500).json({ message: 'Failed to delete scheduled session', error: error.message });
  }
};

// Generate scheduled sessions from recurring sessions
exports.generateScheduledSessions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { center_id, start_date, end_date, session_ids } = req.body;
    
    // Hard-code created_by_id to 1000 for now
    const created_by_id = 1000;
    
    // Validate date range
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    
    // Get recurring sessions
    let query = `SELECT * FROM sessions WHERE center_id = ?`;
    const queryParams = [center_id];
    
    if (session_ids && session_ids.length > 0) {
      query += ` AND id IN (?)`;
      queryParams.push(session_ids);
    }
    
    const [sessions] = await pool.query(query, queryParams);
    
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No recurring sessions found' });
    }
    
    // Generate dates between start_date and end_date
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const dates = [];
    
    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt));
    }
    
    // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap = {
      'sun': 0,
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6
    };
    
    // Get all active beds for this center
    const [beds] = await pool.query(
      `SELECT id FROM beds WHERE center_id = ? AND status = 'active'`,
      [center_id]
    );
    
    console.log(`Found ${beds.length} active beds for center ${center_id}`);
    
    // Generate scheduled sessions
    const scheduledSessions = [];
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Process each session one by one instead of batch
      for (const session of sessions) {
        // Filter dates based on session weekday
        const sessionDates = dates.filter(date => date.getDay() === dayMap[session.weekday]);
        
        for (const date of sessionDates) {
          const formattedDate = date.toISOString().split('T')[0];
          
          // Check if session already exists for this date
          const [existingSessions] = await connection.query(
            `SELECT * FROM schedule_sessions 
             WHERE center_id = ? AND session_id = ? AND session_date = ?`,
            [center_id, session.id, formattedDate]
          );
          
          if (existingSessions.length === 0) {
            // Create new scheduled session individually
            const [result] = await connection.query(
              `INSERT INTO schedule_sessions 
               (center_id, session_id, session_date, start_time, end_time, available_beds, notes, status, created_by_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
              [
                center_id,
                session.id,
                formattedDate,
                session.start_time,
                session.end_time,
                session.default_capacity,
                null, // notes
                created_by_id
              ]
            );
            
            const scheduleSessionId = result.insertId;
            
            // Create session_beds entries for each bed
            if (beds.length > 0) {
              // Prepare values for bulk insert
              const sessionBedValues = beds.map(bed => [scheduleSessionId, bed.id, 'available']);
              
              // Insert all session_beds records
              await connection.query(
                `INSERT INTO session_beds (schedule_session_id, bed_id, status) VALUES ?`,
                [sessionBedValues]
              );
              
              console.log(`Created ${sessionBedValues.length} session_beds records for session ${scheduleSessionId}`);
            }
            
            // Get the newly created session
            const [newSession] = await connection.query(
              `SELECT * FROM schedule_sessions WHERE id = ?`,
              [scheduleSessionId]
            );
            
            scheduledSessions.push(newSession[0]);
          }
        }
      }
      
      await connection.commit();
      console.log(`Generated ${scheduledSessions.length} scheduled sessions with bed assignments`);
      res.status(201).json(scheduledSessions);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in generateScheduledSessions:', error);
    res.status(500).json({ message: 'Failed to generate scheduled sessions', error: error.message });
  }
};
