import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import './RequestsList.css';

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
        <div className='paddings innerWidth'>
            <Box sx={{ width: '100%', bgcolor: '#2b2a2a', padding: 2, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <h2 style={{ color: '#ffffff' }}>Requests for Employee ID: {employee_id}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <List>
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <div key={request.request_id}>
                                <ListItem>
                                    <ListItemText
                                        primary={<span style={{ color: '#ffffff' }}>Type: {request.type}</span>}
                                        secondary={
                                            <div style={{ color: '#b6b6b6' }}>
                                                <strong>Status:</strong> {request.accepted ? 'Accepted' : 'Pending'}<br />
                                                <strong>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()}<br />
                                                <strong>End Date:</strong> {new Date(request.end_date).toLocaleDateString()}
                                            </div>
                                        }
                                    />
                                    {request.accepted ? <InboxIcon color="success" /> : <WarningAmberIcon color="warning" />}
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Searching for requests...</p>
                    )}
                </List>
            </Box>
        </div>
    );
}

export default RequestsList;

