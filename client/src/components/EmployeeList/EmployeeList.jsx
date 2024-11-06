import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import './EmployeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            setEmployees([]);
            setError('');
            try {
                const response = await axios.get('/employees-info');
                if (response.data.length > 0) {
                    setEmployees(response.data);
                } else {
                    setError('No employees found.');
                }
            } catch (err) {
                setError('Failed to fetch employees');
                console.error(err);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className='paddings innerWidth employee-list'>
            <Box sx={{ width: '100%', bgcolor: '#f8f9fe', padding: 2, borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <List dense>
                    {employees.length > 0 ? (
                        employees.map(employee => (
                            <div key={employee.employee_id}>
                                <ListItem>
                                    <ListItemText
                                        primary={<p className='fonts-primary'>{employee.name}</p>}
                                        secondary={<span className='textico-normal'>Employee ID: {employee.employee_id}</span>}
                                    />
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Loading employees...</p>
                    )}
                </List>
            </Box>
        </div>
    );
}

export default EmployeeList;
