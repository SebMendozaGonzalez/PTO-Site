import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemIcon } from '@mui/material';
import Dots from '../Dots/Dots';
import './EmployeesOffList.css';

function EmployeesOffList({ filterLeaderEmail }) {
    const [employeesOff, setEmployeesOff] = useState([]);
    const [error, setError] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today

    const formatDate = (date) => date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    // Stable fetch function using useCallback
    const fetchEmployeesOff = useCallback(async (date) => {
        setEmployeesOff([]);
        setError('');
        try {
            // Fetch the employees-off data
            const response = await axios.get('/api/employees-off', {
                params: { date: formatDate(date) },
            });

            let filteredEmployees = response.data;

            // If a leader filter is applied, fetch employees reporting to that leader
            if (filterLeaderEmail) {
                const leaderResponse = await axios.get(`/api/employees-by-leader/${filterLeaderEmail}`);
                const leaderEmployeeIds = leaderResponse.data.map((employee) => employee.employee_id);

                // the employees-off data to include only those under the specified leader
                filteredEmployees = response.data.filter((employee) =>
                    leaderEmployeeIds.includes(employee.employee_id)
                );
            }

            // Update state with filtered employees or show an error if no matches
            if (filteredEmployees.length > 0) {
                setEmployeesOff(filteredEmployees);
            } else {
                setError('No employees off on the selected date or matching the leader filter.');
            }
        } catch (err) {
            setError('Failed to fetch employees off.');
            console.error(err);
        }
    }, [filterLeaderEmail]);


    useEffect(() => {
        fetchEmployeesOff(selectedDate);
    }, [selectedDate, fetchEmployeesOff]);

    const handlePreviousDay = () => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const handleNextDay = () => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    return (
        <>
            {/* Drawer Toggle Button */}
            <button
                className="drawer-toggle-btn"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
                {isDrawerOpen ? 'Close' : 'Today\'s overview'}
            </button>

            {/* Drawer Component */}
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
                <Box
                    sx={{
                        width: '100%',
                        bgcolor: '#f8f9fe',
                        padding: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        height: '100vh',
                        overflowY: 'auto',
                    }}
                >
                    <div className="drawer-header">
                        <button className="nav-btn" onClick={handlePreviousDay}>
                            &larr;
                        </button>
                        <h2>{formatDate(selectedDate)}</h2>
                        <button className="nav-btn" onClick={handleNextDay}>
                            &rarr;
                        </button>
                    </div>
                    {error && <p style={{ color: '#1560f6' }}>{error}</p>}
                    <List dense>
                        {employeesOff.length > 0 ? (
                            employeesOff.map((request) => (
                                <div key={request.request_id}>
                                    <ListItem
                                        secondaryAction={
                                            <ListItemIcon edge="end">
                                                <div>
                                                    {/* Pass the request_id directly to the Dots component */}
                                                    <Dots requestDetails={request} />
                                                </div>
                                            </ListItemIcon>
                                        }>
                                        <ListItemText
                                            primary={<p className="fonts-primary">{request.name}</p>}
                                            secondary={
                                                <div className="textico-normal">
                                                    <span>Type: {request.type}</span>
                                                    <span>From: {request.start_date} To: {request.end_date}</span>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                    <Divider style={{ backgroundColor: '#444444' }} />
                                </div>
                            ))
                        ) : (
                            !error && <p style={{ color: '#b6b6b6' }}>Loading employees off...</p>
                        )}
                    </List>

                </Box>
            </div>
        </>
    );
}

export default EmployeesOffList;
