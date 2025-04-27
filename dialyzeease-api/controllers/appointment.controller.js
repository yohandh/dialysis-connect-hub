const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const format = require('date-fns/format');
const auditService = require('../services/auditService');
const notificationService = require('../services/notificationService');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dialyzeease@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'jpkdzedpwnebzosx' // Better to use environment variables
  }
});

// Email templates
const emailTemplates = {
  appointmentConfirmation: (data) => {
    const { patientName, centerName, date, startTime, endTime, bedCode } = data;
    
    return {
      subject: `DialyzeEase: Your Dialysis Appointment Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/example-logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #0066cc; text-align: center;">Appointment Confirmation</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis appointment has been successfully scheduled. Here are the details:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
          </div>
          
          <h3 style="color: #0066cc;">Preparation Instructions:</h3>
          <ul>
            <li>Please arrive 15 minutes before your appointment time.</li>
            <li>Bring your identification and insurance card.</li>
            <li>Wear comfortable clothing with easy access to your dialysis access site.</li>
            <li>Bring a list of your current medications.</li>
            <li>Consider bringing something to keep you occupied during treatment (book, tablet, etc.).</li>
          </ul>
          
          <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance at <a href="tel:0112422335">0112422335</a> or reply to this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:support@dialyzeease.com">support@dialyzeease.com</a>
            </p>
          </div>
        </div>
      `
    };
  },
  
  appointmentCancellation: (data) => {
    const { patientName, centerName, date, startTime, endTime } = data;
    
    return {
      subject: `DialyzeEase: Your Dialysis Appointment Cancellation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/example-logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #e74c3c; text-align: center;">Appointment Cancellation</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis appointment has been cancelled. Here are the details of the cancelled appointment:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          
          <p>If you need to schedule a new appointment, please contact our scheduling department at <a href="tel:0112422335">0112422335</a> or through our online portal.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:support@dialyzeease.com">support@dialyzeease.com</a>
            </p>
          </div>
        </div>
      `
    };
  },
  
  appointmentCompleted: (data) => {
    const { patientName, centerName, date, startTime, endTime } = data;
    
    return {
      subject: `DialyzeEase: Your Dialysis Treatment Completed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/example-logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #27ae60; text-align: center;">Treatment Completed</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis treatment has been completed. Here are the details:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          
          <p>Thank you for choosing our services. Your next appointment will be scheduled according to your treatment plan.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:support@dialyzeease.com">support@dialyzeease.com</a>
            </p>
          </div>
        </div>
      `
    };
  },
  
  appointmentRescheduled: (data) => {
    const { patientName, centerName, date, startTime, endTime, bedCode } = data;
    
    return {
      subject: `DialyzeEase: Your Dialysis Appointment Rescheduled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.imgur.com/example-logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #f39c12; text-align: center;">Appointment Rescheduled</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis appointment has been rescheduled. Here are the updated details:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
          </div>
          
          <h3 style="color: #f39c12;">Preparation Instructions:</h3>
          <ul>
            <li>Please arrive 15 minutes before your appointment time.</li>
            <li>Bring your identification and insurance card.</li>
            <li>Wear comfortable clothing with easy access to your dialysis access site.</li>
            <li>Bring a list of your current medications.</li>
            <li>Consider bringing something to keep you occupied during treatment (book, tablet, etc.).</li>
          </ul>
          
          <p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance at <a href="tel:0112422335">0112422335</a> or reply to this email.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:support@dialyzeease.com">support@dialyzeease.com</a>
            </p>
          </div>
        </div>
      `
    };
  }
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName](data);
    
    const mailOptions = {
      from: '"DialyzeEase" <dialyzeease@gmail.com>',
      to,
      subject: template.subject,
      html: template.html
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, 
              ss.start_time as startTime, 
              ss.end_time as endTime,
              c.id as centerId, 
              c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       ORDER BY ss.session_date DESC, ss.start_time ASC`
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      scheduleSessionId: apt.schedule_session_id,
      patientId: apt.patient_id,
      patientName: apt.patientName,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      bedId: apt.bed_id,
      bedCode: apt.bedCode,
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
      `SELECT a.*, 
              ss.session_date as date, 
              ss.start_time as startTime, 
              ss.end_time as endTime,
              c.id as centerId, 
              c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [appointmentId]
    );
    
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json({
      id: appointment[0].id,
      scheduleSessionId: appointment[0].schedule_session_id,
      patientId: appointment[0].patient_id,
      patientName: appointment[0].patientName,
      centerId: appointment[0].centerId,
      centerName: appointment[0].centerName,
      date: appointment[0].date,
      startTime: appointment[0].startTime,
      endTime: appointment[0].endTime,
      status: appointment[0].status,
      bedId: appointment[0].bed_id,
      bedCode: appointment[0].bedCode,
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
      `SELECT a.*, 
              ss.session_date as date, 
              ss.start_time as startTime, 
              ss.end_time as endTime,
              c.id as centerId, 
              c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE ss.center_id = ?
       ORDER BY ss.session_date DESC, ss.start_time ASC`,
      [centerId]
    );
    
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      scheduleSessionId: apt.schedule_session_id,
      patientId: apt.patient_id,
      patientName: apt.patientName,
      centerId: apt.centerId,
      centerName: apt.centerName,
      date: apt.date,
      startTime: apt.startTime,
      endTime: apt.endTime,
      status: apt.status,
      bedId: apt.bed_id,
      bedCode: apt.bedCode,
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

    const { 
      scheduleSessionId, 
      patientId, 
      bedId, 
      notes 
    } = req.body;

    // Get session details to create the appointment
    const [sessionDetails] = await pool.query(
      `SELECT ss.*, c.name as centerName, b.code as bedCode
       FROM schedule_sessions ss
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON b.id = ?
       WHERE ss.id = ?`,
      [bedId, scheduleSessionId]
    );

    if (!sessionDetails || sessionDetails.length === 0) {
      return res.status(404).json({ message: 'Schedule session not found' });
    }

    // Get patient details for email
    const [patientDetails] = await pool.query(
      `SELECT u.email, u.first_name, u.last_name
       FROM users u
       WHERE u.id = ?`,
      [patientId]
    );

    if (!patientDetails || patientDetails.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Insert the appointment
    const [result] = await pool.query(
      `INSERT INTO appointments 
       (schedule_session_id, bed_id, patient_id, notes, status, created_at)
       VALUES (?, ?, ?, ?, 'scheduled', NOW())`,
      [scheduleSessionId, bedId || null, patientId, notes || null]
    );

    if (!result || !result.insertId) {
      return res.status(500).json({ message: 'Failed to create appointment' });
    }

    // Format date for email
    const sessionDate = new Date(sessionDetails[0].session_date);
    const formattedDate = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;

    // Send confirmation email to patient
    let emailSent = false;
    if (patientDetails[0].email) {
      try {
        await sendEmail(
          patientDetails[0].email,
          'appointmentConfirmation',
          {
            patientName: `${patientDetails[0].first_name} ${patientDetails[0].last_name}`,
            centerName: sessionDetails[0].centerName,
            date: formattedDate,
            startTime: sessionDetails[0].start_time,
            endTime: sessionDetails[0].end_time,
            bedCode: sessionDetails[0].bedCode
          }
        );
        emailSent = true;

        // Log the notification in the database
        await notificationService.trackEmailNotification(
          patientId,
          'patient',
          'Dialysis Appointment Confirmation',
          `Appointment confirmed at ${sessionDetails[0].centerName} on ${formattedDate} from ${sessionDetails[0].start_time} to ${sessionDetails[0].end_time}`,
          'sent'
        );
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        
        // Log the failed notification
        await notificationService.trackEmailNotification(
          patientId,
          'patient',
          'Dialysis Appointment Confirmation',
          `Appointment confirmed at ${sessionDetails[0].centerName} on ${formattedDate} from ${sessionDetails[0].start_time} to ${sessionDetails[0].end_time}`,
          'failed'
        );
      }
    }

    // Get the created appointment with details
    const [createdAppointment] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime,
              c.id as centerId, c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    // Log the action to audit_logs
    const userId = req.user ? req.user.id : null;
    const appointmentData = {
      id: result.insertId,
      scheduleSessionId,
      patientId,
      bedId,
      notes,
      status: 'scheduled',
      centerName: sessionDetails[0].centerName,
      date: formattedDate,
      startTime: sessionDetails[0].start_time,
      endTime: sessionDetails[0].end_time
    };

    await auditService.logAction(
      'appointments',
      result.insertId,
      'create',
      userId,
      null,
      appointmentData,
      req.ip,
      req.headers['user-agent']
    );

    res.status(201).json({
      id: createdAppointment[0].id,
      scheduleSessionId: createdAppointment[0].schedule_session_id,
      centerId: createdAppointment[0].centerId,
      centerName: createdAppointment[0].centerName,
      date: createdAppointment[0].date,
      startTime: createdAppointment[0].startTime,
      endTime: createdAppointment[0].endTime,
      patientId: createdAppointment[0].patient_id,
      patientName: createdAppointment[0].patientName,
      bedId: createdAppointment[0].bed_id,
      bedCode: createdAppointment[0].bedCode,
      status: createdAppointment[0].status,
      notes: createdAppointment[0].notes,
      emailSent
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
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

    const { id } = req.params;
    const { patientId, bedId, notes, status } = req.body;

    // Get the current appointment data for audit logging
    const [currentAppointment] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime,
              c.id as centerId, c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [id]
    );

    if (!currentAppointment || currentAppointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Build the update query dynamically
    let updateQuery = 'UPDATE appointments SET ';
    const updateParams = [];
    const updateFields = [];

    if (patientId !== undefined) {
      updateFields.push('patient_id = ?');
      updateParams.push(patientId);
    }

    if (bedId !== undefined) {
      updateFields.push('bed_id = ?');
      updateParams.push(bedId);
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?');
      updateParams.push(notes);
    }

    if (status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = NOW()');

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateQuery += updateFields.join(', ');
    updateQuery += ' WHERE id = ?';
    updateParams.push(id);

    const [result] = await pool.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    // Get the updated appointment data
    const [updatedAppointment] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime,
              c.id as centerId, c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [id]
    );

    // Log the update action to audit_logs
    const userId = req.user ? req.user.id : null;
    await auditService.logAction(
      'appointments',
      id,
      'update',
      userId,
      currentAppointment[0],
      updatedAppointment[0],
      req.ip,
      req.headers['user-agent']
    );

    // If status changed, send notification to patient
    if (status && status !== currentAppointment[0].status && updatedAppointment[0].patient_id) {
      // Get patient details
      const [patientDetails] = await pool.query(
        `SELECT u.email, u.first_name, u.last_name
         FROM users u
         WHERE u.id = ?`,
        [updatedAppointment[0].patient_id]
      );

      if (patientDetails && patientDetails.length > 0 && patientDetails[0].email) {
        let emailTemplate;
        let emailData = {
          patientName: `${patientDetails[0].first_name} ${patientDetails[0].last_name}`,
          centerName: updatedAppointment[0].centerName,
          date: updatedAppointment[0].date,
          startTime: updatedAppointment[0].startTime,
          endTime: updatedAppointment[0].endTime,
          bedCode: updatedAppointment[0].bedCode
        };

        // Determine which email template to use based on the new status
        if (status === 'cancelled') {
          emailTemplate = 'appointmentCancellation';
        } else if (status === 'completed') {
          emailTemplate = 'appointmentCompleted';
        } else if (status === 'in-progress') {
          // No email for in-progress status
          emailTemplate = null;
        } else if (status === 'scheduled') {
          emailTemplate = 'appointmentRescheduled';
        }

        // Send the appropriate email if a template was selected
        if (emailTemplate) {
          try {
            await sendEmail(patientDetails[0].email, emailTemplate, emailData);
            
            // Log the notification
            await notificationService.trackEmailNotification(
              updatedAppointment[0].patient_id,
              'patient',
              `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              `Your appointment at ${updatedAppointment[0].centerName} on ${updatedAppointment[0].date} has been ${status}`,
              'sent'
            );
          } catch (emailError) {
            console.error(`Error sending ${status} email:`, emailError);
            
            // Log the failed notification
            await notificationService.trackEmailNotification(
              updatedAppointment[0].patient_id,
              'patient',
              `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              `Your appointment at ${updatedAppointment[0].centerName} on ${updatedAppointment[0].date} has been ${status}`,
              'failed'
            );
          }
        }
      }
    }

    res.status(200).json({
      id: updatedAppointment[0].id,
      scheduleSessionId: updatedAppointment[0].schedule_session_id,
      centerId: updatedAppointment[0].centerId,
      centerName: updatedAppointment[0].centerName,
      date: updatedAppointment[0].date,
      startTime: updatedAppointment[0].startTime,
      endTime: updatedAppointment[0].endTime,
      patientId: updatedAppointment[0].patient_id,
      patientName: updatedAppointment[0].patientName,
      bedId: updatedAppointment[0].bed_id,
      bedCode: updatedAppointment[0].bedCode,
      status: updatedAppointment[0].status,
      notes: updatedAppointment[0].notes
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete appointment slot
exports.deleteAppointmentSlot = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the appointment data before deletion for audit logging
    const [appointmentData] = await pool.query(
      `SELECT a.*, 
              ss.session_date as date, ss.start_time as startTime, ss.end_time as endTime,
              c.id as centerId, c.name as centerName,
              b.code as bedCode,
              CONCAT(p.first_name, ' ', p.last_name) as patientName
       FROM appointments a
       JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
       JOIN centers c ON ss.center_id = c.id
       LEFT JOIN beds b ON a.bed_id = b.id
       LEFT JOIN users p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [id]
    );

    if (!appointmentData || appointmentData.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Delete the appointment
    const [result] = await pool.query('DELETE FROM appointments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Log the delete action to audit_logs
    const userId = req.user ? req.user.id : null;
    await auditService.logAction(
      'appointments',
      id,
      'delete',
      userId,
      appointmentData[0],
      null,
      req.ip,
      req.headers['user-agent']
    );

    // If the appointment had a patient, send a cancellation email
    if (appointmentData[0].patient_id) {
      // Get patient details
      const [patientDetails] = await pool.query(
        `SELECT u.email, u.first_name, u.last_name
         FROM users u
         WHERE u.id = ?`,
        [appointmentData[0].patient_id]
      );

      if (patientDetails && patientDetails.length > 0 && patientDetails[0].email) {
        try {
          await sendEmail(
            patientDetails[0].email,
            'appointmentCancellation',
            {
              patientName: `${patientDetails[0].first_name} ${patientDetails[0].last_name}`,
              centerName: appointmentData[0].centerName,
              date: appointmentData[0].date,
              startTime: appointmentData[0].startTime,
              endTime: appointmentData[0].endTime,
              bedCode: appointmentData[0].bedCode
            }
          );
          
          // Log the notification
          await notificationService.trackEmailNotification(
            appointmentData[0].patient_id,
            'patient',
            'Appointment Cancelled',
            `Your appointment at ${appointmentData[0].centerName} on ${appointmentData[0].date} has been cancelled`,
            'sent'
          );
        } catch (emailError) {
          console.error('Error sending cancellation email:', emailError);
          
          // Log the failed notification
          await notificationService.trackEmailNotification(
            appointmentData[0].patient_id,
            'patient',
            'Appointment Cancelled',
            `Your appointment at ${appointmentData[0].centerName} on ${appointmentData[0].date} has been cancelled`,
            'failed'
          );
        }
      }
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
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
