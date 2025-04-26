const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { check } = require('express-validator');

// GET all sessions for a center
router.get('/centers/:centerId/sessions', sessionController.getSessionsByCenter);

// POST create a new session
router.post('/sessions', [
  check('center_id').isInt().withMessage('Center ID must be an integer'),
  check('weekday').isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).withMessage('Invalid weekday'),
  check('start_time').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in HH:MM:SS format'),
  check('end_time').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in HH:MM:SS format'),
  check('default_capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  check('recurrence_pattern').optional().isIn(['daily', 'weekly']).withMessage('Invalid recurrence pattern')
], sessionController.createSession);

// PUT update a session
router.put('/sessions/:id', [
  check('weekday').optional().isIn(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']).withMessage('Invalid weekday'),
  check('start_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in HH:MM:SS format'),
  check('end_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in HH:MM:SS format'),
  check('default_capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  check('recurrence_pattern').optional().isIn(['daily', 'weekly']).withMessage('Invalid recurrence pattern'),
  check('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
], sessionController.updateSession);

// DELETE a session
router.delete('/sessions/:id', sessionController.deleteSession);

module.exports = router;
