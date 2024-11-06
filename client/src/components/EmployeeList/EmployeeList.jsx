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
import { Avatar, Typography } from '@mui/material';
import './EmployeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
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

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <div className="employee-list-container">
            <div className="employee-list">
                <Box
                    sx={{
                        width: '100%',
                        bgcolor: '#f8f9fe',
                        padding: 2,
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        maxHeight: '40rem',
                        overflow: 'auto',
                    }}
                >
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <List dense>
                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <div key={employee.employee_id}>
                                    <ListItem
                                        button
                                        onClick={() => handleSelectEmployee(employee)}
                                        secondaryAction={
                                            <div>
                                                <IconButton edge="end" aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="remove">
                                                    <PersonRemoveIcon />
                                                </IconButton>
                                            </div>
                                        }
                                    >
                                        <Avatar
                                            alt={employee.name}
                                            src={`/employee-photos/${employee.employee_id}.jpeg`}
                                            sx={{ width: 48, height: 48, marginRight: 2 }}
                                        >
                                            {employee.name ? employee.name.charAt(0) : 'E'}
                                        </Avatar>
                                        <ListItemText
                                            primary={<p className="fonts-primary">{employee.name}</p>}
                                            secondary={<span className="fonts-regular">{employee.employee_id}</span>}
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

            <div className="profile">
                {selectedEmployee ? (
                    <Box
                        sx={{
                            width: '100%',
                            bgcolor: '#f8f9fe',
                            padding: 3,
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <Avatar
                                alt={selectedEmployee.name}
                                src={`/employee-photos/${selectedEmployee.employee_id}.jpeg`}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }} className="fonts-primary">{selectedEmployee.name}</Typography>
                                <Typography variant="subtitle1" color="text.secondary" className="fonts-regular">{selectedEmployee.employee_id}</Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                            <Box>
                                <Typography variant="h6" color="primary" className="fonts-secondary">Contact Info</Typography>
                                <Typography>Email: {selectedEmployee.email_surgical}</Typography>
                                <Typography>Phone: {selectedEmployee.phone_number}</Typography>
                                <Typography>Address: {selectedEmployee.home_address}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" color="primary" className="fonts-secondary">Company Info</Typography>
                                <Typography>Company: {selectedEmployee.company}</Typography>
                                <Typography>Department: {selectedEmployee.department}</Typography>
                                <Typography>Leader: {selectedEmployee.leader}</Typography>
                            </Box>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" color="primary" className="fonts-secondary">Emergency Contact</Typography>
                            <Typography>Contact: {selectedEmployee.emergency_contact}</Typography>
                            <Typography>Name: {selectedEmployee.emergency_name}</Typography>
                            <Typography>Phone: {selectedEmployee.emergency_phone}</Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography>Select an employee to view details</Typography>
                )}
            </div>
        </div>
    );
}

export default EmployeeList;
