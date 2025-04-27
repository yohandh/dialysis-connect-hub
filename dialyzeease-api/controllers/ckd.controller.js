
const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// Get CKD history for a patient
exports.getCkdHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check if patient exists
    const [patient] = await pool.query(
      `SELECT * FROM patients WHERE id = ?`,
      [patientId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get CKD records
    const [ckdRecords] = await pool.query(
      `SELECT * FROM ckd_records 
       WHERE patientId = ? 
       ORDER BY date DESC`,
      [patientId]
    );
    
    const formattedRecords = ckdRecords.map(record => ({
      id: record.id,
      patientId: record.patientId,
      date: record.date,
      egfr: record.egfr,
      creatinine: record.creatinine,
      calculatedStage: record.calculatedStage,
      doctorNotes: record.doctorNotes,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));
    
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Error fetching CKD history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get CKD record by ID
exports.getCkdRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get CKD record
    const [ckdRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [id]
    );
    
    if (!ckdRecord || ckdRecord.length === 0) {
      return res.status(404).json({ message: 'CKD record not found' });
    }
    
    res.status(200).json({
      id: ckdRecord[0].id,
      patientId: ckdRecord[0].patientId,
      date: ckdRecord[0].date,
      egfr: ckdRecord[0].egfr,
      creatinine: ckdRecord[0].creatinine,
      calculatedStage: ckdRecord[0].calculatedStage,
      doctorNotes: ckdRecord[0].doctorNotes,
      createdAt: ckdRecord[0].createdAt,
      updatedAt: ckdRecord[0].updatedAt
    });
  } catch (error) {
    console.error('Error fetching CKD record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new CKD record
exports.addCkdRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { patientId, date, egfr, creatinine, calculatedStage, doctorNotes } = req.body;
    
    // Check if patient exists
    const [patient] = await pool.query(
      `SELECT * FROM patients WHERE id = ?`,
      [patientId]
    );
    
    if (!patient || patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Create new record
    const [result] = await pool.query(
      `INSERT INTO ckd_records (
        patientId, date, egfr, creatinine, calculatedStage, doctorNotes, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [patientId, date, egfr, creatinine, calculatedStage, doctorNotes]
    );
    
    // Get the created record
    const [newRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [result.insertId]
    );
    
    res.status(201).json({
      id: newRecord[0].id,
      patientId: newRecord[0].patientId,
      date: newRecord[0].date,
      egfr: newRecord[0].egfr,
      creatinine: newRecord[0].creatinine,
      calculatedStage: newRecord[0].calculatedStage,
      doctorNotes: newRecord[0].doctorNotes,
      createdAt: newRecord[0].createdAt,
      updatedAt: newRecord[0].updatedAt
    });
  } catch (error) {
    console.error('Error adding CKD record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update CKD record
exports.updateCkdRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { date, egfr, creatinine, calculatedStage, doctorNotes } = req.body;
    
    // Check if record exists
    const [ckdRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [id]
    );
    
    if (!ckdRecord || ckdRecord.length === 0) {
      return res.status(404).json({ message: 'CKD record not found' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let updateParams = [];
    
    if (date) {
      updateFields.push('date = ?');
      updateParams.push(date);
    }
    
    if (egfr !== undefined) {
      updateFields.push('egfr = ?');
      updateParams.push(egfr);
    }
    
    if (creatinine !== undefined) {
      updateFields.push('creatinine = ?');
      updateParams.push(creatinine);
    }
    
    if (calculatedStage !== undefined) {
      updateFields.push('calculatedStage = ?');
      updateParams.push(calculatedStage);
    }
    
    if (doctorNotes !== undefined) {
      updateFields.push('doctorNotes = ?');
      updateParams.push(doctorNotes);
    }
    
    updateFields.push('updatedAt = NOW()');
    updateParams.push(id);
    
    // Update record
    await pool.query(
      `UPDATE ckd_records
       SET ${updateFields.join(', ')}
       WHERE id = ?`,
      updateParams
    );
    
    // Get the updated record
    const [updatedRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({
      id: updatedRecord[0].id,
      patientId: updatedRecord[0].patientId,
      date: updatedRecord[0].date,
      egfr: updatedRecord[0].egfr,
      creatinine: updatedRecord[0].creatinine,
      calculatedStage: updatedRecord[0].calculatedStage,
      doctorNotes: updatedRecord[0].doctorNotes,
      createdAt: updatedRecord[0].createdAt,
      updatedAt: updatedRecord[0].updatedAt
    });
  } catch (error) {
    console.error('Error updating CKD record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete CKD record
exports.deleteCkdRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if record exists
    const [ckdRecord] = await pool.query(
      `SELECT * FROM ckd_records WHERE id = ?`,
      [id]
    );
    
    if (!ckdRecord || ckdRecord.length === 0) {
      return res.status(404).json({ message: 'CKD record not found' });
    }
    
    // Delete record
    await pool.query(
      `DELETE FROM ckd_records WHERE id = ?`,
      [id]
    );
    
    res.status(200).json({ message: 'CKD record deleted successfully' });
  } catch (error) {
    console.error('Error deleting CKD record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
