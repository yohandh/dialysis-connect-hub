const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { pool } = require('../config/db');

// Email configuration - using the same configuration as appointment controller
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dialyzeease@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'jpkdzedpwnebzosx' // Better to use environment variables
  }
});

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
    
    // Note: We're not checking email verification status for now
    // In a production environment, you might want to add:
    // if (!user.email_verified) {
    //   return res.status(401).json({ message: 'Please verify your email before logging in' });
    // }

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

// Helper function to send confirmation email
const sendConfirmationEmail = async (email, name, verificationToken) => {
  try {
    // Verification URL
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:80'}/patient/verify-email?token=${verificationToken}`;

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"DialyzeEase" <noreply@dialyzeease.com>',
      to: email,
      subject: 'Welcome to DialyzeEase - Verify Your Email',
      text: `Hello ${name},\n\nThank you for registering with DialyzeEase. Please verify your email by clicking on the following link:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not register for DialyzeEase, please ignore this email.\n\nBest regards,\nThe DialyzeEase Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://dialyzeease.com/logo.png" alt="DialyzeEase Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #3b82f6; text-align: center;">Welcome to DialyzeEase!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for registering with DialyzeEase. To complete your registration and access our services, please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not register for DialyzeEase, please ignore this email.</p>
          <p>Best regards,<br>The DialyzeEase Team</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #6b7280;">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; ${new Date().getFullYear()} DialyzeEase. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log('Message sent: %s', info.messageId);
    
    // Log email sent
    console.log('Verification email sent to:', email);

    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

// Register (Basic registration - primarily for patients)
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, mobileNo, roleId = 1003 } = req.body;
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
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

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
        role_id: roleId, // Use provided roleId or default to patient (1003)
        is_active: true, // Set to true initially, can change to false if email verification is required
        verification_token: verificationToken,
        token_expires: tokenExpires
      };

      const user = await User.create(userData);

      // If roleId is for patient, create patient profile
      if (roleId === 1003) {
        const { gender = 'male', dob = null, address = '', bloodGroup = null, emergencyContact = null, emergencyContactNo = null } = req.body;
        
        // Create patient profile
        const [patientResult] = await connection.query(
          `INSERT INTO patients (user_id, gender, dob, address, blood_group, emergency_contact_name, emergency_contact_no) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.id, gender, dob, address, bloodGroup, emergencyContact, emergencyContactNo]
        );
        
        // Get the created patient record
        const [patientData] = await connection.query(
          'SELECT * FROM patients WHERE id = ?',
          [patientResult.insertId]
        );
        
        if (patientData && patientData.length > 0) {
          user.patient = patientData[0];
        }
      }

      // Commit transaction
      await connection.commit();

      // Send confirmation email
      const emailSent = await sendConfirmationEmail(email, name, verificationToken);
      
      if (!emailSent) {
        console.warn('Failed to send confirmation email to:', email);
      }

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
        },
        patient: user.patient,
        message: 'Registration successful! Please check your email to verify your account.'
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

// Verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    
    // Find user with this token
    const [users] = await pool.query(
      'SELECT * FROM users WHERE verification_token = ? AND token_expires > NOW()',
      [token]
    );
    
    if (!users || users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    
    const user = users[0];
    
    // Update user to mark as verified
    await pool.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL, token_expires = NULL WHERE id = ?',
      [user.id]
    );
    
    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    next(error);
  }
};
