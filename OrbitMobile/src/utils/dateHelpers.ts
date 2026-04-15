/**
 * Formats: "Mon, Mar 27"
 * Perfect for Schedule headers where horizontal space is tight.
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();

  return `${weekday}, ${month} ${day}`;
};

/**
 * Formats: "2:00 PM"
 * Handles "14:00" -> "2:00 PM" conversion safely.
 */
export const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  
  // Handle both "14:00" and "14:00:00" formats
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${displayHours}:${displayMinutes} ${ampm}`;
};

/**
 * Returns "Today", "Tomorrow", or the Date.
 * Essential for the Mess Menu and Task list.
 */
export const getRelativeDateLabel = (dateString: string): string => {
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (target.getTime() === today.getTime()) return 'Today';
  if (target.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return formatDate(dateString);
};