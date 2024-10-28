import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import './RequestsList.css';

function RequestsList({ employee_id, onClickRequest }) {
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
        <div className='paddings innerWidth requests-list'>
            <Box sx={{ width: '100%', bgcolor: '#f8f9fa', padding: 2, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <List dense>
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <div key={request.request_id}>
                                <ListItem button onClick={() => onClickRequest(request)}>
                                    <ListItemText
                                        primary={<p className='fonts-primary'>{request.type}</p>}
                                        secondary={
                                            <div className='flexColStart'>
                                                <span className='textico-normal'> <strong className='fonts-secondary sub'>Start Date:</strong> {new Date(request.start_date).toLocaleDateString()} </span>
                                                <span className='textico-normal'> <strong className='fonts-secondary sub'>End Date:</strong> {new Date(request.end_date).toLocaleDateString()} </span>
                                            </div>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <div className="dots-container" style={{ display: 'flex' }}>
                                            <div className={`dot ${request.decided ? (request.accepted ? 'green' : 'red') : 'grey'}`}></div>
                                            <div className={`dot ${request.taken ? 'green' : (request.cancelled ? 'red' : 'grey')}`}></div>
                                        </div>
                                    </ListItemSecondaryAction>
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
