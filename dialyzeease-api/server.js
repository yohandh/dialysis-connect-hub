require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool, testConnection } = require('./config/db');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const centerRoutes = require('./routes/center.routes');
const userRoutes = require('./routes/user.routes');
const ckdRoutes = require('./routes/ckd.routes');
const bedRoutes = require('./routes/bed.routes');
const sessionRoutes = require('./routes/session.routes');
const scheduleSessionRoutes = require('./routes/schedule-session.routes');
const notificationRoutes = require('./routes/notification.routes');
const auditRoutes = require('./routes/audit.routes');

// Import controllers for direct route registration
const userController = require('./controllers/user.controller');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS configuration for development and production
const corsOptions = {
  origin: '*', // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MySQL/MariaDB
testConnection()
  .then(connected => {
    if (!connected) {
      console.error('Failed to connect to MySQL/MariaDB');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error testing database connection:', err);
    process.exit(1);
  });

// Direct route registration for problematic endpoints
// This needs to be registered BEFORE the /api/users route to avoid conflicts
app.get('/api/roles', userController.getAllRoles);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ckd-records', ckdRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api', sessionRoutes);
app.use('/api', scheduleSessionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-logs', auditRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working correctly' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API documentation route
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'DiaCare API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      appointments: '/api/appointments',
      centers: '/api/centers',
      users: '/api/users',
      ckdRecords: '/api/ckd-records',
      beds: '/api/beds',
      availableBeds: '/api/beds/sessions/:sessionId/available-beds',
      sessions: '/api/centers/:centerId/sessions',
      scheduleSessions: '/api/centers/:centerId/schedule-sessions',
      roles: '/api/roles',
      notifications: '/api/notifications',
      auditLogs: '/api/audit-logs'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

module.exports = app;
