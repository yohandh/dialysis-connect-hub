/**
 * MariaDB Initialization Script for DialyzeEase
 * 
 * This script initializes the MariaDB database for the DialyzeEase application.
 * It creates a user, database, and grants necessary privileges.
 * It also executes the SQL schema file to create the database tables.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_ROOT_USER || 'root',
  password: process.env.DB_ROOT_PASSWORD || '',
  multipleStatements: true,
  authPlugins: {
    // Use default authentication for auth_gssapi_client
    'auth_gssapi_client': () => () => Buffer.from('', 'utf8')
  }
};

// Database user and credentials
const DB_USER = process.env.DB_USER || 'dc_hub';
const DB_PASSWORD = process.env.DB_PASSWORD || 'DC-Hu2';
const DB_NAME = process.env.DB_NAME || 'dc_hub';

// Path to schema file - updated to point to the correct location
const schemaFilePath = path.join(__dirname, '../../dialyzeease-scripts/dialyzeease_db_schema_v1.8.sql');

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MariaDB...');
    connection = await mysql.createConnection(config);
    console.log('Connected to MariaDB successfully.');

    // Create user if not exists
    console.log(`Creating user ${DB_USER}...`);
    await connection.execute(`
      CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
    `);

    // Grant privileges to user
    console.log('Granting privileges...');
    await connection.execute(`
      GRANT ALL PRIVILEGES ON *.* TO '${DB_USER}'@'%' REQUIRE NONE WITH GRANT OPTION 
      MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
    `);

    // Create database if not exists
    console.log(`Creating database ${DB_NAME}...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);

    // Grant privileges on the specific database
    console.log(`Granting privileges on database ${DB_NAME}...`);
    await connection.execute(`GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';`);

    // Flush privileges to ensure changes take effect
    await connection.execute('FLUSH PRIVILEGES;');
    console.log('Privileges flushed successfully.');

    // Switch to the new database
    console.log(`Switching to database ${DB_NAME}...`);
    await connection.query(`USE \`${DB_NAME}\`;`);

    // Read and execute the schema file
    console.log('Reading schema file...');
    const schemaSQL = fs.readFileSync(schemaFilePath, 'utf8');
    
    console.log('Executing schema file...');
    await connection.query(schemaSQL);
    console.log('Schema created successfully.');

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

// Execute the initialization function
initializeDatabase();
