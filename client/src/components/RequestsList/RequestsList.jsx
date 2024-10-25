import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import RequestView from '../RequestView/RequestView'; // Make sure the path is correct
import './RequestsList.css';

function RequestsList({ employee_id }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [requestDetails, setRequestDetails] = useState(null); // State for the request details

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

    const handleRequestClick = (request) => {
        setRequestDetails(request); // Set the clicked request details
    };

    const closePopup = () => {
        setRequestDetails(null); // Close the popup
    };

    return (
        <div className='paddings innerWidth requests-list'>
            <Box sx={{ width: '100%', bgcolor: '#2b2a2a', padding: 2, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <h3 style={{ color: '#ffffff' }}>My requests</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <List dense>
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <div key={request.request_id}>
                                <ListItem button onClick={() => handleRequestClick(request)}> {/* Add onClick handler */}
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
                                    <ListItemAvatar>
                                        <Avatar>
                                            <div className="dots-container" style={{ display: 'flex', marginLeft: 'auto' }}>
                                                <div className={`dot ${request.decided ? (request.accepted ? 'green' : 'red') : 'grey'}`}></div>
                                                <div className={`dot ${request.taken ? 'green' : (request.cancelled ? 'red' : 'grey')}`}></div>
                                            </div>
                                        </Avatar>
                                    </ListItemAvatar>
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Searching for requests...</p>
                    )}
                </List>
                {requestDetails && ( // Render RequestView if requestDetails is set
                    <RequestView requestDetails={requestDetails} onClose={closePopup} onSubmitDecision={handleSubmitDecision} />
                )}
            </Box>
        </div>
    );
}

export default RequestsList;
