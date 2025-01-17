const express = require('express');
const apiProxy = require('./apiProxy');

const router = express.Router();

// Use the proxy middleware for all /api/ routes
const endpoints = [
    '/employee',
    '/request',
    '/liquidation-request',
    '/vacations-info',
    '/email_id',
    '/employees-by-leader',
];
endpoints.forEach((endpoint) => {
    router.use(endpoint, apiProxy());
});

module.exports = router;
