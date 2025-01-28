const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch the hierarchical management graph of employees under a specific leader
router.get('/:leader_email', async (req, res) => {
    const { leader_email } = req.params;

    try {
        const pool = await connectToDatabase();

        // Query to get the hierarchical management graph using a recursive CTE
        const result = await pool.request()
            .input('leader_email', leader_email)
            .query(`
                WITH RecursiveHierarchy AS (
                    SELECT email_surgical, name, leader_email
                    FROM dbo.roster
                    WHERE leader_email = @leader_email
                    UNION ALL
                    SELECT r.email_surgical, r.name, r.leader_email
                    FROM dbo.roster r
                    INNER JOIN RecursiveHierarchy rh
                    ON r.leader_email = rh.email_surgical
                )
                SELECT * 
                FROM RecursiveHierarchy
                ORDER BY leader_email ASC, name ASC
                OPTION (MAXRECURSION 1000);
            `);

        // Check if there are any employees in the hierarchy
        if (result.recordset.length === 0) {
            console.log(`No employees found under leader email: ${leader_email}`);
            return res.status(404).json({ message: 'No employees found under this leader' });
        }

        // Transform the result into a nested format for the frontend
        const createHierarchyTree = (employees, leaderEmail) => {
            const tree = [];
            employees.forEach(emp => {
                if (emp.leader_email === leaderEmail) {
                    const children = createHierarchyTree(employees, emp.email_surgical);
                    tree.push({ email: emp.email_surgical, name: emp.name, children });
                }
            });
            return tree;
        };

        const hierarchyTree = createHierarchyTree(result.recordset, leader_email);

        res.json(hierarchyTree); // Return the nested hierarchy
    } catch (err) {
        console.error(`Error fetching hierarchy for leader email ${leader_email}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
