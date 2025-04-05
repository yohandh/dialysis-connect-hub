const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.*, r.name as roleName
       FROM users u
       JOIN roles r ON u.roleId = r.id
       ORDER BY u.name ASC`
    );
    
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
      roleId: user.roleId,
      roleName: user.roleName,
      status: user.status
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user
    const [user] = await pool.query(
      `SELECT u.*, r.name as roleName
       FROM users u
       JOIN roles r ON u.roleId = r.id
       WHERE u.id = ?`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let patient = null;
    let doctor = null;
    
    // If user is a patient, get patient details
    if (user[0].roleId === 3) { // Assuming roleId 3 is for patients
      const [patientResult] = await pool.query(
        `SELECT * FROM patients WHERE userId = ?`,
        [userId]
      );
      
      if (patientResult && patientResult.length > 0) {
        patient = {
          id: patientResult[0].id,
          userId: patientResult[0].userId,
          gender: patientResult[0].gender,
          dob: patientResult[0].dateOfBirth,
          address: patientResult[0].street + (patientResult[0].city ? ', ' + patientResult[0].city : '') + 
                  (patientResult[0].state ? ', ' + patientResult[0].state : '') + 
                  (patientResult[0].zipCode ? ' ' + patientResult[0].zipCode : ''),
          bloodGroup: patientResult[0].bloodType,
          emergencyContactNo: patientResult[0].emergencyContactPhone,
          emergencyContact: patientResult[0].emergencyContactName,
          insuranceProvider: patientResult[0].insuranceProvider,
          allergies: patientResult[0].allergies,
          chronicConditions: patientResult[0].comorbidities
        };
      }
    }
    
    // If user is a doctor, get doctor details
    if (user[0].roleId === 4) { // Assuming roleId 4 is for doctors
      const [doctorResult] = await pool.query(
        `SELECT * FROM doctors WHERE userId = ?`,
        [userId]
      );
      
      if (doctorResult && doctorResult.length > 0) {
        doctor = {
          id: doctorResult[0].id,
          userId: doctorResult[0].userId,
          gender: doctorResult[0].gender,
          specialization: doctorResult[0].specialization,
          address: doctorResult[0].address,
          emergencyContactNo: doctorResult[0].emergencyContactNo
        };
      }
    }
    
    const response = {
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        mobileNo: user[0].mobileNo,
        roleId: user[0].roleId,
        roleName: user[0].roleName,
        status: user[0].status
      }
    };
    
    if (patient) {
      response.patient = patient;
    }
    
    if (doctor) {
      response.doctor = doctor;
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const {
      name, email, mobileNo, password, roleId, status,
      gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
      insuranceProvider, allergies, chronicConditions,
      specialization, designation
    } = req.body;
    
    // Check if email already exists
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert user
      const [userResult] = await connection.query(
        `INSERT INTO users (name, email, mobileNo, password, roleId, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [name, email, mobileNo, hashedPassword, roleId, status]
      );
      
      const userId = userResult.insertId;
      
      // If user is a patient, insert patient details
      if (roleId === 3) { // Assuming roleId 3 is for patients
        // Parse address if provided
        let street = '', city = '', state = '', zipCode = '';
        if (address) {
          const addressParts = address.split(',');
          street = addressParts[0]?.trim() || '';
          city = addressParts[1]?.trim() || '';
          const stateZip = addressParts[2]?.trim().split(' ') || [];
          state = stateZip[0] || '';
          zipCode = stateZip[1] || '';
        }
        
        await connection.query(
          `INSERT INTO patients (
            userId, gender, dateOfBirth, street, city, state, zipCode,
            bloodType, emergencyContactPhone, emergencyContactName,
            insuranceProvider, allergies, comorbidities, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            userId, gender, dob, street, city, state, zipCode,
            bloodGroup, emergencyContactNo, emergencyContact,
            insuranceProvider, allergies, chronicConditions
          ]
        );
      }
      
      // If user is a doctor, insert doctor details
      if (roleId === 4) { // Assuming roleId 4 is for doctors
        await connection.query(
          `INSERT INTO doctors (
            userId, gender, specialization, address, emergencyContactNo, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [userId, gender, specialization, address, emergencyContactNo]
        );
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the created user with role name
      const [newUser] = await pool.query(
        `SELECT u.*, r.name as roleName
         FROM users u
         JOIN roles r ON u.roleId = r.id
         WHERE u.id = ?`,
        [userId]
      );
      
      // Prepare response
      const response = {
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
          mobileNo: newUser[0].mobileNo,
          roleId: newUser[0].roleId,
          roleName: newUser[0].roleName,
          status: newUser[0].status
        }
      };
      
      // If user is a patient, get patient details
      if (roleId === 3) {
        const [patientResult] = await pool.query(
          `SELECT * FROM patients WHERE userId = ?`,
          [userId]
        );
        
        if (patientResult && patientResult.length > 0) {
          response.patient = {
            id: patientResult[0].id,
            userId: patientResult[0].userId,
            gender: patientResult[0].gender,
            dob: patientResult[0].dateOfBirth,
            address: patientResult[0].street + (patientResult[0].city ? ', ' + patientResult[0].city : '') + 
                    (patientResult[0].state ? ', ' + patientResult[0].state : '') + 
                    (patientResult[0].zipCode ? ' ' + patientResult[0].zipCode : ''),
            bloodGroup: patientResult[0].bloodType,
            emergencyContactNo: patientResult[0].emergencyContactPhone,
            emergencyContact: patientResult[0].emergencyContactName,
            insuranceProvider: patientResult[0].insuranceProvider,
            allergies: patientResult[0].allergies,
            chronicConditions: patientResult[0].comorbidities
          };
        }
      }
      
      // If user is a doctor, get doctor details
      if (roleId === 4) {
        const [doctorResult] = await pool.query(
          `SELECT * FROM doctors WHERE userId = ?`,
          [userId]
        );
        
        if (doctorResult && doctorResult.length > 0) {
          response.doctor = {
            id: doctorResult[0].id,
            userId: doctorResult[0].userId,
            gender: doctorResult[0].gender,
            specialization: doctorResult[0].specialization,
            address: doctorResult[0].address,
            emergencyContactNo: doctorResult[0].emergencyContactNo
          };
        }
      }
      
      res.status(201).json(response);
    } catch (error) {
      // Rollback the transaction in case of error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const userId = req.params.id;
    const {
      name, email, mobileNo, password, roleId, status,
      gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
      insuranceProvider, allergies, chronicConditions,
      specialization, designation
    } = req.body;
    
    // Check if user exists
    const [user] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already in use by another user
    if (email && email !== user[0].email) {
      const [existingUser] = await pool.query(
        `SELECT * FROM users WHERE email = ? AND id != ?`,
        [email, userId]
      );
      
      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update user
      let updateUserQuery = `
        UPDATE users
        SET name = ?, email = ?, mobileNo = ?, roleId = ?, status = ?, updatedAt = NOW()
      `;
      
      let updateUserParams = [
        name, email, mobileNo, roleId, status
      ];
      
      // If password is provided, hash it and include in update
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateUserQuery += `, password = ?`;
        updateUserParams.push(hashedPassword);
      }
      
      updateUserQuery += ` WHERE id = ?`;
      updateUserParams.push(userId);
      
      await connection.query(updateUserQuery, updateUserParams);
      
      // If user is a patient, update or insert patient details
      if (roleId === 3) { // Assuming roleId 3 is for patients
        // Parse address if provided
        let street = '', city = '', state = '', zipCode = '';
        if (address) {
          const addressParts = address.split(',');
          street = addressParts[0]?.trim() || '';
          city = addressParts[1]?.trim() || '';
          const stateZip = addressParts[2]?.trim().split(' ') || [];
          state = stateZip[0] || '';
          zipCode = stateZip[1] || '';
        }
        
        // Check if patient record exists
        const [existingPatient] = await connection.query(
          `SELECT * FROM patients WHERE userId = ?`,
          [userId]
        );
        
        if (existingPatient && existingPatient.length > 0) {
          // Update existing patient
          await connection.query(
            `UPDATE patients
             SET gender = ?, dateOfBirth = ?, street = ?, city = ?, state = ?, zipCode = ?,
                 bloodType = ?, emergencyContactPhone = ?, emergencyContactName = ?,
                 insuranceProvider = ?, allergies = ?, comorbidities = ?, updatedAt = NOW()
             WHERE userId = ?`,
            [
              gender, dob, street, city, state, zipCode,
              bloodGroup, emergencyContactNo, emergencyContact,
              insuranceProvider, allergies, chronicConditions, userId
            ]
          );
        } else {
          // Insert new patient
          await connection.query(
            `INSERT INTO patients (
              userId, gender, dateOfBirth, street, city, state, zipCode,
              bloodType, emergencyContactPhone, emergencyContactName,
              insuranceProvider, allergies, comorbidities, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              userId, gender, dob, street, city, state, zipCode,
              bloodGroup, emergencyContactNo, emergencyContact,
              insuranceProvider, allergies, chronicConditions
            ]
          );
        }
      }
      
      // If user is a doctor, update or insert doctor details
      if (roleId === 4) { // Assuming roleId 4 is for doctors
        // Check if doctor record exists
        const [existingDoctor] = await connection.query(
          `SELECT * FROM doctors WHERE userId = ?`,
          [userId]
        );
        
        if (existingDoctor && existingDoctor.length > 0) {
          // Update existing doctor
          await connection.query(
            `UPDATE doctors
             SET gender = ?, specialization = ?, address = ?, emergencyContactNo = ?, updatedAt = NOW()
             WHERE userId = ?`,
            [gender, specialization, address, emergencyContactNo, userId]
          );
        } else {
          // Insert new doctor
          await connection.query(
            `INSERT INTO doctors (
              userId, gender, specialization, address, emergencyContactNo, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [userId, gender, specialization, address, emergencyContactNo]
          );
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the updated user with role name
      const [updatedUser] = await pool.query(
        `SELECT u.*, r.name as roleName
         FROM users u
         JOIN roles r ON u.roleId = r.id
         WHERE u.id = ?`,
        [userId]
      );
      
      // Prepare response
      const response = {
        user: {
          id: updatedUser[0].id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          mobileNo: updatedUser[0].mobileNo,
          roleId: updatedUser[0].roleId,
          roleName: updatedUser[0].roleName,
          status: updatedUser[0].status
        }
      };
      
      // If user is a patient, get patient details
      if (roleId === 3) {
        const [patientResult] = await pool.query(
          `SELECT * FROM patients WHERE userId = ?`,
          [userId]
        );
        
        if (patientResult && patientResult.length > 0) {
          response.patient = {
            id: patientResult[0].id,
            userId: patientResult[0].userId,
            gender: patientResult[0].gender,
            dob: patientResult[0].dateOfBirth,
            address: patientResult[0].street + (patientResult[0].city ? ', ' + patientResult[0].city : '') + 
                    (patientResult[0].state ? ', ' + patientResult[0].state : '') + 
                    (patientResult[0].zipCode ? ' ' + patientResult[0].zipCode : ''),
            bloodGroup: patientResult[0].bloodType,
            emergencyContactNo: patientResult[0].emergencyContactPhone,
            emergencyContact: patientResult[0].emergencyContactName,
            insuranceProvider: patientResult[0].insuranceProvider,
            allergies: patientResult[0].allergies,
            chronicConditions: patientResult[0].comorbidities
          };
        }
      }
      
      // If user is a doctor, get doctor details
      if (roleId === 4) {
        const [doctorResult] = await pool.query(
          `SELECT * FROM doctors WHERE userId = ?`,
          [userId]
        );
        
        if (doctorResult && doctorResult.length > 0) {
          response.doctor = {
            id: doctorResult[0].id,
            userId: doctorResult[0].userId,
            gender: doctorResult[0].gender,
            specialization: doctorResult[0].specialization,
            address: doctorResult[0].address,
            emergencyContactNo: doctorResult[0].emergencyContactNo
          };
        }
      }
      
      res.status(200).json(response);
    } catch (error) {
      // Rollback the transaction in case of error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [user] = await pool.query(
      `SELECT * FROM users WHERE id = ?`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Check if user has related records
      if (user[0].roleId === 3) { // Patient
        // Check if patient has appointments
        const [patient] = await connection.query(
          `SELECT id FROM patients WHERE userId = ?`,
          [userId]
        );
        
        if (patient && patient.length > 0) {
          const [appointments] = await connection.query(
            `SELECT COUNT(*) as count FROM appointments WHERE patientId = ?`,
            [patient[0].id]
          );
          
          if (appointments[0].count > 0) {
            return res.status(400).json({ 
              message: 'Cannot delete user with existing appointments. Please delete or reassign appointments first.' 
            });
          }
          
          // Delete patient record
          await connection.query(
            `DELETE FROM patients WHERE userId = ?`,
            [userId]
          );
          
          // Delete CKD records
          await connection.query(
            `DELETE FROM ckd_records WHERE userId = ?`,
            [userId]
          );
        }
      } else if (user[0].roleId === 4) { // Doctor
        // Delete doctor record
        await connection.query(
          `DELETE FROM doctors WHERE userId = ?`,
          [userId]
        );
      }
      
      // Delete user
      await connection.query(
        `DELETE FROM users WHERE id = ?`,
        [userId]
      );
      
      // Commit the transaction
      await connection.commit();
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      // Rollback the transaction in case of error
      await connection.rollback();
      throw error;
    } finally {
      // Release the connection
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await pool.query(
      `SELECT * FROM roles ORDER BY id ASC`
    );
    
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
