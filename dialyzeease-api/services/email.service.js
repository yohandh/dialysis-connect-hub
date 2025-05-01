/**
 * Email Service for DialyzeEase
 * Handles sending emails using Nodemailer with Gmail
 */
const nodemailer = require('nodemailer');
const { pool } = require('../config/db');
require('dotenv').config();

// Create a transporter using Gmail
const createTransporter = async () => {
  // For Gmail, you need to use OAuth2 for production
  // For development/testing, you can use the less secure app approach
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });

  return transporter;
};

/**
 * Send an email
 * @param {Object} emailOptions - Email options
 * @param {string} emailOptions.to - Recipient email
 * @param {string} emailOptions.subject - Email subject
 * @param {string} emailOptions.text - Plain text content
 * @param {string} emailOptions.html - HTML content (optional)
 * @returns {Promise<Object>} - Nodemailer info object
 */
const sendEmail = async (emailOptions) => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: emailOptions.to,
      subject: emailOptions.subject,
      text: emailOptions.text,
      html: emailOptions.html || emailOptions.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a notification email
 * @param {Object} notification - Notification object
 * @param {string} recipientEmail - Recipient email address
 * @returns {Promise<Object>} - Result of email sending
 */
const sendNotificationEmail = async (notification, recipientEmail) => {
  try {
    const emailOptions = {
      to: recipientEmail,
      subject: notification.title,
      text: notification.message,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">${notification.title}</h2>
          <p style="font-size: 16px; line-height: 1.5;">${notification.message}</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #6b7280; font-size: 14px;">This is an automated message from DialyzeEase. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    return await sendEmail(emailOptions);
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email templates for different types of emails
 */
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

/**
 * Send an appointment confirmation email to patient and center manager
 * @param {string} appointmentId - ID of the appointment
 * @returns {Promise<Object>} - Result of email sending
 */
const sendAppointmentConfirmationEmails = async (appointmentId) => {
  try {
    console.log(`Starting email confirmation process for appointment ID: ${appointmentId}`);
    
    // Get comprehensive appointment details including patient and manager info in one query
    const [appointmentDetails] = await pool.query(
      `SELECT 
        a.id, a.patient_id, a.schedule_session_id, a.status, a.notes,
        ss.session_date, ss.start_time, ss.end_time,
        c.id as center_id, c.name as center_name, c.manage_by_id,
        p.user_id as patient_user_id,
        pu.email as patient_email, pu.first_name as patient_first_name, pu.last_name as patient_last_name,
        mu.email as manager_email, mu.first_name as manager_first_name, mu.last_name as manager_last_name
      FROM appointments a
      JOIN schedule_sessions ss ON a.schedule_session_id = ss.id
      JOIN centers c ON ss.center_id = c.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      LEFT JOIN users mu ON c.manage_by_id = mu.id
      WHERE a.id = ?`,
      [appointmentId]
    );
    
    if (!appointmentDetails || appointmentDetails.length === 0) {
      console.error(`Could not find appointment details with ID ${appointmentId}`);
      return { success: false, error: 'Appointment not found' };
    }
    
    const appointment = appointmentDetails[0];
    console.log('Found appointment with all details:', {
      id: appointment.id,
      patientId: appointment.patient_id,
      centerId: appointment.center_id,
      centerName: appointment.center_name,
      date: appointment.session_date,
      patientEmail: appointment.patient_email,
      patientName: `${appointment.patient_first_name} ${appointment.patient_last_name}`,
      managerEmail: appointment.manager_email,
      managerName: appointment.manager_email ? `${appointment.manager_first_name} ${appointment.manager_last_name}` : 'Not assigned'
    });
    
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
      patientName: `${appointment.patient_first_name} ${appointment.patient_last_name}`,
      centerName: appointment.center_name,
      date: appointment.session_date,
      startTime: formatTime(appointment.start_time),
      endTime: formatTime(appointment.end_time),
      bedCode: 'TBD' // This could be updated if bed assignment is implemented
    };
    
    console.log('Prepared email data:', emailData);
    
    // Send email to patient
    if (appointment.patient_email) {
      console.log(`Sending appointment confirmation email to patient: ${appointment.patient_email}`);
      try {
        const emailOptions = {
          to: appointment.patient_email,
          subject: emailTemplates.appointmentConfirmation(emailData).subject,
          html: emailTemplates.appointmentConfirmation(emailData).html
        };
        
        const result = await sendEmail(emailOptions);
        console.log('Patient email result:', result);
      } catch (emailError) {
        console.error('Error sending patient email:', emailError);
      }
    } else {
      console.log('No patient email found, skipping patient notification');
    }
    
    // Send email to center manager
    if (appointment.manager_email) {
      console.log(`Sending appointment notification to center manager: ${appointment.manager_email}`);
      try {
        const managerEmailData = {
          ...emailData,
          isForManager: true
        };
        
        const emailOptions = {
          to: appointment.manager_email,
          subject: emailTemplates.appointmentConfirmation(managerEmailData).subject,
          html: emailTemplates.appointmentConfirmation(managerEmailData).html
        };
        
        const result = await sendEmail(emailOptions);
        console.log('Manager email result:', result);
      } catch (emailError) {
        console.error('Error sending manager email:', emailError);
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
  sendNotificationEmail,
  sendAppointmentConfirmationEmails
};
