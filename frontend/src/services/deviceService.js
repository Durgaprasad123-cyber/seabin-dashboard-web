import api from './api';

/**
 * Normalizes a sensor reading object to ensure camelCase field names.
 */
const normalizeReading = (reading) => {
  if (!reading) return null;
  return {
    ...reading,
    id: reading.id,
    deviceId: reading.deviceId || reading.device_id,
    trashLevel: reading.trashLevel ?? reading.trash_level ?? 0,
    innerBinWaterLevel: reading.innerBinWaterLevel ?? reading.inner_bin_water_level ?? 0,
    pumpState: reading.pumpState ?? reading.pump_state ?? null,
    motorCurrent1: reading.motorCurrent1 ?? reading.motor_current1 ?? null,
    motorCurrent2: reading.motorCurrent2 ?? reading.motor_current2 ?? null,
    timestamp: reading.timestamp,
  };
};

/**
 * Normalizes a device object to ensure camelCase field names & nested latestReading.
 */
const normalizeDevice = (device) => {
  if (!device) return null;
  return {
    ...device,
    deviceId: device.deviceId || device.device_id,
    city: device.city || 'Unknown City',
    locationName: device.locationName || device.location_name || 'Unspecified Location',
    latitude: device.latitude ?? 0,
    longitude: device.longitude ?? 0,
    lastSeen: device.lastSeen || device.last_seen,
    status: device.status || 'OFFLINE',
    latestReading: normalizeReading(device.latestReading),
  };
};

export const fetchDevices = async () => {
  const response = await api.get('/devices');
  const data = response.data.data;
  if (Array.isArray(data)) {
    return data.map(normalizeDevice);
  }
  return [];
};

export const fetchDeviceById = async (deviceId) => {
  const response = await api.get(`/devices/${deviceId}`);
  return normalizeDevice(response.data.data);
};

export const fetchDeviceReadings = async (deviceId, limit = 50) => {
  const response = await api.get(`/devices/${deviceId}/readings?limit=${limit}`);
  const data = response.data.data;
  if (Array.isArray(data)) {
    return data.map(normalizeReading);
  }
  return [];
};
