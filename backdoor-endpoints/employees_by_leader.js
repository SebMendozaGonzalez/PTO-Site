const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch all employees under a specific leader
router.get('/:leader_email', async (req, res) => {
    const { leader_email } = req.params;

    try {
        const pool = await connectToDatabase();

        // Query using a recursive CTE to get hierarchical employees
        const result = await pool.request()
            .input('leader_email', leader_email)
            .query(`
                WITH RecursiveEmployees AS (
                    SELECT *
                    FROM dbo.roster
                    WHERE (leader_email = @leader_email) AND (leader_email != email_surgical)
                    UNION ALL
                    SELECT r.*
                    FROM dbo.roster r
                    INNER JOIN RecursiveEmployees re
                    ON r.leader_email = re.email_surgical
                )
                SELECT * 
                FROM RecursiveEmployees
                ORDER BY name ASC;
            `);

        if (result.recordset.length === 0) {
            console.log(`No employees found under leader email: ${leader_email}`);
            return res.status(404).json({ message: 'No employees found under this leader' });
        }

        res.json(result.recordset); // Return hierarchical records
    } catch (err) {
        console.error(`Error fetching employees under leader email ${leader_email}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
