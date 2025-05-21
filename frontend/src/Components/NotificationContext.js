import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const fetchNotificationCount = useCallback(async (retryCount = 3) => {
    const email = localStorage.getItem('email');
    if (!email) {
      console.log('NotificationContext: No email found, skipping fetch');
      setNotificationCount(0);
      setError('No email found in localStorage');
      return;
    }

    try {
      console.log('NotificationContext: Fetching notification count for', email);
      const response = await axios.get(`${BASE_URL}/api/notifications/notification-count/${email}`);
      const { unreadCount } = response.data;
      setNotificationCount(unreadCount || 0);
      setError(null);
      console.log('NotificationContext: Notification count:', unreadCount);
    } catch (error) {
      console.error('NotificationContext: Error fetching notification count:', error.message);
      if (error.response) {
        // Handle specific HTTP status codes
        if (error.response.status === 404) {
          setError('Notification endpoint not found. Check backend configuration.');
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request && retryCount > 0) {
        // Retry on network errors
        console.log(`NotificationContext: Retrying... Attempts left: ${retryCount}`);
        setTimeout(() => fetchNotificationCount(retryCount - 1), 1000);
        return;
      } else {
        setError('Network error. Please check your connection.');
      }
      setNotificationCount(0);
    }
  }, []);

  // Fetch full notifications for debugging or display
  const fetchNotifications = useCallback(async () => {
    const email = localStorage.getItem('email');
    if (!email) {
      console.log('NotificationContext: No email found, skipping fetch');
      setNotifications([]);
      setError('No email found in localStorage');
      return;
    }

    try {
      console.log('NotificationContext: Fetching notifications for', email);
      const response = await axios.get(`${BASE_URL}/api/notifications/notifications/${email}`);
      const notifications = response.data.notifications || [];
      setNotifications(notifications);
      setNotificationCount(notifications.filter(n => !n.isRead).length);
      setError(null);
      console.log('NotificationContext: Fetched notifications:', notifications);
    } catch (error) {
      console.error('NotificationContext: Error fetching notifications:', error.message);
      if (error.response) {
        if (error.response.status === 404) {
          setError('Notifications endpoint not found. Check backend configuration.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        }
      } else {
        setError('Network error. Please check your connection.');
      }
      setNotifications([]);
      setNotificationCount(0);
    }
  }, []);

  // Fetch notification count on mount
  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        fetchNotificationCount,
        notifications,
        fetchNotifications,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};