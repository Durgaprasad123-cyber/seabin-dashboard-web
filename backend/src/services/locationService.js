const supabase = require('../config/supabase');
const { calculateStatus } = require('../utils/deviceStatus');

/**
 * Dynamically aggregates city statistics from Supabase PostgreSQL table `devices`.
 * Groups devices by city and counts total, online, and offline status.
 */
const getCityLocationStats = async () => {
  const { data: devices, error } = await supabase
    .from('devices')
    .select('id, device_id, city, last_seen');

  if (error) {
    throw new Error(`Failed to fetch location stats: ${error.message}`);
  }

  if (!devices || devices.length === 0) {
    return [];
  }

  const cityStatsMap = {};

  for (const dev of devices) {
    const cityName = dev.city || 'Unknown City';
    const status = calculateStatus(dev.last_seen);

    if (!cityStatsMap[cityName]) {
      cityStatsMap[cityName] = {
        city: cityName,
        totalDevices: 0,
        onlineDevices: 0,
        offlineDevices: 0,
      };
    }

    cityStatsMap[cityName].totalDevices += 1;

    if (status === 'ONLINE') {
      cityStatsMap[cityName].onlineDevices += 1;
    } else {
      cityStatsMap[cityName].offlineDevices += 1;
    }
  }

  return Object.values(cityStatsMap).sort((a, b) => b.totalDevices - a.totalDevices);
};

module.exports = {
  getCityLocationStats,
};
