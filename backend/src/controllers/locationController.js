const locationService = require('../services/locationService');

/**
 * Get aggregated city statistics
 * GET /api/v1/locations
 */
const getLocations = async (req, res, next) => {
  try {
    const stats = await locationService.getCityLocationStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
};
