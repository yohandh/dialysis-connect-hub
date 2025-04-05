const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// We'll create this controller next
const centerController = require('../controllers/center.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all centers
router.get('/', centerController.getAllCenters);

// Get center by ID
router.get('/:id', centerController.getCenterById);

// Create new center
router.post('/', [
  authMiddleware,
  body('name').notEmpty().withMessage('Center name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('Zip code is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('services').isArray().withMessage('Services must be an array'),
  body('operatingHours').isObject().withMessage('Operating hours must be an object')
], centerController.createCenter);

// Update center
router.put('/:id', [
  authMiddleware,
  body('name').optional().notEmpty().withMessage('Center name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('city').optional().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().notEmpty().withMessage('State cannot be empty'),
  body('zipCode').optional().notEmpty().withMessage('Zip code cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
  body('services').optional().isArray().withMessage('Services must be an array'),
  body('operatingHours').optional().isObject().withMessage('Operating hours must be an object')
], centerController.updateCenter);

// Delete center
router.delete('/:id', authMiddleware, centerController.deleteCenter);

module.exports = router;
