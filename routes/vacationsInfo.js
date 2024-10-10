const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');


router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const pool = await connectToDatabase();
        const result = await pool.query(`
            SELECT * 
            FROM vacations 
            WHERE employee_id = @employee_id
        `, {
            employee_id: parseInt(employee_id),
        });
        res.json(result.recordset[0] || {});  // Return the first matching record or an empty object
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


module.exports = router;
