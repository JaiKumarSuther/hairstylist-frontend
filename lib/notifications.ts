// Notification and reminder system
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'workshop_reminder' | 'new_content' | 'community' | 'general';
  scheduledFor: Date;
  isRead: boolean;
  createdAt: Date;
  data?: any; // Additional data for the notification
}

export interface WorkshopReminder {
  workshopId: string;
  workshopTitle: string;
  workshopDate: Date;
  reminderType: '1_day' | '1_hour' | '30_minutes';
  userId: string;
}

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};

// Schedule workshop reminder
export const scheduleWorkshopReminder = (reminder: WorkshopReminder): void => {
  const now = new Date();
  const workshopDate = new Date(reminder.workshopDate);
  
  let reminderTime: Date;
  let reminderText: string;

  switch (reminder.reminderType) {
    case '1_day':
      reminderTime = new Date(workshopDate.getTime() - (24 * 60 * 60 * 1000));
      reminderText = '1 day before';
      break;
    case '1_hour':
      reminderTime = new Date(workshopDate.getTime() - (60 * 60 * 1000));
      reminderText = '1 hour before';
      break;
    case '30_minutes':
      reminderTime = new Date(workshopDate.getTime() - (30 * 60 * 1000));
      reminderText = '30 minutes before';
      break;
    default:
      return;
  }

  // Only schedule if the reminder time is in the future
  if (reminderTime > now) {
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      showNotification(
        `Workshop Reminder: ${reminder.workshopTitle}`,
        {
          body: `Your workshop "${reminder.workshopTitle}" starts ${reminderText}!`,
          tag: `workshop-${reminder.workshopId}`,
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View Workshop'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        }
      );
    }, timeUntilReminder);

    // Store reminder in localStorage for persistence
    const reminders = getScheduledReminders();
    reminders.push({
      ...reminder,
      scheduledFor: reminderTime,
      id: Date.now().toString()
    });
    localStorage.setItem('workshop_reminders', JSON.stringify(reminders));
  }
};

// Get scheduled reminders
export const getScheduledReminders = (): WorkshopReminder[] => {
  if (typeof window === 'undefined') return [];
  
  const remindersJson = localStorage.getItem('workshop_reminders');
  if (!remindersJson) return [];
  
  try {
    return JSON.parse(remindersJson);
  } catch (error) {
    console.error('Error parsing reminders:', error);
    return [];
  }
};

// Cancel workshop reminder
export const cancelWorkshopReminder = (workshopId: string, reminderType: WorkshopReminder['reminderType']): void => {
  const reminders = getScheduledReminders();
  const filteredReminders = reminders.filter(
    reminder => !(reminder.workshopId === workshopId && reminder.reminderType === reminderType)
  );
  localStorage.setItem('workshop_reminders', JSON.stringify(filteredReminders));
};

// Schedule multiple reminders for a workshop
export const scheduleWorkshopReminders = (workshopId: string, workshopTitle: string, workshopDate: Date, userId: string): void => {
  // Schedule 1 day before reminder
  scheduleWorkshopReminder({
    workshopId,
    workshopTitle,
    workshopDate,
    reminderType: '1_day',
    userId
  });

  // Schedule 1 hour before reminder
  scheduleWorkshopReminder({
    workshopId,
    workshopTitle,
    workshopDate,
    reminderType: '1_hour',
    userId
  });

  // Schedule 30 minutes before reminder
  scheduleWorkshopReminder({
    workshopId,
    workshopTitle,
    workshopDate,
    reminderType: '30_minutes',
    userId
  });
};

// Show new content notification
export const showNewContentNotification = (contentType: 'workshop' | 'tutorial' | 'community', title: string): void => {
  let notificationTitle: string;
  let notificationBody: string;

  switch (contentType) {
    case 'workshop':
      notificationTitle = 'New Workshop Available!';
      notificationBody = `Check out the new workshop: ${title}`;
      break;
    case 'tutorial':
      notificationTitle = 'New Tutorial Added!';
      notificationBody = `Learn something new: ${title}`;
      break;
    case 'community':
      notificationTitle = 'Community Update!';
      notificationBody = `New activity in the community: ${title}`;
      break;
    default:
      return;
  }

  showNotification(notificationTitle, {
    body: notificationBody,
    tag: `new-${contentType}`,
    requireInteraction: false
  });
};

// Show community challenge notification
export const showCommunityChallengeNotification = (challengeTitle: string): void => {
  showNotification('New Community Challenge!', {
    body: `Join the challenge: ${challengeTitle}`,
    tag: 'community-challenge',
    requireInteraction: true,
    actions: [
      {
        action: 'join',
        title: 'Join Challenge'
      },
      {
        action: 'dismiss',
        title: 'Maybe Later'
      }
    ]
  });
};

// Check and restore scheduled reminders on app load
export const restoreScheduledReminders = (): void => {
  const reminders = getScheduledReminders();
  const now = new Date();

  reminders.forEach(reminder => {
    const reminderTime = new Date(reminder.workshopDate);
    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    if (timeUntilReminder > 0) {
      // Re-schedule the reminder
      setTimeout(() => {
        showNotification(
          `Workshop Reminder: ${reminder.workshopTitle}`,
          {
            body: `Your workshop "${reminder.workshopTitle}" starts soon!`,
            tag: `workshop-${reminder.workshopId}`,
            requireInteraction: true
          }
        );
      }, timeUntilReminder);
    }
  });
};

// Initialize notification system
export const initializeNotifications = async (): Promise<boolean> => {
  const hasPermission = await requestNotificationPermission();
  
  if (hasPermission) {
    // Restore any scheduled reminders
    restoreScheduledReminders();
  }
  
  return hasPermission;
};
