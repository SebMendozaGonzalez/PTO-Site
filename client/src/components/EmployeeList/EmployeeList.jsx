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
                                            secondary={<span className="textico-normal">{employee.employee_id}</span>}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                alt={selectedEmployee.name}
                                src={`/employee-photos/${selectedEmployee.employee_id}.jpeg`}
                                sx={{ width: 80, height: 80 }}
                            />
                            <Box>
                                <h2>{selectedEmployee.name}</h2>
                                <p>{selectedEmployee.position}</p>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                                <h4>Contact Info</h4>
                                <p>Email: {selectedEmployee.email}</p>
                                <p>Phone: {selectedEmployee.phone_number}</p>
                                <p>Address: {selectedEmployee.home_address}</p>
                            </Box>

                            <Box>
                                <h4>Company Info</h4>
                                <p>Company: {selectedEmployee.company}</p>
                                <p>Department: {selectedEmployee.department}</p>
                                <p>Leader: {selectedEmployee.leader}</p>
                            </Box>

                            <Box>
                                <h4>Emergency Contact</h4>
                                <p>Contact: {selectedEmployee.emergency_contact}</p>
                                <p>Name: {selectedEmployee.emergency_name}</p>
                                <p>Phone: {selectedEmployee.emergency_phone}</p>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <p>Select an employee to view details</p>
                )}
            </div>
        </div>
    );
}

export default EmployeeList;
