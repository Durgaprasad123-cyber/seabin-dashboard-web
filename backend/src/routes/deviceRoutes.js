const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { validateDeviceData } = require('../utils/validation');

// Telemetry ingestion endpoint for ESP32 devices
router.post('/data', validateDeviceData, deviceController.ingestDeviceData);

// Device retrieval endpoints
router.get('/', deviceController.getDevices);
router.get('/:deviceId', deviceController.getDeviceByDeviceId);
router.get('/:deviceId/readings', deviceController.getReadingsByDeviceId);

module.exports = router;
