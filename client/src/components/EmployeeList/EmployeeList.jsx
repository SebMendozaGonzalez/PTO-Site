import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Divider from '@mui/material/Divider';
import { Avatar, Typography, TextField } from '@mui/material';
import './EmployeeList.css';

function EmployeeList({ filterLeaderEmail, onEmployeeSelect, onEditClick, onDeleteClick, onAddClick, hasPermissions }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredEmployees = employees
        .filter(employee =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(employee =>
            filterLeaderEmail
                ? employee.leader_email?.toLowerCase().includes(filterLeaderEmail.toLowerCase())
                : true
        )
        .filter(employee =>
            employee.active === true
        );


    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        onEmployeeSelect(employee); // Pass selected employee to parent
    };

    return (
        <div className="employee-list-container paddings" style={{ paddingBottom: "2rem" }}>
            <div className="employee-list">

                <Box
                    className="search-bar-container"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        bgcolor: '#f8f9fe',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                    }}
                >
                    <TextField
                        label="Search Employee"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ width: '70%' }}
                    />
                    {hasPermissions && (
                        <IconButton aria-label="add employee" onClick={onAddClick}>
                            <PersonAddIcon />
                        </IconButton>
                    )}
                </Box>


                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        bgcolor: '#f8f9fe',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        overflowY: 'auto',
                    }}
                    className="paddings"
                >
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <List dense>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map(employee => (
                                <div key={employee.employee_id}>
                                    <ListItem
                                        button
                                        onClick={() => handleSelectEmployee(employee)}
                                        secondaryAction={
                                            hasPermissions && (
                                                <div>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditClick(employee);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="remove"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteClick(employee); // Trigger delete on click
                                                        }}
                                                    >
                                                        <PersonRemoveIcon />
                                                    </IconButton>
                                                </div>
                                            )
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
                                            primary={
                                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)' }}>
                                                    {employee.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, color: 'var(--small)' }}>
                                                    {employee.employee_id}
                                                </Typography>
                                            }
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
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                        className="paddings"
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                            <Avatar
                                alt={selectedEmployee.name}
                                src={`/employee-photos/${selectedEmployee.employee_id}.jpeg`}
                                sx={{ width: 100, height: 100 }}
                            />
                            <Box>
                                <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)' }}>
                                    {selectedEmployee.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" sx={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                                    {selectedEmployee.employee_id}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                            <Box>
                                <Typography variant="h6" color="primary" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                                    Contact Info
                                </Typography>
                                <Typography> <strong className='fonts-primary'>Email:</strong> {selectedEmployee.email_surgical}</Typography>
                                <Typography> <strong className='fonts-primary'>Phone:</strong> {selectedEmployee.phone_number}</Typography>
                                <Typography> <strong className='fonts-primary'>Address:</strong> {selectedEmployee.home_address}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6" color="primary" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                                    Company Info
                                </Typography>
                                <Typography> <strong className='fonts-primary'>Company:</strong> {selectedEmployee.company}</Typography>
                                <Typography> <strong className='fonts-primary'>Department:</strong> {selectedEmployee.department}</Typography>
                                <Typography> <strong className='fonts-primary'>Leader:</strong> {selectedEmployee.leader}</Typography>
                            </Box>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="h6" color="primary" sx={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--secondary)' }}>
                                Emergency Contact
                            </Typography>
                            <Typography> <strong className='fonts-primary'>Contact:</strong>  {selectedEmployee.emergency_contact}</Typography>
                            <Typography> <strong className='fonts-primary'>Name:</strong>  {selectedEmployee.emergency_name}</Typography>
                            <Typography> <strong className='fonts-primary'>Phone:</strong> {selectedEmployee.emergency_phone}</Typography>
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
