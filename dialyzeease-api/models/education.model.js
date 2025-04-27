const { pool } = require('../config/db');

// Education Material model
const EducationMaterial = {
  // Get all education materials
  findAll: async (result) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM education_materials ORDER BY ckd_stage ASC, title ASC'
      );
      result(null, rows);
    } catch (err) {
      console.error('Error retrieving education materials:', err);
      result(err, null);
    }
  },

  // Get education materials by CKD stage
  findByStage: async (ckdStage, result) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM education_materials WHERE ckd_stage = ? ORDER BY title ASC',
        [ckdStage]
      );
      result(null, rows);
    } catch (err) {
      console.error('Error retrieving education materials by stage:', err);
      result(err, null);
    }
  },

  // Get education material by ID
  findById: async (id, result) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM education_materials WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        // Not found
        result({ kind: 'not_found' }, null);
        return;
      }

      result(null, rows[0]);
    } catch (err) {
      console.error('Error retrieving education material by ID:', err);
      result(err, null);
    }
  },

  // Create a new education material
  create: async (newMaterial, result) => {
    try {
      const [res] = await pool.query(
        'INSERT INTO education_materials SET ?',
        {
          title: newMaterial.title,
          content: newMaterial.content,
          ckd_stage: newMaterial.ckdStage,
          lang_code: newMaterial.langCode,
          type: newMaterial.type
        }
      );

      result(null, { id: res.insertId, ...newMaterial });
    } catch (err) {
      console.error('Error creating education material:', err);
      result(err, null);
    }
  },

  // Update an education material
  update: async (id, material, result) => {
    try {
      const [res] = await pool.query(
        'UPDATE education_materials SET title = ?, content = ?, ckd_stage = ?, lang_code = ?, type = ? WHERE id = ?',
        [
          material.title,
          material.content,
          material.ckdStage,
          material.langCode,
          material.type,
          id
        ]
      );

      if (res.affectedRows === 0) {
        // Not found
        result({ kind: 'not_found' }, null);
        return;
      }

      result(null, { id: parseInt(id), ...material });
    } catch (err) {
      console.error('Error updating education material:', err);
      result(err, null);
    }
  },

  // Delete an education material
  delete: async (id, result) => {
    try {
      const [res] = await pool.query(
        'DELETE FROM education_materials WHERE id = ?',
        [id]
      );

      if (res.affectedRows === 0) {
        // Not found
        result({ kind: 'not_found' }, null);
        return;
      }

      result(null, { message: 'Education material deleted successfully' });
    } catch (err) {
      console.error('Error deleting education material:', err);
      result(err, null);
    }
  }
};

module.exports = EducationMaterial;
