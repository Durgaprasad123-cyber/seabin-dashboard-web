const deviceService = require('../services/deviceService');

/**
 * Ingest telemetry data from ESP32 device
 * POST /api/v1/devices/data
 */
const ingestDeviceData = async (req, res, next) => {
  try {
    const result = await deviceService.processTelemetryData(req.sanitizedData);
    return res.status(200).json({
      success: true,
      message: 'Telemetry data processed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of all SeaBin devices
 * GET /api/v1/devices
 */
const getDevices = async (req, res, next) => {
  try {
    const devices = await deviceService.getAllDevices();
    return res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single device by deviceId
 * GET /api/v1/devices/:deviceId
 */
const getDeviceByDeviceId = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await deviceService.getDeviceById(deviceId.toUpperCase());

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Unable to find device with ID: ${deviceId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get historical sensor readings for a specific device
 * GET /api/v1/devices/:deviceId/readings
 */
const getReadingsByDeviceId = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;

    const readings = await deviceService.getDeviceReadings(deviceId.toUpperCase(), limit);
    return res.status(200).json({
      success: true,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ingestDeviceData,
  getDevices,
  getDeviceByDeviceId,
  getReadingsByDeviceId,
};
