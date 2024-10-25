import React, { useEffect, useState } from 'react';
import axios from 'axios';

function RequestsList({ employee_id }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            // Clear previous requests and error before fetching new data
            setRequests([]);
            setError('');

            try {
                const response = await axios.get(`/requests-info/${employee_id}`);
                if (response.data.length > 0) {
                    setRequests(response.data);
                } else {
                    setError('No requests found for this employee.');
                }
            } catch (err) {
                setError('Failed to fetch requests');
                console.error(err);
            }
        };

        if (employee_id) {
            fetchRequests();
        }
    }, [employee_id]);

    return (
        <div className='requests-list paddings innerWidth'>
            <h2>Requests for Employee ID: {employee_id}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {requests.length > 0 ? (
                <ul>
                    {requests.map(request => (
                        <li key={request.request_id}>
                            <p><strong>Type:</strong> {request.type}</p>
                            <p><strong>Status:</strong> {request.accepted ? 'Accepted' : 'Pending'}</p>
                            <p><strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(request.end_date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                !error && <p>Searching for requests...</p>
            )}
        </div>
    );
}

export default RequestsList;
