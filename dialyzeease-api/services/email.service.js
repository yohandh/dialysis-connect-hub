/**
 * Email Service for DialyzeEase
 * Handles sending emails using Nodemailer with Gmail
 */
const nodemailer = require('nodemailer');
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

module.exports = {
  sendEmail,
  sendNotificationEmail
};
