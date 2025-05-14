const requestService = require('./service');

// Controller function to fetch all requests
// Controller function to fetch all requests
const getAllRequests = async (req, res) => {
    const us_team = req.query.us_team !== undefined ? parseInt(req.query.us_team) : 0;
    const col_team = req.query.col_team !== undefined ? parseInt(req.query.col_team) : 1;

    try {
        const requests = await requestService.fetchAllRequests(us_team, col_team);
        res.json(requests);
    } catch (err) {
        console.error('Error fetching all requests:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Controller function to fetch requests for a specific employee
const getRequestsByEmployeeId = async (req, res) => {
    const { employee_id } = req.params;// Default to 0 if not provided

    try {
        const requests = await requestService.fetchRequestsByEmployeeId(employee_id);

        if (requests.length === 0) {
            console.log(`No request data found for employee ID: ${employee_id}`);
            return res.status(404).json({ message: 'No request data found for this employee' });
        }

        res.json(requests);
    } catch (err) {
        console.error(`Error fetching request data for employee ID ${employee_id}:`, err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Controller function to handle creating a new vacation request
const createRequest = async (req, res) => {
    const {
        type,
        start_date,
        end_date,
        explanation,
        employee_id,
        is_exception,
        name,
        leader_email,
        department, // Default to 0 if not provided
        us_team = 0,
        col_team = 1
    } = req.body;

    console.log('Incoming request data:', {
        type,
        start_date,
        end_date,
        explanation,
        employee_id,
        is_exception,
        name,
        leader_email,
        department,
        us_team,
        col_team
    });

    try {
        const newRequest = await requestService.insertRequest({
            type,
            start_date,
            end_date,
            explanation,
            employee_id,
            is_exception,
            name,
            leader_email,
            department,
            us_team,
            col_team
        });

        res.status(201).json(newRequest);
    } catch (err) {
        console.error('Error creating request:', err);
        res.status(500).json({ message: 'Error creating request', error: err.message });
    }
};



// Controller function to handle decisions on vacation requests
const decideRequest = async (req, res) => {
    const { request_id, accepted, rejection_reason, decided_by } = req.body;

    // Validate the required fields
    if (!decided_by) {
        return res.status(400).json({ message: 'The decided_by field is required.' });
    }

    console.log('Decide request route hit with data:', { request_id, accepted, rejection_reason, decided_by });

    try {
        const updatedRequest = await requestService.updateRequestDecision({
            request_id,
            accepted,
            rejection_reason,
            decided_by,
        });

        if (!updatedRequest) {
            console.log(`No record found after update for request ID: ${request_id}`);
            return res.status(404).json({ message: 'No updated request found' });
        }

        res.status(200).json(updatedRequest);
    } catch (err) {
        console.error('Error updating request:', err);
        res.status(500).json({ message: 'Error updating request', error: err.message });
    }
};


// Controller function to cancel a vacation request
const cancelRequest = async (req, res) => {
    const { request_id } = req.params; // Retrieve request_id from URL parameter

    console.log('Cancel request route hit with request ID:', request_id);

    try {
        const cancelledRequest = await requestService.cancelRequestById(request_id);

        if (!cancelledRequest) {
            console.log(`No record found for request ID: ${request_id}`);
            return res.status(404).json({ message: 'No request found to cancel' });
        }

        res.status(200).json(cancelledRequest);
    } catch (err) {
        console.error('Error canceling request:', err);
        res.status(500).json({ message: 'Error canceling request', error: err.message });
    }
};

module.exports = {
    getAllRequests,
    getRequestsByEmployeeId,
    createRequest,
    decideRequest,
    cancelRequest,
};

