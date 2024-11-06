import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Divider from '@mui/material/Divider';
import { Avatar } from '@mui/material';
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
                                <ListItem
                                    secondaryAction={
                                        <div>
                                            <IconButton edge="end" aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="person-remove">
                                                <PersonRemoveIcon />
                                            </IconButton>
                                        </div>
                                    }
                                >
                                    <Avatar
                                        alt={employee.name}
                                        src={`/employee-photos/${employee.employee_id}.jpeg`}
                                        sx={{ width: 56, height: 56, marginRight: 2 }}
                                    >
                                        {employee.name ? employee.name.charAt(0) : 'E'}
                                    </Avatar>
                                    <ListItemText
                                        primary={<p className='fonts-primary'>{employee.name}</p>}
                                        secondary={<span className='textico-normal'>{employee.employee_id}</span>}
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
