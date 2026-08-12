const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🌊 SeaBin IoT Backend Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/v1/health`);
  console.log(`📡 Telemetry Ingest URL: http://localhost:${PORT}/api/v1/devices/data`);
});

// Handle unhandled rejections cleanly
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Keep server running in production, log error
});

module.exports = server;
