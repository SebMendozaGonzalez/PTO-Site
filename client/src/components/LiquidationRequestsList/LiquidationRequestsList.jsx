import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemIcon } from '@mui/material';
import Dots from '../Dots/Dots';
import './LiquidationRequestsList.css';

function LiquidationRequestsList({ employee_id, onClickRequest, fromEP, HRportal, filterLeaderEmail }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            setRequests([]);
            setError('');

            try {
                if (fromEP) {
                    // Case: fromEP is true
                    const response = await axios.get(`/liquidation-requests-info/${employee_id}`);
                    setRequests(response.data);
                } else {
                    if (HRportal) {
                        // Case: fromEP is false, HRportal is true
                        const response = await axios.get('/liquidation-requests-info');
                        setRequests(response.data);
                    } else {
                        // Case: fromEP is false, HRportal is false
                        const liquidationResponse = await axios.get('/liquidation-requests-info');
                        const liquidationRequests = liquidationResponse.data;

                        const employeesResponse = await axios.get(
                            `/employees-by-leader/${filterLeaderEmail}`
                        );
                        const employeeList = employeesResponse.data;

                        const filteredRequests = liquidationRequests.filter(request =>
                            employeeList.includes(request.employee_id)
                        );

                        setRequests(filteredRequests);
                    }
                }
            } catch (err) {
                setError("An error occurred while fetching the liquidation requests.");
                console.error(err);
            }
        };

        fetchRequests();
    }, [employee_id, fromEP, HRportal, filterLeaderEmail]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    };

    return (
        <div className="paddings innerWidth liquidation-requests-list">
            <h2 className='fonts-secondary'>
                Liquidation requests:
            </h2>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#f8f9fe',
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                {error && <p style={{ color: '#1560f6' }}>{error}</p>}
                <List dense>
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <div key={request.request_id}>
                                <ListItem
                                    button
                                    /*onClick={() => onClickRequest(request)}*/
                                    secondaryAction={
                                        <ListItemIcon edge="end">
                                            <div>
                                                <Dots requestDetails={request} />
                                            </div>
                                        </ListItemIcon>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <p className="fonts-primary">
                                                {request.name} | {request.department || 'N/A'}
                                            </p>
                                        }
                                        secondary={
                                            <div className="flexColStart">
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Days:</strong> {request.days}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Request Date:</strong>{' '}
                                                    {formatDate(request.request_date)}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Decision Date:</strong>{' '}
                                                    {request.decision_date ? formatDate(request.decision_date) : 'Pending'}
                                                </span>
                                            </div>
                                        }
                                    />
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Searching for requests...</p>
                    )}
                </List>
                <span>Not seeing a particular liquidation request in here? Refresh the page! They may take a little to appear.</span>
            </Box>
        </div>
    );
}

export default LiquidationRequestsList;
