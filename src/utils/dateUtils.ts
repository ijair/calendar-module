import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameDay, isSameMonth, isToday, parseISO, isValid } from 'date-fns';

/**
 * Utility functions for calendar date operations
 */

/**
 * Get the start and end dates for a given month
 */
export const getMonthBounds = (date: Date) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

/**
 * Get the start and end dates for a given week
 */
export const getWeekBounds = (date: Date, startOfWeekDay: number = 0) => {
  return {
    start: startOfWeek(date, { weekStartsOn: startOfWeekDay as any }),
    end: endOfWeek(date, { weekStartsOn: startOfWeekDay as any }),
  };
};

/**
 * Generate an array of dates for a month view
 */
export const getMonthDates = (date: Date, startOfWeekDay: number = 0) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: startOfWeekDay as any });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: startOfWeekDay as any });
  
  const dates: Date[] = [];
  let currentDate = calendarStart;
  
  while (currentDate <= calendarEnd) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

/**
 * Generate an array of dates for a week view
 */
export const getWeekDates = (date: Date, startOfWeekDay: number = 0) => {
  const weekStart = startOfWeek(date, { weekStartsOn: startOfWeekDay as any });
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(weekStart, i));
  }
  
  return dates;
};

/**
 * Check if a date is in the current month
 */
export const isCurrentMonth = (date: Date, currentDate: Date) => {
  return isSameMonth(date, currentDate);
};

/**
 * Check if a date is today
 */
export const isCurrentDay = (date: Date) => {
  return isToday(date);
};

/**
 * Check if two dates are the same day
 */
export const isSameDate = (date1: Date, date2: Date) => {
  return isSameDay(date1, date2);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date, formatString: string = 'MMM dd, yyyy') => {
  return format(date, formatString);
};

/**
 * Format time for display
 */
export const formatTime = (date: Date, format24h: boolean = false) => {
  return format(date, format24h ? 'HH:mm' : 'h:mm a');
};

/**
 * Parse ISO date string safely
 */
export const parseISODate = (dateString: string): Date | null => {
  try {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Get next month
 */
export const getNextMonth = (date: Date) => {
  return addMonths(date, 1);
};

/**
 * Get previous month
 */
export const getPreviousMonth = (date: Date) => {
  return subMonths(date, 1);
};

/**
 * Get start of day
 */
export const getStartOfDay = (date: Date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get end of day
 */
export const getEndOfDay = (date: Date) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Check if a date is within business hours
 */
export const isWithinBusinessHours = (
  date: Date,
  businessStart: string,
  businessEnd: string,
  businessDays: number[]
) => {
  const dayOfWeek = date.getDay();
  const timeString = format(date, 'HH:mm');
  
  return (
    businessDays.includes(dayOfWeek) &&
    timeString >= businessStart &&
    timeString <= businessEnd
  );
};

/**
 * Generate time slots for a day
 */
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30
) => {
  const slots: string[] = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += intervalMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
};
