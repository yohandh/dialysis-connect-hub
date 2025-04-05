
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

// Login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Get user details based on role
    let roleData = null;
    if (user.role_id === 3) { // Patient
      // Get patient data from MySQL
      const [patientRows] = await pool.query('SELECT * FROM patients WHERE user_id = ?', [user.id]);
      if (patientRows.length > 0) {
        roleData = patientRows[0];
      }
    }
    // Add more role-specific data fetching as needed

    // Update last login time
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        roleId: user.role_id,
        roleName: user.getRoleName(),
        status: user.is_active ? 'active' : 'inactive'
      },
      roleData
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Register (Basic registration - primarily for patients)
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, mobileNo } = req.body;
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert user
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        mobile_no: mobileNo,
        role_id: 3, // Default to patient role
        is_active: true
      };

      const user = await User.create(userData);

      // Create patient profile
      const [patientResult] = await connection.query(
        `INSERT INTO patients (user_id, address, dob, gender) 
         VALUES (?, ?, ?, ?)`,
        [user.id, '', null, 'male']
      );

      // Commit transaction
      await connection.commit();

      // Generate token
      const token = jwt.sign(
        { userId: user.id, roleId: user.role_id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          roleId: user.role_id,
          roleName: user.getRoleName(),
          status: user.is_active ? 'active' : 'inactive'
        }
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};
