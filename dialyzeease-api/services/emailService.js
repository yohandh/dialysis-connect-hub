/**
 * Email Service for DialyzeEase
 * Handles sending emails using Nodemailer with Gmail
 */
const nodemailer = require('nodemailer');
const { pool } = require('../config/db');
require('dotenv').config();

// Email configuration - ALWAYS SEND EMAILS
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dialyzeease@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'jpkdzedpwnebzosx' // Better to use environment variables
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  debug: true, // Enable debug output
  logger: true // Log information about the transport
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email server connection error:', error);
  } else {
    console.log('Email server connection successful, ready to send messages');
  }
});

// Log email configuration on startup
console.log('Email service configured with:', {
  service: 'gmail',
  user: process.env.EMAIL_USER || 'dialyzeease@gmail.com',
  usingEnvVars: !!process.env.EMAIL_USER
});

// Email templates
const emailTemplates = {
  appointmentConfirmation: (data) => {
    const { patientName, centerName, date, startTime, endTime, bedCode, isForManager = false } = data;
    
    // Different subject for manager vs patient
    const subject = isForManager 
      ? `DialyzeEase: New Appointment Booking at ${centerName}`
      : `DialyzeEase: Your Dialysis Appointment Confirmation`;
    
    // Different greeting based on recipient
    const greeting = isForManager
      ? `<p>Dear Center Manager,</p><p>A new appointment has been booked at your center. Here are the details:</p>`
      : `<p>Dear ${patientName},</p><p>Your dialysis appointment has been successfully scheduled. Here are the details:</p>`;
    
    // Different footer based on recipient
    const footer = isForManager
      ? `<p>Please ensure that all necessary preparations are made for this appointment.</p>`
      : `<p>If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance at <a href="tel:0112422335">0112422335</a> or reply to this email.</p>`;
    
    return {
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0066cc;">DialyzeEase</h1>
          </div>
          
          <h2 style="color: #0066cc; text-align: center;">Appointment ${isForManager ? 'Notification' : 'Confirmation'}</h2>
          
          ${greeting}
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
            ${isForManager ? `<p><strong>Patient:</strong> ${patientName}</p>` : ''}
          </div>
          
          ${isForManager ? '' : `
          <h3 style="color: #0066cc;">Preparation Instructions:</h3>
          <ul>
            <li>Please arrive 15 minutes before your appointment time.</li>
            <li>Bring your identification and insurance card.</li>
            <li>Wear comfortable clothing with easy access to your dialysis access site.</li>
            <li>Bring a list of your current medications.</li>
            <li>Consider bringing something to keep you occupied during treatment (book, tablet, etc.).</li>
          </ul>
          `}
          
          ${footer}
          
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

// Send email function - ALWAYS SEND EMAILS
const sendEmail = async (to, templateName, data) => {
  try {
    console.log(`Preparing to send ${templateName} email to: ${to}`);
    console.log('Email data:', JSON.stringify(data, null, 2));
    
    // Validate email address
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      console.error(`Invalid email address: ${to}`);
      return { success: false, error: 'Invalid email address' };
    }
    
    // Check if template exists
    if (!emailTemplates[templateName]) {
      console.error(`Email template not found: ${templateName}`);
      return { success: false, error: 'Email template not found' };
    }
    
    const template = emailTemplates[templateName](data);
    console.log(`Generated email template: ${templateName}`);
    
    const mailOptions = {
      from: '"DialyzeEase" <dialyzeease@gmail.com>',
      to,
      subject: template.subject,
      html: template.html
    };
    
    console.log('Sending email with options:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from
    });
    
    // IMPORTANT: Always log that we're sending an actual email
    console.log('ACTUALLY SENDING EMAIL - NOT JUST LOGGING');
    console.log('Email recipient:', to);
    
    console.log('Sending email with content:', {
      to: mailOptions.to,
      subject: template.subject,
      htmlPreview: template.html.substring(0, 100) + '...'
    });
  
    // Optionally save email content to a file for inspection
    try {
      const fs = require('fs');
      const path = require('path');
      const logDir = path.join(__dirname, '../logs');
      
      // Create logs directory if it doesn't exist
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
      
      const logFile = path.join(logDir, `email_${Date.now()}.html`);
      fs.writeFileSync(logFile, template.html);
      console.log(`Email content also saved to: ${logFile}`);
    } catch (logError) {
      console.error('Error saving email log:', logError);
      // Continue with sending the email even if logging fails
    }
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

// Function to send appointment confirmation emails
const sendAppointmentConfirmationEmails = async (appointmentId) => {
  try {
    console.log(`Starting email confirmation process for appointment ID: ${appointmentId}`);
    
    // Get appointment details first
    const [appointments] = await pool.query(
      `SELECT * FROM appointments WHERE id = ?`,
      [appointmentId]
    );
    
    if (!appointments || appointments.length === 0) {
      console.error(`Could not find appointment with ID ${appointmentId}`);
      return { success: false, error: 'Appointment not found' };
    }
    
    const appointment = appointments[0];
    console.log('Found appointment:', appointment);
    
    // Get schedule session details
    const [sessions] = await pool.query(
      `SELECT * FROM schedule_sessions WHERE id = ?`,
      [appointment.schedule_session_id]
    );
    
    if (!sessions || sessions.length === 0) {
      console.error(`Could not find schedule session with ID ${appointment.schedule_session_id}`);
      return { success: false, error: 'Schedule session not found' };
    }
    
    const session = sessions[0];
    console.log('Found session:', session);
    
    // Get center details
    const [centers] = await pool.query(
      `SELECT * FROM centers WHERE id = ?`,
      [session.center_id]
    );
    
    if (!centers || centers.length === 0) {
      console.error(`Could not find center with ID ${session.center_id}`);
      return { success: false, error: 'Center not found' };
    }
    
    const center = centers[0];
    console.log('Found center:', center);
    
    // Get patient details
    const [patients] = await pool.query(
      `SELECT p.*, u.email, u.first_name, u.last_name 
       FROM patients p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = ?`,
      [appointment.patient_id]
    );
    
    if (!patients || patients.length === 0) {
      console.error(`Could not find patient with ID ${appointment.patient_id}`);
      return { success: false, error: 'Patient not found' };
    }
    
    const patient = patients[0];
    console.log('Found patient:', patient);
    
    // Get center manager details if available
    let manager = null;
    if (center.manage_by_id) {
      const [managers] = await pool.query(
        `SELECT * FROM users WHERE id = ?`,
        [center.manage_by_id]
      );
      
      if (managers && managers.length > 0) {
        manager = managers[0];
        console.log('Found center manager:', manager);
      }
    }
    
    // Combine all details into one comprehensive object
    const combinedAppointmentDetails = [{
      id: appointment.id,
      patient_id: appointment.patient_id,
      schedule_session_id: appointment.schedule_session_id,
      status: appointment.status,
      notes: appointment.notes,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
      center_id: center.id,
      center_name: center.name,
      manage_by_id: center.manage_by_id,
      patient_email: patient.email,
      patient_first_name: patient.first_name,
      patient_last_name: patient.last_name,
      manager_email: manager ? manager.email : null,
      manager_first_name: manager ? manager.first_name : null,
      manager_last_name: manager ? manager.last_name : null
    }];
    
    if (!combinedAppointmentDetails || combinedAppointmentDetails.length === 0) {
      console.error(`Could not compile appointment details with ID ${appointmentId}`);
      return { success: false, error: 'Appointment details could not be compiled' };
    }
    
    const appointmentWithDetails = combinedAppointmentDetails[0];
    console.log('Found appointment with all details:', {
      id: appointmentWithDetails.id,
      patientId: appointmentWithDetails.patient_id,
      centerId: appointmentWithDetails.center_id,
      centerName: appointmentWithDetails.center_name,
      date: appointmentWithDetails.session_date,
      patientEmail: appointmentWithDetails.patient_email,
      patientName: `${appointmentWithDetails.patient_first_name} ${appointmentWithDetails.patient_last_name}`,
      managerEmail: appointmentWithDetails.manager_email,
      managerName: appointmentWithDetails.manager_email ? `${appointmentWithDetails.manager_first_name} ${appointmentWithDetails.manager_last_name}` : 'Not assigned'
    });
    
    // Verify we have the required email addresses
    if (!appointmentWithDetails.patient_email) {
      console.error(`No email found for patient ID ${appointmentWithDetails.patient_id}`);
      // Continue execution but log the error
    }
    
    if (!appointmentWithDetails.manager_email) {
      console.error(`No email found for center manager (center ID: ${appointmentWithDetails.center_id})`);
      // Continue execution but log the error
    }
    
    // For debugging, dump the full appointment object
    console.log('Full appointment object:', JSON.stringify(appointmentWithDetails, null, 2));
    
    // Format time for display
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    // Prepare email data
    const emailData = {
      patientName: `${appointmentWithDetails.patient_first_name} ${appointmentWithDetails.patient_last_name}`,
      centerName: appointmentWithDetails.center_name,
      date: appointmentWithDetails.session_date,
      startTime: formatTime(appointmentWithDetails.start_time),
      endTime: formatTime(appointmentWithDetails.end_time),
      bedCode: 'TBD' // This could be updated if bed assignment is implemented
    };
    
    console.log('Prepared email data:', emailData);
    
    // Send email to patient
    if (appointmentWithDetails.patient_email) {
      console.log(`Sending appointment confirmation email to patient: ${appointmentWithDetails.patient_email}`);
      try {
        // Create patient email content
        const patientTemplate = emailTemplates.appointmentConfirmation(emailData);
        
        // Send patient email directly with nodemailer
        const patientMailOptions = {
          from: '"DialyzeEase" <dialyzeease@gmail.com>',
          to: appointmentWithDetails.patient_email,
          subject: patientTemplate.subject,
          html: patientTemplate.html
        };
        
        console.log('DIRECTLY SENDING PATIENT EMAIL TO:', appointmentWithDetails.patient_email);
        console.log('Email configuration:', {
          service: 'gmail',
          user: process.env.EMAIL_USER || 'dialyzeease@gmail.com',
          pass: process.env.EMAIL_PASSWORD ? 'PRESENT' : 'NOT PRESENT'
        });
        
        // Force verification of transporter before sending
        await new Promise((resolve, reject) => {
          transporter.verify(function(error, success) {
            if (error) {
              console.error('Transporter verification failed:', error);
              reject(error);
            } else {
              console.log('Transporter verified successfully');
              resolve(success);
            }
          });
        });
        
        const patientInfo = await transporter.sendMail(patientMailOptions);
        console.log('Patient email sent successfully:', patientInfo.messageId);
      } catch (emailError) {
        console.error('Error sending patient email:', emailError);
        console.error('Error details:', emailError.stack);
      }
    } else {
      console.log('No patient email found, skipping patient notification');
    }
    
    // Send email to center manager
    if (appointmentWithDetails.manager_email) {
      console.log(`Sending appointment notification to center manager: ${appointmentWithDetails.manager_email}`);
      try {
        // Create manager email content
        const managerEmailData = {
          ...emailData,
          isForManager: true
        };
        const managerTemplate = emailTemplates.appointmentConfirmation(managerEmailData);
        
        // Send manager email directly with nodemailer
        const managerMailOptions = {
          from: '"DialyzeEase" <dialyzeease@gmail.com>',
          to: appointmentWithDetails.manager_email,
          subject: managerTemplate.subject,
          html: managerTemplate.html
        };
        
        console.log('DIRECTLY SENDING MANAGER EMAIL TO:', appointmentWithDetails.manager_email);
        
        // Force verification of transporter before sending
        await new Promise((resolve, reject) => {
          transporter.verify(function(error, success) {
            if (error) {
              console.error('Transporter verification failed:', error);
              reject(error);
            } else {
              console.log('Transporter verified successfully for manager email');
              resolve(success);
            }
          });
        });
        
        const managerInfo = await transporter.sendMail(managerMailOptions);
        console.log('Manager email sent successfully:', managerInfo.messageId);
      } catch (emailError) {
        console.error('Error sending manager email:', emailError);
        console.error('Manager email error details:', emailError.stack);
      }
    } else {
      console.log('No center manager email found, skipping manager notification');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending appointment confirmation emails:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

module.exports = {
  sendEmail,
  sendAppointmentConfirmationEmails
};
