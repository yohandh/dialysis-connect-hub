const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
// We'll create this controller next
const appointmentController = require('../controllers/appointment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all appointments
router.get('/', authMiddleware, appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', authMiddleware, appointmentController.getAppointmentById);

// Get appointment details with related information
router.get('/:id/details', authMiddleware, appointmentController.getAppointmentDetails);

// Get appointments by center
router.get('/center/:centerId', authMiddleware, appointmentController.getAppointmentsByCenter);

// Get appointments by patient
router.get('/patient/:patientId', authMiddleware, appointmentController.getAppointmentsByPatient);

// Get available appointments
router.get('/status/available', authMiddleware, appointmentController.getAvailableAppointments);

// Create appointment slot
router.post('/', [
  authMiddleware,
  body('scheduleSessionId').notEmpty().withMessage('Schedule session ID is required'),
  body('patientId').optional(),
  body('bedId').optional(),
  body('notes').optional()
], appointmentController.createAppointmentSlot);

// Update appointment slot
router.put('/:id', [
  authMiddleware,
  body('centerId').optional(),
  body('date').optional(),
  body('startTime').optional(),
  body('endTime').optional(),
  body('type').optional().isIn(['dialysis', 'consultation', 'checkup']).withMessage('Invalid appointment type'),
  body('patientId').optional(),
  body('bedId').optional(),
  body('notes').optional(),
  body('status').optional().isIn(['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show']).withMessage('Invalid status')
], appointmentController.updateAppointmentSlot);

// Delete appointment slot
router.delete('/:id', authMiddleware, appointmentController.deleteAppointmentSlot);

// Book an appointment
router.post('/:id/book', [
  authMiddleware,
  body('patientId').notEmpty().withMessage('Patient ID is required')
], appointmentController.bookAppointment);

// Cancel an appointment
router.post('/:id/cancel', authMiddleware, appointmentController.cancelAppointment);

module.exports = router;
