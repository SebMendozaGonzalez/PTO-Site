import React, { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmployeeClockInfo from '../../components/EmployeeClockInfo/EmployeeClockInfo';

const EmployeeHierarchy = ({ leaderEmail }) => {
    const [hierarchy, setHierarchy] = useState([]);
    const [openNodes, setOpenNodes] = useState({});

    useEffect(() => {
        // Fetch the hierarchy data from the API
        const fetchHierarchy = async () => {
            try {
                const response = await fetch(`/employees-by-leader/${leaderEmail}`);
                const data = await response.json();
                setHierarchy(data);
            } catch (error) {
                console.error('Error fetching employee hierarchy:', error);
            }
        };

        fetchHierarchy();
    }, [leaderEmail]);

    const handleToggle = (email) => {
        setOpenNodes((prevOpenNodes) => ({
            ...prevOpenNodes,
            [email]: !prevOpenNodes[email]
        }));
    };

    const renderHierarchy = (employees) => {
        return (
            <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {employees.map((employee) => (
                    <div key={employee.email}>
                        <ListItemButton onClick={() => handleToggle(employee.email)}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={employee.name} />
                            {employee.children.length > 0 && (openNodes[employee.email] ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        <EmployeeClockInfo employee={employee} />
                        {employee.children.length > 0 && (
                            <Collapse in={openNodes[employee.email]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding sx={{ pl: 4 }}>
                                    {renderHierarchy(employee.children)}
                                </List>
                            </Collapse>
                        )}
                    </div>
                ))}
            </List>
        );
    };

    return (
        <div>
            <span>Employee Hierarchy</span>
            {renderHierarchy(hierarchy)}
        </div>
    );
};

export default EmployeeHierarchy;
