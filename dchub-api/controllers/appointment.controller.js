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
    
    const { centerId, date, startTime, endTime, type, staffId, doctorId, patientId, bedId } = req.body;
    
    // Check if center exists
    const [center] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [centerId]
    );
    
    if (!center || center.length === 0) {
      return res.status(404).json({ message: 'Center not found' });
    }
    
    // Create a scheduled session first
    const [scheduleSessionResult] = await pool.query(
      `INSERT INTO schedule_sessions (center_id, session_date, start_time, end_time, available_beds, notes)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [centerId, date, startTime, endTime, `${type} appointment slot`]
    );
    
    const scheduleSessionId = scheduleSessionResult.insertId;
    
    // Create the appointment entry
    const [appointmentResult] = await pool.query(
      `INSERT INTO appointments (schedule_session_id, bed_id, patient_id, staff_id, doctor_id, notes, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'scheduled', NOW())`,
      [
        scheduleSessionId, 
        bedId === 'none' ? null : bedId, 
        patientId === 'none' ? null : patientId, 
        staffId === 'none' ? null : staffId, 
        doctorId === 'none' ? null : doctorId, 
        `${type} appointment`
      ]
    );
    
    // Get the created appointment with center info
    const [newAppointment] = await pool.query(
      `SELECT a.*, ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime, 
              c.name as centerName, c.id as centerId
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       WHERE a.id = ?`,
      [appointmentResult.insertId]
    );
    
    if (!newAppointment || newAppointment.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve created appointment' });
    }
    
    // Return a properly formatted response
    res.status(201).json({
      id: newAppointment[0].id,
      scheduleSessionId: newAppointment[0].schedule_session_id,
      patientId: newAppointment[0].patient_id,
      staffId: newAppointment[0].staff_id,
      doctorId: newAppointment[0].doctor_id,
      bedId: newAppointment[0].bed_id,
      centerId: newAppointment[0].centerId,
      centerName: newAppointment[0].centerName,
      date: newAppointment[0].date,
      startTime: newAppointment[0].startTime,
      endTime: newAppointment[0].endTime,
      status: newAppointment[0].status,
      notes: newAppointment[0].notes,
      type: type // Include the appointment type in the response
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

// Get appointment details with related information
exports.getAppointmentDetails = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    // Get appointment with related information
    const [appointment] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime,
              c.id as centerId, c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName,
              CONCAT(s.first_name, ' ', s.last_name) as staffName,
              CONCAT(d.first_name, ' ', d.last_name) as doctorName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       LEFT JOIN users s ON a.staff_id = s.id
       LEFT JOIN users d ON a.doctor_id = d.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Format the response
    const appointmentDetails = {
      id: appointment[0].id,
      scheduleSessionId: appointment[0].schedule_session_id,
      centerId: appointment[0].centerId,
      centerName: appointment[0].centerName,
      date: appointment[0].date,
      startTime: appointment[0].startTime,
      endTime: appointment[0].endTime,
      patientId: appointment[0].patient_id,
      patientName: appointment[0].patientName,
      staffId: appointment[0].staff_id,
      staffName: appointment[0].staffName,
      doctorId: appointment[0].doctor_id,
      doctorName: appointment[0].doctorName,
      bedId: appointment[0].bed_id,
      bedCode: appointment[0].bedCode,
      status: appointment[0].status,
      notes: appointment[0].notes,
      createdAt: appointment[0].created_at,
      updatedAt: appointment[0].updated_at
    };
    
    res.status(200).json(appointmentDetails);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
