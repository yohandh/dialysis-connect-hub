
const { pool } = require('../config/db');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.email = userData.email;
    this.password = userData.password;
    this.mobile_no = userData.mobile_no;
    this.role_id = userData.role_id;
    this.is_active = userData.is_active || true;
    this.last_login_at = userData.last_login_at || null;
  }

  // Get role name based on role_id
  getRoleName() {
    const roles = {
      1: 'Admin',
      2: 'Staff',
      3: 'Patient',
      4: 'Doctor'
    };
    return roles[this.role_id] || 'Unknown';
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length ? new User(rows[0]) : null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      const { first_name, last_name, email, password, mobile_no, role_id } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password, mobile_no, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, email, password, mobile_no, role_id]
      );
      const newUser = { id: result.insertId, ...userData };
      return new User(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  static async update(id, userData) {
    try {
      const updateFields = [];
      const updateValues = [];

      // Build dynamic update query
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      });

      if (updateFields.length === 0) return null;

      // Add ID to values array
      updateValues.push(id);

      const [result] = await pool.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM users');
      return rows.map(row => new User(row));
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = User;
