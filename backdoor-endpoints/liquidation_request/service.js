const { connectToDatabase } = require('../../db/dbConfig');

// Service to fetch all liquidation requests
const fetchAllLiquidationRequests = async () => {
    const pool = await connectToDatabase();
    const result = await pool.query('SELECT * FROM liquidation_request ORDER BY employee_id DESC');
    return result.recordset;
};

// Service to fetch liquidation requests for a specific employee
const fetchLiquidationRequestsByEmployee = async (employee_id) => {
    const pool = await connectToDatabase();
    const result = await pool.request()
        .input('employee_id', employee_id)
        .query(`
            SELECT * 
            FROM liquidation_request 
            WHERE employee_id = @employee_id
        `);
    return result.recordset;
};


// Service to handle inserting a new liquidation request
const insertLiquidationRequest = async (data) => {
    const { employee_id, name, leader_email, days, department, explanation } = data;

    const pool = await connectToDatabase();
    const request = pool.request();

    // Add parameters for the SQL query
    request.input('employee_id', employee_id);
    request.input('name', name || null); // Optional field
    request.input('leader_email', leader_email || null); // Optional field
    request.input('days', days || 0); // Default to 0 if not provided
    request.input('department', department || null); // Optional field
    request.input('explanation', explanation || null); // Optional field

    // Insert the new liquidation request
    await request.query(
        `INSERT INTO liquidation_request (
            employee_id, 
            name, 
            leader_email, 
            days, 
            department, 
            explanation, 
            request_date
         )
         VALUES (
            @employee_id, 
            @name, 
            @leader_email, 
            @days, 
            @department, 
            @explanation, 
            CURRENT_TIMESTAMP
         )`
    );

    // Retrieve the last inserted row for the given employee
    const result = await request.query(
        `SELECT * FROM liquidation_request 
         WHERE employee_id = @employee_id 
         ORDER BY request_date DESC 
         OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY`
    );

    return result.recordset[0];
};


// Service to handle updating the decision on a liquidation request
const updateDecision = async ({ request_id, accepted, rejection_reason, decided_by }) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Parameterize inputs
    request.input('request_id', request_id);
    request.input('accepted', accepted === 'true'); // Convert to boolean
    request.input('decided_by', decided_by);

    let updateQuery = `
        UPDATE liquidation_request 
        SET decided = 1, 
            accepted = @accepted, 
            decision_date = CURRENT_TIMESTAMP, 
            decided_by = @decided_by
    `;

    // Append rejection_reason if the request is being rejected
    if (accepted === 'false') {
        request.input('rejection_reason', rejection_reason);
        updateQuery += `, rejection_reason = @rejection_reason`;
    }

    // Complete the query with the WHERE clause
    updateQuery += ` WHERE request_id = @request_id;`;

    // Execute the update query
    await request.query(updateQuery);

    // Retrieve and return the updated record
    const result = await request.query(`
        SELECT * 
        FROM liquidation_request
        WHERE request_id = @request_id 
        ORDER BY decision_date DESC 
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
    `);

    return result.recordset[0];
};


// Service to handle the cancellation of a liquidation request
const cancelRequest = async (request_id) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Parameterize the input
    request.input('request_id', request_id);

    // Update the `cancelled` column and set the `cancel_date`
    const updateQuery = `
        UPDATE liquidation_request
        SET cancelled = 1, cancel_date = CURRENT_TIMESTAMP
        WHERE request_id = @request_id;
    `;

    await request.query(updateQuery);

    // Retrieve and return the updated record
    const result = await request.query(`
        SELECT * 
        FROM liquidation_request
        WHERE request_id = @request_id 
        ORDER BY decision_date DESC 
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
    `);

    return result.recordset[0] || null;
};

module.exports = {
    fetchAllLiquidationRequests,
    fetchLiquidationRequestsByEmployee,
    insertLiquidationRequest,
    updateDecision,
    cancelRequest,
};
