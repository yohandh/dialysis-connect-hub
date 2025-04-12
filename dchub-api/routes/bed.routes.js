const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bed.controller');

// GET all beds for a center
router.get('/centers/:centerId/beds', bedController.getBedsByCenter);

// POST create a new bed
router.post('/', bedController.createBed);

// PUT update a bed
router.put('/:id', bedController.updateBed);

// DELETE a bed
router.delete('/:id', bedController.deleteBed);

module.exports = router;
