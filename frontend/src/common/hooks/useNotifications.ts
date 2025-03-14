// src/modules/notifications/hooks/useNotifications.ts
import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const fetchNotifications = async (): Promise<Notification[]> => {
  // Replace this with your actual API call
  const response = await fetch('/notifications');
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((notif) => !notif.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    getNotifications();
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
  };
};

export default useNotifications;
