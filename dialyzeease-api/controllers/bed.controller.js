const { pool } = require('../config/db');
const auditService = require('../services/auditService');

// Get all beds for a specific center
exports.getBedsByCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    
    const [beds] = await pool.query(
      'SELECT * FROM beds WHERE center_id = ? ORDER BY code ASC',
      [centerId]
    );
    
    res.status(200).json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ message: 'Failed to fetch beds', error: error.message });
  }
};

// Create a new bed
exports.createBed = async (req, res) => {
  try {
    console.log('Create bed request received:', req.body);
    const { center_id, code } = req.body;
    
    if (!center_id || !code) {
      console.log('Missing required fields:', { center_id, code });
      return res.status(400).json({ message: 'Center ID and bed code are required' });
    }
    
    // Check if bed code already exists for this center
    const [existing] = await pool.query(
      'SELECT * FROM beds WHERE center_id = ? AND code = ?',
      [center_id, code]
    );
    
    if (existing.length > 0) {
      console.log('Bed code already exists:', code);
      return res.status(409).json({ message: 'A bed with this code already exists in this center' });
    }
    
    console.log('Inserting new bed:', { center_id, code });
    const [result] = await pool.query(
      'INSERT INTO beds (center_id, code, status) VALUES (?, ?, ?)',
      [center_id, code, 'active']
    );
    
    const [newBed] = await pool.query(
      'SELECT * FROM beds WHERE id = ?',
      [result.insertId]
    );
    
    console.log('Bed created successfully:', newBed[0]);
    res.status(201).json(newBed[0]);
  } catch (error) {
    console.error('Error creating bed:', error);
    res.status(500).json({ message: 'Failed to create bed', error: error.message });
  }
};

// Update a bed
exports.updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, status } = req.body;
    
    if (!code && !status) {
      return res.status(400).json({ message: 'At least one field (code or status) is required for update' });
    }
    
    // Check if bed exists
    const [existing] = await pool.query(
      'SELECT * FROM beds WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // If code is being updated, check for duplicates
    if (code && code !== existing[0].code) {
      const [duplicate] = await pool.query(
        'SELECT * FROM beds WHERE center_id = ? AND code = ? AND id != ?',
        [existing[0].center_id, code, id]
      );
      
      if (duplicate.length > 0) {
        return res.status(409).json({ message: 'A bed with this code already exists in this center' });
      }
    }
    
    // Update the bed
    await pool.query(
      'UPDATE beds SET code = ?, status = ? WHERE id = ?',
      [code || existing[0].code, status || existing[0].status, id]
    );
    
    // Get the updated bed
    const [updated] = await pool.query(
      'SELECT * FROM beds WHERE id = ?',
      [id]
    );
    
    res.status(200).json(updated[0]);
  } catch (error) {
    console.error('Error updating bed:', error);
    res.status(500).json({ message: 'Failed to update bed', error: error.message });
  }
};

// Delete a bed
exports.deleteBed = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if bed exists
    const [existing] = await pool.query(
      'SELECT * FROM beds WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Bed not found' });
    }
    
    // Check if bed is in use in any appointments
    const [inUse] = await pool.query(
      'SELECT COUNT(*) as count FROM appointments WHERE bed_id = ?',
      [id]
    );
    
    if (inUse[0].count > 0) {
      return res.status(409).json({ 
        message: 'Cannot delete bed as it is associated with appointments',
        inUseCount: inUse[0].count
      });
    }
    
    // Delete the bed
    await pool.query(
      'DELETE FROM beds WHERE id = ?',
      [id]
    );
    
    // Log the audit
    await auditService.logAction('beds', id, 'delete', req.user?.userId, existing[0], null, req.ip, req.headers['user-agent']);
    
    res.status(200).json({ message: 'Bed deleted successfully', id });
  } catch (error) {
    console.error('Error deleting bed:', error);
    res.status(500).json({ message: 'Failed to delete bed', error: error.message });
  }
};

// Get available beds for a specific schedule session
exports.getAvailableBedsForSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // First, get the center ID and session details for this schedule session
    const [sessionResult] = await pool.query(
      'SELECT center_id, session_date, start_time, end_time FROM schedule_sessions WHERE id = ?',
      [sessionId]
    );
    
    if (sessionResult.length === 0) {
      return res.status(404).json({ message: 'Schedule session not found' });
    }
    
    const centerId = sessionResult[0].center_id;
    const sessionDate = sessionResult[0].session_date;
    const startTime = sessionResult[0].start_time;
    const endTime = sessionResult[0].end_time;
    
    console.log(`Finding available beds for center ${centerId}, session ${sessionId} on ${sessionDate} from ${startTime} to ${endTime}`);
    
    // Get all active beds for this center
    const [allBeds] = await pool.query(
      'SELECT * FROM beds WHERE center_id = ? AND status = "active" ORDER BY code ASC',
      [centerId]
    );
    
    if (allBeds.length === 0) {
      return res.status(200).json([]);
    }
    
    console.log(`Total active beds for center ${centerId}: ${allBeds.length}`);
    
    // Get beds that are already booked for this session or any overlapping sessions
    // This query finds beds that are already booked in appointments for:
    // 1. The exact same schedule session
    // 2. Any other schedule session that overlaps in time on the same date
    const [bookedBeds] = await pool.query(
      `SELECT DISTINCT a.bed_id 
       FROM appointments a 
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id 
       WHERE a.status = 'scheduled' 
       AND ss.center_id = ? 
       AND ss.session_date = ? 
       AND (
         (ss.start_time < ? AND ss.end_time > ?) OR  -- Session starts before and ends after our start time
         (ss.start_time < ? AND ss.end_time > ?) OR  -- Session starts before and ends after our end time
         (ss.start_time >= ? AND ss.end_time <= ?) OR  -- Session is completely within our time range
         (ss.start_time <= ? AND ss.end_time >= ?)    -- Our session is completely within this session
       )`,
      [
        centerId, 
        sessionDate, 
        startTime, startTime,  // For first condition
        endTime, endTime,      // For second condition
        startTime, endTime,    // For third condition
        startTime, endTime     // For fourth condition
      ]
    );
    
    // Create a set of booked bed IDs for easy lookup
    const bookedBedIds = new Set(bookedBeds.map(bed => bed.bed_id));
    
    console.log(`Booked bed IDs for this session: ${Array.from(bookedBedIds).join(', ')}`);
    
    // Filter out booked beds
    const availableBeds = allBeds.filter(bed => !bookedBedIds.has(bed.id));
    
    console.log(`Available beds: ${availableBeds.length}`);
    
    res.status(200).json(availableBeds);
  } catch (error) {
    console.error('Error fetching available beds:', error);
    res.status(500).json({ message: 'Failed to fetch available beds', error: error.message });
  }
};
