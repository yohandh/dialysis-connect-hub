import axios from 'axios';
import { API_BASE_URL, getAuthToken } from '../config/api.config';

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
