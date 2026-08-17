/**
 * Input validation utilities for API endpoints
 */

const validateDeviceData = (req, res, next) => {
  const {
    deviceId,
    trashLevel,
    innerBinWaterLevel,
    city,
    locationName,
    latitude,
    longitude,
    pumpState,
    motorCurrent1,
    motorCurrent2,
  } = req.body;

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

  let sanitizedPumpState = null;
  if (pumpState !== undefined && pumpState !== null) {
    if (typeof pumpState !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: pumpState must be a string.',
      });
    }
    const formattedPumpState = pumpState.trim().toUpperCase();
    if (formattedPumpState !== 'COLLECTION' && formattedPumpState !== 'DRAINAGE') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: pumpState must be either "COLLECTION" or "DRAINAGE".',
      });
    }
    sanitizedPumpState = formattedPumpState;
  }

  let parsedMotorCurrent1 = 0;
  if (motorCurrent1 !== undefined && motorCurrent1 !== null) {
    if (isNaN(Number(motorCurrent1))) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: motorCurrent1 must be a valid number.',
      });
    }
    parsedMotorCurrent1 = Number(motorCurrent1);
  }

  let parsedMotorCurrent2 = 0;
  if (motorCurrent2 !== undefined && motorCurrent2 !== null) {
    if (isNaN(Number(motorCurrent2))) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: motorCurrent2 must be a valid number.',
      });
    }
    parsedMotorCurrent2 = Number(motorCurrent2);
  }

  req.sanitizedData = {
    deviceId: deviceId.trim().toUpperCase(),
    trashLevel: Math.round(parsedTrashLevel),
    innerBinWaterLevel: Math.round(parsedWaterLevel),
    pumpState: sanitizedPumpState,
    motorCurrent1: parsedMotorCurrent1,
    motorCurrent2: parsedMotorCurrent2,
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
