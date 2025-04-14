/**
 * Database connection configuration for MySQL/MariaDB
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'dc_hub',
  password: process.env.DB_PASSWORD || 'DC-Hu2',
  database: process.env.DB_NAME || 'dc_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Add authentication plugin handling
  authPlugins: {
    // Use default authentication
    'auth_gssapi_client': () => () => Buffer.from('', 'utf8')
  }
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully.');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection
};
