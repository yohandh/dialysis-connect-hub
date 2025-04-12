const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// We'll create this controller next
const centerController = require('../controllers/center.controller');
const authMiddleware = require('../middleware/auth.middleware');
const bedController = require('../controllers/bed.controller');

// Get all centers
router.get('/', centerController.getAllCenters);

// Get center by ID
router.get('/:id', centerController.getCenterById);

// Create new center
router.post('/', [
  // Temporarily disable auth for testing
  // authMiddleware,
  body('name').notEmpty().withMessage('Center name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('contact_no').notEmpty().withMessage('Contact number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('total_capacity').isNumeric().withMessage('Total capacity must be a number'),
  body('center_hours').optional().isArray().withMessage('Center hours must be an array')
], centerController.createCenter);

// Update center
router.put('/:id', [
  // Temporarily disable auth for testing
  // authMiddleware,
  body('name').optional().notEmpty().withMessage('Center name cannot be empty'),
  body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  body('contact_no').optional().notEmpty().withMessage('Contact number cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('total_capacity').optional().isNumeric().withMessage('Total capacity must be a number'),
  body('center_hours').optional().isArray().withMessage('Center hours must be an array')
], centerController.updateCenter);

// Delete center
router.delete('/:id', 
  // Temporarily disable auth for testing
  // authMiddleware, 
  centerController.deleteCenter
);

// Get all beds for a center
router.get('/:centerId/beds', bedController.getBedsByCenter);

module.exports = router;
