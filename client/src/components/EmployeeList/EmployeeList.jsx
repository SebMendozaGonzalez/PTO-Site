import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Divider from '@mui/material/Divider';
import { Avatar, Typography, TextField } from '@mui/material';
import EmployeeProfile from '../EmployeeProfile/EmployeeProfile';
import './EmployeeList.css';

function EmployeeList({ filterLeaderEmail, onEmployeeSelect, onEditClick, onDeleteClick, onAddClick, hasPermissions, onLicenseClick }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            setEmployees([]);
            setError('');

            try {
                // Fetch employees by leader email
                const response = filterLeaderEmail
                    ? await axios.get(`/back/employees-by-leader/${filterLeaderEmail}`)
                    : await axios.get('/back/employee');

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
    }, [filterLeaderEmail]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredEmployees = employees
        .filter(employee =>
            employee.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(employee => employee.active === true);

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        onEmployeeSelect(employee);
    };

    return (
        <div className="employee-list-container paddings">
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
                        sx={{ width: '80%' }}
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
                                            <div className='flexCenter'>
                                                <IconButton edge="end"
                                                    aria-label="add license"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onLicenseClick(employee);
                                                    }}
                                                >
                                                    <PostAddIcon />
                                                </IconButton>
                                                {hasPermissions && (
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
                                                                onDeleteClick(employee);
                                                            }}
                                                        >
                                                            <PersonRemoveIcon />
                                                        </IconButton>
                                                    </div>
                                                )}
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
                    <EmployeeProfile selectedEmployee={selectedEmployee} />
                ) : (
                    <Typography>Select an employee to view details</Typography>
                )}
            </div>
        </div>
    );
}

export default EmployeeList;