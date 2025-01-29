import React, { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/icons-material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const EmployeeHierarchy = ({ leaderEmail }) => {
    const [hierarchy, setHierarchy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                const response = await axios.get(`/employees_graph/${leaderEmail}`);
                setHierarchy(response.data);
                setError('');
            } catch (err) {
                setError('Failed to load employee hierarchy');
                console.error('Error fetching hierarchy:', err);
            } finally {
                setLoading(false);
            }
        };

        if (leaderEmail) {
            fetchHierarchy();
        }
    }, [leaderEmail]);

    const handleToggle = (email) => {
        setExpanded(prev => ({ ...prev, [email]: !prev[email] }));
    };

    const renderTree = (nodes) => (
        <List component="div" disablePadding>
            {nodes.map((node) => (
                <React.Fragment key={node.email}>
                    <ListItemButton
                        onClick={() => handleToggle(node.email)}
                        sx={{ pl: node.depth * 4 || 2 }}
                    >
                        <Avatar
                            alt={node.name}
                            src={`/employee-photos/${node.email.split('@')[0]}.jpeg`}
                            sx={{ width: 32, height: 32, marginRight: 2 }}
                        >
                            {node.name.charAt(0)}
                        </Avatar>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700 }}>
                                    {node.name}
                                </Typography>
                            }
                            secondary={
                                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, color: 'text.secondary' }}>
                                    {node.email}
                                </Typography>
                            }
                        />
                        {node.children?.length && (
                            expanded[node.email] ? <ExpandLess /> : <ExpandMore />
                        )}
                    </ListItemButton>
                    {node.children && (
                        <Collapse in={expanded[node.email]} timeout="auto" unmountOnExit>
                            {renderTree(node.children)}
                        </Collapse>
                    )}
                </React.Fragment>
            ))}
        </List>
    );

    if (loading) return <div>Loading hierarchy...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 800,
                bgcolor: 'background.paper',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                padding: '1rem'
            }}
            aria-labelledby="employee-hierarchy-list"
        >
            {hierarchy.length > 0 ? (
                renderTree(hierarchy)
            ) : (
                <ListItemText primary="No employees found in this hierarchy" />
            )}
        </List>
    );
};

export default EmployeeHierarchy;