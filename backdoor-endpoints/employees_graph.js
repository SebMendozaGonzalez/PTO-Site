const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/dbConfig');

// Route to fetch employees under a specific leader and build the hierarchy
router.get('/:leader_email', async (req, res) => {
    const { leader_email } = req.params;

    try {
        const pool = await connectToDatabase();

        // Execute the SQL query to retrieve raw hierarchical data
        const result = await pool.request()
            .input('leader_email', leader_email)
            .query(`
                WITH RecursiveEmployees AS (
                    SELECT *
                    FROM dbo.roster
                    WHERE leader_email = @leader_email
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

        // Transform the flat list into a nested hierarchy
        const createHierarchyTree = (employees, leaderEmail) => {
            const employeeMap = new Map();

            // Populate the employee map with raw data
            employees.forEach(emp => {
                employeeMap.set(emp.email_surgical, { 
                    email: emp.email_surgical, 
                    name: emp.name, 
                    children: [] 
                });
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

        // Build the hierarchy tree starting from the given leader
        const hierarchyTree = createHierarchyTree(result.recordset, leader_email);

        res.json(hierarchyTree); // Return the nested hierarchy
    } catch (err) {
        console.error(`Error fetching hierarchy for leader email ${leader_email}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
