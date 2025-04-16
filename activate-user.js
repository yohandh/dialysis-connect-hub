// Script to activate a user account
const { pool } = require('./dchub-api/config/db');

async function activateUser(email) {
  try {
    // First check if the user exists
    const [users] = await pool.query(
      'SELECT id, name, email, status FROM users WHERE email = ?',
      [email]
    );
    
    if (!users || users.length === 0) {
      console.log(`User with email ${email} not found.`);
      process.exit(1);
    }
    
    const user = users[0];
    console.log('Found user:', user);
    
    if (user.status === 'active') {
      console.log(`User ${user.name} (${user.email}) is already active.`);
    } else {
      // Update the user status to active
      await pool.query(
        'UPDATE users SET status = ? WHERE id = ?',
        ['active', user.id]
      );
      console.log(`User ${user.name} (${user.email}) has been activated successfully.`);
    }
    
    // Show all users for verification
    const [allUsers] = await pool.query('SELECT id, name, email, status FROM users');
    console.log('\nAll users:');
    console.table(allUsers);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

// Get email from command line argument or use a default admin email
const email = process.argv[2] || 'admin@dialysisconnecthub.com';
activateUser(email);
