// Example of route in routes/LeaderPortal.js
const express = require('express');
const router = express.Router();
const pool = require('../db/dbConfig');

// GET route for /leader-portal
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM roster ORDER BY employee_id ASC');
        res.json(result.rows); // Send the rows as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
