import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { Button, Badge } from '@mui/material';
import Link from 'next/link';
import useAuth from '@modules/auth/hooks/api/useAuth'; // Assuming useAuth is available

interface Notification {
  id: number;
  message: string;
  link: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth(); // Getting user and authToken from the useAuth hook
  const authToken = localStorage.getItem('authToken');
  useEffect(() => {
    if (!authToken || !user) {
      console.error('No authentication token or user found');
      return;
    }

    // Initialize Pusher (or Soketi)
    const pusher = new Pusher('app-key', {
      cluster: 'mt1',
      forceTLS: false,
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${authToken}`, // Sending auth token
        },
      },
    });

    // Debugging: Listen for connection state changes
    pusher.connection.bind('connected', () => {
      console.log('✅ Pusher connected successfully!');
    });

    pusher.connection.bind('error', (err: unknown) => {
      console.error('❌ Pusher connection error:', err);
    });

    // Subscribe to the user's notification channel
    const channel = pusher.subscribe(`user.${user.id}`);

    setTimeout(() => {
      console.log('Subscription Status:', channel.subscribed);
    }, 3000);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Successfully subscribed to channel user.${user.id}`);
    });

    channel.bind('pusher:subscription_error', (status: unknown) => {
      console.error(`❌ Subscription error:`, status);
    });

    // Listen for the 'new-notification' event
    channel.bind('new-notification', (data: Notification) => {
      console.log('Received new notification:', data);
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    // Cleanup the subscription when the component is unmounted
    return () => {
      pusher.unsubscribe(`user.${user.id}`);
    };
  }, [authToken, user]);

  // Mark notifications as read
  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button onClick={markAsRead}>
        <Badge badgeContent={unreadCount} color="error">
          🔔
        </Badge>
      </Button>

      {/* Dropdown for notifications */}
      {notifications.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '0',
            backgroundColor: '#fff',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            maxHeight: '300px',
            overflowY: 'auto',
            width: '250px',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          {notifications.map((notification) => (
            <div key={notification.id} style={{ marginBottom: '10px' }}>
              <Link href={notification.link} style={{ textDecoration: 'none', color: '#333' }}>
                {notification.message}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
