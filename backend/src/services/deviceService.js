const supabase = require('../config/supabase');
const { calculateStatus } = require('../utils/deviceStatus');

/**
 * Process telemetry data sent by an ESP32 SeaBin device.
 * Automatically registers the device if new, or updates its metadata & last_seen timestamp if existing,
 * and inserts a historical sensor reading record.
 */
const processTelemetryData = async (data) => {
  const { deviceId, trashLevel, innerBinWaterLevel, city, locationName, latitude, longitude } = data;
  const nowISO = new Date().toISOString();

  // 1. Check if device exists in `devices` table
  const { data: existingDevice, error: findError } = await supabase
    .from('devices')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (findError) {
    console.error(`Error querying device ${deviceId}:`, findError.message);
  }

  let deviceRecord;

  if (existingDevice) {
    // 2a. Update existing device
    const { data: updatedDevice, error: updateError } = await supabase
      .from('devices')
      .update({
        city,
        location_name: locationName,
        latitude,
        longitude,
        last_seen: nowISO,
        updated_at: nowISO,
      })
      .eq('device_id', deviceId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update device ${deviceId}: ${updateError.message}`);
    }
    deviceRecord = updatedDevice;
  } else {
    // 2b. Register new device automatically
    const { data: newDevice, error: insertError } = await supabase
      .from('devices')
      .insert({
        device_id: deviceId,
        city,
        location_name: locationName,
        latitude,
        longitude,
        last_seen: nowISO,
        created_at: nowISO,
        updated_at: nowISO,
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to register new device ${deviceId}: ${insertError.message}`);
    }
    deviceRecord = newDevice;
  }

  // 3. Insert reading into `sensor_readings`
  const { data: newReading, error: readingError } = await supabase
    .from('sensor_readings')
    .insert({
      device_id: deviceId,
      trash_level: trashLevel,
      inner_bin_water_level: innerBinWaterLevel,
      timestamp: nowISO,
    })
    .select()
    .single();

  if (readingError) {
    throw new Error(`Failed to store sensor reading for ${deviceId}: ${readingError.message}`);
  }

  const computedStatus = calculateStatus(deviceRecord.last_seen);

  return {
    device: {
      id: deviceRecord.id,
      deviceId: deviceRecord.device_id,
      city: deviceRecord.city,
      locationName: deviceRecord.location_name,
      latitude: deviceRecord.latitude,
      longitude: deviceRecord.longitude,
      lastSeen: deviceRecord.last_seen,
      status: computedStatus,
    },
    reading: {
      id: newReading.id,
      trashLevel: newReading.trash_level,
      innerBinWaterLevel: newReading.inner_bin_water_level,
      timestamp: newReading.timestamp,
    },
  };
};

/**
 * Retrieve all SeaBin devices along with their dynamic status and latest sensor reading.
 */
const getAllDevices = async () => {
  const { data: devices, error: deviceError } = await supabase
    .from('devices')
    .select('*')
    .order('last_seen', { ascending: false });

  if (deviceError) {
    throw new Error(`Failed to fetch devices: ${deviceError.message}`);
  }

  if (!devices || devices.length === 0) {
    return [];
  }

  // Fetch the latest reading for each device
  const deviceIds = devices.map(d => d.device_id);
  const { data: readings, error: readingsError } = await supabase
    .from('sensor_readings')
    .select('*')
    .in('device_id', deviceIds)
    .order('timestamp', { ascending: false });

  if (readingsError) {
    console.error('Error fetching latest readings:', readingsError.message);
  }

  // Map latest reading per device
  const latestReadingMap = {};
  if (readings) {
    for (const r of readings) {
      if (!latestReadingMap[r.device_id]) {
        latestReadingMap[r.device_id] = {
          trashLevel: r.trash_level,
          innerBinWaterLevel: r.inner_bin_water_level,
          timestamp: r.timestamp,
        };
      }
    }
  }

  return devices.map(dev => {
    const status = calculateStatus(dev.last_seen);
    const reading = latestReadingMap[dev.device_id] || {
      trashLevel: 0,
      innerBinWaterLevel: 0,
      timestamp: dev.last_seen || dev.created_at,
    };

    return {
      id: dev.id,
      deviceId: dev.device_id,
      city: dev.city,
      locationName: dev.location_name,
      latitude: dev.latitude,
      longitude: dev.longitude,
      lastSeen: dev.last_seen,
      createdAt: dev.created_at,
      updatedAt: dev.updated_at,
      status,
      latestReading: reading,
    };
  });
};

/**
 * Get single device by deviceId with latest reading.
 */
const getDeviceById = async (deviceId) => {
  const { data: device, error: deviceError } = await supabase
    .from('devices')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (deviceError) {
    throw new Error(`Failed to fetch device ${deviceId}: ${deviceError.message}`);
  }

  if (!device) {
    return null;
  }

  // Fetch latest reading
  const { data: reading } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('device_id', deviceId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  const status = calculateStatus(device.last_seen);

  return {
    id: device.id,
    deviceId: device.device_id,
    city: device.city,
    locationName: device.location_name,
    latitude: device.latitude,
    longitude: device.longitude,
    lastSeen: device.last_seen,
    createdAt: device.created_at,
    updatedAt: device.updated_at,
    status,
    latestReading: reading ? {
      id: reading.id,
      trashLevel: reading.trash_level,
      innerBinWaterLevel: reading.inner_bin_water_level,
      timestamp: reading.timestamp,
    } : {
      trashLevel: 0,
      innerBinWaterLevel: 0,
      timestamp: device.last_seen || device.created_at,
    },
  };
};

/**
 * Fetch historical sensor readings for a specific device.
 */
const getDeviceReadings = async (deviceId, limit = 50) => {
  const { data: readings, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('device_id', deviceId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch readings for ${deviceId}: ${error.message}`);
  }

  return (readings || []).map(r => ({
    id: r.id,
    deviceId: r.device_id,
    trashLevel: r.trash_level,
    innerBinWaterLevel: r.inner_bin_water_level,
    timestamp: r.timestamp,
  }));
};

module.exports = {
  processTelemetryData,
  getAllDevices,
  getDeviceById,
  getDeviceReadings,
};
