const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       ORDER BY a.date DESC, a.startTime ASC`
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      type: apt.type,
      notes: apt.notes
    }));
    
    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    const [appointment] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json({
      id: appointment[0].id,
      patientId: appointment[0].patientId,
      centerId: appointment[0].centerId,
      centerName: appointment[0].centerName,
      date: appointment[0].date,
      startTime: appointment[0].startTime,
      endTime: appointment[0].endTime,
      status: appointment[0].status,
      type: appointment[0].type,
      notes: appointment[0].notes
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments by center
exports.getAppointmentsByCenter = async (req, res) => {
  try {
    const centerId = req.params.centerId;
    
    const [appointments] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.centerId = ?
       ORDER BY a.date DESC, a.startTime ASC`,
      [centerId]
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      type: apt.type,
      notes: apt.notes
    }));
    
    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments by center:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments by patient
exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    
    const [appointments] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.patientId = ?
       ORDER BY a.date DESC, a.startTime ASC`,
      [patientId]
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      type: apt.type,
      notes: apt.notes
    }));
    
    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments by patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available appointments
exports.getAvailableAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.status = 'available'
       ORDER BY a.date ASC, a.startTime ASC`
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientId: apt.patientId,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      type: apt.type,
      notes: apt.notes
    }));
    
    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching available appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create appointment slot
exports.createAppointmentSlot = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { centerId, date, startTime, endTime, type } = req.body;
    
    // Check if center exists
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (!center || center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Create appointment slot
    const [result] = await pool.query(
      `INSERT INTO appointments (centerId, date, startTime, endTime, type, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'available', NOW(), NOW())`,
      [centerId, date, startTime, endTime, type]
    );
    
    // Get the created appointment
    const [newAppointment] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      id: newAppointment[0].id,
      patientId: newAppointment[0].patientId,
      centerId: newAppointment[0].centerId,
      centerName: newAppointment[0].centerName,
      date: newAppointment[0].date,
      startTime: newAppointment[0].startTime,
      endTime: newAppointment[0].endTime,
      status: newAppointment[0].status,
      type: newAppointment[0].type,
      notes: newAppointment[0].notes
    });
  } catch (error) {
    console.error('Error creating appointment slot:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update appointment slot
exports.updateAppointmentSlot = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const appointmentId = req.params.id;
    const { centerId, date, startTime, endTime, type, status } = req.body;
    
    // Check if appointment exists
    const [appointment] = await pool.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let updateParams = [];
    
    if (centerId) {
      updateFields.push('centerId = ?');
      updateParams.push(centerId);
    }
    
    if (date) {
      updateFields.push('date = ?');
      updateParams.push(date);
    }
    
    if (startTime) {
      updateFields.push('startTime = ?');
      updateParams.push(startTime);
    }
    
    if (endTime) {
      updateFields.push('endTime = ?');
      updateParams.push(endTime);
    }
    
    if (type) {
      updateFields.push('type = ?');
      updateParams.push(type);
    }
    
    if (status) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }
    
    updateFields.push('updatedAt = NOW()');
    updateParams.push(appointmentId);
    
    // Update appointment
    await pool.query(
      `UPDATE appointments
       SET ${updateFields.join(', ')}
       WHERE id = ?`,
      updateParams
    );
    
    // Get the updated appointment
    const [updatedAppointment] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    res.status(200).json({
      id: updatedAppointment[0].id,
      patientId: updatedAppointment[0].patientId,
      centerId: updatedAppointment[0].centerId,
      centerName: updatedAppointment[0].centerName,
      date: updatedAppointment[0].date,
      startTime: updatedAppointment[0].startTime,
      endTime: updatedAppointment[0].endTime,
      status: updatedAppointment[0].status,
      type: updatedAppointment[0].type,
      notes: updatedAppointment[0].notes
    });
  } catch (error) {
    console.error('Error updating appointment slot:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete appointment slot
exports.deleteAppointmentSlot = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Check if appointment exists
    const [appointment] = await pool.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Delete appointment
    await pool.query(
      `DELETE FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment slot:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const appointmentId = req.params.id;
    const { patientId } = req.body;
    
    // Check if appointment exists and is available
    const [appointment] = await pool.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment[0].status !== 'available') {
      return res.status(400).json({ message: 'Appointment is not available' });
    }
    
    // Book the appointment
    await pool.query(
      `UPDATE appointments
       SET patientId = ?, status = 'booked', updatedAt = NOW()
       WHERE id = ?`,
      [patientId, appointmentId]
    );
    
    // Get the updated appointment
    const [updatedAppointment] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    res.status(200).json({
      id: updatedAppointment[0].id,
      patientId: updatedAppointment[0].patientId,
      centerId: updatedAppointment[0].centerId,
      centerName: updatedAppointment[0].centerName,
      date: updatedAppointment[0].date,
      startTime: updatedAppointment[0].startTime,
      endTime: updatedAppointment[0].endTime,
      status: updatedAppointment[0].status,
      type: updatedAppointment[0].type,
      notes: updatedAppointment[0].notes
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Check if appointment exists and is booked
    const [appointment] = await pool.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment[0].status !== 'booked') {
      return res.status(400).json({ message: 'Appointment is not booked' });
    }
    
    // Cancel the appointment
    await pool.query(
      `UPDATE appointments
       SET status = 'canceled', updatedAt = NOW()
       WHERE id = ?`,
      [appointmentId]
    );
    
    // Get the updated appointment
    const [updatedAppointment] = await pool.query(
      `SELECT a.*, c.name as centerName
       FROM appointments a
       JOIN centers c ON a.centerId = c.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    res.status(200).json({
      id: updatedAppointment[0].id,
      patientId: updatedAppointment[0].patientId,
      centerId: updatedAppointment[0].centerId,
      centerName: updatedAppointment[0].centerName,
      date: updatedAppointment[0].date,
      startTime: updatedAppointment[0].startTime,
      endTime: updatedAppointment[0].endTime,
      status: updatedAppointment[0].status,
      type: updatedAppointment[0].type,
      notes: updatedAppointment[0].notes
    });
  } catch (error) {
    console.error('Error canceling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
