
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import PatientPortalLayout from '@/components/layouts/PatientPortalLayout';

// Define the PatientNotification type if it's not exported from patientApi
interface PatientNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'appointment' | 'medical';
  isRead: boolean; // Changed 'read' to 'isRead' to match the expected property name
}

// Define mock API functions if they're not exported from patientApi
const fetchPatientNotifications = async (patientId: string): Promise<PatientNotification[]> => {
  // Mock implementation
  return [
    {
      id: "notif-1",
      title: "Upcoming Appointment",
      message: "You have a dialysis appointment scheduled for tomorrow at 10:00 AM.",
      createdAt: "2023-06-01T10:00:00Z",
      type: "appointment",
      isRead: false
    },
    {
      id: "notif-2",
      title: "Lab Results Available",
      message: "Your recent lab results have been uploaded to your patient portal.",
      createdAt: "2023-05-28T14:30:00Z",
      type: "medical",
      isRead: true
    }
  ];
};

const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  // Mock implementation
  console.log(`Marking notification ${notificationId} as read`);
  // In a real app, this would make an API call
};

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchPatientNotifications("patient-001"); // In a real app, this would use the current user's ID
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update the local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ));

      toast({
        title: "Notification marked as read"
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Get all unread notification IDs
      const unreadIds = notifications
        .filter(notification => !notification.isRead)
        .map(notification => notification.id);

      // Mark each one as read
      for (const id of unreadIds) {
        await markNotificationAsRead(id);
      }

      // Update the local state
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));

      toast({
        title: "All notifications marked as read"
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  if (loading) {
    return (
      <PatientPortalLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading notifications...</p>
        </div>
      </PatientPortalLayout>
    );
  }

  return (
    <PatientPortalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} unread</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Stay informed about your appointments and medical updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="appointment">Appointments</TabsTrigger>
                <TabsTrigger value="medical">Medical</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No notifications to display</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border rounded-md ${!notification.isRead ? 'bg-muted/50' : 'bg-white'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(notification.createdAt), 'MMMM d, yyyy - h:mm a')}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <p>{notification.message}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PatientPortalLayout>
  );
};

export default PatientNotifications;
