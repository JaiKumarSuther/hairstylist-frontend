// Calendar integration utilities
export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}

export const addToCalendar = async (event: CalendarEvent): Promise<boolean> => {
  try {
    // Check if user is on mobile (iOS/Android)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS Calendar integration
      const calendarUrl = generateIOSCalendarURL(event);
      window.open(calendarUrl, '_blank');
      return true;
    } else if (isAndroid) {
      // Android Calendar integration
      const calendarUrl = generateAndroidCalendarURL(event);
      window.open(calendarUrl, '_blank');
      return true;
    } else {
      // Desktop - use Google Calendar
      const calendarUrl = generateGoogleCalendarURL(event);
      window.open(calendarUrl, '_blank');
      return true;
    }
  } catch (error) {
    console.error('Failed to add to calendar:', error);
    return false;
  }
};

const generateGoogleCalendarURL = (event: CalendarEvent): string => {
  const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: event.description,
    location: event.location || '',
    url: event.url || '',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const generateIOSCalendarURL = (event: CalendarEvent): string => {
  // iOS Calendar URL scheme
  const startDate = event.startDate.toISOString();
  const endDate = event.endDate.toISOString();
  
  return `webcal://p01-calendarws.icloud.com/ca/subscribe/1/${encodeURIComponent(event.title)}`;
};

const generateAndroidCalendarURL = (event: CalendarEvent): string => {
  // Android Calendar intent
  const startTime = event.startDate.getTime();
  const endTime = event.endDate.getTime();
  
  return `intent://event/create?title=${encodeURIComponent(event.title)}&start=${startTime}&end=${endTime}&description=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location || '')}#Intent;scheme=calendar;package=com.google.android.calendar;end`;
};

export const setWorkshopReminder = async (workshop: {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
}): Promise<boolean> => {
  const eventDate = new Date(`${workshop.date} ${workshop.time}`);
  const reminderDate = new Date(eventDate.getTime() - (24 * 60 * 60 * 1000)); // 1 day before
  
  const event: CalendarEvent = {
    title: `Workshop Reminder: ${workshop.title}`,
    description: `Reminder: ${workshop.title} with ${workshop.instructor} is tomorrow!`,
    startDate: reminderDate,
    endDate: new Date(reminderDate.getTime() + (60 * 60 * 1000)), // 1 hour duration
    location: 'Online Workshop',
    url: `${window.location.origin}/workshops`,
  };
  
  return await addToCalendar(event);
};
