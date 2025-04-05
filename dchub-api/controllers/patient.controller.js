const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Get patient profile
exports.getPatientProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    // Query to get patient profile from MySQL
    const [patient] = await pool.query(
      `SELECT p.*, u.name, u.email, u.mobileNo
       FROM patients p
       JOIN users u ON p.userId = u.id
       WHERE p.userId = ?`,
      [userId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    
    // Format the response to match the frontend expectations
    const patientProfile = {
      userId: patient[0].userId,
      firstName: patient[0].name ? patient[0].name.split(' ')[0] : '',
      lastName: patient[0].name ? patient[0].name.split(' ').slice(1).join(' ') : '',
      email: patient[0].email,
      dateOfBirth: patient[0].dateOfBirth,
      gender: patient[0].gender,
      bloodType: patient[0].bloodType,
      height: patient[0].height,
      weight: patient[0].weight,
      primaryNephrologist: patient[0].primaryNephrologist,
      diagnosisDate: patient[0].diagnosisDate,
      ckdStage: patient[0].ckdStage,
      dialysisStartDate: patient[0].dialysisStartDate,
      accessType: patient[0].accessType,
      comorbidities: patient[0].comorbidities ? JSON.parse(patient[0].comorbidities) : [],
      allergies: patient[0].allergies ? JSON.parse(patient[0].allergies) : [],
      medications: patient[0].medications ? JSON.parse(patient[0].medications) : [],
      address: {
        street: patient[0].street || '',
        city: patient[0].city || '',
        state: patient[0].state || '',
        zipCode: patient[0].zipCode || ''
      },
      phone: patient[0].mobileNo,
      contactPhone: patient[0].contactPhone,
      contactEmail: patient[0].contactEmail,
      emergencyContact: {
        name: patient[0].emergencyContactName || '',
        relationship: patient[0].emergencyContactRelationship || '',
        phone: patient[0].emergencyContactPhone || ''
      },
      preferredCenter: patient[0].preferredCenter,
      notificationPreferences: {
        email: patient[0].notifyEmail === 1,
        sms: patient[0].notifySms === 1,
        push: patient[0].notifyPush === 1,
        appointmentReminders: patient[0].notifyAppointments === 1,
        labResults: patient[0].notifyLabResults === 1,
        treatmentUpdates: patient[0].notifyTreatments === 1,
        medicationReminders: patient[0].notifyMedications === 1
      }
    };
    
    res.status(200).json(patientProfile);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update patient profile
exports.updatePatientProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id; // From auth middleware
    const {
      firstName, lastName, email, dateOfBirth, gender, bloodType,
      height, weight, primaryNephrologist, diagnosisDate, ckdStage,
      dialysisStartDate, accessType, comorbidities, allergies, medications,
      address, phone, contactPhone, contactEmail, emergencyContact, preferredCenter
    } = req.body;
    
    // Update user table
    if (firstName || lastName || email || phone) {
      const name = firstName && lastName ? `${firstName} ${lastName}` : undefined;
      
      const updateUserQuery = `
        UPDATE users
        SET ${name ? 'name = ?,' : ''} ${email ? 'email = ?,' : ''} ${phone ? 'mobileNo = ?,' : ''}
        updatedAt = NOW()
        WHERE id = ?
      `;
      
      const updateUserParams = [];
      if (name) updateUserParams.push(name);
      if (email) updateUserParams.push(email);
      if (phone) updateUserParams.push(phone);
      updateUserParams.push(userId);
      
      await pool.query(updateUserQuery, updateUserParams);
    }
    
    // Update patient table
    const updatePatientQuery = `
      UPDATE patients
      SET 
        dateOfBirth = COALESCE(?, dateOfBirth),
        gender = COALESCE(?, gender),
        bloodType = COALESCE(?, bloodType),
        height = COALESCE(?, height),
        weight = COALESCE(?, weight),
        primaryNephrologist = COALESCE(?, primaryNephrologist),
        diagnosisDate = COALESCE(?, diagnosisDate),
        ckdStage = COALESCE(?, ckdStage),
        dialysisStartDate = COALESCE(?, dialysisStartDate),
        accessType = COALESCE(?, accessType),
        comorbidities = COALESCE(?, comorbidities),
        allergies = COALESCE(?, allergies),
        medications = COALESCE(?, medications),
        street = COALESCE(?, street),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        zipCode = COALESCE(?, zipCode),
        contactPhone = COALESCE(?, contactPhone),
        contactEmail = COALESCE(?, contactEmail),
        emergencyContactName = COALESCE(?, emergencyContactName),
        emergencyContactRelationship = COALESCE(?, emergencyContactRelationship),
        emergencyContactPhone = COALESCE(?, emergencyContactPhone),
        preferredCenter = COALESCE(?, preferredCenter),
        updatedAt = NOW()
      WHERE userId = ?
    `;
    
    const updatePatientParams = [
      dateOfBirth,
      gender,
      bloodType,
      height,
      weight,
      primaryNephrologist,
      diagnosisDate,
      ckdStage,
      dialysisStartDate,
      accessType,
      comorbidities ? JSON.stringify(comorbidities) : null,
      allergies ? JSON.stringify(allergies) : null,
      medications ? JSON.stringify(medications) : null,
      address?.street,
      address?.city,
      address?.state,
      address?.zipCode,
      contactPhone,
      contactEmail,
      emergencyContact?.name,
      emergencyContact?.relationship,
      emergencyContact?.phone,
      preferredCenter,
      userId
    ];
    
    await pool.query(updatePatientQuery, updatePatientParams);
    
    // Return the updated profile
    return exports.getPatientProfile(req, res);
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const {
      email, sms, push, appointmentReminders,
      labResults, treatmentUpdates, medicationReminders
    } = req.body;
    
    const updateQuery = `
      UPDATE patients
      SET 
        notifyEmail = ?,
        notifySms = ?,
        notifyPush = ?,
        notifyAppointments = ?,
        notifyLabResults = ?,
        notifyTreatments = ?,
        notifyMedications = ?,
        updatedAt = NOW()
      WHERE userId = ?
    `;
    
    const updateParams = [
      email ? 1 : 0,
      sms ? 1 : 0,
      push ? 1 : 0,
      appointmentReminders ? 1 : 0,
      labResults ? 1 : 0,
      treatmentUpdates ? 1 : 0,
      medicationReminders ? 1 : 0,
      userId
    ];
    
    await pool.query(updateQuery, updateParams);
    
    res.status(200).json({
      email,
      sms,
      push,
      appointmentReminders,
      labResults,
      treatmentUpdates,
      medicationReminders
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get CKD history
exports.getCkdHistory = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    const [records] = await pool.query(
      `SELECT * FROM ckd_records
       WHERE userId = ?
       ORDER BY date DESC`,
      [userId]
    );
    
    const formattedRecords = records.map(record => ({
      id: record.id,
      date: record.date,
      eGFR: record.eGFR,
      creatinine: record.creatinine,
      stage: record.stage,
      userId: record.userId,
      notes: record.notes
    }));
    
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Error fetching CKD history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add CKD record
exports.addCkdRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.user.id; // From auth middleware
    const { eGFR, creatinine, notes } = req.body;
    
    // Calculate CKD stage based on eGFR
    let stage = 1;
    if (eGFR < 15) stage = 5;
    else if (eGFR < 30) stage = 4;
    else if (eGFR < 45) stage = 3;
    else if (eGFR < 60) stage = 2;
    
    const [result] = await pool.query(
      `INSERT INTO ckd_records (userId, date, eGFR, creatinine, stage, notes)
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [userId, eGFR, creatinine, stage, notes]
    );
    
    // Update the patient's current CKD stage
    await pool.query(
      `UPDATE patients SET ckdStage = ?, updatedAt = NOW() WHERE userId = ?`,
      [stage, userId]
    );
    
    const [newRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      id: newRecord[0].id,
      date: newRecord[0].date,
      eGFR: newRecord[0].eGFR,
      creatinine: newRecord[0].creatinine,
      stage: newRecord[0].stage,
      userId: newRecord[0].userId,
      notes: newRecord[0].notes
    });
  } catch (error) {
    console.error('Error adding CKD record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    
    // First get the patient ID from the user ID
    const [patient] = await pool.query(
      `SELECT id FROM patients WHERE userId = ?`,
      [userId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const patientId = patient[0].id;
    
    // Get appointments for this patient
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
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const appointmentId = req.params.id;
    
    // First get the patient ID from the user ID
    const [patient] = await pool.query(
      `SELECT id FROM patients WHERE userId = ?`,
      [userId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const patientId = patient[0].id;
    
    // Check if appointment is available
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
    const userId = req.user.id; // From auth middleware
    const appointmentId = req.params.id;
    
    // First get the patient ID from the user ID
    const [patient] = await pool.query(
      `SELECT id FROM patients WHERE userId = ?`,
      [userId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const patientId = patient[0].id;
    
    // Check if appointment belongs to this patient
    const [appointment] = await pool.query(
      `SELECT * FROM appointments WHERE id = ? AND patientId = ?`,
      [appointmentId, patientId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found or not booked by this patient' });
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

// Get education content
exports.getEducationContent = async (req, res) => {
  try {
    const stage = parseInt(req.params.stage);
    
    if (isNaN(stage) || stage < 1 || stage > 5) {
      return res.status(400).json({ message: 'Invalid CKD stage' });
    }
    
    const [content] = await pool.query(
      `SELECT * FROM education_content
       WHERE ckdStage = ? OR ckdStage IS NULL
       ORDER BY createdAt DESC`,
      [stage]
    );
    
    const formattedContent = content.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      type: item.type,
      content: item.content,
      ckdStage: item.ckdStage,
      language: item.language
    }));
    
    res.status(200).json(formattedContent);
  } catch (error) {
    console.error('Error fetching education content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
