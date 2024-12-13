import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { ListItemIcon, FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText as MuiListItemText } from '@mui/material';
import Dots from '../Dots/Dots';
import './LiquidationRequestsListMP.css';

function LiquidationRequestsListMP({ employee_id, onClickRequest, HRportal, filterLeaderEmail }) {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [decidedFilter, setDecidedFilter] = useState('all');
    const [acceptedFilter, setAcceptedFilter] = useState('all');
    const [employeeFilter, setEmployeeFilter] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            setRequests([]);
            setError('');

            try {
                let fetchedRequests;
                if (HRportal) {
                    const response = await axios.get('/liquidation-requests-info');
                    fetchedRequests = response.data;
                } else {
                    const liquidationResponse = await axios.get('/liquidation-requests-info');
                    const liquidationRequests = liquidationResponse.data;

                    const employeesResponse = await axios.get(`/employees-by-leader/${filterLeaderEmail}`);
                    const employeeList = employeesResponse.data.map(employee => employee.employee_id);

                    fetchedRequests = liquidationRequests.filter(request =>
                        employeeList.includes(request.employee_id)
                    );
                }

                setRequests(fetchedRequests);

                // Extract unique employee names for the dropdown
                const uniqueNames = [...new Set(fetchedRequests.map(request => request.name))];
                setEmployeeOptions(uniqueNames);
            } catch (err) {
                setError("An error occurred while fetching the liquidation requests.");
                console.error(err);
            }
        };

        fetchRequests();
    }, [employee_id, HRportal, filterLeaderEmail]);

    useEffect(() => {
        // Filter requests based on filters
        const filtered = requests.filter(request => {
            const decidedMatch = decidedFilter === 'all' || request.decided === (decidedFilter === 'true');
            const acceptedMatch = acceptedFilter === 'all' || request.accepted === (acceptedFilter === 'true');
            const employeeMatch = employeeFilter.length === 0 || employeeFilter.includes(request.name);

            return decidedMatch && acceptedMatch && employeeMatch;
        });

        setFilteredRequests(filtered);
    }, [decidedFilter, acceptedFilter, employeeFilter, requests]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    };

    return (
        <div className="paddings innerWidth liquidation-requests-list">
            <h2 className='fonts-secondary'>
                Liquidation requests:
            </h2>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: '#f8f9fe',
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                {error && <p style={{ color: '#1560f6' }}>{error}</p>}

                {/* Filters */}
                <div className="filters">
                    <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                        <InputLabel>Decided</InputLabel>
                        <Select
                            value={decidedFilter}
                            onChange={(e) => setDecidedFilter(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="true">Decided</MenuItem>
                            <MenuItem value="false">Not Decided</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                        <InputLabel>Accepted</InputLabel>
                        <Select
                            value={acceptedFilter}
                            onChange={(e) => setAcceptedFilter(e.target.value)}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="true">Accepted</MenuItem>
                            <MenuItem value="false">Rejected</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Employee</InputLabel>
                        <Select
                            multiple
                            value={employeeFilter}
                            onChange={(e) => setEmployeeFilter(e.target.value)}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {employeeOptions.map(name => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={employeeFilter.includes(name)} />
                                    <MuiListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <List dense>
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map(request => (
                            <div key={request.request_id}>
                                <ListItem
                                    button
                                    onClick={() => onClickRequest(request)}
                                    secondaryAction={
                                        <ListItemIcon edge="end">
                                            <div>
                                                <Dots requestDetails={request} />
                                            </div>
                                        </ListItemIcon>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <p className="fonts-primary">
                                                {request.name} | {request.department || 'N/A'}
                                            </p>
                                        }
                                        secondary={
                                            <div className="flexColStart">
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Days:</strong> {request.days}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Request Date:</strong>{' '}
                                                    {formatDate(request.request_date)}
                                                </span>
                                                <span className="textico-normal">
                                                    <strong className="fonts-secondary sub">Decision Date:</strong>{' '}
                                                    {request.decision_date ? formatDate(request.decision_date) : 'Pending'}
                                                </span>
                                            </div>
                                        }
                                    />
                                </ListItem>
                                <Divider style={{ backgroundColor: '#444444' }} />
                            </div>
                        ))
                    ) : (
                        !error && <p style={{ color: '#b6b6b6' }}>Searching for requests...</p>
                    )}
                </List>
                <span>Not seeing a particular liquidation request in here? Refresh the page! They may take a little to appear.</span>
            </Box>
        </div>
    );
}

export default LiquidationRequestsListMP;
