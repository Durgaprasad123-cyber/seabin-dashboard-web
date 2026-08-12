/**
 * Input validation utilities for API endpoints
 */

const validateDeviceData = (req, res, next) => {
  const { deviceId, trashLevel, innerBinWaterLevel, city, locationName, latitude, longitude } = req.body;

  if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: deviceId is required and must be a non-empty string.',
    });
  }

  if (trashLevel === undefined || trashLevel === null || typeof Number(trashLevel) !== 'number' || isNaN(Number(trashLevel))) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: trashLevel is required and must be a valid number.',
    });
  }

  const parsedTrashLevel = Number(trashLevel);
  if (parsedTrashLevel < 0 || parsedTrashLevel > 100) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: trashLevel must be between 0 and 100.',
    });
  }

  if (innerBinWaterLevel === undefined || innerBinWaterLevel === null || typeof Number(innerBinWaterLevel) !== 'number' || isNaN(Number(innerBinWaterLevel))) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: innerBinWaterLevel is required and must be a valid number.',
    });
  }

  const parsedWaterLevel = Number(innerBinWaterLevel);
  if (parsedWaterLevel < 0 || parsedWaterLevel > 100) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: innerBinWaterLevel must be between 0 and 100.',
    });
  }

  req.sanitizedData = {
    deviceId: deviceId.trim().toUpperCase(),
    trashLevel: Math.round(parsedTrashLevel),
    innerBinWaterLevel: Math.round(parsedWaterLevel),
    city: (city && typeof city === 'string' && city.trim()) ? city.trim() : 'Unknown City',
    locationName: (locationName && typeof locationName === 'string' && locationName.trim()) ? locationName.trim() : 'Unspecified Location',
    latitude: (latitude !== undefined && !isNaN(Number(latitude))) ? Number(latitude) : 0,
    longitude: (longitude !== undefined && !isNaN(Number(longitude))) ? Number(longitude) : 0,
  };

  next();
};

module.exports = {
  validateDeviceData,
};
