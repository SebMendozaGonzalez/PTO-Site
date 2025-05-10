const { connectToDatabase } = require('../../db/dbConfig');

// Service function to fetch all requests
const fetchAllRequests = async (us_team = 0) => {
    const pool = await connectToDatabase();

    const result = await pool.request()
        .input('us_team', us_team)
        .query(`
            SELECT * 
            FROM request 
            WHERE us_team = @us_team
            ORDER BY employee_id DESC
        `);

    return result.recordset;
};

// Service function to fetch requests for a specific employee
const fetchRequestsByEmployeeId = async (employee_id, us_team = 0) => {
    const pool = await connectToDatabase();

    const result = await pool.request()
        .input('employee_id', employee_id)
        .input('us_team', us_team)
        .query(`
            SELECT * 
            FROM request 
            WHERE employee_id = @employee_id AND us_team = @us_team
        `);

    return result.recordset;
};



// Service function to insert a new request
const insertRequest = async ({
    type,
    start_date,
    end_date,
    explanation,
    employee_id,
    is_exception,
    name,
    leader_email,
    department,
    us_team = 0  // ✅ default to 0 if not provided
}) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    request.input('type', type);
    request.input('start_date', start_date);
    request.input('end_date', end_date);
    request.input('explanation', explanation);
    request.input('employee_id', employee_id);
    request.input('is_exception', is_exception);
    request.input('name', name);
    request.input('leader_email', leader_email);
    request.input('department', department);
    request.input('us_team', us_team);  // ✅ include in query

    await request.query(`
        INSERT INTO request (
            type, start_date, end_date, request_date,
            explanation, employee_id, is_exception,
            name, leader_email, department, us_team
        )
        VALUES (
            @type, @start_date, @end_date, CURRENT_TIMESTAMP,
            @explanation, @employee_id, @is_exception,
            @name, @leader_email, @department, @us_team
        )
    `);

    const result = await request.query(`
        SELECT * 
        FROM request 
        WHERE employee_id = @employee_id 
        ORDER BY request_date DESC 
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
    `);

    return result.recordset[0];
};



// Service function to update the decision of a request
const updateRequestDecision = async ({ request_id, accepted, rejection_reason, decided_by }) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Parameterize inputs to prevent SQL injection
    request.input('request_id', request_id);
    request.input('accepted', accepted === 'true'); // Convert to boolean
    request.input('decided_by', decided_by);

    let updateQuery = `
        UPDATE request 
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
        FROM request 
        WHERE request_id = @request_id 
        ORDER BY decision_date DESC 
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
    `);

    // Return the updated record or null if not found
    return result.recordset.length > 0 ? result.recordset[0] : null;
};


// Service function to cancel a vacation request by ID
const cancelRequestById = async (request_id) => {
    const pool = await connectToDatabase();
    const request = pool.request();

    // Parameterize the input to prevent SQL injection
    request.input('request_id', request_id);

    // Update the cancelled column
    const updateQuery = `
        UPDATE request
        SET cancelled = 1, cancel_date = CURRENT_TIMESTAMP
        WHERE request_id = @request_id;
    `;

    await request.query(updateQuery);

    // Confirm the update by fetching the updated record
    const result = await request.query(`
        SELECT * 
        FROM request 
        WHERE request_id = @request_id 
        ORDER BY decision_date DESC 
        OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY;
    `);

    // Return the updated record or null if not found
    return result.recordset.length > 0 ? result.recordset[0] : null;
};


module.exports = {
    fetchAllRequests,
    fetchRequestsByEmployeeId,
    insertRequest,
    updateRequestDecision,
    cancelRequestById
};
