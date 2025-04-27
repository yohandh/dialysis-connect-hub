const { pool } = require('../config/db');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Helper function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.is_deleted = 0
       ORDER BY u.first_name ASC`
    );
    
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      email: user.email,
      mobileNo: user.mobile_no,
      roleId: user.role_id,
      roleName: capitalizeFirstLetter(user.role_name),
      status: user.is_active ? 'Active' : 'Inactive',
      lastLogin: user.last_login_at
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
      `SELECT u.*, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? AND u.is_deleted = 0`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let patient = null;
    let doctor = null;
    let staff = null;
    
    // If user is a patient, get patient details
    if (user[0].role_id === 1003) { 
      const [patientResult] = await pool.query(
        `SELECT * FROM patients WHERE user_id = ?`,
        [userId]
      );
      
      if (patientResult && patientResult.length > 0) {
        patient = {
          id: patientResult[0].id,
          userId: patientResult[0].user_id,
          gender: patientResult[0].gender,
          dob: patientResult[0].dob,
          address: patientResult[0].address,
          bloodGroup: patientResult[0].blood_group,
          emergencyContactNo: patientResult[0].emergency_contact_no,
          emergencyContact: patientResult[0].emergency_contact_name,
          insuranceProvider: patientResult[0].insurance_provider,
          allergies: patientResult[0].allergies,
          chronicConditions: patientResult[0].chronic_conditions
        };
      }
    }
    
    // If user is a doctor, get doctor details
    if (user[0].role_id === 1002) { 
      const [doctorResult] = await pool.query(
        `SELECT * FROM doctors WHERE user_id = ?`,
        [userId]
      );
      
      if (doctorResult && doctorResult.length > 0) {
        doctor = {
          id: doctorResult[0].id,
          userId: doctorResult[0].user_id,
          gender: doctorResult[0].gender,
          specialization: doctorResult[0].specialization,
          address: doctorResult[0].address,
          emergencyContactNo: doctorResult[0].emergency_contact_no
        };
      }
    }
    
    // If user is a staff, get staff details
    if (user[0].role_id === 1001) { 
      const [staffResult] = await pool.query(
        `SELECT * FROM staff WHERE user_id = ?`,
        [userId]
      );
      
      if (staffResult && staffResult.length > 0) {
        staff = {
          id: staffResult[0].id,
          userId: staffResult[0].user_id,
          gender: staffResult[0].gender,
          designation: staffResult[0].designation
        };
      }
    }
    
    const response = {
      user: {
        id: user[0].id,
        name: `${user[0].first_name || ''} ${user[0].last_name || ''}`.trim(),
        email: user[0].email,
        mobileNo: user[0].mobile_no,
        roleId: user[0].role_id,
        roleName: capitalizeFirstLetter(user[0].role_name),
        status: user[0].is_active ? 'Active' : 'Inactive',
        lastLogin: user[0].last_login_at
      }
    };
    
    if (patient) {
      response.patient = patient;
    }
    
    if (doctor) {
      response.doctor = doctor;
    }
    
    if (staff) {
      response.staff = staff;
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
    
    // Extract data from request body
    const {
      name, email, mobileNo, password, roleId, status,
      gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
      insuranceProvider, allergies, chronicConditions,
      specialization, designation
    } = req.body;
    
    // Split name into first and last name
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if email already exists
    const [existingUser] = await pool.query(
      `SELECT * FROM users WHERE email = ? AND is_deleted = 0`,
      [email]
    );
    
    if (existingUser && existingUser.length > 0) {
      return res.status(422).json({ 
        errors: [{ 
          param: 'email',
          msg: 'Email already in use',
          value: email
        }],
        message: 'Email already in use'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Convert status to boolean for database
    const isActive = status === 'active';
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert user - remove created_at and updated_at columns if they don't exist
      const [userResult] = await connection.query(
        `INSERT INTO users (first_name, last_name, email, mobile_no, password, role_id, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, mobileNo, hashedPassword, roleId, isActive]
      );
      
      const userId = userResult.insertId;
      
      // If user is a patient, insert patient details
      if (roleId === 1003) { 
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
        
        // Remove created_at and updated_at if they don't exist
        await connection.query(
          `INSERT INTO patients (
            user_id, gender, dob, address, blood_group, emergency_contact_no, emergency_contact_name,
            insurance_provider, allergies, chronic_conditions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
            insuranceProvider, allergies, chronicConditions
          ]
        );
      }
      
      // If user is a doctor, insert doctor details
      if (roleId === 1002) { 
        // Remove created_at and updated_at if they don't exist
        await connection.query(
          `INSERT INTO doctors (
            user_id, gender, specialization, address, emergency_contact_no
          ) VALUES (?, ?, ?, ?, ?)`,
          [userId, gender, specialization, address, emergencyContactNo]
        );
      }
      
      // If user is a staff, insert staff details
      if (roleId === 1001) { 
        await connection.query(
          `INSERT INTO staff (
            user_id, gender, designation
          ) VALUES (?, ?, ?)`,
          [userId, gender, designation]
        );
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Get the created user with role name
      const [newUser] = await pool.query(
        `SELECT u.*, r.name as role_name
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ?`,
        [userId]
      );
      
      // Format response - simplified to just return the user ID and basic info
      const userResponse = {
        id: userId, 
        name: `${newUser[0].first_name || ''} ${newUser[0].last_name || ''}`.trim(),
        email: newUser[0].email,
        mobileNo: newUser[0].mobile_no,
        roleId: newUser[0].role_id,
        roleName: capitalizeFirstLetter(newUser[0].role_name),
        status: newUser[0].is_active ? 'active' : 'inactive'
      };
      
      console.log('Created user with ID:', userId);
      res.status(201).json(userResponse);
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
    const userId = req.params.id;
    const {
      firstName,
      lastName,
      email,
      mobileNo,
      password,
      roleId,
      status,
      // Role-specific fields
      gender,
      dob,
      address,
      bloodGroup,
      emergencyContactNo,
      emergencyContact,
      insuranceProvider,
      allergies,
      chronicConditions,
      specialization,
      designation
    } = req.body;

    console.log('Updating user with ID:', userId);
    console.log('Request body:', req.body);

    // Check if user exists
    const userExistsQuery = 'SELECT * FROM users WHERE id = ?';
    const [userRows] = await pool.query(userExistsQuery, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    let updateUserQuery = `
      UPDATE users
      SET first_name = ?, last_name = ?, email = ?, mobile_no = ?, role_id = ?, is_active = ?
    `;
    
    // Parameters for the user update query
    let userParams = [
      firstName,
      lastName,
      email,
      mobileNo,
      roleId,
      status === true || status === 'true' ? 1 : 0
    ];

    // Only update password if provided
    if (password) {
      updateUserQuery = `
        UPDATE users
        SET first_name = ?, last_name = ?, email = ?, mobile_no = ?, role_id = ?, is_active = ?, password = ?
      `;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      userParams.push(hashedPassword);
    }
    
    // Add WHERE clause
    updateUserQuery += ' WHERE id = ?';
    userParams.push(userId);

    // Execute the update query
    const [userUpdateResult] = await pool.query(updateUserQuery, userParams);

    // If user is a patient, update or insert patient details
    if (roleId === 1003) { 
      // Check if patient record exists
      const [existingPatient] = await pool.query(
        `SELECT * FROM patients WHERE user_id = ?`,
        [userId]
      );
      
      if (existingPatient && existingPatient.length > 0) {
        // Update existing patient
        await pool.query(
          `UPDATE patients
           SET gender = ?, dob = ?, address = ?, blood_group = ?, emergency_contact_no = ?, emergency_contact_name = ?,
               insurance_provider = ?, allergies = ?, chronic_conditions = ?
           WHERE user_id = ?`,
          [
            gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
            insuranceProvider, allergies, chronicConditions, userId
          ]
        );
      } else {
        // Insert new patient
        await pool.query(
          `INSERT INTO patients (
            user_id, gender, dob, address, blood_group, emergency_contact_no, emergency_contact_name,
            insurance_provider, allergies, chronic_conditions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, gender, dob, address, bloodGroup, emergencyContactNo, emergencyContact,
            insuranceProvider, allergies, chronicConditions
          ]
        );
      }
    }
    
    // If user is a doctor, update or insert doctor details
    if (roleId === 1002) { 
      // Check if doctor record exists
      const [existingDoctor] = await pool.query(
        `SELECT * FROM doctors WHERE user_id = ?`,
        [userId]
      );
      
      if (existingDoctor && existingDoctor.length > 0) {
        // Update existing doctor
        await pool.query(
          `UPDATE doctors
           SET gender = ?, specialization = ?, address = ?, emergency_contact_no = ?
           WHERE user_id = ?`,
          [gender, specialization, address, emergencyContactNo, userId]
        );
      } else {
        // Insert new doctor
        await pool.query(
          `INSERT INTO doctors (
            user_id, gender, specialization, address, emergency_contact_no
          ) VALUES (?, ?, ?, ?, ?)`,
          [userId, gender, specialization, address, emergencyContactNo]
        );
      }
    }
    
    // If user is a staff, update or insert staff details
    if (roleId === 1001) { 
      // Check if staff record exists
      const [existingStaff] = await pool.query(
        `SELECT * FROM staff WHERE user_id = ?`,
        [userId]
      );
      
      if (existingStaff && existingStaff.length > 0) {
        // Update existing staff
        await pool.query(
          `UPDATE staff
           SET gender = ?, designation = ?
           WHERE user_id = ?`,
          [gender, designation, userId]
        );
      } else {
        // Insert new staff
        await pool.query(
          `INSERT INTO staff (
            user_id, gender, designation
          ) VALUES (?, ?, ?)`,
          [userId, gender, designation]
        );
      }
    }
    
    // Get the updated user with role name
    const [updatedUser] = await pool.query(
      `SELECT u.*, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );
    
    if (!updatedUser || updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found after update' });
    }
    
    // Create user object with camelCase keys for frontend
    const user = {
      id: updatedUser[0].id,
      name: `${updatedUser[0].first_name || ''} ${updatedUser[0].last_name || ''}`.trim(),
      firstName: updatedUser[0].first_name,
      lastName: updatedUser[0].last_name,
      email: updatedUser[0].email,
      mobileNo: updatedUser[0].mobile_no,
      roleId: updatedUser[0].role_id,
      roleName: capitalizeFirstLetter(updatedUser[0].role_name),
      status: updatedUser[0].is_active ? 'active' : 'inactive',
      lastLogin: updatedUser[0].last_login_at
    };
    
    // Prepare response object
    const response = { ...user };
    
    // If user is a patient, get patient details
    if (roleId === 1003) {
      const [patientResult] = await pool.query(
        `SELECT * FROM patients WHERE user_id = ?`,
        [userId]
      );
      
      if (patientResult && patientResult.length > 0) {
        response.patient = {
          id: patientResult[0].id,
          userId: patientResult[0].user_id,
          gender: patientResult[0].gender,
          dob: patientResult[0].dob,
          address: patientResult[0].address,
          bloodGroup: patientResult[0].blood_group,
          emergencyContactNo: patientResult[0].emergency_contact_no,
          emergencyContact: patientResult[0].emergency_contact_name,
          insuranceProvider: patientResult[0].insurance_provider,
          allergies: patientResult[0].allergies,
          chronicConditions: patientResult[0].chronic_conditions
        };
      }
    }
    
    // If user is a doctor, get doctor details
    if (roleId === 1002) {
      const [doctorResult] = await pool.query(
        `SELECT * FROM doctors WHERE user_id = ?`,
        [userId]
      );
      
      if (doctorResult && doctorResult.length > 0) {
        response.doctor = {
          id: doctorResult[0].id,
          userId: doctorResult[0].user_id,
          gender: doctorResult[0].gender,
          specialization: doctorResult[0].specialization,
          address: doctorResult[0].address,
          emergencyContactNo: doctorResult[0].emergency_contact_no
        };
      }
    }
    
    // If user is a staff, get staff details
    if (roleId === 1001) {
      const [staffResult] = await pool.query(
        `SELECT * FROM staff WHERE user_id = ?`,
        [userId]
      );
      
      if (staffResult && staffResult.length > 0) {
        response.staff = {
          id: staffResult[0].id,
          userId: staffResult[0].user_id,
          gender: staffResult[0].gender,
          designation: staffResult[0].designation
        };
      }
    }
    
    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (soft delete by setting is_deleted=1)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [user] = await pool.query(
      `SELECT * FROM users WHERE id = ? AND is_deleted = 0`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Set is_deleted=1 instead of actually deleting
      await connection.query(
        `UPDATE users SET is_deleted = 1 WHERE id = ?`,
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

// Deactivate user (set is_active=0)
exports.deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [user] = await pool.query(
      `SELECT * FROM users WHERE id = ? AND is_deleted = 0`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user status to inactive
    await pool.query(
      `UPDATE users SET is_active = 0 WHERE id = ?`,
      [userId]
    );
    
    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Activate user (set is_active=1)
exports.activateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [user] = await pool.query(
      `SELECT * FROM users WHERE id = ? AND is_deleted = 0`,
      [userId]
    );
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user status to active
    await pool.query(
      `UPDATE users SET is_active = 1 WHERE id = ?`,
      [userId]
    );
    
    res.status(200).json({ message: 'User activated successfully' });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await pool.query(
      `SELECT * FROM roles ORDER BY id ASC`
    );
    
    // Map to camelCase for frontend with capitalized role names
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: capitalizeFirstLetter(role.name)
    }));
    
    res.status(200).json(formattedRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by roles (admin or staff)
exports.getUsersByRoles = async (req, res) => {
  try {
    // Get role IDs for admin and staff
    const roleNames = req.query.roles ? req.query.roles.split(',') : ['admin', 'staff'];
    
    // Get users with specified roles
    const [users] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile_no, u.is_active, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE r.name IN (?) AND u.is_active = TRUE AND u.is_deleted = 0
       ORDER BY u.first_name ASC`,
      [roleNames]
    );
    
    // Map to camelCase for frontend with capitalized role names and status
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      email: user.email,
      mobileNo: user.mobile_no,
      roleName: capitalizeFirstLetter(user.role_name),
      status: user.is_active ? 'Active' : 'Inactive'
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users by roles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users by a specific role
exports.getUsersByRole = async (req, res) => {
  try {
    const roleName = req.params.role.toLowerCase();
    
    // Get role ID for the specified role
    const [role] = await pool.query(
      `SELECT id FROM roles WHERE name = ?`,
      [roleName]
    );
    
    if (!role || role.length === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    const roleId = role[0].id;
    
    // Get users with the specified role
    const [users] = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.mobile_no, u.role_id, 
              u.is_active, r.name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.role_id = ? AND u.is_active = TRUE AND u.is_deleted = 0
       ORDER BY u.first_name ASC`,
      [roleId]
    );
    
    // Map to camelCase for frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email,
      mobileNo: user.mobile_no,
      roleId: user.role_id,
      roleName: capitalizeFirstLetter(user.role_name),
      status: user.is_active ? 'active' : 'inactive'
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error(`Error fetching users by role:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
