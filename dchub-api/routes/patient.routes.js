const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// We'll create this controller next
const patientController = require('../controllers/patient.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get patient profile
router.get('/profile', authMiddleware, patientController.getPatientProfile);

// Update patient profile
router.put('/profile', [
  authMiddleware,
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  body('height').optional().isNumeric().withMessage('Height must be a number'),
  body('weight').optional().isNumeric().withMessage('Weight must be a number'),
], patientController.updatePatientProfile);

// Update notification preferences
router.put('/notifications/preferences', [
  authMiddleware,
], patientController.updateNotificationPreferences);

// Get CKD history
router.get('/ckd-history', authMiddleware, patientController.getCkdHistory);

// Add CKD record
router.post('/ckd-record', [
  authMiddleware,
  body('eGFR').isNumeric().withMessage('eGFR must be a number'),
  body('creatinine').isNumeric().withMessage('Creatinine must be a number'),
], patientController.addCkdRecord);

// Get patient appointments
router.get('/appointments', authMiddleware, patientController.getPatientAppointments);

// Book an appointment
router.post('/appointments/book/:id', authMiddleware, patientController.bookAppointment);

// Cancel an appointment
router.post('/appointments/cancel/:id', authMiddleware, patientController.cancelAppointment);

// Get education content
router.get('/education/:stage', authMiddleware, patientController.getEducationContent);

module.exports = router;
