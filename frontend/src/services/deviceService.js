import api from './api';

export const fetchDevices = async () => {
  const response = await api.get('/devices');
  return response.data.data;
};

export const fetchDeviceById = async (deviceId) => {
  const response = await api.get(`/devices/${deviceId}`);
  return response.data.data;
};

export const fetchDeviceReadings = async (deviceId, limit = 50) => {
  const response = await api.get(`/devices/${deviceId}/readings?limit=${limit}`);
  return response.data.data;
};
