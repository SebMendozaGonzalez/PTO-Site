// routes/requestsInfo.js
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');


router.get('/', async (req, res) => {
    try {
        const pool = await connectToDatabase();
        const result = await pool.query('SELECT * FROM request ORDER BY employee_id DESC');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
