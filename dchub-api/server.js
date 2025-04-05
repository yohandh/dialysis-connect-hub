
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

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS configuration for development and production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:5173'],
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ckd-records', ckdRoutes);

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
      ckdRecords: '/api/ckd-records'
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
