const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// We'll create this controller next
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all users
router.get('/', authMiddleware, userController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware, userController.getUserById);

// Create new user
router.post('/', [
  authMiddleware,
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('mobileNo').notEmpty().withMessage('Mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('roleId').isNumeric().withMessage('Role ID must be a number'),
  body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], userController.createUser);

// Update user
router.put('/:id', [
  authMiddleware,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('mobileNo').optional().notEmpty().withMessage('Mobile number cannot be empty'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('roleId').optional().isNumeric().withMessage('Role ID must be a number'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
], userController.updateUser);

// Delete user
router.delete('/:id', authMiddleware, userController.deleteUser);

// Get all roles
router.get('/roles/all', authMiddleware, userController.getAllRoles);

module.exports = router;
