const bcrypt = require('bcryptjs');

// The password to hash
const password = 'example.com';

// Generate a salt
const salt = bcrypt.genSaltSync(10);

// Hash the password
const hash = bcrypt.hashSync(password, salt);

console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);
