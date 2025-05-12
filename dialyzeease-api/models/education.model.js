const { pool } = require('../config/db');

// Education Material model
const EducationMaterial = {
  // Get all education materials
  findAll: async (result) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM education_materials ORDER BY ckd_stage ASC, title ASC'
      );
      
      // Transform database column names to frontend property names
      const transformedRows = rows.map(row => ({
        id: row.id,
        ckdStage: Number(row.ckd_stage), // Convert to number and rename from ckd_stage to ckdStage
        langCode: row.lang_code,         // Rename from lang_code to langCode
        type: row.type,
        title: row.title,
        content: row.content
      }));
      
      result(null, transformedRows);
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
      
      // Transform database column names to frontend property names
      const transformedRows = rows.map(row => ({
        id: row.id,
        ckdStage: Number(row.ckd_stage), // Convert to number and rename
        langCode: row.lang_code,         // Rename
        type: row.type,
        title: row.title,
        content: row.content
      }));
      
      result(null, transformedRows);
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
      
      // Transform database column names to frontend property names
      const transformedRow = {
        id: rows[0].id,
        ckdStage: Number(rows[0].ckd_stage), // Convert to number and rename
        langCode: rows[0].lang_code,         // Rename
        type: rows[0].type,
        title: rows[0].title,
        content: rows[0].content
      };

      result(null, transformedRow);
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
