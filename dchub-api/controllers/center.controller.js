const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Get all centers
exports.getAllCenters = async (req, res) => {
  try {
    const [centers] = await pool.query(
      `SELECT * FROM centers ORDER BY name ASC`
    );
    
    // Format the response to match frontend expectations
    const formattedCenters = centers.map(center => ({
      id: center.id,
      name: center.name,
      address: center.address,
      city: center.city,
      state: center.state,
      zipCode: center.zipCode,
      phone: center.phone,
      email: center.email,
      capacity: center.capacity,
      currentPatients: center.currentPatients,
      services: center.services ? JSON.parse(center.services) : [],
      operatingHours: center.operatingHours ? JSON.parse(center.operatingHours) : {},
      nephrologists: center.nephrologists ? JSON.parse(center.nephrologists) : [],
      imageUrl: center.imageUrl
    }));
    
    res.status(200).json(formattedCenters);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get center by ID
exports.getCenterById = async (req, res) => {
  try {
    const centerId = req.params.id;
    
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (!center || center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Format the response to match frontend expectations
    const formattedCenter = {
      id: center[0].id,
      name: center[0].name,
      address: center[0].address,
      city: center[0].city,
      state: center[0].state,
      zipCode: center[0].zipCode,
      phone: center[0].phone,
      email: center[0].email,
      capacity: center[0].capacity,
      currentPatients: center[0].currentPatients,
      services: center[0].services ? JSON.parse(center[0].services) : [],
      operatingHours: center[0].operatingHours ? JSON.parse(center[0].operatingHours) : {},
      nephrologists: center[0].nephrologists ? JSON.parse(center[0].nephrologists) : [],
      imageUrl: center[0].imageUrl
    };
    
    res.status(200).json(formattedCenter);
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
    
    const {
      name, address, city, state, zipCode, phone, email,
      capacity, services, operatingHours, imageUrl
    } = req.body;
    
    // Insert the new center
    const [result] = await pool.query(
      `INSERT INTO centers (
        name, address, city, state, zipCode, phone, email,
        capacity, currentPatients, services, operatingHours, nephrologists,
        imageUrl, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name, address, city, state, zipCode, phone, email,
        capacity, JSON.stringify(services), JSON.stringify(operatingHours),
        JSON.stringify([]), imageUrl || null
      ]
    );
    
    // Get the created center
    const [newCenter] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [result.insertId]
    );
    
    // Format the response to match frontend expectations
    const formattedCenter = {
      id: newCenter[0].id,
      name: newCenter[0].name,
      address: newCenter[0].address,
      city: newCenter[0].city,
      state: newCenter[0].state,
      zipCode: newCenter[0].zipCode,
      phone: newCenter[0].phone,
      email: newCenter[0].email,
      capacity: newCenter[0].capacity,
      currentPatients: newCenter[0].currentPatients,
      services: newCenter[0].services ? JSON.parse(newCenter[0].services) : [],
      operatingHours: newCenter[0].operatingHours ? JSON.parse(newCenter[0].operatingHours) : {},
      nephrologists: newCenter[0].nephrologists ? JSON.parse(newCenter[0].nephrologists) : [],
      imageUrl: newCenter[0].imageUrl
    };
    
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
    const {
      name, address, city, state, zipCode, phone, email,
      capacity, services, operatingHours, nephrologists, imageUrl
    } = req.body;
    
    // Check if center exists
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (!center || center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let updateParams = [];
    
    if (name) {
      updateFields.push('name = ?');
      updateParams.push(name);
    }
    
    if (address) {
      updateFields.push('address = ?');
      updateParams.push(address);
    }
    
    if (city) {
      updateFields.push('city = ?');
      updateParams.push(city);
    }
    
    if (state) {
      updateFields.push('state = ?');
      updateParams.push(state);
    }
    
    if (zipCode) {
      updateFields.push('zipCode = ?');
      updateParams.push(zipCode);
    }
    
    if (phone) {
      updateFields.push('phone = ?');
      updateParams.push(phone);
    }
    
    if (email) {
      updateFields.push('email = ?');
      updateParams.push(email);
    }
    
    if (capacity) {
      updateFields.push('capacity = ?');
      updateParams.push(capacity);
    }
    
    if (services) {
      updateFields.push('services = ?');
      updateParams.push(JSON.stringify(services));
    }
    
    if (operatingHours) {
      updateFields.push('operatingHours = ?');
      updateParams.push(JSON.stringify(operatingHours));
    }
    
    if (nephrologists) {
      updateFields.push('nephrologists = ?');
      updateParams.push(JSON.stringify(nephrologists));
    }
    
    if (imageUrl !== undefined) {
      updateFields.push('imageUrl = ?');
      updateParams.push(imageUrl);
    }
    
    updateFields.push('updatedAt = NOW()');
    updateParams.push(centerId);
    
    // Update center
    await pool.query(
      `UPDATE centers
       SET ${updateFields.join(', ')}
       WHERE id = ?`,
      updateParams
    );
    
    // Get the updated center
    const [updatedCenter] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    // Format the response to match frontend expectations
    const formattedCenter = {
      id: updatedCenter[0].id,
      name: updatedCenter[0].name,
      address: updatedCenter[0].address,
      city: updatedCenter[0].city,
      state: updatedCenter[0].state,
      zipCode: updatedCenter[0].zipCode,
      phone: updatedCenter[0].phone,
      email: updatedCenter[0].email,
      capacity: updatedCenter[0].capacity,
      currentPatients: updatedCenter[0].currentPatients,
      services: updatedCenter[0].services ? JSON.parse(updatedCenter[0].services) : [],
      operatingHours: updatedCenter[0].operatingHours ? JSON.parse(updatedCenter[0].operatingHours) : {},
      nephrologists: updatedCenter[0].nephrologists ? JSON.parse(updatedCenter[0].nephrologists) : [],
      imageUrl: updatedCenter[0].imageUrl
    };
    
    res.status(200).json(formattedCenter);
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
    
    // Check if center has appointments
    const [appointments] = await pool.query(
      `SELECT COUNT(*) as count FROM appointments WHERE centerId = ?`,
      [centerId]
    );
    
    if (appointments[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete center with existing appointments. Please delete or reassign appointments first.' 
      });
    }
    
    // Delete center
    await pool.query(
      `DELETE FROM centers WHERE id = ?`,
      [centerId]
    );
    
    res.status(200).json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Error deleting center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
