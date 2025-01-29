import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar,
    Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EmployeeClockInfo from '../../components/EmployeeClockInfo/EmployeeClockInfo';

function EmployeeHierarchy({ filterLeaderEmail }) {
    const [employees, setEmployees] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [error, setError] = useState('');
    const [debouncedEmail, setDebouncedEmail] = useState(filterLeaderEmail);

    // Debounce effect to wait 500ms before fetching
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedEmail(filterLeaderEmail);
        }, 500);

        return () => clearTimeout(delay);
    }, [filterLeaderEmail]);

    useEffect(() => {
        if (!debouncedEmail) {
            setEmployees([]);
            setError('');
            return;
        }

        const fetchHierarchy = async () => {
            try {
                const response = await axios.get(`/back/employees-by-leader/${debouncedEmail}`);
                setEmployees(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching employee hierarchy:', error);
                setError('No employees found for this email.');
                setEmployees([]);
            }
        };

        fetchHierarchy();
    }, [debouncedEmail]);

    // Toggle expand/collapse for a leader
    const handleToggle = (email) => {
        setExpanded((prev) => ({ ...prev, [email]: !prev[email] }));
    };

    // Recursive function to render employees as a nested list
    const renderEmployees = (employeeList, level = 0) => (
        <List component="nav" disablePadding>
            {employeeList.map((employee) => {
                const children = Array.isArray(employee.children) ? employee.children : []; // Ensure children is an array

                return (
                    <div key={employee.email}>
                        <ListItemButton onClick={() => handleToggle(employee.email)} sx={{ pl: 2 + level * 2 }}>
                            <ListItemIcon>
                                <Avatar sx={{ width: 32, height: 32 }}>{employee.name.charAt(0)}</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={employee.name} secondary={employee.email} />
                            {children.length > 0 && (expanded[employee.email] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>

                        {/* EmployeeClockInfo component */}
                        <EmployeeClockInfo employee={employee} />

                        {/* Render children recursively */}
                        <Collapse in={expanded[employee.email]} timeout="auto" unmountOnExit>
                            {renderEmployees(children, level + 1)}
                        </Collapse>
                    </div>
                );
            })}
        </List>
    );

    return (
        <div>
            <h2>Employee Hierarchy</h2>
            {error ? <Typography color="error">{error}</Typography> : renderEmployees(employees)}
        </div>
    );
}

export default EmployeeHierarchy;
