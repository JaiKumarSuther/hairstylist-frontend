'use client';

import { useEffect } from 'react';
import { initializeNotifications } from '@/lib/notifications';

export const NotificationInitializer: React.FC = () => {
  useEffect(() => {
    // Initialize notification system when the app loads
    const initNotifications = async () => {
      try {
        const hasPermission = await initializeNotifications();
        if (hasPermission) {
          console.log('Notification system initialized successfully');
        } else {
          console.log('Notification permission not granted');
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initNotifications();
  }, []);

  // This component doesn't render anything
  return null;
};
