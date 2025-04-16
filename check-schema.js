// Script to check database schema
const { pool } = require('./dchub-api/config/db');

async function checkSchema() {
  try {
    console.log('Checking database schema...');
    
    // Check users table structure
    console.log('\n--- USERS TABLE ---');
    const [usersColumns] = await pool.query('DESCRIBE users');
    console.table(usersColumns);
    
    // Check roles table structure
    console.log('\n--- ROLES TABLE ---');
    const [rolesColumns] = await pool.query('DESCRIBE roles');
    console.table(rolesColumns);
    
    // Check foreign key relationship
    console.log('\n--- FOREIGN KEYS ---');
    const [foreignKeys] = await pool.query(`
      SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
    `);
    console.table(foreignKeys);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
