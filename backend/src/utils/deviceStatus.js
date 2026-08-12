/**
 * Utility to compute real-time status of SeaBin devices based on last_seen timestamp
 */

const getOfflineTimeout = () => {
  return parseInt(process.env.DEVICE_OFFLINE_TIMEOUT || '120', 10);
};

/**
 * Calculates whether a device is ONLINE or OFFLINE
 * @param {string|Date} lastSeen - Timestamp of when the device was last seen
 * @param {number} [timeoutInSeconds] - Timeout threshold in seconds (defaults to env config)
 * @returns {'ONLINE'|'OFFLINE'}
 */
const calculateStatus = (lastSeen, timeoutInSeconds = getOfflineTimeout()) => {
  if (!lastSeen) {
    return 'OFFLINE';
  }

  const lastSeenTime = new Date(lastSeen).getTime();
  if (isNaN(lastSeenTime)) {
    return 'OFFLINE';
  }

  const now = Date.now();
  const diffInSeconds = (now - lastSeenTime) / 1000;

  return diffInSeconds <= timeoutInSeconds ? 'ONLINE' : 'OFFLINE';
};

module.exports = {
  calculateStatus,
  getOfflineTimeout,
};
