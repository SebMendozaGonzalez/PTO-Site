import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Avatar
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import EmployeeClockInfo from '../../components/EmployeeClockInfo/EmployeeClockInfo';

function EmployeeHierarchy({ leaderEmail }) {
    const [employees, setEmployees] = useState([]);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                const response = await axios.get(`/back/employees-by-leader/${leaderEmail}`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employee hierarchy:', error);
            }
        };

        fetchHierarchy();
    }, [leaderEmail]);

    // Toggle expand/collapse for a leader
    const handleToggle = (email) => {
        setExpanded((prev) => ({ ...prev, [email]: !prev[email] }));
    };

    // Recursive function to render employees as a nested list
    const renderEmployees = (employeeList, level = 0) => (
        <List component="nav" disablePadding>
            {employeeList.map((employee) => (
                <div key={employee.email}>
                    <ListItemButton onClick={() => handleToggle(employee.email)} sx={{ pl: 2 + level * 2 }}>
                        <ListItemIcon>
                            <Avatar sx={{ width: 32, height: 32 }}>{employee.name.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={employee.name} secondary={employee.email} />
                        {employee.children.length > 0 && (
                            expanded[employee.email] ? <ExpandLess /> : <ExpandMore />
                        )}
                    </ListItemButton>

                    {/* EmployeeClockInfo component */}
                    <EmployeeClockInfo employee={employee} />

                    {/* Render children recursively */}
                    <Collapse in={expanded[employee.email]} timeout="auto" unmountOnExit>
                        {renderEmployees(employee.children, level + 1)}
                    </Collapse>
                </div>
            ))}
        </List>
    );

    return (
        <div>
            <h2>Employee Hierarchy</h2>
            {renderEmployees(employees)}
        </div>
    );
}

export default EmployeeHierarchy;
