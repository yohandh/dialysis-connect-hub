import { API_BASE_URL, getAuthToken, useMockApi } from '../config/api.config';
import axios from 'axios';

// Mock implementation for development/testing
const mockSendEmail = async (to: string, subject: string, html: string) => {
  console.log('MOCK EMAIL SENT:', { to, subject });
  console.log('CONTENT:', html);
  return { success: true, messageId: `mock-${Date.now()}` };
};

// Email templates - Using professional templates matching the backend
export const emailTemplates = {
  appointmentConfirmation: (data: {
    patientName: string;
    centerName: string;
    date: string;
    startTime: string;
    endTime: string;
    bedCode?: string;
    isManagerEmail?: boolean;
  }) => {
    const { patientName, centerName, date, startTime, endTime, bedCode, isManagerEmail } = data;
    
    // Different templates for patient vs. manager
    if (isManagerEmail) {
      // Manager email template
      return {
        subject: `New Appointment Booking at ${centerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://i.imgur.com/example-logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
            </div>
            
            <h2 style="color: #0066cc; text-align: center;">New Appointment Notification</h2>
            
            <p>Dear Center Manager,</p>
            
            <p>A new dialysis appointment has been booked at your center. Here are the details:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Patient:</strong> ${patientName}</p>
              <p><strong>Center:</strong> ${centerName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
              ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
            </div>
            
            <p>Please ensure all necessary preparations are made for this appointment.</p>
            
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
    } else {
      // Patient email template - using the professional template from the Admin Portal
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
                For assistance, contact us at <a href="mailto:support@dialyzeease.com">support@dialyzeease.com</a> or call <a href="tel:0112422335">0112422335</a>.
              </p>
            </div>
          </div>
        `
      };
    }
  },
  
  appointmentReminder: (data: {
    patientName: string;
    centerName: string;
    date: string;
    startTime: string;
    endTime: string;
    bedCode?: string;
  }) => {
    const { patientName, centerName, date, startTime, endTime, bedCode } = data;
    
    return {
      subject: `DialyzeEase: Reminder for Your Upcoming Dialysis Appointment`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://dialyzeease.com/logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #0066cc; text-align: center;">Appointment Reminder</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>This is a friendly reminder about your upcoming dialysis appointment:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
          </div>
          
          <h3 style="color: #0066cc;">Preparation Checklist:</h3>
          <ul>
            <li>Arrive 15 minutes early</li>
            <li>Bring ID and insurance card</li>
            <li>Wear comfortable clothing</li>
            <li>Bring current medication list</li>
            <li>Stay hydrated according to your doctor's recommendations</li>
          </ul>
          
          <p>If you need to reschedule, please contact us as soon as possible at <a href="tel:011 242 2335">011 242 2335</a>.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:dialyzeease@gmail.com">dialyzeease@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };
  },
  
  appointmentCancellation: (data: {
    patientName: string;
    centerName: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    const { patientName, centerName, date, startTime, endTime } = data;
    
    return {
      subject: `DialyzeEase: Dialysis Appointment Cancellation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://dialyzeease.com/logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #cc0000; text-align: center;">Appointment Cancelled</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis appointment has been cancelled. Here are the details of the cancelled appointment:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          
          <p>If you did not request this cancellation or would like to reschedule, please contact our scheduling department at <a href="tel:011 242 2335">011 242 2335</a> as soon as possible.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:dialyzeease@gmail.com">dialyzeease@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };
  },
  
  appointmentReschedule: (data: {
    patientName: string;
    centerName: string;
    oldDate: string;
    oldStartTime: string;
    oldEndTime: string;
    newDate: string;
    newStartTime: string;
    newEndTime: string;
    bedCode?: string;
  }) => {
    const { 
      patientName, 
      centerName, 
      oldDate, 
      oldStartTime, 
      oldEndTime, 
      newDate, 
      newStartTime, 
      newEndTime, 
      bedCode 
    } = data;
    
    return {
      subject: `DialyzeEase: Your Dialysis Appointment Has Been Rescheduled`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://dialyzeease.com/logo.png" alt="DialyzeEase Logo" style="max-width: 200px;">
          </div>
          
          <h2 style="color: #ff9900; text-align: center;">Appointment Rescheduled</h2>
          
          <p>Dear ${patientName},</p>
          
          <p>Your dialysis appointment has been rescheduled. Here are the details:</p>
          
          <div style="background-color: #ffe6cc; padding: 15px; border-radius: 5px; margin: 20px 0; text-decoration: line-through;">
            <p><strong>Previous Appointment:</strong></p>
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${oldDate}</p>
            <p><strong>Time:</strong> ${oldStartTime} - ${oldEndTime}</p>
          </div>
          
          <div style="background-color: #e6f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>New Appointment:</strong></p>
            <p><strong>Center:</strong> ${centerName}</p>
            <p><strong>Date:</strong> ${newDate}</p>
            <p><strong>Time:</strong> ${newStartTime} - ${newEndTime}</p>
            ${bedCode ? `<p><strong>Bed/Machine:</strong> ${bedCode}</p>` : ''}
          </div>
          
          <p>If this new schedule doesn't work for you, please contact us as soon as possible at <a href="tel:011 242 2335">011 242 2335</a> to discuss alternatives.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666;">Best regards,</p>
            <p style="color: #666;">The DialyzeEase Team</p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is an automated message. Please do not reply directly to this email.
              For assistance, contact us at <a href="mailto:dialyzeease@gmail.com">dialyzeease@gmail.com</a>
            </p>
          </div>
        </div>
      `
    };
  }
};

// Send email function
export const sendEmail = async (
  to: string,
  templateName: keyof typeof emailTemplates,
  data: any
) => {
  try {
    const template = emailTemplates[templateName](data);
    
    // In mock/development mode or if the API endpoint is not available, just log the email
    if (useMockApi()) {
      return await mockSendEmail(to, template.subject, template.html);
    }
    
    try {
      // Try to send the email through the backend API
      const token = getAuthToken();
      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-email`,
        {
          to,
          subject: template.subject,
          html: template.html
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Email sent through API');
      return { success: true, messageId: response.data?.messageId || 'sent' };
    } catch (apiError) {
      // If the API endpoint is not available, fall back to mock mode
      console.warn('Email API endpoint not available, falling back to mock mode:', apiError);
      return await mockSendEmail(to, template.subject, template.html);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export default {
  sendEmail,
  emailTemplates
};
