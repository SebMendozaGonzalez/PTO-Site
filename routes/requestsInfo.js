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

router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;

    try {
        const pool = await connectToDatabase();
        const request = pool.request();
        
        request.input('employee_id', sql.NVarChar, employee_id);
        const result = await request.query('SELECT * FROM request WHERE employee_id = @employee_id ORDER BY employee_id DESC');
        
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
