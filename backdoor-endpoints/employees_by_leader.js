const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch all employees under a specific leader
router.get('/:leader_email', async (req, res) => {
    const { leader_email } = req.params;
    const us_team = parseInt(req.query.us_team) || 0;
    const col_team = parseInt(req.query.col_team) || 1;

    try {
        const pool = await connectToDatabase();

        const result = await pool.request()
            .input('leader_email', leader_email)
            .input('us_team', us_team)
            .input('col_team', col_team)
            .query(`
                WITH RecursiveEmployees AS (
                    SELECT *
                    FROM dbo.roster
                    WHERE leader_email = @leader_email
                      AND leader_email != email_surgical
                      AND (
                          (@us_team = 1 AND @col_team = 1)
                          OR (us_team = @us_team AND col_team = @col_team)
                      )
                    UNION ALL
                    SELECT r.*
                    FROM dbo.roster r
                    INNER JOIN RecursiveEmployees re
                        ON r.leader_email = re.email_surgical
                    WHERE (
                        (@us_team = 1 AND @col_team = 1)
                        OR (r.us_team = @us_team AND r.col_team = @col_team)
                    )
                )
                SELECT * 
                FROM RecursiveEmployees
                ORDER BY name ASC;
            `);

        if (result.recordset.length === 0) {
            console.log(`No employees found under leader email: ${leader_email}`);
            return res.status(404).json({ message: 'No employees found under this leader' });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error(`Error fetching employees under leader email ${leader_email}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


module.exports = router;
