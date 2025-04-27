const EducationMaterial = require('../models/education.model');

// Get all education materials
exports.getAllMaterials = (req, res) => {
  EducationMaterial.findAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'An error occurred while retrieving education materials.'
      });
    } else {
      res.send(data);
    }
  });
};

// Get education materials by CKD stage
exports.getMaterialsByStage = (req, res) => {
  const ckdStage = parseInt(req.params.stage);
  
  if (isNaN(ckdStage) || ckdStage < 1 || ckdStage > 5) {
    res.status(400).send({
      message: 'Invalid CKD stage. Must be a number between 1 and 5.'
    });
    return;
  }

  EducationMaterial.findByStage(ckdStage, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || `An error occurred while retrieving materials for stage ${ckdStage}.`
      });
    } else {
      res.send(data);
    }
  });
};

// Get a single education material by ID
exports.getMaterialById = (req, res) => {
  EducationMaterial.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Education material with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving education material with id ${req.params.id}.`
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Create a new education material
exports.createMaterial = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty!'
    });
    return;
  }

  // Validate required fields
  if (!req.body.title || !req.body.content || !req.body.ckdStage || !req.body.type) {
    res.status(400).send({
      message: 'Missing required fields: title, content, ckdStage, and type are required.'
    });
    return;
  }

  // Validate CKD stage
  const ckdStage = parseInt(req.body.ckdStage);
  if (isNaN(ckdStage) || ckdStage < 1 || ckdStage > 5) {
    res.status(400).send({
      message: 'Invalid CKD stage. Must be a number between 1 and 5.'
    });
    return;
  }

  // Validate type
  const validTypes = ['diet', 'lifestyle', 'monitoring', 'general'];
  if (!validTypes.includes(req.body.type)) {
    res.status(400).send({
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
    return;
  }

  // Create a new education material object
  const educationMaterial = {
    title: req.body.title,
    content: req.body.content,
    ckdStage: ckdStage,
    langCode: req.body.langCode || 'en',
    type: req.body.type
  };

  // Save education material in the database
  EducationMaterial.create(educationMaterial, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'An error occurred while creating the education material.'
      });
    } else {
      res.status(201).send(data);
    }
  });
};

// Update an education material
exports.updateMaterial = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content cannot be empty!'
    });
    return;
  }

  // Validate required fields
  if (!req.body.title || !req.body.content || !req.body.ckdStage || !req.body.type) {
    res.status(400).send({
      message: 'Missing required fields: title, content, ckdStage, and type are required.'
    });
    return;
  }

  // Validate CKD stage
  const ckdStage = parseInt(req.body.ckdStage);
  if (isNaN(ckdStage) || ckdStage < 1 || ckdStage > 5) {
    res.status(400).send({
      message: 'Invalid CKD stage. Must be a number between 1 and 5.'
    });
    return;
  }

  // Validate type
  const validTypes = ['diet', 'lifestyle', 'monitoring', 'general'];
  if (!validTypes.includes(req.body.type)) {
    res.status(400).send({
      message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
    });
    return;
  }

  // Create an updated education material object
  const educationMaterial = {
    title: req.body.title,
    content: req.body.content,
    ckdStage: ckdStage,
    langCode: req.body.langCode || 'en',
    type: req.body.type
  };

  EducationMaterial.update(req.params.id, educationMaterial, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Education material with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error updating education material with id ${req.params.id}.`
        });
      }
    } else {
      res.send(data);
    }
  });
};

// Delete an education material
exports.deleteMaterial = (req, res) => {
  EducationMaterial.delete(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Education material with id ${req.params.id} not found.`
        });
      } else {
        res.status(500).send({
          message: `Error deleting education material with id ${req.params.id}.`
        });
      }
    } else {
      res.send(data);
    }
  });
};
