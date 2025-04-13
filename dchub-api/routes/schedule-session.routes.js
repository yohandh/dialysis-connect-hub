const express = require('express');
const router = express.Router();
const scheduleSessionController = require('../controllers/schedule-session.controller');
const { check } = require('express-validator');

// GET all scheduled sessions for a center
router.get('/centers/:centerId/schedule-sessions', scheduleSessionController.getScheduledSessionsByCenter);

// POST create a new scheduled session
router.post('/centers/schedule-sessions', [
  check('center_id').isInt().withMessage('Center ID must be an integer'),
  check('session_date').isDate().withMessage('Session date must be a valid date'),
  check('start_time').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in HH:MM:SS format'),
  check('end_time').matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in HH:MM:SS format'),
  check('available_beds').isInt({ min: 1 }).withMessage('Available beds must be at least 1')
], scheduleSessionController.createScheduledSession);

// PUT update a scheduled session
router.put('/centers/schedule-sessions/:id', [
  check('session_date').optional().isDate().withMessage('Session date must be a valid date'),
  check('start_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in HH:MM:SS format'),
  check('end_time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in HH:MM:SS format'),
  check('available_beds').optional().isInt({ min: 1 }).withMessage('Available beds must be at least 1'),
  check('status').optional().isIn(['scheduled', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status')
], scheduleSessionController.updateScheduledSession);

// DELETE a scheduled session
router.delete('/centers/schedule-sessions/:id', scheduleSessionController.deleteScheduledSession);

// POST generate scheduled sessions
router.post('/centers/:centerId/schedule-sessions/generate', [
  check('center_id').isInt().withMessage('Center ID must be an integer'),
  check('start_date').isDate().withMessage('Start date must be a valid date'),
  check('end_date').isDate().withMessage('End date must be a valid date'),
  check('session_ids').optional().isArray().withMessage('Session IDs must be an array')
], scheduleSessionController.generateScheduledSessions);

module.exports = router;
