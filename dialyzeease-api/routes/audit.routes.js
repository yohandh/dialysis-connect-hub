const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Debug endpoint to check if the audit controller is accessible
router.get('/debug', auditController.debug);

// Get all audit logs with pagination and filtering
router.get('/', auditController.getAllAuditLogs);

// Get distinct table names from audit logs
router.get('/tables', auditController.getAuditTables);

// Get audit log details by ID
router.get('/:id', auditController.getAuditLogById);

module.exports = router;
