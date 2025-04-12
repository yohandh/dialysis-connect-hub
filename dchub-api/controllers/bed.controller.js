const { pool } = require('../config/db');

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
    
    res.status(200).json({ message: 'Bed deleted successfully', id });
  } catch (error) {
    console.error('Error deleting bed:', error);
    res.status(500).json({ message: 'Failed to delete bed', error: error.message });
  }
};
