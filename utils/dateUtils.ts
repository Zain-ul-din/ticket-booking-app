/**
 * Date utility functions for ticket booking system
 * Windows 7 compatible - uses native JavaScript Date methods
 */

/**
 * Format a date as "DD MMM YYYY" (e.g., "08 Jan 2026")
 * @param date - Date object to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format a time string from 24-hour to 12-hour format
 * @param time - Time string in "HH:mm" format (e.g., "14:30")
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

/**
 * Check if a date string represents today
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns True if the date is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * Get a date string in YYYY-MM-DD format from a Date object
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse a date string in YYYY-MM-DD format to a Date object
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}
