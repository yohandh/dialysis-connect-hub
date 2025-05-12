const express = require('express');
const router = express.Router();
const educationController = require('../controllers/education.controller');
const verifyAuth = require('../middleware/auth.middleware');

// Get all education materials
router.get('/', verifyAuth, educationController.getAllMaterials);

// Get education materials by CKD stage
router.get('/stage/:stage', verifyAuth, educationController.getMaterialsByStage);

// Get a single education material by ID
router.get('/:id', verifyAuth, educationController.getMaterialById);

// Create a new education material
router.post('/', verifyAuth, educationController.createMaterial);

// Update an education material
router.put('/:id', verifyAuth, educationController.updateMaterial);

// Delete an education material
router.delete('/:id', verifyAuth, educationController.deleteMaterial);

module.exports = router;
