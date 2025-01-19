const express = require('express');
const apiProxy = require('./apiProxy');

const router = express.Router();

// Debug log for incoming requests
router.use((req, res, next) => {
    console.log('[Frontdoor Router] Incoming request to:', req.originalUrl);
    next();
});

// Use the proxy middleware for all /api/ routes
router.use('/employee', apiProxy());
router.use('/request', apiProxy());
router.use('/liquidation-request', apiProxy());
router.use('/vacations-info', apiProxy());
router.use('/email_id', apiProxy());
router.use('/employees-by-leader', apiProxy());

module.exports = router;
