import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './EmployeesOffList.css';

function EmployeesOffList() {
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
            const response = await axios.get('/api/employees-off', {
                params: { date: formatDate(date) },
            });
            if (response.data.length > 0) {
                setEmployeesOff(response.data);
            } else {
                setError('No employees off on the selected date.');
            }
        } catch (err) {
            setError('Failed to fetch employees off.');
            console.error(err);
        }
    }, []);

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
                            employeesOff.map((employee) => (
                                <div key={employee.request_id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={<p className="fonts-primary">{employee.name}</p>}
                                            secondary={
                                                <div className="textico-normal">
                                                    <span>Type: {employee.type}</span>
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
