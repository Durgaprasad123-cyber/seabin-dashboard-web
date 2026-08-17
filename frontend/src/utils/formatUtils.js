/**
 * Date and time formatting utilities
 */
/**
 * Formats a timestamp into human-readable relative time (e.g., "2 minutes ago")
 * @param {string|Date} timestamp
 * @returns {string}
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid date';
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? 'month' : 'months'} ago`;
};
/**
 * Formats a timestamp into full date-time string
 * @param {string|Date} timestamp
 * @returns {string}
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};
/**
 * Formats motor current value (e.g., 1.25 -> "1.25 A").
 * Returns "N/A" if value is null, undefined, or invalid.
 * @param {number|string|null} value
 * @returns {string}
 */
export const formatCurrent = (value) => {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
    return 'N/A';
  }
  return `${Number(value)} A`;
};
