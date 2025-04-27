const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
const { objectToClientFormat, objectToDatabaseFormat } = require('../utils/transformers');

// Get all centers
exports.getAllCenters = async (req, res) => {
  try {
    // Get all active centers
    const [centers] = await pool.query(`SELECT * FROM centers WHERE is_active = 1 ORDER BY name ASC`);
    
    // Get all center hours
    const [allCenterHours] = await pool.query(`SELECT * FROM center_hours`);
    
    // Group center hours by center_id
    const centerHoursMap = {};
    allCenterHours.forEach(hour => {
      if (!centerHoursMap[hour.center_id]) {
        centerHoursMap[hour.center_id] = [];
      }
      centerHoursMap[hour.center_id].push(hour);
    });
    
    // Add center hours to each center
    const centersWithHours = centers.map(center => ({
      ...center,
      center_hours: centerHoursMap[center.id] || []
    }));
    
    // Transform database snake_case to client camelCase
    const formattedCenters = centersWithHours.map(center => objectToClientFormat(center));
    
    console.log('Formatted centers for frontend:', formattedCenters);
    
    res.json(formattedCenters);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get center by ID
exports.getCenterById = async (req, res) => {
  try {
    const centerId = req.params.id;
    
    // Get center
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Get center hours
    const [centerHours] = await pool.query(
      `SELECT * FROM center_hours WHERE center_id = ?`,
      [centerId]
    );
    
    // Add center hours to center
    const centerWithHours = {
      ...center[0],
      center_hours: centerHours
    };
    
    // Transform database snake_case to client camelCase
    const formattedCenter = objectToClientFormat(centerWithHours);
    
    res.json(formattedCenter);
  } catch (error) {
    console.error('Error fetching center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new center
exports.createCenter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Received center data:', req.body);
    
    // Transform client camelCase to database snake_case
    const dbFormatData = objectToDatabaseFormat(req.body);
    console.log('Transformed data for database:', dbFormatData);
    
    // Extract fields from transformed data
    const {
      name, 
      address, 
      contact_no, 
      email,
      total_capacity,
      manage_by_id,
      center_hours = []
    } = dbFormatData;
    
    // Insert the new center with only fields that exist in the database schema
    const [result] = await pool.query(
      `INSERT INTO centers (
        name, address, contact_no, email,
        total_capacity, is_active, manage_by_id
      ) VALUES (?, ?, ?, ?, ?, 1, ?)`,
      [
        name, 
        address, 
        contact_no, 
        email,
        total_capacity,
        manage_by_id || null
      ]
    );
    
    // If center_hours data is provided, insert it into the center_hours table
    if (center_hours && center_hours.length > 0) {
      // For each day in center_hours, insert a record
      const centerHoursPromises = center_hours.map(hourData => {
        return pool.query(
          `INSERT INTO center_hours (center_id, weekday, open_time, close_time) 
           VALUES (?, ?, ?, ?)`,
          [result.insertId, hourData.weekday, hourData.open_time, hourData.close_time]
        );
      });
      
      await Promise.all(centerHoursPromises);
    }
    
    // Get the created center
    const [newCenter] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [result.insertId]
    );
    
    // Get center hours
    const [dbCenterHours] = await pool.query(
      `SELECT * FROM center_hours WHERE center_id = ?`,
      [result.insertId]
    );
    
    console.log('New center from database:', newCenter[0]);
    console.log('Center hours from database:', dbCenterHours);
    
    // Transform database snake_case to client camelCase
    const formattedCenter = objectToClientFormat({
      ...newCenter[0],
      center_hours: dbCenterHours
    });
    
    res.status(201).json(formattedCenter);
  } catch (error) {
    console.error('Error creating center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update center
exports.updateCenter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const centerId = req.params.id;
    
    console.log('Updating center with ID:', centerId);
    console.log('Received update data:', req.body);
    
    // Transform client camelCase to database snake_case
    const dbFormatData = objectToDatabaseFormat(req.body);
    console.log('Mapped fields:', dbFormatData);
    
    // Build the SQL query dynamically based on what fields are provided
    const updateFields = [];
    const updateValues = [];
    
    if (dbFormatData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(dbFormatData.name);
    }
    
    if (dbFormatData.address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(dbFormatData.address);
    }
    
    if (dbFormatData.contact_no !== undefined) {
      updateFields.push('contact_no = ?');
      updateValues.push(dbFormatData.contact_no);
    }
    
    if (dbFormatData.email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(dbFormatData.email);
    }
    
    if (dbFormatData.total_capacity !== undefined) {
      updateFields.push('total_capacity = ?');
      updateValues.push(dbFormatData.total_capacity);
    }
    
    if (dbFormatData.manage_by_id !== undefined) {
      updateFields.push('manage_by_id = ?');
      updateValues.push(dbFormatData.manage_by_id === 0 ? null : dbFormatData.manage_by_id);
    }
    
    if (dbFormatData.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(dbFormatData.is_active ? 1 : 0);
    }
    
    // Only update if there are fields to update
    if (updateFields.length > 0) {
      updateValues.push(centerId); // Add centerId for the WHERE clause
      
      const updateQuery = `
        UPDATE centers 
        SET ${updateFields.join(', ')} 
        WHERE id = ?
      `;
      
      await pool.query(updateQuery, updateValues);
    }
    
    // Handle center hours separately
    if (dbFormatData.center_hours && dbFormatData.center_hours.length > 0) {
      // First, delete existing hours for this center
      await pool.query(
        `DELETE FROM center_hours WHERE center_id = ?`,
        [centerId]
      );
      
      // Then, insert the new hours
      const centerHoursPromises = dbFormatData.center_hours.map(hourData => {
        return pool.query(
          `INSERT INTO center_hours (center_id, weekday, open_time, close_time) 
           VALUES (?, ?, ?, ?)`,
          [centerId, hourData.weekday, hourData.open_time, hourData.close_time]
        );
      });
      
      await Promise.all(centerHoursPromises);
    }
    
    // Get the updated center
    const [updatedCenter] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (updatedCenter.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Get center hours
    const [dbCenterHours] = await pool.query(
      `SELECT * FROM center_hours WHERE center_id = ?`,
      [centerId]
    );
    
    // Transform database snake_case to client camelCase
    const formattedCenter = objectToClientFormat({
      ...updatedCenter[0],
      center_hours: dbCenterHours
    });
    
    res.json(formattedCenter);
  } catch (error) {
    console.error('Error updating center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete center
exports.deleteCenter = async (req, res) => {
  try {
    const centerId = req.params.id;
    
    // Check if center exists
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (!center || center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Instead of deleting, set is_active to 0
    await pool.query(
      `UPDATE centers SET is_active = 0 WHERE id = ?`,
      [centerId]
    );
    
    res.status(200).json({ message: 'Center deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
