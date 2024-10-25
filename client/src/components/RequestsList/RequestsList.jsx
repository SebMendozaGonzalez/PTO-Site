import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

function RequestsList({ employee_id }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
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
        <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', padding: 2 }}>
            <h2>Requests for Employee ID: {employee_id}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List>
                {requests.length > 0 ? (
                    requests.map(request => (
                        <div key={request.request_id}>
                            <ListItem>
                                <ListItemText
                                    primary={`Type: ${request.type}`}
                                    secondary={
                                        <>
                                            <strong>Status:</strong> {request.accepted ? 'Accepted' : 'Pending'}<br />
                                            <strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}<br />
                                            <strong>End Date:</strong> {new Date(request.end_date).toLocaleDateString()}
                                        </>
                                    }
                                />
                                {request.accepted ? <InboxIcon color="success" /> : <WarningAmberIcon color="warning" />}
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                ) : (
                    !error && <p>Searching for requests...</p>
                )}
            </List>
        </Box>
    );
}

export default RequestsList;
