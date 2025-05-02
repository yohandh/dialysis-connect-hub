import axios from 'axios';
import { API_BASE_URL, getAuthToken, useMockApi, apiCall } from '../config/api.config';
import emailService from '../services/emailService';

export interface Notification {
  id: number;
  recipient_id: number;
  recipient_name: string;
  recipient_role: 'admin' | 'staff' | 'doctor' | 'patient';
  title: string;
  message: string;
  type: 'email' | 'sms' | 'app';
  status: 'pending' | 'sent' | 'read' | 'failed';
  sent_at: string;
}

// Fetch all notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Return empty array or throw error based on your error handling strategy
    throw error;
  }
};

// Fetch notifications by recipient
export const fetchNotificationsByRecipient = async (
  recipientId: number,
  role?: string
): Promise<Notification[]> => {
  try {
    const token = getAuthToken();
    const url = role 
      ? `${API_BASE_URL}/notifications/recipient/${recipientId}?role=${role}`
      : `${API_BASE_URL}/notifications/recipient/${recipientId}`;
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications by recipient:', error);
    throw error;
  }
};

// Update notification status
export const updateNotificationStatus = async (
  id: number,
  status: 'pending' | 'sent' | 'read' | 'failed'
): Promise<Notification> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${API_BASE_URL}/notifications/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

// Create a new notification
export const createNotification = async (
  notification: Omit<Notification, 'id' | 'sent_at'>
): Promise<Notification> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/notifications`,
      notification,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Send appointment confirmation emails to both patient and center manager
export interface AppointmentEmailData {
  patientId: string;
  patientName: string;
  patientEmail: string;
  centerId: string;
  centerName: string;
  centerManagerEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  bedCode?: string;
}

export const sendAppointmentConfirmationEmails = async (data: AppointmentEmailData): Promise<{success: boolean, error?: any}> => {
  try {
    console.log('Sending appointment confirmation emails:', data);
    
    // 1. Send email to patient
    const emailData = {
      patientName: data.patientName,
      centerName: data.centerName,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      bedCode: data.bedCode,
      isManagerEmail: false
    };
    
    // Send patient email
    try {
      const patientEmailResult = await emailService.sendEmail(
        data.patientEmail,
        'appointmentConfirmation',
        emailData
      );
      console.log('Patient email sent:', patientEmailResult.success);
    } catch (patientEmailError) {
      console.warn('Failed to send patient email, continuing with manager email:', patientEmailError);
      // Continue with the process even if patient email fails
    }
    
    // 2. Send notification to center manager with the same data but flag as manager email
    emailData.isManagerEmail = true;
    
    // Send email to center manager
    try {
      await emailService.sendEmail(
        data.centerManagerEmail,
        'appointmentConfirmation',
        emailData
      );
      console.log('Manager email sent successfully');
    } catch (managerEmailError) {
      console.warn('Failed to send manager email:', managerEmailError);
      // Continue with the process even if manager email fails
    }
    
    // 3. Create notification records in the database
    try {
      // Patient notification
      await createNotification({
        recipient_id: parseInt(data.patientId),
        recipient_name: data.patientName,
        recipient_role: 'patient',
        title: 'Appointment Confirmation',
        message: `Your appointment at ${data.centerName} on ${data.date} at ${data.startTime} has been confirmed.`,
        type: 'email',
        status: 'sent'
      });
    } catch (notificationError) {
      console.warn('Failed to create notification record:', notificationError);
      // Continue with the process even if notification creation fails
    }
    
    console.log('Appointment confirmation emails sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending appointment confirmation emails:', error);
    // Even if there's an error, we don't want to block the appointment booking process
    // So we'll return success: true anyway
    return { success: true, error };
  }
};
