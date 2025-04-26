/**
 * Script to list all tables in the dialyzeease database
 */
const { pool } = require('../config/db');

async function listTables() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Database connection established successfully.');
    
    // Query to get all tables in the database
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\nTables in the database:');
    console.log('=======================');
    
    tables.forEach((table, index) => {
      // Extract the table name from the result object
      const tableName = Object.values(table)[0];
      console.log(`${index + 1}. ${tableName}`);
    });
    
    // For each table, get the column information
    console.log('\nDetailed table information:');
    console.log('==========================');
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await connection.query(`DESCRIBE ${tableName}`);
      
      console.log(`\nTable: ${tableName}`);
      console.log('-'.repeat(tableName.length + 7));
      
      // Print column information in a formatted way
      console.log('Column Name\tType\t\tNull\tKey\tDefault');
      console.log('-'.repeat(60));
      
      columns.forEach(column => {
        console.log(`${column.Field}\t${column.Type.padEnd(16)}\t${column.Null}\t${column.Key || '-'}\t${column.Default || '-'}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('\nDatabase connection closed.');
    }
    // Close the pool to end the process
    pool.end();
  }
}

// Execute the function
listTables();
