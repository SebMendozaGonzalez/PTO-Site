const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch the hierarchical management graph of employees under a specific leader
router.get('/:leader_email', async (req, res) => {
    const { leader_email } = req.params;

    try {
        const pool = await connectToDatabase();

        // Query to get the hierarchical management graph with optimized recursion
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
                SELECT email_surgical, name, leader_email
                FROM RecursiveHierarchy
                OPTION (MAXRECURSION 1000);
            `);

        if (result.recordset.length === 0) {
            console.log(`No employees found under leader email: ${leader_email}`);
            return res.status(404).json({ message: 'No employees found under this leader' });
        }

        // Optimized tree creation using map-based approach
        const createHierarchyTree = (employees, leaderEmail) => {
            const employeeMap = new Map();

            // Create a map of employees
            employees.forEach(emp => {
                employeeMap.set(emp.email_surgical, { ...emp, children: [] });
            });

            const tree = [];
            employees.forEach(emp => {
                if (emp.leader_email === leaderEmail) {
                    tree.push(employeeMap.get(emp.email_surgical));
                } else if (employeeMap.has(emp.leader_email)) {
                    employeeMap.get(emp.leader_email).children.push(employeeMap.get(emp.email_surgical));
                }
            });

            return tree;
        };

        const hierarchyTree = createHierarchyTree(result.recordset, leader_email);

        res.json(hierarchyTree); // Return the nested hierarchy
    } catch (err) {
        console.error(`Error fetching hierarchy for leader email ${leader_email}:`, {
            error: err.message,
            stack: err.stack,
        });
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
