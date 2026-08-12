const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const deviceRoutes = require('./routes/deviceRoutes');
const locationRoutes = require('./routes/locationRoutes');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // Allow connections from React dashboard & ESP32 devices
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-device-api-key'],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// Base route redirect / health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SeaBin IoT Monitoring System API Version 1.0',
    endpoints: {
      health: '/api/v1/health',
      devices: '/api/v1/devices',
      locations: '/api/v1/locations',
      telemetryIngest: 'POST /api/v1/devices/data',
    },
  });
});

// API v1 Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/locations', locationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
