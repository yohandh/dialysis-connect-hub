const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dialysis_connect_hub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  
  console.log('Connected to MySQL database successfully!');
  connection.release();
});

module.exports = pool;
