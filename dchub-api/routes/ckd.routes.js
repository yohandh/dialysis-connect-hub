
const express = require('express');
const router = express.Router();
const ckdController = require('../controllers/ckd.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all CKD records for a patient
router.get('/:patientId', ckdController.getCkdHistory);

// Add new CKD record
router.post('/', ckdController.addCkdRecord);

// Update CKD record
router.put('/:id', ckdController.updateCkdRecord);

// Delete CKD record
router.delete('/:id', ckdController.deleteCkdRecord);

module.exports = router;
